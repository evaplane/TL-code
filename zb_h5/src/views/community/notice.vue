<template>
  <div class="message-list" v-loading="loading">
    <no-data :visible="!list.length && isLogin && !loading" />
    <list :list="returnList" @item-click="itemClick" v-if="isLogin && isShow" />
    <login v-if="!isLogin" />
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import list from '@/components/user/messge-notice-list.vue';
import { getNotify, INoticy } from '@/api/community';
import login from '@/components/common/login/index.vue';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import mixinsSearch from '@/mixins/service/search';
import { Getter, Action, State } from 'vuex-class';
import localForage from 'localforage';
import { IUser } from '@/store/modules/user';
import MixinsChat from '@/mixins/chat/index';
import { IChatUserInfo } from '@/api/chat';
import config from '@/config/index';
import { IChatMessageInfo } from '@/store/modules/chat';

interface IList {
  name: string;
  list: INoticy[];
  lastOfflineContent: string;
  historyTime: number;
  offLineCount?: number;
  index: number;
  type?: string;
  headUrl: string;
}

interface ITypeObj {
  name: string;
  avatar: string;
}

@Component({
  components: {
    list,
    login
  }
})
export default class Notice extends Mixins(mixinsSignHooks, mixinsSearch, MixinsChat) implements ISignHooks {
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @Getter('userInfo', { namespace: 'user' }) userInfo!: IUser;
  @Action('updateNewMsgSatus', { namespace: 'user' }) updateNewMsgSatus!: Function;
  @State('chatUserInfo', { namespace: 'user' }) chatUserInfo!: IChatUserInfo;
  @State('chatList', { namespace: 'chat' }) chatList!: IChatMessageInfo[];
  pageNo: number = 1;
  loading: boolean = false;
  totalNum: number = 0;
  list: IList[] = [];
  isShow: boolean = true;
  notifyList: INoticy[] = [];
  signIn() {
    this.loading = this.isLogin;
    this.getList();
  }
  signOut() {
    this.list = [];
  }
  created() {
    this.$bus.$on('notice-list-back', () => this.getList());
  }
  async getList() {
    try {
      let { notifyMap, publicNoticeNum, systemNotfyNnm, activiryCenterNum } = await getNotify<INoticy>({
        type: 1001,
        pageNo: this.pageNo,
        pageSize: 200
      });
      this.updateNewMsgSatus({ publicNoticeNum, systemNotfyNnm, activiryCenterNum });
      this.totalNum = notifyMap.totalAmount;
      this.notifyList = notifyMap.notifyList;
      this.format(notifyMap.notifyList);
      setTimeout(() => {
        this.isShow = !!this.list.length;
      }, 500);
    } catch (error) {
      console.log(error);
    }
    this.loading = false;
  }
  async checkRead(notifyList: INoticy[]) {
    let localList: INoticy[] = await localForage.getItem(`notice-${this.userInfo.userId}`);
    if (localList && localList.length && notifyList.length) {
      let oldIdList = localList.map(item => item.id);
      notifyList.forEach(item => {
        if (!oldIdList.includes(item.id)) {
          item.isUnRead = true;
        }
      });
    }
    this.format(notifyList);
  }
  format(notifyList: INoticy[]) {
    if (!notifyList.length) return;
    let obj: IObj<INoticy[]> = {};
    notifyList.map(item => {
      let key = String(item.type).substr(0, 4);
      if (obj[key]) {
        obj[key].push(item);
      } else {
        obj[key] = [item];
      }
    });
    let typeObj: IObj<ITypeObj> = {
      1000: {
        name: '__("自定义系统通知")',
        avatar: ''
      },
      1001: {
        name: '__("投票上币")',
        avatar: require('@/assets/img/community/icon-ticket.svg')
      },
      1002: {
        name: '__("法币交易")',
        avatar: require('@/assets/img/community/icon-c2c.svg')
      },
      1003: {
        name: '__("充提")',
        avatar: require('@/assets/img/community/icon-pay.svg')
      },
      1004: {
        name: '__("杠杆")',
        avatar: require('@/assets/img/community/icon-lever.svg')
      },
      1005: {
        name: '__("合伙人")',
        avatar: require('@/assets/img/community/icon-name.svg')
      },
      1006: {
        name: '__("实名认证")',
        avatar: require('@/assets/img/community/icon-name.svg')
      },
      1007: {
        name: '__("API")',
        avatar: require('@/assets/img/community/icon-pay.svg')
      },
      1008: {
        name: '__("安全设置")',
        avatar: require('@/assets/img/community/icon-safe.svg')
      },
      1009: {
        name: '__("安全卫士")',
        avatar: require('@/assets/img/community/icon-safe.svg')
      },
      1011: {
        name: '__("抵押借款")',
        avatar: require('@/assets/img/community/icon-pay.svg')
      },
      1012: {
        name: '__("C2C")',
        avatar: require('@/assets/img/community/icon-c2c.svg')
      },
      1013: {
        name: '__("O2C交易")',
        avatar: require('@/assets/img/community/icon-c2c.svg')
      },
      1014: {
        name: '__("价格提醒")',
        avatar: require('@/assets/img/community/icon-pay.svg')
      }
    };
    let list = Object.keys(obj).map((item, index) => {
      return {
        name: typeObj[String(item).substr(0, 4)].name,
        historyTime: +obj[item][0].publishTime,
        list: obj[item],
        lastOfflineContent: obj[item][0].content,
        index,
        headUrl: typeObj[String(item).substr(0, 4)].avatar
      };
    });
    this.list = list.sort((a, b) => b.historyTime - a.historyTime);
    this.list.forEach(item => {
      if (item.list.length) {
        let unRead = item.list.filter(i => !i.read);
        item.offLineCount = unRead.length;
      }
    });
    this.list.unshift({
      name: '__("在线客服")',
      historyTime: new Date().getTime(),
      lastOfflineContent: '__("您好,有任何问题可以问我")',
      type: 'customer-service',
      list: [],
      index: -1,
      headUrl: `${config.chatImg}&user_uid=${this.chatUserInfo.groupInfo.g_owner_user_uid}`,
      offLineCount: 100
    });
  }
  itemClick(item: IList) {
    if (item.type && item.type === 'customer-service') {
      return this.mixinsItemClick(
        {
          groupId: this.chatUserInfo.groupInfo.g_id,
          name: this.chatUserInfo.groupInfo.g_name
        },
        'customerServer'
      );
    }
    localStorage.setItem(`notice-list${this.userInfo.userId}`, JSON.stringify(item));
    this.notifyList && this.notifyList.length && localForage.setItem(`notice-${this.userInfo.userId}`, this.notifyList);
    this.$router.push({ name: 'notice-list' });
  }
  read(num: number) {
    this.list.forEach((item, index) => {
      if (item.index !== num) return;
      this.$set(this.list, index, { ...this.list[index], ...{ offLineCount: 0 } });
      delete item.offLineCount;
      item.list.forEach(item => {
        delete item.isUnRead;
      });
    });
  }
}
</script>
<style lang='scss'>
.message-list {
  flex: 1;
  overflow: hidden;
  color: var(--default-color);
  .nodata-box {
    height: 100%;
  }
}
</style>
