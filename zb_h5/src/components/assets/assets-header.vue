<template>
  <div class="assets-header">
    <!-- 顶部左侧按钮 -->
    <slot name="left">
      <div @click="leftClick" class="return-btn">
        <icon-return />
      </div>
      <h1 v-if="leftText && isRenderAssets === false">{{ leftText }}</h1>
    </slot>
    <slot></slot>
    <div class="header-right">
      <slot name="right">
        <div @click="searchClick" class="btn">
          <icon-search />
        </div>
      </slot>
    </div>
    <transition name="header-search">
      <div class="assets-popup" ref="assetsPopup" v-show="isSearch">
        <div class="header-search">
          <div class="search-input">
            <icon-search />
            <input placeholder="搜索币种" type="text" v-model="coinName" />
            <span class="placeholder">搜索币种</span>
          </div>
          <div @click="searchClose" class="search-close">取消</div>
        </div>
        <div class="coin-list-popup">
          <native-scroll>
            <account-lever
              :search-coin-name="coinName"
              :item-click-fun="itemClickFun"
              :show-body="showBody"
              @item-click="itemClickHandle"
              search-mode v-if="accountType === 'lever'"
            />
            <assets-search
              :prop-account-type="propAccountType"
              :search-coin-name="coinName"
              :item-click-fun="itemClickFun"
              :show-body="showBody"
              @item-click="itemClickHandle"
              search-mode v-else
            />
          </native-scroll>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang='ts' src="./assets-header.ts">
</script>

<style lang="scss">
.assets-popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  &.header-search-enter,
  &.header-search-leave-active {
    .header-search {
      transform: translateY(-100%);
    }
    .coin-list-popup {
      transform: translateY(100%);
    }
  }
  .header-search {
    transition: all 0.3s;
    flex: none;
    z-index: 6;
    height: 60px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    background-color: #f6f6f9;
    @include dark {
      background-color: #000;
    }
    .search-input {
      position: relative;
      flex: 1;
      border-radius: 2px; /* no */
      background-color: #fff;
      @include dark {
        background-color: #24232f;
      }
      .icon-search {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: #a7a6b3;
        @include dark {
          color: #6e6d7d;
        }
        width: 20px;
        pointer-events: none;
      }
      .placeholder {
        font-size: 14px;
        color: #a7a6b3;
        @include dark {
          color: #6e6d7d;
        }
        position: absolute;
        left: 34px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
      }
      input {
        display: block;
        width: 100%;
        height: 40px;
        border-radius: 0;
        border: 0;
        background-color: transparent;
        color: var(--heavy-color);
        font-size: 14px;
        padding-left: 34px;
        font-weight: 500;
        -webkit-appearance: none;

        &:placeholder-shown::placeholder {
          color: transparent;
        }

        &:not(:placeholder-shown) ~ .placeholder {
          display: none;
        }
      }
    }

    .search-close {
      flex: none;
      display: flex;
      align-items: center;
      padding: 0 15px;
      color: var(--default-color);
      font-size: 14px;
    }
  }
  .coin-list-popup {
    flex: 1;
    overflow: hidden;
    transition: all 0.3s;
    background-color: var(--default-bg);
  }
}
</style>
