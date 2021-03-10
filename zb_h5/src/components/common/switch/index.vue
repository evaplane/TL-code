<template>
  <div :class="{ on: activeValue === value, disable: disable }" @click="switchClickHandle" class="switch">
    <span />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Model, Emit, Prop } from 'vue-property-decorator';

@Component
export default class MSwitch extends Vue {
  @Prop({ type: [String, Number, Boolean], default: true }) activeValue!: string | number | boolean;
  @Prop({ type: [String, Number, Boolean], default: false }) inactiveValue!: string | number | boolean;
  @Prop({ type: Boolean, default: false }) disable!: boolean;
  @Model('input') value!: any;
  getValue() {
    return this.activeValue !== this.value ? this.activeValue : this.inactiveValue;
  }
  @Emit()
  change() {
    return this.getValue();
  }
  @Emit()
  input() {
    return this.getValue();
  }
  @Emit()
  click() {}
  switchClickHandle() {
    this.click();
    this.input();
    this.change();
  }
}
</script>

<style lang='scss'>
.switch {
  display: flex;
  width: 46px; /* no */
  height: 26px; /* no */
  border-radius: 30px; /* no */
  position: relative;
  background-color: #dcdcdc;
  transition: all 0.3s;
  @include dark {
    background-color: #3d3a46;
  }
  span {
    position: absolute;
    top: 2px; /* no */
    left: 2px; /* no */
    width: 22px; /* no */
    height: 22px; /* no */
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(142, 165, 180, 0.41); /* no */
    transition: all 0.3s;
  }
  &.on {
    background-color: var(--primary-color);
    span {
      left: 22px; /* no */
    }
  }
  &.disable {
    cursor: none;
    pointer-events: none;
    background-color: #c7c4c48a;
    span {
      background-color: #acafb74f;
    }
    @include dark {
      background-color: #3d3a46;
    }
  }
}
</style>
