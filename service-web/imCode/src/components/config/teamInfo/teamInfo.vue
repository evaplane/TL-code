<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-29 17:42:20
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-29 17:42:20
 -->
<template>
    <div class="teamInfo">
        <!-- 主要段落内容 -->
        <!-- 团队信息 -->
        <section class="layout">
            <p>
                <span>团队信息</span>
                <a href="javascript:;" @click="openDialog('dept')">修改</a>
                <span class="refrence grayFont">{{deptInfo.createTime}} 注册</span>
            </p>
            <p>
                <span class="grayFont">团队ID:</span>
                {{deptInfo.deptId}}
            </p>
            <p>
                <span class="grayFont">团队名称:</span>
                {{deptInfo.name}}
            </p>
            <p>
                <span class="grayFont">所在业务线:</span>
                {{deptInfo.description}}
            </p>
            <!-- <p>
                <span class="grayFont">所在地区:</span>广东 深圳
            </p>-->
        </section>
        <!-- 团队客服名片 -->
        <!-- <section class="layout">
            <p>
                <span>团队客服名片</span>
                <router-link to="/config/namecard">修改</router-link>
            </p>
            <p class="grayFont">企业开启「无消息访客过滤」时团队客服名片将会展示给访客。</p>
        </section>-->
        <!-- <section class="layout">
            <p>超级管理员</p>
            <p class="grayFont">只有超级管理员才可以修改本设置和付费页面的设置。</p>
            <p>
                <span>超级管理员</span>
                <a href="javascript:;">修改</a>
            </p>
        </section>-->
        <!-- 团队联系人 -->
        <section class="layout">
            <p>
                <span>团队联系人</span>
                <a href="javascript:;" @click="openDialog('contact')">修改</a>
            </p>
            <p class="grayFont">仅用于紧急情况联系，请放心，我们不会骚扰用户。</p>
            <p>
                <span class="grayFont">姓名:</span>
                {{deptContactInfo.name}}
            </p>
            <p>
                <span class="grayFont">电话:</span>
                {{deptContactInfo.phone}}
            </p>
            <p>
                <span class="grayFont">邮箱</span>
                {{deptContactInfo.email}}
            </p>
            <p>
                <span class="grayFont">邮寄地址:</span>
                {{deptContactInfo.address}}
            </p>
        </section>
        <!-- 弹窗 -->
        <el-dialog
            :visible.sync="dialogUp"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            width="25%"
            class="teamDetailLayout"
            @keyup.enter.native="submit(interVisible)"
        >
            <div slot="title" class="dialogHeader">
                <h1>{{interVisible == 'dept' ? '修改团队信息': '修改团队联系人'}}</h1>
            </div>
            <el-form
                v-if="interVisible == 'dept'"
                key="dept"
                ref="deptForm"
                :model="deptInfoForm"
                label-width="100px"
                size="mini"
                :rules="rules"
            >
                <el-form-item label="团队名称" prop="name">
                    <el-input
                        v-model.trim="deptInfoForm.name"
                        placeholder="请输入团队名称"
                        size="small"
                        maxlength="10"
                        show-word-limit
                        type="text"
                    ></el-input>
                </el-form-item>
                <el-form-item label="团队业务线">
                    <el-input
                        type="text"
                        v-model.trim="deptInfoForm.description"
                        placeholder="请输入团队业务线"
                        size="small"
                        maxlength="50"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <el-form
                v-else
                key="contact"
                ref="contactForm"
                :model="deptContactInfoForm"
                label-width="100px"
                size="mini"
                :rules="rules"
            >
                <el-form-item label="姓名">
                    <el-input
                        type="text"
                        v-model.trim="deptContactInfoForm.name"
                        placeholder="请输入姓名"
                        size="small"
                        maxlength="10"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="电话或手机" prop="phone">
                    <el-input
                        v-model.trim="deptContactInfoForm.phone"
                        placeholder="请输入电话或手机"
                        size="small"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input
                        v-model.trim="deptContactInfoForm.email"
                        placeholder="请输入邮箱"
                        size="small"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮寄地址">
                    <el-input
                        type="text"
                        v-model.trim="deptContactInfoForm.address"
                        placeholder="请输入邮寄地址"
                        size="small"
                        maxlength="50"
                        show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="cancel(interVisible)">取 消</el-button>
                <el-button type="primary" @click="submit(interVisible)">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getDeptInfo,
    getDeptContactById,
    handleDeptInfo,
    updateDeptContactInfo
} from "../../../common/api";

