<template>
  <div class="set-login-box">
    <back/>
    <van-radio-group v-model="radio">
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
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';

@Component({
  components: {
    back
  }
})
export default class SetLogin extends Vue {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser
  radio: string = '1'
  submit() {
    this.radio = this.userInfo.tradeAuth + '';
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
