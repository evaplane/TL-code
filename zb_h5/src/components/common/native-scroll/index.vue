<template>
  <div :class="{ 'flex-layout': flexLayout }" :style="pulldownStyle" class="m-scroll" ref="scroll">
    <div class="m-scroll-refresh-line" v-if="pulldown">
      <transition name="pulldown-refresh">
        <div class="refresh-tips" v-if="showRefreshTips && refreshLoading === false">敢放手我就刷新给你看</div>
        <div class="refresh-loading" v-if="refreshLoading" v-loading="refreshLoading" />
      </transition>
    </div>
    <slot name="before" />
    <virtual-scroll ref="vScroll" v-if="virtualScroll === true" :list="data" :size="size">
      <template #default="{ row }">
        <slot name="virtual" :data="row.data" />
      </template>
    </virtual-scroll>
    <slot />
    <slot name="after" />
    <div class="loading-wrap" v-if="enabledPullup && loading" v-loading="loading" />
  </div>
</template>

<script lang='ts' src="./index.ts"></script>

<style lang='scss'>
.m-scroll {
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  &.flex-layout {
    display: flex;
    flex-direction: column;
  }
  .zb-loading {
    width: 35px;
    height: 35px;
  }
  .loading-wrap {
    margin: 5px 0;
    height: 40px;
  }
}
.m-scroll-refresh-line {
  height: 40px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  .pulldown-refresh-enter,
  .pulldown-refresh-leave-active {
    opacity: 0;
    transform: scale(0.7);
  }
  .zb-loading {
    width: 35px;
    height: 35px;
  }
  .refresh-tips {
    color: var(--theme-color);
    font-size: 13px;
    line-height: 30px;
  }
  .refresh-tips,
  .refresh-loading {
    height: 100%;
    width: 100%;
    text-align: center;
    transition: all 0.3s ease-out;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    margin: 5px 0;
  }
}
</style>
