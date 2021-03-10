<template>
  <div class="entrance-content">
    <div class="entrance-title">
      <h1>注册账号</h1>
      <p>已有账号？<span>立即登录</span></p>
    </div>
    <div class="entrance-tabs">
      <span :class="{ 'tab-item--active': registerType === 'phone' }" @click="changeHandle('phone')" class="tab-item"
        >手机注册</span
      >
      <span :class="{ 'tab-item--active': registerType === 'email' }" @click="changeHandle('email')" class="tab-item"
        >邮箱注册</span
      >
    </div>
    <div class="entrance-list">
      <div :class="{ 'entrance-item--phone': registerType === 'phone' }" class="entrance-item">
        <span @click="countryClickHandle" class="country" v-if="registerType === 'phone'">
          {{ defaultCountryCode }}
          <icon-arrow />
        </span>
        <div class="input-wrap">
          <input
            :type="registerType === 'phone' ? 'number' : 'email'"
            @change="userInputChangeHandle"
            autocomplete="off"
            class="input"
            placeholder="_"
            v-model.trim="params.userName"
          />
          <label class="placeholder">{{ registerType === 'phone' ? '手机号码' : '电子邮箱' }}</label>
        </div>
      </div>
      <div class="entrance-item">
        <div class="input-wrap">
          <input
            autocomplete="new-password"
            class="input"
            placeholder="设置密码"
            type="password"
            v-model.trim="params.loginPwd"
          />
          <input style="display: none" type="password" />
          <label class="placeholder">设置密码</label>
        </div>
      </div>
      <div class="entrance-item">
        <div class="input-wrap">
          <input autocomplete="off" class="input" placeholder="推荐码(选填)" type="number" v-model.trim="params.recommendCode" />
          <label class="placeholder">推荐码(选填)</label>
        </div>
      </div>
      <div class="entrance-captcha" v-if="captchaVisible">
        <zb-captcha @callback="callbackHandle" ref="captcha" scene="nc_login" />
      </div>
      <div class="entrance-item">
        <div class="input-wrap">
          <input autocomplete="off" class="input" placeholder="_" type="number" v-model.trim="params.msgCode" />
          <label class="placeholder">{{ registerTypeText + '验证码' }}</label>
        </div>
        <send-code
          :before-send="beforeSendHandle"
          :captcha-params="noCaptchaParams"
          :send-params="sendParams"
          :success="successHandle"
          ref="sendCode"
          @error="sendCodeErrorHandle"
          text="获取验证码"
        />
      </div>
      <div class="entrance-agree">
        <div class="m-checkbox">
          <input type="checkbox" v-model="isRead" />
          <label></label>我已阅读并同意
        </div>
        <a href="https://www.zb.cn/i/document?item=4" target="_blank">《ZB用户服务协议》</a>
      </div>
      <div class="entrance-button">
        <button @click="submitHandle" class="btn" type="button">{{ loading === false ? '注册' : '注册中...' }}</button>
      </div>
    </div>
    <van-popup get-container="body" position="bottom" v-model="showPicker">
      <van-picker
        :columns="mixinsCountryCodeList"
        :default-index="mixinsDefaultIndex"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script lang='ts'>
import { Component, Emit, Prop, Watch, Mixins } from 'vue-property-decorator';
import { doRegister, IDoRegisterParams, doCheckUserName } from '@/api/user';
import zbCaptcha, { ICaptchaCallback } from '@/components/common/captcha/index.vue';
import sendCode, { ISendCodeErrorInfo } from '@/components/common/send-code/index.vue';
import { isEmail, isPhone } from '@/utils/regexp-config';
import message from '@/components/common/message/index';
import mixinsCountryCode from '@/mixins/login/country-code';

type TRegisterType = 'phone' | 'register';

