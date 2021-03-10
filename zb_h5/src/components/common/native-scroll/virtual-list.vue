<template>
  <div :style="{ height: height + 'px' }" class="virtual-scroll-list">
    <virtual-item
      :item="item"
      :key="item.id"
      :id="item.id"
      :style="{ transform: `translateY(${item.offset}px)` }"
      v-for="(item, index) in visibleList"
    >
      <slot :index="index" :row="item" />
    </virtual-item>
  </div>
</template>
<script lang="ts" src="./virtual-list.ts">
</script>
<style lang="scss">
.virtual-scroll-list {
  position: relative;
  margin: 0;
  padding: 0;
}
</style>
