<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-20 14:26:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-29 11:48:59
 -->
<template>
    <div class="login" v-if="currentChatEnlist.length == 0">
        <div class="loginForm">
            <div class="loginHeader">
                <!-- <h2>客服聊天系统</h2> -->
                <img src="../../../static/image/log-icon.png" />
            </div>
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
                <el-form-item prop="username">
                    <el-input
                        name="username"
                        prefix-icon="el-icon-hpbuser"
                        v-model="loginForm.username"
                        placeholder="账号"
                        @keyup.enter.native="handleLogin('loginForm')"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        prefix-icon="el-icon-hpbpassword"
                        v-model="loginForm.password"
                        placeholder="密码"
                        @keyup.enter.native="handleLogin('loginForm')"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row :span="24">
                        <el-col :span="12">
                            <el-input
                                :maxlength="code.len"
                                v-model="loginForm.code"
                                auto-complete="off"
                                placeholder="请输入验证码"
                                @keyup.enter.native="handleLogin('loginForm')"
                            >
                                <i slot="prefix" class="icon-yanzhengma"></i>
                            </el-input>
                        </el-col>
                        <el-col :span="12" style="padding-left:20px;">
                            <div class="login-code">
                                <span
                                    class="login-code-img"
                                    @click="getRandomCode"
                                    v-if="code.type == 'text'"
                                >{{code.value}}</span>
                                <img
                                    :src="code.src"
                                    class="login-code-img"
                                    @click="getRandomCode"
                                    v-else
                                />
                                <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
                            </div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :loading="loading"
                        type="primary"
                        @click="handleLogin('loginForm')"
                    >登录</el-button>
                </el-form-item>
                <h5>
                    <span class="el-icon-star-on">&nbsp;推荐使用谷歌浏览器,享受更优质的体验</span>
                </h5>

                <div class="machine" v-if="false">
                    <label>
                        <a href="#">注册新团队</a>
                    </label>
                    <label>
                        <a href="#">忘记密码了?</a>
                    </label>
                </div>
            </el-form>
        </div>
        <div class="footer">
            <span>©</span>
        </div>
    </div>
</template>
<script>
import { deepClone, encryption } from "../util/util";
import * as CryptoJS from "crypto-js";

export default {
    data() {
        return {
            loading: false,
            validator: true,
            isRemembered: "",
            loginForm: {
                username: "",
                password: "",
                code: "",
                scope: "server",
                grant_type: "password"
            },
            code: {
                src: "",
                value: "",
                len: 4,
                type: "image"
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: ["blur", "change"]
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: ["blur", "change"]
                    }
                ],
                code: [
                    {
                        required: true,
                        message: "请输入验证码",
                        trigger: ["blur", "change"]
                    }
                ]
            }
        };
    },
    computed: {
        currentChatEnlist() {
            return this.$store.imServerStore.getters.currentChatEnlist;
        },
    },
    created() {
        // 重定向后VUX 数据不重置，需手动刷新
        if (this.currentChatEnlist.length != 0) { // 判断是否已经刷新
            return window.location.reload();
        } 
        this.refreshCode();
        this.getRandomCode(); // 生成验证码
    },
    methods: {
        // 生成随机数
        randomLenNum(len, date) {
            let random = "";
            random = Math.ceil(Math.random() * 100000000000000)
                .toString()
                .substr(0, len || 4);
            if (date) random = random + Date.now();
            return random;
        },
        // 生成验证码
        getRandomCode() {
            var timestamp = new Date().valueOf();
            this.code.src =
                this.$httpServer.getIdentifyingCode + "?randomStr=" + timestamp;
                this.loginForm.randomStr = timestamp;
        },
        refreshCode() {
            this.loginForm.code = "";
            // this.loginForm.randomStr = this.randomLenNum(this.code.len, true);
            // this.loginForm.randomStr = 111;
            this.code.type === "text"
                ? (this.code.value = this.randomLenNum(this.code.len))
                : (this.code.src = `${this.codeUrl}?randomStr=${this.loginForm.randomStr}`);
        },
        handleLogin(formName) {
            let that = this;
            if(that.loading){
                return;
            }
            const user = encryption({
                data: this.loginForm,
                key: "csccsccsccsccscc",
                param: ["password"]
            });
            this.loading = true;
            
            that.$refs[formName].validate(valid => {
            if (valid) {
                    this.$axios({
                        methods: "post",
                        url: that.$httpServer.login,
                        params: {
                            username: user.username,
                            password: user.password,
                            randomStr: user.randomStr,
                            code: user.code,
                            grant_type: user.grant_type,
                            scope: user.scope
                        }
                    })
                        .then(async res => {
                            
                            if (res && res.status == "200") {
                                sessionStorage.setItem(
                                    "token",
                                    res.data.access_token
                                );
                                sessionStorage.setItem(
                                    "userId",
                                    res.data.user_id
                                );
                                sessionStorage.setItem(
                                    "userInfo",
                                    JSON.stringify(res.data)
                                ); // 刷新页面后vuex的数据会消失，因此还是存在sessionStore里
                                // this.getUser()
                                await this.$store.imServerStore.dispatch('getUserInfo')
								await this.$store.imServerStore.dispatch('getUserMenu')
								let params = {
									seatsId: sessionStorage.getItem("userId")
                                };
								this.$axios.get("/im/imbindinfo/getBindInfoBySeatsId", { params }).then(res => {
									if (res.data.data) {
										res.data.data.map((v, i) => {
											let obj = {
												center: "",
												clientbrowser: v.clientBrowser,
												clientip: v.clientIp,
												clientplatform: v.clientPlatform,
												contentType: 0,
												msgType: v.isLineUp > 0 ? 8 : 5,
												sender: v.clientId,
												time: v.linkTime,
												trackid: v.trackId,
												type: "client",
												dialogueTag: v.dialogueTag,
												lastTrackId: '',
												clientProvince: v.clientProvince, // 上线用户 省市
                                                clientCity: v.clientCity, // 上线用户 市区
                                                clientCountry: v.clientCountry, // 上线用户 国家
                                                userId: v.userId,
                                                dialogueStatus:v.dialogueStatus, //访客状态 3 离线
											};
											// that.zhDialogueTag
											this.$store.imServerStore.dispatch("addClientChat", obj);
                                        });
									}
								});
                                this.$router.push({ path: "/homePage" });
                                this.loading = false;
                            } else {
                                this.$message1({
                                    message: res.data.msg,
                                    type: "error"
                                });
                                this.loading = false;
                            }
                        })
                        .catch((error) => {
                            this.getRandomCode();
                            this.loading = false;
                        });
                } else {
                    this.loading = false;
                }
            });
            return false;
        }
    }
};
</script>
<style scoped >
.login {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.loginForm {
    width: 280px;
    padding-bottom: 7%;
}
.loginForm .el-button {
    width: 100%;
}
.loginForm h5{
    color: #dda450;
    font-size: 12px;
    margin-bottom: 10px;
    text-align: right;
}
.loginHeader {
    color: #188ffe;
    text-align: center;
    margin-bottom: 30px;
}
.loginHeader h2 {
    font-size: 30px;
    font-weight: bold;
    margin-top: 0;
}
.loginForm input {
    background-image: none;
    color: #555;
    background-color: #fff;
    border: 1px solid #d4dadd;
    border-radius: 4px;
}
.machine {
    display: flex;
    justify-content: space-between;
}
.machine a {
    color: #009de7;
    font-size: 14px;
    text-decoration: none;
}
.footer {
    line-height: 60px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    color: #bdbdbd;
    background-color: #fcfcfd;
    text-align: center;
}
</style>


