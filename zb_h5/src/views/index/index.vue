<template>
  <div class="index-box">
    <search :visible.sync="searchVisible" v-model="searchCoin" />
    <native-scroll :class="{ searching: searchVisible, fixed: isFixed }" @scroll="scrollHandle" class="scroll-warp">
      <div class="base">
        <m-header ref="header">
          <a class="logo" href="#" slot="left">
            <img class="index-logo" src="@img/index/logo.svg" />
            <span>中币</span>
          </a>
          <div class="header-right" slot="right">
            <div @click="searchVisibleChangeShow" class="header-btn search-btn">
              <icon-search />
            </div>
            <div class="header-btn menu-btn" v-setting>
              <icon-menu />
            </div>
          </div>
        </m-header>
        <div class="banner-warp" ref="banner">
          <!-- <van-swipe :autoplay="8000">
            <van-swipe-item :key="index" v-for="(image, index) in imageList">
              <img :src="image" @click="swipeClick(index)" @load="imgLoadHandle" />
            </van-swipe-item>
          </van-swipe> -->
        </div>
        <market-content :is-fixed="isFixed" :is-search="false" :search-visible-handle="searchVisibleChangeShow" />
      </div>
    </native-scroll>
    <transition name="market-search">
      <native-scroll class="fixed-cover" v-show="searchVisible">
        <market-list :search-coin="searchCoin" is-search ref="marketList" />
      </native-scroll>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import marketList from '@/components/index/market.vue';
import { Swipe as vanSwipe, SwipeItem as vanSwipeItem } from 'vant';
import marketContent from '@/components/index/market-content.vue';
import search from '@/components/index/search.vue';
import mHeader from '@/components/index/head.vue';
@Component({
  components: {
    search,
    marketList,
    vanSwipe,
    vanSwipeItem,
    mHeader,
    marketContent
  }
})
export default class Index extends Vue {
  isLanguage: boolean = false;
  navVisible: boolean = false;
  navActive: boolean = false;
  searchVisible: boolean = false;
  isFixed: boolean = false;
  searchCoin: string = '';
  bannerOffsetHeight: number = 0;
  imageList: string[] = [
    require('@img/banner/banner3.png'),
    require('@img/banner/banner2.png'),
    require('@img/banner/banner.png')
  ];
  '$refs': {
    banner: HTMLDivElement;
    header: mHeader;
    marketList: marketList;
  };
  get market() {
    let { market } = this.$route.query;
    if (!market || market === 'user') {
      market = 'qc';
    }
    return market + '';
  }
  @Watch('market', { immediate: true })
  _() {
    this.$nextTick(() => {
      this.$refs.marketList.getMarketList(this.market);
    });
  }
  navClickHandle() {
    this.navVisible = !this.navVisible;
  }
  maskClickHandle() {
    this.navVisible = false;
  }
  afterLeaveHandle() {
    this.navActive = false;
  }
  searchVisibleChangeShow() {
    this.searchVisible = true;
    this.$nextTick(() => {
      let fixedCover = this.$el.querySelector('.fixed-cover');
      if (fixedCover !== null) {
        fixedCover.scrollTo({
          top: 0
        });
      }
    });
  }
  searchVisibleChangeHide() {
    this.searchVisible = false;
  }
  imgLoadHandle() {
    if (!this.$refs.banner) return;
    this.bannerOffsetHeight = this.$refs.banner.offsetHeight + this.$refs.header.$el.offsetHeight;
  }
  scrollHandle(pos: INativeScrollPos) {
    this.isFixed = this.bannerOffsetHeight < pos.y;
  }
  swipeClick(index: number) {
    if (index === 0) {
      this.$router.push({ name: 'app' });
    }
  }
  mounted() {
    this.imgLoadHandle();
  }
}
</script>
<style lang='scss'>
.index-box {
  height: 100%;
  position: relative;
  .market-search-enter,
  .market-search-leave-active {
    transform: translate3d(0, 100%, 0);
    -webkit-transform: translate3d(0, 100%, 0);
  }
  .container {
    padding-right: var(--padding-lr);
  }
  .index-container {
    display: flex;
    flex-direction: column;
  }
  .banner-warp {
    flex: none;
    position: relative;
    height: 100px;
    overflow: hidden;
    background-color: #181a27;
  }
  .van-swipe {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 45px;
      background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(27, 25, 36, 0)), to(#1b1924));
      background-image: linear-gradient(180deg, rgba(27, 25, 36, 0) 0%, #1b1924 100%);
      pointer-events: none;
    }
  }
  .van-swipe__indicators {
    z-index: 1;
  }
  .van-swipe-item img {
    display: block;
    width: 100%;
  }
  .scroll-warp {
    position: relative;
    &.searching {
      -webkit-overflow-scrolling: auto;
    }
    &.fixed {
      .menu,
      .search {
        visibility: visible;
        opacity: 1;
      }
      .market-head {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 5;
      }
    }
  }
  .fixed-cover {
    position: fixed;
    left: 0;
    bottom: 0;
    top: 60px;
    z-index: 55;
    width: 100%;
    height: auto;
    background: var(--default-bg);
    // overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    transition: all 0.3s ease-out;
  }
  .van-swipe__indicator {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #90959f;
    transition: 0.3s ease-out;
    &.van-swipe__indicator--active {
      width: 10px;
      border-radius: 5px;
      background: #d8dbe1;
    }
  }
  .base {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
