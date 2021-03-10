<template>
  <div @click="sort" class="sort-item">
    <slot />
    <span class="arrow">
      <i :class="{ 'buy-color': rootSort.itype === 2 && rootSort.sortName === name }"></i>
      <i :class="{ 'buy-color': rootSort.itype === 1 && rootSort.sortName === name }"></i>
    </span>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import sort from './sort.vue';
@Component
export default class SortOption extends Vue {
  @Prop(String) name!: string;
  @Inject()
  rootSort!: sort;
  sort() {
    this.rootSort.sortByName(this.name);
  }
}
</script>
<style lang='scss'>
.sort-item {
  font-size: 12px;
  color: var(--default-color);
  flex: none;
  display: flex;
  align-items: center;
  .arrow {
    position: relative;
    transition: all 1s;
    width: 9px; /* no */
    height: 8px; /* no */
    i {
      color: currentColor;
      position: absolute;
      width: 0;
      height: 0;
      right: 0;
      border-left: 3px solid transparent; /* no */
      border-right: 3px solid transparent; /* no */
    }
    i:first-child {
      top: 0;
      border-bottom: 3px solid; /* no */
    }
    i:last-child {
      bottom: 0;
      border-top: 3px solid; /* no */
    }
  }
}
</style>
