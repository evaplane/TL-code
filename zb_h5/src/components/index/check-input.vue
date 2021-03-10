<template>
  <div class="check-input-box">
    <van-cell-group>
      <van-field
        :error="inputValue === '' && isSubmit"
        :maxlength="6"
        center
        clearable
        label="__('动态验证码')"
        placeholder="__('请输入动态验证码')"
        required
        type="number"
        v-model="inputValue"
      >
        <van-button :class="{ canClick: totalTime !== time }" @click="send" size="small" slot="button" type="primary">{{
          btnText
        }}</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { doSendCode } from '@/api/index';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user.ts';

@Component
export default class CheckInput extends Vue {
  @Prop({ type: String, default: '' }) type!: string;
  @Prop({ type: String, default: '' }) codeType!: string;
  @Prop({ type: String, default: '' }) value!: string;
  @Prop({ type: Boolean, default: false }) isSubmit!: boolean;
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  btnText: string = '__("发送")';
  time = 121;
  totalTime: number = this.time;
  async send() {
    try {
      if (this.totalTime !== this.time) return;
      let params = {
        codeType: this.codeType
      };
      let { resMsg } = await doSendCode(params as any);
      this.$message.success(resMsg.message);
      this.countDown();
    } catch (err) {
      console.log(err);
    }
  }
  get inputValue() {
    return this.value;
  }
  set inputValue(val: string) {
    this.input(val);
  }
  countDown() {
    this.totalTime--;
    this.btnText = this.totalTime + 's';
    let clock = window.setInterval(() => {
      this.totalTime--;
      this.btnText = this.totalTime + 's';
      if (this.totalTime < 0) {
        window.clearInterval(clock);
        this.btnText = '__("发送")';
        this.totalTime = this.time;
      }
    }, 1000);
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
