import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import virtualInput from '@/components/common/virtual-input/index.vue';
import { mSelect, mOption } from '@/components/common/select/index';
import sort from '@/components/common/sort/sort.vue';
import { ISortOptions } from '@/components/common/sort/sort';
import sortOption from '@/components/common/sort/sort-option.vue';
import listFilter from '@/components/c2c/list-filter.vue';
import { IFilterObj } from '@/components/c2c/list-filter';
import mixinsC2CCommon, { IActions } from '@/mixins/c2c/common-data';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
import helpDialog from '@/components/common/help-dialog/index.vue';
import nativeScroll from '@/components/common/native-scroll/index';
import { tab, tabItem } from '@/components/common/tab/index';
import mSwitch from '@/components/common/switch/index.vue';
import keyboard from '@/components/common/virtual-keyboard/index.vue';
import { getOtcMarket, IOtcMarketResponse } from '@/api/otc/market.ts';
import { IAdC2cParams, IAdC2cResponse, ctcList, list, IAdListParams, IAdListResponseResult } from '@/api/otc/ad.ts';
import { OtcCheckAuth } from '@/utils/otc-auth-check';
import { State, Getter } from 'vuex-class';
import { IOtcUser } from '@/api/otc/user';
import { Dialog } from 'vant';
import payinForm from '@/components/c2c/payin/form.vue';
import { min, divide, fixNumber, multiply, stringOrNumber, plus } from '@/utils/math';

@Component({
  components: {
    virtualInput,
    mSelect,
    mOption,
    keyboard,
    sort,
    tab,
    tabItem,
    sortOption,
    listFilter,
    helpDialog,
    mSwitch,
    payinForm
  }
})
export default class C2CSquare extends Mixins(mixinsC2CCommon, mixinsOtcGetUserToken) {
  @Prop({ type: Number, default: 0 }) headerOffsetHeight!: number;
  @State('theme', { namespace: 'theme' }) theme!: string;
  isFixed: boolean = false;
  tradeInfoOffsetHeight: number = 0;
  c2cInfoOffsetHeight: number = 0;
  lineOffsetHeight: number = 0;
  tabCoinOffsetHeight: number = 0;
  orderBarOffsetHeight: number = 0;
  marketLoading: boolean = false;
  c2cLoaded: boolean = false;
  loaded: boolean = false;
  tabType: string = '';
  checked: boolean = false;
  payWays: string = '';
  moneySheetVisible: boolean = false;
  paySheetVisible: boolean = false;
  keyboardVisible: boolean = false;
  c2cHelpVisible: boolean = false;
  listFilterVisible: boolean = false;
  coinSheetVisible: boolean = false;
  moneyAction: IActions | null = null;
  amount: string = '1000';
  focusAmount: string = '';
  coins: IOtcMarketResponse[] = [];
  c2cData: IAdC2cResponse | null = null;
  otcAdListParams: IAdListParams = {
    amountType: 2,
    amount: null,
    pageSize: 20,
    marketId: '1',
    pageIndex: 1,
    payWays: '',
    creditSort: null,
    priceSort: null,
    kycSort: null,
    serviceSort: null
  };
  otcAdList: IAdListResponseResult[] = [];
  payinFromVisible: boolean = false;
  adObj: IAdC2cResponse | IAdListResponseResult | null = null;
  get coinsList() {
    const coinsList = this.coins.map(
      (coin): IActions => ({
        value: coin.tradeCoin + '',
        name: coin.tradeCoinName
      })
    );
    return coinsList.length === 0 ? this.mixinsCoinListActions : coinsList;
  }
  get curCoin(): IOtcMarketResponse | null {
    if (this.coins.length) {
      let [curItem] = this.coins.filter(item => this.tabType === item.tradeCoin + '');
      return curItem;
    }
    return null;
  }
  get moneyList() {
    if (this.curCoin) {
      return this.curCoin.markets.map(
        (market): IActions => ({
          value: market.marketId + '',
          name: market.basicCoinName
        })
      );
    }
    return [];
  }
  get marketId(): string {
    return (this.moneyAction && this.moneyAction.value) || '';
  }
  get type() {
    return this.$route.params.type;
  }
  get typeBackground() {
    if (this.type === 'buy') {
      return 'buy-bg';
    }
    return 'sell-bg';
  }
  get labelArr() {
    if (this.$route.params.type === 'buy') {
      return ['__("买入")'];
    }
    return ['__("卖出")'];
  }
  get hasOtcAdData(): boolean {
    return this.otcAdList.length > 0;
  }
  get coinActions() {
    return this.coinsList.map(coin => ({
      ...coin,
      className: this.tabType === coin.value ? 'van-action-sheet__item--active' : ''
    }));
  }
  get moneyActions() {
    return this.moneyList
      .filter(money => {
        return money.name !== 'HKD';
      })
      .map(money => ({
        ...money,
        className: (this.moneyAction && this.moneyAction.value) === money.value ? 'van-action-sheet__item--active' : ''
      }));
  }
  get payActions() {
    return this.morePayways.map(pay => ({
      ...pay,
      className: this.payWays === pay.value ? 'van-action-sheet__item--active' : ''
    }));
  }

