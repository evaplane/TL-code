<template>
  <div class="check-input-box">
    <van-cell-group>
      <van-field
        :error="inputValue === '' && isSubmit"
        :maxlength="6"
        center
        clearable
        type="number"
        label="__('谷歌验证')"
        placeholder="__('请输入谷歌验证码')"
        required
        v-model="inputValue"
        :error-message="error"
      >
      </van-field>
    </van-cell-group>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component
export default class CheckInput extends Vue {
  @Prop({ type: String, default: '' }) value!: string;
  @Prop({ type: Boolean, default: false }) isSubmit!: boolean;
  error: string = '';
  get inputValue() {
    return this.value;
  }
  set inputValue(val: string) {
    this.input(val);
  }
  @Emit()
  input(val: string) {
    return val;
  }
}
</script>
<style lang='scss'>
.check-input-box {
  transition: all 1s;
  * {
    touch-action: pan-y;
  }
  .canClick {
    background: gray !important;
    border-color: gray !important;
  }
}
</style>
