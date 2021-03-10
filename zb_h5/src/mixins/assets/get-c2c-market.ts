import { Component, Vue } from 'vue-property-decorator';
import { getOtcMarket, IOtcMarketResponse } from '@/api/otc/market';

@Component
export default class GetC2cAd extends Vue {
  public mixinsPayinFormVisible: boolean = false;
  public mixinsCoins: IOtcMarketResponse[] = [];

  /** 获取 C2C O2C 市场 */
  public async getOtcMarket(): Promise<void> {
    try {
      this.mixinsCoins = await getOtcMarket();
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }
}
