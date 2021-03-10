<template>
  <div class="order-confirm" v-loading="loading">
    <div :class="[this.orderType === 'buy' ? 'buy-bg' : 'sell-bg']" class="confirm-header">
      <div class="header-bar">
        <div @click="$router.back()" class="return-btn">
          <icon-return />
        </div>
        <div class="title" v-if="adDetail">{{ labelArr[0] }}{{ adDetail.tradeCoinName }}</div>
      </div>
      <template v-if="adDetail">
        <div class="merchant-info">
          <div :class="[this.orderType === 'buy' ? 'buy-color' : 'sell-color']" class="avatar">
            {{ adDetail.adType === 1 ? 'OTC' : 'C2C' }}
          </div>
          <div>
            <div class="nick-name">
              {{ adDetail.nickName }}
              <img src="@img/c2c/zbicon-diamond.svg" v-if="adDetail.isBusiness === 1" />
            </div>
            <div class="bond-tip" v-if="adDetail.isBusiness === 1">__('已经缴纳足额保证金')</div>
            <div class="limit">
              <span>__('最少:')</span>
              <em>{{ basicCoinNameSymbol }}{{ adDetail.dealMinMoney }}</em>
              <span>__('最多:')</span>
              <em>{{ basicCoinNameSymbol }}{{ adDetail.dealMaxMoney }}</em>
            </div>
          </div>
        </div>

        <div class="guarantee">
          <img src="@img/c2c/zbicon-shield.svg" />
          <div>
            <p>__('担保交易')</p>
            <p>__('安心付款')</p>
          </div>
        </div>
      </template>
    </div>
    <div class="confirm-content">
      <native-scroll v-if="adDetail">
        <div class="confirm-list">
          <div class="confirm-item">
            <div class="title" v-if="isCnyTrade">__('按照金额输入')</div>
            <div class="title" v-else>__('按照数量输入')</div>
            <m-switch class="m-switch" v-model="isCnyTrade" />
            <div class="right unit-price">
              __('单价:')
              <span class="price">{{ basicCoinNameSymbol }}{{ adDetail.price }}</span>
            </div>
          </div>
          <div class="line1px"></div>
          <div class="confirm-item">
            <div class="title" v-if="isCnyTrade">__('买入金额')({{ adDetail.basicCoinName }})：</div>
            <div class="title" v-else>__('买入数量')({{ adDetail.tradeCoinName }})：</div>
            <div class="input-wrap">
              <div class="m-input">
                <input :placeholder="placeholder" type="number" v-if="isCnyTrade" v-model="money" />
                <input :placeholder="placeholder" type="number" v-else v-model="amount" />
                <label class="placeholder">{{ placeholder }}</label>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="confirm-item payment-method">
            <div class="title">__('付款方式：')</div>
            <div @click="accountVisible = true" class="right bank-name">
              <template v-if="account && account.bankName">
                <img class="bank-logo" src="@img/c2c/bank/cmb.svg" />
                <span>{{ account.bankName }}</span>
              </template>
              <template v-if="account && account.type === 2">
                <img class="bank-logo" src="@img/c2c/bank/wechat.svg" />
                <span>__('微信支付')</span>
              </template>
              <template v-if="account && account.type === 3">
                <img class="bank-logo" src="@img/c2c/bank/alipay.svg" />
                <span>__('支付宝')</span>
              </template>
              <icon-arrow />
            </div>
          </div>
          <div class="line"></div>
          <div class="confirm-total">
            <div class="confirm-item">
              <div class="title">__('数量')({{ adDetail.tradeCoinName }})：</div>
              <div class="right number">
                {{ amount || '0' }}
              </div>
            </div>
            <div class="confirm-item">
              <div class="title">__('交易金额')({{ adDetail.basicCoinName }})：</div>
              <div class="right number">
                {{ money || '0' }}
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="btn-wrap">
            <span class="chat-btn" @click="$router.push({ name: 'c2c-chat' })"><img src="@img/c2c/icon-chat.svg"/></span>
            <button @click="addOrder" class="order-btn">__('下单')</button>
          </div>
        </div>
      </native-scroll>
    </div>
    <van-popup class="payment-popup" position="bottom" v-model="accountVisible">
      <payment-management
        :accountList="userAccountList"
        @account-click-handle="accountClickHandle"
        @foot-btn-click-handle="accountVisible = false"
      >
        <label slot="header" v-if="orderType === 'buy'">__('商家收款方式')</label>
        <div slot="footer">__('取消')</div>
      </payment-management>
    </van-popup>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
