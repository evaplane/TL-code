<template>
    <!-- 客服与分组模块 -->
    <div class="serviceGrouping">
        <!-- 分组栏——包含详细的分组信息 -->
        <div class="main">
            <!-- 分组展示和操作 -->
            <section class="groupLeft">
                <h1
                    class="groupIcon"
                    @click="openDialog('add')"
                    v-if="Permission('sys_dept_add')"
                >新增分组</h1>
                <div class="block">
                    <el-tree
                        :data="deptData"
                        :props="defaultProps"
                        @node-click="deptClick"
                        node-key="deptId"
                        default-expand-all
                        ref="deptTree"
                    >
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                            <span>
                                <span class="text_span">{{ node.label }}</span>
                                <label>({{data.total}})</label>
                            </span>
                            <span v-if="!data.vnode" class="icon_span">
                                <!-- <i
                                    class="el-icon-circle-plus-outline"
                                    @click="openDialog('add', node, data)"
                                ></i>-->
                                <i
                                    class="el-icon-edit-outline"
                                    @click="openDialog('edit', node, data)"
                                    v-if="Permission('sys_dept_edit')"
                                ></i>
                                <i
                                    class="el-icon-delete"
                                    @click="delNode(node, data)"
                                    v-if="!data.total && Permission('sys_dept_del')"
                                ></i>
                            </span>
                        </span>
                    </el-tree>
                </div>
            </section>
            <!-- 分组成员信息表格 -->
            <section class="groupRight">
                <div class="groupIcon">
                    <label v-if="Permission('sys_user_add')">
                        <router-link to="/config/createagent">
                            <span class="el-icon-circle-plus-outline"></span>
                            <span>添加客服账号</span>
                        </router-link>
                    </label>
                    <label style="margin-left: 10px;" @click="exportUserList">
                        <span class="el-icon-download"></span>
                        <span>导出客服列表</span>
                    </label>
                </div>
                <div>
                    <Table :data="tableData" @pagerChange="pagerChange"></Table>
                </div>
            </section>
        </div>
        <!-- 新建分组&分组名称弹窗 -->
        <el-dialog
            :visible.sync="outerVisible"
            :modal-append-to-body="false"
            width="15%"
            class="teamDetailLayout"
        >
            <div slot="title" class="dialogHeader">
                <h1>{{type==='add' ? '添加分组':'修改分组名称'}}</h1>
            </div>
            <section>
                <el-input v-model.trim="groupName" size="small" maxlength="10" show-word-limit></el-input>
            </section>
            <div slot="footer">
                <el-button @click="outerVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit(type, groupName, ...curNode)">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// var s = iconv.decode(content, "gbk");
import Table from "./table";
import {
    getDeptInfo,
    getUser,
    handleDeptInfo,
    roleSet,
    exportUserList,
    getChildrenDeptInfo
} from "../../../common/api";

