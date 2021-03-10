<template>
  <div class="serve-chat-box">
    <back :title="this.$route.query.n" @back="back" />
    <order-progress
      :order-id="this.$route.query.o"
      :order-progress-arr="mixinsOrderProgressView"
      :order-status-desc="mixinsOrderStatusDesc"
      :otc-order-deatil="mixinsOtcOrderDetail"
      v-if="this.$route.query.o"
    />
    <chat-box />
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import chatBox from '@/views/c2c/chat.vue';
import back from '@/components/index/back.vue';
import { Action, State, Getter } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import orderProgress from '@/components/c2c/order-progress.vue';
import mixinsOrder from '@/mixins/otc/order';
import { reqGetOrderById } from '@/api/otc/order';
import mixinsChat from '@/mixins/chat/index';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';

@Component({
  components: {
    chatBox,
    back,
    orderProgress
  }
})
export default class Chat extends Mixins(mixinsOrder, mixinsChat, mixinsSignHooks) implements ISignHooks {
  @Action('setChatList', { namespace: 'chat' }) setChatList!: Function;
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @Getter('chatIsLogin', { namespace: 'user' }) chatIsLogin!: boolean;
  async signIn() {
    if (this.chatIsLogin && this.$route.query.o) {
      this.init();
    }
  }
  async init() {
    let { o, n, g } = this.$route.query;
    if (o) {
      this.mixinsOtcOrderDetail = await reqGetOrderById(o as string);
      let {
        id,
        status,
        orderSourceUserId,
        merchantSourceUserId,
        merchantNickName,
        orderNickName,
        amount,
        money,
        price
      } = this.mixinsOtcOrderDetail;
      if (!n && !g && this.mixinsOtcOrderDetail) {
        let res = await this.mixinsCreateGroup({
          counterpartyToken: this.mixinsJudgeIsMerchant ? orderSourceUserId : merchantSourceUserId,
          orderId: id,
          orderAmount: amount,
          orderStatus: status,
          orderMoney: money,
          orderUnitPrice: price,
          counterpartyNickname: this.mixinsJudgeIsMerchant ? orderNickName : merchantNickName
        });
        this.mixinsItemClick(res, 'c2c');
      }
    }
  }
  signOut() {}
  back() {
    this.isLogin && this.setChatList({ groupId: this.$route.query.g, active: true, name: this.$route.query.n });
  }
}
</script>
<style lang='scss'>
.serve-chat-box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 3000;
  height: 100%;
  background: var(--default-bg);
  display: flex;
  flex-direction: column;
}
</style>
