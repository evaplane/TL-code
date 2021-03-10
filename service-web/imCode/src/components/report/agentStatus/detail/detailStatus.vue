<!--  -->
<template>
    <div class='detailStatus'>
        <section class="header">
            <img
                src="http://iph.href.lu/32x32"
                alt="头像"
            >
            <span class="tip1">超级管理员</span>
            <span class="tip2">的在线状态详情</span>
            <el-select
                v-model="value"
                placeholder="请选择"
                size="small"
            >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-button
                type="primary"
                size="small"
            >查询</el-button>
        </section>
        <section class="detailStatus-data">
            <el-table
                :data="tableData"
                :stripe="true"
                :header-row-style="{height:'40px'}"
                :header-cell-style="{background: '#fbfbfc'}"
                :row-style="{height:'40px'}"
                style="width: 100%"
                @row-click="handClick"
            >
                <el-table-column
                    label="日期"
                    prop="jobNum"
                >
                </el-table-column>
                <el-table-column
                    label="时间"
                    prop="group"
                >
                </el-table-column>
                <el-table-column
                    label="状态"
                    prop="customer"
                >
                </el-table-column>
                <el-table-column
                    label="持续时长"
                    prop="loginTime"
                >
                </el-table-column>
                <el-table-column
                    label="客户端"
                    prop="onlineTime"
                >
                </el-table-column>
                <el-table-column
                    label="IP"
                    prop="invisibleTime"
                >
                </el-table-column>
                <el-table-column
                    label="备注"
                    prop="desc"
                >
                </el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            options: [
                {
                    value: "0",
                    label: "全部状态"
                },
                {
                    value: "1",
                    label: "登录(在线)"
                },
                {
                    value: "2",
                    label: "隐身"
                },
                {
                    value: "3",
                    label: "离线"
                },
            ],
            value: "0",
            tableData: [
                {
                    jobNum: "09/27",
                    group: "09:10:14",
                    customer: "离线",
                    loginTime: "1秒",
                    onlineTime: "网页客户端",
                    invisibleTime: "113.104.227.221(广东深圳)",
                    desc: ""
                },
                {
                    jobNum: "09/27",
                    group: "09:10:14",
                    customer: "离线",
                    loginTime: "15小时30分52秒",
                    onlineTime: "网页客户端",
                    invisibleTime: "113.104.227.221(广东深圳)",
                    desc: ""
                },
                {
                    jobNum: "09/27",
                    group: "09:10:14",
                    customer: "离线",
                    loginTime: "15小时30分52秒",
                    onlineTime: "网页客户端",
                    invisibleTime: "113.104.227.221(广东深圳)",
                    desc: ""
                },
                {
                    jobNum: "09/27",
                    group: "09:10:14",
                    customer: "离线",
                    loginTime: "15小时30分52秒",
                    onlineTime: "网页客户端",
                    invisibleTime: "113.104.227.221(广东深圳)",
                    desc: ""
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
.detailStatus {
    .header {
        margin-bottom: 20px;
        color: #5a6978;
        width: auto;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        img {
            border-radius: 50%;
            vertical-align:middle;
        }
        .tip1 {
            padding: 0 5px;
        }
        .tip2 {
            padding-right: 15px;
        }
    }
    /deep/ .detailStatus-data {
        box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.1);
        .el-table__body {
            .el-table__row {
                height: 40px;
                td {
                    padding: 0px;
                }
            }
        }
    }
}
</style>