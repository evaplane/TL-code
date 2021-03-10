<template>
  <div class="community-wrap">
    <m-header>
      <m-tabs swipeable type="card" v-model="tabActive">
        <m-tab :key="item.title" :title="item.title" :value="index" v-for="(item, index) in tabList"></m-tab>
      </m-tabs>
      <div class="header-right" slot="right">
        <div class="header-btn more-btn">
          <icon-more />
        </div>
      </div>
    </m-header>
    <tab @change="change" border dark v-model="active" v-show="tabActive === 0">
      <tab-item :class="{ 'new-msg': !item.read }" :key="key" :name="key" v-for="(item, key) in list">{{ item.name }}</tab-item>
    </tab>
    <!-- <m-search v-if="!['newsletter', 'college'].includes(active)" v-model="search" /> -->
    <slider-view />
    <transition name="van-slide-right">
      <router-view name="private" />
    </transition>
    <tab-bar />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mHeader from '@/components/index/head.vue';
import TabBar from '@/components/layout/tab-bar.vue';
import { State, Getter } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import { tab, tabItem } from '@/components/common/tab/index';
import { IChatMessageInfo } from '@/store/modules/chat';
import mixinsChat from '@/mixins/chat/index';
// import mSearch from '@/components/user/search.vue';
import sliderView from '@/components/common/slider-view/index.vue';

interface ITabList {
  title: string;
  name: string;
}
interface IList {
  [key: string]: IListItem;
}
interface IListItem {
  name: string;
  read: boolean;
}

@Component({
  components: {
    tab,
    tabItem,
    mHeader,
    TabBar,
    sliderView
  }
})
export default class CommunityIndex extends Mixins(mixinsSignHooks, mixinsChat) implements ISignHooks {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  @State('chatList', { namespace: 'chat' }) chatList!: IChatMessageInfo[];
  @State('publicNoticeNum', { namespace: 'user' }) publicNoticeNum!: number;
  @State('systemNotfyNnm', { namespace: 'user' }) systemNotfyNnm!: number;
  @State('activiryCenterNum', { namespace: 'user' }) activiryCenterNum!: number;
  @Getter('unread', { namespace: 'user' }) unread!: boolean;
  active: string = 'message-list';
  list: IList = {
    'message-list': {
      name: '__("信息")',
      read: true
    },
    notice: {
      name: '__("通知")',
      read: true
    },
    announcement: {
      name: '__("公告")',
      read: true
    },
    activity: {
      name: '__("活动")',
      read: true
    },
    news: {
      name: '__("新闻")',
      read: true
    },
    newsletter: {
      name: '__("快讯")',
      read: true
    }
  };
  tabList: ITabList[] = [
    {
      title: '__("信息")',
      name: 'community-message-list'
    },
    {
      title: '__("通讯录")',
      name: 'contacts'
    }
  ];
  search: string = '';
  tabActive: number = 0;
  transitionName: string = '';
  @Watch('tabActive')
  tabActiveChanged(num: number) {
    this.$router.push({ name: this.tabList[num].name });
  }
  @Watch('$route.name', { immediate: true })
  routerNameChange(name: string) {
    if (this.$route.name) {
      this.search = '';
      this.active = this.$route.name.replace('community-', '');
      this.tabList.find((item, index) => {
        if (item.name === name) {
          this.tabActive = index;
        }
      });
    }
  }
  @Watch('active', { immediate: true })
  activeChanged() {
    let messageHasNew = this.chatList.find((item): boolean => {
      return !!item.offLineCount;
    });
    if (messageHasNew) {
      this.list['message-list'].read = false;
    }
    // this.restUnread();
    // if (this.list[val]) {
    //   this.list[val].read = true;
    // }
  }
  @Watch('unread', { immediate: true })
  unreadChanged() {
    this.restUnread();
  }
  change(name: string) {
    this.$router.push({ name: `community-${name}` });
  }
  restUnread() {
    if (this.systemNotfyNnm) {
      this.list['notice'].read = false;
    }
    if (this.publicNoticeNum) {
      this.list['announcement'].read = false;
    }
    if (this.activiryCenterNum) {
      this.list['activity'].read = false;
    }
  }
  async signIn() {
    await this.mixinsLogin();
  }
  signOut() {}
}
</script>
<style lang='scss'>
@import '@scss/assets.scss';
.community-wrap {
  transition: all 1s;
  background: var(--default-bg);
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 12px;
  .tabs-wrap {
    .new-msg {
      position: relative;
      &:after {
        content: '';
        display: block;
        position: absolute;
        background: var(--primary-color);
        width: 4px;
        height: 4px;
        right: 2px;
        top: 4px;
        border-radius: 2px;
      }
    }
  }
  .van-search {
    padding: 4px 16px;
    border-bottom: 1px solid var(--new-theme-spacer);
  }
  .community-tab {
    @include dark {
      border-bottom: 5px solid #0f0d14;
    }
  }
}
</style>
