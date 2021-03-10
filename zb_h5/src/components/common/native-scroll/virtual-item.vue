<template>
  <div class="virtual-item">
    <slot />
  </div>
</template>

<script lang='ts' src="./virtual-item.ts">
</script>

<style lang='scss'>
.virtual-item {
  position: absolute;
  width: 100%;
}
</style>
