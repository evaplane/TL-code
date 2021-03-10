import { Component, Vue } from 'vue-property-decorator';
@Component
export default class MixinsAreaList extends Vue {
  public get mixinsCoinTabList(): IObj<string> {
    if (this.$route.query.area === 'lever') {
      return {
        qc: '__("QC")',
        usdt: '__("USDT")'
      };
    }
    return {
      user: '__("自选区")',
      qc: '__("QC")',
      usdt: '__("USDT")',
      btc: '__("BTC")',
      pax: '__("PAX")',
      zb: '__("ZB")'
    };
  }
}
