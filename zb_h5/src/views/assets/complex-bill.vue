<template>
  <div class="detailed-bill">
    <div class="bill-header">
      <div class="header-wrap">
        <div @click="$router.back()" class="header-btn">
          <icon-return />
        </div>
        <h1 class="header-title">综合账单</h1>
      </div>
      <div class="header-filter">
        <tab @change="tabChangeHandle" class="filter-tab" v-model="tabActive">
          <tab-item :class="key" :key="key" :name="key" v-for="(text, key) in filterTab">{{ text }}</tab-item>
        </tab>
        <div :class="{ active: isFilter }" @click="isFilter = !isFilter" class="filter-btn">
          <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.51 2.951V1.62a.133.133 0 0 0-.005-.036C14.385.554 11.111 0 8.06 0 5.01 0 1.736.555 1.614 1.583a.12.12 0 0 0-.006.037V2.95c0 .046.025.088.065.113l4.686 2.865v4.943c0 .042.02.082.056.107a.14.14 0 0 0 .121.02l3.127-.931a.134.134 0 0 0 .097-.128V5.93l4.686-2.865a.132.132 0 0 0 .064-.113zm-1.44-1.31a12.524 12.524 0 0 1-2.235.5c-.852.095-1.83.144-2.827.144-3.446 0-5.25-.534-5.25-.82 0-.287 1.804-.822 5.25-.822 3.447 0 5.25.535 5.25.821 0 .035-.056.104-.189.177zM5.936 12.512a.13.13 0 0 1 0 .162l-2.595 3.274a.139.139 0 0 1-.11.052.14.14 0 0 1-.109-.052L.53 12.674a.13.13 0 0 1-.001-.162.141.141 0 0 1 .16-.044l1.718.659V9.268c0-.073.062-.133.138-.133h1.377c.076 0 .138.06.138.133v3.859l1.718-.659a.14.14 0 0 1 .16.044zm9.563.03a.131.131 0 0 1-.028.08.141.141 0 0 1-.16.045l-1.718-.659v3.859a.136.136 0 0 1-.138.133h-1.377a.136.136 0 0 1-.138-.133v-3.859l-1.718.659a.141.141 0 0 1-.16-.044.13.13 0 0 1 0-.162l2.595-3.274a.139.139 0 0 1 .11-.052.14.14 0 0 1 .109.052l2.595 3.274a.133.133 0 0 1 .028.081z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="bill-content">
      <transition name="opacity">
        <div class="filter-popup" v-if="isFilter">
          <native-scroll>
            <div class="filter-content">
              <div class="filter-item">
                <div class="item-label">币种</div>
                <div @click="coinPickerVisible = true" class="item-select">{{ currency || '所有币种' }}</div>
              </div>
              <div class="filter-item" v-if="tabActive !== 'activity'">
                <div class="item-label">操作类型</div>
                <div class="item-selection">
                  <div class="option">
                    <span :class="{ active: !billType }" @click="billType = ''">全部</span>
                  </div>
                  <div :key="key" class="option" v-for="(value, key) in billTypes">
                    <span :class="{ active: billType === key }" @click="billType = key">{{ value }}</span>
                  </div>
                </div>
              </div>
              <div class="filter-item">
                <div class="item-time">
                  <div class="item-label">起始时间</div>
                  <div @click="showStartTimePicker" class="item-select">
                    {{ startDate ? formatDate(startDate, 'YYYY/MM/DD hh:00') : '请选择' }}
                  </div>
                </div>
                <div class="item-time">
                  <div class="item-label">结束时间</div>
                  <div @click="showEndTimePicker" class="item-select">
                    {{ endDate ? formatDate(endDate, 'YYYY/MM/DD hh:00') : '请选择' }}
                  </div>
                </div>
              </div>
              <div class="filter-btn">
                <span @click="resetHandle" class="btn reset-btn">重置</span>
                <span @click="submitHandle" class="btn confirm-btn">筛选</span>
              </div>
            </div>
          </native-scroll>
        </div>
      </transition>
      <div class="bill-switch">
        <div class="switch-title">
          <span :class="{ active: billTimeType === 0 }">最近</span> /
          <span :class="{ active: billTimeType === 1 }">历史账单</span>
        </div>
        <zb-switch :active-value="1" :inactive-value="0" @change="billTimeTypeChange" v-model="billTimeType" />
      </div>
      <div class="bill-list">
        <div class="list-head">
          <span>时间/操作</span>
          <span>金额变动</span>
        </div>
        <div class="list-body" v-loading="loading && list.length === 0">
          <native-scroll :finished="isFinished" :loading="loading && list.length > 0" @scroll-end="scrollEndHandle" pullup>
            <div :key="item.id" class="item" v-for="item in list">
              <div class="item-left">
                <div class="time">{{ item.time }}</div>
                <div class="type">
                  <span>{{ item.type }}</span>
                  <p v-html="item.fiat"></p>
                </div>
              </div>
              <div class="item-right">
                <div class="balance">{{ item.remark }}</div>
                <div class="change" v-html="item.other"></div>
              </div>
            </div>
            <no-data :visible="loading === false && list.length === 0" />
          </native-scroll>
        </div>
      </div>
    </div>
    <van-popup
      class="complex-bill-coin-picker"
      get-container="body"
      position="bottom"
      safe-area-inset-bottom
      v-model="coinPickerVisible"
    >
      <van-picker
        :columns="coinPickerData"
        @cancel="coinPickerVisible = false"
        @confirm="coinConfirmHandle"
        show-toolbar
        title="选择币种"
      />
    </van-popup>
    <van-popup
      @click-overlay="clickOverlayHandle"
      class="complex-bill-time-picker"
      get-container="body"
      position="bottom"
      safe-area-inset-bottom
      v-model="timePickerVisible"
    >
      <van-datetime-picker
        :formatter="formatter"
        :max-date="startMaxDate"
        :min-date="minDate"
        @cancel="cancelStartTimePicker"
        @confirm="timeStartConfirmHandle"
        key="start"
        title="起始时间"
        type="datetime"
        v-if="dateType === 'start'"
        v-model="startDate"
      />
      <van-datetime-picker
        :formatter="formatter"
        :max-date="maxDate"
        :min-date="endMinDate"
        @cancel="cancelEndTimePicker"
        @confirm="timeEndConfirmHandle"
        key="end"
        title="结束时间"
        type="datetime"
        v-else
        v-model="endDate"
      />
    </van-popup>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import zbSwitch from '@/components/common/switch/index.vue';
