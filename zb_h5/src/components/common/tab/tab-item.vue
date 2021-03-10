<template>
  <span :class="{ 'tab-item--active': name === rootTab.value }" @click="clickHandle" class="tab-item">
    <slot />
  </span>
</template>

<script lang='ts'>
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import Tab from './tab.vue';
@Component
export default class TabsItem extends Vue {
  @Prop({ type: [String, Number] }) name!: string | number;
  @Prop({ type: Boolean, default: false }) disabled!: boolean;
  @Inject({ from: 'rootTab' }) rootTab!: Tab;
  clickHandle() {
    if (this.disabled === true) {
      return this.rootTab.disabled(this.name);
    }
    this.rootTab.clickHandle(this.name);
  }
  mounted() {
    if (!this.rootTab || this.rootTab.children.indexOf(this) !== -1) {
      return;
    }
    this.rootTab.children.push(this);
  }
  beforeDestroy() {
    if (this.rootTab) {
      this.rootTab.children = this.rootTab.children.filter((item: any) => item !== this);
    }
  }
}
</script>
