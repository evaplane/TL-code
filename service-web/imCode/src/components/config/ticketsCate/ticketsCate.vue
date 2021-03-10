<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-14 11:09:58
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-15 17:27:02
 -->

<template>
    <div class="main">
        <div class="main-conter">
            <div class="main-block">
                <div class="main-blockInner">
                    <h3>工单分类管理</h3>
                    <p class="main-sub">管理工单类型，如退换货,故障保修等,创建工单时工单分类可触发,自动规则,分类可支持三级,分类文件夹可以包含子文件夹</p>
                    <div>
                        <button
                            class="main-btn"
                            @click="addCate(0)"
                        >
                            <i class="el-icon-plus"></i>
                            新建分类
                        </button>
                        <button
                            class="main-btn"
                            @click="addFolder(0)"
                        >
                            <i class="el-icon-folder-add"></i>
                            新建文件夹
                        </button>
                    </div>
                </div>
            </div>
            <div class="main-block">
                <el-tree
                    :data="allSubCatList"
                    node-key="id"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                >
                    <span
                        class="custom-tree-node"
                        slot-scope="{ node, data }"
                    >
                        <span v-if="data.isFolder == 0">
                            <i class="el-icon-document"></i>
                            <span>{{ node.label }}</span>
                        </span>
                        <span v-else>
                            <i class="el-icon-folder-opened"></i>
                            <span>{{ node.label }}</span>
                        </span>
                        <span
                            class="edit"
                            ref="edit"
                        >
                            <!-- isFolder 0: 文件 1:文件夹 -->
                            <span v-if="data.isFolder == 0">
                                <el-button
                                    type="text"
                                    size="mini"
                                    @click="() => rename(data)"
                                >
                                    <i class="el-icon-edit-outline"></i> 重命名
                                </el-button>
                                <el-button
                                    type="text"
                                    size="mini"
                                    @click="() => removeById(node, data)"
                                >
                                    <i class="el-icon-delete"></i>删除
                                </el-button>
                            </span>
                            <span v-else>
                                <span v-show="node.level == 1 && data.subcat.length > 0">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => addCate(0,data)"
                                    >
                                        <i class="el-icon-plus"></i>新建分类
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => addFolder(0,data)"
                                    >
                                        <i class="el-icon-folder-add"></i> 新建文件夹
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => rename(data)"
                                    >
                                        <i class="el-icon-edit-outline"></i>重命名
                                    </el-button>
                                </span>
                                <span v-show="node.level == 1 && data.subcat.length == 0">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => addCate(0,data)"
                                    >
                                        <i class="el-icon-plus"></i>新建分类
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => addFolder(0,data)"
                                    >
                                        <i class="el-icon-folder-add"></i>新建文件夹
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => rename(data)"
                                    >
                                        <i class="el-icon-edit-outline"></i>重命名
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => removeById(node, data)"
                                    >
                                        <i class="el-icon-delete"></i>删除
                                    </el-button>
                                </span>
                                <span v-show="node.level == 2 && data.subcat.length > 0">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => addCate(0,data)"
                                    >
                                        <i class="el-icon-plus"></i>新建分类
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => rename(data)"
                                    >
                                        <i class="el-icon-edit-outline"></i>重命名
                                    </el-button>
                                </span>
                                <span v-show="node.level == 2 && data.subcat.length == 0">
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => addCate(0,data)"
                                    >
                                        <i class="el-icon-plus"></i>新建分类
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => rename(data)"
                                    >
                                        <i class="el-icon-edit-outline"></i>重命名
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click="() => removeById(node, data)"
                                    >
                                        <i class="el-icon-delete"></i>删除
                                    </el-button>
                                </span>
                            </span>
                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <!-- 弹窗 新建分类 -->
        <el-dialog
            :title="type==0?'新建分类':'修改分类名称'"
            :visible.sync="cateItem"
            width="400px"
            :modal-append-to-body="false"
            @close='cancelCate'
        >
            <el-form
                :model="addClassConfig"
                :rules="rules"
                ref="form1"
            >
                <el-form-item prop="className">
                    <el-input
                        v-model="addClassConfig.className"
                        placeholder="请输入分类名称"
                        size="small"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="cancelCate()">取 消</el-button>
                <el-button
                    v-show="type==0"
                    type="primary"
                    @click="saveCate('form1')"
                >确 定</el-button>
                <el-button
                    v-show="type==1"
                    type="primary"
                    @click="updateFolder('form1',addClassConfig.id)"
                >修 改</el-button>
            </span>
        </el-dialog>

        <!-- 弹窗 新建分类 -->
        <el-dialog
            :title="type==0?'新建文件夹':'修改文件夹名称'"
            :visible.sync="folderItem"
            width="400px"
            :modal-append-to-body="false"
            @close='cancelFolder'
        >
            <el-form
                :model="addClassConfig"
                :rules="rules"
                ref="form"
            >
                <el-form-item prop="className">
                    <el-input
                        v-model="addClassConfig.className"
                        placeholder="请输入文件夹名称"
                        size="small"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="cancelFolder()">取 消</el-button>
                <el-button
                    v-show="type==0"
                    type="primary"
                    @click="saveFolder('form')"
                >确 定</el-button>
                <el-button
                    v-show="type==1"
                    type="primary"
                    @click="updateFolder('form',addClassConfig.id)"
                >修 改</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            type: 0, //0新增,1修改
            allSubCatList: [], //分类集合
            defaultProps: {
                children: "subcat",
                label: "className"
            }, //映射字段
            cateItem: false, //新增分类的弹窗
            folderItem: false, //新增文件夹的弹窗
            addClassConfig: {
                id: "",
                className: "",
                isFolder: 0,
                parentId: -1,
                parentName: ""
            },
            rules: {
                className: [
                    {
                        required: true,
                        message: "请输入名称（1~20字符）",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ]
            }
        };
    },

    methods: {
        cancelCate() {
            this.cateItem = false;
            this.$nextTick(() => {
                this.$refs["form1"].clearValidate();
            });
        },
        cancelFolder() {
            this.folderItem = false;
            this.$nextTick(() => {
                this.$refs["form"].clearValidate();
            });
        },
        // 新增分类
        addCate(type, data) {
            this.addClassConfig.parentId = -1;
            if (data) {
                this.addClassConfig.parentId = data.id;
            }
            this.addClassConfig.className = "";
            this.type = 0;
            this.cateItem = true;
        },
        // 新增文件夹
        addFolder(type, data) {
            this.addClassConfig.parentId = -1;
            if (data) {
                this.addClassConfig.parentId = data.id;
            }
            this.addClassConfig.className = "";
            this.type = 0;
            this.folderItem = true;
        },
        // 新建分类
        saveCate(form) {
            let that = this;
            let params = {
                className: that.addClassConfig.className,
                isFolder: 0,
                parentId: that.addClassConfig.parentId
            };
            this.$refs[form].validate(valid => {
                if (valid) {
                    that.$axios
                        .post(that.$httpServer.saveClassConfig, params)
                        .then(res => {
                            if (res && res.data.code == "0") {
                                that.getAllSubCatList();
                                that.addClassConfig.className = "";
                                that.cateItem = false;
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        // 新建文件夹
        saveFolder(form) {
            let that = this;
            let params = {
                className: that.addClassConfig.className,
                isFolder: 1,
                parentId: that.addClassConfig.parentId
            };
            this.$refs[form].validate(valid => {
                if (valid) {
                    that.$axios
                        .post(that.$httpServer.saveClassConfig, params)
                        .then(res => {
                            if (res && res.data.code == "0") {
                                that.getAllSubCatList();
                                that.addClassConfig.className = "";
                                that.folderItem = false;
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        // 重命名分类,文件夹名
        rename(data) {
            this.type = 1;
            this.addClassConfig.className = data.className;
            this.addClassConfig.id = data.id;
            this.cateItem = true;
        },
        // 修改分类,文件夹名
        updateFolder(form, id) {
            let that = this;
            let params = {
                id: id,
                className: this.addClassConfig.className
            };
            console.log(this.$refs[form]);
            this.$refs[form].validate(valid => {
                if (valid) {
                    that.$axios
                        .put(that.$httpServer.updateClassConfig, params)
                        .then(res => {
                            if (res && res.data.code == "0") {
                                that.$message({
                                    type: "success",
                                    message: "修改成功",
                                    showClose: true
                                });
                                that.addClassConfig.className = "";
                                that.folderItem = false;
                                that.cateItem = false;
                                that.getAllSubCatList();
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        // 删除分类,文件夹名
        removeById(node, data) {
            let that = this;
            this.$axios
                .delete(this.$httpServer.delClassConfig + "/" + data.id)
                .then(res => {
                    if (res && res.data.code == "0") {
                        this.$message({
                            type: "success",
                            message: "删除成功",
                            showClose: true
                        });
                        that.getAllSubCatList();
                    }
                });
        },
        handleNodeClick(val) {},
        // 获取工单分类列表
        getAllSubCatList() {
            this.$axios.get(this.$httpServer.getAllSubCatList, {}).then(res => {
                if (res && res.data.code == "0") {
                    this.allSubCatList = res.data.data;
                }
            });
        }
    },
    mounted() {
        this.getAllSubCatList();
    }
};
</script>
<style lang="less" scoped>
.main {
    .main-conter {
        width: 680px;
        /deep/ .main-block {
            height: 100%;
            margin-bottom: 20px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(52, 63, 75, 0.1);
            .el-tree-node {
                box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
                .el-tree-node__content {
                    position: relative;
                    height: 50px;
                    line-height: 50px;
                    font-size: 14px;
                    .custom-tree-node {
                        .edit {
                            position: absolute;
                            padding-right: 30px;
                            right: 0;
                            top: 0;
                            display: none;
                        }
                    }
                    &:hover,
                    &:active,
                    &:link,
                    &:visited {
                        .custom-tree-node {
                            .edit {
                                display: block;
                            }
                        }
                    }
                }
            }
        }
        .main-blockInner {
            padding: 20px 30px;
            display: block;
            h3 {
                display: -ms-flexbox;
                display: flex;
                -ms-flex-align: center;
                align-items: center;
                font-size: 14px;
                color: #323c42;
                font-weight: 400;
                margin-top: 0;
                margin-bottom: 13px;
            }
            .main-sub {
                font-size: 14px;
                line-height: 20px;
                color: #969faa;
                margin-top: 0;
                margin-bottom: 15px;
            }
            .main-btn {
                display: inline-block;
                position: relative;
                padding: 7px 21px;
                margin-bottom: 0;
                font-size: 13px;
                font-weight: 400;
                line-height: 1.385;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                -ms-touch-action: manipulation;
                touch-action: manipulation;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                background-image: none;
                border: none;
                border-radius: 4px;
                color: #fff;
                background-color: #009de7;
            }
        }
    }
}
</style>