export default {
    data() {
        const validatePass = this.$ak.Utils.validatePass;
        return {
            // 控制弹窗弹出或关闭
            dialogUp: false,
            /**
             * 控制弹窗内的表单切换('dept'——团队信息修改，'contact'——团队联系人修改)
             */
            interVisible: 0,
            // 团队信息数据对象
            /**
             * 饿了么UI表单验证的坑真多
             * 一定要用el-from-item
             * 要么都写在rules里，要么都写在item的:rule里
             * prop的命名要和v-model的命名一样
             */
            rules: {
                name: {
                    required: true,
                    message: "请输入团队名称",
                    trigger: ["blur", "change"]
                },
                phone: [
                    { validator: validatePass, trigger: ["blur", "change"] }
                ],
                email: [
                    {
                        type: "email",
                        message: "请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ]
            },
            deptInfo: {},
            /**
             *
                createTime: "2019-07-24 19:57:43"
                delFlag: "0"
                deptId: 24
                description: null
                name: "管理员"
                parentId: 0
                sort: 1
                tenantId: 1
                updateTime: null
             */
            // 团队信息修改表单数据对象
            deptInfoForm: {
                name: "",
                description: ""
            },
            // 团队联系人数据对象
            deptContactInfo: {},
            /**
             *
                address: null
                contactId: 2
                createTime: "2018-04-20 07:15:18"
                deptId: 24
                email: null
                name: null
                phone: "17034642889"
                updateTime: "2019-08-02 10:47:27"
             */
            // 团队联系人修改表单数据对象
            deptContactInfoForm: {
                name: "",
                phone: "",
                email: "",
                address: "",
                deptId: ""
            }
        };
    },
    methods: {
        /**
         * 数据初始化（请求）
         */
        getAllData(deptId) {
            return this.$axios
                .all([getDeptInfo("get", deptId), getDeptContactById(deptId)])
                .then(
                    this.$axios.spread((teamInfo, deptContact) => {
                        teamInfo = teamInfo.data;
                        deptContact = deptContact.data;
                        if (teamInfo.data) {
                            this.deptInfo = teamInfo.data;
                            this.deptInfoForm = Object.assign(
                                {},
                                this.deptInfo
                            );
                        }
                        if (deptContact.data) {
                            this.deptContactInfo = deptContact.data;
                            this.deptContactInfoForm = Object.assign(
                                {},
                                this.deptContactInfo
                            );
                        }
                    })
                );
        },
        /**
         * 修改按钮事件——弹窗弹出——表单切换
         * type: 激活该事件的按钮类型 (0：团队信息修改按钮,1:团队联系人修改按钮)
         */
        openDialog(type) {
            this.dialogUp = true;
            this.interVisible = type;
        },
        /**
         * 弹窗取消
         */
        cancel(type) {
            this.dialogUp = false;
            // 弹窗表单重置
            if (type === "dept") {
                this.deptInfoForm = Object.assign({}, this.deptInfo);
                this.$refs.deptForm.clearValidate();
            } else {
                this.deptContactInfoForm = Object.assign(
                    {},
                    this.deptContactInfo
                );
                this.$refs.contactForm.clearValidate();
            }
        },
        /**
         * 表单提交事件——保存数据并关闭弹窗
         * type:表单类型 dept-团队修改；contact-联系人修改
         */
        submit(type) {
            let _this = this;
            let obj = {
                dept: {
                    obj1: this.deptInfo,
                    obj2: this.deptInfoForm,
                    request: handleDeptInfo,
                    fromName: "deptForm",
                    success() {
                        _this.deptInfo = Object.assign({}, _this.deptInfoForm);
                    }
                },
                contact: {
                    obj1: this.deptContactInfo,
                    obj2: this.deptContactInfoForm,
                    request: updateDeptContactInfo,
                    fromName: "contactForm",
                    success() {
                        _this.deptContactInfo = Object.assign(
                            {},
                            _this.deptContactInfoForm
                        );
                    }
                }
            };
            if (!this.isEqual(obj[type].obj1, obj[type].obj2)) {
                this.$refs[obj[type].fromName].validate(valid => {
                    if (valid) {
                        obj[type].request("put", obj[type].obj2).then(res => {
                            let data = res.data;
                            if (data.data) {
                                obj[type].success();
                                this.$message1({
                                    message: "修改成功",
                                    type: "success"
                                });
                            } else {
                                this.$message1({
                                    message: "修改失败",
                                    type: "error"
                                });
                            }
                        });
                        this.dialogUp = false;
                    } else {
                        return false;
                    }
                });
            } else {
                // console.log
                this.$message1({
                    message: "未做任何更改",
                    type: "default"
                });
            }
        },
        /**
         * 比较表单数据是否做过更改（判断对象是否相等，因为表单数据顺序不会变且忽略了所有空格因此可以这样判断)
         */
        isEqual(obj1, obj2) {
            return JSON.stringify(obj1) === JSON.stringify(obj2);
        }
    },
    computed: {},
    watch: {},
    created() {
        let {deptId} = this.$store.imServerStore.state.userInfo
        this.deptContactInfoForm.deptId = deptId;
        this.getAllData(deptId);
    },
    mounted() {}
};
</script>


<style lang="less" scoped>
@import "../../../common/css/base.less";

.teamInfo {
    width: 710px;
    .layout {
        font-size: 14px;
        line-height: 32px;
        padding: 30px 20px;
        margin-bottom: 20px;
        background-color: #fff;
        p {
            span {
                vertical-align: middle;
            }
        }
    }
    a {
        vertical-align: middle;
        margin-left: 10px;
        span {
            font-size: 18px;
            vertical-align: middle;
        }
    }
    .refrence {
        float: right;
    }
    .teamDetailLayout {
        section p {
            color: #767d85;
            line-height: 3;
        }
        // section.rowLyout {
        //     display: flex;
        //     flex-flow: row nowrap;
        //     justify-content: left;
        // }
    }
}
.grayFont {
    color: #969faa;
}
.dialogHeader {
    border-bottom: none;
}
</style>
