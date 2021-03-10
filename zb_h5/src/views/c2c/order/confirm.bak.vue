<template>
  <div class="order-confirm" v-loading="loading">
    <header-back>
      <p v-if="adDetail">{{ labelArr[0] }}{{ adDetail.tradeCoinName }}</p>
    </header-back>

    <native-scroll v-if="adDetail">
      <div class="amount-wrap">
        <div class="limit-box mb-10">
          <p class="limit">
            __('限额：')￥{{adDetail.dealMinMoney}}-{{ adDetail.dealMaxMoney }}
            <a @click="allClickHandle">__('全部'){{ labelArr[0] }}</a>
          </p>

          <div @click="isCnyTrade = !isCnyTrade" class="unit-switch">
            <i class="zbicon-conversion" />
            <span v-if="isCnyTrade">__('改为数量'){{ labelArr[0] }}</span>
            <span v-else>__('改为金额'){{ labelArr[0] }}</span>
          </div>
        </div>
        <div class="input-box mb-10">
          <m-input :placeholder="placeholder" itype="number" v-if="isCnyTrade" v-model="money" />
          <m-input :placeholder="placeholder" itype="number" v-else v-model="amount" />
          <span class="unit">{{ isCnyTrade ? adDetail.basicCoinName : adDetail.tradeCoinName }}</span>
        </div>
        <div class="balance-box mb-10" v-if="orderType === 'sell'">
          <p>__('余额：'){{ balance }} {{ adDetail.tradeCoinName }}</p>
        </div>
        <div class="payment-box">
          <p>{{ orderType === 'buy' ? "__('商家收款方式')" : "__('我的收款方式')" }}</p>
          <div class="card-wrap">
            <div class="card" v-if="account">
              <p class="bank-name" v-if="account.bankName">{{ account.bankName }}</p>
              <p class="bank-name" v-if="account.type === 2">__('微信支付')</p>
              <p class="bank-name" v-if="account.type === 3">__('支付宝')</p>
              <p class="bank-number">{{ account.account }}</p>
            </div>
            <i v-if="orderType === 'buy'" class="icon-select-payment" @click="accountVisible = true"/>
            <i v-if="orderType === 'sell'" class="icon-choice-payment" @click="accountVisible = true"/>
          </div>
        </div>
      </div>

      <div class="line" />

      <div class="trade-wrap">
        <div class="cell">
          <label>__('交易单价')</label>
          <p class="val">{{ adDetail.price }} {{ adDetail.basicCoinName }}</p>
        </div>
        <div class="cell">
          <label>__('交易数量')</label>
          <p class="val">{{ amount }} {{ adDetail.tradeCoinName }}</p>
        </div>
        <div class="cell">
          <label>__('交易金额')</label>
          <p class="val res">{{ basicCoinNameSymbol }}{{ money }}</p>
        </div>

        <div class="order-btn">
          <van-button @click="addOrder">__('下单')</van-button>
        </div>

        <div class="trade-tip">__('如果广告单价浮动，以购买币数量为准')</div>

        <div class="merchant-note">
          <p class="title">__('商家留言')</p>
          <span>{{ adDetail.remark }}</span>
        </div>
      </div>

      <van-popup class="payment-popup" position="bottom" v-model="accountVisible">
        <payment-management
          :accountList="userAccountList"
          @account-click-handle="accountClickHandle"
          @foot-btn-click-handle="accountVisible = false"
        >
          <label v-if="orderType === 'buy'" slot="header">__('商家收款方式')</label>
          <div slot="footer">
            __('取消')
          </div>
        </payment-management>
      </van-popup>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
import headerBack from '@/components/c2c/header-back/index.vue';
import mInput from '@/components/common/input/index.js';
import paymentManagement from '@/components/c2c/payment-management/index.vue';
import { IOtcAccountResponse, accountList } from '@/api/otc/account';
import { getByAdId, IAdResponse } from '@/api/otc/ad';
import { IOtcAddOrderParams, addOrder, IOtcOrderResponse } from '@/api/otc/order';
import { getFundList, IOtcFundListResponse } from '@/api/otc/user';
import nativeScroll from '@/components/common/native-scroll/index.vue';
import { multiply, divide, fixDecimal } from '@/utils/math';
import { Getter } from 'vuex-class';

