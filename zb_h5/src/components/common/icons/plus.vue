<template>
  <i class="zb-icon icon-plus"></i>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Plus extends Vue { }
</script>

<style lang="scss">
.icon-plus {
  position: relative;
  display: inline-block;
  width: 24px; /* no */
  height: 24px; /* no */
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 2px; /* no */
    box-shadow: inset 0 0 0 32px; /* no */
  }
  &::before {
    height: 2px; /* no */
    width: 14px; /* no */
  }
  &::after {
    height: 14px; /* no */
    width: 2px; /* no */
  }
}
</style>
