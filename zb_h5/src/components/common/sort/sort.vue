<template>
  <div class="sort-wrap">
    <slot />
  </div>
</template>
<script lang='ts'>
export * from './sort';
export { default } from './sort';
</script>
<style lang='scss'>
.sort-wrap {
  display: flex;
}
.sort-show {
  opacity: 1;
}
.sort-hide {
  opacity: 0;
}
</style>
