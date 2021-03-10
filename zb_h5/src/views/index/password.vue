<template>
  <div class="password-box">
    <back :title="title" />
    <scroll>
      <span class="safe-tip" v-if="$route.params.type === 'safe'">__('资金安全密码修改后24小时内不可用于提现操作。')</span>
      <van-cell-group>
        <van-field
          :error="params.oldPassword === '' && isSubmit"
          :error-message="paramsError.oldPassword"
          clearable
          label="__('当前密码')"
          placeholder="__('请输入当前密码')"
          required
          type="password"
          v-model="params.oldPassword"
        />
        <van-field
          :error="params.newPassword === '' && isSubmit"
          :error-message="paramsError.newPassword"
          label="__('新密码')"
          placeholder="__('请输入新的密码')"
          required
          requiredclearable
          type="password"
          v-model="params.newPassword"
        />
        <van-field
          :error="newPasswordAgain === '' && isSubmit"
          :error-message="paramsError.newPasswordAgain"
          clearable
          label="__('确认密码')"
          placeholder="__('请输入确认密码')"
          required
          type="password"
          v-model="newPasswordAgain"
        />
      </van-cell-group>
      <check-input :isSubmit="isSubmit" code-type="1099" v-model="params.dynamicCode" />
      <check-google :isSubmit="isSubmit" v-if="userInfo.googleAuth === 1" v-model="params.googleCode" />
      <van-button @click="submit" class="submit" size="large" type="primary">__('提交')</van-button>
    </scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import checkInput from '@/components/index/check-input.vue';
import checkGoogle from '@/components/index/check-google.vue';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { IDoSetUserPwd, doSetUserPwd } from '@/api/user';
import { checkPwd } from '@/utils/regexp-config';
@Component({
  components: {
    back,
    checkInput,
    checkGoogle
  }
})
export default class Password extends Vue {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  params: IDoSetUserPwd = {
    type: 1,
    dynamicCode: '',
    googleCode: '',
    oldPassword: '',
    newPassword: ''
  };
  paramsError: any = {
    newPassword: '',
    newPasswordAgain: ''
  };
  isSubmit: boolean = false;
  newPasswordAgain: string = '';
  get title() {
    return this.$route.params.type === 'safe' ? '__("修改资金密码")' : '__("修改登录密码")';
  }
  async submit() {
    try {
      this.isSubmit = true;
      if (!this.params.oldPassword) return false;
      if (this.$route.params.type === 'login') {
        this.paramsError.newPassword = checkPwd(this.params.newPassword)
          ? ''
          : '__("密码至少包含 大写字母， 数字， 特殊字符中的两个, 8~20位）")';
        if (this.paramsError.newPassword) return false;
      }
      if (this.$route.params.type === 'safe') {
        this.paramsError.newPassword = /^\d{6}$/.test(this.params.newPassword) ? '' : '__("请输入六位数字）")';
        if (this.paramsError.newPassword) return false;
      }
      this.paramsError.newPasswordAgain = this.newPasswordAgain !== this.params.newPassword ? '__("俩次密码输入不一致")' : '';
      if (this.paramsError.newPasswordAgain) return false;
      if (!this.params.dynamicCode) return false;
      if (+this.userInfo.googleAuth === 1) {
        if (!this.params.googleCode) return false;
      }
      this.params.type = this.$route.params.type === 'login' ? 1 : 2;
      await doSetUserPwd(this.params);
      Object.keys(this.params).map(item => {
        let key = item as keyof IDoSetUserPwd;
        if (key === 'type') return;
        this.params[key] = '';
      });
      this.$message.success('__("成功")');
      this.$router.go(-1);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
<style lang='scss'>
.password-box {
  position: fixed;
  z-index: 3000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: var(--default-bg);
  color: var(--theme-color);
  height: 100%;
  display: flex;
  flex-direction: column;
  .van-field__label {
    width: 100px;
  }
  .safe-tip {
    margin: 0 var(--padding-lr);
    line-height: 40px;
  }
}
</style>
