<template>
  <div class="login" @keydown.enter="submitForm('loginForm')">
    <div class="center-box">
      <!-- <h2 class='login-h2'>广告运营系统</h2> -->
      <div class='logoBox'>
        <img src="@/assets/images/now-logo.png" alt="" id='logo'>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="80px">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-hpbuser" v-model="loginForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-hpbpassword" type="password" v-model="loginForm.password" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="captcha" class="lookuser">
          <el-input type="text" prefix-icon="el-icon-hpbyanzhengma" v-model="loginForm.captcha" placeholder="验证码" style="width:50%"></el-input>
          <img class="captcha-img" id='captcha' :src="randomCaptcha" alt="" @click="getCaptcha()">
        </el-form-item>
        <el-form-item class="lookuser">
          <el-checkbox v-model="checked">记住用户名</el-checkbox>
        </el-form-item>
        <el-form-item style="margin-bottom:10px;">
          <el-button class='primarybtn' type="primary" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
        <el-form-item>
          <p class="tips"><span><i class="el-icon-star-on"></i> 推荐使用谷歌浏览器,享受更优质的体验</span></p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
       var validatorUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,25}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-25位数字、字母或者中文'));
          }
          callback();
        }
      };
      var validatorPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,12}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入6-12位数字、字母或者符号'));
          }
          callback();
        }
      };
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: ''
      },
      checked:false,
      randomCaptcha: '',
      loginRules: {
        username: [
          {trigger: "change",validator:validatorUsername }
        ],
        password: [
          {trigger: "change",validator:validatorPassword}
        ],
        captcha: [
          { required: true, message: "请输入验证码", trigger: "change" }
        ]
      }
    };
  },
  created(){
    let uname = localStorage.getItem("u");
    if(uname){
      this.checked = true;
      this.loginForm.username = uname;
    };
  },
  mounted() {
    this.getCaptcha()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            captcha: this.loginForm.captcha
          }
          this.$post("auth-web/sys/login", data).then((res) => {
            if (res.code == "000000") {
              if(this.checked){
                window.localStorage.setItem("u",this.loginForm.username);
              }else{
                window.localStorage.removeItem('u');
              }
              window.localStorage.removeItem('store')
              this.$router.push('/modules/pageHome.html')
            }else{
              this.getCaptcha()
              this.$message.warning(res.message);
            }
          })
        } else {
           this.$message.error('用户名或者密码输入格式不正确');
          return false;
        }
      });
    },
    getCaptcha() {
      var timestamp = (new Date()).valueOf();
      this.$get("auth-web/sys/captcha?timestamp=" + timestamp).then(response => {
        return 'data:image/jpeg;base64,' + btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      }).then(data=>{
        this.randomCaptcha = data
      })
    },
  },
}

</script>
<style lang="scss">
html,
body {
  height: 100%;
 
  .login {
    height: 100%;
    // background-image: url('../../assets/images/1.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #2c3640;
    }
    .center-box {
      width: 300px;
      height: 300px;
      border-radius: 10px;
      padding: 20px 20px;
      margin-top: -200px;
      .el-form-item__content {
        margin-left: 0 !important;
      }
      .captcha-img {
        width: 130px;
        height: 35px;
        float: right;
        margin-top: 3px;
      }
    }
    .el-input--prefix .el-input__inner{
      // border-radius: 17.5px;
    }
    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus{
      // border: 0;
    }
    .el-input__inner{
      // background-color: rgb(232, 240, 254) !important;
    }
    .el-checkbox{
      margin-left:10px;
      // margin-left:15px;
    }
    .lookuser{
      margin-bottom:0;
    }
    .primarybtn{
       width: 100%;
      //  border-radius:17.5px;
    }
    .tips{
      color: #dda450;
      font-size: 12px;
      margin-bottom: 10px;
      line-height: 0px;
      text-align: right;
    }
  }
  .logoBox{
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
  #logo{
    width: 67px;
  }
  .login .el-checkbox{
    // color:#fff;
  }
}
</style>
