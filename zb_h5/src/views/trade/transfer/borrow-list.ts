import mixinsMarket from '@/mixins/market/market';
import { getLeverLoanList, IGetLeverLoanListParams, ILeverLoanItem } from '@/api/lever';
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { setSession } from '@/utils/storage';
@Component
export default class LeverBorrow extends Mixins(mixinsMarket) {
  params: IGetLeverLoanListParams = {
    coin: '',
    pageIndex: 1,
    pageSize: 15
  };
  loading: boolean = false;
  list: ILeverLoanItem[] = [];
  @Watch('$route', { immediate: true })
  _() {
    this.list = [];
    this.params.pageIndex = 1;
    if (this.$route.name === 'lever-borrow-coin') {
      this.params.coin = this.mixinsCShowName;
    } else {
      this.params.coin = this.mixinsFShowName;
    }
    this.getList();
  }
  scrollEndHandle() {
    this.getList();
  }
  toDetail(data: ILeverLoanItem) {
    setSession('--temp-borrow-info', data);
    this.$router.push({
      name: 'lever-borrow',
      params: {
        type: this.mixinsTradeStr
      },
      query: {
        coin: data.coinName
      }
    });
  }
  refresh() {
    this.params.pageIndex = 1;
    this.getList(true);
  }
  async getList(isRefresh?: boolean) {
    try {
      this.loading = true;
      let { loanList = [] } = await getLeverLoanList(this.params);
      isRefresh && (this.list = []);
      this.list = this.list.concat(loanList);
      this.params.pageIndex++;
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }
}
