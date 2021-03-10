<template>
  <div class="assets-withdraw">
    <div class="assets-box">
      <div class="assets-box-wrap" v-if="mixinsIsLegalCurrency === false">
        <div class="tab" v-if="mixinsWithdrawCoins.length">
          <span
            :class="{ 'tab-item--active': mixinsWithdrawCoinName === item.name }"
            :key="item.showName"
            @click="changeWithdrawCoinName(item.name)"
            class="tab-item"
            v-for="item in mixinsWithdrawCoins"
            >{{ item.showName }}</span
          >
        </div>
        <div class="input-wrap">
          <div class="input-control">
            <input placeholder="_" type="number" v-model="coinDownloadParams.cashAmount" />
            <span class="placeholder">提币数量</span>
          </div>
          <span class="input-unit">{{ coinName }}</span>
        </div>
        <p class="amount-tips">最多：{{ (coinDownloadConfig.canWithdraw || '0') + ' ' + coinName }}</p>
        <div class="btn-wrap">
          <a @click="submitWithdraw" class="btn btn-red" href="javascript:;">下一步</a>
        </div>
      </div>
      <div class="assets-box-wrap" v-else>
        <div class="tab">
          <span
            :class="{ 'tab-item--active': legalCurrencyName === 'qc' }"
            @click="changeLegalCurrencyName('qc')"
            class="tab-item"
            >QC</span
          >
          <span
            :class="{ 'tab-item--active': legalCurrencyName === 'usdt' }"
            @click="changeLegalCurrencyName('usdt')"
            class="tab-item"
            >USDT</span
          >
        </div>
        <div class="legal-currency-tips">
          由于当地法律法规限制，中币以及全球各大主要交易平台支持使用QC、USDT等与人民币、美元大概恒定价值的数字货币作为法币用于撮合交易的法币，您的本次充值将使用场外交易系统完成。
        </div>
        <div class="btn-wrap">
          <a class="btn">自定义</a>
          <a @click="withdrawalClickHandle" class="btn btn-red" href="javascript:;">闪电提现</a>
        </div>
      </div>
    </div>
    <div class="assets-record">
      <div class="record-title">提现记录</div>
      <div class="record-list">
        <div :key="i" class="record-item" v-for="(item, i) in payoutCoinRecordList">
          <dl class="item-left">
            <dt class="label">{{ Number(item.isInnerTransfer) === 0 ? '区块链转入' : '内部转入' }}</dt>
            <dd class="info">
              <p>{{ item.toAddress }}</p>
            </dd>
            <dd class="time">{{ item.submitTime | date('YYYY-MM-DD hh:mm:ss') }}</dd>
          </dl>
          <dl class="item-right">
            <dt class="price">{{ item.afterAmount + ' ' + mixinsCoinNameUp }}</dt>
            <dd class="state">{{ item.frontStatusDescr }}</dd>
          </dl>
        </div>
        <no-data :visible="payoutCoinRecordList.length === 0 && loading === false" />
      </div>
    </div>
    <transition name="popup-bottom">
      <div class="popup-bottom popup-withdraw" v-if="lastPopupType === 'Withdarw'">
        <div class="popup-head">
          <h2>确认提币</h2>
          <span @click="changePopupTypeQueue('')" class="close-btn">取消</span>
        </div>
        <div class="popup-tab">
          <div class="tab" v-if="mixinsWithdrawCoins.length">
            <div
              :class="{ 'tab-item--active': mixinsWithdrawCoinName === item.name }"
              :key="item.showName"
              @click="changeWithdrawCoinName(item.name)"
              class="tab-item"
              v-for="item in mixinsWithdrawCoins"
            >
              {{ item.showName }}
            </div>
          </div>
        </div>
        <!-- <h3>提币数量</h3>
        <p class="number">{{ coinDownloadParams.cashAmount }}</p>-->
        <div class="withdraw-address">
          <div @click="changePopupTypeQueue('AddressList')" class="select-address" v-if="addressItem">
            <p>{{ addressItem.memo }}</p>
            {{ addressItem.address }}
          </div>
          <div @click="changePopupTypeQueue('AddressForm')" class="no-address" v-else>
            <div class="text">提币地址</div>
          </div>
          <span @click="changePopupTypeQueue('AddressForm')" class="add-btn">
            <i class="icon-add"></i>
          </span>
        </div>
        <div class="network-cost">
          网络费用
          <span>{{ coinDownloadConfig.minFee || 0 }} {{ coinName }}</span>
        </div>
        <div class="input-wrap" v-if="isAssetsPassword">
          <div class="input-control">
            <input autocomplete="new-password" placeholder="支付密码" type="password" v-model.trim="withdrawAssetsPwd" />
            <span class="placeholder">支付密码</span>
          </div>
        </div>
        <div class="input-wrap" v-if="isPhoneEmail">
          <div class="input-control">
            <input autocomplete="off" placeholder="_" type="number" v-model.trim="coinDownloadParams.mobileCode" />
            <span class="placeholder">{{
              coinDownloadConfig.payMobileAuth ? '短信验证码' : coinDownloadConfig.payEmailAuth ? '邮箱验证码' : '动态验证码'
            }}</span>
          </div>
          <send-code
            :before-send="withdarwBeforeSendHandle"
            :captcha-params="{}"
            :send-params="withdrawSendCodeParams"
            ref="sendCode"
            text="点击获取"
          />
        </div>
        <div class="input-wrap" v-if="isGoogleCode">
          <div class="input-control">
            <input autocomplete="new-password" placeholder="_" type="number" v-model.trim="coinDownloadParams.googleCode" />
            <span class="placeholder">Google验证码</span>
          </div>
        </div>
        <div class="btn-wrap">
          <a @click="confirmWithdraw" class="btn btn-red" href="javascript:;">{{ withdrawing ? '确认中...' : '确认' }}</a>
        </div>
      </div>
    </transition>
    <!-- 地址列表 -->
    <address-list :back="changePopupTypeQueue" :coin-name="coinName" :visible="lastPopupType === 'AddressList'" />
    <!-- 添加提币地址 -->
    <address-from :back="changePopupTypeQueue" :coin-name="coinName" :visible="lastPopupType === 'AddressForm'" />
    <transition name="overlay">
      <div class="m-overlay" v-if="lastPopupType"></div>
    </transition>

    <payin-form :ad-obj="adObj" :visible.sync="mixinsPayinFormVisible">
      <template slot="title"
        >__('确认提现出售')</template
      >
    </payin-form>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixinsCurrencyConfig from '@/mixins/assets/currency-config';
