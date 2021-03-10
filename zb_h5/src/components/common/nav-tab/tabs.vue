<template>
  <div class="header-tabs">
    <slot />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit, Provide } from 'vue-property-decorator';
@Component
export default class Tabs extends Vue {
  name = 'tabs';
  @Prop({ type: [String, Number], default: '' }) value!: string | number;
  @Provide()
  rootTabs = this.getTabs();
  get modelValue() {
    return this.value;
  }
  set modelValue(val: any) {
    this.input(val);
  }
  @Emit()
  input(val: any) {
    this.change(val);
    return val;
  }
  @Emit()
  change(val: any) {
    return val;
  }
  getTabs() {
    return this;
  }
}
</script>

<style lang='scss'>
.header-tabs {
  color: var(--primary-color);
  border: 1px solid var(--primary-color); /* no */
  border-radius: 2px; /* no */
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