export default {
    components: {
        Table
    },
    data() {
        return {
            // 弹窗的开关
            outerVisible: false,
            type: 0, // 保存时区分是新建还是修改0: 新增树节点；1：修改树节点
            // 表单数据
            groupName: "",
            // 当前激活的节点(新增节点的父节点信息，编辑的当前节点信息)
            curNode: {
                node: null,
                data: null
            },
            // 树组件的属性设置（勿动）,
            defaultProps: {
                children: "children",
                label: "name"
            },
            // 组名数据,
            deptData: [],
            // 表格数据
            tableData: {},
            // 表格默认pageSzie
            size: 10
        };
    },
    methods: {
        /**
         * 获取团队tree数据
         */
        async getDept() {
            await getChildrenDeptInfo().then(res => {
                if (res.data && res.data.code == 0) {
                    // 返回的数组结构不包括[全部]节点，会导致客户选择了子节点后，无法回去查看全部人员名单，故添加一个虚拟节点——全部
                    let data = res.data.data;
                    data[0].vnode = 1;
                    this.deptData = data;
                }
            });
        },
        /**
         * 删除tree 节点
         */
        delNode(node, data) {
            this.$confirm("此操作将永久删除该团队, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    getDeptInfo("delete", data.deptId).then(res => {
                        if (res.data.data) {
                            this.$refs.deptTree.remove(node);
                            this.$message1({
                                message: "操作成功",
                                type: "success"
                            });
                        } else {
                            this.$message1({
                                message: res.data.msg,
                                type: "error"
                            });
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
         * 团队tree节点点击事件
         */
        async deptClick(data, node, tree) {
            this.curNode = { node, data };
            let params = {
                current: 1,
                size: this.size,
                deptId: data.deptId
            };
            await this.getUser(params);
        },
        /**
         * 获取人员
         */
        async getUser(params) {
            await getUser(params).then(res => {
                if (res.data && res.data.code == 0) {
                    let data = res.data.data;
                    // data.records = data.records.reverse();
                    data.records.forEach(element => {
                        let role = [];
                        let roleList = element.roleList;
                        roleList.forEach(temp => {
                            role.push(temp.roleName);
                        });
                        element.role = role.join(",");
                    });
                    this.tableData = data;
                    console.log(this.tableData);
                }
            });
        },
        /**
         * 打开弹窗
         * type: add: 新增树节点；edit：修改树节点
         */
        openDialog(type, node, data) {
            this.type = type;
            this.curNode = { node, data };
            this.groupName = type === "edit" ? data.name : "";
            this.outerVisible = true;
        },
        // 保存(增、改节点)
        submit(type, input, nodeInfo) {
            let { node, data } = nodeInfo;
            let _this = this;
            let obj = {
                add: {
                    method: "post",
                    data() {
                        let arr = _this.deptData;
                        let index = arr.length - 1;
                        let sort = parseInt(arr[index].sort) + 1;
                        return {
                            name: input,
                            parentId: 0,
                            sort,
                            total: 0,
                            description: ""
                        };
                    },
                    success(deptId) {
                        let obj = this.data();
                        obj.deptId = deptId;
                        _this.$refs.deptTree.append(obj, data);
                    }
                },
                edit: {
                    method: "put",
                    data() {
                        let obj = Object.assign({}, data);
                        obj.name = input;
                        return obj;
                    },
                    success() {
                        data.name = input;
                    }
                }
            };
            if (input) {
                handleDeptInfo(obj[type].method, obj[type].data()).then(res => {
                    if (res.data.code == 0) {
                        obj[type].success(res.data.data);
                        this.$message1({
                            message: "操作成功",
                            type: "success"
                        });
                        this.outerVisible = false;
                    } else {
                        this.outerVisible = false;
                    }
                });
            } else {
                this.$message1({
                    message: "分组名称不能为空",
                    type: "error"
                });
            }
        },
        /**
         * 表格分页标签改变后会触发的数据
         */
        async pagerChange(current) {
            let deptId = this.deptData[0].deptId;
            await this.getUser({
                current,
                size: this.size,
                deptId: this.curNode.data ? this.curNode.data.deptId : deptId
            });
            // this.tableData.current = current;
        },
        /**
         * 导出客服人员列表
         */
        exportUserList() {
            let id = this.deptData[0].deptId;
            if (this.curNode.data) {
                id = this.curNode.data.deptId;
            }
            exportUserList(id).then(res => {
                let fileName = decodeURI(
                    res.headers["content-disposition"]
                        .split(";")[1]
                        .split("=")[1]
                );
                let blob = new Blob([res.data], {
                    type: "application/vnd.ms-excel;charset=utf-8"
                });

                if ("download" in document.createElement("a")) {
                    // 非IE下载
                    let elink = document.createElement("a");
                    elink.download = fileName;
                    elink.style.display = "none";
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, fileName);
                }
            });
        }
    },
    async created() {
        await this.getDept();
        this.getUser({
            current: 1,
            size: this.size,
            deptId: this.deptData[0].deptId
        });
    }
};
</script>


<style lang="less" scoped>
@import "../../../common/css/base.less";

.serviceGrouping {
    font-size: 14px;
    line-height: 18px;
    .detail,
    .main {
        display: flex;
        flex-flow: row nowrap;
        margin-bottom: 20px;
        padding: 20px 30px;
        background-color: #fff;
        box-sizing: border-box;
        section {
            &.groupLeft {
                width: 280px;
                max-height: 600px;
                border-right: 1px solid #f5f5f5;
                overflow: auto;
                .block {
                    width: 100%;
                }
                > h1 {
                    text-align: center;
                }
            }
            &.groupRight {
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
            }
            h1 {
                margin-bottom: 5px;
            }
            p {
                font-size: 13px;
                color: #5a6978;
                margin-right: 20px;
                margin-top: 12px;
                > span {
                    // display: inline-block;
                    text-align: center;
                    vertical-align: middle;
                    // width: 1rem;
                    // height: 1rem;
                    border-radius: 3px;
                    background-color: #f2f3f5;
                    margin-left: 15px;
                    padding: 2px 6px;
                }
            }
            .groupIcon {
                cursor: pointer;
                color: #009de7;
                margin-left: 10px;
                > label {
                    cursor: pointer !important;
                }
            }
        }
    }
    .main {
        min-height: 200px;
    }
}

.custom-tree-node {
    max-width: 260px;
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    // font-size: 14px;
    padding-right: 8px;
    .text_span {
        display: inline-block;
        vertical-align: middle;
        max-width: 120px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .icon_span {
        // max-width: 50px;
    }
    label {
        color: #009de7;
    }
    &:hover i {
        display: inline-block;
    }
    i {
        display: none;
        color: #009de7;
    }
}
</style>
