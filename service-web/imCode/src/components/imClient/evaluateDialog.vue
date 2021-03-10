    <!--
    * @Descripttion:
    * @version:
    * @Author: sueRimn
    * @Date: 2019-08-05 16:54:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-18 11:51:16
    -->
    <template>
    <div class="evaluationHolder">
        <div v-if="choseEvaluation" class="alert">
            <div class="alertInside">请选择评价等级</div>
            <a class="alertHide" @click="closeTip">
                <i class="icon icon-times"></i>
            </a>
        </div>
        <div class="evaluation-header">
            <a class="evaluationHide" @click="choseEvaluationFun">
                <i class="icon icon-times"></i>
            </a>
            <div class="intro">您对本次服务满意吗？</div>
        </div>
        <div class="evaluation-body">
            <div class="evaluation-btn-group">
                <input class="evaluationLevel" type="hidden" />
                <div
                    :class="{active:active=='evaluation1'}"
                    class="evaluation-btn"
                    @click="evaluation(1)"
                >
                    <i class="icon icon-smile"></i>
                    <span>好评</span>
                </div>
                <div
                    :class="{active:active=='evaluation2'}"
                    class="evaluation-btn"
                    @click="evaluation(2)"
                >
                    <i class="icon icon-neutral"></i>
                    <span>中评</span>
                </div>
                <div
                    :class="{active:active=='evaluation3'}"
                    class="evaluation0 evaluation-btn"
                    @click="evaluation(3)"
                >
                    <i class="icon icon-angry"></i>
                    <span>差评</span>
                </div>
            </div>
            <div class="evaluation-reason">
                <!-- <el-input
                    type="textarea"
                    class="evaluationContent"
                    placeholder="请填写评价内容（选填）"
                    v-model="evaluationCenter"
                    maxlength="250"
                    show-word-limit
                ></el-input> -->
                <textarea
                    v-model="evaluationCenter"
                    class="evaluationContent"
                    placeholder="请填写评价内容（选填）"
                    maxlength="30"
                ></textarea>
                <p>{{30-evaluationCenter.length}}</p>
                <button class="evaluationSubmit" @click="evaluationSubmit()">提交</button>
            </div>
        </div>
    </div>
</template>
    <script>
import { setTimeout } from "timers";
export default {
    data() {
        return {
            choseEvaluation: false, // 提示
            evaluationLV: -1, //评价等级 1: 好评 2：中评 3：差评
            evaluationCenter: "", //评价内容
            active: "" // 选择
        };
    },
    props: {
        // 访客端数据
        clientValue: {
            required: true,
            type: Object,
            default: ""
        }
    },
    methods: {
        /**
         * 关闭评价弹窗
         */
        choseEvaluationFun() {
            this.$parent.evaluateDialogFun();
        },
        /**
         * 关闭提示弹窗
         */
        closeTip() {
            this.choseEvaluation = false;
        },
        /**
         * 选择评价等级
         * @param {String} vlaue 设定的评价等级
         */
        evaluation(value) {
            this.evaluationLV = value;
            this.active = "evaluation" + value;
        },
        /**
         * 提交评价
         */
        evaluationSubmit() {
            let that = this;
            if(this.evaluationCenter.length > 30) {
                this.$message1({
                    type: 'warning',
                    message: '评价内容请限制在30字以内'
                })
                return
            }
            if (that.evaluationLV < 0) {
                that.choseEvaluation = true;
                setTimeout(() => {
                    that.choseEvaluation = false;
                }, 3000);
                return;
            }
            let ops = {
                trackId: that.clientValue.bindInfo.trackId, // 会话ID
                evaluateType: that.evaluationLV.toString(), // 评价等级
                evaluateContent: that.$ak.Utils.utf16toEntities(that.evaluationCenter) // 评价内容
            };
            that.$axios.post(that.$httpServer.save, ops).then(res => {
                if (res.data.code == 0) {
                    let evalLvAndCenter = JSON.stringify({'lv':ops.evaluateType,'center':ops.evaluateContent});
                    that.$parent.$emit("sendMsg", {
                        type: "client",
                        contentType: 3, //3: 评价
                        time: this.$ak.Utils.getNowFormatDate(),
                        center: evalLvAndCenter //评价等级 + 内容
                    });
                    this.$emit("closeEvaluateDialog", false);
                    // this.$parent.$parent.$data.evaluateDialogShow = false; //关闭评价框
                }
            });
        }
    }
};
</script>
    <style lang="less" scoped>
