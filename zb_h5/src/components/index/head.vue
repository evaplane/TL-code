<template>
  <div class="header">
    <slot name="left">
      <div class="header-btn menu-btn" v-setting>
        <icon-menu />
      </div>
    </slot>
    <slot />
    <slot name="right">
      <div @click="rightClick" class="header-btn more-btn">
        <icon-more />
      </div>
    </slot>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Emit } from 'vue-property-decorator';
@Component
export default class Head extends Vue {
  '$el': HTMLDivElement;
  @Emit()
  rightClick() {}
}
</script>
<style lang='scss'>
.header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  height: 60px;
  position: relative;
  color: #e2e1ea;
  background-color: #181a27;
  .logo {
    display: flex;
    align-items: center;
    img {
      width: 28px;
      height: 28px;
    }
    span {
      font-size: 18px;
      color: #fff;
      opacity: 0.9;
      margin-left: 5px;
      @include bold;
    }
  }
  .header-title {
    font-size: 20px;
    font-weight: bold;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    &::after {
      content: '';
      width: 0;
      height: 0;
      border-right: 3px solid transparent; /* no */
      border-left: 3px solid transparent; /* no */
      border-top: 3px solid; /* no */
      margin-left: 5px;
    }
    span {
      margin-right: 5px;
    }
    em {
      width: 3px;
      height: 20px;
      background-color: #fff;
      margin: 0 6px;
      transform: rotate(25deg) scale(0.8);
    }
  }
  .header-right {
    display: flex;
    .header-btn:not(:first-child) {
      margin-left: 15px;
    }
  }
}
</style>
