<template>
  <i class="zb-icon icon-help" @click="click"></i>
</template>

<script lang='ts'>
import { Component, Vue, Emit } from 'vue-property-decorator';
@Component
export default class Help extends Vue {
  @Emit()
  click() {}
}
</script>

<style lang="scss">
.icon-help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; /* no */
  height: 18px; /* no */
  background-color: currentColor;
  border-radius: 50%;
  &::after {
    content: '?';
    color: #fff;
    font-size: 12px;
  }
}
</style>
