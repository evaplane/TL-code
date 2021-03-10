<template>
  <div class="password-box">
    <back :close="true" v-on="$listeners"/>
    <template v-if="type === ''">
      <check-input :isSubmit="isSubmit" code-type="1099" v-model="params.dynamicCode"/>
      <check-google
        :isSubmit="isSubmit"
        v-if="userInfo.googleAuth !== 0"
        v-model="params.googleCode"
      />
    </template>
    <template v-if="type === 'trade'">
      <van-field
        :error="safePwd === '' && isSubmit"
        :maxlength="6"
        center
        clearable
        label="__('资金密码')"
        placeholder="__('请输入资金密码')"
        required
        type="password"
        v-model="safePwd"
      ></van-field>
    </template>
    <van-button @click="submit" class="submit" size="large" type="primary">__('提交')</van-button>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import checkInput from '@/components/index/check-input.vue';
import checkGoogle from '@/components/index/check-google.vue';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { Catch } from '@/utils/decorators';
interface IAssetsParams {
  dynamicCode: string;
  googleCode: string;
}

@Component({
  components: {
    back,
    checkInput,
    checkGoogle
  }
})
export default class Check extends Vue {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser
  @Prop({ default: '', type: String }) type!: string
  params: IAssetsParams = {
    dynamicCode: '',
    googleCode: ''
  }
  isSubmit: boolean = false
  safePwd: string = ''
  @Catch()
  submit() {
    this.isSubmit = true;
    if (this.type === '') {
      if (!this.params.dynamicCode) return false;
      if (+this.userInfo.googleAuth === 1) {
        if (!this.params.googleCode) return false;
      }
    } else {
      if (!this.safePwd) return false;
    }
    this.handle();
  }

  @Emit()
  handle() {
    if (this.userInfo.googleAuth !== 1) {
      delete this.params.googleCode;
    }
    return this.params;
  }
}
</script>
<style lang='scss'>
.password-box {
  position: fixed;
  z-index: 3001;
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
