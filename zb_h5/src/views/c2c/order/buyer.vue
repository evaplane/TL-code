<template>
  <div class="buyer-box-wrap">
    <order-header
      :judge-trade-type="mixinsJudgeTradeType"
      :mixins-count-down="mixinsCountdown"
      :order-status-desc="mixinsOrderStatusDesc"
      :otc-order-deatil="mixinsOtcOrderDetail"
      @show-order="isShowOrderDetail = true"
    />
    <native-scroll class="buyer-box-scroll">
      <div class="buy-info-wrap">
        <line-span :content="mixinsOtcOrderDetail.payInfo.realName" :is-copy="true" title="收款方账户名" />
        <line-span :content="mixinsOtcOrderDetail.payInfo.account" :is-copy="true" :title="bankCardName" />
        <line-span
          :content="mixinsOtcOrderDetail.payInfo.bankName"
          :is-copy="true"
          title="银行"
          v-show="mixinsOtcOrderDetail.payInfo.type === mixinsOrderPayBankCard"
        />
        <line-span :content="mixinsOtcOrderDetail.money" :is-copy="true" title="金额/总价（元）" />
        <line-span :border-bottom="false" :is-copy="true" content="234343" title="备注（重要）" />
        <div class="note-info-wrap">
          <span class="note-info-content">备注只能填上面信息；每条点击可单独拷贝</span>
          <div
            :data-clipboard-text="copyAllInfo"
            @click="pasteHandle"
            class="note-all-copy order-copy"
            data-clipboard-action="copy"
          >拷贝完整账户信息</div>
        </div>
      </div>
      <div class="dividing-line"></div>
      <div class="action-btns">
        <div class="action-btns-a">
          <icon-portrait
            :img-url="require('@img/c2c/icon_chat.svg')"
            @click.native="$router.push({ name : 'serve-chat' , query : { o : $route.params.orderId }})"
            size="37"
          />
          <icon-portrait :img-url="require('@img/c2c/icon_telephone.svg')" size="37" />
        </div>
        <div class="buyer" v-if="mixinsJudgeTradeType === mixinsBuyType">
          <otc-button
            @click.native="cancelOrderVisible = true"
            button-type="smallCancel"
            text="取消"
            v-if="!mixinsJudgeIsMerchant"
          />
          <otc-button @click.native="payByBuyer" button-type="smallConfirm" text="已付款" />
        </div>
        <otc-button
          :is-disabled="mixinsCountdownString !== '00:00'"
          :text="`${mixinsCountdownString !== '00:00' ? mixinsCountdownString : ''}申诉`"
          @click.native="goToAppeal"
          button-type="middleCancel"
          v-if="mixinsJudgeTradeType === mixinsSellType"
        />
        <otc-button
          button-type="middleCancel"
          text="商家确认收款中"
          v-if="mixinsOtcOrderDetail.adTradeType === mixinsCtcType && mixinsJudgeTradeType === mixinsBuyType"
        />
        <otc-button
          button-type="middleCancel"
          text="等待商家付款中"
          v-if="mixinsOtcOrderDetail.adTradeType === mixinsCtcType && mixinsJudgeTradeType === mixinsSellType"
        />
      </div>
      <order-log :orderLog="mixinsOrderLog" />
      <help-dialog
        :visible.sync="cancelOrderVisible"
        @confirm="cancelOrderHandle"
        cancel-button-text="再考虑下"
        confirm-button-text="取消订单"
        message="如您已打款给卖家，请勿取消交易！当日取消订单3次后，会限制当日OTC交易。"
      />
      <van-popup type="primary" v-model="showBrowseImg">
        <icon-portrait :imgUrl="mixinsOtcOrderDetail.payInfo.payQrUrl" size="256" />
      </van-popup>
    </native-scroll>
    <orderPopup
      :is-show-order-detail="isShowOrderDetail"
      @close-Windows="isShowOrderDetail = false"
    >
      <div class="order-info-listing-wrap">
        <div class="order-info-listing-title">
          <span>订单详情</span>
          <icon-portrait
            :img-url="require('@img/c2c/order-info-list-del.svg')"
            @click.native="isShowOrderDetail = false"
            size="16"
          />
        </div>
        <line-span :content="$route.params.orderId" title="订单号" />
        <line-span
          :content="`${mixinsOtcOrderDetail.price} ${mixinsOtcOrderDetail.marketName}`"
          title="单价"
        />
        <line-span
          :content="`${mixinsOtcOrderDetail.amount} ${mixinsOtcOrderDetail.emoneyUnit}`"
          title="总量"
        />
        <line-span
          :content="`${ mixinsOtcOrderDetail.money } ${mixinsOtcOrderDetail.moneyUnit}`"
          title="金额/总价（元）"
        />
        <line-span :content="mixinsOtcOrderDetail.orderTime" title="订单时间" />
        <line-span content="招商银行（0914）" title="您的支付方式" />
        <line-span content="舅舅发财-招商银行（0914）" title="商家" />
        <line-span :content="mixinsOrderStatusDesc" title="状态" />
      </div>
    </orderPopup>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import orderLog from '@/components/c2c/order-log.vue';
