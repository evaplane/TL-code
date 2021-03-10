<template>
  <div class="lever-detail-header">
    <icon-return @click="leftClick" />
    <span class="detail-title">{{ title }}</span>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
@Component
export default class BorrowDetailHeader extends Vue {
  @Prop({ type: String }) title!: string;
  @Emit()
  leftClick() {}
}
</script>

<style lang='scss'>
.lever-detail-header {
  color: var(--theme-color);
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0px 15px;
  .detail-title {
    font-size: 16px;
    font-weight: 600;
    padding-left: 10px;
  }
}
</style>
