<template>
  <div v-loading="loading" class="c2c-ad-release">
    <header-back>
      <p v-if="isCheck">__('查看广告')</p>
      <div v-else class="c2c-tabs">
        <div
          v-for="(type, index) in adTypes"
          :key="index"
          class="c2c-tab-item"
          :class="{ active: adType === index }"
          @click="adType = index"
        >
          {{ type }}
        </div>
      </div>
    </header-back>

    <div class="line" />

    <div class="c2c-ad-container">
      <native-scroll>
        <van-cell-group>
          <van-cell v-if="isCheck">
            <label slot="title">__('交易类型')</label>
            <p class="big-font">{{ publishAdParams.type === 1 ? '__("买入")' : '__("卖出")' }}</p>
          </van-cell>
          <van-cell :is-link="!isCheck" @click="$router.push({ name: 'c2c-ad-select-coin' })">
            <label slot="title">__('交易币种')</label>
            <p class="big-font">{{ coin }}</p>
          </van-cell>
          <van-cell :is-link="!isCheck" @click="moneySheetVisible = true">
            <label slot="title">__('交易法币')</label>
            <p class="big-font">{{ moneyUnit }}</p>
          </van-cell>
          <van-cell>
            <label slot="title">__('交易数量')</label>
            <div class="input-wrap">
              <m-input itype="number" placeholder="__('请输入交易数量')" :disabled="isCheck" v-model="publishAdParams.amount" />
              <span class="unit">{{ coin }}</span>
            </div>
          </van-cell>
        </van-cell-group>
        <div v-if="!isCheck && adType === 1" class="balance-wrap">
          <p>__('可用余额：') {{ balance }}{{ coin }} <a @click="sellAllClickHandle">__('全部卖出')</a></p>
        </div>
        <van-cell-group>
          <van-cell class="payment">
            <label class="order-label" slot="title">__('付款方式'):</label>
            <div class="payment-list" :class="{ 'payment-list-reverse': paymentListIsReverse }">
              <div v-for="payment in paymentSelectList" :key="payment.id" class="payment-item">
                <label v-if="payment.bankName">{{ payment.bankName }}</label>
                <label v-if="payment.type === 2">__('微信支付')</label>
                <label v-if="payment.type === 3">__('支付宝')</label>
                <p>{{ payment.account }}</p>
              </div>
              <div v-if="!isCheck" class="payment-icon-wrap">
                <i class="icon-choice-payment" @click="paymentVisible = true" />
              </div>
            </div>
          </van-cell>
        </van-cell-group>

        <div class="line" />

        <van-cell-group>
          <van-cell v-if="!isCheck && (curMarket && curMarket.isOpenFloatPrice === 1)">
            <label slot="title">{{ isFloat ? '__("浮动价")' : '__("固定单价")' }}{{ adTypes[adType] }}</label>
            <m-switch v-model="isFloat" />
          </van-cell>
          <van-cell v-if="!isFloat">
            <label slot="title">__('固定单价')</label>
            <div class="input-wrap">
              <m-input v-model="publishAdParams.price" itype="number" placeholder="__('请输入单价')" :disabled="isCheck" />
              <span class="unit">{{ moneyUnit }}</span>
            </div>
          </van-cell>
        </van-cell-group>

        <van-cell-group v-if="isFloat">
          <van-cell>
            <label slot="title">__('市场参考价')</label>
            <div class="input-wrap">
              <span>{{ marketPrice || '--' }}</span>
              <span class="unit">{{ moneyUnit }}</span>
            </div>
          </van-cell>
          <van-cell>
            <label slot="title">__('浮动比例')</label>
            <div class="input-wrap">
              <m-input v-model="publishAdParams.floatPer" itype="number" :placeholder="placeholder" :disabled="isCheck" />
              <span class="unit">%</span>
            </div>
          </van-cell>
          <van-cell>
            <label slot="title">__('你的报价')</label>
            <div class="input-wrap">
              <m-input :value="quote" itype="number" placeholder="__('请输入你的报价')" disabled />
              <span class="unit">{{ moneyUnit }}</span>
            </div>
          </van-cell>
          <van-cell v-if="adType === 0">
            <label slot="title">__('可接受最高价')</label>
            <div class="input-wrap">
              <m-input
                v-model="publishAdParams.acceptMaxPrice"
                itype="number"
                placeholder="__('请输入最高价')"
                :disabled="isCheck"
              />
              <span class="unit">{{ moneyUnit }}</span>
            </div>
          </van-cell>
          <van-cell v-if="adType === 1">
            <label slot="title">__('可接受最低价')</label>
            <div class="input-wrap">
              <m-input
                v-model="publishAdParams.acceptMinPrice"
                itype="number"
                placeholder="__('请输入最低价')"
                :disabled="isCheck"
              />
              <span class="unit">{{ moneyUnit }}</span>
            </div>
          </van-cell>
        </van-cell-group>

        <div class="hint-wrap">
          <p v-if="isFloat">__('挂单发布后，报价随市场变化，每3分钟更新一次')</p>
          <p v-else>__('挂单发布后，报价不随市场波动而改变')</p>
        </div>

        <van-cell-group>
          <van-cell>
            <label slot="title">__('最小限额')</label>
            <div class="input-wrap">
              <m-input
                itype="number"
                v-model="publishAdParams.dealMinMoney"
                placeholder="__('请输入最小限额')"
                :disabled="isCheck"
              />
              <span class="unit">{{ moneyUnit }}</span>
            </div>
          </van-cell>
          <van-cell>
            <label slot="title">__('最大限额')</label>
            <div class="input-wrap">
              <m-input
                itype="number"
                v-model="publishAdParams.dealMaxMoney"
                placeholder="__('请输入最大限额')"
                :disabled="isCheck"
              />
              <span class="unit">{{ moneyUnit }}</span>
            </div>
          </van-cell>
          <van-cell :is-link="!isCheck" @click="showActions('kyc')">
            <label slot="title">__('最低客户KYC认证')</label>
            <p>{{ kycAction && kycAction.name }}</p>
          </van-cell>
          <!-- <van-cell :is-link="!isCheck" @click="showActions('score')">
            <label slot="title">__('最低客户评分要求')</label>
            <p>{{ scoreAction && scoreAction.name }}</p>
          </van-cell> -->
          <van-cell :is-link="!isCheck" @click="showActions('quantity')">
            <label slot="title">__('最少客户交易笔数')</label>
            <p>{{ dealQuantityAction && dealQuantityAction.name }}</p>
          </van-cell>
        </van-cell-group>

        <div class="line"></div>

        <div class="note-wrap" :class="{ 'no-border': isCheck }">
          <label>__('交易说明')</label>
          <m-input :disabled="isCheck" type="textarea" v-model="publishAdParams.remark"></m-input>
        </div>
        <div v-if="!isCheck" class="btn-wrap">
          <button @click="publishClickHandle">{{ isRepublish ? '__("重新发布")' : '__("立即发布")' }}</button>
        </div>
      </native-scroll>
    </div>

    <!-- 交易方式 -->
    <orderPopup :is-show-order-detail="paymentVisible">
      <payment-management
        v-model="paymentSelectList"
        :accountList="myAccountList"
        multi-select
        @foot-btn-click-handle="paymentVisible = false"
      />
    </orderPopup>

    <!-- KYC要求 -->
    <van-action-sheet
      :actions="kycListActions"
      :lazy-render="false"
      @select="kycSelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="kycSheetVisible"
    />

    <!-- 评分要求 -->
    <van-action-sheet
      :actions="scoreListActions"
      :lazy-render="false"
      @select="scoreSelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="scoreSheetVisible"
    />

    <!-- 交易笔数要求 -->
    <van-action-sheet
      :actions="dealQuantityListActions"
      :lazy-render="false"
      @select="dealQuantitySelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="dealQuantitySheetVisible"
    />

    <!-- 交易法币 -->
    <van-action-sheet
      :actions="moneyActions"
      :lazy-render="false"
      @select="moneySelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="moneySheetVisible"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import headerBack from '@/components/c2c/header-back/index.vue';
