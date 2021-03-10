<template>
  <div class="isntall">
    <div class="contain">
      <div class="container">
        <div class="header">
          <img src="../assets/5a80b63d127c8a834f397efaf398ef60.jpg" alt="">
        </div>
        <p style="font-size:16px;text-align:center;color:#000;font-weight:blod;margin-top:15px;" v-if="!islogin">注册小视频，分享精彩时刻</p>
        <div class="body">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="80px">
            <el-form-item prop="username">
              <el-input prefix-icon="el-icon-hpbuser" v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input prefix-icon="el-icon-hpbpassword" type="password" v-model="loginForm.password" placeholder="密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="password2" v-if='!islogin'>
              <el-input prefix-icon="el-icon-hpbpassword" type="password" v-model="loginForm.password2" placeholder="确认密码" show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="islogin" style="width: 100%;" :class="loginForm.username&&loginForm.password?'':'el-button--noprimary'" type="primary" @click="submitForm('loginForm')">登录</el-button>
              <el-button v-else style="width: 100%;" :class="loginForm.username&&loginForm.password?'':'el-button--noprimary'" type="primary" @click="submitForm('loginForm')">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div  v-if='islogin'>
          <!-- <p class="register"><span>没有账号？</span><span @click="$router.push('/install?name=register')">注册</span></p> -->
          <p class="register"><span>没有账号？</span><span @click="closeShareDialog(true)">注册</span></p>
          <!-- <div class="inline">
            <el-col :span='8'></el-col>
            <el-col :span='8'>或</el-col>
            <el-col :span='8'></el-col>
          </div>
          <p class="visitor" @click="visitorRegister">一键登陆</p> -->
        </div>
        <div v-else>
          <p class="login"><span>有账号了？</span><span @click="$router.push('/install?name=login')">请登录</span></p>
        </div>
      </div>
      <p class="tips"><span><i class="el-icon-star-on"></i> 推荐使用谷歌浏览器,享受更优质的体验</span></p>
      <div class="store" >
        <p class="msg">下载应用</p>
        <div class="showlink">
          <el-col :span='12'><div class="btnshow" @click="closeShareDialog(true)">IOS</div></el-col>
          <el-col :span='12'><div class="btnshow" @click="closeShareDialog(true)">Android</div></el-col>
        </div>
        
      </div>
      
    </div>
    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape='false'
      :before-close="handleDialogClose"
      width="30%"
      center>
      <div ref="imageDom" class="showdom">
        <div class="title" @click="$router.push('/')"><img style="height:100%;" src="../assets/5a80b63d127c8a834f397efaf398ef60.jpg" alt=""></div>
        <div>
          <p class="welcome">您好，欢迎来到小视频</p>
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">用户名：</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">{{user.account}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">密码：</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">{{user.password}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">昵称：</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">{{user.nickName}}</div></el-col>
          </el-row>
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple">创建时间：</div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-light">{{$formatterDateTime(user.createTime)}}</div></el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="savePicture">保存图片并登录</el-button>
      </span>
    </el-dialog>
    <!-- 分享弹窗 -->
    <shareDialog :dialogShareVisible="dialogShareTableTableVisible" @changeShareTable="closeShareDialog"></shareDialog>
  </div>
</template>
<script>
/* eslint-disable */
import html2canvas from "html2canvas"
import shareDialog from '../components/main/shareDialog'
import {mapActions} from 'vuex'
  export default {
    name: "isntall",
    data () {
      var validatorUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          var reg = /^[A-Za-z0-9_]{6,20}$/
          if (!reg.test(value)) {
            callback(new Error('用户名为6-20位数字或字母'));
          }
          callback();
        }
      };
      var validatorPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          var reg = /^[A-Za-z0-9 `~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{8,24}$/
          if (!reg.test(value)) {
            callback(new Error('密码长度为8-24位'));
          }
          callback();
        }
      };
      var validatorPassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认您的密码'));
        } else {
          var reg = /^[A-Za-z0-9 `~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{8,24}$/
          if (!reg.test(value)) {
            callback(new Error('密码长度为8-24位'));
          }else if(value !== this.loginForm.password){
            callback(new Error('两次输入的密码不一致'));
          }
          callback();
        }
      };
      return {
        activeIndex:'1',
        islogin:true,
        dialogShareTableTableVisible:false,
        centerDialogVisible:false,
        user:{
          account:null,
          password:null
        },
        loginForm: {
          username: '',
          password: '',
          password2:'',
        },
        loginRules: {
          username: [
            {trigger: "change",validator:validatorUsername }
          ],
          password: [
            {trigger: "change",validator:validatorPassword}
          ],
          password2: [
            {trigger: "change",validator:validatorPassword2}
          ],
        }
      }
    },
    components: {
      shareDialog
    },
    // 这个方法不用调用this,因为此时机组件还没生成,所以无this
    // 要调用刷新数据方法时,需要写在next回调里,
    // next是在组件生成后会调用
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.updateList(to.query.name);
        });
    },
    // 这个方法是路由不变,只变参数时执行
    beforeRouteUpdate(to, from, next) {
      this.updateList(to.query.name);
      next();
    },
    created(){

      var that = this;
      document.onkeydown = function() {
        var key = window.event.keyCode;
        if (key == 13) {
            that.submitForm('loginForm');
        }
      };
    },
    methods: {
      //在这里引入 action 里的方法，使用方法和 methods 里的其他方法一样
      ...mapActions([
          'saveUser'
      ]),
      updateList(name){
        // console.log(this.$uuid);
        this.$refs.loginForm.resetFields();
        this.islogin = true;
        // if(name=='login'){
        //   this.islogin = true;
        // }else{
        //   this.islogin = false;
        // }
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.islogin){
              this.getRsa();
              // this.visitorLogin();
            }else{
              this.registerUser(this.loginForm.username,this.loginForm.password);
            }
          } else {
            this.$message.error('用户名或者密码输入格式不正确');
            return false;
          }
        });
      },
      getRsa(){
        let str = String(Math.round(new Date() / 1000));
        let str2 = str.split('').reverse().join('').replace(/(.{3})/g,'$1 ').split(' ');
        let str3 = this.$uuid.replace(/(.{3})/g,'$1 ').split(' ');
        str = str.replace(/(.{3})/g,'$1 ').split(' ');
        let cret = '';
        for (let index = 0; index < str2.length; index++) {
          cret += str[index]+str3[index]+str2[index];
        };
        // let reskey = Math.round(new Date() / 1000) + this.$uuid + ;
        this.$get('external-web/user/rsaSecretKey',{
          rsaKey:cret
        }).then((res)=>{
          if(res.code == '000000'){
            this.visitorLogin(res.data,cret);
          }else{
            this.$message.error('网络异常登录失败，请稍后再试');
          }
        }).catch(()=>{
          this.$message.error('网络异常登录失败，请稍后再试');
        });
        return;
      },
      // password注册
      registerUser(loginAccount,loginPassword){
        this.$post('external-web/user/regLogin',{
          'deviceId':this.$uuid,
          loginAccount:loginAccount,
          loginPassword:loginPassword,
          'brand':'',
          'loginType':2,
          'model':'',
          'system':'',
        }).then(res => {
          if(res.code == "000000"){
            this.saveUser({
              id:res.data.userId,
              token:res.data.userToken,
              userData:res.data
            });
            return this.$router.push("/");
          }else{
            this.$message({
              type: 'warning',
              message: res.message
            })
          }
          return;
        })
      },
      handleDialogClose(){
        return this.$router.push("/");
      },
      // 游客注册
      visitorRegister(){
        this.$post('external-web/user/visitorRegister',{
          'deviceId':this.$uuid,
        }).then(res => {
          if(res.code == "000000"){
            this.showDialog(res.data);
          }else{
            this.$message({
              type: 'warning',
              message: res.message
            });
          }
          return;
        })
      },
      showDialog(user){
        this.user = user;
        this.saveUser({
          id:user.userId,
          token:user.userToken,
          userData:user
        });
        this.centerDialogVisible = true;
      },
      savePicture(){
        html2canvas(this.$refs.imageDom).then(canvas => {
          // 转成图片，生成图片地址
          let imgUrl = canvas.toDataURL("image/png");
          let a = document.createElement("a");
          a.href = imgUrl;
          a.download = "userinfo";
          a.click();
          setTimeout(()=>{return this.$router.push("/");},1000);
        });
      },
      visitorLogin(data,other){
        var encrypt = new this.$jSEncrypt();
        encrypt.setPublicKey(data);
        var v_str = encrypt.encrypt(JSON.stringify({
          'deviceId':this.$uuid,
          'loginAccount':this.loginForm.username,
          'loginPassword':this.loginForm.password,
          'loginType':2,
        }));
        var data = {
           rsaKey:other,
           userLoginDtoStr:v_str
        };
        this.$post('external-web/user/loginUser',data).then(res => {
          if(res.code == "000000"){
            this.saveUser({
              id:res.data.userId,
              token:res.data.userToken,
              userData:res.data
            });
            setTimeout(()=>{
              this.userPoint(res.data.userId);
            },0)
            return this.$router.push("/");
          }else{
            return this.$message({
              type: 'warning',
              message: res.message
            });
          }
        }).catch(()=>{
          return this.$message.error('服务器异常，暂时无法登录，请稍后再试哦');
        })
      },
      userPoint(id){
        this.$post('external-web/commonPoint/userPoint',JSON.stringify([{
          'count':1,
          'userId':id,
          'platform':3,
          'pointTime':Math.round(new Date()),
          'type':2,
          'version':'1.0.0_web'
        }]));
      },
      // 控制分享弹窗
      closeShareDialog(bool){
        this.dialogShareTableTableVisible = bool;
      },
    }
  }
