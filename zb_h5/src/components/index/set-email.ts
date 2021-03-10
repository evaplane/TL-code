import { Component, Mixins, Prop, Emit } from 'vue-property-decorator';
import { TFormType } from './setting-panel';
import { IUser } from '@/store/modules/user';
import mixinsCountryCode from '@/mixins/login/country-code';
import sendCode from '@/components/common/send-code/index.vue';
import { isEmpty } from '@/utils/is';
import { IVerifyInfo, doAuthEmail } from '@/api/user';
import { encryptPwd } from '@/js/encode-pwd';
import store from '@/store/store';

@Component({
  components: {
    sendCode
  }
})
export default class SetPhoneEmail extends Mixins(mixinsCountryCode) {
  @Prop({ type: Array }) type!: TFormType[];
  mobileCode: string = '';
  safePwd: string = '';
  googleCode: string = '';
  email: string = '';
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
    return this.hasEmailAuth === false ? '绑定邮箱' : '修改手机';
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
  @Emit('update:type')
  updateType(type: TFormType[]) {
    return type;
  }
  async submit() {
    if (this.validateEmail() === false) {
      return;
    }
    if (isEmpty(this.emailCode) === true) {
      this.$message.warn('请输入邮箱验证码');
      return;
    }
    if (this.hasMobileAuth === true) {
      if (isEmpty(this.mobileCode) === true) {
        this.$message.warn('请输入手机验证码');
        return;
      }
    }
    if (this.hasSafePwd === true && isEmpty(this.safePwd) === true) {
      this.$message.warn('请输入资金密码');
      return;
    }
    if (this.hasGoogle === true && isEmpty(this.googleCode) === true) {
      this.$message.warn('请输入Google Code');
      return;
    }
    try {
      let safePwd = await encryptPwd(this.safePwd);
      await doAuthEmail({
        email: this.email,
        emailCode: this.emailCode,
        mobileCode: this.mobileCode,
        safePwd,
        googleCode: this.googleCode
      });
      store.dispatch('user/getUserInfo');
      this.updateType(['info']);
      this.$message.success('提交成功');
    } catch (err) {
      console.log(err);
    }
  }
  onConfirm() { }
  validateEmail() {
    if (!this.email) {
      this.$message.fail('请输入邮箱地址');
      return false;
    }
    return true;
  }
}
