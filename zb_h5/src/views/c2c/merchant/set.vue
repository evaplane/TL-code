<template>
  <div class="set-wrap">
    <app-bar title="商家设置" />
    <list-switch left-text="在线状态" @change-switch="changeOnLine" :switch-value="onLineValue"></list-switch>
    <list-switch left-text="自动接单" @change-switch="changeOrder" :switch-value="getOrderValue"></list-switch>
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
// component
import listSwitch from '@/components/c2c/list-switch.vue';
import listJump from '@/components/c2c/merchant/list-jump.vue';
import appBar from '@/components/c2c/app-bar.vue';
// api
import { reqUpdateAutoOrders, reqUpdateOnlineStatus } from '@/api/otc/business-user';
// mixins
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

@Component({
  components: {
    listSwitch,
    listJump,
    appBar
  }
})
export default class Set extends Mixins(mixinsOtcGetUserToken) {
  @State('merchant', { namespace: 'merchant' }) merchant!: any;
  @Action('getMerchantInfo', { namespace: 'merchant' }) getMerchantInfo!: Function;
  getOrderValue: number = 0;
  onLineValue: number = 0;
  params: any = {
    pauseOrders: 0,
    UserId: ''
  };

  async created() {
    await this.getMerchantInfo();
    this.onLineValue = this.merchant.onlineStatus;
    this.getOrderValue = this.merchant.autoOrders;
  }

  async changeOnLine() {
    this.onLineValue = this.onLineValue === 1 ? 0 : 1;
    await reqUpdateOnlineStatus();
  }

  async changeOrder() {
    this.getOrderValue = this.getOrderValue === 1 ? 0 : 1;
    await reqUpdateAutoOrders();
  }
}
</script>

<style lang='scss'>
.set-wrap {
  flex: 1;
  height: 100%;
  background: var(--default-bg);
}
</style>
