import { Component, Mixins, Prop, Emit } from 'vue-property-decorator';
import { TFormType } from './setting-panel';
import { IUser } from '@/store/modules/user';
import mixinsCountryCode from '@/mixins/login/country-code';
import sendCode from '@/components/common/send-code/index.vue';
import { isPhone } from '@/utils/regexp-config';
import upload from '@/components/user/kyc-uploader.vue';
import { isEmpty } from '@/utils/is';
import { doAuthMobile, getVerifyUserInfo, IVerifyInfo, doModifyMobile } from '@/api/user';
import store from '@/store/store';
import { encryptPwd } from '@/js/encode-pwd';

@Component({
  components: {
    upload,
    sendCode
  }
})
export default class SetPhoneEmail extends Mixins(mixinsCountryCode) {
  @Prop({ type: Array }) type!: TFormType[];
  showPicker: boolean = false;
  noCaptchaParams: any = {};
  oldMobileCode: string = '';
  newMobile: string = '';
  newMobileCode: string = '';
  safePwd: string = '';
  googleCode: string = '';
  emailCode: string = '';
  filePath: string = '';
  verifyInfo: IVerifyInfo = {
    status: -1,
    addTimeShow: '',
    memo: ''
  };

  get userInfo(): IUser {
    return store.getters['user/userInfo'];
  }
  get title() {
    return this.hasMobileAuth === true ? '修改手机' : '绑定手机';
  }
  get showVerifyInfo() {
    return this.verifyInfo && this.verifyInfo.status > -1;
  }
  get hasGoogle() {
    return this.userInfo.googleAuth === 1;
  }
  get hasSafePwd() {
    return this.userInfo.safePwd === 1;
  }
  /** 是否是修改手机 */
  get hasMobileAuth() {
    return this.userInfo.mobileAuth === 1;
  }
  get hasEmailAuth() {
    return this.userInfo.emailAuth === 1;
  }
  get sendParams() {
    return { codeType: this.hasMobileAuth ? 1011 : 1007, mobile: this.newMobile, countryCode: encodeURIComponent(this.mixinsDefaultCountryCode) };
  }
  @Emit('update:type')
  updateType(type: TFormType[]) {
    return type;
  }
  async getVerifyInfo() {
    try {
      this.verifyInfo = await getVerifyUserInfo(1);
    } catch (err) {
      console.log(err);
    }
  }
  async submit() {
    if (this.hasMobileAuth === true) {
      if (isEmpty(this.oldMobileCode) === true) {
        this.$message.warn('请输入旧手机验证码');
        return;
      }
    }
    if (this.validateMobile(this.newMobile) === false) {
      return;
    }
    if (this.hasSafePwd === true && isEmpty(this.safePwd) === true) {
      this.$message.warn('请输入资金密码');
      return;
    }
    if (this.hasGoogle === true && isEmpty(this.googleCode) === true) {
      this.$message.warn('请输入Google Code');
      return;
    }
    if (this.hasMobileAuth && !this.filePath) {
      this.$message.warn('请上传证件照');
      return;
    }
    try {
      let safePwd = await encryptPwd(this.safePwd);
      // 修改
      if (this.hasMobileAuth === true) {
        await doModifyMobile({
          countryCode: encodeURIComponent(this.mixinsDefaultCountryCode),
          newMobileNumber: this.newMobile,
          newMobileCode: this.newMobileCode,
          oldMobileCode: this.oldMobileCode,
          emailCode: this.emailCode,
          googleCode: this.googleCode,
          realImg: this.filePath,
          safePwd
        });
        store.dispatch('user/getUserInfo');
        window.setTimeout(this.getVerifyInfo, 700);
      } else { // 认证
        await doAuthMobile({
          countryCode: encodeURIComponent(this.mixinsDefaultCountryCode),
          mobile: this.newMobile,
          mobileCode: this.newMobileCode,
          emailCode: this.emailCode,
          googleCode: this.googleCode,
          safePwd
        });
        this.updateType(['info']);
      }
      this.$message.success('提交成功');
    } catch (err) {
      console.log(err);
    }
  }
  onConfirm() { }
  validateMobile(str: string) {
    if (!str) {
      this.$message.fail('请输入手机号码');
      return false;
    }
    if (isPhone(str) === false) {
      this.$message.fail('请输入正确手机号码');
      return false;
    }
    return true;
  }
  beforeSend() {
    return this.validateMobile(this.newMobile);
  }
  created() {
    this.getVerifyInfo();
  }
}
