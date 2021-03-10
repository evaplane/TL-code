<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-10-12 18:32:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-12 18:32:09
 -->
<template>
    <!-- 个人信息设置 -->
    <div class="pseronalSet">
        <el-form ref="form" :model="form" label-width="100px" label-position="left" :rules="rules">
            <div class="accountInfo layout">
                <div class="title">
                    <h1>账号信息</h1>
                    <span>除头像外，账号信息只会展示给团队内成员，顾客不会看见</span>
                </div>
                <div>
                    <div class="top">
                        <el-row :gutter="10">
                            <el-col :span="5">
                                <div class="grid-content bg-purple">
                                    <div class="portrait">
                                        <img :src="form.avatar" alt v-if="form.avatar" />
                                        <img
                                            src="/static/img/default-avatar.5db4495.jpg"
                                            v-else
                                            style="width:70px;height:70px;"
                                        />
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="15">
                                <div class="grid-content bg-purple">
                                    <el-upload
                                        ref="uploaded"
                                        :action="action"
                                        :headers="headers"
                                        class="avatar-uploader"
                                        accept="image/gif, image/jpeg, image/jpg, image/gif, image/png"
                                        :show-file-list="false"
                                        :before-upload="progress"
                                        :on-success="handleAvatarSuccess"
                                    >
                                        <el-button size="small" type="primary">点击上传</el-button>
                                        <div
                                            slot="tip"
                                            class="el-upload__tip"
                                        >只能上传jpg/png/gif文件，且不超过500kb</div>
                                    </el-upload>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="5">
                                <div class="grid-content bg-purple">密码</div>
                            </el-col>
                            <el-col :span="15">
                                <div class="grid-content bg-purple">
                                    <ResetPassword type="0" :userInfo="form"></ResetPassword>
                                    <!-- <span
                                        style="display:block;cursor:pointer;"
                                        @click="dialogVisible = true"
                                    >修改密码</span>-->
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="5">
                                <div class="grid-content bg-purple">登录账户</div>
                            </el-col>
                            <el-col :span="15">
                                <div class="grid-content bg-purple">
                                    <div size="small">{{form.username}}</div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-form-item label="真实姓名" prop="actualName">
                                <el-input
                                    v-model.trim="form.actualName"
                                    size="small"
                                    maxlength="20"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="5">
                                <div class="grid-content bg-purple">工号</div>
                            </el-col>
                            <el-col :span="15">
                                <div class="grid-content bg-purple">{{form.userId}}</div>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="layout">
                <div class="title">
                    <h1>客服名片</h1>
                    <span>名片里面的信息将会被展示给对话中的顾客</span>
                </div>
                <div>
                    <el-form-item label="名称" prop="businessCardName">
                        <el-input v-model.trim="form.businessCardName" maxlength="20" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="自定义签名" prop="signature">
                        <el-input type="textarea" :rows="5" resize="none" maxlength="100" v-model.trim="form.signature" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="phone">
                        <el-input v-model.trim="form.phone" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model.trim="form.email" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ">
                        <el-input
                            v-model.trim="form.qq"
                            size="small"
                            maxlength="20"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="微信">
                        <el-input
                            v-model.trim="form.wx"
                            size="small"
                            maxlength="20"
                            show-word-limit
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="onSubmit(form)">确定</el-button>
                        <el-button @click="$router.back()">取消</el-button>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getUserById, updateUser, eidtUserInfo } from "@/common/api";
import ResetPassword from "@/components/common/resetPassword";

export default {
    components: {
        ResetPassword
    },
    data() {

        let _this = this;
        const checkNameInt = this.$ak.Utils.checkNameInt;
        const validatePass = this.$ak.Utils.validatePass;
        return {
            action:this.$httpServer.im_fdfsupload,
            headers: "", // 上传的请求头
            data: {}, // 个人信息原始数据
            form: {}, // 个人信息修改表单
            rules: {
                phone: [
                    { validator: validatePass, trigger: ["blur", "change"] }
                ],
                email: [
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                actualName: [
					{ required: true, message: '请输入真实姓名', trigger: ["blur", "change"] },
                    { validator: checkNameInt, trigger: ["blur", "change"]}
				]
            }
        };
    },
    methods: {
        /**
         * 获取个人信息
         */
        getUserInfoById(id) {
            getUserById(id).then(res => {
                if (res.data.code === 0) {
					let data = res.data.data;
					delete data.serviceCeiling;
					delete data.serviceStatus;
                    delete data.password;
                    let roleList = data.roleList;
                    //   略坑，因为修改的时候需要传入roleId的数组，
                    //  然而取到的是roleList对象，所以在获取时初始化一个roleId的数组，以免保存时出错
                    let arr = [];
                    roleList.forEach(tmp => {
                        tmp.roleId && arr.push(tmp.roleId);
                    });
                    data.role = arr;
                    this.data = data;
                    this.form = Object.assign({}, data);
                }
            });
        },
        /**
         * 头像上传的回显
         */
        handleAvatarSuccess(response, file, fileList) {
            // this.form.avatar = response.data;
            console.log(response, file, fileList)
            this.form.avatar = response.data;
        },
        /**
         * 保存数据
         */
        onSubmit(data) {
            if (JSON.stringify(this.form) === JSON.stringify(this.data)) {
                this.$message1({
                    message: "未做任何修改",
                    type: "warning"
                });
            } else {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        updateUser(data).then(res => {
                            if (res.data.data) {
                                let userInfo = this.$store.imServerStore.state.userInfo
                                userInfo.avatar = data.avatar
                                this.$message1({
                                    message: "修改成功",
                                    type: "success"
                                });
                                this.$store.imServerStore.dispatch('getUserInfo'); //重新获取权限
                            } else {
                                this.$message1({
                                    message: res.data.msg,
                                    type: "error"
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        progress(file) {
            console.log('上传',file)
            if (file.size >= 1048576) {
                // this.$refs.uploaded.abort(file);
                this.$message1({
                    type: "warning",
                    message: "上传的文件大小不能超过1Mb"
                });
                return false
            } else {
                return true
                let formData = new FormData();
                formData.append("file",file);
                this.$axios.post(this.action,formData).then(res=>{
                    console.log(res.data.data);
                })
            }
        }
    },
    created() {
        let { userId } = this.$store.imServerStore.state.userInfo;
        // 上传时需要传入token，初始化一个header对象给上传组件
        let obj = {
            Authorization: "Bearer " + sessionStorage.getItem("token")
        };
        this.headers = obj;
        this.getUserInfoById(userId);
    }
};
</script>

<style lang="less" scoped>
@label-width: 100px;

.pseronalSet {
    width: 710px;
    .layout {
        font-size: 14px;
        background: #fff;
        padding: 20px 30px;
        margin-bottom: 30px;
        > div.title {
            line-height: 28px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f5f5f5;
            h1 {
                font-size: 16px;
            }
            span {
                color: #969faa;
            }
        }
        > div:not(.title) {
            width: 450px;
            padding-top: 20px;
            > div.top {
                > div {
                    margin-bottom: 22px;
                    span {
                        color: #66b1ff;
                    }
                }
                .portrait {
                    display: inline-block;
                    img {
                        width: 70px;
                        height: 70px;
                        border-radius: 50%;
                    }
                }
            }
        }
    }
}
.el-row {
    color: #606266;
    line-height: 28px;
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>
