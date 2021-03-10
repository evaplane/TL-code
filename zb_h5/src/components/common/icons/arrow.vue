<template>
  <i :class="direction" class="zb-icon icon-arrow"></i>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class Arrow extends Vue {
  @Prop({ type: String, validator: (val: string) => ['up', 'down', 'left', 'right'].indexOf(val) > -1, default: 'down' })
  direction!: string;
}
</script>

<style lang='scss'>
.icon-arrow {
  display: inline-block;
  width: 0;
  height: 0;
  color: currentColor;
  vertical-align: middle;
  &.up {
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 3px solid;
  }
  &.right {
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-left: 3px solid;
  }
  &.down {
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 3px solid;
  }
  &.left {
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-right: 3px solid;
  }
}
</style>
