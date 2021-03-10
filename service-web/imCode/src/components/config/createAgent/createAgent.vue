<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-10-10 21:36:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-10 21:36:18
 -->
<template>
    <!-- 新建客服账号 -->
    <div class="createAgent">
        <!-- 头部 -->
        <header>
            <div v-if="type">
                <span>账号信息</span>
                <p>新建客服人员的账号和资料</p>
            </div>
            <div v-else class="edit">
                <p>客服人员的帐号和资料</p>
                <p>
                    客服ID
                    <span>{{curUserId}}</span>
                </p>
            </div>
        </header>
        <!-- 具体可以修改查看的表单 -->
        <article>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="登录账号" prop="username">
                    <el-row :span="24">
                        <el-col :span="11" class="name">
                            <el-input
                                size="mini"
                                v-model.trim="form.username"
                                maxlength="20"
                                show-word-limit
                                v-if="type"
                            ></el-input>
                            <span v-else class="name">{{form.username}}</span>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="真实姓名" prop="actualName">
                    <el-row :span="24">
                        <el-col :span="11">
                            <el-input
                                size="mini"
                                v-model.trim="form.actualName"
                                maxlength="20"
                                show-word-limit
                            ></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="密码">
                    <p v-if="type">
                        {{form.password}}
                        <span
                            :userId="form.userId"
                            :userName="form.username || ''"
                            class="el-icon-document-copy copy"
                            @click="copyPassword(form.password)"
                        ></span>
                    </p>
                    <ResetPassword
                        type="1"
                        :userInfo="oldForm"
                        v-else
                    ></ResetPassword>
                </el-form-item>
                <el-form-item label="服务上限">
                    <el-input-number
                        size="medium"
                        v-model="form.serviceCeiling"
                        :min="num.min"
                        :max="num.max"
                        label="服务上限"
                    ></el-input-number>
                    <p  v-if="!type" style="color: red;">*如果您修改的是本账号的客户服务上限将会重新登录</p>
                    <p>客服人员最多能同时接待的对话数，设为 0 则此客服不会被自动分配到对话，用户最大可以设置为 {{num.max}}</p>
                </el-form-item>
                <el-form-item label="所属分组" prop="deptId">
                    <el-radio
                        v-model="form.deptId"
                        :label="tmp.deptId"
                        v-for="(tmp, i) in deptList"
                        :key="i"
                        class="checkBtn"
                        :title="tmp.name"
                    >{{tmp.name}}</el-radio>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-radio
                        v-model="form.role"
                        :label="tmp.roleId"
                        v-for="(tmp, i) in roleList"
                        :key="i"
                        class="checkBtn"
                        :title="tmp.roleName"
                    >{{tmp.roleName}}</el-radio>
                </el-form-item>
                <!-- <el-form-item label="权限范围">
                    <div class="permissionBtnGroup">
                        <el-button @click="perminssionSel=false">本级及子级</el-button>
                        <el-button @click="perminssionSel=false">本级</el-button>
                </div>-->
                <!-- <div class="permissionParts" v-if="perminssionSel">
                        <el-checkbox-group v-model="checkedCities" :min="1" :max="4">
                            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                        </el-checkbox-group>
                </div>-->
                <!-- </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="onSubmit(form)">保存</el-button>
                    <el-button @click="cancle">取消并返回</el-button>
                </el-form-item>
            </el-form>
        </article>
        <div class="del" v-if="!type && Permission('sys_user_del')">
            <div>
                <h1>删除帐号</h1>
                <p>
                    帐号删除后，以前和
                    <span>{{form.actualName}}</span> 相关的历史数据与统计数据不会受到影响
                </p>
            </div>
            <div>
                <el-button type="danger" icon="el-icon-delete" @click="delUserById(curUserId)">删除帐号</el-button>
            </div>
        </div>
    </div>
</template>


