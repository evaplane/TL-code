<template>
    <!-- 顾客信息 -->
    <div class="customerInfo">
        <!-- header -->
        <div class="header layout">
            <!-- 菜单栏 -->
            <div class="title">
                <div>接入信息管理</div>
            </div>
            <p>组长账户根据服务的业务线设置顾客显示信息字段</p>
            <div class="groupAttenconfig">
                <el-button type="primary" icon="el-icon-folder-add" @click="handleGroup(1)">添加页签</el-button>
            </div>
        </div>
        <!-- 页签展示 -->
        <div class="main layout" v-loading="loading">
            <p v-if="!fastReplyGroupConfigs.length">暂无页签信息</p>
            <el-collapse :accordion="false" v-else>
                <el-collapse-item v-for="(temp,i) in fastReplyGroupConfigs" :key="i" :name="i">
                    <!-- 页签 -->
                    <template slot="title">
                        <el-row :gutter="20" class="header-icon">
                            <el-col :span="16">
                                <div class="grid-content bg-purple" :title="temp.tabId+'-'+temp.tabName">
                                    <i class="el-icon-folder"></i>
                                    <span class="idName">{{temp.tabId+'-'+temp.tabName}}</span>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="menu-bar">
                                    <i
                                        class="el-icon-document-add"
                                        @click.stop="replySet(1, i)"
                                    >添加页签字段</i>
                                    <i class="el-icon-edit" @click.stop="handleGroup(0, temp)">编辑</i>
                                    <i class="el-icon-delete" @click.stop="delItem(temp.id)">删除</i>
                                </div>
                            </el-col>
                        </el-row>
                    </template>
                    <!-- 分组下的回复 -->
                    <div class="replyItem">
                        <p v-if="!temp.tabFieldList.length">
                            当前暂无页签字段，可以选择
                            <span
                                @click="delItem(temp.id)"
                                style="color:red;cursor:pointer;"
                            >删除页签</span>
                        </p>
                        <div v-else>
                            <el-row
                                :gutter="20"
                                v-for="(tmp, index) in temp.tabFieldList"
                                :key="index"
                            >
                                <el-col :span="18">
                                    <div class="subTitle" :title="tmp.fieldId+'-'+tmp.fieldName">{{tmp.fieldId+'-'+tmp.fieldName}}</div>
                                </el-col>
                                <el-col :span="6" class="menu-bar">
                                    <i class="el-icon-edit" @click="replySet(0, index, tmp, temp.id)">编辑 </i>
                                    <i class="el-icon-delete" @click="replyDel(tmp.id)">删除</i>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>

        <!-- 增、改分组弹窗 -->
        <el-dialog
            :title="handleGroupType === 1 ? '添加页签' : '编辑页签'"
            :visible.sync="createItem"
            width="500px"
            :modal-append-to-body="false"
			:close-on-click-modal="false"
            @keyup.enter.native="saveGroup(handleGroupType)"
        >
            <el-form :model="ruleForm" :rules="ruleFormRules" ref="ruleForm" label-width="140px">
                <el-form-item label="页签ID" prop="tabId">
                    <el-input
						class="showWord"
                        v-model.trim="ruleForm.tabId"
                        placeholder="请输入页签ID"
                        size="small"
                        maxlength="30"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="页签名称" prop="tabName">
                    <el-input
						class="showWord"
                        v-model.trim="ruleForm.tabName"
                        placeholder="请输入页签名称"
                        size="small"
                        maxlength="30"
                        show-word-limit
                    ></el-input>
                </el-form-item>
				<el-form-item label="页签数据请求地址" prop="requestUrl">
                    <el-input
						class="showWord"
                        v-model.trim="ruleForm.requestUrl"
                        placeholder="请输入页签数据请求地址"
                        size="small"
                        maxlength="255"
						show-word-limit
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="createItem = false">取 消</el-button>
                <el-button type="primary" @click="saveGroup(handleGroupType)">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 增、改页签内显示字段 弹窗 -->
        <el-dialog
            title="编辑页签内显示字段"
            :visible.sync="replySetDia"
            width="700px"
            :modal-append-to-body="false"
            :close-on-click-modal="false"
            @keyup.enter.native="replySave(handleReplyType)"
        >
            <el-form ref="form" :model="form" label-width="100px" :rules="rules" v-if="replySetDia">
                <el-form-item label="字段ID" prop="fieldId">
                    <el-input
						class="showWord"
                        v-model.trim="form.fieldId"
                        placeholder="请输入字段ID"
                        size="small"
                        maxlength="30"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="字段名称" prop="fieldName">
                    <el-input
						class="showWord"
                        v-model.trim="form.fieldName"
                        placeholder="请输入字段名称"
                        size="small"
                        maxlength="30"
                        show-word-limit
                    ></el-input>
                </el-form-item>
                <el-form-item label="字段排序" prop="fieldSort">
                    <el-select v-model="form.fieldSort" placeholder="请选择">
                        <el-option
                            v-for="item in sortLists"
                            :key="item.value"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字段格式化" prop="fieldFormat">
                    <el-switch v-model="form.fieldFormat"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="replySetDia = false">取 消</el-button>
                <el-button type="primary" @click="replySave(handleReplyType)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {} from "@/common/api";

