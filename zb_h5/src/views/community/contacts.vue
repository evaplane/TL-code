<template>
  <div class="contacts-box" v-loading="loading">
    <van-index-bar :index-list="indexList" v-if="!loading && !isEmpty(list)">
      <div :key="index" v-for="(item, index) in list">
        <van-index-anchor index="1">{{ index }}</van-index-anchor>
        <van-cell :key="items.user_uid" :title="items.nickname" @click="chat(items)" v-for="items in item" />
      </div>
    </van-index-bar>
    <no-data :visible="isEmpty(list) && !loading" />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { IndexBar as vanIndexBar, IndexAnchor as vanIndexAnchor } from 'vant';
import { contactListApi, IChatUserInfo } from '@/api/chat';
import { Catch } from '@/utils/decorators';
import pinyin from 'pinyin';
import { Action, Getter, State } from 'vuex-class';
import config from '@/config/index';
import { isEmpty } from '@/utils/is';

interface IContactList {
  address: string;
  friend: string;
  friendType: string;
  initial: string;
  liveStatus: number;
  man: boolean;
  mobile: string;
  nickname: string;
  online: boolean;
  remarkname: string;
  userAvatarFileName: string;
  user_mail: string;
  user_sex: string;
  user_uid: string;
  whatsUp: string;
  wowchat_no: string;
  groupId: string;
}

@Component({
  components: {
    vanIndexAnchor,
    vanIndexBar
  }
})
export default class Contacts extends Vue {
  @Action('setChatList', { namespace: 'chat' }) setChatList!: Function;
  @Getter('chatIsLogin', { namespace: 'user' }) chatIsLogin!: boolean;
  @State('chatUserInfo', { namespace: 'user' }) chatUserInfo!: IChatUserInfo;
  list: IObj<IContactList> = {};
  indexList: string[] = [];
  loading: boolean = true;
  isEmpty = isEmpty;
  @Watch('chatIsLogin', { immediate: true })
  _(val: boolean) {
    val && this.contactListApi(this.chatUserInfo.authed_info.user_uid);
  }
  @Catch()
  async contactListApi(id: string) {
    this.list = await this.format(await contactListApi(id));
    this.loading = false;
  }
  format(arr: IContactList[]) {
    if (!arr.length) return;
    let list = arr.map((item: IContactList) => {
      let key = this.initial(item.nickname);
      return Object.assign(item, { initial: /[A-Z]/.test(key) ? key : '#' });
    });
    return this.category(list);
  }
  category(arr: IContactList[]) {
    let obj: any = {};
    let list = arr.sort((a, b) => a.initial.localeCompare(b.initial));
    list.forEach(item => {
      let key = item.initial;
      if (!key) return;
      if (!this.indexList.includes(key)) {
        this.indexList.push(key);
      }
      obj[key] = obj[key] || [];
      obj[key].push(item);
    });
    if ('#' in obj) {
      let other = obj['#'];
      delete obj['#'];
      obj = Object.assign(obj, { '#': other });
      this.indexList.push(this.indexList.splice(0, 1)[0]);
    }
    return obj;
  }

  initial(value: string) {
    let initial = pinyin(value, {
      style: pinyin.STYLE_FIRST_LETTER
    })[0][0];
    return initial.length > 1 ? initial.split('')[0].toUpperCase() : initial.toUpperCase();
  }
  chat(items: IContactList) {
    let chatObj = {
      chatType: '0',
      historyTime: new Date().getTime(),
      lastOfflineContent: '',
      userId: items.user_uid,
      groupId: items.user_uid,
      nickName: items.nickname || items.remarkname,
      userAvatarFileName: items.userAvatarFileName,
      id: items.user_uid,
      name: items.nickname || items.remarkname,
      userHead: items.userAvatarFileName
        ? `${config.chatImg}&user_uid=${items.user_uid}`
        : require('@/assets/img/chat/defaultHead.jpg'),
      mobile: items.mobile,
      offLineCount: 0,
      showCount: false
    };
    this.setChatList(chatObj);
    this.$router.push({ name: 'chat', query: { u: items.user_uid, n: items.nickname || items.remarkname, g: items.user_uid, t: '0' } });
  }
}
</script>
<style lang='scss'>
.contacts-box {
  touch-action: pan-y;
  height: calc(100% - 120px);
  .van-index-bar__index,
  .van-index-anchor {
    color: var(--theme-color);
  }
  .van-index-anchor {
    background: var(--border-color);
  }
  .van-index-bar {
    height: 100%;
    overflow-y: auto;
  }
  .van-index-anchor--sticky {
    color: var(--primary-color) !important;
    background: var(--default-bg);
    margin-top: 60px;
  }
  .nodata-box {
    height: 80vh;
  }
}
</style>