import headerBack from '@/components/c2c/header-back/index.vue';
import mInput from '@/components/common/input/index.js';
import mSwitch from '@/components/common/switch/index.vue';
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
    mSwitch,
    paymentManagement,
    nativeScroll
  }
})
export default class Confirm extends Mixins(mixinsOtcGetUserToken) {
  loading: boolean = false;
  isCnyTrade: boolean = false;
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
    if (this.adDetail && this.adDetail.type === 2) {
      return ['__("买入")'];
    }
    return ['__("卖出")'];
  }
  get orderType() {
    return (this.adDetail && this.adDetail.type) === 2 ? 'buy' : 'sell';
  }
  get placeholder() {
    return '__("请输入")' + this.labelArr[0] + (this.isCnyTrade ? '__("金额")' : '__("数量")');
  }
  get basicCoinNameSymbol() {
    if (!this.adDetail) return '';
    const symbolMap: IObj<string> = {
      CNY: '￥',
      HKD: 'HK$',
      USD: '$'
    };
    return symbolMap[this.adDetail.basicCoinName] || '￥';
  }
  get fund() {
    const fund = this.fundList.find(fund => {
      return fund.currencyTypeId === (this.adDetail && this.adDetail.tradeCoin);
    });
    return fund;
  }
  get balance() {
    return this.fund && this.fund.amount;
  }

  @Getter('otcUserId', { namespace: 'otc' }) public otcUserId!: string;

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
      this.userAccountList = this.adDetail.type === 2 ? this.adDetail.accountList : this.myAccountList;
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
  font-size: 14px;
  color: var(--default-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .confirm-header {
    position: relative;
    &.buy-bg {
      background-color: #bf3542 !important;
    }
    &.sell-bg {
      background-color: #67ac5b !important;
    }
    .header-bar {
      padding: 30px 15px;
      display: flex;
      align-items: center;
      color: #fff;
      .title {
        font-size: 22px;
        margin-left: 10px;
        @include bold;
      }
    }
    .merchant-info {
      padding: 0 15px 30px 15px;
      display: flex;
      align-items: center;
      color: #fff;
      .avatar {
        width: 44px;
        height: 44px;
        margin-right: 12px;
        text-align: center;
        line-height: 44px;
        font-size: 14px;
        border-radius: 50%;
        background-color: #fff;
        @include bold;
      }
      .nick-name {
        font-size: 20px;
        color: #fff;
        display: flex;
        align-items: center;
        @include bold;
        img {
          width: 15px;
          margin-left: 5px;
        }
      }
      .bond-tip {
        margin: 10px 0;
        opacity: 0.7;
        font-size: 12px;
      }
      .limit {
        display: flex;
        align-items: center;
        margin-top: 12px;
        span {
          opacity: 0.7;
          font-size: 12px;
        }
        em {
          font-style: normal;
          font-size: 18px;

          &:first-of-type {
            margin-right: 10px;
          }
        }
      }
    }
    .guarantee {
      position: absolute;
      right: 15px;
      top: 30px;
      padding: 8px 14px;
      background-color: #fff;
      border-radius: 40px;
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 22px;
        margin-right: 5px;
      }
      p {
        font-size: 12px;
        color: #313038;
        @include bold;
        &:first-of-type {
          margin-bottom: 2px;
        }
      }
    }
  }
  .confirm-content {
    flex: 1;
    overflow: hidden;
  }

  .confirm-item {
    padding: 0 15px;
    height: 60px;
    display: flex;
    align-items: center;
    .title {
      margin-right: 5px;
    }
    .right {
      margin-left: auto;
    }
  }
  .confirm-total {
    padding: 15px 0;
    .confirm-item {
      height: auto;
      padding: 10px 15px;
      .number {
        font-size: 16px;
        font-weight: bold;
        color: var(--heavy-color);
      }
    }
  }
  .input-wrap {
    flex: 1;
  }
  .m-input {
    height: 100%;
    position: relative;
    input {
      display: block;
      width: 100%;
      height: 100%;
      border: 0;
      background-color: transparent;
      color: #bf3542;
      font-weight: bold;
      font-size: 30px;
      text-align: right;
      -webkit-appearance: none;
    }
    .placeholder {
      font-size: 14px;
      color: var(--thin-color);
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
    input:placeholder-shown::placeholder {
      color: transparent;
    }
    input:not(:placeholder-shown) + .placeholder {
      display: none;
    }
  }

  .unit-price {
    display: flex;
    align-items: center;
    .price {
      font-size: 18px;
      font-weight: bold;
      margin-left: 5px;
      color: #bf3542;
    }
  }
  .payment-method {
    .bank-name {
      display: flex;
      align-items: center;
      .bank-logo {
        width: 24px;
      }
      span {
        color: var(--heavy-color);
        font-weight: bold;
        font-size: 18px;
        margin: 0 5px;
      }
    }
  }

  .line1px {
    height: 1px; /* no */
    background-color: var(--line-color);
    margin: 0 15px;
  }

  .btn-wrap {
    display: flex;
    align-items: center;
    padding: 20px 15px;
    .chat-btn {
      margin-right: 20px;
      position: relative;
      top: 2px;
      img {
        width: 40px;
      }
    }
    .order-btn {
      flex: 1;
      height: 50px;
      border-radius: 50px;
      border: none;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      background-color: #bf3542;
    }
  }
}
</style>
