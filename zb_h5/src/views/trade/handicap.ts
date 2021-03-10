/* eslint @typescript-eslint/no-object-literal-type-assertion: off */
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixinsMarket from '@/mixins/market/market';
import orderBook from '@/components/trade/order-book.vue';
import slider from '@/components/common/slider/index.vue';
import keyboard from '@/components/common/virtual-keyboard/index.vue';
import virtualInp from '@/components/common/virtual-input/index.vue';
import { on, off } from '@/utils/event';
import { Action, State } from 'vuex-class';
import { send, IWebsocketObserve } from '@/utils/websocket';
import { Catch } from '@/utils/decorators';
import { IUserAsset } from '@/store/modules/user';
import { IGetAssetsFunction } from '@/store/modules/assets';
import { IRate, getExchangeRate } from '@/api/market';
import { doLimitEntrust, IDoLimitEntrustParams } from '@/api/trade';
import { isNotEmpty } from '@/utils/is';
import { divide, fixDecimal, fixNumber } from '@/utils/math';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import { ILeverTypes } from '@/api/lever';
import mSwitch from '@/components/common/switch/index.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';

interface IQuotesInfo {
  lastPrice: string;
  currrency: string;
}
interface IMoneyInfo {
  available: string;
}
interface ICoinInfo {
  available: string;
  freez: string;
}
@Component({
  components: {
    orderBook,
    slider,
    keyboard,
    virtualInp,
    mSwitch,
    helpDialog
  }
})
export default class Handicap extends Mixins(mixinsMarket, mixinsSignHooks) implements ISignHooks {
  moreInfoVisible = false;
  keyboardVisible = false;
  isSubmitBefore: boolean = false;
  websocketInstance: IWebsocketObserve | null = null;
  params: IDoLimitEntrustParams = {
    type: 0, // 交易类型 0 卖单 1 买单
    market: '', // 交易市场 btc_qc
    number: '', // 委托数量
    price: '', // 委托价格
    acctype: 0, // 资金账户类型 0 默认账户 1 杠杆账户
    safePwd: '' // 安全密码
  };
  lastPrice: string = '';
  submitLoading = false;
  sliderValue = 0;
  priceConvert = '';
  isSingleLayer: boolean = false;
  keyboardLabel: string = '';
  isInputChangeAnimation: boolean = false;
  pointList: HTMLDivElement[] = [];
  isOpenLever: boolean = false;
  leverTipsVisible: boolean = false;
  get isLeverEnable() {
    const { coinInfo, moneyInfo, leverCoinInfo } = this;
    return [coinInfo.available, coinInfo.freez, moneyInfo.available, leverCoinInfo.cLoanIn, leverCoinInfo.fLoanIn].every(
      amount => Number(amount) > 0
    );
  }
  get type(): string {
    let type = (this.$route.query.type as string) || 'buy';
    this.params.type = 0;
    if (type === 'buy') {
      this.params.type = 1;
    }
    return type;
  }
  get labelArr(): string[] {
    if (this.type === 'buy') {
      return ['买入'];
    }
    return ['卖出'];
  }
  get canBuyCoin() {
    return Number(this.params.price) > 0 ? `__('可买')${this.maxAvailable}` : `__('买入数量')`;
  }
  /** 强制平仓比例 */
  get leverForceRepayRate (): string {
    const numForceRepayRate = Number(this.mixinsMarketInfo.forceRepayRate);
    const rate = isNaN(numForceRepayRate) === false ? parseInt(numForceRepayRate * 100 + '', 0) : '-';
    return `当风险率<${rate}%时，账户将触发平仓以归还借贷资金`;
  }
  get realAvailable(): string {
    if (this.type === 'buy') {
      let price = Number(this.params.price) || 1;
      let coin = this.userAsset[this.mixinsFShowName];
      if (isNotEmpty(coin) === true) {
        return fixDecimal(divide(coin.available, price), this.mixinsMoneyDecimal);
      }
    } else if (this.type === 'sell') {
      let coin = this.userAsset[this.mixinsCShowName];
      if (isNotEmpty(coin) === true) {
        return fixDecimal(coin.available, this.mixinsCoinDecimal);
      }
    }
    return '0';
  }
  get maxAvailable(): string {
    if (this.mixinsIsLogin === false) {
      return this.params.number || '0';
    }
    let amount = this.realAvailable;
    if (Number(amount) === 0) {
      amount = this.params.number;
    }
    return amount || '0';
  }
  get coinInfo(): ICoinInfo {
    // 杠杆市场信息
    if (this.mixinsIsLever === true) {
      const { cAvailable, fFreeze } = this.leverCoinInfo;
      return {
        available: cAvailable + '',
        freez: fFreeze + ''
      };
    } else {
      // 现货信息
      if (isNotEmpty(this.userAsset) === true) {
        let { available, freez } = this.userAsset[this.mixinsCShowName];
        return {
          available,
          freez
        };
      }
    }
    return {} as ICoinInfo;
  }
  get moneyInfo(): IMoneyInfo {
    if (this.mixinsIsLever === true) {
      return {
        available: this.leverCoinInfo.fAvailable + ''
      };
    } else {
      if (isNotEmpty(this.userAsset) === true) {
        return this.userAsset[this.mixinsFShowName];
      }
    }
    return {} as IMoneyInfo;
  }
  get total(): string {
    let price = Number(this.params.price),
      number = Number(this.params.number);
    if (number && price) {
      return fixDecimal(price * number, this.mixinsMoneyDecimal);
    }
    return '0.00';
  }
  get leverStatusText(): string {
    const leverStatus: IObj<string> = {
      1: '正常',
      2: '强制平仓',
      3: '穿仓处理中',
      4: '穿仓已分币',
      5: '已穿仓'
    };
    return leverStatus[this.leverCoinInfo.status];
  }
  /** 风险率 */
  get leverRepayShow(): string {
    return this.leverCoinInfo.repayLeverShow ? this.leverCoinInfo.repayLeverShow.replace('>', '') : '-';
  }
  get leverUnwindPrice(): string {
    const { unwindPrice } = this.leverCoinInfo;
    return (
      (isNaN(Number(unwindPrice)) === false ? fixNumber(unwindPrice, this.mixinsMarketInfo.moneyDecimal) : '-') +
      ' ' +
      this.mixinsMarketInfo.fShowName
    );
  }
  get leverCoinInfo() {
    const { levers } = this.leverAssets;
    if (isNotEmpty(levers) === true) {
      const [leverCoin] = levers.filter(item => item.key === this.mixinsTradeStrUnit);
      if (isNotEmpty(leverCoin) === true) {
        return leverCoin;
      }
    }
    let defaultValue: string = this.mixinsIsLogin === true ? '0' : '-';
    return {
      fAvailable: defaultValue,
      cAvailable: defaultValue,
      fLoanIn: defaultValue,
      cLoanIn: defaultValue,
      fFreeze: defaultValue,
      cFreeze: defaultValue,
      status: 1,
      repayLeverShow: '',
      unwindPrice: ''
    };
  }
  '$refs': {
    submitBtn: HTMLButtonElement;
  };
  @State('lang', { namespace: 'lang' }) lang!: string;
  @State('userAsset', { namespace: 'user' }) userAsset!: IUserAsset;
  @State('leverAssets', { namespace: 'assets' }) leverAssets!: ILeverTypes;
  @Action('getSocketUserAsset', { namespace: 'user' }) getSocketUserAsset!: Function;
  @Action('userAssetUnsubscribe', { namespace: 'user' }) userAssetUnsubscribe!: Function;
  @Action('resetAssets', { namespace: 'user' }) resetAssets!: Function;
  @Action('getLeverAssets', { namespace: 'assets' }) getLeverAssets!: IGetAssetsFunction;
  @Watch('mixinsMarketInfo')
  _() {
    if (this.mixinsIsLogin === true) {
      this.getLeverAssets(true);
    }
    this.getData();
  }
  @Watch('mixinsIsLever', { immediate: true })
  _isLever() {
    this.isOpenLever = this.mixinsIsLever;
  }
  @Watch('params.price')
  __price() {
    this.isSubmitBefore = false;
  }
  @Watch('params.number')
  __() {
    this.isSubmitBefore = false;
    if (!Number(this.params.number) || !Number(this.maxAvailable)) {
      this.sliderValue = 0;
      return;
    }
    let val = Number(this.params.number) / Number(this.maxAvailable);
    this.sliderValue = parseInt((val * 100).toString());
  }
  openLeverClickHandle() {
    if (this.mixinsMarketInfo.isLever === false) {
      this.$message.warn('该市场暂时不支持杠杆交易');
      this.$nextTick(() => {
        this.isOpenLever = false;
      });
    }
  }
  openLeverChangeHandle() {
    this.$nextTick(() => {
      let { params, query } = this.$route;
      if (this.isOpenLever === true) {
        this.$router.push({ name: 'lever-handicap', params, query }).catch(() => {});
      } else {
        this.$router.push({ name: 'trade-handicap', params, query }).catch(() => {});
      }
    });
  }
  leverShowTips() {
    this.leverTipsVisible = true;
  }
  noop() {}
  borrowClickHandle() {
    if (this.mixinsCheckLoginStatus() === false) return;
    this.$router.push({ name: 'lever' });
  }
  priceInputHandle() {
    if (Number(this.params.price) > 0) {
      getExchangeRate({
        market: this.mixinsTradeStr
      }).then(res => {
        let key: string = this.mixinsFShowName + 'cny',
          rise = (res[key as keyof IRate] as string) || '1';
        this.priceConvert = fixDecimal(Number(rise) * Number(this.params.price), this.mixinsMoneyDecimal);
      });
    } else {
      this.priceConvert = '0.00';
    }
  }
  tabChangeHandle(type: string) {
    let { name, params, query } = this.$route;
    this.$router.push({ name, params, query: Object.assign({}, query, { type }) });
  }
  setHeight() {
    let topEl: HTMLDivElement | null = this.$el.querySelector('.handicap-top');
    if (topEl !== null) {
      topEl.style.height = (this.$el as HTMLDivElement).offsetHeight + 'px';
    }
  }
  openDetailHandle() {
    this.moreInfoVisible = !this.moreInfoVisible;
  }
  showBoard(type: string) {
    if (type === 'price') {
      this.keyboardLabel = '请输入' + this.labelArr[0] + '价格';
    } else if (type === 'amount') {
      this.keyboardLabel = '请输入' + this.labelArr[0] + '数量';
    }
    this.keyboardVisible = true;
  }
  @Catch()
  async submit() {
    try {
      this.keyboardVisible = false;
      if (this.mixinsCheckLoginStatus() === false) {
        return;
      }
      if (!Number(this.params.price)) {
        return this.$message.warn('__("请输入正确价格")');
      }
      if (!Number(this.params.number)) {
        return this.$message.warn('__("请输入正确数量")');
      }
      this.params.acctype = this.mixinsIsLever ? 1 : 0;
      if (this.type === 'buy' && Number(this.total) > Number(this.realAvailable)) {
        this.$message.warn('__("可用$1不足")'.replace('$1', this.mixinsFShowNameUp));
        return;
      }
      if (this.type === 'sell' && Number(this.params.number) > Number(this.realAvailable)) {
        this.$message.warn('__("可用$1不足")'.replace('$1', this.mixinsCShowNameUp));
        return;
      }
      if (this.isSubmitBefore === false) {
        this.isSubmitBefore = true;
        return;
      }
      this.submitLoading = true;
      this.params.market = this.mixinsTradeStr;
      await doLimitEntrust(this.params);
      this.isSubmitBefore = false;
      this.submitLoading = false;
      this.keyboardVisible = false;
      this.createPoint();
      this.params.number = '';
      window.setTimeout(() => {
        this.$message.success('__("委托提交成功")');
      }, 200);
    } catch (err) {
      this.submitLoading = false;
    }
  }
  createPoint() {
    let divEl = document.createElement('div');
    if (this.pointList.length > 1) {
      let el = this.pointList.pop();
      if (el) {
        divEl = el;
      }
    }
    divEl.className = 'red-point';
    document.body.appendChild(divEl);
    this.pointList.push(divEl);
    let rectBtn = this.$refs.submitBtn.getBoundingClientRect();
    divEl.style.left = rectBtn.left + 'px';
    divEl.style.top = rectBtn.top + 'px';
    divEl.style.transform = 'translate(0px, 0px)';
    divEl.style.transition = 'none';
    this.$nextTick(() => {
      let target = document.querySelector('.trade-entrust') as HTMLDivElement,
        { right, top } = target.getBoundingClientRect();
      let y = rectBtn.top - top;
      divEl.style.transform = `translate(${right - 7}px, ${-y + 5}px)`;
      divEl.style.left = '0px';
      divEl.style.transition = 'all .5s ease-out';
    });
  }
  sliderDragEndHandle(value: number) {
    this.params.number = fixDecimal((value / 100) * Number(this.maxAvailable), this.mixinsCoinDecimal);
  }
  @Catch()
  async getData() {
    this.websocketInstance = await send(
      {
        isZip: true,
        binary: true,
        event: 'addChannel',
        channel: 'top_all_' + this.mixinsFShowName
      },
      instance => {
        instance
          .subscribe(res => {
            let list: IQuotesInfo[] = res.datas;
            if (isNotEmpty(list) === true) {
              const [data] = list.filter(item => item.currrency === this.mixinsCShowName);
              this.lastPrice = '0';
              if (isNotEmpty(data) === true) {
                this.lastPrice = data.lastPrice;
              }
            }
          })
          .catch(() => {
            this.lastPrice = '';
          });
      }
    );
  }
  created() {
    let timer: number = 0;
    this.$bus.$on('handicap.vue:current-price', (price: string, amount: string) => {
      this.params.price = price;
      this.params.number = amount;
      this.isInputChangeAnimation = true;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        this.isInputChangeAnimation = false;
      }, 1000);
    });
  }
  signIn() {
    this.getSocketUserAsset(this.mixinsTradeStr);
  }
  // 登出
  signOut() {
    // 清空资产
    this.resetAssets();
  }
  mounted() {
    this.setHeight();
    on(document, 'resize', this.setHeight);
  }
  beforeDestroy() {
    off(document, 'resize', this.setHeight);
    this.$bus.$off('handicap.vue:current-price');
    this.websocketInstance && this.websocketInstance.unsubscribe(true);
    this.userAssetUnsubscribe();
  }
}
