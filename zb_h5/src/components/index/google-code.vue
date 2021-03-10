<template>
  <div class="password-box">
    <back :close="true" title="__('google认证')" v-on="$listeners"/>
    <scroll>
      <van-cell-group>
        <van-field label="__('密钥')" required v-model="params.googleSecret">
          <van-button
            :data-clipboard-text="params.googleSecret"
            @click="paste"
            class="copy"
            data-clipboard-action="copy"
            size="small"
            slot="button"
            type="primary"
          >__('复制')</van-button>
        </van-field>
      </van-cell-group>
      <check-input :isSubmit="isSubmit" code-type="1099" v-model="params.dynamicCode"/>
      <check-google :isSubmit="isSubmit" v-if="googleType !== 'edit'" v-model="params.googleCode"/>
      <template v-if="googleType === 'edit'">
        <van-cell-group>
          <van-field label="__('旧谷歌验证')" clearable  required v-model="params.oldgCode"/>
        </van-cell-group>
        <van-cell-group>
          <van-field label="__('新谷歌验证')" clearable required v-model="params.googleCode"/>
        </van-cell-group>
      </template>
      <ol class="detail">
        <li>
          __('安装在')"
          <span class="buy-color">Google Authenticator</span>"__('应用程序中,点击右上角')"__('+号')"__(',然后选择')"__('手动输入验证码')"
        </li>
        <li>
          __('粘贴上面的')"__('密钥')"
          <span class="buy-color">{{params.googleSecret}}</span>__('到')"__('密钥')"__('输入栏,并填写您的')
          <span class="buy-color">__('ZB账号')</span>,__('点击完成.')
        </li>
        <li>
          __('复制')"
          <span class="buy-color">__('谷歌验证码')</span>",__('粘贴到上面的')"
          <span class="buy-color">__('谷歌验证码')</span>"__('输入栏')
        </li>
        <li>
          <b>__('请勿删除此双重验证密码账户,否则会导致您无法进行账户操作;如果误删,您可通过重置密钥重新获取').</b>
        </li>
      </ol>
      <van-button @click="submit" class="submit" size="large" type="primary">__('提交')</van-button>
    </scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import checkInput from '@/components/index/check-input.vue';
import checkGoogle from '@/components/index/check-google.vue';
import { State } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { Catch } from '@/utils/decorators';
import { IDoSetGoogleAuthParams, getGoogleSecret, doSetGoogleAuth } from '@/api/user';
import Clipboard from 'clipboard';

@Component({
  components: {
    back,
    checkInput,
    checkGoogle
  }
})
export default class Check extends Vue {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser
  @Prop({ type: String, default: '' }) googleType!: string
  params: IDoSetGoogleAuthParams = {
    type: this.googleType === 'add' ? 1 : 2,
    dynamicCode: '',
    googleCode: '',
    googleSecret: '',
    oldgCode: ''
  }
  isSubmit: boolean = false
  mounted() {
    this.getGoogleSecret();
  }
  @Catch()
  submit() {
    this.isSubmit = true;
    if (!this.params.dynamicCode) return false;
    if (this.googleType === 'edit') {
      if (!this.params.oldgCode) return false;
    }
    if (!this.params.dynamicCode) return false;
    if (!this.params.googleCode) return false;
    this.paramsFormat();
  }
  paramsFormat() {
    if (this.googleType === 'add') {
      delete this.params.oldgCode;
      this.doSetGoogleAuth();
    }
    if (this.googleType === 'edit') {
      this.doSetGoogleAuth();
    }
  }
  async doSetGoogleAuth() {
    try {
      await doSetGoogleAuth(this.params);
      this.handle();
    } catch (err) {
      console.log(err);
    }
  }
  @Emit()
  handle() {
    return '';
  }
  async getGoogleSecret() {
    let { secret } = await getGoogleSecret();
    this.params.googleSecret = secret;
  }
  paste() {
    let clipboard = new Clipboard('.copy');
    clipboard.on('success', () => {
      this.$message.success('__("复制成功")');
    });
    clipboard.on('error', () => {
      this.$message.success('__("复制失败,请手动复制")');
    });
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
  .detail {
    list-style: decimal;
    padding: 10px 20px;
    border: 1px solid var(--border-color); /* no */
    margin: 10px;
    li {
      line-height: 30px;
    }
    li:last-child {
      list-style: none;
    }
  }
}
</style>