import lineSpan from '@/components/c2c/line-span.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import orderPopup from '@/components/c2c/order-popup.vue';
import orderHeader from '@/components/c2c/order-header.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import ctcHeaderNav from '@/components/c2c/order-progress.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';
// api
import { reqCancelByBuyer, reqGetOrderById } from '@/api/otc/order';
// mixins
import mixinsOtcOrder from '@/mixins/otc/order';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
// enums
import { EOtcBankCard } from '@/config/enums';
// 插件
import Clipboard from 'clipboard';

@Component({
  components: {
    helpDialog,
    orderLog,
    ctcHeaderNav,
    iconPortrait,
    appBar,
    orderHeader,
    lineSpan,
    orderPopup,
    otcButton
  }
})
export default class OrderBuyer extends Mixins(mixinsOtcOrder, mixinsOtcGetUserToken) {
  cancelOrderVisible: boolean = false;
  showBrowseImg: boolean = false;
  isShowOrderDetail: boolean = false;

  copyAllInfo: string = '';

  async mounted() {
    this.mixinsOtcOrderDetail = await reqGetOrderById(this.$route.params.orderId);
    this.mixinsGetOtcOrderDetail(this.$route.params.orderId);
    this.mixinsOtcOrderTimer(this.mixinsOtcOrderDetail.payTimeOuts, this.mixinsOtcOrderDetail.processTime);
    this.mixinsOrderLog = this.mixinsOtcOrderDetail.orderLog;
  }

  // 取消订单
  async cancelOrderHandle() {
    await reqCancelByBuyer(this.$route.params.orderId);
  }

  // 下单
  async payByBuyer() {
    this.$router.replace({ name: 'c2c-add-payment', params: { orderId: this.$route.params.orderId } });
  }

  goToAppeal() {
    if (this.mixinsCountdownString === '00:00') {
      this.$router.push({ name: 'c2c-sponsor', params: { orderId: this.$route.params.orderId, appealId: 'no' } });
    }
  }

  pasteHandle() {
    this.copyAllInfo = `收款方账户名 ${this.mixinsOtcOrderDetail.payInfo.realName}; 账户号码 ${this.mixinsOtcOrderDetail.payInfo.account}; 金额 ${this.mixinsOtcOrderDetail.money};`;

    if (this.mixinsOtcOrderDetail.payInfo.type === this.mixinsOrderPayBankCard) {
      this.copyAllInfo = `${this.copyAllInfo} 银行 ${this.mixinsOtcOrderDetail.payInfo.bankName}`;
    }
    let clipboard = new Clipboard('.order-copy');
    clipboard.on('success', () => {
      this.$message.success('__("复制成功")');
    });
    clipboard.on('error', () => {
      this.$message.fail('__("复制失败,请手动复制")');
    });
  }

  get bankCardName(): string {
    switch (this.mixinsOtcOrderDetail.payInfo.type) {
      case EOtcBankCard.BankCard:
        return '银行卡号码';
      case EOtcBankCard.Wechat:
        return '微信号码';
      case EOtcBankCard.Alipay:
        return '支付宝';
      case EOtcBankCard.Paypal:
        return 'Paypal账号';
      case EOtcBankCard.Western:
        return '西联汇款账号';
      case EOtcBankCard.international:
        return '国际Swift账号';
      default:
        return '收款方账号';
    }
  }
}

</script>

<style lang='scss'>
.buyer-box-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
  .buyer-box-scroll {
    flex: 1;
    .buy-info-wrap {
      margin-left: 34px;
      margin-right: 34px;
    }
    .note-info-wrap {
      padding-top: 24px;
      padding-bottom: 31px;
      .note-info-content {
        font-size: 14px;
        display: block;
        padding-bottom: 9px;
      }
      .note-all-copy {
        border-radius: 2px;
        width: 107px;
        height: 23px;
        background: #e91c41;
        line-height: 23px;
        text-align: center;
        color: white;
        font-size: 12px;
      }
    }
    .dividing-line {
      height: 5px;
      width: 100%;
      background: #f7f8fe;
    }
    .action-btns {
      display: flex;
      justify-content: space-between;
      padding: 24px 25px 35px 25px;
      align-items: center;
      color: #4caf50;
      .action-btns-a {
        width: 89px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .buyer {
        display: flex;
        div:last-child {
          margin-left: 6px;
        }
      }
      .msg {
        font-size: 37px;
        padding: 0 10px;
      }
    }
  }
  .order-info-listing-wrap {
    background: white;
    padding: 31px 29px 61px 29px;
    .order-info-listing-title {
      padding-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 16px;
        font-weight: bold;
        color: #000;
      }
    }
  }
}
</style>
