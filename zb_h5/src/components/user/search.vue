<template>
  <div class="search-wrap">
    <div class="van-search__content van-search__content--square">
      <div class="van-cell van-cell--borderless van-field">
        <div class="van-field__left-icon">
          <i class="van-icon van-icon-search"></i>
        </div>
        <div class="van-cell__value van-cell__value--alone">
          <div class="van-field__body">
            <input class="van-field__control" placeholder="__('请输入搜索关键词')" type="search" v-model="returnValue" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
@Component
export default class Search extends Vue {
  @Prop({ default: '', type: String }) value!: string;
  get returnValue() {
    return this.value;
  }
  set returnValue(val: string) {
    this.input(val);
  }
  @Emit()
  input(val: string) {
    return val;
  }
}
</script>
<style lang='scss'>
.search-wrap {
  .van-field__control {
    color: var(--theme-color);
  }
}
</style>
