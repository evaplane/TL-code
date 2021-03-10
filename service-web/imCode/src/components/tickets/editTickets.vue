<template>
    <div>
        <div class="sidebar-add">
            <header>编辑筛选</header>
            <div class="content">
                <div
                    class="content-item"
                    v-for="(item,index) in rule"
                    :key="index"
                    v-show="item.isShow"
                    @mouseenter="enter(index)"
                    @mouseleave="leave(index)"
                >
                    <label class="label">{{item.label}}</label>
                    <span
                        class="clear"
                        @click="clear(item)"
                        v-show="item.lickOne && item.id!=1"
                    >- 移出</span>
                    <!-- 解决时间 -->
                    <div v-if="item.id==1">
                        <el-date-picker
                            v-model="value2"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                        >
                        </el-date-picker>
                    </div>
                    <!-- 创建人 -->
                    <div v-if="item.id==2">
                        <div>
                            <el-cascader-multi
                                v-model="checkList"
                                :data="data1"
                            ></el-cascader-multi>
                        </div>
                    </div>
                    <!-- 处理人 -->
                    <div v-if="item.id==3">
                        <el-cascader
                            :show-all-levels="false"
                            v-model="value"
                            :options="distributions"
                            :props="{ expandTrigger: 'hover' }"
                            @change="handleChange"
                        ></el-cascader>
                    </div>
                    <!-- 工单分类 -->
                    <div v-if="item.id==4">
                        <el-cascader
                            :show-all-levels="false"
                            v-model="value"
                            :options="distributions"
                            :props="{ expandTrigger: 'hover' }"
                            @change="handleChange"
                        ></el-cascader>
                    </div>
                    <!-- 工单状态 -->
                    <div v-if="item.id==5">
                        <el-cascader-multi
                            v-model="checkList"
                            :data="data1"
                        ></el-cascader-multi>
                    </div>
                    <!-- 工单来源 -->
                    <div v-if="item.id==6">

                        <el-cascader-multi
                            v-model="checkList"
                            :data="data1"
                        ></el-cascader-multi>
                    </div>
                    <!-- 截止日前 -->
                    <div v-if="item.id==7">
                        <el-date-picker
                            v-model="value3"
                            type="datetime"
                            placeholder="选择日期时间"
                            default-time="12:00:00"
                        ></el-date-picker>
                    </div>
                    <!-- 工单号 -->
                    <div v-if="item.id==8">
                        <el-input
                            v-model="workOrderNo"
                            placeholder="请输入工单号"
                        ></el-input>
                    </div>
                    <!-- 优先级 -->
                    <div v-if="item.id==9">
                        <el-cascader-multi
                            v-model="checkList"
                            :data="data1"
                        ></el-cascader-multi>
                    </div>
                    <!-- 工单内容 -->
                    <div v-if="item.id==10">
                        <el-input
                            v-model="workOrderContent"
                            placeholder="请输入工单内容"
                        ></el-input>
                    </div>
                    <!-- 访问标识 -->
                    <div v-if="item.id==11">
                        <el-input
                            v-model="Identification"
                            placeholder="请输入访问标识"
                        ></el-input>
                    </div>
                </div>
                <div
                    class="content-item add-rule"
                    @click="screenRule = !screenRule"
                >
                    <a v-show="!tag">+ 添加筛选规则</a>
                    <div
                        class="screenRule"
                        v-if="screenRule"
                    >
                        <ul>
                            <li
                                v-for="(item,index) in rule"
                                :key="index"
                                v-show="!item.isShow"
                            >
                                <a @click="changType(item)">{{item.label}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="content-item add-work-order">
                    <button>保存当前条件并筛选</button>
                </div>
                <div class="content-item saveSearch">
                    <a @click="dialogVisible = true">
                        <i class="el-icon-delete"></i> 删除这个自定义筛选</a>
                </div>
            </div>
        </div>
        <el-dialog
            title="创建自定义筛选"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <span>
                <el-input placeholder="条件名称"></el-input>
            </span>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="dialogVisible = false"
                >创 建</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ticketObject: [],
            screenRule: false, // 控制添加筛选“列”的显示隐藏
            tag: false, // 控制“添加筛选”显示隐藏
            dialogVisible: false,
            value3: "",
            radio: 3,
            value: [],
            workOrderNo: "",
            workOrderContent: "", //工单内容
            Identification: "", //访问标识
            distributions: [
                {
                    value: "zhinan",
                    label: "默认分组",
                    children: [
                        {
                            value: "shejiyuanze",
                            label: "超级管理员",
                            children: [
                                {
                                    value: "yizhi",
                                    label: "一致"
                                },
                                {
                                    value: "fankui",
                                    label: "反馈"
                                },
                                {
                                    value: "xiaolv",
                                    label: "效率"
                                },
                                {
                                    value: "kekong",
                                    label: "可控"
                                }
                            ]
                        }
                    ]
                },
                {
                    value: "shangping",
                    label: "商品组",
                    children: [
                        {
                            value: "shejiyuanze",
                            label: "超级管理员"
                        }
                    ]
                }
            ],
            priorityValue: "",
            priority: [
                {
                    value: "0",
                    label: "低"
                },
                {
                    value: "1",
                    label: "中"
                },
                {
                    value: "2",
                    label: "高"
                },
                {
                    value: "3",
                    label: "紧急"
                }
            ],
            /**
             * 初始化搜索条件
             * lickOne 判断 “移出” 状态是否存在
             * isShow 是否显示
             */
            rule: [
                { id: "1", lickOne: false, label: "解决时间", isShow: true },
                { id: "2", lickOne: false, label: "创建人", isShow: true },
                { id: "3", lickOne: false, label: "处理人", isShow: true },
                { id: "4", lickOne: false, label: "工单分类", isShow: true },
                { id: "5", lickOne: false, label: "工单状态", isShow: true },
                { id: "6", lickOne: false, label: "工单来源", isShow: true },
                { id: "7", lickOne: false, label: "截止时间", isShow: true },
                { id: "8", lickOne: false, label: "工单号", isShow: false },
                { id: "9", lickOne: false, label: "优先级", isShow: false },
                { id: "10", lickOne: false, label: "工单内容", isShow: false },
                { id: "11", lickOne: false, label: "访问标识", isShow: false }
            ],
            data1: [
                {
                    value: "zhinan",
                    label: "网站"
                },
                {
                    value: "shangping",
                    label: "SKD"
                }
            ],
            checkList: [],
            pickerOptions: {
                shortcuts: [
                    {
                        text: "今天",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 1
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "昨天",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * -1
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "过去7天",
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
                        text: "过去30天",
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
            value2: ""
        };
    },
    methods: {
        handleClose(done) {
            this.$confirm("确认关闭？")
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
        handleChange(value) {
            console.log(value);
        },
        enter(index) {
            this.rule[index].lickOne = true;
        },
        leave(index) {
            this.rule[index].lickOne = false;
        },
        changType(it) {
            for (let index in this.rule) {
                if (this.rule[index].id == it.id) {
                    this.rule[index].isShow = true;
                }
            }
            this.tag = this.rule.every(item => item.isShow === true);
        },
        clear(it) {
            for (let index in this.rule) {
                if (this.rule[index].id == it.id) {
                    this.rule[index].isShow = false;
                }
            }
            this.tag = this.rule.every(item => item.isShow === true);
        }
    },
    mounted() {}
};
</script>

<style lang="less" scoped>
@import "../../common/css/base.less";

// 工单列表
.sidebar-add {
    width: 280px;
    height: 100vh;
    background: #fff;
    float: left;
    header {
        line-height: 40px;
        display: block;
        padding: 0 20px;
        font-size: 13px;
        text-align: center;
        border-bottom: 1px solid #edeef0;
        // box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.01), 0 1px 0 0 rgba(0, 0, 0, 0.06);
    }
    /deep/ .content {
        overflow: auto;
        height: 100%;
        background-color: #fbfbfc;
        box-sizing: border-box;
        padding: 20px 20px 80px 20px;
        .content-item {
            margin-bottom: 20px;
            .label {
                display: inline-block;
                font-size: 12px;
                color: #767d85;
                margin-bottom: 8px;
            }
            .clear {
                display: inline-block;
                font-size: 12px;
                color: #009de7;
                float: right;
                font-weight: 700;
                cursor: pointer;
            }
            .editorMenu {
                // border: 1px solid #ccc;
            }
            .w-e-toolbar {
                width: 100%;
                // height: 40px;
            }
            .editor {
                // width: 100%;
                // height:auto;//编辑框高度超过最小高度会根据内容高度自适应
            }
            .el-cascader {
                height: 34px;
                width: 100%;
                .el-input__inner {
                    height: 34px;
                    border-radius: 0px;
                    border: none;
                    box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                    color: #969faa;
                }
            }
            .el-select {
                height: 34px;
                width: 100%;
                .el-input__inner {
                    height: 34px;
                    border-radius: 0px;
                    border: none;
                    box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                    color: #969faa;
                }
                .el-input__icon {
                    line-height: 34px;
                }
            }
            .el-cascader__label {
                width: 100%;
            }
            &.add-work-order {
                button {
                    background: #009de7;
                    border: none;
                    color: #fff;
                }
                width: 100%;
                display: inline-block;
                height: 32px;
                line-height: 32px;
                font-size: 13px;
                font-weight: 400;
                text-align: center;
                cursor: pointer;
                border: none;
                border-radius: 4px;
                background: #009de7;
                &:hover {
                    background-color: #008cce;
                    button {
                        background: #008cce;
                    }
                }
            }
            &.saveSearch {
                a {
                    display: block;
                    text-align: center;
                    color: red;
                    font-size: 13px;
                }
            }
            .el-range-editor {
                height: 34px;
                border-radius: 0px;
                border: none;
                box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                color: #969faa;
                .el-input__icon {
                    height: 34px;
                    line-height: 34px;
                }
                .el-range-separator {
                    padding: 0;
                    line-height: 28px;
                }
            }

            // 日期
            /deep/ .el-date-editor {
                width: 100%;
                /deep/ .el-input__inner {
                    padding-left: 30px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 0px;
                    border: none;
                    font-size: 13px;
                    box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                    color: #969faa;
                }
                /deep/ .el-input__icon {
                    line-height: 34px;
                }
            }
            &.add-rule {
                position: relative;
                a {
                    font-size: 13px;
                    color: #009de7;
                }
                .screenRule {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    z-index: 1;
                    border-radius: 4px;
                    background-color: #fff;
                    box-shadow: 0 5px 30px 0 rgba(52, 63, 75, 0.2);
                    min-width: 160px;
                    overflow-y: auto;
                    ul {
                        max-height: 410px;
                        overflow-y: auto;
                        padding: 5px 0;
                        margin: 2px 0 0;
                        font-size: 13px;
                        text-align: left;
                        list-style: none;
                        li {
                            a {
                                display: block;
                                padding: 11px 18px;
                                clear: both;
                                font-weight: 400;
                                line-height: 1.42857143;
                                color: #333;
                                text-decoration: none;
                                cursor: pointer;
                                &:active,
                                &:hover {
                                    background-color: #009de7;
                                    color: #fff;
                                    text-decoration: none;
                                }
                            }
                        }
                    }
                }
            }
            // .priority{
            //   .el-radio-group{
            //     display: flex;
            //     label{
            //       margin-right:0;
            //       flex: 1;
            //     }
            //   }
            // }
            .el-input__inner {
                height: 34px;
                border-radius: 0px;
                border: none;
                font-size: 13px;
                box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
                color: #969faa;
            }
        }
    }
}
</style>