<template>
  <div class="password-box">
    <back title="__('设置资金密码')"/>
    <scroll>
      <van-cell-group>
        <van-field
          :error="params.safePwd === '' && isSubmit"
          :error-message="paramsError.safePwd"
          label="__('资金密码')"
          placeholder="__('请输入新的密码')"
          required
          clearable
          clickable
          requiredclearable
          type="password"
          v-model="params.safePwd"
        />
        <van-field
          :error="safePwdAgain === '' && isSubmit"
          :error-message="paramsError.safePwdAgain"
          clearable
          label="__('确认密码')"
          placeholder="__('请输入确认密码')"
          required
          type="password"
          v-model="safePwdAgain"
        />
      </van-cell-group>
      <van-button @click="submit" class="submit" size="large" type="primary">__('提交')</van-button>
    </scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { doSetSafePwd, IDoSetSafePwd } from '@/api/user';
@Component({
  components: {
    back
  }
})
export default class Password extends Vue {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser
  params: IDoSetSafePwd = {
    safePwd: ''
  }
  paramsError: IObj<string> = {
    safePwd: '',
    safePwdAgain: ''
  }
  safePwdAgain: string = ''
  isSubmit: boolean = false
  async submit() {
    try {
      this.isSubmit = true;
      this.paramsError.safePwd = /^\d{6}$/.test(this.params.safePwd) ? '' : '__("请输入六位数字）")';
      if (this.paramsError.safePwd) return false;
      this.paramsError.safePwdAgain = this.safePwdAgain !== this.params.safePwd ? '__("俩次密码输入不一致")' : '';
      if (this.paramsError.safePwdAgain) return false;
      await doSetSafePwd(this.params);
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
}
</style>
