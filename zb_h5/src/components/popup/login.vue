<template>
  <div class="entrance-content" :class="{ 'next-default': authVisible === false, 'next-auth': authVisible }">
    <transition name="form">
      <div class="entrance-list" key="1" v-if="authVisible === false">
        <div class="entrance-logo">
          <img src="@img/index/logo.svg" />
          <p>欢迎登录中币</p>
        </div>
        <div class="entrance-item">
          <span @click="showPicker = true" class="country" v-if="isPhone">
            {{ mixinsDefaultCountryCode }}
            <icon-arrow />
          </span>
          <div class="input-wrap">
            <input autocomplete="off" class="input" placeholder="手机/邮箱/用户名" type="text" v-model.trim="params.userName" />
            <label class="placeholder">手机/邮箱/用户名</label>
          </div>
        </div>
        <div class="entrance-item">
          <div class="input-wrap">
            <input autocomplete="new-password" class="input" placeholder="密码" :type="pwdType" v-model.trim="params.passWord" />
            <input style="display: none" type="password" />
            <label class="placeholder">密码</label>
          </div>
          <div class="display" @click="pwdVisible = !pwdVisible">
            <icon-pw-eye-close v-if="pwdVisible" />
            <icon-pw-eye-open v-else />
          </div>
        </div>
        <div class="entrance-captcha" v-if="captchaVisible">
          <zb-captcha @callback="callbackHandle" ref="captcha" scene="nc_login" />
        </div>
        <div class="entrance-button">
          <button @click="loginClickHandle" type="button">{{ loading ? '登录中...' : '登录' }}</button>
        </div>
        <div class="entrance-link"><span>忘记密码?</span><span>注册账号</span></div>
      </div>
      <div class="entrance-list" key="2" v-else>
        <div class="entrance-title">
          <h1>登录安全认证</h1>
          <p>本次登录需要{{ codeType }}验证码</p>
        </div>
        <template v-if="[2, 4].indexOf(loginStatus) > -1">
          <div class="entrance-item">
            <div class="input-wrap">
              <input autocomplete="off" class="input" placeholder="Google验证码" type="number" v-model.trim="googleCode" />
              <label class="placeholder">Google验证码</label>
            </div>
          </div>
        </template>
        <template v-if="loginStatus === 4">
          <div class="entrance-item">
            <div class="input-wrap">
              <input autocomplete="off" class="input" placeholder="邮件验证码" type="number" v-model.trim="dynamicCode" />
              <label class="placeholder">邮件验证码</label>
            </div>
            <send-code :captcha-params="noCaptchaParams" :send-params="{ codeType: 1099 }" text="__('获取验证码')" />
          </div>
        </template>
        <template v-if="loginStatus === 3">
          <div class="entrance-item">
            <div class="input-wrap">
              <input autocomplete="off" class="input" placeholder="短信验证码" type="number" v-model.trim="dynamicCode" />
              <label class="placeholder">短信验证码</label>
            </div>
            <send-code
              :captcha-params="noCaptchaParams"
              :send-params="{ codeType: 1099, countryCode: mixinsDefaultCountryCode }"
              text="__('获取验证码')"
            />
          </div>
        </template>
        <div class="entrance-button">
          <button :class="{ 'btn-disabled': codeBtnDisabled }" @click="authHandle" type="button">
            {{ loading ? '验证中...' : '验证' }}
          </button>
        </div>
      </div>
    </transition>
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
import { Component, Mixins, Emit, Prop, Watch } from 'vue-property-decorator';
import { doUserLogin, IDoLoginParams, doLoginAuth } from '@/api/user';
import { encryptPwdObj } from '@/js/encode-pwd';
import store from '@/store/store';
import zbCaptcha, { ICaptchaCallback } from '@/components/common/captcha/index.vue';
import sendCode from '@/components/common/send-code/index.vue';
import message from '@/components/common/message/index';
import { isEmail, isPhone } from '@/utils/regexp-config';
import mixinsCountryCode from '@/mixins/login/country-code';

