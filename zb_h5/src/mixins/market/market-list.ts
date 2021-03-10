
import { Component, Vue } from 'vue-property-decorator';
import { Catch } from '@/utils/decorators';
import { send, IWebsocketObserve } from '@/utils/websocket';
import { State, Getter } from 'vuex-class';
import { IUser } from '@/store/modules/user.ts';
import { fixDecimal, divide, toPrecision, fixNumber, multiply } from '@/utils/math';
import { IRate, getExchangeRate } from '@/api/market';
import { getUnitName } from '@/js/coin-name';

export interface ISocketMarketInfo {
  area: number;
  currrency: string;
  hightPrice: string;
  isLever: boolean;
  lastPrice: string;
  lastPriceConvert: string;
  leverMultiple: number;
  lowPrice: string;
  market: string;
  marketShowName: string;
  riseRate: string;
  showName: string;
  vol: string;
  extendMoneyNameUp: string;
  extendCoinVolStr: string;
  extendCoinAlias: string;
}

interface ISocketResponse {
  channel: string;
  dataType: string;
  datas: ISocketMarketInfo[];
}
@Component
export default class MarketList extends Vue {
  public mixinsList: ISocketMarketInfo[] = [];
  public mixinsMarketLoading: boolean = true;
  public websocketObserve?: IWebsocketObserve | null;
  public rate: IRate = {
    btccny: '',
    usdtcny: '',
    qccny: '',
    tickers: []
  };
  public timer!: number;
  public mixinsMarket: string = '';
  @State('userInfo', { namespace: 'user' }) public userInfo!: IUser;
  @Getter('isLogin', { namespace: 'user' }) public isLogin!: boolean;
  // 汇率
  private get exchangeRate(): string {
    let result = this.rate.tickers.find((item): boolean => {
      return item[0].split('_')[0] === this.mixinsMarket;
    });
    if (result) {
      return result[2];
    }
    return '1';
  }
  @Catch()
  private async getRate(): Promise<void> {
    if (this.mixinsMarket === 'qc') return;
    window.clearTimeout(this.timer);
    this.rate = await getExchangeRate({ market: `${this.mixinsMarket}_qc` });
    this.timer = window.setTimeout(this.getRate, 15000);
  }
  private formatList(list: ISocketMarketInfo[]): void {
    this.mixinsList = list.map((item): ISocketMarketInfo => {
      let [, moneyName] = item.market.toUpperCase().split('/');
      item.extendMoneyNameUp = moneyName;
      item.lastPriceConvert = this.rateCoin(item.lastPrice);
      item.extendCoinVolStr = this.coinVol(item.vol);
      item.extendCoinAlias = getUnitName(item.showName);
      ['hightPrice', 'lastPrice', 'lowPrice', 'vol'].map((prop): void => {
        if (isNaN((item as any)[prop]) === false) {
          (item as any)[prop] = toPrecision((item as any)[prop]);
        }
      });
      return item;
    });
  }
  private rateCoin(num: string): string {
    if (!num) return '--';
    if (this.mixinsMarket === 'qc') {
      return fixNumber(multiply(num, 1), 2);
    }
    if (this.exchangeRate === '1') {
      return '--';
    }
    return fixNumber(multiply(num, this.exchangeRate), 2);
  }
  private coinVol(val: string): string {
    if (Number(val) >= 1e4) {
      return fixDecimal(divide(val, 1e4), 1) + '__("万")';
    }
    return val + '';
  }
  private beforeDestroy(): void {
    window.clearTimeout(this.timer);
    this.websocketObserve && this.websocketObserve.unsubscribe(true);
  }
  @Catch()
  public async mixinsGetMarketList(market: string): Promise<void> {
    this.mixinsMarket = market;
    this.getRate();
    this.mixinsMarketLoading = true;
    this.websocketObserve && this.websocketObserve.unsubscribe(true);
    let channel = market !== 'user' ? `top_all_${market}` : 'push_user_market';
    this.websocketObserve = await send({
      binary: true,
      channel,
      event: 'addChannel',
      isZip: true,
      userId: this.isLogin ? this.userInfo.userId : ''
    }, (instance): void => {
      instance.subscribe((res: ISocketResponse): void => {
        this.mixinsMarketLoading = false;
        res && this.formatList(res.datas);
      }).catch((): void => { this.mixinsMarketLoading = false; });
    });
  }
}
