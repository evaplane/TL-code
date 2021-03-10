<template>
  <div class="seller-box-wrap">
    <app-bar :title="`购买${mixinsOtcOrderDetail.emoneyUnit}`" />
    <ctc-header-nav
      :order-id="$route.params.orderId"
      :order-progress-arr="mixinsOrderProgressView"
      :order-status-desc="mixinsOrderStatusDesc"
      :otc-order-deatil="mixinsOtcOrderDetail"
    />
    <native-scroll class="seller-box" ref="scroll">
      <div class="midie-item">
        <div class="midie-item-top">付款方式</div>
        <div class="info-item">
          <icon-portrait
            :img-url="mixinsOtcOrderDetail.payForInfo.type ? bankListMap[`${mixinsOtcOrderDetail.payForInfo.type}`].imgUrl : '' "
            size="44"
          />
          <div class="content">
            <div class="content-info">
              <h3>{{ mixinsOtcOrderDetail.payForInfo.bankName }}</h3>
              <p>{{ mixinsOtcOrderDetail.payForInfo.realName }}</p>
              <p>{{ mixinsOtcOrderDetail.payForInfo.account }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="info-item amount">
        <label>__('付款金额'):</label>
        <h3>{{ `¥${mixinsOtcOrderDetail.price }` }}</h3>
      </div>
      <div class="midie-item">
        <div class="midie-item-top">收款方式</div>
        <div class="info-item">
          <icon-portrait
            :img-url="mixinsOtcOrderDetail.payInfo.type ? bankListMap[`${mixinsOtcOrderDetail.payInfo.type}`].imgUrl : '' "
            size="44"
          />
          <div class="content">
            <div class="content-info">
              <h3>{{ mixinsOtcOrderDetail.payInfo.bankName }}</h3>
              <p>{{ mixinsOtcOrderDetail.payInfo.realName }}</p>
              <p>{{ mixinsOtcOrderDetail.payInfo.account }}</p>
              <p v-if="this.mixinsOtcOrderDetail.payInfo.type === 1">中国支行</p>
            </div>
          </div>
        </div>
      </div>
      <div class="action-btns">
        <div class="action-btns-a">
          <icon-portrait
            :img-url="require('@img/c2c/icon_chat.png')"
            @click.native="$router.push({ name : 'serve-chat' , query : { o : $route.params.orderId }})"
            size="37"
          />
          <icon-portrait :img-url="require('@img/c2c/icon_telephone.png')" size="37" />
        </div>
        <div class="action-btns-right">
          <!--  卖家 -->
          <div
            class="btn-select"
            v-if="mixinsJudgeTradeType === mixinsSellType && mixinsJudgeTOrderStatus === 4"
          >
            <otc-button @click.native="goToAppeal(false)" button-type="smallCancel" text="申诉" />
            <otc-button @click.native="isConfirmReleaseCoin = true" button-type="smallConfirm" text="确认放币" />
          </div>
          <!--  买家 -->
          <otc-button
            button-type="middleCancel"
            @click.native="goToAppeal(true)"
            :is-disabled="mixinsCountdownString !== '00:00'"
            :text="`${mixinsCountdownString !== '00:00' ? mixinsCountdownString : ''}申诉`"
            v-if="mixinsJudgeTradeType === mixinsBuyType && mixinsJudgeTOrderStatus === 4"
          />
          <!-- 订单完成 -->
          <otc-button button-type="middleConfirm" text="查看资产" v-if="mixinsJudgeTOrderStatus === 6" />
          <!-- 处于订单申诉状态 -->
          <otc-button
            @click.native="goToAppealDetail"
            button-type="middleCancel"
            text="查看申诉"
            v-if="mixinsJudgeTOrderStatus === 5"
          />
        </div>
      </div>
      <order-log :orderLog="mixinsOrderLog" />
    </native-scroll>
    <help-dialog
      :visible.sync="isConfirmReleaseCoin"
      @confirm="confirmReleaseCoin"
      cancel-button-text="取消"
      confirm-button-text="确认放币"
      message="请登录收款账号，核实账单无误后再进行放币操作"
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
import { reqGetOrderById, reqConfirmPaidCoin } from '@/api/otc/order';
// mixins
import mixinsOtcOrder from '@/mixins/otc/order';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

interface IBankCardItem {
  imgUrl: any;
  name: string;
}

@Component({
  components: {
    orderLog,
    ctcHeaderNav,
    iconPortrait,
    appBar,
    otcButton,
    helpDialog
  }
})
export default class OrderSeller extends Mixins(mixinsOtcOrder, mixinsOtcGetUserToken) {
  isConfirmReleaseCoin: boolean = false; // 确认放币二次确认

  img: any = require('@img/logo-zb-s.png');

  bankListMap: IObj<IBankCardItem> = {
    1: {
      imgUrl: require('@img/c2c/icon_bank_card.png'),
      name: '银行卡支付'
    },
    2: {
      imgUrl: require('@img/c2c/icon_wechat.png'),
      name: '微信'
    },
    3: {
      imgUrl: require('@img/c2c/icon_alipay.png'),
      name: '支付宝'
    }
  };

  async mounted() {
    this.mixinsOtcOrderDetail = await reqGetOrderById(this.$route.params.orderId);
    this.mixinsGetOtcOrderDetail(this.$route.params.orderId);
    this.mixinsOtcOrderTimer(this.mixinsOtcOrderDetail.afterPayAppealWaitTimeOuts, this.mixinsOtcOrderDetail.confirmPayTime);
    this.mixinsOrderLog = this.mixinsOtcOrderDetail.orderLog;
  }

  async confirmReleaseCoin() {
    try {
      await reqConfirmPaidCoin(this.$route.params.orderId);
      this.$message.success('放币成功');
    } catch (err) {
    }
  }

  // 发起申诉
  goToAppeal(isCountdown: string) {
    if (isCountdown && this.mixinsCountdownString !== '00:00') return;
    this.$router.push({ name: 'c2c-sponsor', params: { orderId: this.$route.params.orderId, appealId: 'no' } });
  }

  // 跳转申诉详情
  goToAppealDetail() {
    this.$router.replace({ name: 'c2c-appeal-detail', params: { orderId: this.$route.params.orderId } });
  }
}
</script>

<style lang='scss'>
.seller-box-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .seller-box {
    flex: 1;
    .info-item {
      display: flex;
      padding: 15px 24px 15px 24px;
      background: var(--default-bg);
      line-height: 1.3;
      img {
        width: 44px;
        height: 44px;
      }
      .content {
        padding-left: 10px;
        flex: 1;
        display: flex;
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 10px;
      }
      .content-info {
        flex: 1;
        h3 {
          font-size: 16px;
          padding-bottom: 4px;
        }
      }
      p {
        font-size: 12px;
        padding-top: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #5e6c80;
      }
    }
    .midie-item {
      background: var(--default-bg);
      .midie-item-top {
        padding: 8px 0 7px 0;
        margin: 0 24px 0 24px;
        border: 1px solid var(--border-color);
        width: 100%;
        font-size: 12px;
        font-weight: 600;
        color: #5e6c80;
      }
    }
    label {
      font-size: 12px;
    }
    .amount {
      margin-top: 6px;
      margin-bottom: 6px;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      h3 {
        font-weight: 500;
        font-size: 26px;
      }
    }
    .action-btns {
      display: flex;
      justify-content: space-between;
      padding: 20px 24px;
      align-items: center;
      line-height: 35px;
      .action-btns-a {
        width: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .msg {
        font-size: 35px;
        margin-right: 8px;
      }
      .btn-select {
        display: flex;
        width: 216px;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
}
</style>
