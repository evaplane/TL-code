<template>
  <div class="kline-box">
    <native-scroll @scroll="scrollHandle">
      <div class="coin-info">
        <div class="info-left">
          <div :class="Number(curMarketTopInfo.riseRate) > 0 ? 'buy-color' : 'sell-color'" class="num">
            {{ fixNumber(curMarketTopInfo.lastPrice) }}
          </div>
          <p>
            <template v-if="mixinsFShowNameUp !== 'QC'">
              ≈¥{{ mixinsConvertLastPrice }}
            </template>
            <span :class="Number(curMarketTopInfo.riseRate) > 0 ? 'buy-color' : 'sell-color'" class="rise"
              >{{ (Number(curMarketTopInfo.riseRate) > 0 ? '+' : '') + curMarketTopInfo.riseRate }}%</span
            >
          </p>
        </div>
        <div class="info-right">
          <p>
            __('高')
            <span class="value">{{ curMarketTopInfo.hightPrice || '--' }}</span>
          </p>
          <p>
            __('低')
            <span class="value">{{ curMarketTopInfo.lowPrice || '--' }}</span>
          </p>
          <p>
            __('量')
            <span class="value">{{ curMarketTopInfo.volText || '--' }}</span>
          </p>
        </div>
      </div>
      <div class="trading-view">
        <trading-view />
      </div>
      <div class="line" />
      <h3 class="deep-title">深度</h3>
      <deep />
      <div class="line" />
      <records ref="records" :class="recordTransition" />
      <div class="line"></div>
      <div class="trade-btns">
        <router-link
          :to="{ name: 'trade-handicap', params: { type: $route.params.type }, query: { type: 'buy' } }"
          class="sell-btn trade-btn"
          >__('买入')</router-link
        >
        <router-link
          :to="{ name: 'trade-handicap', params: { type: $route.params.type }, query: { type: 'sell' } }"
          class="buy-btn trade-btn"
          >__('卖出')</router-link
        >
      </div>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import mixinsTopData from '@/mixins/market/top-data';
// import tradingView from '@/components/trade/trading-view.vue';
import tradingView from '@/components/trade/echarts-kline.vue';
import deep from '@/components/trade/deep.vue';
import { fixNumber } from '@/utils/math';
import records from '@/components/trade/records.vue';

@Component({
  components: {
    tradingView,
    deep,
    records
  }
})
export default class Kline extends Mixins(mixinsTopData) {
  dropdown: boolean = false;
  asyncComp: any = null;
  y: number = 1;
  offsetTop: number = 0;
  offsetHeight: number = 0;
  recordTransition: string = '';
  '$refs': {
    records: records;
  };
  '$el': HTMLDivElement;
  fixNumber(num: string) {
    if (!Number(num)) {
      return '--';
    }
    return fixNumber(num, this.mixinsMoneyDecimal);
  }
  scrollHandle(pos: INativeScrollPos) {
    if (pos.y + this.offsetHeight > this.offsetTop + 100) {
      this.recordTransition = 'transition--active';
      return;
    }
    this.recordTransition = '';
  }
  mounted() {
    this.offsetHeight = this.$el.offsetHeight;
    this.offsetTop = (this.$refs.records.$el as HTMLDivElement).offsetTop;
  }
}
</script>

<style lang='scss'>
.kline-box {
  flex: 1;
  overflow: hidden;
  .coin-info {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    color: #8d9ba8;
    font-weight: 500;
  }
  .position {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .info-left {
    .num {
      font-size: 28px;
    }
    p {
      font-size: 14px;
      margin-top: 10px;
    }
    .rise {
      margin-left: 5px;
    }
  }
  .info-right {
    p {
      font-size: 12px;
      display: flex;
      & + p {
        margin-top: 8px;
      }
    }
    .value {
      flex: 1;
      padding-left: 10px;
      text-align: right;
      color: #1b1924;
      @include dark {
        color: #fff;
      }
    }
  }
  .deep-chart-tab {
    .van-tabs__nav {
      width: 200px;
      margin: 0 auto;
    }
  }
  .deep-title {
    font-size: 16px;
    color: var(--theme-color);
    padding: 15px;
  }
  .trade-btns {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    .trade-btn {
      font-size: 16px;
      font-weight: bold;
      width: calc((100% - 15px) / 2);
      text-align: center;
      border-radius: 40px;
      padding: 10px 0;
    }
    .buy-btn {
      border: 1px solid var(--sell-color); /* no */
      color: var(--sell-color);
    }
    .sell-btn {
      color: #fff;
      background: var(--buy-color);
    }
    .menu-btn {
      color: var(--primary-color);
      border-radius: 50%;
      font-size: 40px;
      vertical-align: middle;
    }
  }
}
</style>