<script>
import ResetPassword from "@/components/common/resetPassword";
import {
    handleRole,
    getRoleDept,
    createUser,
    getUserById,
    updateUser,
    delUser
} from "@/common/api";
// /admin/role/list 查询角色
// /admin/user 添加人员
// {"userId":"",
// "username":"客服专员测试账号",
// "password":"123456",
// "deptId":35,
// "phone":"18888888888",
// "role":[4],
// "lockFlag":"9",
// "createTime":""}
export default {
    components: {
        ResetPassword
    },
    data() {
        // console.log('ak', this.$ak.Utils)
        const checkInt = this.$ak.Utils.checkInt;
        const checkNameInt = this.$ak.Utils.checkNameInt;
        return {
            type: true, // true ——创建客服人员，false ——编辑客服人员
            curUserId: "", // 通过客服人员名单点击进来时，获取被点击人员的userId
            // perminssionSel: false, // 控制权限部分分组显示隐藏
            serviceCeiling: 10,
            oldForm: null, // 用于修改密码
            form: {
                // 表单数据
                username: "",
                actualName: "",
                password: "",
                serviceCeiling: 10,
                deptId: "",
                deptName: "",
                role: "",
                // roleId: "",
                roleName: ""
            },
            deptList: null, // 该角色可以分配的部门列表
            roleList: null, // 该角色可以分配的角色列表
            rules: {
                username: [
                    {
                        required: true,
                        message: "请输入账号",
                        trigger: ["blur", "change"]
                    },
                    {
                        validator: checkInt,
                        trigger: ["blur", "change"]
                    }
                ],
                actualName: [
                    {
                        required: true,
                        message: "请输入真实姓名",
                        trigger: ["blur", "change"]
                    },
                    {
                        validator: checkNameInt,
                        trigger: ["blur", "change"]
                    }
                ],
                deptId: {
                    required: true,
                    message: "请选择分组",
                    trigger: ["blur", "change"]
                },
                role: {
                    required: true,
                    message: "请选择角色",
                    trigger: ["blur", "change"]
                }
                // actualName: {
                //     required: true,
                //     message: "请输入真实姓名",
                //     trigger: ["blur", "change"]
                // },
            },
            num: {
                min: 0,
                max: 50
            }
        };
    },
    created() {
        this.type = this.$route.name === "createAgent";
        if (!this.type) {
            // 如果是修改客服帐号
            this.curUserId = this.$route.query.id;
            this.getUserById(this.curUserId);
        } else {
            // 如果是创建客服帐号
            this.getPassWord(10);
        }
        this.getRoleDept();
    },
    methods: {
        /**
         * 获取客服帐号信息
         */
        getUserById(id) {
            getUserById(id).then(res => {
                if (res.data.data) {
                    let data = res.data.data;
                    delete data.password;
                    // 把角色id取出来
                    data.role = data.roleList[0].roleId;
                    data.roleName = data.roleList[0].roleName;
                    this.serviceCeiling = data.serviceCeiling;
                    this.oldForm = data
                    this.form = Object.assign({}, this.oldForm)
                }
            });
        },
        /**
         * 删除客服帐号信息
         */
        delUserById(id) {
            this.$confirm("此操作将永久删除该客服人员, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    delUser(id).then(res => {
                        if (res.data.data) {
                            this.$message1({
                                message: "操作成功",
                                type: "success"
                            });
                            this.$router.back();
                        }
                    });
                })
                .catch(() => {
                    this.$message1({
                        type: "info",
                        message: "已取消该操作"
                    });
                });
        },
        /**
         *生成随即10位密码（明码展示）
         */
        getPassWord(size) {
            this.form.password = this.$ak.Utils.generateMixed(size);
        },
        /**
         * 复制密码
         */
        copyPassword(password) {
            let oInput = document.createElement("input");
            oInput.value = password;
            document.body.appendChild(oInput);
            oInput.select();
            if (document.execCommand) {
                document.execCommand("copy");
                document.body.removeChild(oInput);
                this.$message1({
                    message: "复制成功",
                    type: "success"
                });
            } else {
                this.$message1({
                    message: "该浏览器不支持自动复制，请手动复制",
                    type: "warning"
                });
            }
        },
        /**
         * 获取该角色可分配的部门和角色
         */
        getRoleDept() {
            getRoleDept().then(res => {
                if (res.data.code === 0) {
                    let data = res.data.data;
                    this.deptList = data.deptList;
                    this.roleList = data.roleList;
                }
            });
        },
        /**
         * 保存
         */
        onSubmit(param) {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (typeof param.role !== "object") {
                        let arr = [];
                        arr.push(param.role);
                        param.role = arr;
                    }
                    if (this.type) {
                        createUser(param).then(res => {
                            if (res.data.data) {
                                this.$message1({
                                    message: "添加成功",
                                    type: "success"
                                });
                                // 聊天通道需求
                                this.$router.back();
                            }
                        });
                    } else {
                        updateUser(param).then(async res => {
                            if (res.data.data) {
                                this.$message1({
                                    message: "修改成功",
                                    type: "success"
                                });
                                let userId = this.$store.imServerStore.state
                                    .userInfo.userId;
                                if (
                                    param.serviceCeiling !==
                                        this.serviceCeiling &&
                                    this.curUserId === userId
                                ) {
                                    await this.$store.imServerStore.dispatch('logout')
                                    this.$router.push("/login");
                                } else {
                                    // console.log(this.$router)
                                    this.$router.back();
                                }
                            }
                        });
                    }
                } else {
                    return false;
                }
            });
        },
        /**
         * 取消
         */
        cancle() {
            this.$router.back();
        }
    },
    watch: {
        form: {
            handler(val) {
                console.log(val)
            },
            deep: true
        }
    }
};
</script>

<style lang="less" scoped>
.createAgent {
    width: 700px;
    header {
        background-color: #fff;
        font-size: 14px;
        line-height: 28px;
        border-bottom: 1px solid #f5f5f5;
        padding-bottom: 20px;
        padding: 20px 30px;
        > div {
            color: #969faa;
            span {
                color: #000;
            }
            &.edit {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
            }
        }
    }
    article {
        background-color: #fff;
        padding: 20px 0;
        font-size: 13px;
        padding: 20px 30px;
        span.name {
            background: #f2f3f5;
            border-radius: 4px;
            padding: 2px 8px;
        }
        span.password {
            color: #009de7;
        }
        .permissionBtnGroup {
            display: flex;
            justify-content: flex-start;
            > button {
                margin-right: 20px;
            }
        }
        .permissionParts {
            background-color: #f6f7f9;
            width: 100%;
            min-height: 10px;
            border: 1px solid #ddd;
        }
    }
    div.del {
        background-color: #fff;
        margin-top: 20px;
        font-size: 14px;
        padding: 20px 30px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        line-height: 26px;
        h1 {
            color: #f56c6c;
        }
    }
}
.copy {
    cursor: pointer;
    margin-left: 10px;
    &:hover {
        color: #009de7;
    }
}
.checkBtn {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
}
</style>
