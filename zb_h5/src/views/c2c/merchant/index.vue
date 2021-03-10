<template>
  <div class="c2c_merchant-box">
    <router-view
      :class="$route.name === 'apply-authentication-business' ? 'gray-bg-merchant' : '' "
      class="merchant-content"
    />
  </div>
</template>

<script lang='ts'>
import { Vue } from 'vue-property-decorator';

export default class MerchantIndex extends Vue {
}
</script>

<style lang='scss'>
.c2c_merchant-box {
  position: relative;
  height: 100%;
  overflow: hidden;
  .merchant-content {
    background: var(--default-bg);
    box-sizing: border-box;
    flex: 1;
  }
  .gray-bg-merchant {
    background-color: #f7f8fe;
    @include dark {
      background-color: #1b1924;
    }
  }
}
</style>
