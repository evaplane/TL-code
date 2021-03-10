<template>
  <div class="m-select-box">
    <slot />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Provide, Emit, Prop } from 'vue-property-decorator';
@Component
export default class Select extends Vue {
  @Prop({ required: false }) value!: any;
  @Prop({ type: Boolean, default: false }) onToOff!: boolean;
  get inputValue() {
    return this.value;
  }
  set inputValue(val: any) {
    this.input(val);
  }
  @Provide()
  rootSelect = this.getThis();
  getThis() {
    return this;
  }
  @Emit()
  input(val: any) {
    return val;
  }
  @Emit()
  click(val: any) {
    if (this.onToOff === true && this.value === val) {
      this.input('');
      return;
    }
    this.input(val);
  }
  // updateWidth() {
  //   let maxWidth = 0;
  //   this.$children.map((item) => {
  //     if ((item as any).name === 'option') {
  //       let el = item.$el as HTMLDivElement;
  //       if (el.offsetWidth > this.maxWidth) {
  //         maxWidth = el.offsetWidth;
  //       }
  //     }
  //     return item;
  //   }).map(item => {
  //     if (this.maxWidth <= maxWidth) {
  //       this.maxWidth = maxWidth;
  //       (item as any).width = this.maxWidth ? this.maxWidth + 'px' : 'auto';
  //     }
  //   });
  // }
}
</script>

<style lang='scss'>
.m-select-box {
  .m-option {
    margin-right: 10px;
    &:last-child {
      margin-right: 0px;
    }
  }
}
</style>
