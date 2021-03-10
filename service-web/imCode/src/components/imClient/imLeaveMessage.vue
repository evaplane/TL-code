    <!--
    * @Descripttion:
    * @version:
    * @Author: sueRimn
    * @Date: 2019-07-30 14:46:38
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-17 15:48:19
    -->
    <template>
    <div class="ticketForm">
        <div v-if="isSuccessLeave" class="ticketFormFirst">
            <div class="ticket">
                <div class="step-title">您好，很抱歉我们暂时无法为您提供服务，如需帮助，请留言，我们将尽快联系并解决您的问题</div>
                <div>
                    <div class="group-title">手机</div>
                    <div class="group-content">
                        <input
                            v-model="phoneNum"
                            class="ticketTel"
                            type="text"
                            placeholder=" 请输入手机号"
                        />
                    </div>
                </div>
                <div>
                    <div class="group-title">
                        留言内容
                        <span style="color:red;">*</span>
                    </div>
                    <div class="group-content">
                        <textarea
                            v-model="leaveMessage"
                            class="ticketContent"
                            placeholder="请输入留言内容"
                        ></textarea>
                    </div>
                </div>
                <div class="btn-group" @click="onSubmitLeaveDialog">
                    <a class="ticketSubmit">提交</a>
                </div>
            </div>
            <div class="footer">
                <span>客服软件</span>
            </div>
            <div v-if="showHideTitle" class="hideTitle">
                <div class="alertInside">{{fontTitle}}</div>
                <a class="alertHide" @click="closeTitle">
                    <i class="el-icon-close"></i>
                </a>
            </div>
        </div>
        <div v-else class="leaveMessSucc">
            <div class="leaveMessSucc_su">留言成功</div>
            <p class="message-success-P">我们会尽快联系你</p>
            <div class="message-success__Btn">
                <el-button type="primary" @click="closeClientDialag">关闭</el-button>
            </div>
            <p class="message-success-P">
                <span @click="isSuccessLeave = !isSuccessLeave">再次留言</span>
            </p>
        </div>
    </div>
</template>
    <script>