import { encryptPwd } from '@/js/encode-pwd';
import addressFrom from '@/components/assets/address/form.vue';
import addressList from '@/components/assets/address/list.vue';
import {
  doCoinDownLoad,
  IDownloadCoinConfig,
  IDoCoinDownloadParams,
  getCoinAddress,
  ICoinAddressItem,
  getPayoutCoinRecord,
  IPayoutCoinRecordResponse,
  getDownloadCoinConfig
} from '@/api/assets';
import { Catch } from '@/utils/decorators';
import { isNotEmpty } from '@/utils/is';
import sendCode from '@/components/common/send-code/index.vue';
import payinForm from '@/components/c2c/payin/form.vue';
import { ctcList, IAdC2cResponse, IAdC2cParams } from '@/api/otc/ad';
import mixinsGetC2cMarket from '@/mixins/assets/get-c2c-market';
import { IUpdateAddressItem } from '@/store/modules/assets';
import { Getter, State, Action } from 'vuex-class';
import store from '@/store/store';

type TPopupType = 'AddressList' | 'AddressForm' | '' | 'Withdarw';
interface IWithdrawSendCodeParams {
  codeType: number;
  coin?: string;
  countryCode?: string;
  safePwd?: string;
}
@Component({
  components: {
    sendCode,
    addressFrom,
    addressList,
    payinForm
  }
})
export default class AssetsPayin extends Mixins(mixinsCurrencyConfig, mixinsGetC2cMarket) {
  withdrawSendCodeParams: IWithdrawSendCodeParams = {
    codeType: 1020,
    countryCode: ''
  };
  // eslint-disable-next-line
  coinDownloadConfig = {} as IDownloadCoinConfig;
  coinDownloadParams: IDoCoinDownloadParams = {
    opUnique: '', //	是	唯一码（当前时间戳）
    coinName: '', // 是	提现类型 btc / ltc / eth / etc
    receiveAddress: '', // 是	提现地址
    fees: '', //	是	手续费
    cashAmount: '', //	是	提现金额
    safePwd: '', //	是	安全密码
    mobileCode: '', //	是	动态验证码
    googleCode: '' //	否	google验证码
  };
  loading: boolean = false;
  withdrawing: boolean = false;
  withdrawAssetsPwd: string = '';
  payoutCoinRecordRes: IPayoutCoinRecordResponse = {
    list: [], //	{ } 提现信息
    total: 0, //	是		总条数
    totalNo: 0, //	是		总页数
    pageNo: 0, //	是		页数
    pageSize: 0 //		是		条数
  };
  safeTipVisible: boolean = false;
  legalCurrencyName: string = '';
  popupTypeQueue: TPopupType[] = [];
  adObj: IAdC2cResponse | null = null;
  coinMarketMap: IObj<string> = {
    rmb: 'cny'
  };

