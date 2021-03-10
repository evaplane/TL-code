<template>
  <div class="trade-records-box">
    <div class="title">
      <span>__('成交时间')</span>
      <span>__('成交价格')</span>
      <span>__('成交量')</span>
    </div>
    <van-skeleton :row="4" :row-width="['100%', '100%', '100%', '100%']" class="trades" v-if="loading" />
    <transition-group
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      class="trades"
      mode="in-out"
      tag="ul"
    >
      <li :data-type="item.type" :key="item.date + item.tid + item.amount" v-for="item in list">
        <span class="time">{{ item.dateFmt }}</span>
        <span :class="item.typeClass" class="price">{{ item.price }}</span>
        <span class="amount">
          {{ item.amountArr[0] }}
          <i>.{{ item.amountArr[1] }}</i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { send, IWebsocketObserve } from '@/utils/websocket';
import market from '@/mixins/market/market';
import { formatDate } from '@/utils/date';
import { isNotEmpty } from '@/utils/is';
import { fixNumber, multiply } from '@/utils/math';
import { onVisibilityChange } from '@/utils/event';
let offVisibleChange: Function | null;

interface ITradeRecordItem {
  amount: string;
  date: number;
  price: string;
  tid: number;
  trade_type: string;
  type: string;
}
type TypeClass = 'buy-color' | 'sell-color';
interface IExtendTradeRecordItem extends ITradeRecordItem {
  dateFmt: string;
  amountArr: string[];
  typeClass: TypeClass;
}
interface ITradeRecordData {
  data: ITradeRecordItem[];
  rate: string;
  no: number;
}
export interface INewRecord {
  type: string;
  typeClass: TypeClass;
  price: string;
  conversion: string;
}
@Component
export default class TradeRecords extends Mixins(market) {
  list: IExtendTradeRecordItem[] = [];
  websocketInstance!: IWebsocketObserve | null;
  loading = false;
  beforeEnter(el: HTMLLIElement) {
    el.style.backgroundColor = '#EEE';
    el.style.opacity = '0';
    el.style.height = '0';
  }
  enter(el: HTMLLIElement) {
    setTimeout(() => {
      el.style.backgroundColor = 'transparent';
      el.style.opacity = '1';
      el.style.height = '20px';
    }, 0);
  }
  leave() {}
  splitByDot(num: number | string, decimal: number): string[] {
    if (Number(num)) {
      let numArr = fixNumber(num, decimal)
        .toString()
        .split('.');
      return [numArr[0] || '', numArr[1] || ''];
    }
    return ['', ''];
  }
  transfer(list: ITradeRecordItem[]): IExtendTradeRecordItem[] {
    if (isNotEmpty(list) === true) {
      return list
        .sort((v1, v2) => v2.date - v1.date)
        .map(item => {
          item.price = fixNumber(item.price, this.mixinsCoinDecimal);
          return Object.freeze(
            Object.assign(
              {
                dateFmt: formatDate(item.date, 'hh:mm:ss').toString(),
                amountArr: this.splitByDot(item.amount, this.mixinsMoneyDecimal),
                typeClass: (item.type === 'buy' ? 'buy-color' : 'sell-color') as TypeClass
              },
              item
            )
          );
        });
    }
    return [];
  }
  async getData() {
    this.loading = true;
    this.websocketInstance = await send(
      {
        isZip: true,
        binary: true,
        channel: this.mixinsTradeStrUnit + '_lasttrades',
        event: 'addChannel'
      },
      instance => {
        instance
          .subscribe((res: ITradeRecordData): void => {
            this.loading = false;
            let list = this.transfer(res.data);
            this.list.unshift(...list);
            this.list = this.list.slice(0, 60);
            const { type, typeClass, price } = this.list[0],
              conversion = fixNumber(multiply(price, res.rate), this.mixinsCoinDecimal),
              values: INewRecord = {
                price,
                type,
                typeClass,
                conversion
              };
            this.$bus.$emit('update:cur-price', values);
            // 将交易记录传送到实时图
            this.$bus.$emit('update:records-list', list);
          })
          .catch(() => {
            this.list = [];
            this.loading = false;
          });
      }
    );
  }
  mounted() {
    offVisibleChange = onVisibilityChange((isHide: boolean): void => {
      if (isHide === true) {
        this.list = [];
      }
    });
    window.setTimeout(this.getData, 300);
  }
  beforeDestroy() {
    offVisibleChange && offVisibleChange();
    offVisibleChange = null;
    this.websocketInstance && this.websocketInstance.unsubscribe(true);
  }
}
</script>

<style lang='scss'>
.trade-records-box {
  color: var(--theme-color);
  height: 350px;
  overflow: hidden;
  padding: 0 15px;
  &.transition--active {
    .trades li {
      transition: all 0.8s;
    }
  }
  .title {
    padding: 10px 0;
    span {
      display: inline-block;
      width: 40%;
      text-align: right;
      &:nth-child(2) {
        width: 18%;
      }
      &:first-child {
        text-align: left;
      }
    }
  }
  .trades {
    min-height: 100%;
    box-sizing: border-box;
    li {
      display: flex;
      justify-content: space-around;
      height: 20px;
      // transition: all 0.8s;
      background: transparent;
      overflow: hidden;
      opacity: 1;
    }
    span {
      line-height: 20px;
      width: 41%;
      display: inline-block;
      text-align: right;
      padding-right: 5px;
      &:nth-child(2) {
        width: 18%;
      }
      &:first-child {
        text-align: left;
      }
    }
    i {
      font-style: normal;
    }
  }
}
</style>
