<template>
  <transition name="loading-fade">
    <div @touchmove.prevent.self="noop" class="loading-box" v-if="visible">
      <!-- <div class="loading-content">
        <span class="spinner">
          <svg class="circular" viewBox="25 25 50 50">
            <circle cx="50" cy="50" fill="none" r="20" />
          </svg>
        </span>
        <slot>
          <span class="loading-text">Loading...</span>
        </slot>
      </div> -->
      <icon-loading />
    </div>
  </transition>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Loading extends Vue {
  visible: boolean = false;
  noop() {}
}
</script>

<style lang='scss'>
.loading-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #f00;
  &.loading-fade-enter,
  .loading-fade-leave-active {
    opacity: 0;
    transform: scale(0.98);
  }
  .loading-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-items: center;
  }
  .spinner {
    width: 30px;
    height: 30px;
    animation: rotate 2s linear infinite;
    display: inline-block;
  }
  .circular {
    animation: circular 1.5s ease-in-out infinite;
    stroke: currentColor;
    stroke-width: 3;
    stroke-linecap: round;
  }
  .loading-text {
    padding-top: 5px;
    display: block;
  }
  @keyframes circular {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -40;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -120;
    }
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
