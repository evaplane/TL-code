<template>
  <div class="payin-popup-form">
    <transition name="popup-bottom">
      <div class="popup-bottom payin-form" v-if="visible && adObj">
        <span class="popup-close" @click="close"></span>
        <div class="popup-payin">
          <div class="popup-payin-head">
            <slot name="title">__('确认充值购买')</slot>
          </div>
          <div class="popuo-payin-content">
            <div class="popup-payin-amount popup-payin-center">
              <span>{{ totalMoney }}</span> {{ moneyUnitUp }}
              <p>{{ type === 'buy' ? '__("应付款")' : '__("可收款")' }}</p>
            </div>
            <div class="popup-payin-switch popup-payin-center">
              <p>{{ isMoneyDeal ? '__("交易金额")' : '__("交易数量")' }}</p>
              <m-switch v-model="isMoneyDeal" />
            </div>
            <div class="popup-payin-input">
              <input v-if="isMoneyDeal" type="number" v-model="moneyVal" />
              <input v-else type="number" v-model="amountVal" />
              <span class="unit">{{ isMoneyDeal ? moneyUnitUp : coinNameUp }}</span>
            </div>
            <div class="popup-payin-form">
              <div class="popup-payin-item">
                <div class="label">__('单价')</div>
                <div class="value">{{ price }} {{ coinNameUp }}/{{ moneyUnitUp }}</div>
              </div>
              <div class="popup-payin-item">
                <div class="label" v-if="isShowMyAccount">__('您的支付方式')</div>
                <div class="label" v-else>__('商家收款方式')</div>
                <div class="value" @click="changePaymentClickHandle">
                  <span class="c2c-confirm-bank-name" v-if="account && account.bankName">
                    {{ account.bankName }}（{{ account.account.substr(-4) }}）
                  </span>
                  <span class="c2c-confirm-bank-name" v-if="account && account.type === 2">
                    __('微信支付')（{{ account.account.substr(-4) }}）
                  </span>
                  <span class="c2c-confirm-bank-name" v-if="account && account.type === 3">
                    __('支付宝')（{{ account.account.substr(-4) }}）
                  </span>
                  <icon-arrow  v-if="isCanChangeAccount" />
                </div>
              </div>
              <div class="popup-payin-item">
                <div class="label">__('支付对象')</div>
                <div class="value">
                  <span class="badge">{{ adType === 'c2c' ? '__("C2C担保")' : '__("O2C担保")' }}</span>
                  {{ nickName || '__("优质认证商家")' }}
                </div>
              </div>
            </div>

            <div class="popup-payin-btn">
              <button @click="addOrder">
                <i class="zbicon-zbicon-lightning" />
                {{ type === 'buy' ? '__("确认购买")' : '__("确认出售")' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="popup-bottom">
      <div v-if="paymentVisible" class="payin-form popup-bottom">
        <payment-management
          :account-list="accountList"
          @account-click-handle="accountClickHandle"
          @foot-btn-click-handle="paymentCancelClickHandle"
        >
          <label slot="header" v-if="!isShowMyAccount">__('商家收款方式')</label>
        </payment-management>
      </div>
    </transition>
    <transition name="overlay">
      <div class="m-overlay" v-if="visible || paymentVisible"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from 'vue-property-decorator';
import mSwitch from '@/components/common/switch/index.vue';
import { multiply, divide, fixDecimal, lt, gt } from '@/utils/math';
import { getByAdId, IAdC2cResponse, IAdListResponseResult } from '@/api/otc/ad';
import { accountList, IOtcAccountResponse, IOtcListParams } from '@/api/otc/account';
import paymentManagement from '@/components/c2c/payment-management/index.vue';
import { Getter } from 'vuex-class';
import { IOtcAddOrderParams, addOrder, IOtcOrderResponse } from '@/api/otc/order';

@Component({
  components: {
    mSwitch,
    paymentManagement
  }
})
export default class PayinForm extends Vue {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: Function, default: null }) back?: Function;

  @Prop({ type: Object, default: null }) adObj!: IAdC2cResponse | IAdListResponseResult;

  @Prop({ type: String, default: '1000' }) amount!: string; // 数量

  @Prop({ type: String, default: 'money' }) dealType!: 'money' | 'amount'; // 交易类型, money-交易金额， amount-交易数量

  @Prop({ type: String, default: '' }) payway!: string;

  /** 是否为交易金额 */
  isMoneyDeal: boolean = true;
  /** 交易数量 */
  amountVal: string = '';
  /** 交易金额 */
  moneyVal: string = '';

  paymentVisible: boolean = false;

  /** 收款/付款 方式  */
  allAccountList: IOtcAccountResponse[] = [];
  /** 根据广告支持的付款方式筛选出分付款方式 */
  account: IOtcAccountResponse | null = null;

  /** 标记首次打开，获取 porps 值 */
  flagFirstOpen: boolean = true;

  get adId() {
    return this.adObj.adId || '';
  }

  /** 法币进度 */
  get basicCoinPrecision() {
    return this.adObj.basicCoinPrecision || 2;
  }
  /** 币种精度 */
  get tradeCoinPrecision() {
    return this.adObj.tradeCoinPrecision || 4;
  }

  /** 计算总金额 */
  get totalMoney() {
    return this.dealType === 'money' ? this.moneyVal : fixDecimal(multiply(this.amountVal, this.price), this.basicCoinPrecision);
  }

  get moneyUnitUp() {
    return this.adObj.marketName.split('/')[1].toUpperCase();
  }

  get coinNameUp() {
    return this.adObj.marketName.split('/')[0].toUpperCase();
  }

  /** 买入卖出类型 */
  get type() {
    return this.adObj.type === 2 ? 'buy' : 'sell';
  }

  /** 广告类型 */
  get adType() {
    return this.adObj.adType === 1 ? 'o2c' : 'c2c';
  }
  /** 单价 */
  get price() {
    return this.adObj.price || '1';
  }
  /** 商家昵称 */
  get nickName() {
    return this.adObj.nickName;
  }
  /** 支付方式 */
  get payways() {
    const payway = this.payway || (this.adObj && this.adObj.payWay) || '';
    return payway.split(',');
  }

  /** 支付列表 */
  get accountList() {
    return this.allAccountList.filter(account => {
      return this.payways.indexOf(account.type + '') > -1;
    });
  }
  /** 交易最小金额 */
  get dealMinMoney() {
    return this.adObj.dealMinMoney;
  }
  /** 交易最小数量 */
  get dealMinAmount() {
    return fixDecimal(divide(this.dealMinMoney, this.price), this.tradeCoinPrecision);
  }

  /** 交易最大金额 */
  get dealMaxMoney() {
    return this.adObj.dealMaxMoney;
  }
  /** 交易最大数量 */
  get dealMaxAmount() {
    return fixDecimal(divide(this.dealMaxMoney, this.price), this.tradeCoinPrecision);
  }

  /** 是否显示我的收付款方式 */
  get isShowMyAccount() {
    if (this.adType === 'c2c') {
      return true;
    } else {
      return this.type === 'sell';
    }
  }

  /** 是否可以切换 发付款方式 */
  get isCanChangeAccount() {
    return this.accountList && this.accountList.length > 1;
  }

  @Getter('otcUserId', { namespace: 'otc' }) public otcUserId!: string;

  @Watch('amountVal')
  amountValWatcher() {
    !this.isMoneyDeal && this.calcMoneyVal();
  }

  @Watch('moneyVal')
  moneyValWatcher() {
    this.isMoneyDeal && this.calcAmountVal();
  }

  @Watch('visible', { immediate: true })
  visibleWatch(visible: boolean) {
    if (visible && this.flagFirstOpen) {
      this.flagFirstOpen = false;
      this.isMoneyDeal = this.dealType === 'money';

      if (this.isMoneyDeal) {
        this.moneyVal = this.amount;
        this.calcAmountVal();
      } else {
        this.amountVal = this.amount;
        this.calcMoneyVal();
      }
      this.isShowMyAccount ? this.getAccountList() : this.getAdDetail();
    }
  }

  @Watch('accountList', { immediate: true, deep: true })
  accountListWatcher(accountList: IOtcAccountResponse[]) {
    if (accountList && accountList.length) {
      this.account = accountList[0];
    } else {
      this.account = null;
    }
  }

  @Emit('update:visible')
  close() {
    this.back && this.back(-1);
    this.flagFirstOpen = true;
    return false;
  }

  @Emit()
  done() {
    this.flagFirstOpen = true;
  }

  /** 取消选择支付方式 */
  changePaymentClickHandle() {
    if (!this.isCanChangeAccount) return;
    this.$emit('update:visible', false);
    this.paymentVisible = true;
  }

  /** 选择支付方式 */
  paymentCancelClickHandle() {
    this.paymentVisible = false;
    this.$emit('update:visible', true);
  }

  accountClickHandle(account: IOtcAccountResponse) {
    this.account = account;
    this.paymentCancelClickHandle();
  }

  /** 获取自己的付款方式 */
  async getAccountList() {
    if (!this.visible) return;
    try {
      let params: IOtcListParams = {
        deleted: false,
        pageIndex: 1,
        pageSize: 20,
        userId: this.otcUserId
      };
      if (this.type === 'buy') {
        params.payment = 1;
      } else {
        params.receive = 1;
      }
      let res = await accountList(params);
      this.allAccountList = res.results;
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }

  /** 获取广告详情，获取商家收款方式 */
  async getAdDetail() {
    if (!this.visible || !this.adId) return;
    try {
      let res = await getByAdId(this.adId);
      this.allAccountList = res.accountList || [];
      console.log(res);
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }

  /** 计算金额 */
  calcMoneyVal() {
    this.moneyVal = this.amountVal ? fixDecimal(multiply(this.amountVal, this.price), this.basicCoinPrecision) : '';
  }
  /** 计算数量 */
  calcAmountVal() {
    this.amountVal = this.moneyVal ? fixDecimal(divide(this.moneyVal, this.price), this.tradeCoinPrecision) : '';
  }

  checkOrderParmas() {
    if (!this.moneyVal) {
      this.$message.fail('__("请输入金额")');
      return false;
    } else if (!this.amountVal) {
      this.$message.fail('__("请输入数量")');
      return false;
    } else if (lt(this.moneyVal, this.dealMinMoney) || gt(this.moneyVal, this.dealMaxMoney)) {
      this.$message.fail('__("限额")' + `(${this.moneyUnitUp}): ` + this.dealMinMoney + '-' + this.dealMaxMoney);
      return false;
    } else if (!this.account) {
      this.$message.fail('__("请选择付款方式")');
      return false;
    }
    return true;
  }

  /** 下单 */
  async addOrder() {
    if (this.checkOrderParmas()) {
      const params: IOtcAddOrderParams = {
        amount: this.amountVal,
        adId: this.adObj.adId,
        money: this.moneyVal,
        price: this.price,
        payAccountId: (this.account as IOtcAccountResponse).accountId
      };

      try {
        let res: IOtcOrderResponse = await addOrder(params);
        this.$router.push({
          name: this.adType === 'c2c' ? 'c2c-order-buyer' : 'c2c-await-order',
          params: {
            orderId: res.id
          }
        });
        this.$message.success('__("下单成功")');
        this.done();
      } catch (err) {
        if (err.resMsg) {
          this.$message.fail(err.resMsg.message);
        }
      }
    }
  }
}
</script>

<style lang="scss">
.popup-bottom-enter,
.popup-bottom-leave-active {
  transform: translateY(100%);
  visibility: hidden;
}
.popup-bottom-enter-active,
.popup-bottom-leave-active {
  transition: all 0.3s;
}
.payin-form {
  &.popup-bottom {
    position: fixed;
    z-index: 2001;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f6f6fd;
    padding: 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

    .return-btn {
      width: 15px;
      height: 15px;
      border-top: 2px solid #313038;
      /* no */
      border-left: 2px solid #313038;
      /* no */
      transform: rotate(-45deg);
    }
  }
  .popup-close {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #000;
    width: 25px;
    height: 25px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 1px;
      /* no */
      background-color: #000;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
  .popup-payin {
    .popup-payin-head {
      padding: 30px;
      font-size: 16px;
      color: #000;
      @include bold;
    }
    .popup-payin-center {
      text-align: center;
    }
    .popuo-payin-content {
      padding: 0 25px 67px;
    }
    .popup-payin-amount {
      font-size: 30px;
      color: #000;
      margin-bottom: 18px;
      @include bold;
      span {
        color: var(--primary-color);
      }
      p {
        font-size: 12px;
        color: #636363;
        font-weight: normal;
      }
    }
    .popup-payin-switch {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;
      font-size: 14px;
      color: #636363;
      .switch {
        display: inline-flex;
        margin-left: 8px;
      }
    }
    .popup-payin-input {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid rgba($color: #705e5e, $alpha: 0.1); /* no */
      padding: 12px 17px;
      border-radius: 6px;
      font-size: 24px;
      color: #000;
      background-color: #fff;
      @include bold;
      input {
        width: 100%;
        border: none;
        outline: none;
      }
    }
    .popup-payin-form {
      margin: 8px 0;
    }
    .popup-payin-item {
      display: flex;
      justify-content: space-between;
      padding: 20px 0;
      font-size: 14px;
      color: #636363;
      & + .popup-payin-item {
        border-top: 1px solid rgba(81, 81, 81, 0.06); /* no */
      }
      .value {
        flex: 1;
        text-align: right;
        font-size: 16px;
        color: #000;
        @include bold;
      }
      .badge {
        padding: 0 2px;
        color: #fff;
        background-color: var(--primary-color);
        border-radius: 2px;
      }
    }

    .popup-payin-btn {
      button {
        position: relative;
        width: 100%;
        height: 44px;
        font-size: 16px;
        border: none;
        border-radius: 2px;
        color: #fff;
        background-color: var(--primary-color);
        @include bold;
        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background-color: #000;
          border: inherit;
          border-color: #000;
          border-radius: inherit;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          opacity: 0;
          content: ' ';
        }
        &:active::before {
          opacity: 0.1;
        }
      }
    }
  }
}
</style>