import mInput from '@/components/common/input/index.js';
import paymentManagement from '@/components/c2c/payment-management/index.vue';
import mSwitch from '@/components/common/switch/index.vue';
import nativeScroll from '@/components/common/native-scroll/index.vue';
import mixinsC2CCommon, { IActions } from '@/mixins/c2c/common-data';
import { IOtcMarketResponse } from '@/api/otc/market';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
import store from '@/store/store';
import { Getter } from 'vuex-class';
import { IOtcAccountResponse, accountList } from '@/api/otc/account';
import { IOtcPublishAdParams, publishAd, getByAdId, TAdType } from '@/api/otc/ad';
import { Route, Location } from 'vue-router';
import { setSession, removeSession, getSession } from '@/utils/storage';
import { getFundList, IOtcFundListResponse } from '@/api/otc/user';
import { send, IWebsocketObserve } from '@/utils/websocket';
import { divide, fixDecimal, multiply, plus } from '@/utils/math';
import orderPopup from '@/components/c2c/order-popup.vue';

interface IRouterNext {
  (config?: Location): void;
}
interface ITradeRecordItem {
  amount: string;
  date: number;
  price: string;
  tid: number;
  trade_type: string;
  type: string;
}
interface ITradeRecordData {
  data: ITradeRecordItem[];
  rate: string;
  no: number;
}

