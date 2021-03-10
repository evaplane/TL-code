<template>
  <div class="user-login">
    <div class="login-head">
      <img class="zb-logo-light" src="@img/zb-logo-light.svg" />
      <img class="zb-logo-dark" src="@img/zb-logo-dark.svg" />
      <p>开启时数字世界之旅</p>
    </div>
    <div class="login-form">
      <form>
        <div class="form-list">
          <input autocomplete="off" class="form-control" placeholder="请输入账户" type="text" v-model="params.userName" />
        </div>
        <div class="form-list">
          <input autocomplete="off" class="form-control" placeholder="请输入您的密码" type="password" v-model="params.passWord" />
        </div>
        <div class="form-sumbit">
          <button @click="submit" class="form-button">登录</button>
        </div>
      </form>
    </div>
    <div class="other-links">
      <a>忘记密码?</a>
      <span>|</span>
      <router-link :to="{ name: 'register' }">注册账号</router-link>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { encryptPwdObj } from '@/js/encode-pwd';
import { doUserLogin, IDoLoginParams } from '@/api/user';

@Component({
  components: {}
})
export default class UserLogin extends Vue {
  isSubmit = false;
  params: IDoLoginParams = {
    countryCode: '+86',
    userName: '',
    passWord: '',
    pubTag: '',
    platform: '',
    wsclientid: '',
    zbgUid: '',
    loginType: '',
    afsSessionId: '',
    afsSig: '',
    afsToken: '',
    afsScene: '',
    afsAppKey: ''
  };
  paramsError: any = {
    userName: '',
    passWord: ''
  };
  async mounted() {}
  async submit() {
    try {
      this.isSubmit = true;
      if (this.params.userName.trim() === '') {
        return this.$message.warn({ message: '用户名不能为空', duration: 3000 });
      } else if (this.params.passWord.trim() === '') {
        return this.$message.warn({ message: '密码不能为空', duration: 3000 });
      }
      let encryptInfo = await encryptPwdObj(this.params.passWord);
      let loginParams = this.params;
      loginParams.passWord = encryptInfo.encryptPwd;
      loginParams.pubTag = encryptInfo.publicKey;
      let res = await doUserLogin(loginParams);
      if (+res.datas.loginStatus === 1) {
        this.$router.push({ name: 'assets-index' });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
</script>

<style lang="scss">
.user-login {
  padding-top: 50px;
  .login-head {
    text-align: center;
    img {
      width: 150px;
      display: block;
      margin: 0 auto;
      @include light {
        &.zb-logo-dark {
          display: none;
        }
      }
      @include dark {
        &.zb-logo-light {
          display: none;
        }
      }
    }
    p {
      display: block;
      color: var(--theme-color);
      font-size: 14px;
      margin-top: 10px;
    }
  }
  .login-form {
    padding-top: 30px;
    .form-control {
      display: block;
      border: none;
      border-bottom: 1px solid; /* no */
      background: none;
      width: 100%;
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      font-weight: bold;
      border-radius: 0;

      &::-webkit-input-placeholder {
        font-weight: normal;
      }
      @include light {
        color: #1c1c1c;
        border-bottom-color: #eaeaea;
        &::-webkit-input-placeholder {
          color: #ababab;
        }
      }
      @include dark {
        color: #e0e0e0;
        border-bottom-color: #302f39;
        &::-webkit-input-placeholder {
          color: #656271;
        }
      }
      &:focus {
        border-bottom-color: var(--primary-color);
      }
    }
    .form-button {
      border: 0;
      display: block;
      width: 100%;
      background-color: var(--primary-color);
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      height: 46px;
      border-radius: 4px;
    }
    .form-list {
      position: relative;
      margin-bottom: 20px;
    }
  }
  .other-links {
    text-align: center;
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    font-size: 14px;
    color: var(--theme-color);
    a {
      color: var(--theme-color);
      text-decoration: none;
    }
    span {
      padding: 0 50px;
    }
  }
}
</style>
