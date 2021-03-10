<template>
  <div class="set-login-box">
    <back/>
    <van-radio-group v-if="$route.params.type === 'login'" v-model="radio">
      <van-cell-group>
        <van-cell @click="radio = '1'" clickable title="__('密码')">
          <van-radio name="1" slot="right-icon"/>
        </van-cell>
        <van-cell @click="radio = '2'" clickable title="__('密码+Google验证码')">
          <van-radio name="2" slot="right-icon"/>
        </van-cell>
        <van-cell @click="radio = '3'" clickable title="__('密码+异地登录验证')">
          <van-radio name="3" slot="right-icon"/>
        </van-cell>
        <van-cell @click="radio = '4'" clickable title="__('密码+Google验证码+异地登录验证')">
          <van-radio name="4" slot="right-icon"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-radio-group v-if="$route.params.type === 'pay'" v-model="radio">
      <van-cell-group>
        <van-cell @click="radio = '1'" clickable title="__('资金密码+动态验证码')">
          <van-radio name="1" slot="right-icon"/>
        </van-cell>
        <van-cell @click="radio = '2'" clickable title="__('资金密码+Google验证码')">
          <van-radio name="2" slot="right-icon"/>
        </van-cell>
        <van-cell @click="radio = '3'" clickable title="__('资金密码+动态验证码+Google验证码')">
          <van-radio name="3" slot="right-icon"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
     <van-radio-group v-model="radio" v-if="$route.params.type === 'trade'">
      <van-cell-group>
        <van-cell @click="radio = '1'" clickable title="__('永不输入资金密码')">
          <van-radio name="1" slot="right-icon"/>
        </van-cell>
        <van-cell @click="radio = '2'" clickable title="__('6小时内免输资金密码')">
          <van-radio name="2" slot="right-icon"/>
        </van-cell>
        <van-cell @click="radio = '3'" clickable title="__('每次交易均验证资金密码')">
          <van-radio name="3" slot="right-icon"/>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-button @click="submit" class="submit" size="large" type="primary">提交</van-button>
    <component :is="asyncComponent" @close="close" @handle="handel" type="trade"></component>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { doSetSafeStrategy } from '@/api/user';

interface IParams {
  dynamicCode: string;
  googleCode?: string;
}

@Component({
  components: {
    back
  }
})
export default class VerifySet extends Vue {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser
  radio: string = '1'
  asyncComponent: any = null
  typeList: any = {
    'login': {
      type: 1,
      name: 'loginAuth'
    },
    'trade': {
      type: 2,
      name: 'tradeAuth'
    },
    'pay': {
      type: 3,
      name: 'payoutAuth'
    }
  }
  mounted() {
    let type = this.typeList[this.$route.params.type].name;
    this.radio = this.userInfo[type as keyof IUser] + '';
  }
  async submit() {
    if (this.radio === this.userInfo.loginAuth + '') return this.$message.warn('__("您已选择此选项")');
    if (!+this.radio) return this.$message.warn('__("请至少选择一项")');
    const WebpackCom = await import(/* webpackChunkName: 'check-component' */ '@/components/index/check.vue');
    this.asyncComponent = WebpackCom.default;
  }
  close() {
    this.asyncComponent = null;
  }
  async handel(params: IParams) {
    try {
      let type = this.typeList[this.$route.params.type].type;
      await doSetSafeStrategy({
        ...params,
        type,
        key: this.radio
      });
      this.asyncComponent = null;
      this.$router.go(-1);
    } catch (err) {
      console.log(err);
    }
  }
}
</script>
<style lang='scss'>
.set-login-box {
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
}
</style>