const RELEASE_PARAMS_KEY = 'otc_release_ad';

Component.registerHooks(['beforeRouteLeave']);

@Component({
  components: {
    headerBack,
    mInput,
    paymentManagement,
    mSwitch,
    nativeScroll,
    orderPopup
  }
})
export default class Release extends Mixins(mixinsC2CCommon, mixinsOtcGetUserToken) {
  adTypes: string[] = ['__("买单")', '__("卖单")'];
  websocketInstance!: IWebsocketObserve | null;
  loading: boolean = false;
  adType: number = 0;
  paymentSelectList: IOtcAccountResponse[] = [];
  paymentVisible: boolean = false;
  isFloat: boolean = false;
  kycSheetVisible: boolean = false;
  scoreSheetVisible: boolean = false;
  dealQuantitySheetVisible: boolean = false;
  moneySheetVisible: boolean = false;

  kycAction: IActions | null = null;
  scoreAction: IActions | null = null;
  dealQuantityAction: IActions | null = null;
  moneyAction: IActions = {
    name: '',
    value: ''
  };
  myAccountList: IOtcAccountResponse[] = [];

  publishAdParams: IOtcPublishAdParams = {
    type: 1, // 交易类型（1买，2卖）
    payWay: '',
    remark: '',
    marketId: -1,
    adType: 1, // 1-OTC 2-CTC
    price: '',
    accountIds: '',
    lessTradeCount: 0,
    amount: '',
    isFloat: 0,
    userId: '',
    floatPer: '',
    acceptMaxPrice: '',
    acceptMinPrice: '',
    dealMaxMoney: '',
    dealMinMoney: '',
    authLevel: 0,
    lessKycAuth: 0
  };

  coin: string = '';
  action: string = '';
  marketPrice: string = ''; // 市场参考价

  fundList: IOtcFundListResponse[] = [];

  @Getter('otcUserId', { namespace: 'otc' }) otcUserId!: string;
  @Getter('otcMarkets', { namespace: 'otc' }) otcMarkets!: IOtcMarketResponse[];
  @Getter('releaseAdMarket', { namespace: 'otc' }) releaseAdMarket!: IOtcMarketResponse | null;

  /**
   * OTC 登陆后获取账户详情
   */
  @Watch('mixinsOtcIsLogin', { immediate: true })
  otcIsLoginWatcher(otcIsLogin: boolean) {
    if (otcIsLogin) {
      this.getMyReceiveAccount();
      this.getFundList();
    }
  }

  @Watch('otcMarkets', { immediate: true })
  marketsWatcher(otcMarkets: IOtcMarketResponse[]) {
    if (!otcMarkets || otcMarkets.length === 0) {
      store.dispatch('otc/getOtcMarkets');
    } else if (!this.releaseAdMarket) {
      if (this.action === 'check') return;
      store.commit('otc/updateReleaseAdMarket', otcMarkets[0]);
    }
  }