  get curMarket() {
    if (this.mixinsCoins.length) {
      let [coin] = this.mixinsCoins.filter(coin => coin.tradeCoinName.toLowerCase() === this.legalCurrencyName);
      const moneyUnit = this.coinMarketMap[this.mixinsCoinName] || this.mixinsCoinName;
      let [market] = coin.markets.filter(market => market.basicCoinName.toLowerCase() === moneyUnit);
      return market;
    }
    return null;
  }

  // 最后一个弹窗变量类型
  get lastPopupType(): TPopupType {
    let { length } = this.popupTypeQueue;
    return length ? this.popupTypeQueue[length - 1] : '';
  }
  get isAssetsPassword() {
    return this.coinDownloadConfig.safeAuth && [1, 2, 3].indexOf(this.mixinsUserInfo.payoutAuth) > -1;
  }
  get isPhoneEmail() {
    return (this.mixinsUserInfo.email || this.mixinsUserInfo.mobile) && [0, 1, 3].indexOf(this.mixinsUserInfo.payoutAuth) > -1;
  }
  get isGoogleCode() {
    return [0, 2, 3].indexOf(this.mixinsUserInfo.payoutAuth) > -1 && this.mixinsUserInfo.googleAuth !== 0;
  }
  get payoutCoinRecordList() {
    if (isNotEmpty(this.payoutCoinRecordRes) === true) {
      return this.payoutCoinRecordRes.list || [];
    }
    return [];
  }
  // 多区块id
  get blockChain(): string {
    if (this.mixinsWithdrawCoins.length > 0) {
      let [info] = this.mixinsWithdrawCoins.filter(item => item.name === this.mixinsWithdrawCoinName);
      if (info) {
        return info.fatherFundsType + '' || '';
      }
      return '';
    }
    return '';
  }
  @State('addressItem', { namespace: 'assets' }) addressItem!: ICoinAddressItem;
  @Getter('otcIsLogin', { namespace: 'otc' }) public mixinsOtcIsLogin!: boolean;
  @Getter('isLogin', { namespace: 'user' }) public mixinsZbIsLogin!: boolean;
  @Action('updateAddressItem', { namespace: 'assets' }) updateAddressItem!: IUpdateAddressItem;

  @Watch('mixinsZbIsLogin', { immediate: true })
  private isLoginWatch(isLogin: boolean): void {
    if (isLogin && !this.mixinsOtcIsLogin && this.mixinsIsLegalCurrency) {
      store.dispatch('otc/getOtcUserToken');
    }
  }

  @Watch('curMarket', { immediate: true, deep: true })
  curMarketWatcher() {
    if (this.curMarket) {
      this.getCtcList();
    }
  }
  @Watch('mixinsCoinName', { immediate: true })
  __() {
    // 法币转换
    let coinName = this.mixinsCoinName;
    if (['rmb', 'hkd'].indexOf(this.mixinsCoinName) > -1) {
      coinName = 'qc';
    } else {
      this.getDownloadCoinConfig(coinName);
    }
    this.legalCurrencyName = coinName;

    this.mixinsIsLegalCurrency && this.getOtcMarket();
    this.getPayoutCoinRecord(coinName);
  }

  /** 闪电充值 */
  withdrawalClickHandle() {
    if (this.adObj) {
      this.mixinsPayinFormVisible = true;
    } else {
      this.$message.fail('__("暂无广告")');
    }
  }

