<template>
  <div :class="'s-' + align" class="m-pagination-box">
    <ul>
      <li @click="prevClick" class="prev-btn" :class="{ 's-disable': prevDisable }">{{ prevText }}</li>
      <li class="cur-pager">{{ pageIndex }}</li>
      <li @click="nextClick" class="next-btn" :class="{ 's-disable': nextDisable }">{{ nextText }}</li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
@Component
export default class Pagination extends Vue {
  pageIndex = 1;
  @Prop({ type: String, default: '__("上一页")' }) prevText!: string;
  @Prop({ type: String, default: '__("下一页")' }) nextText!: string;
  @Prop({ type: Number, default: 1 }) currentPage!: number;
  @Prop({ type: Number, default: 0 }) totalPage!: number;
  @Prop({ type: Boolean, default: false }) disable!: boolean;
  @Prop({ type: String, default: 'center', validator: (v: string): boolean => ['center', 'left', 'right'].indexOf(v) > -1 })
  align!: string;
  @Watch('currentPage', { immediate: true })
  currentPageWatch(val: number) {
    this.pageIndex = val;
  }
  get prevDisable(): boolean {
    if (Number(this.pageIndex) === 1) {
      return true;
    }
    return false;
  }
  get nextDisable(): boolean {
    if (this.totalPage > 0) {
      if (this.pageIndex >= this.totalPage) {
        return true;
      }
    }
    if (this.disable === true && this.pageIndex > 1) {
      return true;
    }
    return false;
  }
  prevClick(): void {
    if (this.prevDisable === true) return;
    let index = this.pageIndex - 1;
    this.pageIndex = index < 1 ? 1 : index;
    this.$emit('update:currentPage', this.pageIndex);
    this.$emit('prev-click', this.pageIndex);
    this.$emit('current-change', this.pageIndex);
  }
  nextClick(): void {
    if (this.nextDisable === true) return;
    this.pageIndex++;
    this.$emit('update:currentPage', this.pageIndex);
    this.$emit('next-click', this.pageIndex);
    this.$emit('current-change', this.pageIndex);
  }
}
</script>

<style lang="scss">
.m-pagination-box {
  color: inherit;
  margin: 10px 0;
  &.s-center {
    text-align: center;
  }
  &.s-left {
    text-align: left;
  }
  &.s-right {
    text-align: right;
  }
  ul {
    display: inline-flex;
  }
  .cur-pager {
    padding: 3px 10px;
  }
  .prev-btn,
  .next-btn {
    user-select: none;
    padding: 3px 5px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s;
    &.s-disable {
      cursor: no-drop;
      &:hover {
        color: inherit;
      }
    }
    &:hover {
      color: $color;
    }
  }
}
</style>
