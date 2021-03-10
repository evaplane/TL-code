<template>
  <div class="data-box">
    <native-scroll>
      <div class="ring-chart">
        <component
          :colors="['#ff453b', '#ff823a', '#ffb534', '#00cc88', '#00cab1', '#00a7ca']"
          :data="ringChartData"
          :extend="ringExtend"
          :is="asyncRingComp"
          :legend-visible="false"
          :settings="ringSetting"
          height="250px"
        />
      </div>
      <div class="line"></div>
      <div class="monitoring">
        <div class="card-title">
          __('大单监控')
        </div>
        <div class="monitoring-list monitoring-title" v-if="monitoringList.length > 0">
          <div class="monitoring-item">__('成交时间')</div>
          <div class="monitoring-item">__('成交价格')</div>
          <div class="monitoring-item">__('成交量')</div>
        </div>
        <div class="monitoring-list" v-for="(item, index) in monitoringList" :key="index">
          <div class="monitoring-item">{{ item.time }}</div>
          <div class="monitoring-item" :class="item.typeClass">{{ item.price }}</div>
          <div class="monitoring-item">{{ item.amount }}</div>
        </div>
        <no-data :visible="monitoringList.length === 0" />
      </div>
      <div class="line"></div>
      <div class="assets-flows">
        <div class="card-title">
          __('资金流向')
        </div>
        <div class="assets-flows-chart">
          <component
            :data="chartData"
            :extend="extend"
            :is="asyncComp"
            :legend-visible="false"
            :settings="{ itemStyle: { color: '#DE4E40' } }"
            height="300px"
          />
        </div>
      </div>
      <div class="line"></div>
      <div class="time-volume">
        <div class="volume-list volume-title">
          <div class="volume-item">__('时间')</div>
          <div class="volume-item">__('买入')</div>
          <div class="volume-item">__('卖出')</div>
          <div class="volume-item">__('净流入')</div>
        </div>
        <div class="volume-list" v-for="(item, index) in historyList" :key="index">
          <div class="volume-item">{{ item.time }}</div>
          <div class="volume-item buy-color">{{ item.buy }}</div>
          <div class="volume-item sell-color">{{ item.sell }}</div>
          <div class="volume-item" :class="Number(item.inflow) > 0 ? 'buy-color' : 'sell-color'">{{ item.inflow }}</div>
        </div>
        <no-data :visible="historyList.length === 0" />
      </div>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { getAlsFundDistribute, getAlsKlineData, getAlsBigRecordList, getAlsHistoryFundsData } from '@/api/trade';
import market from '@/mixins/market/market';
import { State } from 'vuex-class';
import { isNotEmpty } from '@/utils/is';
import { formatDate } from '@/utils/date';
import noData from '@/components/common/no-data.vue';
import nativeScroll from '@/components/common/native-scroll/index.vue';