@Component({
  components: {
    headerBack,
    mInput,
    paymentManagement,
    nativeScroll
  }
})
export default class Confirm extends Mixins(mixinsOtcGetUserToken) {
  loading: boolean = false;
  isCnyTrade: boolean = true;
  amount: number | string = '';
  money: number | string = '';
  account: IOtcAccountResponse | null = null;
  accountVisible: boolean = false;
  userAccountList: IOtcAccountResponse[] = [];
  adDetail: IAdResponse | null = null;
  myAccountList: IOtcAccountResponse[] = [];
  fundList: IOtcFundListResponse[] = [];

  get adId() {
    return (this.$route.query.id || '') as string;
  }
  get labelArr() {
    if (this.adDetail && this.adDetail.type === 1) {
      return ['__("买入")'];
    }
    return ['__("卖出")'];
  }
  get orderType() {
    return (this.adDetail && this.adDetail.type) === 1 ? 'buy' : 'sell';
  }
  get placeholder() {
    return '__("请输入")' + this.labelArr[0] + (this.isCnyTrade ? '__("金额")' : '__("数量")');
  }
  get basicCoinNameSymbol() {
    if (!this.adDetail) return '';
    const symbolMap: IObj<string> = {
      'CNY': '￥',
      'HKD': 'HK$',
      'USD': '$'
    };
    return symbolMap[this.adDetail.basicCoinName] || '￥';
  }
  get fund() {
    const fund = this.fundList.find((fund) => {
      return fund.currencyTypeId === (this.adDetail && this.adDetail.tradeCoin);
    });
    return fund;
  }
  get balance() {
    return this.fund && this.fund.amount;
  }

  @Getter('otcUserId', { namespace: 'otc' }) public otcUserId!: string

  /**
   * OTC 登陆后再获取广告详情
   */
  @Watch('mixinsOtcIsLogin', { immediate: true })
  otcIsLoginWatcher(otcIsLogin: boolean) {
    if (otcIsLogin && this.adId !== '') {
      this.getByAdId();
      this.getMyReceiveAccount();
      this.getFundList();
    }
  }

  /**
   * 数量变化时，计算总金额
   */
  @Watch('amount')
  amountWatcher(amount: number | string) {
    if (!this.isCnyTrade) {
      this.money = this.adDetail ? fixDecimal(multiply(amount, this.adDetail.price), this.adDetail.basicCoinPrecision) : '';
    }
  }
  /**
   * 金额变化时，计算数量
   */
  @Watch('money')
  moneyWatcher(money: number | string) {
    if (this.isCnyTrade) {
      this.amount = this.adDetail ? fixDecimal(divide(money, this.adDetail.price), this.adDetail.tradeCoinPrecision) : '';
    }
  }

  /**
   * 默认设置第一个收款方式
   */
  @Watch('adDetail', { immediate: true, deep: true })
  @Watch('myAccountList', { immediate: true, deep: true })
  setUserAccountList() {
    if (this.adDetail) {
      this.userAccountList = this.adDetail.type === 1 ? this.adDetail.accountList : this.myAccountList;
      this.account = (this.userAccountList && this.userAccountList[0]) || null;
    }
  }

  /**
   * 选择收款方式
   */
  accountClickHandle(account: IOtcAccountResponse) {
    this.account = account;
    this.accountVisible = false;
  }

  /**
   * 全部 买入 / 卖出
   */
  allClickHandle() {
    if (this.adDetail) {
      this.money = this.adDetail.dealMaxMoney;
      if (this.orderType === 'sell' && this.fund) {
        // 全部卖出时，取余额与最大交易额的最小值
        this.money = Math.min(this.adDetail.dealMaxMoney, Number(this.fund.cnyamount));
      }
      this.amount = fixDecimal(divide(this.money, this.adDetail.price), this.adDetail.tradeCoinPrecision);
    }
  }