  @Watch('releaseAdMarket', { immediate: true })
  releaseAdMarketWatcher(releaseAdMarket: IOtcMarketResponse | null) {
    if (this.action === 'check') return;
    if (releaseAdMarket) {
      this.coin = releaseAdMarket.tradeCoinName;
      const { basicCoinName, marketId } = releaseAdMarket.markets[0];
      this.moneyAction = {
        name: basicCoinName,
        value: '' + marketId
      };
      this.getMarketPrice();
    } else {
      this.coin = '';
    }
  }

  @Watch('isCheck', { immediate: true })
  isCheckWatcher(isCheck: boolean) {
    if (isCheck && this.adId !== '') {
      this.getAdById();
    }
  }

  @Watch('isRepublish', { immediate: true })
  isRepublishWatcher(isRepublish: boolean) {
    if (isRepublish && this.adId !== '') {
      this.getAdById();
    }
  }

  get fund() {
    const fund = this.fundList.find(fund => {
      return fund.currencyTypeId === (this.releaseAdMarket && this.releaseAdMarket.tradeCoin);
    });
    return fund;
  }
  get balance() {
    return (this.fund && this.fund.amount) || '--';
  }
  get kycListActions() {
    return this.mixinsKYCListActions.map(kyc => ({
      ...kyc,
      className: (this.kycAction && this.kycAction.value) === kyc.value ? 'van-action-sheet__item--active' : ''
    }));
  }
  get scoreListActions() {
    return this.mixinsScoreListActions.map(score => ({
      ...score,
      className: (this.scoreAction && this.scoreAction.value) === score.value ? 'van-action-sheet__item--active' : ''
    }));
  }
  get dealQuantityListActions() {
    return this.mixinsDealQuantityListActions.map(quantity => ({
      ...quantity,
      className:
        (this.dealQuantityAction && this.dealQuantityAction.value) === quantity.value ? 'van-action-sheet__item--active' : ''
    }));
  }
  get moneyActions() {
    if (!this.releaseAdMarket) return [];
    return this.releaseAdMarket.markets
      .filter(market => {
        return market.basicCoinName !== 'HKD';
      })
      .map(market => ({
        name: market.basicCoinName,
        value: '' + market.marketId,
        className: (this.moneyAction && +this.moneyAction.value) === market.marketId ? 'van-action-sheet__item--active' : ''
      }));
  }
  get moneyUnit() {
    return this.moneyAction && this.moneyAction.name;
  }
  get isCheck() {
    return this.action === 'check';
  }
  get isRepublish() {
    return this.action === 'republish';
  }

  get paymentListIsReverse() {
    // 获取布局样式，是否需要 flex-direction: row-reverse;
    return this.paymentSelectList.length <= 0 || (this.isCheck && this.paymentSelectList.length === 1);
  }

  get curMarket() {
    if (this.releaseAdMarket && this.moneyAction !== null) {
      return this.releaseAdMarket.markets.find(market => {
        return market.marketId === +this.moneyAction.value;
      });
    }
    this.isFloat = false;
    return null;
  }
  get adId() {
    return this.$route.query.id || '';
  }
  get placeholder() {
    return this.adType === 0 ? '__("建议-10-0")' : '__("建议0-10")';
  }
  /* 浮动广告报价 */
  get quote() {
    if (!this.marketPrice) return '';
    if (!this.publishAdParams.floatPer || isNaN(Number(this.publishAdParams.floatPer))) {
      return this.marketPrice;
    } else {
      // 报价为 行情 * (1 + 浮动比例)
      return multiply(this.marketPrice, plus(1, divide(this.publishAdParams.floatPer, 100)));
    }
  }