  /** 获取 c2c 广告列表 */
  async getCtcList() {
    if (this.curMarket === null) {
      return;
    }
    try {
      const params: IAdC2cParams = {
        marketId: this.curMarket.marketId + '',
        tradeType: 2
      };
      this.adObj = await ctcList(params);
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }
  async withdarwBeforeSendHandle() {
    this.withdrawSendCodeParams.coin = this.mixinsCoinName;
    if (this.isAssetsPassword === true) {
      if (this.coinDownloadParams.cashAmount <= this.coinDownloadConfig.minFee) {
        this.$message.warn('可提现金额不足，请充值!');
        return false;
      }
      if (!this.withdrawAssetsPwd) {
        this.$message.warn('请输入资金密码');
        return false;
      }
      this.coinDownloadParams.safePwd = this.withdrawSendCodeParams.safePwd = await encryptPwd(this.withdrawAssetsPwd);
      return true;
    }
    return true;
  }
  changeLegalCurrencyName(type: string) {
    this.legalCurrencyName = type;
    this.getPayoutCoinRecord(this.legalCurrencyName);
  }
  changeWithdrawCoinName(coinName: string) {
    this.mixinsWithdrawCoinName = coinName;
    this.getDownloadCoinConfig(coinName);
  }
  /**
   * 控制各个弹窗: 传入指定弹窗则弹出, 如果传入 ''则关闭所有, 传入-1则返回上一个弹窗
   */
  changePopupTypeQueue(type: TPopupType | number) {
    if (typeof type === 'number') {
      this.popupTypeQueue = this.popupTypeQueue.slice(0, this.popupTypeQueue.length + type);
      return;
    }
    this.popupTypeQueue.push(type);
  }
  async confirmWithdraw() {
    if (this.isPhoneEmail === true && !this.coinDownloadParams.mobileCode) {
      return this.$message.warn('请输入验证码');
    }
    if (this.isGoogleCode === true && !this.coinDownloadParams.googleCode) {
      return this.$message.warn('请输入Google验证码');
    }
    if (this.withdrawing === true) {
      this.$message.warn('确认中');
      return;
    }
    this.coinDownloadParams.coinName = this.mixinsCoinName;
    this.coinDownloadParams.opUnique = Date.now().toString();
    this.coinDownloadParams.blockChain = this.blockChain;
    this.coinDownloadParams.fees = this.coinDownloadConfig.minFee;
    this.coinDownloadParams.receiveAddress = this.addressItem.address;
    this.withdrawing = true;
    try {
      await doCoinDownLoad(this.coinDownloadParams);
      this.changePopupTypeQueue('');
      this.coinDownloadParams.cashAmount = '';
      this.$message.success('操作成功');
      window.setTimeout(() => {
        this.coinDownloadParams.mobileCode = this.coinDownloadParams.safePwd = this.coinDownloadParams.googleCode = '';
        this.getDownloadCoinConfig(this.legalCurrencyName);
        this.getPayoutCoinRecord(this.mixinsCoinName);
      }, 1000);
    } catch (err) {
      console.log(err);
    }
    this.withdrawing = false;
  }
  async getDownloadCoinConfig(coinName: string) {
    if (!this.mixinsCoinName) {
      return this.$message.warn('币种ID为空, 无法获取提现信息');
    }
    let res = await getDownloadCoinConfig(coinName, this.blockChain);
    this.coinDownloadConfig = res || {};
  }
  @Catch()
  async getWithdrawCoinAddress(coinName: string) {
    let res = await getCoinAddress(coinName, true, this.blockChain);
    if (res) {
      this.updateAddressItem(res.list[0]);
    } else {
      this.updateAddressItem(null);
    }
  }
  async submitWithdraw() {
    if (Number(this.coinDownloadConfig.canWithdraw) === 0) {
      return this.$message.warn('余额不足');
    }
    if (!Number(this.coinDownloadParams.cashAmount)) {
      return this.$message.warn('请输入正确提现数量');
    }
    this.changePopupTypeQueue('Withdarw');
    this.getWithdrawCoinAddress(this.mixinsCoinName);
  }
  async getPayoutCoinRecord(coinName: string) {
    try {
      this.loading = true;
      let res = await getPayoutCoinRecord(coinName, 1);
      this.payoutCoinRecordRes = res || {};
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }
}
</script>

<style lang='scss'>
.popup-withdraw {
  .withdraw-address {
    position: relative;
    .no-address {
      font-size: 14px;
      color: #abaeb7;
      height: 48px;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.05); /* no */
      border-radius: 4px; /* no */
      display: flex;
      align-items: center;
      padding: 0 15px;
    }
    .select-address {
      font-size: 12px;
      color: #73767b;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, 0.05); /* no */
      border-radius: 4px; /* no */
      padding: 15px;
      p {
        color: #313038;
        margin-bottom: 5px;
        font-size: 14px;
        @include bold;
      }
    }
    .add-btn {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      padding: 0 15px;
      .icon-add {
        width: 17px;
        height: 17px;
        position: relative;
        &::before,
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          height: 1px; /* no */
          background-color: #e91c41;
        }
        &::after {
          transform: rotate(90deg);
        }
      }
    }
  }
  .network-cost {
    font-size: 14px;
    height: 48px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.05); /* no */
    border-radius: 4px; /* no */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    margin: 15px 0;
    color: #73767b;
  }
}
</style>
