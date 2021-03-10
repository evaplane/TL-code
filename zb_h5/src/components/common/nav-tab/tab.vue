<template>
  <span :class="className" @click="clickHandle" class="tab-item">{{ title }}</span>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import Tabs from './tabs.vue';
@Component
export default class Tab extends Vue {
  @Prop({ type: String, default: '', required: true }) title!: string;
  @Prop({ type: [String, Number], default: '', required: true }) value!: string | number;
  name = 'tab';
  get className() {
    return this.rootTabs.value === this.value ? 'tab-item--active' : '';
  }
  @Inject() rootTabs!: Tabs;
  clickHandle() {
    this.rootTabs.modelValue = this.value;
  }
}
</script>

<style lang='scss'>
.header-tabs {
  .tab-item {
    padding: 8px 15px;
    font-size: 16px;
    white-space: nowrap;
    border-right: 1px solid var(--primary-color); /* no */
    transition: 0.1s;
    font-weight: bold;
    &.tab-item--active {
      background-color: var(--primary-color);
      color: #fff;
    }
    &:last-child {
      border-right: none;
    }
  }
}
</style>