interface IMonitoringList {
  time: string;
  amount: number;
  count: number;
  price: number;
  typeClass: string;
}
interface IHistoryList {
  time: string;
  buy: number;
  sell: number;
  inflow: number;
}
@Component({
  components: {
    noData,
    nativeScroll
  }
})
export default class TradeData extends Mixins(market) {
  timer!: number;
  flowsTimer!: number;
  asyncRingComp: any = null;
  asyncComp: any = null;
  ringChartData: any = {
    columns: ['label', 'value'],
    rows: []
  };
  ringSetting: any = {
    radius: [65, 90],
    offsetY: 120,
    itemStyle: {
      normal: {
        borderWidth: 0,
        borderColor: '#0F202D' // 这里需要设置跟外层背景一样，才能达到看上去像是有"间距"的效果
      }
    }
  };
  ringExtend: any = {
    title: {
      show: true,
      text: `__('资金$1分布')`.replace('$1', '\n'),
      x: 'center',
      y: 76, // 由于设置了"间距"，因此无法使用 center，需要手动计算出垂直居中的数值
      textStyle: {
        color: '#999',
        fontSize: 16
      },
      backgroundColor: '#17253a',
      padding: 28,
      borderWidth: 0,
      borderRadius: 60
    },
    series: {
      label: {
        normal: {
          show: true
        }
      }
    }
  };
  chartData: any = {
    columns: ['__("时段")', '__("净量")'],
    rows: [0, 0]
  };
  extend: any = {
    tooltip: {
      show: false
    },
    series: {
      symbol: 'none',
      type: 'line'
    },
    grid: {
      top: '10px',
      left: '15px',
      right: '15px',
      bottom: '10px',
      containLabel: true
    },
    xAxis: {
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#728496'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#26384E'
        }
      }
    },
    yAxis: {
      position: 'right',
      axisLine: {
        show: false,
        lineStyle: {
          color: '#728496'
        }
      },
      axisLabel: {
        formatter: (value: number) => value.toFixed(this.mixinsMoneyDecimal)
      },
      splitLine: {
        lineStyle: {
          color: '#26384E',
          type: 'dashed'
        }
      }
    }
  };
  monitoringTimer!: number;
  monitoringList: IMonitoringList[] = [];
  historyTimer!: number;
  historyList: IHistoryList[] = [];
  total = '0';
  loading = false;
  @State('theme', { namespace: 'theme' }) theme!: string;
  @Watch('theme', { immediate: true })
  _() {
    let color = '#F3F3F3';
    if (this.theme === 'dark') {
      color = '#17253a';
    }
    this.$set(this.ringExtend.title, 'backgroundColor', color);
  }
  @Watch('mixinsTradeStr')
  __() {
    this.getData();
    this.getRingData();
    this.getMonitoring();
    this.getHistiryData();
  }
  async getRingData(): Promise<void> {
    let data = await getAlsFundDistribute({
      marketName: this.mixinsTradeStr
    });
    this.loading = false;
    const {
      largeTransBuyVolume,
      middleTransBuyVolume,
      smallTransBuyVolume,
      largeTransSellVolume,
      middleTransSellVolume,
      smallTransSellVolume
    } = data;
    const rows = [
      Number(largeTransBuyVolume) !== 0 ? { label: '买入大单', value: largeTransBuyVolume } : {},
      Number(middleTransBuyVolume) !== 0 ? { label: '买入中单', value: middleTransBuyVolume } : {},
      Number(smallTransBuyVolume) !== 0 ? { label: '买入小单', value: smallTransBuyVolume } : {},
      Number(largeTransSellVolume) !== 0 ? { label: '卖出大单', value: largeTransSellVolume } : {},
      Number(middleTransSellVolume) !== 0 ? { label: '卖出中单', value: middleTransSellVolume } : {},
      Number(smallTransSellVolume) !== 0 ? { label: '卖出小单', value: smallTransSellVolume } : {}
    ];
    this.$set(this.ringChartData, 'rows', rows);
    window.clearTimeout(this.timer);
    // 定时1分钟重新请求
    this.timer = window.setTimeout(this.getRingData, 30000);
  }
  async getHistiryData(): Promise<void> {
    let dateMap: IObj<string> = {
      1: '__("今日")',
      5: '5__("分钟")',
      10: '10__("分钟")',
      60: '1__("小时")',
      1440: '__("最近$1小时")'.replace('$1', '24'),
      10080: '1__("周")'
    };
    let list: number[][] = await getAlsHistoryFundsData(this.mixinsTradeStr);
    if (isNotEmpty(list) === true) {
      this.historyList = list.map(
        (item: number[]): IHistoryList => {
          return {
            time: dateMap[item[0]],
            buy: item[1],
            sell: item[2],
            inflow: item[3]
          };
        }
      );
    } else {
      this.historyList = [];
    }
    window.clearTimeout(this.historyTimer);
    // 定时1分钟重新请求
    this.historyTimer = window.setTimeout(this.getHistiryData, 60000);
  }
  async getMonitoring(): Promise<void> {
    try {
      let list: number[][] = await getAlsBigRecordList({
        marketName: this.mixinsTradeStr,
        pageNo: 1,
        pageSize: 7
      });
      if (isNotEmpty(list) === true) {
        let newList = list.map(
          (item: number[]): IMonitoringList => {
            return {
              typeClass: Number(item[1]) === 1 ? 'sell-color' : 'buy-color',
              time: formatDate(item[0], 'YYYY/MM/DD hh:mm:ss') as string,
              amount: item[4],
              count: item[2],
              price: item[3]
            };
          }
        );
        this.monitoringList = this.monitoringList.concat(newList);
      } else {
        this.monitoringList = [];
      }
    } catch (err) {
      console.log(err);
    }
    window.clearTimeout(this.monitoringTimer);
    // 定时1分钟重新请求
    this.monitoringTimer = window.setTimeout(this.getMonitoring, 30000);
  }
  async getData(): Promise<void> {
    let list: number[][] = await getAlsKlineData({ marketName: this.mixinsTradeStr, timeRange: 30 });
    if (isNotEmpty(list) === true) {
      let rows = list.map((item): any => {
        return { 时段: formatDate(item[0], 'MM-DD hh:mm:ss'), 净量: item[1] };
      });
      this.$set(this.chartData, 'rows', rows);
    } else {
      this.$set(this.chartData, 'rows', []);
    }
    window.clearTimeout(this.flowsTimer);
    // 定时1分钟重新请求
    this.flowsTimer = window.setTimeout(this.getData, 60000);
  }
  async mounted() {
    if (window.screen.availWidth <= 320) {
      this.$set(this.ringSetting.radius, 1, 80);
    }
    this.loading = true;
    await import(/* webpackChunkName: 'echarts-component-title' */ 'echarts/lib/component/title');
    let webpackModule = await import(/* webpackChunkName: 'chart-ring' */ 'v-charts/lib/ring.common');
    this.asyncRingComp = webpackModule.default || webpackModule;
    await import(/* webpackChunkName: 'echarts-line' */ 'echarts/lib/chart/line');
    webpackModule = await import(/* webpackChunkName: 'chart-histogram' */ 'v-charts/lib/histogram.common.min');
    this.asyncComp = webpackModule.default || webpackModule;
    this.getData();
    this.getRingData();
    this.getMonitoring();
    this.getHistiryData();
  }
  beforeDestroy() {
    [this.timer, this.flowsTimer, this.monitoringTimer, this.historyTimer].map(timer => {
      window.clearTimeout(timer);
    });
  }
}
</script>

<style lang='scss'>
.data-box {
  flex: 1;
  overflow: hidden;
  .monitoring {
    padding-bottom: 20px;
  }
  .monitoring-list {
    padding: 0 15px;
    display: flex;
    color: var(--theme-color);
    font-size: 12px;
    .monitoring-item {
      flex: none;
      font-size: 12px;
      padding: 8px 0;
      &:first-child {
        width: 160px;
      }
      &:last-child {
        margin-left: auto;
      }
    }
    &.monitoring-title {
      .monitoring-item {
        opacity: 0.7;
        font-size: 10px;
      }
    }
  }
  .assets-flows {
    padding-bottom: 20px;
  }
  .assets-flows-chart {
    height: 300px; /* no */
  }
  .ring-chart {
    padding: 30px 0;
  }
  .time-volume {
    color: var(--theme-color);
    padding: 15px 0 25px;
    font-size: 13px;
    font-family: 'Roboto';
    .volume-title {
      opacity: 0.7;
      font-size: 10px;
    }
    .volume-list {
      padding: 0 15px;
      display: flex;
    }
    .volume-item {
      flex: none;
      width: 25%;
      padding: 5px 0;
      &:last-child {
        text-align: right;
      }
    }
  }
}
</style>