import { tab, tabItem } from '@/components/common/tab/index';
import { getSpotBills } from '@/api/assets';
import { fixDecimal } from '@/utils/math';
import { formatDate, parseTimestamp } from '@/utils/date';
import { getCurrencyConfig } from '@/api/common';
import { Catch } from '@/utils/decorators';
import { Picker as vanPicker, DatetimePicker as vanDatetimePicker } from 'vant';
import { isNotEmpty, isEmpty } from '@/utils/is';
import { getLeverBills } from '@/api/lever';
import { getFundGetBill, getFundList } from '@/api/activity';
import { getMortgageBills } from '@/api/mortgage';
import { Action, State } from 'vuex-class';
import { IMarketInfo } from '@/api/trade';

interface IBillsItem {
  time: string;
  type: string;
  fiat: string;
  other: string;
  remark?: string;
  id: string;
}
type TDateType = 'start' | 'end';
type TAccountType = 'spot' | 'lever' | 'mortgage' | '' | 'activity';
@Component({
  components: {
    tab,
    tabItem,
    vanPicker,
    zbSwitch,
    vanDatetimePicker
  }
})
export default class ComplexBill extends Vue {
  tabActive: TAccountType = 'spot';
  filterTab: IObj<string> = {
    spot: '现货',
    lever: '杠杆',
    mortgage: '借贷',
    activity: '活动'
  };
  billType: string = '';
  dateType: TDateType = 'start';
  maxDate: Date = new Date();
  minDate: Date = new Date(2017, 0, 1);
  startDate: Date | string = '';
  endDate: Date | string = '';
  isFilter: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 15;
  currency: string = '';
  loading: boolean = false;
  list: IBillsItem[] = [];
  isFinished: boolean = false;
  coinPickerData: string[] = [];
  coinPickerDataTemp: IObj<number> = {};
  coinPickerVisible: boolean = false;
  timePickerVisible: boolean = false;
  formatDate = formatDate;
  billTimeType: number = 0; // 0：3天内数据 1：3天前数据
  mortgageTypeList: IObj<string> = {};
  get billTypes(): IObj<string> {
    if (this.tabActive === 'spot') {
      return {
        charge: '充值',
        withdraw: '提现',
        buy: '买入',
        sell: '卖出',
        sxfbuy: '买入手续费',
        sxfsell: '卖出手续费',
        zs: '系统赠送',
        fundtransfer: '资金划转'
      };
    } else if (this.tabActive === 'lever') {
      return {
        1: '转入',
        2: '转出',
        3: '买入',
        4: '买入扣除',
        5: '卖出',
        6: '买入手续费',
        7: '系统扣除',
        8: '卖出手续费',
        9: '借入',
        10: '还款',
        11: '手续费',
        12: '借出',
        13: '借出还款',
        14: '穿仓扣除'
      };
    } else if (this.tabActive === 'mortgage') {
      return this.mortgageTypeList;
    }
    return {};
  }
  get endMinDate() {
    if (this.startDate) {
      return new Date(this.startDate);
    }
    return new Date(2017, 1, 1);
  }
  get startMaxDate() {
    if (this.endDate) {
      return new Date(this.endDate);
    }
    return new Date();
  }
  @Action('getMarketInfo', { namespace: 'market' }) getMarketInfo!: Function;
  @State('marketConfigList', { namespace: 'market' }) marketConfigList!: IObj<IMarketInfo>;
  tabChangeHandle() {
    this.pageIndex = 1;
    this.currency = '';
    this.billTimeType = 0;
    this.list = [];
    this.isFinished = false;
    this.getList();
    this.getCoinPickerList();
  }
  showStartTimePicker() {
    this.dateType = 'start';
    this.timePickerVisible = true;
    if (!this.startDate) {
      this.startDate = new Date();
    }
  }
  showEndTimePicker() {
    this.dateType = 'end';
    this.timePickerVisible = true;
    if (!this.endDate) {
      this.endDate = new Date();
    }
  }
  cancelStartTimePicker() {
    this.timePickerVisible = false;
    this.startDate = '';
    this.$nextTick(() => {
      this.startDate = '';
    });
  }
  cancelEndTimePicker() {
    this.timePickerVisible = false;
    this.endDate = '';
    this.$nextTick(() => {
      this.endDate = '';
    });
  }
  clickOverlayHandle() {
    if (this.dateType === 'start') {
      return this.cancelStartTimePicker();
    }
    this.cancelEndTimePicker();
  }
  formatter(type: string, value: string) {
    if (type === 'year') {
      return `${value}年`;
    } else if (type === 'month') {
      return `${value}月`;
    } else if (type === 'day') {
      return `${value}日`;
    } else if (type === 'hour') {
      return `${value}时`;
    }
    return value;
  }
  async getList() {
    const { pageIndex, pageSize, billTimeType, currency, fixNumber, billType } = this;
    const startDate = this.startDate ? formatDate(this.startDate, 'YYYY-MM-DD hh:00:00').toString() : '';
    const endDate = this.endDate ? formatDate(this.endDate, 'YYYY-MM-DD hh:00:00').toString() : '';
    try {
      this.loading = true;
      let list: IBillsItem[] = [];
      if (this.tabActive === 'spot') {
        let res = await getSpotBills({
          pageIndex,
          pageSize,
          dataType: billTimeType,
          // 不选择币种时, 默认为all
          currency: currency === '__("全部")' ? 'all' : currency,
          startDate,
          endDate,
          operType: billType
        });
        this.loading = false;
        if (res.dataList && res.dataList.length) {
          list = res.dataList.map(item => {
            return {
              time: formatDate(item.date, 'YYYY-MM-DD hh:mm:ss').toString(),
              type: item.billTypeValue,
              fiat: fixNumber(item.showFiat),
              other: fixNumber(item.showCoin),
              remark: item.remark,
              id: item.id
            };
          });
          this.pageIndex++;
        }
      } else if (this.tabActive === 'lever') {
        let res = await getLeverBills({
          coint: currency === '__("全部")' ? '' : currency,
          pageIndex,
          pageSize,
          startTime: startDate,
          endTime: endDate,
          dataType: billTimeType, // 0：3天内数据 1：3天前数据
          billType
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
      } else if (this.tabActive === 'mortgage') {
        let fundsType = this.coinPickerDataTemp[currency] || '';
        let res = await getMortgageBills({
          pageIndex,
          pageSize,
          dataType: billTimeType,
          startTime: parseTimestamp(formatDate(this.startDate, 'YYYY-MM-DD hh:00:00') + '') || '',
          endTime: parseTimestamp(formatDate(this.endDate, 'YYYY-MM-DD hh:00:00') + '') || '',
          billType,
          fundsType
        });
        this.loading = false;
        if (res.billList && res.billList.length) {
          list = res.billList.map(item => {
            return {
              time: formatDate(item.billDate, 'YYYY-MM-DD hh:mm:ss').toString(),
              type: item.billTypeName,
              fiat: item.showFiat,
              other: item.showCoin,
              id: item.id + '',
              remark: fixDecimal(item.coinBalance, 3)
            };
          });
          this.pageIndex++;
        }
      } else if (this.tabActive === 'activity') {
        let res = await getFundGetBill({
          currency: currency === '__("全部")' ? 'all' : currency,
          pageIndex,
          pageSize,
          startDate,
          endDate,
          dataType: billTimeType // 0：3天内数据 1：3天前数据
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
      // 暂无更多数据
      if (list.length < pageSize) {
        this.isFinished = true;
      }
      this.list = this.list.concat(list);
    } catch (error) {
      console.log(new Error(error));
    }
  }
  fixNumber(str: string) {
    if (str === '…') return '…';
    // 拆分br
    return str
      .split('<br>')
      .map(item => {
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
    if (this.loading === true) return;
    this.getList();
  }
  billTimeTypeChange(val: number) {
    this.endDate = this.startDate = '';
    this.pageIndex = 1;
    this.isFinished = false;
    this.list = [];
    this.billTimeType = val;
    this.getList();
  }
  async getCoinPickerList() {
    this.coinPickerData = ['__("全部")'];
    if (this.tabActive === 'spot') {
      this.getSpotPickerList();
    } else if (this.tabActive === 'lever') {
      await this.getMarketInfo();
      Object.keys(this.marketConfigList).map(name => {
        let data = this.marketConfigList[name];
        if (data.isLever !== true) return;
        if (this.coinPickerData.indexOf(data.cShowName) === -1) {
          this.coinPickerData.push(data.cShowName);
        }
        if (this.coinPickerData.indexOf(data.fShowName) === -1) {
          this.coinPickerData.push(data.fShowName);
        }
      });
    } else if (this.tabActive === 'mortgage') {
      if (isEmpty(this.mortgageTypeList) === true) {
        this.getMortgageBills();
      }
    } else if (this.tabActive === 'activity') {
      let res = await getFundList();
      if (isNotEmpty(res) === true) {
        let list = res.balances.map(item => item.key);
        this.coinPickerData.push(...list);
      }
    }
  }
  coinConfirmHandle(coin: string) {
    this.coinPickerVisible = false;
    this.currency = coin;
  }
  timeStartConfirmHandle(time: Date) {
    this.timePickerVisible = false;
    this.startDate = time;
    this.checkDate();
  }
  timeEndConfirmHandle(time: Date) {
    this.timePickerVisible = false;
    this.endDate = time;
    this.checkDate();
  }
  submitHandle() {
    this.pageIndex = 1;
    this.isFinished = false;
    this.list = [];
    this.isFilter = false;
    this.getList();
  }
  resetHandle() {
    this.endDate = this.billType = this.startDate = this.currency = '';
    setTimeout(() => {
      this.endDate = '';
      this.startDate = '';
    });
  }
  @Catch()
  async getSpotPickerList() {
    let data = await getCurrencyConfig();
    if (isNotEmpty(data) === true) {
      this.coinPickerData.push(...Object.keys(data).map(text => text.toString().toUpperCase()));
    }
  }
  // 只为获取列表选择及币种下拉列表
  @Catch()
  async getMortgageBills() {
    let res = await getMortgageBills({
      pageIndex: 1,
      pageSize: 1,
      dataType: 0
    });
    if (isNotEmpty(res) === true) {
      // 列表筛选类型
      res.billTypes.map(item => {
        this.mortgageTypeList[item.key] = item.value;
      });
      // 抵押币种列表
      let list = res.coins.map(item => {
        this.coinPickerDataTemp[item.value] = item.key;
        return item.value;
      });
      this.coinPickerData.push(...list);
    }
  }
  // 如果选择了时间, 默认开关切到历史账单
  checkDate() {
    if (this.startDate || this.endDate) {
      this.billTimeType = 1;
    } else {
      this.billTimeType = 0;
    }
  }
  mounted() {
    this.list = [];
    this.isFinished = false;
    this.getList();
    this.getCoinPickerList();
  }
}
</script>

<style lang='scss'>
.complex-bill-coin-picker,
.complex-bill-time-picker {
  width: 100%;
}
.complex-bill-time-picker .van-picker__columns .van-picker-column:nth-child(5) {
  display: none;
}
.detailed-bill {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--default-bg);
  color: var(--default-color);
  z-index: 4;
  display: flex;
  flex-direction: column;
  .bill-header {
    flex: none;
    border-bottom: 4px solid var(--line-color); /* no */
    padding-top: 10px;
    .header-wrap {
      padding: 10px 15px;
      position: relative;
      display: flex;
      align-items: center;
      color: var(--heavy-color);
      @include dark {
        color: #fff;
      }
    }
    .header-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 20px;
      @include bold;
    }
    .header-filter {
      display: flex;
      justify-content: space-between;
      .tabs-wrap {
        width: auto;
      }
      .filter-btn {
        display: flex;
        align-items: center;
        padding: 0 15px;
        color: var(--heavy-color);
        transition: all 0.3s;
        &.active {
          color: var(--primary-color);
        }
        svg {
          fill: currentColor;
        }
      }
    }
  }
  .bill-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .bill-switch {
    flex: none;
    padding: 0 15px;
    height: 44px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--line-color); /* no */
    .switch-title {
      width: 105px;
      @include bold;
      .active {
        font-size: 16px;
      }
    }
  }
  .bill-list {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .list-head {
      flex: none;
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;
      border-bottom: 1px solid var(--line-color); /* no */
    }
    .list-body {
      flex: 1;
      overflow: hidden;
      .m-scroll {
        padding-bottom: 10px;
      }
      .nodata-box {
        height: 100%;
      }
      .item {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid var(--line-color); /* no */
        @include dark {
          border-color: #24222d;
        }
        .time {
          font-size: 13px;
          color: var(--heavy-color);
          height: 22px;
        }
        .type {
          display: flex;
          align-items: center;
          font-size: 10px;
          span {
            padding: 3px;
            border-radius: 2px; /* no */
            background-color: var(--primary-color);
            color: #fff;
            margin-right: 5px;
          }
        }
        .balance {
          font-size: 14px;
          @include bold;
          color: var(--heavy-color);
          @include dark {
            color: #fff;
          }
          height: 22px;
        }
        .change {
          height: 18px;
          line-height: 18px;
          color: var(--heavy-color);
        }
      }
      .item-right {
        text-align: right;
      }
    }
  }
  .filter-popup {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(1, 7, 26, 0.56);
    z-index: 10;
    .filter-content {
      background-color: var(--default-bg);
      padding: 20px 15px 30px 15px;
    }
    .filter-item {
      margin-bottom: 25px;
      .item-label {
        font-size: 16px;
        color: var(--title-color);
        margin-bottom: 12px;
      }
      .item-select {
        border: 1px solid #e4e8ec; /* no */
        @include dark {
          border-color: #32353a;
        }
        padding: 14px 10px;
        border-radius: 4px; /* no */
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        &::after {
          content: '';
          width: 0;
          height: 0;
          border-left: 3px solid transparent; /* no */
          border-right: 3px solid transparent; /* no */
          border-top: 3px solid var(--heavy-color); /* no */
        }
      }
      .item-selection {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -10px -10px 0;
        .option {
          flex: none;
          width: 33.33%;
          padding: 0 10px 10px 0;
          span {
            display: block;
            background-color: #f7f8fe;
            @include dark {
              background-color: #32353a;
            }
            padding: 9px 0;
            text-align: center;
            border-radius: 2px; /* no */
            border: 1px solid transparent; /* no */
            position: relative;
            transition: all 0.3s;
            &::after {
              content: '';
              width: 0;
              height: 0;
              position: absolute;
              right: 0;
              top: 0;
              border-left: 0 solid transparent; /* no */
              border-bottom: 0 solid transparent; /* no */
              border-top: 0 solid var(--primary-color); /* no */
              transition: all 0.3s;
            }
            &.active {
              border-color: var(--primary-color);
              color: var(--primary-color);
              background-color: transparent;
              &::after {
                border-left-width: 8px;
                border-bottom-width: 8px;
                border-top-width: 8px;
              }
            }
          }
        }
      }
      .item-time {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .item-label {
          flex: none;
          margin: 0;
          width: 120px;
        }
        .item-select {
          flex: 1;
        }
      }
    }
    .filter-btn {
      display: flex;
      .btn {
        flex: 1;
        height: 44px;
        line-height: 44px;
        border-radius: 2px; /* no */
        text-align: center;
        font-size: 18px;
      }
      .reset-btn {
        background-color: #d8dae2;
        @include dark {
          background-color: #32353a;
        }
      }
      .confirm-btn {
        background-color: var(--primary-color);
        color: #fff;
        margin-left: 8px;
      }
    }
  }
}
</style>
