<template>
  <div class="message-list">
    <no-data :visible="!list.length && isLogin" />
    <list :list="list" @item-click="itemClick" v-if="isLogin" />
    <login v-if="!isLogin" />
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import list from '@/components/user/messge-notice-list.vue';
import { IChatMessageInfo } from '@/store/modules/chat';
import { State, Getter } from 'vuex-class';
import login from '@/components/common/login/index.vue';
import mixinsSearch from '@/mixins/service/search';
import mixinsChat from '@/mixins/chat/index';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';

@Component({
  components: {
    list,
    login
  }
})
export default class Message extends Mixins(mixinsSearch, mixinsChat, mixinsSignHooks) implements ISignHooks {
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @State('chatList', { namespace: 'chat' }) chatList!: IChatMessageInfo[];
  @Prop({ type: String, default: '' }) search!: string;
  list: IChatMessageInfo[] = [];
  signIn() {
    this.$set(this, 'list', []);
  }
  signOut() {
    this.list = [];
  }
  @Watch('chatList', { immediate: true, deep: true })
  _() {
    if (!this.isLogin) return;
    this.list = [];
    setTimeout(() => {
      this.$set(this, 'list', this.chatList || []);
    }, 100);
  }
  itemClick(item: IChatMessageInfo) {
    this.mixinsItemClick(item);
  }
}
</script>
<style lang='scss'>
.message-list {
  flex: 1;
  overflow: hidden;
  .nodata-box {
    height: 100%;
  }
}
</style>
