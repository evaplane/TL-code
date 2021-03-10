<template>
  <div class="market-wrap">
    <div class="market-head" ref="filterHead">
      <m-header class="header-extend" ref="head">
        <div class="header-btn menu-btn" slot="left" v-setting>
          <icon-menu />
        </div>
        <m-tabs v-model="tabActive">
          <m-tab :key="item.title" :title="item.title" :value="index" v-for="(item, index) in tabList" />
        </m-tabs>
        <div @click="searchVisibleChangeShow" class="header-btn search-btn" slot="right">
          <icon-search />
        </div>
      </m-header>
      <tab @disabled="disabled" v-model="coinType" border>
        <tab-item
          :disabled="isLogin === false && key === 'user'"
          v-for="(item, key) in mixinsCoinTabList"
          :name="key"
          :key="key"
          >{{ item }}</tab-item
        >
      </tab>
      <sort class="market-sort" @sort-change="sortChange">
        <sort-option name="vol">__('币种')</sort-option>
        <sort-option name="lastPrice">__('最新价')</sort-option>
        <sort-option name="riseRate">__('涨跌幅')</sort-option>
      </sort>
    </div>
    <market-list
      ref="marketList"
      :search-coin="searchCoin"
      :sort-name="sortName"
      :sort-type="sortType"
      :style="{ marginTop: filterHeadOffsetHeight }"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import sort, { ISortOptions } from '@/components/common/sort/sort.vue';
import sortOption from '@/components/common/sort/sort-option.vue';
import areaList from '@/mixins/market/area-list';
import { Getter } from 'vuex-class';
import mHeader from '@/components/index/head.vue';
import marketList from '@/components/index/market.vue';
import marketListRef from '@/components/index/market.ts';
import { tab, tabItem } from '@/components/common/tab/index';
import { Route } from 'vue-router';

interface ITabList {
  title: string;
  name: string;
}
@Component({
  components: {
    mHeader,
    sort,
    tab,
    tabItem,
    sortOption,
    marketList
  }
})
export default class MarketContent extends Mixins(areaList) {
  @Prop({ type: Boolean, default: false }) isSearch!: boolean;
  @Prop({ type: Boolean, default: false }) isFixed!: boolean;
  @Prop({ type: String, default: '' }) searchCoin!: string;
  @Prop({ type: Function }) searchVisibleHandle!: Function;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  sortType: string = 'default';
  sortName: string = '';
  active: number = 1;
  coinType: string = 'qc';
  tabActive: number = 0;
  tabList: ITabList[] = [
    {
      title: '__("主板")',
      name: 'mainboard'
    },
    {
      title: '__("杠杆")',
      name: 'lever'
    },
    {
      title: '__("活动")',
      name: 'innovate'
    }
  ];
  '$refs': {
    filterHead: HTMLDivElement;
    head: mHeader;
    marketList: marketListRef;
  };
  @Watch('$route.query.area')
  areaChanged(area: string) {
    this.$nextTick(() => {
      this.active = area === 'lever' ? 0 : 1;
    });
  }
  @Watch('coinType', { immediate: true })
  _(nv: Route, ov: Route) {
    if (ov && ov !== nv) {
      let { name, params, query } = this.$route;
      query = Object.assign({}, query, { market: this.coinType });
      this.$router.push({ name, params, query });
    }
    this.$nextTick(() => {
      this.$refs.marketList.getMarketList(this.coinType);
    });
  }
  @Watch('tabActive')
  tabActiveChanged(num: number) {
    let { name, params, query } = this.$route;
    query = Object.assign({}, query, { area: this.tabList[num].name });
    this.$router.push({ name, params, query });
  }
  get filterHeadOffsetHeight(): string {
    let height = '0px';
    if (this.isFixed === true && this.$refs.filterHead) {
      height = this.$refs.filterHead.offsetHeight + 'px';
    }
    return height;
  }
  searchVisibleChangeShow() {
    typeof this.searchVisibleHandle === 'function' && this.searchVisibleHandle();
  }
  change(index: number) {
    let market = Object.keys(this.mixinsCoinTabList)[index];
    let { name, params, query } = this.$route;
    query = Object.assign({}, query, { market });
    this.$router.push({ name, params, query });
  }
  disabled() {
    this.$message.warn('__("请先登录")');
  }
  sortChange(obj: ISortOptions) {
    this.sortType = obj.type;
    this.sortName = obj.name;
  }
  created() {
    let { market = 'qc' } = this.$route.query;
    this.active = Object.keys(this.mixinsCoinTabList).indexOf(market as string);
    this.tabList.map((item, index) => {
      if (item.name === this.$route.query.area) {
        this.tabActive = index;
      }
    });
  }
}
</script>

<style lang='scss'>
.m-scroll.fixed {
  .header-extend {
    .header-btn {
      visibility: visible;
      opacity: 1;
    }
  }
}
.market-wrap {
  .market-head {
    width: 100%;
    position: relative;
    z-index: 2;
    background-color: var(--default-bg);
  }
  .header-extend {
    .header-btn {
      visibility: hidden;
      transition: all 0.3s;
      opacity: 0;
    }
  }
  .market-sort {
    padding: 8px 15px;
    border-bottom: 1px solid rgba(0,0,0,0.04); /* no */
    @include dark {
      border-color: rgba(255,255,255,0.04);
    }
    .sort-item {
      &:first-of-type {
        width: 140px;
      }
      &:last-of-type {
        margin-left: auto;
      }
    }
  }
}
</style>
