<template>
  <div class="order-app-bar-wrap">
    <div class="order-app-bar">
      <div @click="$router.back()" class="tab-left">
        <i class="zbicon-icon-parent" />
      </div>
      <div class="tab-center">{{ title }}</div>
    </div>
    <div class="blank-line"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class AppBar extends Vue {
  @Prop({ type: String, default: '' }) title!: string;
}
</script>

<style lang='scss'>
.order-app-bar-wrap {
  width: 100%;
  height: 63px;
  position: relative;
  .blank-line {
    height: 63px;
    width: 100%;
  }
  .order-app-bar {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;
    height: 63px;
    display: flex;
    padding-left: 18px;
    align-items: center;
    background: var(--default-bg);
  }
  .tab-center {
    font-size: 24px;
    color: #4f5f8e;
    font-weight: 600;
  }
  .zbicon-icon-parent {
    margin-right: 30px;
    font-size: 20px;
    width: 25px;
    height: 20px;
    color: #d1d1d1;
  }
}
</style>
