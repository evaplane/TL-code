<template>
  <div v-loading="loading" class="c2c-confirm-wrap" :style="{ height: wrapHeight }">
    <div class="c2c-confirm-pop" :class="{ 'show-payment': showPayment }">
      <div class="c2c-confirm-form" ref="confirmForm">
        <div class="c2c-confrim-header">
          <p>{{ orderType }}</p>
          <div class="icon" @click="closeClickHandle">
            <icon-close />
          </div>
        </div>
        <div class="c2c-confirm-total">
          <p class="total-money">{{ money }} {{ moneyUnit }}</p>
          <p class="total-type label">{{ type === 'buy' ? '__("应付款")' : '__("可收款")' }}</p>
        </div>

        <div>
          <div class="c2c-form-item">
            <span class="label">__('收款方式')</span>
            <div class="val">
              <span class="c2c-confirm-bank-name" v-if="account && account.bankName"
                >{{ account.bankName }} ({{ account.account.substr(-4) }})</span
              >
              <span class="c2c-confirm-bank-name" v-if="account && account.type === 2"
                >__('微信支付') ({{ account.account.substr(-4) }})</span
              >
              <span class="c2c-confirm-bank-name" v-if="account && account.type === 3"
                >__('支付宝') ({{ account.account.substr(-4) }})</span
              >
              <span class="change-card" @click="showPayment = true">__('换卡')</span>
            </div>
          </div>
          <div class="c2c-form-item">
            <span class="label">__('单价')</span>
            <div class="val">{{ price }} {{ moneyUnit }}/{{ coinName }}</div>
          </div>
          <div class="c2c-form-item">
            <span class="label">{{ orderType }}</span>
            <div class="val">{{ amount }} {{ coinName }}</div>
          </div>
        </div>

        <div class="c2c-confirm-btn-wrap">
          <button class="c2c-confirm-btn" :class="{ 'sell-bg': type === 'sell' }" @click="addOrder">
            {{ orderType }}
          </button>
        </div>
      </div>
      <payment-management
        ref="paymentManagement"
        :accountList="accountList"
        class="payment-management"
        @account-click-handle="accountClickHandle"
        @foot-btn-click-handle="showPayment = false"
      >
        <label slot="header" v-if="type === 'buy'">__('商家收款方式')</label>
      </payment-management>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Watch, Prop, Mixins } from 'vue-property-decorator';
import paymentManagement from '@/components/c2c/payment-management/index.vue';
import { IAdC2cResponse, getByAdId } from '@/api/otc/ad';
import { divide, multiply, fixDecimal } from '@/utils/math';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
import { accountList, IOtcAccountResponse } from '@/api/otc/account';
import { Getter } from 'vuex-class';
import { addOrder, IOtcAddOrderParams, IOtcOrderResponse } from '@/api/otc/order';

@Component({
  components: {
    paymentManagement
  }
})
export default class C2cConfirmPop extends Mixins(mixinsOtcGetUserToken) {
  @Prop({ type: String, default: 'buy' }) type!: 'buy' | 'sell';
  @Prop({ type: String, default: '' }) coinName!: string;
  @Prop({ type: String, default: '' }) moneyUnit!: string;
  @Prop({ type: String || Number, default: '' }) amountOrMoney!: number | string;
  @Prop({ type: Boolean, required: true }) amountType!: boolean; // amountOrMoney true-数量 false-金额
  @Prop({ type: Object, required: true }) adObj!: IAdC2cResponse;

  loading: boolean = false;
  showPayment: boolean = false;
  wrapHeight: string = 'auto';
  myAccountList: IOtcAccountResponse[] = [];
  merchantAccountList: IOtcAccountResponse[] = [];
  account: IOtcAccountResponse | null = null;

  '$refs': {
    paymentManagement: paymentManagement;
    confirmForm: HTMLDivElement;
  };

  get orderType() {
    return this.type === 'buy' ? '__("确认购买")' : '__("确认出售")';
  }
  get price() {
    return this.adObj.price;
  }
  /**
   * 计算总额
   */
  get money() {
    return this.amountType
      ? fixDecimal(multiply(this.amountOrMoney, this.price), this.adObj.basicCoinPrecision)
      : this.amountOrMoney;
  }
  /**
   * 计算总数量
   */
  get amount() {
    return this.amountType
      ? this.amountOrMoney
      : fixDecimal(divide(this.amountOrMoney, this.price), this.adObj.tradeCoinPrecision);
  }

