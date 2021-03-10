<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-23 16:33:21
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-27 14:41:19
 -->
<template>
<!-- 排队 -->
    <div class="lineUp">
        <el-form :inline="true" :model="form" class="demo-form-inline">
            <div class="header">
                <h1>顾客排队</h1>
                <el-switch v-model="form.customerQueueSwitch" @change="updateLineUpRule"></el-switch>
                <p>当客服服务达到上限时，顾客会进入排队等待状态，同时可以进行留言</p>
            </div>
            <div v-if="form.customerQueueSwitch">
                <div class="title">
                    <div>提示文案</div>
                    <span @click="queueCard = !queueCard">
                        <i class="el-icon-view"></i>实例预览
                    </span>
                </div>
                <div>
                    <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容"
                        v-model.trim="form.remind"
                        @blur="updateLineUpRule"
                        maxlength="50"
                        show-word-limit
                    ></el-input>
                </div>
                <div class="footer">
                    <div class="title">
                        <div>排队上限</div>
                        <p>*共有<i>{{service.totalPeople}}</i>个客服人员，最大接待上限<i>{{service.maximum}}</i></p>
                    </div>
                    <div>
                        当排队人数超过
                        <el-input-number
                            v-model="form.queueCount"
                            controls-position="right"
                            @change="updateLineUpRule"
                            :min="1"
                            :max="20"
                            size="small"
                            :precision="0"
                        ></el-input-number>人时，后续新进入对话自动转到留言
                    </div>
                </div>
            </div>
        </el-form>
        <div class="queue" v-if="queueCard" style="border:1px solid #fff;">
            <Queue :isShowHeader="true" :count="1">
                <template v-slot:header>{{form.remind}}</template>
            </Queue>
        </div>
    </div>
</template>

<script>
import { getQueueRule, updateQueueRule, getTotal } from "@/common/api";
import Queue from "@/components/imClient/queue";

export default {
    components: {
        Queue
    },
    data() {
        return {
            // 表单数据
            form: {
                id: "",
                remind: "抱歉，当前所有客服已经达到服务上限，请耐心等候，我们很快就来接",
                queueCount: 1,
                customerQueueSwitch: false
            },
            // 当前排队的排队人数上限，服务人数上限数据
            service: {
                totalPeople: '',
                maximum: ''
            },
            // 预览开关
            queueCard: false
        };
    },
    methods: {
        /**
         * 获取当前的排队设置
         */
        getQueueRule(deptId) {
            getQueueRule(deptId).then(res => {
                if (res.data.code === 0 && res.data.data) {
                    let data = res.data.data;
                    if (parseInt(data.customerQueueSwitch)) {
                        data.customerQueueSwitch = true;
                    } else {
                        data.customerQueueSwitch = false;
                    }
                    this.form = data;
                }
            });
        },
        /**
         * 获取服务人数上限数据
         */
        getServiceInfo() {
            getTotal().then(res => {
                if(res.data.data) {
                    this.service = res.data.data
                }
            })
        },
        /**
         * 保存修改的排队数据
         */
        updateLineUpRule() {
            // 调接口并传参e.target.value
            let data = Object.assign({}, this.form)
            if (data.customerQueueSwitch) {
                data.customerQueueSwitch = 1
            } else {
                data.customerQueueSwitch = 0
            }
            updateQueueRule(data).then(res => {
                if (res.data.code === 0) {
                    this.$message1({
                        message: "保存成功",
                        type: "success"
                    });
                }
            });
        }
    },
    created() {
        let {deptId} = this.$store.imServerStore.state.userInfo
        this.getQueueRule(deptId);
        this.getServiceInfo()
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
        height: 600px;
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
        }
    }
}
</style>
