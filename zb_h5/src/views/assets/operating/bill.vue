<template>
  <div class="assets-operation-warp">
    <div class="record-head">
      <div class="head-sort">
        <p>
          时间
          <span>
            <icon-arrow direction="up" />
            <icon-arrow direction="down" />
          </span>
        </p>
      </div>
      <div class="head-sort">
        分类
        <icon-arrow />
      </div>
      <div class="head-sort">
        <p>
          金额
          <span>
            <icon-arrow direction="up" />
            <icon-arrow direction="down" />
          </span>
        </p>
      </div>
    </div>
    <div class="assets-record assets-bills-record" v-loading="loading && list.length === 0">
      <div class="record-list" v-if="list.length > 0">
        <div :key="item.id" class="record-item" v-for="item in list">
          <dl class="item-left">
            <dt class="label">{{ item.type }}</dt>
            <dd class="time">{{ item.time }}</dd>
          </dl>
          <dl class="item-right">
            <dt class="price" v-html="fixNumber(item.other)"></dt>
            <dd class="state" v-html="fixNumber(item.fiat)"></dd>
          </dl>
        </div>
      </div>
      <no-data :visible="list.length === 0 && loading === false" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { getLeverBills } from '@/api/lever';
import { getSpotBills } from '@/api/assets';
import { getMortgageBills } from '@/api/mortgage';
import { formatDate } from '@/utils/date';
import { fixDecimal } from '@/utils/math';
import { getFundGetBill } from '@/api/activity';
interface IBillsItem {
  time: string;
  type: string;
  fiat: string;
  other: string;
  id: string;
}
@Component
export default class BillList extends Vue {
  list: IBillsItem[] = [];
  loading: boolean = true;
  pageIndex: number = 1;
  pageSize: number = 15;
  isFinished: boolean = false;
  get accountType() {
    return this.$route.params.type || 'present';
  }
  get coinName() {
    return this.$route.query.coin + '' || '';
  }
  @Watch('coinName')
  _() {
    if (this.coinName) {
      this.list = [];
      this.isFinished = false;
      this.pageIndex = 1;
      this.getBills();
    }
  }
  fixNumber(str: string) {
    if (str === '…') return '…';
    // 拆分br
    return str
      .split('<br>')
      .map(item => {
        if (!/\s/g.test(item)) {
          item = item.replace(/([\+\-=\.\d]*)(\w+)/g, '$1 $2');
        }
        let [nums, unit] = item.split(' ');
        // 获取=号两边数字
        return (
          nums
            .split('=')
            .map(nItem => {
              // 格式化3位小数
              return fixDecimal(nItem, 3);
            })
            .join('=') +
          ' ' +
          unit
        );
      })
      .join('<br>');
  }
  scrollEndHandle() {
    this.getBills();
  }
  async getBills() {
    this.loading = true;
    let list: IBillsItem[] = [];
    let { pageIndex, pageSize } = this;
    try {
      if (this.accountType === 'present') {
        let res = await getSpotBills({
          currency: this.coinName,
          pageIndex,
          pageSize,
          dataType: 0 // 0：3天内数据 1：3天前数据
        });
        this.loading = false;
        if (res.dataList && res.dataList.length) {
          list = res.dataList.map(item => {
            return {
              time: formatDate(item.date, 'YYYY-MM-DD hh:mm:ss').toString(),
              type: item.billTypeValue,
              fiat: item.showFiat,
              other: item.showCoin,
              id: item.id
            };
          });
          this.pageIndex++;
        }
      } else if (this.accountType === 'lever') {
        let res = await getLeverBills({
          coint: this.coinName,
          pageIndex,
          pageSize,
          dataType: 0 // 0：3天内数据 1：3天前数据
        });
        this.loading = false;
        if (res.leverBillList && res.leverBillList.length) {
          list = res.leverBillList.map(item => {
            return {
              time: formatDate(item.billDate, 'YYYY-MM-DD hh:mm:ss').toString(),
              type: item.billTypeName,
              fiat: item.showFiat,
              other: item.showCoin,
              id: item.id + ''
            };
          });
          this.pageIndex++;
        }
      } else if (this.accountType === 'mortgage') {
        let res = await getMortgageBills({
          pageIndex,
          pageSize,
          dataType: 0 // 0：3天内数据 1：3天前数据
        });
        this.loading = false;
        if (res.billList && res.billList.length) {
          list = res.billList.map(item => {
            return {
              time: formatDate(item.billDate, 'YYYY-MM-DD hh:mm:ss').toString(),
              type: item.billTypeName,
              fiat: item.showFiat,
              other: item.showCoin,
              id: item.id + ''
            };
          });
          this.pageIndex++;
        }
      } else if (this.accountType === 'activity') {
        let res = await getFundGetBill({
          currency: this.coinName.toLowerCase(),
          pageIndex,
          pageSize,
          dataType: 0 // 0：3天内数据 1：3天前数据
        });
        this.loading = false;
        if (res.dataList && res.dataList.length) {
          list = res.dataList.map(item => {
            return {
              time: formatDate(item.date, 'YYYY-MM-DD hh:mm:ss').toString(),
              type: item.billTypeValue,
              fiat: item.showFiat,
              other: item.showCoin,
              id: item.id
            };
          });
          this.pageIndex++;
        }
      }
      this.$nextTick(() => {
        this.isFinished = list.length < this.pageSize;
        this.list.push(...list);
      });
    } catch (err) {
      console.log(err);
    }
  }
  mounted() {
    this.getBills();
  }
}
</script>

<style lang="scss">
.record-head {
  flex: none;
  padding: 15px 15px 0 15px;
  display: flex;
  color: #fff;
  margin-bottom: -10px;

  .head-sort {
    flex: 1;
    opacity: 0.6;

    &:nth-of-type(3) {
      text-align: right;
    }

    p {
      position: relative;
      display: inline-block;
      padding-right: 10px;
    }

    span {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;

      i {
        margin: 1px 0;
      }
    }
  }
}
.assets-bills-record {
  .nodata-box {
    height: 100%;
  }
  .loading-box {
    height: 300px;
  }
}
</style>
