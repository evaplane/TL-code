<template>
  <div class="trade-box">
    <search :visible.sync="searchVisible" v-model="searchCoin" />
    <div class="trade-content">
      <m-header>
        <div @click="$router.push({ name: 'index' })" class="header-btn nav-return" slot="left" v-if="$route.query.f">
          <icon-return />
        </div>
        <div class="header-btn menu-btn" slot="left" v-else v-setting>
          <icon-menu />
        </div>
        <div class="header-title" @click="searchVisible = true">
          <span>{{ curArea }}</span
          >{{ mixinsCShowNameUp }}<em></em>{{ mixinsFShowNameUp }}
        </div>
        <div class="header-right" slot="right">
          <div @click="searchVisible = true" class="header-btn search-btn">
            <icon-search />
          </div>
          <m-menu @change="menuChangeHandle" overlay popup-class="right-menu" slot="right">
            <div class="header-btn more-btn" slot="reference">
              <icon-more />
            </div>
            <m-menu-item :label="'__(`充值`)' + mixinsCShowNameUp" value="payinC" icon-class="zbicon-icon-btc-code" />
            <m-menu-item :label="'__(`充值`)' + mixinsFShowNameUp" value="payinF" icon-class="zbicon-icon-usdt-code" />
            <m-menu-item :label="'__(`内部转入`)' + mixinsCShowNameUp" :value="1" icon-class="zbicon-icon-shift" />
            <m-menu-item :label="'__(`内部转入`)' + mixinsFShowNameUp" :value="1" icon-class="zbicon-icon-shift" />
            <m-menu-item value="payinMoney" icon-class="zbicon-icon-recharge" label="__('充值')CNY" />
            <m-menu-item
              :icon-class="isCollected === true ? 'zbicon-collection collection' : 'zbicon-icon-collect'"
              @click="collectMarketHandle"
              :label="isCollected === true ? `__('取消自选')` : `__('添加自选')`"
            />
          </m-menu>
        </div>
      </m-header>
      <tab @change="tabChangeHandle" border dark v-model="tabType">
        <tab-item :class="key" :key="key" :name="key" v-for="(text, key) in tabList">{{ text }}</tab-item>
      </tab>
      <router-view ref="childView" />
    </div>
    <native-scroll :class="[fixedClass, { active: searchVisible === false }]" class="fixed-cover trade-market-popup">
      <market-content :search-coin="searchCoin" is-fixed />
    </native-scroll>
    <tab-bar />
  </div>
</template>

<script lang='ts' src="./index.ts">
</script>
<style lang='scss'>
.trade-box {
  background: var(--default-bg);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  .fixed-cover {
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    height: auto;
    z-index: 100;
    width: 100%;
    background: var(--default-bg);
    transition: all 0.3s;
    &.fixed-active .filter-head {
      position: fixed;
      top: 60px;
    }
    &.active {
      transform: translateY(100%);
    }
    .market-head {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
    }
    .market-body {
      position: relative;
      top: 125px;
      left: 0;
    }
  }
  .market-search1-enter,
  .market-search1-leave-active {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translateY(100%);
  }
  .trade-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .header-tabs {
      @include dark {
        border-bottom: 4px solid #0f0d14; /* no */
      }
    }
  }
  .trade-market-popup {
    .header {
      background: var(--default-bg);
    }
    .market-box {
      min-height: calc(100vh - 181px);
      .nodata-box {
        width: 100%;
        position: absolute;
      }
    }
  }
  .trade-view-chart {
    overflow: hidden;
    flex: 1;
  }
  .van-nav-bar__right {
    display: flex;
    align-items: center;
    .bar-icon {
      font-size: 24px;
    }
  }

  .van-nav-bar__title {
    margin: 0;
    margin-left: 50px;
  }
  .van-nav-bar__left {
    bottom: -1px;
  }

  .bar-icon {
    font-size: 20px;
  }
  .zbicon-down {
    vertical-align: middle;
    font-size: 12px;
    margin-left: 4px;
  }
  .card-title {
    padding: 15px;
    color: #27364a;
    font-weight: bold;
    font-size: 16px;
    border: 1px solid var(--border-color); /* no */
    @include dark {
      color: var(--theme-color);
    }
  }
  .van-tab--active {
    color: var(--primary-color);
  }
}
.market-area-block {
  background: #292839;
  padding: 8px 14px;
  border-radius: 2px;
  font-size: 13px;
  color: #e6e6e6;
  margin-left: 12px;
}
.menu-popup.right-menu {
  .collection {
    color: var(--primary-color);
    font-size: 15px;
  }
}
.market-popup {
  width: 65%;
  height: 100%;
  position: fixed;
  overflow: hidden;
  .market-warp {
    height: 100%;
    overflow: hidden;
  }
  .zbicon-down {
    vertical-align: middle;
    font-size: 12px;
    margin-left: 4px;
  }
  .market-warp-top {
    background: #1a1923;
    height: 70px;
    display: flex;
    align-items: center;
  }
  .van-field__control {
    height: 25px;
  }
  .market-warp-bottom {
    height: calc(100% - 70px);
    background: var(--default-bg);
  }
  .origin-price {
    font-size: 16px;
    text-align: right;
  }
}
</style>
