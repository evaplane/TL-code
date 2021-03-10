import { Component, Mixins, Watch } from 'vue-property-decorator';
import { send, IWebsocketObserve } from '@/utils/websocket';
import market from '@/mixins/market/market';
import { isNotEmpty } from '@/utils/is';
import { Catch } from '@/utils/decorators';
import { IRate, getExchangeRate } from '@/api/market';
import { fixNumber } from '@/utils/math';

interface IQuotesItem {
  area: number;
  buy1Price: string;
  currrency: string;
  hightPrice: string;
  isLever: boolean;
  lastPrice: string;
  leverMultiple: number;
  lowPrice: string;
  market: string;
  marketShowName: string;
  riseRate: string;
  sell1Price: string;
  showName: string;
  vol: string;
  volText: string;
}
@Component
export default class TopDataMixins extends Mixins(market) {
  private websocketTopInstance: IWebsocketObserve | null = null;
  private rateTimer!: number;
  public mixinsRate: string = '1';
  public mixinsLoading = false;
  // eslint-disable-next-line
  public curMarketTopInfo = { lastPrice: '0', riseRate: '0.0' } as IQuotesItem;
  @Watch('mixinsMarketInfo', { deep: true })
  private async mixinsMarketInfoChange(): Promise<void> {
    this.mixinsLoading = true;
    this.mixinsRate = '1';
    await this.getRate();
    this.getTopData();
  }
  private destroyed(): void {
    this.rateTimer && window.clearTimeout(this.rateTimer);
    this.websocketTopInstance && this.websocketTopInstance.unsubscribe(true);
  }
  public get mixinsMoneyType(): string {
    let types: IObj<string> = {
      btc: '฿',
      usdt: '$',
      qc: '￥'
    };
    return types[this.mixinsFShowName] || this.mixinsFShowNameUp;
  }
  public get mixinsConvertLastPrice(): string {
    let lastPrice = Number(this.curMarketTopInfo.lastPrice),
      rate = Number(this.mixinsRate);
    if (rate > 0 && lastPrice > 0) {
      return fixNumber(lastPrice * rate, this.mixinsMoneyDecimal);
    }
    return '--';
  }
  @Catch()
  public async getRate(): Promise<void> {
    this.rateTimer && window.clearTimeout(this.rateTimer);
    let res = await getExchangeRate({
      market: this.mixinsTradeStr
    });
    let key: string = this.mixinsFShowName + 'cny';
    this.mixinsRate = res[key as keyof IRate] as string || '1';
    if (isNotEmpty(res.tickers) === true) {
      let [data] = res.tickers.filter((item): boolean => item[0] === this.mixinsTradeStr);
      this.curMarketTopInfo.lastPrice = data[2];
    }
    // 5秒重新获取
    this.rateTimer = window.setTimeout(this.getRate, 30000);
  }
  @Catch()
  public async getTopData(): Promise<void> {
    this.websocketTopInstance && this.websocketTopInstance.unsubscribe(true);
    this.websocketTopInstance = await send({
      isZip: true,
      binary: true,
      event: 'addChannel',
      channel: 'top_all_' + this.mixinsFShowName
    });
    if (this.websocketTopInstance) {
      this.websocketTopInstance.subscribe((res): void => {
        let list: IQuotesItem[] = res.datas;
        this.mixinsLoading = false;
        if (isNotEmpty(list) === true) {
          const [data] = list.filter((item): boolean => (item.currrency === this.mixinsCShowName));
          if (data) {
            data.volText = data.vol;
            if (Number(data.vol) > 1e4) {
              data.volText = fixNumber(Number(data.vol) / 1e4, 2) + '__("万")';
            }
            this.curMarketTopInfo = data;
            return;
          }
        }
        // eslint-disable-next-line
        this.curMarketTopInfo = { lastPrice: '0', riseRate: '0.0' } as IQuotesItem;
      }).catch((): void => {
        this.mixinsLoading = false;
      });
    }
  }
}
