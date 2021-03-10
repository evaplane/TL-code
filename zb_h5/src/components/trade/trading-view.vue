<template>
  <div class="trading-view-box" id="trading-view"></div>
</template>

<script lang="ts">
/* eslint @typescript-eslint/camelcase: off */
import { script } from '@/utils/http';
import { State } from 'vuex-class';
import { getLocal } from '@/utils/storage';
import { Component, Mixins, Watch } from 'vue-property-decorator';
import TradingViewNameSpaces from '@/assets/trading-view/charting_library.min';
import { send, IWebsocketQueryParams, IWebsocketObserve } from '@/utils/websocket';
import { onVisibilityChange } from '@/utils/event';
import { getKlineData } from '@/api/trade';
import mixinsMarket from '@/mixins/market/market';

declare global {
  var TradingView: typeof TradingViewNameSpaces;
}
let widget: TradingView.IChartingLibraryWidget | null = null,
  offPageVisibleChange: Function | null = null,
  websocketObserve: IWebsocketObserve | null = null;
@Component
export default class TradingViewComp extends Mixins(mixinsMarket) {
  @State('lang', { namespace: 'lang' }) lang!: string;
  @State('theme', { namespace: 'theme' }) theme!: string;
  @Watch('mixinsMarketInfo', { deep: true })
  marketInfoWatch() {
    this.initChart();
  }
  get curLang(): TradingView.LanguageCode {
    let langType: IObj<string> = {
      cn: 'zh'
    };
    return (langType[this.lang] || this.lang) as TradingView.LanguageCode;
  }
  @Watch('theme')
  _() {
    if (widget !== null) {
      widget.changeTheme(this.theme === 'light' ? 'Light' : 'Dark');
    }
  }
  getDatafeed(): TradingView.IBasicDataFeed {
    let { mixinsMarketInfo, mixinsTradeStr } = this;
    // 间隔转换参数
    const resolutionMap: IObj<string> = {
      '1': '1min',
      '5': '5min',
      '15': '15min',
      '30': '30min',
      '60': '1hour',
      '1D': '1day',
      '1W': '1week'
    };
    const resolutions = Object.keys(resolutionMap);
    const _transferData = (list: number[][]): TradingView.Bar[] => {
      return list.map(item => {
        return {
          time: Number(item[0]),
          open: Number(item[1]),
          high: Number(item[2]),
          low: Number(item[3]),
          close: Number(item[4]),
          volume: Number(item[5])
        };
      });
    };
    let incrementalList: TradingView.Bar[] = [];
    const getBarsBySocket = async (
      symbolInfo: TradingView.LibrarySymbolInfo,
      resolution: string,
      onTick: TradingView.SubscribeBarsCallback
    ) => {
      websocketObserve && websocketObserve.unsubscribe(true);
      let symbol = this.mixinsTradeStrUnit,
        time = resolutionMap[resolution];
      let socketParams: IWebsocketQueryParams = {
        binary: true,
        isZip: true,
        channel: `${symbol}_kline_${time}`,
        event: 'addChannel'
      };
      let { length } = incrementalList;
      if (length > 0) {
        socketParams.lastTime = incrementalList[length - 1].time;
      }
      websocketObserve = await send(socketParams, websocketInstance => {
        websocketInstance.subscribe((res): void => {
          incrementalList = incrementalList.concat(_transferData(res.datas.data));
          if (onTick && res.channel.indexOf(symbol) === 0) {
            let bar: TradingView.Bar | undefined;
            while ((bar = incrementalList.shift())) {
              onTick(bar);
            }
          }
        });
      });
    };
    const getBarsByAjax = async (
      symbolInfo: TradingView.LibrarySymbolInfo,
      resolution: string,
      onTick: TradingView.SubscribeBarsCallback
    ) => {
      websocketObserve && websocketObserve.unsubscribe(true);
      let res = await getKlineData({
        symbol: this.mixinsTradeStrUnit,
        nextTickers: 1,
        since: new Date('2019/01/01 12:00:00').getTime(),
        type: resolutionMap[resolution]
      });
      incrementalList = _transferData(res.data);
      getBarsBySocket(symbolInfo, resolution, onTick);
    };
    return {
      searchSymbols(): void {},
      onReady(callback: TradingView.OnReadyCallback): void {
        setTimeout((): void => {
          let config: TradingView.DatafeedConfiguration = {
            supported_resolutions: resolutions,
            supports_marks: false,
            supports_time: true,
            supports_timescale_marks: false
          };
          callback(config);
        }, 0);
      },
      resolveSymbol(symbolName: string, onResolve: TradingView.ResolveCallback): void {
        let symbolInfo: TradingView.LibrarySymbolInfo = {
          ticker: mixinsTradeStr.replace('_', ''),
          type: mixinsTradeStr,
          name: mixinsTradeStr,
          full_name: mixinsTradeStr.toUpperCase(),
          listed_exchange: '',
          exchange: 'ZB.com',
          description: '',
          timezone: 'Asia/Hong_Kong',
          data_status: 'streaming',
          minmov: 1,
          minmove2: 0,
          // 小数位
          pricescale: Math.pow(10, mixinsMarketInfo.moneyDecimal),
          has_intraday: true,
          has_weekly_and_monthly: true,
          supported_resolutions: resolutions,
          intraday_multipliers: ['1', '5', '15', '30', '60', '1D', '1W'],
          session: '24x7'
        };
        setTimeout(() => {
          onResolve(symbolInfo);
        }, 0);
      },
      async subscribeBars(
        symbolInfo: TradingView.LibrarySymbolInfo,
        resolution: string,
        onTick: TradingView.SubscribeBarsCallback,
        listenerGuid: string,
        onResetCacheNeededCallback: Function
      ): Promise<any> {
        getBarsByAjax(symbolInfo, resolution, onTick);
        offPageVisibleChange && offPageVisibleChange();
        offPageVisibleChange = onVisibilityChange((isHide: boolean): void => {
          if (isHide === true) return;
          incrementalList = [];
          onResetCacheNeededCallback();
          widget && widget.chart().resetData();
        });
      },
      unsubscribeBars(): void {
        // 移除websocket ?
      },
      async getBars(
        symbolInfo: TradingView.LibrarySymbolInfo,
        resolution: TradingView.ResolutionString,
        rangeStartDate: number,
        rangeEndDate: number,
        onResult: TradingView.HistoryCallback,
        onError: TradingViewNameSpaces.ErrorCallback,
        isFirstCall: boolean
      ): Promise<any> {
        //	timestamp sample: 1399939200
        if (rangeStartDate > 0 && (rangeStartDate + '').length > 10) {
          throw new Error('Got a JS time instead of Unix one.' + rangeStartDate + ',' + rangeEndDate);
        }
        if (isFirstCall === false) {
          onResult([], { noData: true });
          return;
        }
        try {
          onResult([], { noData: false });
        } catch (error) {
          console.log(error);
        }
      }
    } as TradingView.IBasicDataFeed;
  }
  async initChart(): Promise<any> {
    await script({ url: './trading-view/charting_library.min.js' });
    let interval: string = getLocal('tv_resolution') || '15';
    widget = new TradingView.widget({
      symbol: this.mixinsTradeStr,
      datafeed: this.getDatafeed(),
      interval,
      container_id: 'trading-view',
      library_path: './trading-view/',
      timezone: 'Asia/Hong_Kong',
      locale: this.curLang,
      preset: 'mobile',
      theme: this.theme === 'light' ? 'Light' : 'Dark',
      enabled_features: ['header_widget'],
      disabled_features: [
        'use_localstorage_for_settings',
        'header_compare',
        'header_undo_redo',
        'header_symbol_search',
        'symbol_search_hot_key',
        'header_resolutions',
        'header_interval_dialog_button',
        'show_interval_dialog_on_key_press',
        'header_indicators',
        'header_screenshot',
        'header_settings',
        'header_widget_dom_node',
        'header_fullscreen_button'
      ],
      overrides: {
        // 'paneProperties.background': '#0F202D',
        // 'paneProperties.vertGridProperties.color': 'rgba(0,0,0, 0)',
        // 'paneProperties.horzGridProperties.color': '#26384E',
        'paneProperties.vertGridProperties.style': 2,
        'paneProperties.crossHairProperties.color': '#728496',
        'scalesProperties.textColor': '#728496',
        'scalesProperties.lineColor': '#728496',
        'paneProperties.legendProperties.showSeriesTitle': false,
        'paneProperties.legendProperties.showStudyTitles': false,
        'mainSeriesProperties.candleStyle.upColor': '#27C38D',
        'mainSeriesProperties.candleStyle.wickUpColor': 'rgba(39,195,141, .5)',
        'mainSeriesProperties.candleStyle.downColor': '#E6201A',
        'mainSeriesProperties.candleStyle.wickDownColor': 'rgba(230,32,26, .5)'
      },
      toolbar_bg: 'transparent',
      widgetbar: { details: false, watchlist: false, watchlist_settings: { default_symbols: [] } },
      time_frames: [
        { text: '1w', resolution: '1W', description: '1 Week' },
        { text: '1d', resolution: '1D' },
        { text: '1min', resolution: '1' },
        { text: '15min', resolution: '15' },
        { text: '30min', resolution: '30' },
        { text: '1hour', resolution: '60' }
      ] as { text: string; resolution: string; description?: string }[],
      custom_css_url: 'night.css',
      // loading_screen: { backgroundColor: '#0F202D' },
      autosize: true,
      studies_overrides: {},
      debug: false
    });
    widget.headerReady().then(() => {
      var timeFrames = [
        {
          slug: '__("分时")',
          resolution: '1'
        },
        {
          slug: '__("5分")',
          resolution: '5'
        },
        {
          slug: '__("15分")',
          resolution: '15'
        },
        {
          slug: '__("30分")',
          resolution: '30'
        },
        {
          slug: '__("1时")',
          resolution: '60',
          isMobile: !0
        },
        {
          slug: '__("1日")',
          resolution: '1D',
          isMobile: !0
        }
      ];
      let activeBtn: HTMLElement | null = null;
      timeFrames.map(function(item) {
        if (widget !== null) {
          let btn: HTMLElement = widget.createButton({ align: 'left' });
          btn.setAttribute('title', item.slug);
          btn.classList.add('time-button');
          btn.innerText = item.slug;
          if (interval.toString() === item.resolution) {
            btn.classList.add('active');
            activeBtn = btn;
          }
          btn.onclick = function(e: any) {
            if (activeBtn !== null) {
              activeBtn.classList.remove('active');
            }
            activeBtn = e.target;
            e.target.classList.add('active');
            widget &&
              widget.chart().setResolution(item.resolution, function() {
                localStorage.setItem('tv_resolution', item.resolution);
              });
          };
        }
      });
    });
    widget.onChartReady(function(this: any) {
      // 防止加载是闪白底，副作用是loading动画显示不了
      // document.getElementById(this._id).style.cssText = 'display: block; visibility: visible; width: 100%; height: 100%;';
      // 默认开启EMA Cross 指标
      widget && widget.chart().createStudy('EMA Cross', false, false);
    });
  }
  beforeDestroy() {
    widget = null;
    websocketObserve && websocketObserve.unsubscribe(true);
    websocketObserve = null;
    offPageVisibleChange && offPageVisibleChange();
  }
}
</script>

<style lang="scss">
.trading-view-box {
  height: 400px;
  iframe {
    background: #141f2b;
  }
}
</style>
