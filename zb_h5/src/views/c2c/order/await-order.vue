<template>
  <div class="await-order-wrap">
    <app-bar title="订单详情" />
    <ctc-header-nav
      :order-id="$route.params.orderId"
      :order-progress-arr="mixinsOrderProgressView"
      :order-status-desc="mixinsOrderStatusDesc"
      :otc-order-deatil="mixinsOtcOrderDetail"
    />
    <native-scroll class="await-order-scroll">
      <div class="await-order">
        <div class="count-down">
          <icon-portrait :img-url="require('@img/c2c/c2c-await-icon.png')" size="50" v-if="mixinsJudgeTOrderStatus === 0" />
          <icon-portrait :img-url="require('@img/c2c/failed-order.png')" size="50" v-else />
          <div v-if="mixinsJudgeTOrderStatus === 0">
            <span>剩余</span>
            <span>{{ mixinsCountdownString }}</span>
          </div>
        </div>
        <p>{{ mixinsOrderStatusDesc }}</p>
        <div class="action-btns">
          <div class="action-btns-a">
            <icon-portrait
              :img-url="require('@img/c2c/icon_chat.png')"
              @click.native="$router.push({ name: 'serve-chat', query: { o: $route.params.orderId } })"
              size="37"
            />
            <icon-portrait :img-url="require('@img/c2c/icon_telephone.png')" size="37" />
          </div>
          <div class="action-btns-select">
            <otc-button
              button-type="middleCancel"
              v-if="mixinsJudgeTOrderStatus === 0 && !mixinsJudgeIsMerchant"
              :is-disabled="mixinsJudgeTOrderStatus === 0"
              text="等待商家接单"
            />
            <otc-button button-type="middleCancel" @click.native="goBack" v-if="mixinsJudgeTOrderStatus !== 0" text="返回" />
          </div>
          <div class="btn-item-second" v-if="mixinsJudgeIsMerchant && mixinsJudgeTOrderStatus === 0">
            <otc-button button-type="smallCancel" @click.native="isRejectOrder = true" text="拒绝" />
            <otc-button button-type="smallConfirm" @click.native="setOrder" text="接单" />
          </div>
        </div>
      </div>
      <div class="order-log-wrap">
        <order-log :orderLog="mixinsOrderLog" />
      </div>
    </native-scroll>
    <help-dialog
      :visible.sync="isRejectOrder"
      @confirm="rejectOrder"
      cancel-button-text="再考虑下"
      confirm-button-text="确认拒接"
      message="拒绝订单将会影响你的接单率，是否要拒绝该订单？"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import orderLog from '@/components/c2c/order-log.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import ctcHeaderNav from '@/components/c2c/order-progress.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';
// api
import { reqRejectOrder, reqSetOrder, reqGetOrderById } from '@/api/otc/order';
// mixins
import mixinsOtcOrder from '@/mixins/otc/order';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

@Component({
  components: {
    helpDialog,
    orderLog,
    iconPortrait,
    ctcHeaderNav,
    appBar,
    otcButton
  }
})
export default class AwaitOrder extends Mixins(mixinsOtcOrder, mixinsOtcGetUserToken) {
  cancelOrderVisible: boolean = false;

  isRejectOrder: boolean = false; // 拒绝二次确认

  async mounted(): Promise<void> {
    this.mixinsOtcOrderDetail = await reqGetOrderById(this.$route.params.orderId);
    this.mixinsGetOtcOrderDetail(this.$route.params.orderId);
    this.mixinsOtcOrderTimer(this.mixinsOtcOrderDetail.acceptOrderTimeOuts, this.mixinsOtcOrderDetail.orderTime);
    this.mixinsOrderLog = this.mixinsOtcOrderDetail.orderLog;
  }

  // 拒绝接单
  async rejectOrder() {
    try {
      this.cancelOrderVisible = true;
      await reqRejectOrder(this.$route.params.orderId);
    } catch (err) {
      this.$message.fail(err.resMsg.message);
    }
  }

  // 接单
  async setOrder() {
    try {
      await reqSetOrder(this.$route.params.orderId);
      this.$router.replace({ name: 'c2c-order-buyer', params: { orderId: this.$route.params.orderId } });
    } catch (e) {
      this.$message.fail(e.resMsg.message);
    }
  }

  goBack() {
    this.$router.back();
  }
}
</script>

<style lang='scss'>
.await-order-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .await-order {
    width: 100%;
    flex: 1;
    padding: 40px 24px 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .count-down {
      padding-top: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      span:first-child {
        display: inline-block;
        padding-right: 6px;
        font-size: 12px;
        font-weight: 600;
        color: #c0c3d1;
      }
      span:last-child {
        font-size: 26px;
        font-weight: 600;
        color: #455264;
        color: rgba(69, 82, 100, 1);
        line-height: 37px;
      }
    }
    p {
      font-size: 12px;
      font-weight: 600;
      color: #c0c3d1;
      padding-top: 10px;
    }
    .action-btns {
      width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 39px 0 20px 0;
      align-items: center;
      line-height: 35px;
      color: #4caf50;
      .action-btns-a {
        width: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .msg {
        font-size: 35px;
        padding: 0 10px;
      }
      .action-btns-select {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .btn-item-second {
        display: flex;
        width: 216px;
        justify-content: space-between;
      }
    }
    .order-log-wrap {
      width: 100%;
    }
  }
}
</style>
