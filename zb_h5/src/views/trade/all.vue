<template>
  <div class="all-box" v-loading="loading">
    <native-scroll>
      <ul class="market-list">
        <li class="market-item" v-for="item in list" :key="item.symbol">
          <div class="column column--left">
            <img :alt="item.name.substr(0, 1)" v-icon="`./img/exchange/${item.name.toLowerCase()}.svg`" />
            <div>
              <p class="t">
                {{ item.name
                }}<!-- <span class="gray">/{{item.extendMoneyNameUp}}</span> -->
              </p>
              <p class="b">{{ lang !== 'cn' ? item.name.toUpperCase() : item.cName }}:{{ item.ticker.vol }}</p>
            </div>
          </div>
          <div class="column column--centre">
            <p class="t" :class="item.typeClass">{{ item.ticker.dollar }}</p>
            <p class="b">￥{{ item.ticker.last }}</p>
          </div>
          <div :class="item.typeClassBg" class="column column--right">
            <span>{{ Number(item.ticker.riseRate) > 0 ? '+' : '' }}{{ item.ticker.riseRate }}%</span>
          </div>
        </li>
      </ul>
      <no-data :visible="list.length === 0 && loading === false" />
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixnisMarket from '@/mixins/market/market';
import { getTickers, ITickers } from '@/api/trade';
import { isNotEmpty } from '@/utils/is';
import { fixNumber } from '@/utils/math';
import noData from '@/components/common/no-data.vue';
import { State } from 'vuex-class';

interface IExtendTickers extends ITickers {
  typeClass: 'buy-color' | 'sell-color';
  typeClassBg: 'buy-bg' | 'sell-bg';
}
@Component({
  components: {
    noData
  }
})
export default class All extends Mixins(mixnisMarket) {
  list: IExtendTickers[] = [];
  timer!: number;
  loading: boolean = true;
  @State('lang', { namespace: 'lang' }) lang!: string;
  @Watch('mixinsTradeStr')
  _() {
    this.loading = true;
    this.getList();
  }
  async getList(): Promise<void> {
    let list: ITickers[] = await getTickers(this.mixinsCShowName);
    window.setTimeout(() => {
      this.loading = false;
    }, 200);
    if (isNotEmpty(list) === true) {
      this.list = (list as IExtendTickers[]).filter((item: IExtendTickers): boolean => {
        if (typeof item.name === 'string') {
          item.name = item.name.toUpperCase();
        }
        if (Number(item.ticker.riseRate) < 0) {
          item.typeClass = 'sell-color';
          item.typeClassBg = 'sell-bg';
        } else {
          item.typeClass = 'buy-color';
          item.typeClassBg = 'buy-bg';
        }
        item.ticker.vol = fixNumber(parseFloat(item.ticker.vol) / 10000, 2) + '__("万")';
        return isNotEmpty(item.cName) === true;
      });
    }
    window.clearTimeout(this.timer);
    // 定时0.5分钟重新请求
    this.timer = window.setTimeout(this.getList, 5000);
  }
  beforeDestroy() {
    window.clearTimeout(this.timer);
  }
  mounted() {
    this.loading = true;
    this.getList();
  }
}
</script>

<style lang='scss'>
@import '@scss/market-list/list.scss';
.all-box {
  flex: 1;
  overflow: hidden;
  .market-list .market-item .column--left img {
    border-radius: 0;
  }
}
</style>
