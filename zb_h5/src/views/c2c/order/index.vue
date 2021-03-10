<template>
  <div class="c2c-trade-box">
    <router-view class="order-content" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component({
  components: {
  }
})
export default class OrderIndex extends Vue {
}
</script>

<style lang='scss'>
.c2c-trade-box {
  color: var(--theme-color);
  height: 100%;
  overflow: hidden;
  position: relative;
  @include light {
    background: #f7f8fd;
  }
  @include dark {
    background: #2c2933;
  }
  .order-content {
    flex: 1;
  }
}
</style>