export default {
    data() {
        return {
            showHideTitle: false, // 提示
            fontTitle: "", //提示文字
            phoneNum: "", //电话
            leaveMessage: "", //留言
            initialize: false, // 初始化聊天
            isSuccessLeave: true
        };
    },
    props: {
        clientValue: {
            required: true,
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    methods: {
        closeClientDialag() {
            if (this.$parent.$parent.$parent.$data.socket != null) {
                this.$parent.$parent.$parent.$data.socket.close(); // 关闭会话
                this.$parent.$parent.$parent.$data.socket = null; // 关闭会话
            }
            this.$parent.$parent.$parent.$data.chatInfoEn.searchHistoryCondition = {
                currentSize: 0, //当前页数
                historySumPage: 1 // 历史记录总页数
            };
            this.$parent.$parent.$parent.$data.chatInfoEn.num = 0;
            this.$parent.$parent.$parent.showImClient();
            this.$parent.$parent.$parent.$data.initialNews = true; // 转换状态为初次登录
            this.$parent.$parent.$parent.$data.isQueueType = true; // 关闭排队
            this.$parent.$parent.$parent.$data.showCustomerService = true; // 关闭查看历史、开启转人工按钮
            this.$parent.$parent.$parent.$data.seatsOnline = true; // 转换状态为初次登录
            this.$parent.$parent.$parent.$data.isQueue = "1"; // 转换状态为初始会话状态
            this.$parent.$parent.$parent.$data.initialNewsWhere = false;
        },
        /**
         * 手动关闭提示框
         */
        closeTitle() {
            that.showHideTitle = false;
            that.fontTitle = "";
        },
        /**
         * 自动关闭提示
         */
        closeLeaveDialog() {
            let that = this;
            setTimeout(() => {
                that.showHideTitle = false;
                that.fontTitle = "";
            }, 2000);
        },
        /**
         * 留言
         *  */

        onSubmitLeaveDialog() {
            let that = this;
            if (this.phoneNum.trim() == "") {
                this.showHideTitle = true; // 提示
                this.fontTitle = "请至少填写手机号";
                this.closeLeaveDialog();
                return;
            }
            if (!/^1[3456789]\d{9}$/.test(this.phoneNum.trim())) {
                this.showHideTitle = true; // 提示
                this.fontTitle = "请正确填写手机号";
                this.closeLeaveDialog();
                return false;
            }
            if (this.leaveMessage.trim() == "" || this.leaveMessage.trim().length >1024) {
                this.showHideTitle = true; // 提示
                this.fontTitle = "请保持留言内容在 1～1024 字符内";
                this.closeLeaveDialog();
                return;
            }
            let ticketOrder = {
                phone: this.phoneNum.trim(), //手机号
                content: this.leaveMessage.trim() // 描述
            };
            let clientOpt = {
                clientId: localStorage.getItem("clientId"),
                customerPhone: ticketOrder.phone
            };
            if (this.clientValue.bindInfo != undefined) {
                clientOpt.clientName = this.clientValue.bindInfo.clientName;
            }
            let optTickets = {
                content: ticketOrder.content,
                visitId: localStorage.getItem("clientId"),
                priority: 1
            };
            this.$axios
                .post(this.$httpServer.saveOrUpdateClientInfo, clientOpt)
                .then(res => {
                    this.$axios
                        .post(this.$httpServer.addTicketOrder, optTickets)
                        .then(res => {
                            this.phoneNum = ""; //手机号
                            this.leaveMessage = ""; // 描述
                            that.isSuccessLeave = !that.isSuccessLeave;

                            // that.$parent.showImClient();
                        });
                });

            // this.$emit('initialize', true);
            // this.$axios.post(this.$httpServer.addTicketOrder,ticketOrder).then((res)=>{
            //     let that = this;
            //     if(res && res.data.code == "0"){
            //     // this.
            //     that.$router.push({
            //         path: `/tickets/5`
            //     });
            //     }
            // })
        }
    }
};
</script>
    <style lang="less" scoped>
/* 坐席不在线样式 */
.ticketForm {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    > div {
        height: 100%;
    }
}
.ticketFormFirst {
    background-color: #f2f3f5;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
}
.ticketForm .hideTitle {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 7;
    /* // padding: 0 35px 0 10px;   */
    background-color: #fffadd;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    width: 100%;
}
.ticketForm .hideTitle .alertInside {
    width: 100%;
    height: 40px;
    overflow: hidden;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    color: #666458;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.ticketForm .hideTitle .alertHide {
    top: 0;
    width: 30px;
    text-align: center;
    cursor: pointer;
    position: absolute;
    right: 0;
    height: 40px;
    line-height: 40px;
}
.ticketForm .ticket {
    width: 100%;
    /* height: 100%; */
    overflow-y: auto;
    overflow-x: hidden;
}
.ticketForm .ticket .step-title {
    margin: 16px;
    font-size: 12px;
    color: #666;
    word-break: break-all;
    line-height: 1.8;
}
.ticketForm .ticket .group-title {
    margin: 16px 0 6px 16px;
    color: #444;
    font-size: 12px;
}
.ticketForm .ticket .group-content {
    background-color: #fff;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04), 0 -1px 0 0 rgba(0, 0, 0, 0.04);
}
.ticketForm .ticket .group-content .ticketTel {
    width: 100%;
    height: auto;
    padding: 12px;
    border: none;
}
.ticketForm .ticket .group-content .ticketContent {
    display: block;
    width: 100%;
    height: 90px;
    padding: 12px 16px;
    overflow-x: hidden;
    overflow-y: auto;
    resize: none;
    outline: 0;
    background-color: #fff;
    border: none;
    word-break: break-all;
    font-size: 12px;
    -webkit-appearance: none;
}
.ticketForm .btn-group {
    margin: 24px 0;
    padding: 0 16px;
    cursor: pointer;
}
.ticketForm .btn-group .ticketSubmit {
    display: block;
    width: 100%;
    height: 44px;
    border-radius: 5px;
    line-height: 44px;
    text-align: center;
    font-size: 15px;
    background-color: #007aff;
    color: #fff;
}
.footer {
    height: 30px;
    background-color: #f4f4f4;
    border-top: 1px solid #ededed;
    text-align: center;
    line-height: 30px;
    margin-top: 16px;
}
.footer span {
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    color: #b7bac2;
    }
    .leaveMessSucc{
        border: 1px solid #ccc;
        height: 80%;
    }
    .leaveMessSucc .leaveMessSucc_su {
    text-align: center;
    font-size: 16px;
    color: #000;
    line-height: 40px;
    font-weight: 700;
}
.leaveMessSucc .message-success-P {
    font-size: 14px;
    text-align: center;
    margin: 20px 0px;
}
.leaveMessSucc .message-success-P span {
    cursor: pointer;
    color: #409eff;
}
.leaveMessSucc .message-success-P span:hover {
    text-decoration: underline;
}
.message-success__Btn {
    text-align: center;
}
.message-success__Btn button {
    padding: 12px 30px;
}
</style>


