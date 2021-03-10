<!--  -->
<template>
    <div class='agentStatus'>
        <section class="agentStatus-data">
            <el-table
                :data="tableData"
                :stripe="true"
                :header-row-style="{height:'40px'}"
                :header-cell-style="{background: '#fbfbfc'}"
                :row-style="{height:'40px'}"
                style="width: 100%"
                @row-click="handClick"
                :default-sort = "{prop: 'jobNum', order: 'descending'}"
            >
                <el-table-column
                    label="工号"
                    prop="jobNum"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    label="所在分组"
                    prop="group"
                    sortable
                >
                </el-table-column>
                <el-table-column
                    label="客服"
                    prop="customer"
                >
                </el-table-column>
                <el-table-column
                    label="已登录时长"
                    prop="loginTime"
                >
                </el-table-column>
                <el-table-column
                    label="在线时长"
                    prop="onlineTime"
                >
                </el-table-column>
                <el-table-column
                    label="隐身时长"
                    prop="invisibleTime"
                >
                </el-table-column>
            </el-table>
        </section>
    </div>
</template>
<script>
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        return {
            tableData: [
                {
                    jobNum: "001",
                    group: "默认分组",
                    customer: "超级管理员",
                    loginTime: "15小时30分52秒",
                    onlineTime: "-",
                    invisibleTime: "15小时31分2秒"
                },
                {
                    jobNum: "002",
                    group: "默认分组",
                    customer: "超级管理员",
                    loginTime: "15小时30分52秒",
                    onlineTime: "-",
                    invisibleTime: "15小时31分2秒"
                },
                {
                    jobNum: "003",
                    group: "商品组",
                    customer: "超级管理员",
                    loginTime: "15小时30分52秒",
                    onlineTime: "-",
                    invisibleTime: "15小时31分2秒"
                },
                {
                    jobNum: "004",
                    group: "默认分组",
                    customer: "超级管理员",
                    loginTime: "15小时30分52秒",
                    onlineTime: "-",
                    invisibleTime: "15小时31分2秒"
                }
            ]
        };
    },
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        handClick(row) {
            this.$router.push({
                path: `/report/detailStatus`
            });
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.agentStatus {
    /deep/ .agentStatus-data {
        box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.1);
        .el-table__body {
            .el-table__row {
                &:hover {
                    cursor: pointer;
                }
                height: 40px;
                td {
                    padding: 0px;
                }
            }
        }
    }
}
</style>