@Component({
  components: {
    zbCaptcha,
    sendCode
  }
})
export default class LoginPopup extends Mixins(mixinsCountryCode) {
  isLogin: boolean = true;
  modelVisible: boolean = false;
  loading: boolean = false;
  googleCode: string = '';
  dynamicCode: string = '';
  showPicker: boolean = false;
  loginStatus: number = 3;
  captchaVisible: boolean = false;
  pwdVisible: boolean = true;
  authVisible: boolean = false;
  '$el': HTMLDivElement;
  params: IDoLoginParams = {
    userName: '',
    passWord: '',
    pubTag: '',
    platform: '',
    countryCode: '',
    wsclientid: '',
    zbgUid: '',
    loginType: '',
    afsSessionId: '',
    afsSig: '',
    afsToken: '',
    afsScene: '',
    afsAppKey: ''
  };
  // eslint-disable-next-line
  noCaptchaParams = {} as ICaptchaCallback;
  '$refs': {
    captcha: zbCaptcha;
  };
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: Boolean, default: false }) isNext!: boolean;
  @Watch('visible', { immediate: true })
  _() {
    this.modelVisible = this.visible;
  }
  @Watch('isNext')
  __() {
    if (this.isNext === false) {
      this.$nextTick(() => {
        this.authVisible = false;
      });
    }
  }
  get pwdType(): string {
    return this.pwdVisible === false ? 'text' : 'password';
  }
  get isPhone() {
    return isPhone(this.params.userName);
  }
  get codeType(): string {
    let type = '';
    if ([2, 4].indexOf(this.loginStatus) > -1) {
      type = 'Google' + (this.loginStatus === 4 ? '和' : '');
    }
    if ([3, 4].indexOf(this.loginStatus) > -1) {
      if (isEmail(this.params.userName)) {
        type += '邮箱';
      } else {
        type += '手机';
      }
    }
    return type;
  }
  get codeBtnDisabled() {
    if (this.loginStatus === 4) {
      return !this.googleCode || !this.dynamicCode;
    } else if (this.loginStatus === 2) {
      return !this.googleCode;
    } else if (this.loginStatus === 3) {
      return !this.dynamicCode;
    }
    return true;
  }
  callbackHandle(data: ICaptchaCallback) {
    this.noCaptchaParams = data;
  }
  @Emit()
  close() {}
  closeHandle() {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
  onConfirm(data: string, index: number) {
    let curCountry = this.mixinsCountries[index];
    this.mixinsDefaultCountryCode = curCountry.code;
    this.params.countryCode = this.mixinsDefaultCountryCode;
    this.showPicker = false;
  }
  async authHandle() {
    try {
      if (this.loading === true) return;
      if ([2, 4].indexOf(this.loginStatus) > -1 && !this.googleCode) {
        return message.warn('请输入Google验证码');
      }
      if ([3, 4].indexOf(this.loginStatus) > -1) {
        if (!this.dynamicCode) {
          return message.warn({ message: '请输入短信/邮件验证' });
        }
      }
      this.loading = true;
      await doLoginAuth({ googleCode: this.googleCode, dynamicCode: this.dynamicCode });
      await store.dispatch('user/getUserInfo');
      message.success('__("登录成功")');
      this.close();
      this.loading = false;
    } catch (err) {
      this.loading = false;
      message.fail(err.resMsg.message);
      // eslint-disable-next-line
      this.noCaptchaParams = {} as ICaptchaCallback;
    }
  }
  @Emit()
  slideToRegister() {}
  toRegister() {
    this.slideToRegister();
  }
  async loginClickHandle() {
    if (this.loading === true) return;
    try {
      if (!this.params.userName) {
        return message.warn({ message: '请输入手机/邮箱/用户名' });
      } else if (!this.params.passWord) {
        return message.warn({ message: '密码不能为空' });
      }
      this.loading = true;
      let encryptInfo = await encryptPwdObj(this.params.passWord);
      let loginParams = Object.assign({}, this.params, this.noCaptchaParams);
      loginParams.countryCode = encodeURIComponent(loginParams.countryCode);
      loginParams.passWord = encryptInfo.encryptPwd;
      loginParams.pubTag = encryptInfo.publicKey;
      let res = await doUserLogin(loginParams);
      let resMsg = res.resMsg;
      if (resMsg.code === 1000) {
        if (this.loginStatus !== 1) {
          // 正常登陆
          this.loginStatus = Number(res.datas.loginStatus);
          this.authVisible = true;
          this.updateIsNext(true);
          this.$nextTick(this.focusInput);
        } else {
          await store.dispatch('user/getUserInfo');
          this.close();
        }
      } else if (resMsg.code === 1001) {
        if (res.datas && res.datas.status === 0) {
          this.captchaVisible = true;
        }
        this.$refs.captcha && this.$refs.captcha.reset();
        message.fail(resMsg.message);
      } else if (resMsg.code === 1002) {
        message.success(resMsg.message);
      }
      this.loading = false;
      if (this.authVisible === true) {
        this.$refs.captcha && this.$refs.captcha.reset();
      }
    } catch (err) {
      this.loading = false;
      message.fail(err.message);
    }
  }
  @Emit('update:isNext')
  updateIsNext(isNext: boolean) {
    return isNext;
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
  }
  beforeDestroy() {
    (document.body as any)._loginInstance = null;
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/login/style.scss';
</style>
