<template>
  <span class="get-code" :class="{ waiting: time !== 120 }" @click="clickHandle">{{ countDownText }}</span>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { doSendCode, ISendCodeParams } from '@/api/index';
import { ICaptchaCallback } from '@/components/common/captcha/index.vue';
import message from '@/components/common/message/index';
import { isPromise } from '@/utils/is';

interface ISendCodeInfo {
  codeType: number;
  countryCode: string;
  imgCode: string;
  safePwd: string;
  mobile: string;
  email: string;
  cardId: string;
}
export interface ISendCodeErrorInfo {
  status: number;
  code: number;
  message: string;
}
let timeFlag = 0,
  timer = 0;
const countDown = 120;
@Component
export default class SendCode extends Vue {
  // 发送验证码需要的人机验证参数
  @Prop({ type: Object, required: true, default: () => ({}) }) captchaParams!: ICaptchaCallback;
  // 发送验证码需要的参数
  @Prop({ type: Object, required: true, default: () => ({}) }) sendParams!: ISendCodeParams;
  // 默认显示文案
  @Prop({ type: String, default: '__("发送验证码")' }) text!: string;
  // 发送成功回调
  @Prop({ type: [Function], default: null }) success!: Function | null;
  // 点击发送前调用的方法, 可用做发送前检测. 改方法返回false时将会阻止短信发送
  @Prop({ type: [Function], default: null }) beforeSend!: Function | any;
  isClick: boolean = false;
  time: number = countDown;
  sendCodeErrorInfo: ISendCodeErrorInfo = {
    code: 0,
    status: 0,
    message: ''
  };
  sending: boolean = false;
  get countDownText(): string {
    if (this.sending === true) {
      return '__("正在发送")';
    }
    return this.time !== 120 ? '' + this.time + 's' : this.text;
  }
  reset() {
    window.clearInterval(timer);
    this.isClick = false;
    timeFlag = 0;
    this.time = countDown;
    this.sending = false;
  }
  async clickHandle() {
    if (typeof this.beforeSend === 'function') {
      if (this.beforeSend() === false) return;
    } else if (isPromise(this.beforeSend) === true) {
      let result = await this.beforeSend();
      if (result === false) return;
    }
    if (this.isClick === true) return;
    this.isClick = true;
    this.sending = true;
    try {
      let params: ISendCodeParams = Object.assign({}, this.captchaParams, this.sendParams);
      params.countryCode = encodeURIComponent(params.countryCode);
      let res = await doSendCode(params);
      this.sending = false;
      if (!res.resMsg) return;
      let { code } = res.resMsg;
      let msg = res.resMsg.message;
      if (code === 1000) {
        this.countDown();
        this.time--;
        if (this.success) {
          return this.success();
        }
        message.success(msg);
        return;
      }
      this.isClick = false;
      this.error({
        status: res.datas ? res.datas.status : -1,
        code: code,
        message: msg
      });
      message.fail(msg);
    } catch (err) {
      this.sending = false;
      message.fail(err.message);
      this.isClick = false;
    }
  }
  @Emit()
  error(sendCodeErrorInfo: ISendCodeErrorInfo) {
    return (this.sendCodeErrorInfo = sendCodeErrorInfo);
  }
  countDown() {
    let timeSpan = 0;
    if (!timeFlag) {
      timeFlag = Date.now();
    } else {
      timeSpan = (Date.now() - timeFlag) / 1000;
      if (timeSpan < countDown) {
        this.$message.warn({ message: countDown + '秒内只能操作一次,稍后重试' });
        return false;
      }
    }
    window.clearInterval(timer);
    timer = window.setInterval((): void => {
      timeSpan = (Date.now() - timeFlag) / 1000;
      if (timeSpan > countDown) {
        timeFlag = 0;
        window.clearInterval(timer);
        this.time = countDown;
        this.isClick = false;
      } else {
        this.time = parseInt(countDown - timeSpan + '');
      }
    }, 1000);
  }
}
</script>

<style lang='scss'>
.get-code {
  flex: none;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 15px;
  color: var(--primary-color);
  &.waiting {
    color: #bac1d0;
  }
}
</style>