  get normalPayways() {
    const allPayActions = [...this.mixinsPayActions];
    const normalPayways = allPayActions.splice(0, 3);
    return normalPayways;
  }

  get morePayways() {
    return [...this.mixinsPayActions].slice(3);
  }

  get curPayways() {
    return this.morePayways.filter(payway => payway.value === this.payWays);
  }

  get moneyUnit() {
    return this.moneyAction && this.moneyAction.name.toUpperCase();
  }
  get showNodata() {
    return this.loaded && this.otcAdList.length === 0;
  }

  get placeholder() {
    const type = this.type === 'buy' ? '__("购买")' : '__("卖出")';
    const unit = this.checked ? '__("数量")' : '__("金额")';
    return '__("请输入")' + type + unit;
  }

  get fixedBound() {
    return this.tradeInfoOffsetHeight + this.c2cInfoOffsetHeight + this.lineOffsetHeight;
  }

  @Getter('otcUserInfo', { namespace: 'otc' }) otcUserInfo!: IOtcUser;

  '$refs': {
    sortComp: sort;
    nativeScroll: nativeScroll;
    tradeInfo: HTMLDivElement;
    c2cInfo: HTMLDivElement;
    line: HTMLDivElement;
    tabCoin: HTMLDivElement;
    orderBar: HTMLDivElement;
  };

  @Watch('curCoin')
  curCoinWatch(curCoin: IOtcMarketResponse | null) {
    if (curCoin) {
      const { marketId, basicCoinName } = curCoin.markets[0];
      this.moneyAction = {
        value: marketId + '',
        name: basicCoinName
      };
    }
  }

  @Watch('checked')
  checkedChange() {
    this.resetList();
  }

  @Watch('type')
  @Watch('marketId', { immediate: true })
  _() {
    this.$refs.nativeScroll && this.$refs.nativeScroll.reset();
    this.c2cData = null;
    if (this.marketId) {
      this.resetList();
    }
  }

  @Watch('c2cData', { immediate: true })
  c2cDataWatcher() {
    this.$nextTick(() => {
      this.c2cInfoOffsetHeight = this.$refs.c2cInfo ? this.$refs.c2cInfo.offsetHeight : 0;
    });
  }

  @Watch('theme', { immediate: true })
  themeWatcher() {
    this.setElementHeight();
  }

  scrollHandle(pos: INativeScrollPos) {
    this.isFixed = this.fixedBound < pos.y;
  }

  plus(num1: stringOrNumber, num2: stringOrNumber) {
    return plus(num1, num2);
  }
  min(num1: stringOrNumber, num2: stringOrNumber) {
    return min(num1, num2);
  }
  divide(num1: stringOrNumber, num2: stringOrNumber) {
    return divide(num1, num2);
  }
  multiply(num1: stringOrNumber, num2: stringOrNumber) {
    return multiply(num1, num2);
  }
  fixNumber(num: stringOrNumber, precision: number) {
    return fixNumber(num, precision);
  }

  filterHandle(filterObj: IFilterObj) {
    this.amount = filterObj.amount;
    this.payWays = filterObj.payWays;
    this.moneyAction =
      this.moneyActions.find(item => {
        return item.value === filterObj.marketId;
      }) || null;
    this.resetList();
  }

  confirmHandle() {
    this.keyboardVisible = false;
    this.resetList();
  }

  focusHandle() {
    this.keyboardVisible = true;
    this.focusAmount = this.amount;
  }

  blurHandle() {
    this.keyboardVisible = false;
    if (this.focusAmount !== this.amount) {
      this.resetList();
    }
    this.focusAmount = this.amount;
  }

  getPaywayClasses(ad: IAdC2cResponse | IAdListResponseResult): string[] {
    const paywayClassMap: IObj<string> = {
      1: 'zbicon-icon-creditcard',
      2: 'zbicon-icon-wechat',
      3: 'zbicon-icon-alipay',
      4: 'bg-icon zbicon-icon-paypal',
      5: 'bg-icon zbicon-icon-western-union',
      6: 'bg-icon zbicon-icon-swift'
    };
    let paywayClasses: string[] = [];
    this.toPayWay(ad.payWay).map(paywayKey => {
      paywayClasses.push(paywayClassMap[paywayKey]);
    });
    return paywayClasses;
  }

