<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-09-27 16:24:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-27 16:24:21
 -->
<!--  -->
<template>
    <div class='visitConversation'>
        <section class="report-counter">
            <div class='new-title'>
                <h3>总计</h3>
            </div>
            <div class="new-report-counter">
                <ul class="">
                    <li>
                        <p class="title">访客数</p>
                        <p class="count">2</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">访问次数</p>
                        <p class="count">2</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">浏览量</p>
                        <p class="count">3</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">对话量</p>
                        <p class="count">1</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">消息数</p>
                        <p class="count">2</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">对话率</p>
                        <p class="count">0.00%</p>
                        <p class="sub"></p>
                    </li>
                </ul>
            </div>
            <div
                id="myChart"
                :style="{width: '100%', height: '400px'}"
            ></div>
        </section>
        <section class="report-data">
            <el-table
                :data="tableData"
                :stripe="true"
                :header-row-style="{height:'40px'}"
                :header-cell-style="{background: '#fbfbfc'}"
                :row-style="{height:'40px'}"
                style="width: 100%"
            >
                <el-table-column
                    label="时间"
                    prop="time"
                >
                </el-table-column>
                <el-table-column
                    label="访客数"
                    prop="visitorsNum"
                >
                </el-table-column>
                <el-table-column
                    label="访问次数"
                    prop="visitNum"
                >
                </el-table-column>
                <el-table-column
                    label="浏览量"
                    prop="browseNum"
                >
                </el-table-column>
                <el-table-column
                    label="对话量"
                    prop="dialogueNum"
                >
                </el-table-column>
                <el-table-column
                    label="对话率"
                    prop="dialogueRate"
                >
                </el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script>
import echarts from "echarts";
export default {
    //import引入的组件需要注入到对象中才能使用
    components: {},
    data() {
        return {
            tableData: [
                {
                    time: "2019年09月27日 0点",
                    visitorsNum: "0",
                    visitNum: "0",
                    browseNum: "0",
                    dialogueNum: "0",
                    dialogueRate: "0"
                },
                {
                    time: "2019年09月27日 0点",
                    visitorsNum: "0",
                    visitNum: "0",
                    browseNum: "0",
                    dialogueNum: "0",
                    dialogueRate: "0"
                },
                {
                    time: "2019年09月27日 0点",
                    visitorsNum: "0",
                    visitNum: "0",
                    browseNum: "0",
                    dialogueNum: "0",
                    dialogueRate: "0"
                },
                {
                    time: "2019年09月27日 0点",
                    visitorsNum: "0",
                    visitNum: "0",
                    browseNum: "0",
                    dialogueNum: "0",
                    dialogueRate: "0"
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
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById("myChart"));
            myChart.setOption({
                title: {
                    text: "浏览-对话趋势",
                    left: "center"
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["访问次数", "对话量", "对话率"],
                    bottom: "5%"
                },
                grid: {
                    left: "2%",
                    right: "4%",
                    bottom: "15%",
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        // 去掉图片下载
                        // saveAsImage: {}
                    }
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: [
                        "08-30",
                        "08-31",
                        "09-01",
                        "09-02",
                        "09-03",
                        "09-04",
                        "09-05",
                    ]
                },
                yAxis: [
                    {
                        type: "value",
                        name: "对话/访问",
                        // nameLocation:'center',
                        nameTextStyle: {
                            color: "#89A54E"
                        },
                        axisLabel: {
                            textStyle: {
                                color: "#89A54E"
                            }
                        },
                        axisLine: {
                            show: false
                        },
                        axisTick: { show: false }
                    },
                    {
                        nameTextStyle: {
                            color: "#4572A7"
                        },
                        type: "value",
                        name: "对话率%",
                        position: "right",
                        axisLine: {
                            show: false
                        },
                        axisTick: { show: false },
                        min: 0,
                        max: 200,
                        axisLabel: {
                            textStyle: {
                                color: "#4572A7"
                            },
                            show: true,
                            interval: "auto",
                            formatter: "{value}%"
                        },
                        show: true
                    }
                ],
                series: [
                    {
                        name: "访问次数",
                        type: "line",
                        stack: "访问次数",
                        smooth:true,
                        icon: "line",
                        itemStyle: {
                            normal: {
                                color: "#88e5ff",
                                lineStyle: {
                                    color: "#88e5ff"
                                }
                            }
                        },
                        areaStyle: { normal: { color: "#88e5ff" } }, // 添加颜色区域
                        data: [0, 0, 0, 134, 0, 0, 0]
                    },
                    {
                        name: "对话量",
                        type: "line",
                        stack: "对话量",
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: "#a8f5a1",
                                lineStyle: {
                                    color: "#a8f5a1"
                                }
                            }
                        },
                        areaStyle: { normal: { color: "#a8f5a1" } },
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: "对话率",
                        yAxisIndex:1,
                        type: "line",
                        stack: "对话率",
                        smooth:true,
                        itemStyle: {
                            normal: {
                                color: "#b78ffc",
                                lineStyle: {
                                    color: "#b78ffc"
                                }
                            }
                        },
                        areaStyle: { normal: { color: "#b78ffc" } },
                        data: [50, 100, 120, 55, 23, 78, 200]
                    }
                ]
            });
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.drawLine();
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.visitConversation {
    .report-counter {
        height: auto;
        background-color: #fff;
        box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.1);
        margin-bottom: 20px;
        .new-title {
            height: auto;
            min-height: 50px;
            line-height: 50px;
            padding: 0px 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            display: flex;
            h3 {
                font-weight: 400;
                margin: 0;
            }
        }
        .new-report-counter {
            padding: 10px 20px;
            height: 120px;
            ul {
                li {
                    margin: 0;
                    position: relative;
                    padding: 15px 0;
                    float: left;
                    width: 180px;
                    height: 100px;
                    p {
                        &.title {
                            font-size: 13px;
                            color: #969faa;
                            margin: 0;
                            height: 20px;
                        }
                        &.count {
                            font-size: 24px;
                            color: #5a6978;
                            margin: 5px 0 0;
                            float: left;
                        }
                        &.sub {
                            font-size: 13px;
                            color: #5a6978;
                            border-radius: 3px;
                            background-color: #f2f3f5;
                            padding: 2px 4px;
                            display: inline-block;
                            float: left;
                            margin-left: 10px;
                        }
                    }
                }
            }
        }
    }

    /deep/ .report-data {
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