export default {
    data() {
        var validateId = (rule, value, callback) => {
            var reg = /^[A-Za-z0-9]+$/;
            if (value === '') {
                callback(new Error('请输入ID'));
            } else if (!reg.test(value)) {
                callback(new Error('只能输入英文和数字'))
            } else {
                callback();
            }
        };
        var validateName = (rule, value, callback) => {
            var reg = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;
            if (value === '') {
                callback(new Error('请输入名称'));
            } else if (!reg.test(value)) {
                callback(new Error('只能输入中文、英文和数字'))
            } else {
                callback();
            }
        };
        var validateUrl = (rule, value, callback) => {
			var reg = /[\ud800-\udbff][\udc00-\udfff]/g;
            if (value === '') {
                callback(new Error('请输入地址'));
            } else if (reg.test(value)) {
                callback(new Error('地址格式不正确'))
            } else {
                callback();
            }
        };
        return {
            header: "", // 导入时传入的header
            handleGroupType: 1, // 操作页签的类型（1——创建；0——编辑）
            loading: false, // 控制页签展示界面在数据回复之前呈加载状态
            sortLists: [],  // 排序下拉框 选项
            fastReplyGroupConfigs: [], // 页签数据
            createItem: false, // 增改页签弹窗的开关
            ruleForm: {
                tabId: '',
				tabName: '',
				requestUrl: ''
            },
            ruleFormRules: {
                tabId: [
                    { required: true, message: '请输入ID', trigger: ['blur','change'] },
                    { validator: validateId, trigger: ['blur','change'] }
                ],
                tabName: [
                    { required: true, message: '请输入名称', trigger: ['blur','change'] },
                    { validator: validateName, trigger: ['blur','change'] }
				],
				requestUrl: [
                    { required: true, message: '请输入地址', trigger: ['blur','change'] },
                    { validator: validateUrl, trigger: ['blur','change'] }
				]
            },
            form: {
                fieldId: '',
                fieldName: '',
                fieldSort: '',
                fieldFormat: false
            },
            rules: {
                fieldId: [
                    { required: true, message: '请输入ID', trigger: ['blur','change'] },
                    { validator: validateId, trigger: ['blur','change'] }
                ],
                fieldName: [
                    { required: true, message: '请输入名称', trigger: ['blur','change'] },
                    { validator: validateName, trigger: ['blur','change'] }
                ],
                fieldSort: [
                    { required: true, message: '请选择排序', trigger: ['blur','change'] }
                ]
            },
            replySetDia: false, // 增改 页签内显示字段 弹窗的开关
        };
    },
    methods: {
        /**
         * 获取已配置页签
         */
        getCustomerTabLists() {
            this.$axios.get(this.$httpServer.getCustomerTab).then(res => {
                if(res.data.data){
                    this.fastReplyGroupConfigs = res.data.data;
                }else{
                    this.fastReplyGroupConfigs = [];
                }
            })
        },
        /**
         * 根据页签id获取字段列表
         */
        handleView(obj) {
            let params = {
                tabId: obj.id
            }
            this.$axios.get(this.$httpServer.getCustomerTabField,{params}).then(res => {
                if(res.data.data){
                    obj.children = res.data.data;
                }else{
                    obj.children = [];
                }
                let arr = this.fastReplyGroupConfigs.concat();
                this.fastReplyGroupConfigs = [];
                this.fastReplyGroupConfigs = arr;
            })
        },
        /**
         * 创建分组、重命名分组弹窗开启
         */
        handleGroup(type, obj) {
            if (type) {
                this.ruleForm.tabId = "";
				this.ruleForm.tabName = "";
				this.ruleForm.requestUrl = "";
            } else {
                this.ruleForm.tabId = obj.tabId;
                this.ruleForm.tabName = obj.tabName;
				this.ruleForm.id = obj.id;
				this.ruleForm.requestUrl = obj.requestUrl;
            }
            this.createItem = true;
			this.handleGroupType = type;
			this.$nextTick(()=>{
				this.$refs['ruleForm'].clearValidate();
			})
        },
        /**
         * 保存分组
         */
        saveGroup(type) {
            let obj;
            let that = this;
            this.$refs['ruleForm'].validate((valid) => {
                if(valid){
                    if (type) {
                        // 创建分组
                        let params = {
                            tabId: that.ruleForm.tabId,
							tabName: that.ruleForm.tabName,
							requestUrl: that.ruleForm.requestUrl
                        }
                        that.$axios.post(that.$httpServer.getCustomerTab,params).then(res => {
                            if(res.data.data){
                                that.$message1({
                                    message: res.data.msg,
                                    type: 'success'
                                })
                                that.createItem = false;
                                that.getCustomerTabLists();
                            }else{
                                that.$message1({
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                    } else {
                        // 重命名分组
                        let params = {
                            tabId: that.ruleForm.tabId,
                            tabName: that.ruleForm.tabName,
							id: that.ruleForm.id,
							requestUrl: that.ruleForm.requestUrl
                        }
                        that.$axios.put(that.$httpServer.getCustomerTab,params).then(res => {
                            if(res.data.data){
                                that.$message1({
                                    message: res.data.msg,
                                    type: 'success'
                                })
                                that.createItem = false;
                                that.getCustomerTabLists();
                            }else{
                                that.$message1({
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        })
                    }
                }
            })
        },
        /**
         * 删除分组
         */
        delItem(id) {
            this.$confirm("此操作将永久删除该页签, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$axios.delete(this.$httpServer.getCustomerTab+'/'+id).then(res => {
                    if(res.data.code == 0){
                        this.$message1({
                            message: "操作成功",
                            type: 'success'
                        })
                        this.getCustomerTabLists();
                    }else{
                        this.$message1({
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            }).catch(() => {
                this.$message1({
                    type: "info",
                    message: "已取消该操作"
                });
            });
        },
        /**
         * 新增、编辑 页签内显示字段
         */
        replySet(type, index, data, tabId) {
            if (type) {
                let id = this.fastReplyGroupConfigs[index].id;
                // 添加字段
                this.form = Object.assign(
                    {},
                    {
                        fieldId: '',
                        fieldName: '',
                        fieldSort: '',
                        fieldFormat: false,
                        tabId: id
                    }
                );
            } else {
                data.tabId = tabId;
                this.form = Object.assign({}, data);
            }
            this.handleReplyType = type;
			this.replySetDia = true;
			this.$nextTick(()=>{
				this.$refs['form'].clearValidate();
			})
        },
        replySave(type) {
            let that = this;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let way = type ? 'post' : 'put';
                    that.$axios[way](that.$httpServer.getCustomerTabField,that.form).then(res => {
                        if(res.data.data){
                            that.$message1({
                                message: res.data.msg,
                                type: 'success'
                            })
                            that.replySetDia = false;
                            that.getCustomerTabLists();
                        }else{
                            that.$message1({
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                    })
                }
            });
        },
        /**
         * 删除快捷回复
         */
        replyDel(id) {
            this.$confirm("此操作将永久删除该字段, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$axios.delete(this.$httpServer.getCustomerTabField+'/'+id).then(res => {
                    if(res.data.code == 0){
                        this.$message1({
                            message: "操作成功",
                            type: 'success'
                        })
                        this.getCustomerTabLists();
                    }else{
                        this.$message1({
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                })
            }).catch(() => {
                this.$message1({
                    type: "info",
                    message: "已取消该操作"
                });
            });
        }
    },
    created() {
        for(var i=1;i<21;i++){
            this.sortLists.push({
                value: i
            });
        }
        let obj = {
            Authorization: "Bearer " + sessionStorage.getItem("token")
        };
        this.header = obj;
        this.getCustomerTabLists();
    }
};
</script>

<style lang="less" scoped>
.customerInfo {
    width: 710px;
    a,
    span {
        font-size: 14px;
    }
    > div.layout {
        width: 100%;
        background: #fff;
        padding: 20px 30px;
        margin-bottom: 30px;
        &.header {
            > .title {
                margin-bottom: 10px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                > div {
                    height: 40px;
                    vertical-align: middle;
                    line-height: 40px;
                    // display: inline-block;
                    // margin-right: 20px;
                    &:first-child {
                        font-size: 16px;
                    }
                    span,
                    a {
                        cursor: pointer;
                        color: #409eff;
                    }
                }
                .subtn {
                    vertical-align: middle;
                }
            }
            > p {
                color: #969faa;
                margin-bottom: 10px;
            }
            > div.groupAttenconfig {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                > span {
                    color: #409eff;
                }
            }
        }
        &.main {
            font-size: 14px;
            min-height: 400px;
            > p {
                color: #969faa;
                width: 100%;
                text-align: center;
            }
        }
	}
}
.header-icon {
    width: 100%;
    i {
        color: #409eff;
        margin-right: 10px;
    }
    div.menu-bar {
        display: none;
    }
    &:hover .menu-bar {
        display: block;
    }
    .el-col {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
	}
	.idName{
		display: inline-block;
		width: 400px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		vertical-align: middle;
	}
}
.replyItem {
    color: #858e99;
    background: #fff;
    > div {
        line-height: 40px;
        padding-left: 40px;
        .subTitle {
            width: 300px;
            vertical-align: middle;
            color: #5a6978;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        p {
            vertical-align: middle;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .menu-bar {
            color: #409eff;
            display: none;
            i {
                cursor: pointer;
                margin-left: 10px;
            }
        }
        .el-row:hover {
            background: rgba(0, 159, 233, 0.04);
        }
        .el-row:hover .menu-bar {
            display: block;
        }
    }
}
.title-icon {
    i {
        color: #409eff;
        margin-right: 10px;
    }
}
.attention {
    width: 500px;
    margin-bottom: 29px;
}
</style>
<style lang="less">
// 解决下拉按钮在ie内核浏览器下的不平整问题
.el-dropdown .el-button-group .el-button {
    vertical-align: middle;
}
</style>
