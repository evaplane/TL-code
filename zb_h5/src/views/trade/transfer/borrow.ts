import { Component, Mixins } from 'vue-property-decorator';
import mInput from '@/components/common/input/index.vue';
import leverHeader from '@/components/lever/header.vue';
import mSwitch from '@/components/common/switch/index.vue';
import { getBorrowStats, ILeverLoanItem, IDoLoanParams, doLoan } from '@/api/lever';
import mixinsMarket from '@/mixins/market/market';
import { getSession, setSession } from '@/utils/storage';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { encryptPwd } from '@/js/encode-pwd';
import { minus } from '@/utils/math';
@Component({
  components: {
    leverHeader,
    mSwitch,
    mInput
  }
})
export default class Borrow extends Mixins(mixinsMarket) {
  coinShowName: string = '';
  available: string = '';
  // eslint-disable-next-line
  info = {} as ILeverLoanItem;
  safePwd: string = '';
  params: IDoLoanParams = {
    marketName: '',
    coin: '',
    interestRateOfDay: '',
    repaymentDay: 0,
    amount: '',
    safePwd: '',
    isLoop: 0
  };
  loading: boolean = false;
  get coinName(): string {
    const { coin } = this.$route.query;
    this.coinShowName = coin + '';
    return coin ? this.coinShowName.toLowerCase() : '';
  }
  get isSafePwd() {
    return this.userInfo.safePwd === 1;
  }
  get actionType() {
    return this.coinName === this.mixinsCShowName ? '做空' : '做多';
  }
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  setAllHandle() {
    this.params.amount = this.available;
  }
  async submitHandle() {
    if (this.isSafePwd === true) {
      if (!this.safePwd) {
        return this.$message.warn({ message: '__("请输入资金密码")', duration: 1000 });
      }
      // 资金密码加密
      this.params.safePwd = await encryptPwd(this.safePwd);
    }
    if (!Number(this.params.amount)) {
      return this.$message.warn('请输入正确借入金额');
    }
    try {
      const {
        interestRateOfDay,
        repaymentDay
      } = this.info;
      this.params.marketName = this.mixinsTradeStrUnit;
      this.params.coin = this.coinName;
      this.params.interestRateOfDay = interestRateOfDay;
      this.params.repaymentDay = repaymentDay;
      this.loading = true;
      await doLoan(this.params);
      this.$message.success('操作成功');
      this.info.amount = minus(this.info.amount, this.params.amount) + '';
      setSession('--temp-borrow-info', this.info);
      this.getBorrowStats();
    } catch (err) {
    }
    this.loading = false;
  }
  async getBorrowStats() {
    try {
      let res = await getBorrowStats(this.mixinsTradeStrUnit);
      let available = res.coinCanLoanIn;
      // 币种2
      if (this.coinName === this.mixinsFShowName) {
        available = res.fiatCanLoanIn;
      }
      this.available = available || '-';
    } catch (error) {
    }
  }
  created() {
    this.info = getSession<ILeverLoanItem>('--temp-borrow-info') || {};
  }
  mounted() {
    this.getBorrowStats();
  }
}