  toPayWay(payway: string): string[] {
    return payway ? payway.split(',').map(i => i + '') : [];
  }
  scrollEndHandle() {
    this.getOnlineAdList();
  }
  resetList() {
    this.payinFromVisible = false;
    this.loaded = false;
    this.otcAdListParams.pageIndex = 1;
    this.getOnlineAdList(true);
    this.getCtcList();
  }
  refresh() {
    this.resetList();
  }
  async getOnlineAdList(isRefresh?: boolean) {
    try {
      // 数额类型 1-数量 2-金额
      this.otcAdListParams.amountType = this.checked ? 1 : 2;
      this.otcAdListParams.marketId = this.marketId;
      // tradeType 1 我买币, 2 我要卖币
      this.otcAdListParams.tradeType = this.type === 'buy' ? 1 : 2;
      this.otcAdListParams.amount = this.amount ? Number(this.amount) : null;
      this.otcAdListParams.payWays = this.payWays;
      let res = await list(this.otcAdListParams);

      const otcAdList = res.results || [];
      isRefresh && (this.otcAdList = []);
      this.otcAdList = this.otcAdList.concat(otcAdList);
      this.otcAdListParams.pageIndex += 1;
      this.$nextTick(() => {
        this.orderBarOffsetHeight = this.$refs.orderBar ? this.$refs.orderBar.offsetHeight : 0;
      });
    } catch (err) {
      console.log(err);
    }
    this.loaded = true;
  }

  async getCtcList() {
    try {
      this.c2cLoaded = false;
      const params: IAdC2cParams = {
        // 数额类型 1-数量 2-金额
        amountType: this.checked ? 1 : 2,
        payWays: this.payWays,
        marketId: this.marketId,
        // tradeType 1 我买币, 2 我要卖币
        tradeType: this.type === 'buy' ? 1 : 2
      };
      this.c2cData = await ctcList(params);
    } catch (err) {}
    this.c2cLoaded = true;
  }

  @OtcCheckAuth({ checkPhone: false, checkCancelTimes: true })
  c2cOneKeyClickHandle() {
    if (!this.amount || Number(this.amount) === 0) {
      return this.$message.warn('__("请输入")' + this.labelArr[0] + (this.checked ? '__("数量")' : '__("金额")'));
    }
    this.adObj = this.c2cData;
    this.payinFromVisible = true;
  }

  @OtcCheckAuth({ checkCancelTimes: true })
  goConfirm(type: 'c2c' | 'otc', ad: IAdListResponseResult | IAdC2cResponse) {
    const { lessKycAuth, lessTradeCount } = ad;
    if (lessKycAuth === 9 && this.otcUserInfo.authStatus > 9) {
      return Dialog.confirm({
        title: '__("提示")',
        message: '__("抱歉，该广告商家限制仅和视频认证的用户进行交易")',
        messageAlign: 'left',
        confirmButtonText: '__("去认证")'
      });
    }
    if (lessTradeCount > this.otcUserInfo.totalTradeTimes) {
      return Dialog.alert({
        title: '__("提示")',
        message: `抱歉，该广告商家限制仅和交易超过${lessTradeCount}笔的用户进行交易`,
        messageAlign: 'left',
        confirmButtonText: '__("我知道了")'
      });
    }
    this.adObj = ad;
    this.payinFromVisible = true;
  }

  sortChangeHandle(info: ISortOptions) {
    const sort = {
      creditSort: null,
      priceSort: null,
      kycSort: null,
      serviceSort: null
    };

    if (info.type === 'asc') {
      (sort as any)[info.name] = 1;
    }

    if (info.type === 'desc') {
      (sort as any)[info.name] = 2;
    }
    this.otcAdListParams = Object.assign(this.otcAdListParams, sort);
    this.resetList();
  }

  payWayChangeHandle(type: string) {
    // 通用的付款方式可以取消选择
    const normalPaywayVals = this.normalPayways.map(payway => {
      return payway.value;
    });
    if (normalPaywayVals.indexOf(type) > -1) {
      this.payWays = type === this.payWays ? '' : type;
      this.resetList();
    } else if (this.payWays !== type) {
      this.payWays = type;
      this.resetList();
    }
  }
  paySelectHandle(data: IActions) {
    this.paySheetVisible = false;
    this.payWayChangeHandle(data.value);
  }
  helpClickHandle() {
    this.c2cHelpVisible = true;
  }
  moneySelectHandle(data: IActions) {
    this.moneySheetVisible = false;
    this.moneyAction = data;
  }
  tabSelectHandle(tab: IActions) {
    this.coinSheetVisible = false;
    this.tabType = tab.value;
  }
  noop() {}
  tabChangeHandle() {}

  async getOtcMarket() {
    try {
      this.marketLoading = true;
      this.coins = await getOtcMarket();
      this.tabType = this.coins[0].tradeCoin + '';
    } catch (err) {
      console.log(err);
    }
    this.marketLoading = false;
  }

  setElementHeight() {
    this.$nextTick(() => {
      this.tradeInfoOffsetHeight = this.$refs.tradeInfo ? this.$refs.tradeInfo.offsetHeight : 0;
      this.lineOffsetHeight = this.$refs.line ? this.$refs.line.offsetHeight : 0;
      this.tabCoinOffsetHeight = this.$refs.tabCoin ? this.$refs.tabCoin.offsetHeight : 0;
    });
  }

  mounted() {
    this.getOtcMarket();
    this.focusAmount = this.amount;
  }
}
