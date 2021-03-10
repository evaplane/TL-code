<template>
  <div class="c2c-payment-index">
      <router-view class="mode-payment-content" />
  </div>
</template>

<script lang='ts'>
import { Vue } from 'vue-property-decorator';

export default class ModePaymentIndex extends Vue {}
</script>

<style lang='scss'>
.c2c-payment-index {
  background: var(--default-bg);
  height: 100%;
  overflow: hidden;
  .mode-payment-content {
    box-sizing: border-box;
    flex: 1;
  }
}
</style>
