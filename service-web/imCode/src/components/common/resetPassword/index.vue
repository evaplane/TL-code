<template>
    <div>
        <span
            style="cursor:pointer;color:#009de7;"
            @click="dialogVisible = true"
        >{{type == 0 ? '修改密码' : '强制修改密码'}}</span>
        <!-- 弹窗 -->
        <el-dialog
            title="修改密码"
            :visible.sync="dialogVisible"
            width="400px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
        >
            <el-form :model="loginForm" :rules="rules" ref="loginForm" v-if="dialogVisible" @keyup.enter.native="updatePassword(userInfo)">
                <el-form-item prop="password" style="margin-bottom: 22px;" v-if="type == 0">
                    <el-input
                        type="password"
                        prefix-icon="el-icon-hpbpassword"
                        v-model="loginForm.password"
                        placeholder="请输入原密码"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="newpassword1" style="margin-bottom: 22px;">
                    <el-input
                        type="password"
                        prefix-icon="el-icon-hpbpassword"
                        v-model="loginForm.newpassword1"
                        placeholder="请输入新密码"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="newpassword2" style="margin-bottom: 22px;">
                    <el-input
                        type="password"
                        prefix-icon="el-icon-hpbpassword"
                        v-model="loginForm.newpassword2"
                        placeholder="请重复输入新密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancle(userInfo)">取 消</el-button>
                <el-button type="primary" @click="updatePassword(userInfo)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { eidtUserInfo, updateUser  } from "@/common/api";
export default {
    props: {
        type: {
            type: String | Number,
            required: true,
            default: 0
        },
        userInfo: {
            type: Object,
            default: () => {}
        }
    },
    // watch: {
    //     userInfo: {
    //         handler(val) {
    //             return val
    //         },
    //         deep: true
    //     }
    // },
    // computed: {
    //     userData() {
    //         return this.userInfo
    //     }
    // },
    data() {
        let _this = this;
        const passwordCheck = (rule, value, callback) => {
            if (value === _this.loginForm.password) {
                callback(new Error("新密码与旧密码重复"));
            } else {
                callback();
            }
        };
        const passwordVal = (rule, value, callback) => {
            if (value !== _this.loginForm.newpassword1) {
                callback(new Error("两次输入不一致"));
            } else {
                callback();
            }
        };
        return {
            dialogVisible: false,
            loginForm: {
                // 修改密码弹窗的表单
                password: "",
                newpassword1: "",
                newpassword2: ""
            },
            rules: {
                // 表单验证规则
                password: [
                    {
                        required: true,
                        message: "请输入原密码",
                        trigger: ["blur", "change"]
                    }
                ],
                newpassword1: [
                    {
                        required: true,
                        message: "请输入新密码",
                        trigger: ["blur", "change"]
                    }
                ],
                newpassword2: [
                    {
                        required: true,
                        message: "请重复输入新密码",
                        trigger: ["blur", "change"]
                    },
                    { validator: passwordVal, trigger: ["blur", "change"] }
                ]
            }
        };
    },
    methods: {
        cancle(form) {
            for(let i in this.loginForm) {
                this.loginForm[i] = ''
            }
            this.dialogVisible = !this.dialogVisible
        },
        updatePassword(form) {
            // 修改密码
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    if (this.type == 0) {
                        this.loginForm.userId = this.userInfo.userId;
                        this.loginForm.username = this.userInfo.username;
                        await eidtUserInfo(this.loginForm).then(res => {
                            if (res.data.data) {
                                this.$message1({
                                    message: "修改成功",
                                    type: "success"
                                });
                                this.$router.push({ path: "/login" });
                            } else {
                                this.$message1({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        });
                    } else {
                        form.password = this.loginForm.newpassword1
                        if (typeof form.role !== "object") {
                            let arr = [];
                            arr.push(form.role);
                            form.role = arr;
                        }
                        await updateUser(form).then(res => {
                            // form.role = form.role[0]
                            if(res.data.data) {
                                this.$message1({
                                    message: "修改成功",
                                    type: "success"
                                });
                                this.dialogVisible = false
                                // this.$router.push({ path: "/login" });
                            } else {
                                this.$message1({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        });
                    }
                    for(let i in this.loginForm) {
                        this.loginForm[i] = ''
                    }
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>
