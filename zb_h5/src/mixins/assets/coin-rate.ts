import { Vue, Component } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import { IRate } from '@/api/market';
import { isNotEmpty } from '@/utils/is';
import { multiply, fixDecimal } from '@/utils/math';

@Component
export default class MixinsCoinRate extends Vue {
  @State('rate', { namespace: 'market' }) private mixinsRate!: IRate;
  @State('lang', { namespace: 'lang' }) private mixinsLang!: string;
  @Action('getRate', { namespace: 'market' }) private getRate!: Function;

  public async mixinsGetRate(): Promise<void> {
    await this.getRate();
  }

  public mixinsGetAmount(coinName: string, count: number | string, decimal: number | string = 3): string {
    if (!coinName) {
      throw new Error('CoinName is null');
    }
    coinName = coinName.toString().toLowerCase();
    let price = this.mixinsGetPriceByCoinName(coinName);
    if (price === 0) {
      return '-';
    }
    return fixDecimal(multiply(price, count), Number(decimal));
  }

  public mixinsGetPriceByCoinName(coinName: string): number {
    let rate = 0;
    let res = this.mixinsRate;
    if (isNotEmpty(res.tickers) === true) {
      // 中国用户使用qc汇率
      if (this.mixinsLang === 'cn') {
        if (coinName === 'qc') {
          rate = 1;
        } else if (coinName === 'usdt') {
          rate = Number(res.usdtcny);
        }
      } else { // 其他使用美元汇率
        if (coinName === 'usdt') {
          rate = 1;
        } else if (coinName === 'qc') { // 因为没有qc_usdt交易对, 所以直接取usdtcny
          rate = 1 / Number(res.usdtcny);
        }
      }
      if (rate !== 0) {
        return rate;
      }
      let [qcRate, usdtRate] = [coinName + '_qc', coinName + '_usdt'].map((market: string): number => {
        let [result] = res.tickers.filter((item: string[]): boolean => item[0] === market);
        if (isNotEmpty(result) === true) {
          return Number(result[2]) || 0;
        }
        return 0;
      });
      if (this.mixinsLang === 'cn') {
        if (qcRate === 0) {
          if (usdtRate !== 0) {
            return usdtRate * Number(res.usdtcny);
          }
        }
        return qcRate;
      } else {
        if (usdtRate === 0) {
          if (qcRate !== 0) {
            return qcRate / Number(res.usdtcny);
          }
        }
        return usdtRate;
      }
    }
    return 0;
  }
}