</script>
<style lang="scss">
body,html{
  height:100%;
}
.isntall{
  width:100%;
  height:100%;
  background-size: cover;
  background-color:#fff;
  background-repeat: no-repeat;
  // background-image: url('../assets/image.png');
  .contain{
    position: absolute;
    left:0;
    right:0;
    top:220px;
    width:400px;
    height:600px;
    margin:0 auto;
    .container{
      position: relative;
      width:100%;
      background-color:#fff;
      box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
      // height:440px;
      height:340px;
      padding-top:40px;
      .header{
        width:90px;
        height:90px;
        margin:0 auto;
        border-radius: 50%;
        overflow: hidden;
        img{
          width:100%;
          height:100%;
        }
      }
      .body{
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        width:300px;
        margin:40px auto 0;
        .el-form-item__content {
          margin-left: 0 !important;
        }
        form{
          width:100%;
          input:-webkit-autofill {
            box-shadow: 0 0 0px 1000px white inset !important;
          }  
          input:-webkit-autofill:focus {
            box-shadow: 0 0 0px 1000px white inset !important;
          }  
          .el-button--primary{
            background-color: #F92255;
            border-color: #F92255;
          }
          .el-button--noprimary{
            background-color:#FDA7BB;
            border-color: #FDA7BB;
          }
          .el-form-item:last-child{
            margin:0;
          }
        }
      }
      .register{
        width:300px;
        margin:15px auto 29px;
        text-align: right;
        color:#666;
        font-size:14px;
        span:last-child{
          color:#F92255;
          font-weight: bolder;
          cursor: pointer;
        }
      }
      .login{
        width:300px;
        margin:15px auto 29px;
        text-align: center;
        color:#666;
        font-size:14px;
        span:last-child{
          color:#F92255;
          font-weight: bolder;
          cursor: pointer;
        }
      }
      .inline{
        width:300px;
        margin:0 auto;
        height:20px;
        .el-col{
          height:12px;
          border-bottom: 1px solid #E6E6E6;
          &:nth-child(2){
            height:16px;
            border-bottom: none;
            text-align: center;
          }
        }
      }
      .visitor{
        color:#F92255;
        font-size:14px;
        font-weight: bolder;
        text-align: center;
        margin-top:19px;
        cursor: pointer;
      }
    }
    .store{
      margin-top:10px;
      background-color:#fff;
      box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
      height:130px;
      .msg{
        text-align:center;color:#333333;font-size:14px;font-weight:bloder;height:52px;line-height:52px;
      }
      .btnshow{
        height:48px;
        text-align: center;
        margin:8px;
        background-color:#000;
        color:#fff;
        line-height: 48px;
        border-radius: 10px;
      }
      .showlink{
        width:336px;
        margin:0 auto;
      }
    }
    .tips{
      color: #dda450;
      font-size: 12px;
      margin-bottom: 10px;
      margin-top: 10px;
      line-height: 20px;
      text-align: right;
    }
  }
  .showdom {
    text-align: center;
    .title{
      padding-top:10px;
      text-align: center;
      cursor: pointer;
      height:60px;
      line-height:80px;
    }
    .el-row{
      margin-bottom:10px;
    }
    .welcome{
      margin:20px auto;
    }
    .bg-purple{
      text-align: right;
      margin-right:10px;
    }
    .bg-purple-light{
      text-align: left;
    }
  }
  
  
}
</style>