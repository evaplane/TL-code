<template>
  <div class="echarts-kline-box">
    <div class="kline-filter">
      <div class="kline-tab">
        <ul>
          <li
            :class="{ active: resolution == key }"
            @click="timeChangeHandle(key)"
            v-for="(val, key) in resolutionMapText"
            :key="key"
          >
            {{ val }}
          </li>
        </ul>
      </div>
      <div class="kline-dropdown" v-show="resolution !== 'timeLine'">
        <p @click="dropdown = !dropdown">
          {{ maTypes[maType] }}
          <icon-arrow />
        </p>
        <ul @click="dropdown = false" v-show="dropdown">
          <li :class="{ active: maType === key }" :key="key" @click="maChange(key)" v-for="(item, key) in maTypes">{{ item }}</li>
        </ul>
      </div>
    </div>
    <div class="kline-warp" v-loading="loading">
      <div id="echarts-kline"></div>
    </div>
  </div>
</template>

<script lang='ts'>
/* eslint @typescript-eslint/camelcase:off */
import { Component, Mixins, Watch } from 'vue-property-decorator';
import echarts from 'echarts';
import 'echarts/lib/chart/candlestick';
import { send, IWebsocketQueryParams, IWebsocketObserve } from '@/utils/websocket';
import mixinsMarket from '@/mixins/market/market';
import { formatDate } from '@/utils/date';
import { getCSSVariable } from '@/utils/dom';
import { getKlineData } from '@/api/trade';
import { onVisibilityChange } from '@/utils/event';
import { State } from 'vuex-class';
import { getLocal, setLocal } from '@/utils/storage';

interface ITradeRecordItem {
  amount: string;
  date: number;
  price: string;
  tid: number;
  trade_type: string;
  type: string;
}
interface ITradeRecordData {
  data: ITradeRecordItem[];
  rate: string;
  no: number;
}
// import 'echarts/lib/chart/scatter';
// import 'echarts/lib/chart/bar';
let websocketObserve: IWebsocketObserve | null = null,
  offPageVisibleChange: Function | null = null,
  echartsInstance: echarts.ECharts | null = null;
let klineData: any[] = [],
  klineVol: any[] = [],
  klineTime: any[] = [],
  lineDataMinLength = 100,
  lastPricePoint: any[] = [];
let recordTime: any[] = [],
  recordVol: any[] = [],
  recordData: any[] = [],
  firstRecordLoaded = false,
  lastPriceTimePoint: any[] = [],
  recordTempList: ITradeRecordItem[] = [],
  fontSize = 10;