  /**
   * 获取广告详情
   */
  async getByAdId() {
    this.loading = true;
    try {
      this.adDetail = await getByAdId(this.adId);
    } catch (err) {
      console.log(err);
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }

  /**
   * 获取我的收款方式
   */
  async getMyReceiveAccount() {
    try {
      const res = await accountList({
        receive: 1,
        deleted: false,
        pageIndex: 0,
        pageSize: 20,
        userId: this.otcUserId
      });
      this.myAccountList = res.results;
    } catch (err) {
      console.log(err);
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }

  showError(msg: string) {
    this.$message.fail(msg);
  }

  /**
   * 下单
   */
  async addOrder() {
    if (!this.adDetail) return;
    if (!this.amount || this.amount === '0') {
      return this.showError(this.placeholder);
    }
    if (!this.account) {
      return this.showError('__("请选择付款方式")');
    }

    const params: IOtcAddOrderParams = {
      amount: this.amount,
      adId: this.adDetail.adId,
      money: this.money,
      price: this.adDetail.price,
      payAccountId: this.account.accountId
    };

    try {
      let res: IOtcOrderResponse = await addOrder(params);
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
  }

  async getFundList() {
    try {
      this.fundList = await getFundList();
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style lang="scss">
.order-confirm {
  height: 100%;
  font-size: 12px;
  color: var(--new-theme-color-6);
  overflow: hidden;
  .mb-10 {
    margin-bottom: 10px;
  }
  .amount-wrap {
    padding: 20px var(--padding-lr);
  }

  .zbicon-conversion {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 3px;
    vertical-align: bottom;
    background: url('~@img/c2c/zbicon-buy-conversion.png') center no-repeat /
      contain;
  }

  .limit-box {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    line-height: 1.5em;
  }
  .limit {
    color: var(--new-theme-color);
    a {
      color: var(--new-theme-color-6);
    }
  }

  .input-box {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-radius: 2px;
  }
  .van-cell {
    padding: 0;
    input {
      font-size: 20px;
      color: var(--new-theme-color-6);
      line-height: 28px;
      &::placeholder {
        color: var(--new-theme-color);
      }
    }
    &::after {
      display: none;
    }
  }
  .unit {
    padding-left: 10px;
    font-size: 18px;
    border-left: 1px solid var(--border-color);
  }

  .balance-box {
    color: var(--new-theme-color);
  }
  .payment-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    .card-wrap {
      display: flex;
      align-items: center;
    }
    .card {
      padding: 6px 14px;
      color: var(--primary-color);
      font-weight: 600;
      border: 1px solid var(--primary-color);
      border-radius: 5px;
    }
    .bank-name {
      margin-bottom: 1px;
      font-size: 16px;
    }
    .bank-number {
      opacity: 0.77;
      font-size: 12px;
    }
    .icon-select-payment, .icon-choice-payment{
      display: block;
      width: 50px;
      height: 50px;
      margin-left: 20px;
      background: url('~@img/c2c/zbicon-pay-details.svg') center no-repeat /
        contain;
    }
    .icon-choice-payment{
      background-image: url('~@img/c2c/zbicon-choice.svg');
    }
  }

  .trade-wrap {
    padding: 0 var(--padding-lr);
    .cell {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 17px 0;
      font-size: 15px;
    }
    .val {
      font-weight: 600;
    }
    .res {
      color: var(--primary-color);
    }
  }
  .order-btn {
    margin-top: 23px;
    margin-bottom: 16px;
    .van-button {
      width: 100%;
      height: 45px;
      font-size: 17px;
      font-weight: 600;
      border-radius: 2px;
      border: none;
      color: #fff;
      background-color: var(--primary-color);
    }
  }
  .trade-tip {
    margin-bottom: 30px;
    color: var(--new-theme-color);
  }

  .merchant-note {
    padding: 10px;
    margin-bottom: 20px;
    min-height: 100px;
    line-height: 17px;
    color: var(--new-theme-color);
    background-color: var(--border-color);
    border-radius: 2px;
    .title {
      margin-bottom: 6px;
      font-size: 13px;
      font-weight: 600;
    }
  }
}
</style>