.evaluationHolder {
    background-color: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
    border-bottom: 1px solid rgb(237, 237, 237);
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    z-index: 10000;
    .alert {
        left: 0;
        z-index: 7;
        padding: 0 35px 0 10px;
        background-color: #fffadd;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        width: 100%;
        position: absolute;
        display: flex;
        justify-content: space-between;
        .alertInside {
            width: 100%;
            height: 40px;
            overflow: hidden;
            line-height: 40px;
            font-size: 14px;
            text-align: center;
            color: #666458;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: center;
        }
        .alertHide {
            top: 0;
            width: 30px;
            text-align: center;
            cursor: pointer;
            margin-right: 10px;
        }
        .icon {
            background-image: url(https://resource.meiqia.com/dist/images/icon-desktop.png?v=kgyomfse73);
            background-size: 44px auto;
            background-repeat: no-repeat;
        }
        .icon-times {
            display: block;
            width: 22px;
            height: 22px;
            margin-top: 9px;
            background-position: 0 -132px;
        }
    }

    .evaluation-header {
        .evaluationHide {
            position: absolute;
            top: 10px;
            right: 10px;
            .icon {
                background-image: url(../../../static/image/icon-desktop.png);
                background-size: 44px auto;
                background-repeat: no-repeat;
            }
            .icon-times {
                display: block;
                width: 22px;
                height: 22px;
                background-position: 0px -132px;
            }
        }
        .intro {
            text-align: center;
            font-size: 14px;
            color: rgb(102, 102, 102);
            max-height: 6em;
            margin: 12px 35px 0px;
            overflow: hidden;
        }
    }
    .evaluation-body {
        margin: 10px 15px 0px;
        .evaluation-btn-group {
            display: flex;
            justify-content: center;
            margin: 0px auto 10px;
            .icon {
                display: block;
                width: 40px;
                height: 40px;
                margin: 5px auto 0px;
                background-image: url(../../../static/image/icon-desktop.png);
                background-size: 44px auto;
                background-repeat: no-repeat;
            }
            .icon-smile {
                background-position: -2px -310px;
            }
            .icon-neutral {
                background-position: -2px -354px;
            }
            .icon-angry {
                background-position: -2px -398px;
            }
            .active {
                background-color: #fafafa;
                border-color: #f0f0f0;
                border-radius: 3px;
            }
            .evaluation-btn {
                float: left;
                width: 60px;
                height: 70px;
                cursor: pointer;
                margin: 0px 5px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(255, 255, 255);
                border-image: initial;
                span {
                    display: block;
                    margin-top: 5px;
                    text-align: center;
                    font-size: 12px;
                    color: rgb(102, 102, 102);
                }
            }
            .evaluation-btn:hover {
                background-color: #fafafa;
                border-color: #f0f0f0;
                border-radius: 3px;
            }
        }
        .evaluation-btn-group::after {
            display: block;
            clear: both;
            content: "";
        }
        .evaluation-reason {
            margin-bottom: 15px;
            .evaluationContent {
                width: 100%;
                height: 60px;
                overflow-y: auto;
                resize: none;
                padding: 10px;
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(237, 237, 237);
                border-image: initial;
            }
            .evaluationSubmit {
                width: 100%;
                height: 35px;
                line-height: 32px;
                margin-top: 10px;
                font-size: 14px;
                border-width: 0px;
                border-style: initial;
                border-color: initial;
                border-image: initial;
                border-radius: 3px;
                background-color: #007aff;
                color: #fff;
                cursor: pointer;
            }
            p {
                text-align: right;
            }
        }
    }
}
</style>


