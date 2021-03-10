/** eslint @typescript-eslint/explicit-member-accessibility: ""off */
import { Component, Mixins } from 'vue-property-decorator';
import { getBorrowStats, IBorrowStatsResponseTypes, getLoanRecordList, ILoanRecordItem, IGetLoanRecordParamsTypes, doRepay, IDoRepayParamsTypes } from '@/api/lever';
import mixinsMarket from '@/mixins/market/market';
import { fixNumber, plus, fixDecimal } from '@/utils/math';
import { isNumber } from '@/utils/is';
import { setSession } from '@/utils/storage';

interface IActions {
  name: string;
  value: string;
}
interface ICoinTotal {
  count: number;
  amount: string;
}
@Component
export default class LeverReturn extends Mixins(mixinsMarket) {
  params: IGetLoanRecordParamsTypes = {
    status: '',
    dataType: '',
    marketName: '',
    pageIndex: 1,
    pageSize: 10
  };
  loading: boolean = false;
  isAll: boolean = false;
  filterList: IActions[] = [
    {
      name: '全部',
      value: ''
    }, {
      name: '还款中',
      value: '1'
    }, {
      name: '已还款',
      value: '2'
    }, {
      name: '需要平仓',
      value: '3'
    }, {
      name: '平仓还款',
      value: '4'
    }, {
      name: '自动还款',
      value: '6'
    }, {
      name: '穿仓已处理',
      value: '8'
    }
  ];
  list: ILoanRecordItem[] = [];
  coinTotalArr: string[] = [];
  loadingAll: boolean = false;
  actionSheetVisible: boolean = false;
  plus = plus;
  // eslint-disable-next-line
  info = {} as IBorrowStatsResponseTypes;
  get coinAvailable(): string {
    return isNumber(this.info.coinAvailable) ? fixNumber(this.info.coinAvailable, this.mixinsCoinDecimal) : '-';
  }
  get fiatAvailable(): string {
    return isNumber(this.info.fiatAvailable) ? fixNumber(this.info.fiatAvailable, this.mixinsMoneyDecimal) : '-';
  }
  get coinBenxi(): string {
    return isNumber(this.info.coinBenxi) ? fixNumber(this.info.coinBenxi, this.mixinsCoinDecimal) : '-';
  }
  get fiatBenxi(): string {
    return isNumber(this.info.fiatBenxi) ? fixNumber(this.info.fiatBenxi, this.mixinsMoneyDecimal) : '-';
  }
  scrollEndHandle() {
    this.getLoanRecordList();
  }
  selectHandle(_: IActions, status: string) {
    this.list = [];
    this.params.status = status || '';
    this.params.pageIndex = 1;
    this.actionSheetVisible = false;
    this.getLoanRecordList();
  }
  async getBorrowStats() {
    try {
      this.info = await getBorrowStats(this.mixinsTradeStrUnit);
    } catch (error) {
    }
  }
  async oneKeySubmitHandle() {
    if (this.coinTotalArr.length === 0) {
      this.$message.warn('未选择数据');
      return;
    }
    let arr: IDoRepayParamsTypes[] = [];
    this.list.map(item => {
      if (item.status === 1) {
        arr.push({
          loanRecordIds: item.ids,
          repayAmount: item.extendAmount,
          repayType: '1',
          fundsType: item.fundsType,
          marketName: this.mixinsTradeStrUnit
        });
      }
    });
    let length = arr.length;
    if (length === 0) return;
    const doPay = () => {
      let task = arr[0];
      if (!task) {
        this.getBorrowStats();
        this.params.status = '';
        this.params.pageIndex = 1;
        this.list = [];
        this.getLoanRecordList();
        this.loadingAll = false;
        this.isAll = false;
        this.coinTotalArr = [];
        this.$message.success('还款成功');
        return;
      }
      doRepay(task).then(() => {
        arr.shift();
        window.setTimeout(() => {
          doPay();
        }, 100);
      }).catch(err => {
        this.loadingAll = false;
        if (arr.length > 0 && length !== arr.length) {
          this.$message.warn('网络异常, 已完成部分还款');
        }
        console.log(err);
      });
    };
    this.loadingAll = true;
    this.$nextTick(doPay);
  }
  selectAll() {
    this.isAll = !this.isAll;
    this.coinTotalArr = [];
    if (this.isAll === false) {
      return;
    }
    let tempObj: IObj<ICoinTotal> = {};
    this.list.map(item => {
      if (item.coinShowName in tempObj === false) {
        tempObj[item.coinShowName] = {
          count: 0,
          amount: '0'
        };
      }
      // 待还款
      if (item.status === 1) {
        tempObj[item.coinShowName].count++;
        tempObj[item.coinShowName].amount = plus(tempObj[item.coinShowName].amount, item.extendAmount);
      }
    });
    Object.keys(tempObj).map(coin => {
      let { count, amount } = tempObj[coin];
      let decimal = this.mixinsCShowNameUp === coin ? this.mixinsCoinDecimal : this.mixinsMoneyDecimal;
      this.coinTotalArr.push('$1笔$2订单 合计$3 $2'.replace(/\$1/g, count + '').replace(/\$2/g, coin).replace(/\$3/, fixDecimal(amount, decimal)));
    });
  }
  toDetail(data: ILoanRecordItem) {
    if (!data.ids) {
      this.$message.warn('该数据异常, 请联系客服');
      return;
    }
    setSession('__temp-return-detail-info', data);
    const { pageIndex, pageSize } = this.params;
    this.$router.push({ name: 'lever-return-detail', params: { id: data.ids }, query: { market: this.mixinsTradeStrUnit, pageIndex: pageIndex - 1 + '', pageSize: pageSize + '' } });
  }
  async getLoanRecordList() {
    try {
      this.loading = true;
      let { recordList = [] } = await getLoanRecordList(this.params);
      recordList.map(item => {
        item.extendAmount = plus(item.hasRepay, item.amount);
      });
      this.list = this.list.concat(recordList);
      this.params.pageIndex++;
    } catch (error) {
    }
    this.loading = false;
  }

  mounted() {
    this.params.marketName = this.mixinsTradeStrUnit;
    this.getBorrowStats();
    this.getLoanRecordList();
  }
}
