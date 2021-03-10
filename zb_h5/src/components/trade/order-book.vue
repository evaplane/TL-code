<template>
  <div class="order-book-box">
    <div class="title">
      <span>__('价格')({{ mixinsFShowNameUp }})</span>
      <span>__('数量')({{ mixinsCShowNameUp }})</span>
    </div>
    <div class="data-list">
      <div class="order-list">
        <van-skeleton :row="20" class="asks-skeleton" v-if="loading" />
        <transition-group
          @before-enter="beforeEnter"
          @before-leave="leave"
          @enter="enter"
          class="asks-order-list"
          ref="asks"
          leave-to-class="leave-active"
          mode="in-out"
          tag="ul"
          v-else
        >
          <li class="row" :key="ask[0]" @click="rowClickHandle($event, ask[0], ask[3])" v-for="ask in asksList">
            <span class="price">{{ ask[1] }}</span>
            <span class="amount">{{ ask[3] }}</span>
          </li>
        </transition-group>
      </div>
      <div class="current-price">
        <div :class="priceState" class="default-price">{{ mixinsMoneyType + curMarketTopInfo.lastPrice }}</div>
        <div v-if="mixinsFShowNameUp !== 'QC'" class="transfer-current-price">≈{{ mixinsConvertLastPrice }} CNY</div>
      </div>
      <div class="order-list">
        <van-skeleton :row="20" class="bids-skeleton" v-if="loading" />
        <transition-group
          @before-enter="beforeEnter"
          @before-leave="leave"
          @enter="enter"
          class="bids-order-list"
          leave-to-class="leave-active"
          mode="in-out"
          tag="ul"
          v-else
        >
          <li class="row" :key="bid[0]" @click="rowClickHandle($event, bid[0], bid[3])" v-for="bid in bidsList">
            <span class="price">{{ bid[1] }}</span>
            <span class="amount">{{ bid[3] }}</span>
          </li>
        </transition-group>
      </div>
      <div class="data-format u-clear">
        <div @click="deepClickHandle" class="deep">__('深度'){{ deepValue }}</div>
        <div @click="selectCount" class="count">__('档位'){{ countValue }}</div>
      </div>
    </div>
    <van-action-sheet
      :actions="actions"
      :lazy-render="false"
      @select="selectHandle"
      cancel-text="__('取消')"
      class="order-book-action-sheet"
      get-container="body"
      safe-area-inset-bottom
      v-model="actionSheetVisible"
    />
    <van-action-sheet
      :actions="deepActions"
      :lazy-render="false"
      @select="deepSelectHandle"
      cancel-text="__('取消')"
      class="order-book-action-sheet"
      get-container="body"
      safe-area-inset-bottom
      v-model="deepActionSheetVisible"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import { send, IWebsocketObserve } from '@/utils/websocket';
import mixinsTopData from '@/mixins/market/top-data';
import { fixNumber } from '@/utils/math';
import { throttle } from '@/utils/date';