@Component
export default class EchartsKline extends Mixins(mixinsMarket) {
  maTypes: IObj<string> = {
    5: 'MA5',
    7: 'MA7',
    10: 'MA10',
    30: 'MA30'
  };
  maType: string = getLocal('__kline_ma') || '5';
  debounceTimer: number = 0;
  debounceFlag: boolean = false;
  firstLoaded = false;
  dropdown: boolean = false;
  pathSymbols: IObj<string> = {
    plane: 'image://img/kline/right-current.svg',
    right_current_red: 'image://img/kline/right_current_red.svg',
    right_current_green: 'image://img/kline/right_current_green.svg',
    green_c_light: 'image://img/kline/green_c_light.svg',
    red_c_light: 'image://img/kline/red_c_light.svg',
    green_c_dark: 'image://img/kline/green_c_dark.svg',
    red_c_dark: 'image://img/kline/red_c_dark.svg',
    dot_g: 'image://img/kline/dot-green.svg',
    dot_r: 'image://img/kline/dot-red.svg'
  };
  loading: boolean = false;
  resolution: string = getLocal('__kline_resolution') || '15';
  resolutionMap: IObj<string> = {
    '1': '1min',
    '5': '5min',
    '15': '15min',
    '30': '30min',
    '60': '1hour',
    '1D': '1day',
    '1W': '1week'
  };
  resolutionMapText: IObj<string> = {
    '1': '时时',
    '5': '5分',
    '15': '15分',
    '30': '30分',
    '60': '1时',
    '1D': '1天',
    '1W': '1周'
  };
  '$el': HTMLDivElement;
  @State('theme', { namespace: 'theme' }) theme!: string;
  get lineColor(): string {
    return this.theme === 'dark' ? '#1f212d' : '#f1f1f1';
  }
  get maxPointIcon() {
    return this.theme === 'dark' ? this.pathSymbols.red_c_dark : this.pathSymbols.red_c_light;
  }
  get minPointIcon() {
    return this.theme === 'dark' ? this.pathSymbols.green_c_dark : this.pathSymbols.green_c_light;
  }
  @Watch('mixinsTradeStr')
  _() {
    this.initChart();
    this.resetData();
    this.renderChart();
  }
  maChange(type: string) {
    this.maType = type;
    setLocal('__kline_ma', type);
    this.setKlineOptions();
  }
  setKlineOptions() {
    let sellColor = getCSSVariable('--sell-color'),
      buyColor = getCSSVariable('--buy-color');
    let width = this.calcOffset(lastPricePoint[1] + '');
    if (echartsInstance !== null) {
      echartsInstance.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        grid: [
          {
            left: 0,
            right: width,
            height: 260,
            top: 20,
            containLabel: false,
            tooltip: {
              axisPointer: {
                lineStyle: {
                  color: '#eee'
                }
              }
            }
          },
          {
            left: 0,
            right: width,
            top: 310,
            height: 45
          },
          {
            left: 0,
            right: width,
            top: 500,
            height: 60
          }
        ],
        axisPointer: {
          show: true
        },
        xAxis: [
          {
            type: 'category',
            data: klineTime,
            scale: true,
            boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              // padding:[10,0,30,0],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize
              },
              color: function() {
                return '#aaa';
              }
            },
            splitLine: {
              show: true,
              interval: 20,
              lineStyle: {
                //  使用深浅的间隔色
                color: [this.lineColor]
              }
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: klineTime,
            scale: true,
            boundaryGap: false,
            splitNumber: 20,
            splitLine: {
              show: true,
              interval: 20,
              lineStyle: {
                //  使用深浅的间隔色
                color: [this.lineColor]
              }
            },
            axisLabel: { show: false },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            }
          },
          {
            type: 'category',
            gridIndex: 2,
            data: klineTime,
            axisLabel: { show: false },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            }
          }
        ],
        yAxis: [
          {
            scale: true,
            position: 'right',
            splitNumber: 4,
            splitLine: {
              show: true,
              interval: 10,
              lineStyle: {
                //  使用深浅的间隔色
                color: [this.lineColor]
              }
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              padding: [70, 0, 10, 0],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize
              },
              color: function() {
                return '#aaa';
              }
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            }
          },
          {
            // volum1
            gridIndex: 1,
            splitNumber: 2,
            position: 'right',
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              padding: [10, 0, 30, 0],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize
              },
              color: function() {
                return '#aaa';
              }
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            }
          },
          {
            // volum2
            gridIndex: 2,
            splitNumber: 1,
            position: 'right',
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize
              },
              color: function() {
                return '#aaa';
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 0],
            start: 50,
            zoomLock: true,
            end: 100
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'inside',
            top: '97%',
            zoomLock: true,
            start: 50,
            end: 100
          },
          {
            show: false,
            xAxisIndex: [0, 2],
            type: 'inside',
            zoomLock: true,
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: 'K线',
            type: 'candlestick',
            data: klineData,
            position: 'right',
            itemStyle: {
              normal: {
                color: sellColor,
                color0: buyColor,
                borderColor: sellColor,
                borderColor0: buyColor
              }
            },
            markPoint: {
              data: [
                {
                  type: 'max',
                  symbol: this.maxPointIcon,
                  valueDim: 'highest',
                  symbolKeepAspect: true,
                  symbolSize: [18, 18],
                  label: {
                    color: '#fff',
                    fontSize: 1,
                    show: false
                  }
                },
                {
                  type: 'min',
                  symbol: this.minPointIcon,
                  symbolKeepAspect: true,
                  symbolSize: [18, 18],
                  valueDim: 'lowest', // 最低价
                  label: {
                    color: '#fff',
                    fontSize: 1,
                    show: false
                  }
                }
              ]
            }
          },
          {
            name: 'MA' + this.maType,
            type: 'line',
            data: this.countMa(klineData, this.maType),
            smooth: true,
            lineStyle: {
              normal: {
                opacity: 0.8,
                color: '#39afe6',
                width: 1
              }
            },
            symbol: 'none',
            stack: 'a'
          },
          {
            symbolSize: 2,
            data: [lastPricePoint],
            type: 'scatter',
            markPoint: {
              data: [
                {
                  coord: [lastPricePoint[0], lastPricePoint[1]],
                  symbol: this.pathSymbols.dot_r,
                  symbolOffset: [3, 0],
                  symbolSize: [26, 18],
                  value: lastPricePoint[1], // lastPricePoint[1]
                  label: {
                    color: '#fff',
                    align: 'left',
                    fontSize,
                    fontWeight: 'bold',
                    position: 'right',
                    backgroundColor: '#C3181F',
                    borderRadius: 2,
                    padding: 5,
                    offset: [-5, 0]
                  }
                }
              ]
            }
          },
          {
            name: 'Volumn',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barWidth: 5,
            data: klineVol,
            itemStyle: {
              normal: {
                color: function(params: any) {
                  var colorList;
                  if (klineData[params.dataIndex][1] > klineData[params.dataIndex][0]) {
                    colorList = sellColor;
                  } else {
                    colorList = buyColor;
                  }
                  return colorList;
                }
              }
            },
            symbol: 'none'
          }
        ]
      } as any);
    }
  }
  initMinChart() {
    const setOptions = (d: any) => {
      var isNew = this.fotmatKlineData(d);
      if (isNew) {
        this.setKlineOptions();
      }
    };
    let time = this.resolutionMap[this.resolution],
      list: any[] = [],
      lastData: number[] = [];
    const getBarsBySocket = async () => {
      let symbol = this.mixinsTradeStrUnit;
      let socketParams: IWebsocketQueryParams = {
        binary: true,
        isZip: true,
        channel: `${symbol}_kline_${time}`,
        event: 'addChannel',
        lastTime: list[list.length - 1][0]
      };
      list = [];
      websocketObserve = await send(socketParams, websocketInstance => {
        websocketInstance.subscribe((res): void => {
          let data = res.datas.data;
          if (data && data.length === 1) {
            if (lastData.toString() === data.toString()) {
              return;
            }
            lastData = data;
          }
          if (res.channel.indexOf(symbol) === 0) {
            setOptions(data);
          }
        });
      });
    };
    const getBarsByAjax = async () => {
      websocketObserve && websocketObserve.unsubscribe(true);
      try {
        let res = await getKlineData({
          symbol: this.mixinsTradeStrUnit,
          nextTickers: 1,
          since: ['1day', '1week'].indexOf(time) === -1 ? new Date('2019/07/01 12:00:00').getTime() : '',
          type: time
        });
        list = res.data;
        this.loading = false;
        window.setTimeout(() => {
          setOptions(list);
          getBarsBySocket();
        }, 100);
      } catch (err) {
        this.loading = false;
        console.log(err, 'kline-ajax');
      }
    };
    getBarsByAjax();
  }
  calcOffset(value: string) {
    let spanEl = document.createElement('span');
    spanEl.innerText = value;
    spanEl.style.fontSize = fontSize + 'px';
    document.body.appendChild(spanEl);
    let width = spanEl.offsetWidth + 25;
    document.body.removeChild(spanEl);
    return Math.max(width, 70);
  }
  fotmatKlineData(d: any) {
    var newDataRtn = false;
    for (var i = 0; i < d.length; i++) {
      if (this.firstLoaded && klineData.length > 0 && d[i][0] === klineData[klineData.length - 1][5]) {
        if (
          d[i][1] === klineData[klineData.length - 1][0] &&
          d[i][2] === klineData[klineData.length - 1][3] &&
          d[i][3] === klineData[klineData.length - 1][2] &&
          d[i][4] === klineData[klineData.length - 1][1] &&
          d[i][5] === klineData[klineData.length - 1][4]
        ) {
        } else {
          klineData[klineData.length - 1] = [d[i][1], d[i][4], d[i][3], d[i][2], d[i][5], d[i][0]];
          klineVol[klineVol.length - 1] = d[i][5];
          newDataRtn = true;
        }
      } else {
        klineData.push([d[i][1], d[i][4], d[i][3], d[i][2], d[i][5], d[i][0]]);
        var dd = new Date(d[i][0]);
        klineTime.push(formatDate(dd, 'MM-DD hh:mm'));
        klineVol.push(d[i][5]);
        newDataRtn = true;
      }
      this.firstLoaded = true;
    }
    if (klineData.length > lineDataMinLength) {
      klineData.splice(0, klineData.length - lineDataMinLength);
      klineVol.splice(0, klineVol.length - lineDataMinLength);
      klineTime.splice(0, klineTime.length - lineDataMinLength);
    }
    lastPricePoint = [klineTime[klineTime.length - 1], klineData[klineData.length - 1][1]];
    return newDataRtn;
  }
  countMa(data: any, dayCount: any) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
      if (i < dayCount) {
        result.push('-');
        continue;
      }
      var sum = 0;
      for (var j = 0; j < dayCount; j++) {
        sum += data[i - j][1];
      }
      result.push((sum / dayCount).toFixed(2));
    }
    return result;
  }
  fotmatTimeData(d: ITradeRecordItem[]) {
    var newDataRtn = false;
    let len = 100;
    for (var i = 0; i < d.length; i++) {
      var lastDate = formatDate(d[i].date * 1000, 'hh:mm:ss');
      if (recordTime[recordTime.length - 1] && lastDate === recordTime[recordTime.length - 1]) {
        recordVol[recordVol.length - 1] = d[i].amount;
        recordData[recordData.length - 1] = d[i].price;
      } else {
        recordTime.push(lastDate);
        recordVol.push(d[i].amount);
        recordData.push(d[i].price);
      }
      newDataRtn = true;
      if (recordTime.length > len) {
        recordTime.splice(0, recordTime.length - len);
        recordVol.splice(0, recordVol.length - len);
        recordData.splice(0, recordData.length - len);
      }
    }
    if (firstRecordLoaded === false && recordData.length < len) {
      i = 0;
      for (; i < len - recordData.length; i++) {
        recordData.splice(0, 0, '-');
        recordVol.splice(0, 0, '-');
        recordTime.splice(0, 0, '-');
      }
    }
    firstRecordLoaded = true;
    lastPriceTimePoint = [recordTime[recordTime.length - 1], recordData[recordData.length - 1]];
    return newDataRtn;
  }
  initTimeChart(data: ITradeRecordItem[]) {
    let width = this.calcOffset(lastPricePoint[1] + '');
    if (this.fotmatTimeData(data) === false) return;
    recordTempList = [];
    if (echartsInstance !== null) {
      echartsInstance.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        grid: [
          {
            left: 0,
            right: width,
            height: 270,
            top: 10
          },
          {
            left: 0,
            right: width,
            top: 300,
            height: 55
          },
          {
            left: 0,
            right: width,
            top: 300,
            height: 55
          }
        ],
        axisPointer: {
          show: false
        },
        xAxis: [
          {
            type: 'category',
            data: recordTime,
            scale: true,
            interval: 5,
            boundaryGap: false,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              // padding:[10,0,30,0],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize: 12
              },
              color: function() {
                return '#aaa';
              }
            },
            splitLine: {
              show: true,
              interval: 20,
              lineStyle: {
                // 使用深浅的间隔色
                color: [this.lineColor]
              }
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: recordTime,
            scale: true,
            boundaryGap: false,
            splitNumber: 20,
            splitLine: {
              show: true,
              interval: 20,
              lineStyle: {
                // 使用深浅的间隔色
                color: [this.lineColor]
              }
            },
            axisLabel: { show: false },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            }
          },
          {
            type: 'category',
            gridIndex: 2,
            data: klineTime,
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            },
            axisLabel: { show: false }
          }
        ],
        yAxis: [
          {
            scale: true,
            position: 'right',
            splitNumber: 3,
            splitLine: {
              show: true,
              interval: 10,
              lineStyle: {
                // 使用深浅的间隔色
                color: [this.lineColor]
              }
            },
            splitArea: {
              show: false
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            },
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              padding: [70, 0, 50, 0],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize
              },
              color: function() {
                return '#aaa';
              }
            }
          },
          {
            // volum1
            gridIndex: 1,
            splitNumber: 2,
            position: 'right',
            axisTick: { show: false },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            },
            splitLine: { show: false },
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              padding: [10, 0, 30, 0],
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize
              },
              color: function() {
                return '#aaa';
              }
            }
          },
          {
            // volum2
            gridIndex: 2,
            splitNumber: 1,
            position: 'right',
            axisLine: {
              onZero: false,
              lineStyle: {
                color: this.lineColor
              }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: {
              // label文字设置
              inside: false, // label文字朝内对齐
              fontWeight: 'bold',
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontSize
              },
              color: function() {
                return '#aaa';
              }
            }
          }
        ],
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0, 0],
            start: 50,
            zoomLock: true,
            end: 100
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'inside',
            top: '97%',
            zoomLock: true,
            start: 50,
            end: 100
          },
          {
            show: false,
            xAxisIndex: [0, 2],
            type: 'inside',
            zoomLock: true,
            start: 50,
            end: 100
          }
        ],
        series: [
          {
            name: 'K线',
            type: 'line',
            smooth: true,
            data: recordData,
            symbol: 'none',
            stack: 'a',
            position: 'right',
            // itemStyle: {
            //     normal: {
            //         color: '#ef232a',
            //         color0: '#14b143',
            //         borderColor: '#ef232a',
            //         borderColor0: '#14b143'
            //     }
            // },
            lineStyle: {
              normal: {
                opacity: 0.8,
                color: '#39afe6',
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0, 136, 212, 0.7)'
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(0, 136, 212, 0.02)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            markPoint: {
              data: [
                {
                  type: 'max',
                  symbol: this.maxPointIcon,
                  // valueDim: 'highest',
                  symbolKeepAspect: true,
                  symbolSize: [18, 18],
                  label: {
                    color: '#fff',
                    fontSize: 1,
                    show: false
                  }
                },
                {
                  type: 'min',
                  symbol: this.minPointIcon,
                  symbolKeepAspect: true,
                  symbolSize: [18, 18],
                  // valueDim: 'lowest',  // 最低价
                  label: {
                    color: '#fff',
                    fontSize: 1,
                    show: false
                  }
                }
              ]
            }
          },
          {
            symbolSize: 2,
            data: [lastPriceTimePoint],
            type: 'scatter',
            markPoint: {
              data: [
                {
                  coord: ['' + lastPriceTimePoint[0], lastPriceTimePoint[1]],
                  symbol: this.pathSymbols.dot_r,
                  symbolOffset: [3, 0],
                  symbolSize: [26, 18],
                  value: lastPriceTimePoint[1], // lastPricePoint[1]
                  label: {
                    color: '#fff',
                    align: 'left',
                    fontSize,
                    fontWeight: 'bold',
                    position: 'right',
                    backgroundColor: '#C3181F',
                    borderRadius: 2,
                    padding: 5,
                    offset: [-5, 0]
                  }
                }
              ]
            }
          },
          {
            name: 'Volumn',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            barWidth: 2,
            data: recordVol,
            itemStyle: {
              normal: {
                color: function() {
                  // var colorList;
                  // if (klineData[params.dataIndex][1]>klineData[params.dataIndex][0]) {
                  //     colorList = '#ef232a';
                  // } else {
                  //     colorList = '#14b143';
                  // }
                  return '#ef232a';
                }
              }
            },
            symbol: 'none'
          }
        ]
      } as any);
    }
  }
  renderChart() {
    this.loading = true;
    // 实时图
    if (this.resolution + '' === '1') {
      websocketObserve && websocketObserve.unsubscribe(true);
      if (recordTempList.length > 0) {
        this.loading = false;
        this.initTimeChart(recordTempList);
      }
      return;
    }
    this.initMinChart();
  }
  timeChangeHandle(resolution: string) {
    if (this.debounceFlag === true) {
      return;
    }
    this.debounceFlag = true;
    window.clearTimeout(this.debounceTimer);
    this.debounceTimer = window.setTimeout(() => {
      this.debounceFlag = false;
    }, 700);
    if (this.resolution === resolution) return;
    this.resolution = resolution;
    setLocal('__kline_resolution', resolution);
    this.initChart();
    this.resetData();
    this.renderChart();
  }
  resetData() {
    klineData = [];
    klineVol = [];
    klineTime = [];
    lastPricePoint = [];
    // 缓存20条数据
    recordVol = recordVol.slice(-20);
    recordData = recordData.slice(-20);
    recordTime = recordTime.slice(-20);
    lastPriceTimePoint = [];
    firstRecordLoaded = false;
  }
  initChart() {
    if (echartsInstance !== null) {
      echartsInstance.clear();
      echartsInstance = null;
    }
    let echartsEl = this.$el.querySelector('#echarts-kline') as HTMLDivElement;
    echartsInstance = echarts.init(echartsEl);
  }
  created() {
    this.$bus.$on('update:records-list', (list: ITradeRecordItem[]) => {
      recordTempList.push(...list);
      recordTempList = recordTempList.slice(-150);
      if (this.resolution + '' === '1') {
        this.loading = false;
        this.initTimeChart(recordTempList);
      }
    });
  }
  mounted() {
    this.initChart();
    this.renderChart();
    offPageVisibleChange && offPageVisibleChange();
    offPageVisibleChange = onVisibilityChange((isHide: boolean): void => {
      if (isHide === true) return;
      this.initChart();
      this.resetData();
      this.renderChart();
    });
  }
  beforeDestroy() {
    this.$bus.$off('update:records-list');
    websocketObserve && websocketObserve.unsubscribe(true);
    websocketObserve = null;
    this.resetData();
    recordVol = [];
    recordData = [];
    recordTime = [];
    offPageVisibleChange && offPageVisibleChange();
    if (echartsInstance !== null) {
      echartsInstance.clear();
    }
    echartsInstance = null;
  }
}
</script>

