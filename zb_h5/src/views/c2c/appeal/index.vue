<template>
  <div class="appeal-box">
    <router-view class="merchant-content" />
  </div>
</template>

<script lang='ts'>
import { Vue } from 'vue-property-decorator';

export default class AppealIndex extends Vue { }
</script>

<style lang='scss'>
.appeal-box {
  position: relative;
  height: 100%;
  overflow: hidden;
  .merchant-content {
    background: var(--default-bg);
    box-sizing: border-box;
    flex: 1;
  }
  .gray-bg {
    @include light {
      background-color: #f7f8fe;
    }
    @include dark {
      background-color: #1b1924;
    }
  }
}
</style>
