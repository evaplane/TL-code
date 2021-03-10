import { Component, Vue } from 'vue-property-decorator';
import { getRepayList, IRepayListResponseTypes, ILoanRecordItem, doRepay, getLoanRecordList, getBorrowStats } from '@/api/lever';
import { getSession } from '@/utils/storage';
import mInput from '@/components/common/input/index.vue';
import leverHeader from '@/components/lever/header.vue';
import { plus } from '@/utils/math';
@Component({
  components: {
    mInput,
    leverHeader
  }
})
export default class ReturnDetail extends Vue {
  repayAmount: string = '';
  // eslint-disable-next-line
  info = {} as ILoanRecordItem;
  loading: boolean = false;
  list: IRepayListResponseTypes[] = [];
  available: string = '-';
  get coinShowName() {
    return this.info.coinShowName || '';
  }
  get rate() {
    let rateShow = Number(this.info.rateShow);
    return rateShow > 0 ? rateShow + '%' : '-';
  }
  get amount() {
    return plus(this.info.amount || 0, this.info.hasRepay || 0) || '0';
  }
  get arrearsAmount() {
    return plus(this.info.arrearsLx || 0, this.info.amount || 0) || 0;
  }
  get marketName(): string {
    const { market } = this.$route.query;
    return market ? market + '' : '';
  }
  get returnEnable() {
    return this.info.status === 1 && !!this.marketName && Number(this.arrearsAmount) > 0;
  }
  get ids(): string {
    return this.$route.params.id + '';
  }
  get isCoin() {
    const coinName = this.info.coinShowName.toLowerCase();
    // btcusdt 匹配市场交易对结尾
    if (new RegExp(coinName + '$').test(this.marketName) === true) {
      return false;
    } else if (new RegExp('^' + coinName).test(this.marketName) === true) {
      return true;
    }
    console.warn('币种可能有问题');
    return false;
  }
  async getBorrowStats() {
    try {
      let res = await getBorrowStats(this.marketName);
      let available = res.coinAvailable;
      if (this.isCoin === false) {
        available = res.fiatAvailable;
      }
      this.available = available || '-';
    } catch (error) {
    }
  }
  setAllHandle() {
    this.repayAmount = Math.min(Number(this.arrearsAmount), Number(this.available)) + '';
  }
  async repayClickHandle() {
    if (!Number(this.repayAmount)) {
      this.$message.warn('请输入正确金额');
      return;
    }
    try {
      await doRepay({
        loanRecordIds: this.ids,
        repayAmount: this.repayAmount,
        // 0: 全部还款, 1: 部分还款
        repayType: Number(this.repayAmount) >= Number(this.available) ? '0' : '1',
        fundsType: this.info.fundsType,
        marketName: this.marketName
      });
      this.repayAmount = '';
      this.$message.success('还款成功');
      this.getCurInfo();
      this.getBorrowStats();
      window.setTimeout(this.getRepayList, 700);
    } catch (err) {
    }
  }
  async getCurInfo() {
    const { pageIndex, pageSize } = this.$route.query;
    let { recordList = [] } = await getLoanRecordList({
      pageIndex: Number(pageIndex),
      pageSize: Number(pageSize),
      marketName: this.marketName,
      status: '',
      dataType: ''
    });
    let [ info ] = recordList.filter(item => item.ids === this.ids);
    this.info = info || {};
  }
  async getRepayList() {
    let loanRecordIds = this.ids;
    try {
      this.loading = true;
      let res = await getRepayList({ loanRecordIds, pageIndex: 1, pageSize: 100 });
      this.list = res.repayList || [];
    } catch (error) {
      this.$message.warn(error.message);
    }
    this.loading = false;
  }
  created() {
    this.info = getSession('__temp-return-detail-info') || {};
    // 借款者查看记录
    if (this.marketName) {
      this.getBorrowStats();
      this.getCurInfo();
    }
  }
  mounted() {
    this.getRepayList();
  }
  backClickHandle() {
    this.$router.back();
  }
}
