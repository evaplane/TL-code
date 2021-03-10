<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-09-27 16:35:51
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-27 18:10:42
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
                        <p class="title">总有效对话量</p>
                        <p class="count">2</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">总参评率</p>
                        <p class="count">2</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">好评总量</p>
                        <p class="count">3</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">中评总量</p>
                        <p class="count">1</p>
                        <p class="sub"></p>
                    </li>
                    <li>
                        <p class="title">差评总量</p>
                        <p class="count">2</p>
                        <p class="sub"></p>
                    </li>
                </ul>
            </div>
            <div class="time">
                <el-button-group>
                    <el-button :class="{active: num == 0}" @click="toDayData('0')">小时</el-button>
                    <el-button :class="{active: num == 1}" @click="toDayData('1')">天</el-button>
                </el-button-group>
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
                :row-style="{height:'40px'}"
                style="width: 100%"
            >
                <el-table-column
                    label="#"
                    prop="time"
                >
                </el-table-column>
                <el-table-column
                    label="客服"
                    prop="time"
                >
                </el-table-column>
                <el-table-column
                    label="对话数"
                    prop="visitorsNum"
                >
                </el-table-column>
                <el-table-column
                    label="评价数"
                    prop="visitNum"
                >
                </el-table-column>
                <el-table-column
                    label="参评率"
                    prop="browseNum"
                >
                </el-table-column>
                <el-table-column
                    label="好评"
                    prop="dialogueNum"
                >
                </el-table-column>
                <el-table-column
                    label="中评"
                    prop="dialogueRate"
                >
                </el-table-column>
                <el-table-column
                    label="差评"
                    prop="dialogueRate"
                >
                </el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script>
import echarts from 'echarts'
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
                }
            ],
            num:0
        };
    },
    props:["searchData"],
    //监听属性 类似于data概念
    computed: {},
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(
                document.getElementById("myChart")
            );
            myChart.setOption({
                title: {
                    text: "客服评价",
                    left: "center"
                },
                tooltip: {
                    trigger: "axis"
                },
                legend: {
                    data: ["好评数", "中评", "差评数"],
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
                        "周一",
                        "周二",
                        "周三",
                        "周四",
                        "周五",
                        "周六",
                        "周日"
                    ]
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        name: "好评数",
                        type: "line",
                        stack: "总量",
                        smooth:true,
                        itemStyle :{
                            normal : { 
                                color:'rgb(107, 222, 60)', //改变折线点的颜色
                                lineStyle:{ 
                                    color:'rgb(107, 222, 60)'
                                } //改变折线颜色
                            }
                        },
                        areaStyle: { normal: {color: 'rgb(107, 222, 60)'}}, // 添加颜色区域
                        data: [0, 0, 0, 134, 0, 0, 0]
                    },
                    {
                        name: "中评",
                        type: "line",
                        stack: "总量",
                        smooth:true,
                        itemStyle :{
                            normal : { 
                                color:'rgb(255, 158, 71)', //改变折线点的颜色
                                lineStyle:{ 
                                    color:'rgb(255, 158, 71)'
                                } //改变折线颜色
                            }
                        },
                        areaStyle: { normal: {color:'rgb(255, 158, 71)'} },
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: "差评数",
                        type: "line",
                        stack: "总量",
                        smooth:true,
                        itemStyle :{
                            normal : { 
                                color:'rgb(255, 82, 84)', //改变折线点的颜色
                                lineStyle:{ 
                                    color:'rgb(255, 82, 84)'
                                } //改变折线颜色
                            }
                        },
                        areaStyle: { normal: {color:'rgb(255, 82, 84)'} },
                        data: [150, 232, 201, 154, 190, 330, 410]
                    }
                ]
            });
        },
        // 切换时间
        toDayData(n){
            this.num = n;
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        this.drawLine();
    },
};
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
.visitConversation .time{
    margin-left: 20px;
}
.visitConversation .time > .el-button-group > .el-button:hover,
.visitConversation .time > .el-button-group > .el-button.active{
  background-color: #009de7;
  color: #fff;
}
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

    .report-data {
        box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.1);
        .el-table__row {
            height: 40px !important;
        }
        .el-table--striped
            .el-table__body
            tr.el-table__row--striped.el-table__row--striped.el-table__row--striped
            td {
            background-color: red !important; /*替换为你需要的颜色，觉得优先级不够就加!important*/
        }
    }
}

</style>