interface IDeepResponse {
  listUp: number[][];
  listDown: number[][];
}
interface IActions {
  name: string;
  value: number;
}
interface IQuotesItem {
  area: number;
  buy1Price: string;
  currrency: string;
  hightPrice: string;
  isLever: boolean;
  lastPrice: string;
  leverMultiple: number;
  lowPrice: string;
  market: string;
  marketShowName: string;
  riseRate: string;
  sell1Price: string;
  showName: string;
  vol: string;
  volText: string;
}
type PriceState = 'buy-color' | 'sell-color';
@Component
export default class OrderBook extends Mixins(mixinsTopData) {
  actionSheetVisible = false;
  actions: IActions[] = [];
  websocketInstance: IWebsocketObserve | null = null;
  countValue: number = 20;
  loading = false;
  deepActionSheetVisible: boolean = false;
  // 二维数组 [[原始价格, 格式化位数之后的价格, 原始数量, 格式化位数之后的数量]]
  asksList: string[][] = [];
  // 二维数组 [[原始价格, 格式化位数之后的价格, 原始数量, 格式化位数之后的数量]]
  bidsList: string[][] = [];
  get deepValue(): string {
    return '0.' + '1'.padStart(this.mixinsCoinDecimal, '0');
  }
  priceState: PriceState = 'buy-color';
  get deepActions() {
    return [{ name: this.deepValue, value: this.deepValue }];
  }
  '$refs': {
    asks: any;
  };
  @Watch('curMarketTopInfo.lastPrice')
  __(newVal: string, oldVal: string): void {
    if (Number(newVal) > Number(oldVal)) {
      this.priceState = 'buy-color';
      return;
    }
    this.priceState = 'sell-color';
  }
  @Watch('mixinsMarketInfo', { deep: true })
  _() {
    this.asksList = [];
    this.bidsList = [];
    this.getData();
  }
  beforeEnter(el: HTMLLIElement) {
    el.style.opacity = '0';
    el.style.height = '0';
  }
  enter(el: HTMLLIElement) {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.height = '0.5866667rem';
    }, 0);
  }
  leave(el: HTMLLIElement) {
    el.style.color = '#666';
    el.style.opacity = '0';
    el.style.height = '0';
  }
  splitByDot(num: number | string, decimal: number): string[] {
    if (Number(num)) {
      let value = fixNumber(num, decimal).toString();
      return [num.toString(), value || ''];
    }
    return ['', ''];
  }
  selectCount() {
    this.actions = [5, 10, 20, 50].map(val => {
      return {
        name: val.toString() + '__("档")',
        value: val
      };
    });
    this.actionSheetVisible = true;
  }
  selectHandle(item: IActions) {
    this.actionSheetVisible = false;
    if (this.countValue !== item.value) {
      this.countValue = item.value;
      this.asksList = [];
      this.bidsList = [];
      this.getData();
    }
  }
  deepSelectHandle() {
    this.deepActionSheetVisible = false;
  }
  deepClickHandle() {
    this.deepActionSheetVisible = true;
  }
  rowClickHandle(event: TouchEvent, price: string, amount: string) {
    let target = event.target as HTMLDivElement;
    if (target && target.classList.contains('row') === false) {
      target = target.parentNode as HTMLDivElement;
    }
    target.classList.add('click--active');
    window.setTimeout(() => {
      target.classList.remove('click--active');
    }, 400);
    this.$bus.$emit('handicap.vue:current-price', price, amount);
  }
  transfer(data: number[][]): string[][] {
    let obj: IObj<string | number> = {};
    data.map(item => {
      obj[item[0]] = item[1];
    });
    let arr = Object.keys(obj)
      .sort((v1, v2) => Number(v2) - Number(v1))
      .slice(0, 30)
      .reduce((arr: string[][], key: string): string[][] => {
        if (Number(obj[key]) > 0) {
          let coinPriceArr = this.splitByDot(key, this.mixinsMoneyDecimal),
            amountArr = this.splitByDot(obj[key], this.mixinsCoinDecimal);
          arr.push(coinPriceArr.concat(amountArr));
        }
        return arr;
      }, []);
    return arr;
  }
  async getData() {
    this.loading = true;
    this.websocketInstance && this.websocketInstance.unsubscribe(true);
    const scrollToBottomFun = throttle(() => {
      this.$nextTick(() => {
        if (!this.$refs.asks) {
          return;
        }
        let { $el } = this.$refs.asks;
        $el.scrollTo({ top: $el.scrollHeight });
      });
    }, 5000);
    this.websocketInstance = await send({
      isZip: true,
      binary: true,
      event: 'addChannel',
      channel: `dish_length_${this.countValue}_${this.mixinsTradeStr.replace('_', '')}default`
    });
    if (this.websocketInstance) {
      this.websocketInstance
        .subscribe((res: IDeepResponse[]): void => {
          this.loading = false;
          if (res && res.length > 0) {
            this.asksList = this.transfer(res[0].listUp);
            this.bidsList = this.transfer(res[0].listDown);
          } else {
            this.asksList = [];
            this.bidsList = [];
          }
          scrollToBottomFun();
        })
        .catch(err => {
          this.loading = false;
          console.log(err.message);
        });
    }
  }
  beforeDestroy() {
    this.websocketInstance && this.websocketInstance.unsubscribe(true);
  }
}
</script>

<style lang='scss'>
.order-book-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .title {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    font-size: 10px;
    height: 20px;
    padding: 0 15px 0 5px;
  }
  .data-list {
    overflow: hidden;
    height: calc(100% - 20px);
    display: flex;
    flex-direction: column;
  }
  .van-skeleton {
    padding: 10px 0;
  }
  .asks-skeleton .van-skeleton__row {
    width: 100% !important;
  }
  .order-list {
    position: relative;
    flex: 1;
    overflow: hidden;
    .price {
      color: var(--buy-color);
    }
    li {
      display: flex;
      justify-content: space-between;
      height: 22px;
      padding: 0 5px;
      margin-right: 10px;
      color: #8d9ba8;
      transition: all 0.8s;
      background: transparent;
      overflow: hidden;
      opacity: 1;
      font-size: 14px;
      font-weight: 500;
      &.click--active {
        transition: all 0.2s;
        background: rgba(164, 159, 189, 0.178);
      }
      span {
        line-height: 22px;
      }
    }
  }
  .asks-skeleton,
  .bids-skeleton {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .asks-order-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    .price {
      color: var(--sell-color);
    }
  }
  .bids-order-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .current-price {
    flex: none;
    text-align: center;
    transition: color 0.4s;
    padding: 8px 0;
    .default-price {
      font-size: 20px;
      font-weight: 500;
    }
    .transfer-current-price {
      font-size: 12px;
    }
  }
  .data-format {
    flex: none;
    padding: 5px 15px 0 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .deep,
    .count {
      border: 1px solid #dbdde2; /* no */
      @include dark {
        border-color: #44474a;
      }
      color: var(--thin-color);
      height: 26px;
      border-radius: 2px; /* no */
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after {
        content: '';
        width: 0;
        height: 0;
        border-left: 3px solid transparent; /* no */
        border-right: 3px solid transparent; /* no */
        border-top: 3px solid; /* no */
        margin-left: 3px; /* no */
      }
    }
    .deep {
      flex: 1 1 auto;
    }
    .count {
      flex: 1 1 auto;
      margin-left: 5px;
    }
  }
}
</style>