  /**
   * 获取市场价
   */
  async getMarketPrice() {
    const coinMap: IObj<string> = {
      CNY: 'qc',
      USD: 'usdt'
    };
    let coinSymbol = this.coin.toLowerCase();
    let moneySymbol = coinMap[this.moneyUnit];
    let reverse = false;

    if (coinSymbol === moneySymbol) {
      this.marketPrice = '1';
      return;
    }

    if (coinSymbol === 'qc' && moneySymbol === 'usdt') {
      // qc_usdt 交易对不存在，取 usdt_qc
      reverse = true;
      // 交易对互换
      [coinSymbol, moneySymbol] = [moneySymbol, coinSymbol];
    }

    this.websocketInstance && this.websocketInstance.unsubscribe(true);
    const channel = `${coinSymbol}${moneySymbol}_lasttrades`;
    this.websocketInstance = await send(
      {
        isZip: true,
        binary: true,
        channel,
        event: 'addChannel'
      },
      instance => {
        instance
          .subscribe((res: ITradeRecordData): void => {
            let list = res.data;
            let price = list[0].price;
            let tradeCoinPrecision = this.curMarket && this.curMarket.tradeCoinPrecision;
            this.marketPrice = reverse ? fixDecimal(divide(1, price), tradeCoinPrecision || 2) : price;
            this.websocketInstance && this.websocketInstance.unsubscribe(true);
          })
          .catch(() => {
            this.marketPrice = '';
          });
      }
    );
  }

  /**
   * 参数校验
   */
  paramsCheck(): boolean {
    if (!this.publishAdParams.amount || this.publishAdParams.amount === '0') {
      this.$message.fail('__("请输入交易数量")');
      return false;
    }
    if (!this.publishAdParams.payWay) {
      this.$message.fail('__("请选择付款方式")');
      return false;
    }

    if (this.publishAdParams.isFloat === 1) {
      // 浮动
      if (!this.publishAdParams.floatPer) {
        this.$message.fail('__("请输入浮动比例")');
        return false;
      }
      // 删除不必要字段
      delete this.publishAdParams.price;

      if (this.adType === 0) {
        // 买入时校验可接受最高价
        if (!this.publishAdParams.acceptMaxPrice) {
          this.$message.fail('__("请输入可接受最高报价")');
          return false;
        }
        delete this.publishAdParams.acceptMinPrice;
      } else {
        // 卖出时校验可接受对低价
        if (!this.publishAdParams.acceptMinPrice) {
          this.$message.fail('__("请输入可接受最低报价")');
          return false;
        }
        delete this.publishAdParams.acceptMaxPrice;
      }
    } else {
      if (!this.publishAdParams.price) {
        this.$message.fail('__("请输入单价")');
        return false;
      }
      // 删除不必要字段
      delete this.publishAdParams.floatPer;
      delete this.publishAdParams.acceptMaxPrice;
      delete this.publishAdParams.acceptMinPrice;
    }

    if (!this.publishAdParams.dealMinMoney) {
      this.$message.fail('__("请输入最小限额")');
      return false;
    }
    if (!this.publishAdParams.dealMaxMoney) {
      this.$message.fail('__("请输入最大限额")');
      return false;
    }
    return true;
  }