  get payways() {
    return this.adObj.payWay.split(',');
  }

  get accountList() {
    if (this.type === 'buy') {
      return this.merchantAccountList;
    } else {
      return this.myAccountList.filter(account => {
        return this.payways.indexOf(account.type + '') > -1;
      });
    }
  }

  @Getter('otcUserId', { namespace: 'otc' }) public otcUserId!: string;

  @Watch('showPayment', { immediate: true })
  setWarpHeight(showPayment: boolean) {
    this.$nextTick(() => {
      if (showPayment) {
        this.wrapHeight = window.getComputedStyle(this.$refs.paymentManagement.$el).height || 'auto';
      } else {
        this.wrapHeight = window.getComputedStyle(this.$refs.confirmForm).height || 'auto';
      }
    });
  }

  @Watch('mixinsOtcIsLogin', { immediate: true })
  otcIsLoginWatcher(otcIsLogin: boolean) {
    if (otcIsLogin) {
      this.getAccountList();
      this.getByAdId();
    }
  }
  @Watch('accountList', { immediate: true, deep: true })
  accountListWatcher(accountList: IOtcAccountResponse[]) {
    if (!accountList || accountList.length === 0) {
      this.account = null;
    } else {
      this.account = accountList[0];
    }
  }

  @Emit('close')
  closeClickHandle() {
    this.showPayment = false;
  }

  @Emit('submitSuccess')
  submitSuccess() {
    this.showPayment = false;
  }

  /**
   * 下单
   */
  async addOrder() {
    if (!this.account) {
      return this.$message.fail('__("请选择收款方式")');
    }

    const params: IOtcAddOrderParams = {
      amount: this.amount,
      adId: this.adObj.adId,
      money: this.money,
      price: this.adObj.price,
      payAccountId: this.account.accountId
    };

    try {
      this.loading = true;
      let res: IOtcOrderResponse = await addOrder(params);
      this.submitSuccess();
      this.$router.replace({
        name: 'c2c-await-order',
        params: {
          orderId: res.id
        }
      });
    } catch (err) {
      console.log(err);
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }

  async getAccountList() {
    try {
      let res = await accountList({
        receive: 1,
        deleted: false,
        pageIndex: 0,
        pageSize: 20,
        userId: this.otcUserId
      });
      this.myAccountList = res.results;
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }

  /**
   * 获取广告详情
   */
  async getByAdId() {
    try {
      let res = await getByAdId(this.adObj.adId);
      this.merchantAccountList = res.accountList;
    } catch (err) {
      console.log(err);
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }

  accountClickHandle(data: IOtcAccountResponse) {
    this.account = data;
    this.showPayment = false;
  }
}
</script>

<style lang="scss">
.c2c-confirm-wrap {
  width: 100%;
  color: var(--new-theme-color-3);
  background-color: var(--default-bg);
  overflow: hidden;
  transition: height 0.4s 0.2s;
}
.c2c-confirm-pop {
  display: flex;
  width: 200%;
  align-items: flex-start;
  transition: all 0.2s;
  &.show-payment {
    transform: translateX(-50%);
  }

  .c2c-confirm-form {
    width: 50%;
    padding: 0 20px;
    @include bold;
  }
  .payment-management {
    width: 50%;
  }

  .c2c-confrim-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    font-size: 18px;
  }

  .c2c-confirm-total {
    padding: 20px 0;
    text-align: center;
    font-size: 24px;
  }
  .total-money {
    padding: 5px 0;
  }
  .total-type {
    padding: 3px 0;
  }

  .c2c-form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54px;
    font-size: 16px;
    border-bottom: 1px solid var(--border-color); /* no */
  }

  .c2c-confirm-bank-name {
    position: relative;
    padding-right: 10px;
    &::after {
      content: '';
      display: block;
      position: absolute;
      right: 0;
      top: 5px;
      bottom: 0;
      width: 1px;
      height: 13px;
      background-color: var(--new-theme-color);
    }
  }

  .change-card {
    padding-left: 10px;
    color: var(--primary-color);
  }

  .c2c-confirm-btn-wrap {
    padding: 30px 0;
  }

  .c2c-confirm-btn {
    width: 100%;
    height: 40px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    color: #fff;
    background-color: var(--buy-color);
    &.sell-bg {
      background-color: var(--sell-color);
    }
  }

  .label {
    font-size: 14px;
    color: var(--new-theme-color);
    font-weight: normal;
  }
}
</style>