<style lang='scss'>
.echarts-kline-box {
  height: 395px; /* no */
  display: flex;
  flex-direction: column;
  .kline-warp {
    flex: 1;
  }
  #echarts-kline {
    height: 100%;
  }
  .kline-filter {
    display: flex;
    align-items: center;
    line-height: 1;
  }
  .kline-tab {
    flex: 1;
    overflow: hidden;
    padding-left: 15px;
    ul {
      display: inline-flex;
      li {
        padding: 5px 12px;
        white-space: nowrap;
        font-size: 12px;
        color: #8d9ba8;
        font-weight: 500;
        &.active {
          color: #fff;
          background-color: #3d3a46;
          @include light {
            color: #4a4854;
            background-color: #e3e3e3;
          }
        }
      }
    }
  }
  .kline-dropdown {
    flex: none;
    position: relative;
    z-index: 1;
    p {
      color: #8d9ba8;
      font-weight: 500;
      font-size: 12px;
      padding: 5px 15px;
      .zb-icon {
        margin-left: 3px;
      }
    }
    ul {
      position: absolute;
      right: 15px;
      list-style: none;
      padding: 5px 0;
      border-radius: 3px; /* no */
      @include light {
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* no */
        border: 1px solid rgba(0, 0, 0, 0.05); /* no */
      }
      @include dark {
        background-color: #444252;
      }
      li {
        padding: 10px 20px;
        font-size: 12px;
        @include light {
          color: #8d9ba8;
          &.active {
            color: #1b1924;
          }
        }
        @include dark {
          color: var(--theme-color);
          &.active {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
