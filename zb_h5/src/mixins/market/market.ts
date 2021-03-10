import { Vue, Component, Watch } from 'vue-property-decorator';
import { Action } from 'vuex-class';
import { IMarketInfo } from '@/api/trade';
import { defaultMarketInfo } from '@/store/modules/market';

@Component
export default class MarketMixins extends Vue {
  @Action('getMarketInfoByName', { namespace: 'market' }) private getMarketInfoByName!: Function;
  public mixinsMarketInfo: IMarketInfo = defaultMarketInfo;
  public get mixinsTradeStr(): string { // btc_usdt
    let { type } = this.$route.params;
    if (!type) {
      // Vue.prototype.$message.fail('__("市场异常请刷新后重试")');
      // console.log(new Error('23'));
      return '';
    }
    return type;
  }
  public get mixinsTradeStrUnit(): string {
    return this.mixinsTradeStr.replace('_', '') || '';
  }
  public get mixinsTradeStrUp(): string { // BTC_USDT
    return this.mixinsTradeStr.toUpperCase();
  }
  public get mixinsCShowName(): string { // btc
    if (!this.mixinsTradeStr) return '';
    return this.mixinsTradeStr.split('_')[0];
  }
  public get mixinsFShowName(): string { // usdt
    if (!this.mixinsTradeStr) return '';
    return this.mixinsTradeStr.split('_')[1];
  }
  public get mixinsCShowNameUp(): string { // BTC
    return this.mixinsCShowName.toUpperCase();
  }
  public get mixinsFShowNameUp(): string { // USDT
    return this.mixinsFShowName.toUpperCase();
  }
  public get mixinsMoneyDecimal(): number {
    return this.mixinsMarketInfo.moneyDecimal || 5;
  }
  public get mixinsCoinDecimal(): number {
    return this.mixinsMarketInfo.coinDecimal || 5;
  }
  public get mixinsIsLever(): boolean {
    if (['trade-lever', 'loanin'].indexOf(this.$route.name || '') > -1) {
      return true;
    }
    if (this.$route.fullPath.indexOf('/lever/') === 0) {
      return true;
    }
    return ['true', true].indexOf(this.$route.query.isLever + '') > -1;
  }
  @Watch('mixinsTradeStr', { immediate: true })
  private async mixinsTradeStrWatch(name: string): Promise<any> {
    try {
      let marketInfo = await this.getMarketInfoByName({ name, isLever: this.mixinsIsLever });
      if (marketInfo !== null) {
        this.mixinsMarketInfo = marketInfo;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
