<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-19 09:11:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-19 10:58:18
 -->
<template>
    <div class="lineUp">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <div class="header">
                <h1>聊天链接</h1>
                <p>顾客打开这个界面即能与你进行对话</p>
            </div>
            <div>
                <div class="title">
                    <div>默认链接</div>
                    <span
                        title="复制链接"
                        class="el-icon-document-copy copy"
                        @click="copyPassword(form.remind)"
                    ></span>
                </div>
                <div>
                    <el-input
                        type="textarea"
                        readonly
                        :spellcheck ="false"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model="form.remind"
                        @blur="updateLineUpRule"
                    ></el-input>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script>
import { getQueueRule, updateQueueRule } from "@/common/api";
import Queue from "@/components/imClient/queue";

export default {
    components: {
        Queue
    },
    data() {
        return {
            form: {
                id: "",
                remind: "",
                queueCount: 20,
            },
            timer: null,
            queueCard: false
        };
    },
    methods: {
        getQueueRule() {
          let str = window.location.origin; //获取端口号
          this.form.remind = str+"/#/imClient?seatsGroupId="+JSON.parse(sessionStorage.getItem("userInfo")).dept_id;
        },
        updateLineUpRule() {
            // 调接口并传参e.target.value
        },
        copyPassword(remind) {
            let oInput = document.createElement("input");
            oInput.value = remind;
            document.body.appendChild(oInput);
            oInput.select();
            if (document.execCommand) {
                document.execCommand("copy");
                document.body.removeChild(oInput);
                this.$message1({
                    message: "复制成功",
                    type: "success"
                });
            } else {
                this.$message1({
                    message: "该浏览器不支持自动复制，请手动复制",
                    type: "warning"
                });
            }
        },
    },
    created() {
        this.getQueueRule();
    }
};
</script>

<style lang="less" scoped>
.lineUp {
    width: 710px;
    font-size: 13px;
    line-height: 28px;
    position: relative;
    > div.queue {
        width: 300px;
        position: absolute;
        right: -310px;
        top: 0;
    }
    form {
        > div {
            padding: 20px 30px;
            background: #fff;
            &.header {
                font-size: 14px;
                h1,
                div {
                    display: inline-block;
                    vertical-align: middle;
                }
                div {
                    margin-left: 10px;
                }
                p {
                    color: #969faa;
                }
            }
            .title {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                span {
                    cursor: pointer;
                    color: #009de7;
                }
                p {
                    color: #969faa;
                }
            }
            .footer {
                padding: 20px 0;
                color: #5a6978;
            }
            .copy {
                cursor: pointer;
            }
        }
    }
}
</style>