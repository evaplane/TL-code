<template>
    <!-- 角色设置 -->
    <div class="roleSet">
        <!-- 角色菜单 -->
        <div class="aside">
            <div class="btn" v-if="Permission('sys_role_perm')">
                <el-button type="primary" @click="handleSave">保存</el-button>
            </div>
            <SelectItem :data="roleList" name="roleName" @onClick="roleClick"></SelectItem>
        </div>
        <!-- 权限树 -->
        <div class="main">
            <div class="contain" v-if="checkedRole">
                <el-tree
                    v-if="menuShow"
                    :data="menuTree"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="true"
                    ref="tree"
                    :default-checked-keys="checkeds"
                ></el-tree>
            </div>
        </div>
    </div>
</template>

<script>
import SelectItem from "@/components/common/selectItem/selectItem";
import { getRoleList, getMenuTree, saveRolePermission } from "@/common/api";

export default {
    components: {
        SelectItem
    },
    data() {
        return {
            // 表单数据
            agent: { agentName: "" },
            menuShow: true, // 控制权限树的显示隐藏
            roleList: [], // 角色数据
            menuTree: [], // 权限树数据
            checkeds: [], // 默认勾选的节点————当前角色已拥有的权限节点
            checkedRole: "" // 选中的角色的角色ID
        };
    },
    methods: {
        /**
         * 获取角色列表
         */
        getRoleList() {
            getRoleList().then(res => {
                if (res.data.data.records) {
                    let data = res.data.data.records;
                    this.roleList = data;
                }
            });
        },
        /**
         * 获取权限树，如果不传入角色ID则后台返回树结构的权限树，如果传入ID则返回数组结构的权限IDs
         */
        async getMenuTree(id) {
            let data;
            await getMenuTree(id).then(res => {
                if (res.data.data) {
                    data = res.data.data;
                    if (id) {
                        // let arr = data.filter(item => {
                        //     if
                        // })
                        this.checkeds = data;
                    } else {
                        this.menuTree = data;
                    }
                }
            });
            return data;
        },
        /**
         * 角色点选事件
         */
        async roleClick(i, data) {
            this.checkedRole = data.roleId;
            await this.getMenuTree(data.roleId);
            this.menuShow = false;
            this.$nextTick(() => {
                this.menuShow = true;
            });
        },
        handleSave() {
            this.$confirm("此操作将会刷新本页面, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    let arr = this.$refs.tree.getCheckedKeys();
                    let arr2 = this.$refs.tree.getHalfCheckedKeys();
                    let menuIds = arr.concat(arr2).join(",");
                    let data = {
                        menuIds,
                        roleId: this.checkedRole
                    };
                    saveRolePermission(data).then(res => {
                        if (res.data.data) {
                            this.$message1({
                                message: "修改成功",
                                type: "success"
                            });
                            location.reload();
                        }
                    });
                })
                .catch(() => {
                    this.$message1({
                        type: "info",
                        message: "已取消该操作"
                    });
                    this.menuShow = false
                    this.$nextTick(()=> {
                        this.menuShow = true
                    })
                });
        }
    },
    created() {
        // 初始化数据
        this.getRoleList();
        this.getMenuTree();
    }
};
</script>


<style lang="less" scoped>
@import "../../../common/css/base.less";

@divHeight: 680px;

.roleSet {
    height: 680px;
    font-size: 13px;
    min-height: @divHeight;
    background-color: #fff;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    .aside {
        width: 180px;
        height: @divHeight;
        border-right: 1px solid #f5f5f5;
        padding: 20px 0 20px 10px;
        .btn {
            padding-bottom: 10px;
            border-bottom: 1px solid #f5f5f5;
            > button {
                margin: 0 auto;
            }
        }
    }
    .main {
        width: 100%;
        height: 600px;
        position: relative;
        padding: 20px 10px;
        overflow: auto;
        .submitBtnLayout {
            position: absolute;
            bottom: 100px;
            left: 200px;
        }
    }
}
</style>