  async getMyReceiveAccount() {
    try {
      const res = await accountList({
        receive: 1,
        deleted: false,
        pageIndex: 1,
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

  async publishClickHandle() {
    if (!this.curMarket) return this.$message.fail('__("请选择交易法币")');
    if (!this.kycAction) return this.$message.fail('__("请选择最低客服KYC认证")');
    if (!this.dealQuantityAction) return this.$message.fail('__("请选择最少客户交易笔数")');

    let payWaysObj: { [x: number]: number } = {};
    let accountids: string[] = [];
    this.paymentSelectList.map(payment => {
      payWaysObj[payment.type] = payment.type;
      accountids.push(payment.accountId);
    });

    if (this.action === 'republish') {
      // 重发广告
      this.publishAdParams.adId = this.adId + '';
    }

    this.publishAdParams.type = (this.adType + 1) as TAdType;
    this.publishAdParams.payWay = Object.keys(payWaysObj).join(',');
    this.publishAdParams.accountIds = accountids.join(',');
    this.publishAdParams.marketId = this.curMarket.marketId;
    this.publishAdParams.lessKycAuth = +this.kycAction.value;
    this.publishAdParams.lessTradeCount = +this.dealQuantityAction.value;
    this.publishAdParams.userId = this.otcUserId;
    this.publishAdParams.isFloat = this.isFloat ? 1 : 0;

    if (!this.paramsCheck()) return;

    try {
      this.loading = true;
      await publishAd(this.publishAdParams);
      store.commit('otc/updateReleaseAdMarket', null);
      removeSession(RELEASE_PARAMS_KEY);
      this.$router.replace({
        name: 'c2c-ad-mine'
      });
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }

  /** 获取广告详情 */
  async getAdById() {
    try {
      this.loading = true;
      let res = await getByAdId(this.adId as string);
      this.adType = res.type - 1;
      this.publishAdParams.type = res.type;
      this.publishAdParams.remark = res.remark;
      this.publishAdParams.amount = res.amount;
      this.publishAdParams.price = res.price;
      this.publishAdParams.dealMinMoney = res.dealMinMoney;
      this.publishAdParams.dealMaxMoney = res.dealMaxMoney;

      this.isFloat = !!res.isFloat;
      this.coin = res.tradeCoinName;
      this.moneyAction = {
        name: res.basicCoinName,
        value: res.marketId + ''
      };

      const kycAction: IActions | undefined = this.mixinsKYCListActions.find((action: IActions): boolean => {
        return res.lessKycAuth === +action.value;
      });
      const dealQuantityAction: IActions | undefined = this.mixinsDealQuantityListActions.find((action: IActions): boolean => {
        return res.lessTradeCount === +action.value;
      });
      this.kycAction = kycAction || null;
      this.dealQuantityAction = dealQuantityAction || null;
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }
  async getFundList() {
    try {
      this.fundList = await getFundList();
    } catch (err) {
      console.log(err);
    }
  }

  sellAllClickHandle() {
    if (this.balance) {
      this.publishAdParams.amount = this.balance;
    }
  }

  saveParams() {
    setSession(RELEASE_PARAMS_KEY, {
      adType: this.adType,
      paymentSelectList: this.paymentSelectList,
      kycAction: this.kycAction,
      scoreAction: this.scoreAction,
      dealQuantityAction: this.dealQuantityAction,
      publishAdParams: this.publishAdParams,
      isFloat: this.isFloat
    });
  }

  showActions(action: string) {
    if (this.isCheck) return;
    if (action === 'kyc') {
      this.kycSheetVisible = true;
    }
    if (action === 'score') {
      this.scoreSheetVisible = true;
    }
    if (action === 'quantity') {
      this.dealQuantitySheetVisible = true;
    }
  }

  kycSelectHandle(data: IActions) {
    this.kycSheetVisible = false;
    this.kycAction = data;
  }
  scoreSelectHandle(data: IActions) {
    this.scoreSheetVisible = false;
    this.scoreAction = data;
  }
  dealQuantitySelectHandle(data: IActions) {
    this.dealQuantitySheetVisible = false;
    this.dealQuantityAction = data;
  }
  moneySelectHandle(data: IActions) {
    this.moneySheetVisible = false;
    this.moneyAction = data;
    this.marketPrice = '--';
    this.getMarketPrice();
  }

  mounted() {
    const releaseParams = getSession(RELEASE_PARAMS_KEY);
    if (releaseParams) {
      this.adType = releaseParams.adType;
      this.paymentSelectList = releaseParams.paymentSelectList;
      this.kycAction = releaseParams.kycAction;
      this.scoreAction = releaseParams.scoreAction;
      this.dealQuantityAction = releaseParams.dealQuantityAction;
      this.publishAdParams = releaseParams.publishAdParams;
      if (this.curMarket && this.curMarket.isOpenFloatPrice === 1) {
        this.isFloat = releaseParams.isFloat;
      }
    } else {
      this.kycAction = this.mixinsKYCListActions[0];
      this.scoreAction = this.mixinsScoreListActions[0];
      this.dealQuantityAction = this.mixinsDealQuantityListActions[0];
    }
    this.action = (this.$route.query.action || 'publish') as string;
  }

  beforeDestroy() {
    this.websocketInstance && this.websocketInstance.unsubscribe(true);
  }

  beforeRouteLeave(to: Route, from: Route, next: IRouterNext) {
    const saveParamsRouterNames = ['c2c-ad-select-coin', 'c2c-Payment', 'c2c-payment-mode'];
    if (saveParamsRouterNames.indexOf(to.name + '') > -1) {
      this.saveParams();
    } else {
      removeSession(RELEASE_PARAMS_KEY);
    }
    next();
  }
}
</script>

<style lang="scss">
.c2c-ad-release {
  display: flex;
  flex-direction: column;
  height: 100%;
  .c2c-ad-container {
    flex: 1;
    overflow: hidden;
  }
  .c2c-tabs {
    display: flex;
    width: 160px;
    height: 34px;
    margin: 0 auto;
    padding: 0;
    font-size: 14px;
    color: var(--primary-color);
    background-color: transparent;
    border-radius: 6px;
    border: 1px solid var(--primary-color); /* no */
    overflow: hidden;
  }
  .c2c-tab-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    text-align: center;
    transition: all 0.2s;
    &.active {
      color: #fff;
      background-color: var(--primary-color);
    }
  }
  .van-tabs__wrap,
  .van-tabs__nav {
    height: 100%;
    border-radius: 6px;
  }
  .van-tabs__nav {
    padding: 0;
    margin: 0;
  }
  .van-tab {
    width: 50%;
    line-height: 34px;
  }

  .van-cell--clickable:active {
    background-color: var(--default-bg);
  }

  label {
    font-size: 15px;
    color: var(--new-theme-color);
    white-space: nowrap;
  }
  .van-cell__value {
    font-weight: 500;
    font-size: 15px;
    color: var(--new-theme-color-3);
  }
  .big-font {
    font-size: 18px;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    .unit {
      text-align: right;
      margin-left: 10px;
    }
    .van-cell {
      padding: 0;
      &::after {
        display: none;
      }
    }
    input {
      font-size: 15px;
      text-align: right;
      color: var(--new-theme-color-3);
      &:disabled {
        color: var(--new-theme-color-3);
      }
    }
  }

  .balance-wrap,
  .hint-wrap,
  .note-wrap,
  .btn-wrap {
    padding: 0 var(--padding-lr);
  }

  .balance-wrap,
  .hint-wrap {
    padding-top: 6px;
    padding-bottom: 12px;
    font-size: 12px;
    color: var(--new-theme-color-6);
    background-color: var(--border-color);
    a {
      color: var(--new-theme-color-3);
    }
  }

  .van-cell {
    padding: 20px 15px;
  }

  .payment {
    padding: 20px 15px;
  }

  .payment-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
  .payment-list-reverse {
    flex-direction: row-reverse;
    .icon-choice-payment {
      margin-right: 0;
    }
  }
  .payment-item {
    padding: 2px 0 2px 10px;
    border-radius: 3px;
    border: 1px solid var(--primary-color); /* no */
    margin-right: 10px;
    margin-bottom: 10px;
    text-align: left;
    font-size: 13px;
    &:nth-child(3) {
      margin-bottom: 0;
    }
    p {
      line-height: 1.1;
      font-size: 12px;
      color: var(--primary-color);
    }
    label {
      line-height: 1.1;
      font-weight: 500;
      color: var(--primary-color);
    }
  }
  .payment-item,
  .payment-icon-wrap {
    width: calc(50% - 10px);
    height: 50px;
  }
  .icon-choice-payment {
    display: block;
    width: 50px;
    height: 50px;
    margin: 0 auto;
    background: url('~@img/c2c/zbicon-choice.svg') center no-repeat / contain;
  }
  .van-cell__value {
    flex: 2;
  }

  .switch {
    margin-left: auto;
  }

  .note-wrap {
    padding: 15px;
    border-bottom: 40px solid var(--border-color);
    .van-field {
      padding: 0;
      margin-top: 10px;
    }
    textarea {
      line-height: 1.4em;
      font-size: 15px;
      color: var(--new-theme-color-6);
    }
    &.no-border {
      border: 0;
    }
  }
  .btn-wrap {
    padding-bottom: 60px;
    background-color: var(--border-color);
    button {
      position: relative;
      width: 100%;
      height: 50px;
      font-size: 17px;
      font-weight: 600;
      border-radius: 25px;
      border: none;
      color: #fff;
      background-color: var(--primary-color);
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
</style>
