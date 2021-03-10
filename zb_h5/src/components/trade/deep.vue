<template>
  <div class="deep-chart-box">
    <component :extend="chartData" height="200px" :is="asyncComp" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import market from '@/mixins/market/market';
import { send, IWebsocketObserve } from '@/utils/websocket';
import { plus } from '@/utils/math';
import { Catch } from '@/utils/decorators';
import { getCSSVariable } from '@/utils/dom';

interface IDishData {
  listDown: number[][];
  listUp: number[][];
}
let buyColor = getCSSVariable('--buy-color'),
  sellColor = getCSSVariable('--sell-color');
@Component
export default class Deep extends Mixins(market) {
  websocketObserve: IWebsocketObserve | null = null;
  chartData: any = {
    grid: {
      left: 0,
      top: 10,
      right: 17,
      bottom: 10
    },
    tooltip: {
      axisPointer: { type: 'none' },
      formatter: function(params: any) {
        return `<div style='padding:15px;text-align:left;'><p><span style='display:inline-block;min-width:60px;'>__("委托价")：</span>${
          params[0].axisValue
        }</p><p style="margin-bottom: 0;"><span style='display:inline-block;min-width:60px;'>__("累计")：</span>${params[0]
          .data ||
          params[1].data ||
          0}</p></div>`;
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: { color: '#728496' },
      data: [],
      splitLine: { show: false },
      axisLine: { show: true, lineStyle: { color: '#26384e' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false }, // 去除网格线
      axisLabel: { color: '#728496' },
      axisLine: { show: true, lineStyle: { color: '#26384e' } },
      position: 'right'
    },
    series: [
      {
        name: '__("买")',
        type: 'line',
        areaStyle: { color: buyColor },
        smooth: false,
        showSymbol: false,
        lineStyle: { opacity: 0 },
        data: []
      },
      {
        name: '__("卖")',
        type: 'line',
        areaStyle: { color: sellColor },
        smooth: false,
        showSymbol: false,
        lineStyle: { opacity: 0 },
        data: []
      }
    ]
  };
  asyncComp: any = null;
  transferNum(list: number[][]): number[] {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      arr[i] = 0;
      for (let j = i; j < list.length; j++) {
        arr[i] = Number(plus(arr[i], list[j][1]));
      }
    }
    return arr;
  }
  @Catch()
  async getData(): Promise<any> {
    let channel = `dish_length_50_${this.mixinsTradeStrUnit}default`;
    this.websocketObserve && this.websocketObserve.unsubscribe(true);
    this.websocketObserve = await send(
      {
        channel,
        isZip: true,
        binary: true,
        event: 'addChannel'
      },
      (websocketInstance): void => {
        websocketInstance
          .subscribe(res => {
            let data: IDishData = (res as any)[0],
              asksDish: number[][] = data.listUp,
              bidsDish: number[][] = data.listDown,
              priceChart: number[] = [],
              bidsChart: any[] = [],
              asksChart: any[] = [];
            priceChart = asksDish
              .concat(bidsDish)
              .reduce((arr, item) => {
                if (arr.indexOf(item[0]) === -1) {
                  arr.push(item[0]);
                }
                return arr;
              }, [])
              .sort((a, v) => a - v);
            asksChart = this.transferNum(asksDish).reverse();
            bidsDish.map(() => asksChart.unshift(''));
            bidsChart = this.transferNum(bidsDish);
            asksDish.map(() => bidsChart.push(''));
            this.$set(this.chartData.xAxis, 'data', priceChart);
            this.$set(this.chartData.series[0], 'data', bidsChart);
            this.$set(this.chartData.series[1], 'data', asksChart);
          })
          .catch(() => {
            this.$set(this.chartData.xAxis, 'data', []);
            this.$set(this.chartData.series[0], 'data', []);
            this.$set(this.chartData.series[1], 'data', []);
          });
      }
    );
  }
  async created() {
    const webpackModule = await import(/* webpackChunkName: 'chart-line' */ 'v-charts/lib/line.common');
    this.asyncComp = webpackModule.default || webpackModule;
    this.$nextTick(() => {
      this.getData();
    });
  }
  beforeDestroy() {
    this.websocketObserve && this.websocketObserve.unsubscribe(true);
  }
}
</script>

<style lang="scss">
.deep-chart-box {
  min-height: 200px;
}
</style>