@Component({
  components: {
    zbCaptcha,
    sendCode
  }
})
export default class LoginPopup extends Mixins(mixinsCountryCode) {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  modelVisible: boolean = false;
  loading: boolean = false;
  googleCode: string = '';
  dynamicCode: string = '';
  loginStatus: number = 0;
  step: number = 0;
  registerType: TRegisterType = 'phone';
  captchaVisible: boolean = false;
  '$el': HTMLDivElement;
  showPicker: boolean = false;
  params: IDoRegisterParams = {
    userName: '',
    loginPwd: '',
    platform: 'h5',
    wsclientid: '',
    zbgUid: '',
    loginType: '',
    afsSessionId: '',
    afsSig: '',
    afsToken: '',
    afsScene: '',
    afsAppKey: '',
    recommendCode: '',
    msgCode: '',
    userType: 1,
    countryCode: '+86',
    agentCode: ''
  };
  columns: string[] = [];
  defaultIndex: number = -1;
  sendParams = { codeType: 1001, countryCode: '+86', mobile: '', email: '' };
  isRead: boolean = false;
  rePassword: string = '';
  defaultCountryCode: string = '+86';
  '$refs': {
    captcha: zbCaptcha;
    sendCode: sendCode;
  };
  // eslint-disable-next-line
  noCaptchaParams = {} as ICaptchaCallback;
  @Watch('visible', { immediate: true })
  _() {
    this.modelVisible = this.visible;
  }
  get registerTypeText() {
    return this.registerType === 'phone' ? '__("手机")' : '__("邮箱")';
  }
  get translateX() {
    return `translateX(${this.step * -100}%)`;
  }
  get passwordLevel() {
    return this.checkPassword(this.params.loginPwd);
  }
  onConfirm(data: string, index: number) {
    let curCountry = this.mixinsCountries[index];
    this.defaultCountryCode = curCountry.code;
    this.params.countryCode = this.sendParams.countryCode = this.defaultCountryCode;
    this.showPicker = false;
  }
  changeHandle(type: string) {
    this.registerType = type as TRegisterType;
    this.params.userName = '';
    this.params.msgCode = '';
    this.params.loginPwd = '';
    this.isRead = false;
    this.captchaVisible = false;
    this.params.userType = type === 'email' ? 2 : 1;
    this.$refs.sendCode && this.$refs.sendCode.reset();
  }
  callbackHandle(data: ICaptchaCallback) {
    this.noCaptchaParams = data;
  }
  async checkUserName(): Promise<boolean> {
    let userName = this.params.userName;
    let userType = 1;
    if (this.registerType === 'phone') {
      if (isPhone(userName) === false) {
        message.warn({ message: '__("请输入正确手机号码")' });
        return false;
      }
      userType = 1;
    } else {
      if (isEmail(userName) === false) {
        message.warn({ message: '__("请输入正确邮箱")' });
        return false;
      }
      userType = 2;
    }
    if (!userName) {
      message.warn({ message: '__("请输入")' + (this.registerType === 'phone' ? '__("手机号码")' : '__("邮箱")') });
      return false;
    }
    try {
      await doCheckUserName({
        userType,
        userName,
        countryCode: this.defaultCountryCode
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  @Emit('update:visible')
  close() {
    return (this.modelVisible = false);
  }
  beforeSendHandle() {
    if (!this.params.userName) {
      message.warn({ message: '__("请输入")' + (this.registerType === 'phone' ? '__("手机号码")' : '__("邮箱")') });
      return false;
    }
    if (this.passwordLevel < 2 && this.params.loginPwd.length < 8) {
      message.warn('__("密码8-20位字符,且为字母、数字、符号等任意两种以上组合。")');
      return false;
    }
    return true;
  }
  @Emit()
  slideToLogin() {}
  toLogin() {
    this.slideToLogin();
  }
  sendCodeErrorHandle(error: ISendCodeErrorInfo) {
    this.captchaVisible = error.status === 0;
  }
  successHandle() {
    let str = '__("短信验证码已发送到您的手机，10分钟内有效")';
    if (isEmail(this.params.userName) === true) {
      str = '__("邮箱验证码已发送到您的邮箱$1，请登录邮箱查看，10分钟内有效")'.replace('$1', this.params.userName);
    }
    message.success(str);
  }
  closeHandle() {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
  checkPassword(pwd: string): number {
    var level = 0;
    if (pwd.length >= 6 && pwd.length <= 20) {
      // 正则表达式验证符合要求的
      if (/\d/.test(pwd)) level++; // 数字
      if (/[a-z]/.test(pwd)) level++; // 小写
      if (/[A-Z]/.test(pwd)) level++; // 大写
      if (/\W/.test(pwd)) level++; // 特殊字符
      if (level > 1 && pwd.length > 12) level++; // 超过12位并且两种组合以上
    }
    return level;
  }
  userInputChangeHandle() {
    if (this.registerType === 'phone') {
      this.sendParams.email = '';
      this.sendParams.mobile = this.params.userName;
    } else {
      this.sendParams.email = this.params.userName;
      this.sendParams.mobile = '';
    }
  }
  countryClickHandle() {
    this.showPicker = true;
  }
  async submitHandle() {
    if (this.loading === true) return;
    let isOk = await this.checkUserName();
    if (isOk === false) return;
    if (this.passwordLevel < 2 && this.params.loginPwd.length < 8) {
      return message.warn('__("密码8-20位字符,且为字母、数字、符号等任意两种以上组合。")');
    }
    if (!this.params.msgCode) {
      return message.warn('__("请输入$1验证")'.replace('$1', this.registerTypeText));
    }
    if (this.isRead === false) {
      return message.warn({ message: '__("请同意《ZB用户服务协议》")' });
    }
    try {
      this.loading = true;
      let registerParams = Object.assign({}, this.params, this.noCaptchaParams);
      registerParams.countryCode = encodeURIComponent(registerParams.countryCode);
      let res = await doRegister(registerParams);
      this.loading = false;
      if (res.resMsg && res.resMsg.code === 1000) {
        // 正常登陆
        message.success(res.resMsg.message);
        this.toLogin();
      } else {
        message.fail(res.resMsg.message);
      }
    } catch (err) {
      message.fail(err.resMsg.message);
    }
  }
  focusInput() {
    let inpList = this.$el.querySelectorAll('.entrance-input .input');
    if (inpList) {
      [].slice.call(inpList as any).map((inp: HTMLInputElement) => {
        inp.onfocus = () => {
          let parentNode = inp.parentNode;
          if (parentNode) {
            parentNode = parentNode.parentNode;
          }
          if (parentNode) {
            (parentNode as HTMLDivElement).classList.add('entrance-input--focus');
          }
          inp.onblur = () => {
            (parentNode as HTMLDivElement).classList.remove('entrance-input--focus');
            inp.onblur = null;
          };
        };
      });
    }
  }
  mounted() {
    window.setTimeout(() => {
      this.$nextTick(this.focusInput);
    }, 20);
    this.getCountries();
  }
  beforeDestroy() {
    (document.body as any)._registerInstance = null;
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/login/style.scss';
</style>
