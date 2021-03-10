<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-09-26 14:35:51
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-27 16:38:32
 -->
<template>
    <div class="reportMenu">
        <div>
            <div class="header">
                <h1>数据概览</h1>
                <el-popover placement="bottom" trigger="click">
                    <!-- <div class="handleGroup">
                        <el-button size="small">今天</el-button>
                        <el-button size="small">昨天</el-button>
                        <el-button size="small">过去7天</el-button>
                        <el-button size="small">过去30天</el-button>
                    </div>-->
                    <div class="block">
                        <el-date-picker
                            v-model="date"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            change="dateChange"
                        ></el-date-picker>
                    </div>
                    <el-button type="info" plain slot="reference" size="small">今天</el-button>
                </el-popover>
            </div>
            <div class="main">
                <el-row>
                    <el-col :span="2">
                        <div class="grid-content"></div>
                        <div class="bg-purple-dark">访问</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">访客数</div>
                        <div>-</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">访问次数</div>
                        <div>-</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">浏览量</div>
                        <div>-</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="2">
                        <div class="grid-content"></div>
                        <div class="bg-purple-dark">对话</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">对话数/率</div>
                        <div>-</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">对话数/率</div>
                        <div>-</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">消息数</div>
                        <div>-</div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">平均首次响应时长</div>
                        <div>
                            <span class="important">0</span>秒
                        </div>
                    </el-col>
                    <el-col :span="2">
                        <div class="grid-content">平均对话持续时长</div>
                        <div>
                            <span class="important">0</span>秒
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div>
            <div class="router">
                <el-row v-for="(temp, index) in router" :key="index">
                    <el-row>
                        <el-col :span="1">
                            <div class="grid-content bg-purple">
                                <p>{{temp.title}}</p>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2" v-for="(tmp,i) in temp.type" :key="i">
                            <div class="grid-content bg-purple">
                                <router-link :to="tmp.path">{{tmp.name}}</router-link>
                            </div>
                        </el-col>
                    </el-row>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            date: '',
            pickerOptions: {
                shortcuts: [
                    {
                        text: "昨天",
                        onClick(picker) {
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 1
                            );
                            picker.$emit("pick", [start, start]);
                        }
                    },
                    {
                        text: "今天",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近7天",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近30天",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            router: [
                {
                    title: "网站数据",
                    type: [
                        {
                            name: "对话页统计",
                            path: "/report/dialogStatistics"
                        },
                    ]
                },
                {
                    title: "对话",
                    type: [
                        {
                            name: "访问量和对话量",
                            path: "/report/visitConversation"
                        },
                        {
                            name: "顾客标签",
                            path: "/report/customerLabel"
                        },
                    ]
                },
                {
                    title: "客服数据",
                    type: [
                        {
                            name: "客服评价",
                            path: "/report/evaluation"
                        },
                        {
                            name: "客服状态",
                            path: "/report/agentStatus"
                        },
                        {
                            name: "服务量",
                            path: "/report/volume"
                        }
                    ]
                }
            ]
        };
    },
    methods: {
    },
    watch: {
        date(val) {
            console.log(val)
        }
    }
};
</script>

<style lang="less" scoped>
.reportMenu {
    width: 100%;
    > div {
        font-size: 14px;
        line-height: 28px;
        background: #fff;
        margin-bottom: 30px;
        &:last-child {
            margin-bottom: 0;
        }
        > div {
            padding: 20px 30px;
            &.header {
                > h1 {
                    display: inline-block;
                    line-height: 32px;
                    vertical-align: middle;
                    margin-right: 10px;
                }
            }
            .el-col {
                span.important {
                    font-size: 26px;
                    color: #5a6978;
                }
            }
        }
        .main {
            color: #969faa;
            .bg-purple-dark {
                color: #000;
            }
        }
    }
}

.handleGroup {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
}
.router {
    font-size: 14px;
    .el-row {
        margin-bottom: 0;
    }
    > .el-row {
        margin-bottom: 10px;
    }
    a {
        color: #009de7;
    }
}
.el-row {
    margin-bottom: 20px;
}
.el-row:last-child {
    margin-bottom: 0;
}
.el-col {
    border-radius: 4px;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>