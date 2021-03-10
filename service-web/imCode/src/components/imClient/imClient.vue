    <!--
    * @Descripttion:
    * @version:
    * @Author: sueRimn
    * @Date: 2019-07-30 21:58:29
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-23 02:27:19
 -->
<!-- im客户端 入口 -->
<template>
    <div>
        <el-row :gutter="10" type="flex" justify="space-around">
            <el-col :xs="24" :sm="24" :md="12" :lg="6" :xl="4">
                <div class="imClient-wrapper">
                    <div v-if="!imClientShow" class="imClient-body">
                        <!-- <div class="imClient-bto" @click="showImClient"> -->
                        <div class="imClient-bto" @click="showImClient">
                            <span class="unreadMsg" v-if="chatInfoEn.num > 0">{{chatInfoEn.num}}</span>
                            <span class="imClient-bin-icon"></span>
                            <span class="imClient-bin-border"></span>
                            <span class="imClient-bin-text">我们在线，来聊聊吧</span>
                        </div>
                    </div>
                    <div v-if="imClientShow" class="imClient-inner">
                        <div v-if="evaluateDialogShow" class="evaluationMask"></div>
                        <!--遮罩层-->
                        <header class="imClient-header">
                            <div class="name-wrapper">
                                <div v-if="chatInfoEn.chatState == 'robot'" class="pull-left">
                                    <img
                                        v-if="!seatsOnline"
                                        class="agent-avatar"
                                        src="../../assets/img/default-avatar.jpg"
                                    />
                                    <span>{{!seatsOnline?'给我们留言吧':'超级管理员'}}</span>
                                </div>
                                <span v-if="chatInfoEn.chatState == 'agent' && isQueue == '1'">
                                    <div
                                        class="serverChatImg"
                                        :style="{backgroundImage: serverChatEn.serverChatImg}"
                                    ></div>
									<div class="nameBox">
										<div class="name" :title="serverChatEn.serverChatName">{{serverChatEn.serverChatName}}</div>
										<div v-if="!!serverChatEn.signature" class="signature" :title="serverChatEn.signature">{{serverChatEn.signature}}</div>
									</div>
                                </span>
                                <span
                                    v-else-if="chatInfoEn.chatState == 'agent' && isQueue == '2'"
                                >排队等待中...</span>
                                <span
                                    v-else-if="chatInfoEn.chatState == 'agent' && isQueue == '3'"
                                >给我们留言</span>
                                <span
                                    v-else-if="chatInfoEn.chatState == 'agent' && isQueue == '4'"
                                >对话已结束</span>
                                <span v-else-if="chatInfoEn.chatState == 'agent' && isQueue == '5'">
                                    <div
                                        class="serverChatImg"
                                        :style="{backgroundImage: serverChatEn.serverChatImg}"
                                    ></div>客服正在输入中...
                                </span>
                            </div>
                            <div class="opr-wrapper">
                                <span
                                    v-if="showCustomerService && seatsOnline"
                                    class="btnCallAgent"
                                    @click="chatCallback()"
                                >专员服务</span>
                                <el-tooltip
                                    v-if="false"
                                    content="隐藏"
                                    placement="bottom"
                                    effect="light"
                                >
                                    <i class="icon icon-angel-down" @click="closeChat()"></i>
                                </el-tooltip>
                            </div>
                        </header>
                        <div v-if="isQueueType" class="imClient-main" :style="mainStyles">
                            <!-- 聊天框 -->
                            <!-- 聊天记录 -->
                            <!-- @chatCallback="chatCallback" -->
                            <common-chat
                                v-if="seatsOnline"
                                ref="common_chat"
                                :imgLoadingShow="imgLoadingShow"
                                :evaluateDialogShow="evaluateDialogShow"
                                :initialNewsWhere="initialNewsWhere"
                                :initialConnect="initialConnect"
                                :showCustomerService="showCustomerService"
                                :clientValue="clientValue"
                                :serverValues="{}"
                                :isImServer="isImServer"
                                :chatInfoEn="chatInfoEn"
                                :oprRoleName=" 'client'"
                                :qsAllArr="qsAllArr"
                                @addChatMsg="addChatMsg"
                                @sendMsg="sendMsg"
                                @chatCallback="chatCallback"
                                @showLeaveFun="showLeaveFun"
                                @closeEvaluateDialog="closeEvaluateDialog"
                            ></common-chat>
                            <div v-else>
                                <div v-if="showLeaveMess" class="unableService">
                                    <div></div>
                                    <div>
                                        <img src="../../../static/image/icon-unable-service.png" />
                                        <div>客服繁忙或已离线，给我们留言吧</div>
                                        <a class="btn-go-ticket" @click="showLeaveFun">给我们留言</a>
                                    </div>
                                    <div class="footer">客服软件</div>
                                </div>
                                <imLeaveMessage v-else :clientValue="clientValue"></imLeaveMessage>
                            </div>
                        </div>
                        <!-- 排队 -->
                        <div class="imClient-main" :style="mainStyles" v-else>
                            <queue
                                v-if="isQueue == '2'"
                                :isShowHeader="false"
                                :count="formQueue.queueCount"
                                @showLeaveFun="showLeaveFun"
                            >
                                <template v-slot:header>{{formQueue.remind}}</template>
                            </queue>
                        </div>
                    </div>

                    <!-- 满意度dialog -->
                    <el-dialog
                        :visible.sync="rateDialogVisible"
                        :close-on-press-escape="false"
                        :modal-append-to-body="false"
                    >
                        <im-rate ref="im_rate"></im-rate>
                    </el-dialog>
                    <!-- 离线留言dialog -->
                    <el-dialog
                        :visible.sync="leaveDialogVisible"
                        :close-on-press-escape="false"
                        :modal-append-to-body="false"
                    >
                        <im-leave ref="im_leave"></im-leave>
                    </el-dialog>
                    <!-- 结束会话dialog -->
                    <el-dialog
                        :visible.sync="logoutDialogVisible"
                        :close-on-press-escape="false"
                        :modal-append-to-body="false"
                    >
                        <p class="title">结束本次会话？</p>
                        <div class="footer">
                            <el-button type="primary" @click="logoutDialog_cancel">取消</el-button>
                            <el-button type="primary" @click="logoutDialog_submit">结束会话</el-button>
                        </div>
                    </el-dialog>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

    <script >
import defaultImg from "../../assets/img/default-avatar.jpg";
import commonChat from "@/components/common/common_chat.vue";
import { encryption } from "../util/util";
import { getQueueRule } from "@/common/api";
import imRate from "./imRate.vue";
import imLeave from "./imLeave.vue";
import imTransfer from "./imTransfer.vue";
import imLeaveMessage from "./imLeaveMessage.vue";
import queue from "./queue.vue";
import { mapGetters } from "vuex";
import "../../common/proto/message.js"; // Protobuf
import "../../common/proto/messagebody.js"; // Protobuf
import "../../common/proto/util.js"; // Protobuf
import { setTimeout } from "timers";
import { delUser } from "../../common/api";
export default {
    name: "imClient",
    components: {
        commonChat: commonChat,
        imRate: imRate,
        imLeave: imLeave,
        imTransfer: imTransfer,
        imLeaveMessage: imLeaveMessage,
        queue: queue
    },
    ...mapGetters(["getSocketValues"]),
    data() {
        return {
            rem: "",
            isImServer: false,
            imClientShow: false, // 展开聊天客户端
            isQueue: "1", // 是否展示排队框
            isQueueType: true, //
            chatInfoEn: {
                chatState: "robot", // chat状态；robot 机器人、agent 客服
                inputContent: "", // 输入框内容
                inputNewContent:"", //座席端输入框内容 无用 误删
                msgList: [], // 消息列表
                state: "on", // 连接状态;on ：在线；off：离线
                lastMsgShowTime: null, // 最后一个消息的显示时间
                searchHistoryCondition: {
                    currentSize: 1, //当前页数
                    historySumPage: 0 // 历史记录总页数
                },
                blankList: "on", //开启黑名单
                clienBankList: "on", //访客是否黑名单
                num: 0
            }, // 会话信息，包括聊天记录、状态
            clientChatEn: {
                clientChatId: "",
                clientChatName: "",
                avatarUrl: "static/image/im_client_avatar.png"
            }, // 当前账号的信息
            serverChatEn: {
				serverChatName: "您正在与客服对话",
				signature: "",
                avatarUrl: "",
                serverChatImg: "url('/static/icon/robotSetup.png')"
            }, // 服务端chat信息
            robotEn: {
                robotName: "小旺",
                avatarUrl: "static/image/im_robot_avatar.png"
            }, // 机器人信息
            faqSelected: "-1",
            clientCountry: "", //国家
            clientProvince: "", //省份
            clientCity: "", // 城市
            userId: "", // 是否第三方登录
            inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容
            selectionRange: null, // 输入框选中的区域
            shortcutMsgList: [], // 聊天区域的快捷回复列表
            logoutDialogVisible: false, // 结束会话显示
            rateDialogVisible: false, // 评价dialog
            leaveDialogVisible: false, // 留言dialog
            kfList: "", // 与服务端建立的凭证
            showCustomerService: true, // 是否显示 人工客服
            clientText: "", // 访客端通话
            clientValue: {}, //访客数据
            socket: null, //访客WebSocket 数据
            seatsOnline: true, // 坐席端是否在线
            showLeaveMess: true, // 提示留言
            initSocketSum: 0, // 重连次数
            initialNews: true, //初次连接
            initialNewsWhere: false, // 是否连接成功
            initialConnect: false, //
            evaluateDialogShow: false, // 访客是否显示评价框
            imgLoadingShow: -1, // 聊天集合，上传图片的下标
            isLineUp: false, // true:排队中
            clientDept_id: 0,
            qsAllArr: [],
            formQueue: {
                id: "",
                remind:
                    "抱歉，当前所有客服已经达到服务上限，请耐心等候，我们很快就来接",
                queueCount: 1,
                customerQueueSwitch: false
            }, //排队
			customerServiceShow: false, //显示
			stopAfterVisitorsReply: false,
			seatsGroupId: ''
        };
    },
    computed: {
        getDoamin() {
            return this.$store.imServerStore.getters.getDomain;
        },
        // headerStyles() {
        //     let obj;
        // if (this.rem) {
        //     obj = {
        //         width: "100%",
        //         height: 7 * this.rem + "px",
        //         minHeight: '2.125rem',
        //         lineHeight: 7 * this.rem + "px"
        //     };
        // } else {
        //     obj = {
        //         width: "100%",
        //         height: "60px",
        //         lineHeight: "60px"
        //     };
        // }
        //     return obj;
        // },
        mainStyles() {
            let obj;
            if (this.rem) {
                obj = {
                    width: "100%",
                    height: this.rem - 45 + "px" // 数字是.imClient-header中设置的height
                };
            } else {
                obj = {
                    width: "100%",
                    height: "550px"
                };
            }
            return obj;
        }
    },
    watch: {},
    created() {
        let bool = this.isMobile();
        this.$store.imServerStore.commit("setPlat", bool);
        console.log(222, bool);
        if (bool) {
            this.setHeight();
            //  window.addEventListener('orientationchange', this.setHeight, false);
            window.onresize = this.setHeight;
            // window.addEventListener('orientationchange', ()=>{setTimeout(this.setHeight, 1000)}, false);
        }
    },
    methods: {
        // isIosSafari() {
        //     let userAgent = navigator.userAgent;
        //     let isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        //     let isSafari =
        //         /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
        //     return isIOS && isSafari;
        // },
        isMobile() {
            let userAgent = navigator.userAgent;
            let res = !!userAgent.match(
                /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
            );
            return res;
        },
        setHeight() {
            // let bool = this.isMobile();
            let height =
                document.body.clientHeight ||
                document.documentElement.clientHeight;
            console.log(111, height);
            // this.rem = height / 100;
            this.rem = height;
            // }
        },
        closeEvaluateDialog(values) {
            this.evaluateDialogShow = values;
        },
        /**
         * 客户端预登录
         */
        clientPreLogin() {
            let that = this;
            let loginForm = {
                username: "client",
                password: "client",
                randomStr: new Date().valueOf(),
                code: "aaaa",
                grant_type: "client",
                scope: "server"
            };
            const user = encryption({
                data: loginForm,
                key: "csccsccsccsccscc",
                param: ["password"]
            });
            this.$axios({
                methods: "post",
                url: that.$httpServer.login,
                params: {
                    username: user.username,
                    password: user.password,
                    randomStr: user.randomStr,
                    code: user.code,
                    grant_type: user.grant_type,
                    scope: user.scope
                }
            }).then(res => {
                sessionStorage.setItem("token", res.data.access_token);
                this.showImClient();
            });
        },
        /**
         * 初次打开对话框
         */
        initialNewsFun() {
            if (this.initialNews) {
                let that = this;
                let msg = {
                    center: "欢迎，请问遇到了什么问题吗？",
                    contentType: 40,
                    msgType: 5,
                    sender: "1",
                    time: this.$ak.Utils.getNowFormatDate(),
                    type: "sys",
                    qsArr: [],
                    str: ""
                };
                this.$axios.get("/set/robotServiceConfig/robot").then(res => {
                    if (res.data.code === 0) {
                        if (!res.data.data.status) {
                            this.showCustomerService = false;
                            that.chatCallback();
                            this.initialNews = false;
                            return false;
                        }
                        if (res.data.data.name) {
							this.serverChatEn.serverChatName =
                                res.data.data.name;
						}
                        if (res.data.data.headPhoto) {
                            this.serverChatEn.serverChatImg =
                                "url(" + res.data.data.headPhoto + ")";
                        }
                        msg.center = res.data.data.welcomeText;
                        if (res.data.data.familiarQuestion) {
                            let params = {
                                ids: res.data.data.familiarQuestion
                            };
                            this.$axios
                                .get("/set/questionConfig/list", { params })
                                .then(data => {
                                    let result = data.data.data;
                                    if (result) {
                                        for (
                                            let i = 0;
                                            i < result.length;
                                            i++
                                        ) {
                                            msg.qsArr.push({
                                                id: result[i].id,
                                                answer:
                                                    result[i].defaultAnswerRich,
                                                question:
                                                    result[i].questionTitle
                                            });
                                            msg.str += `<p><a href="javascript:;" inx="${i}">${i +
                                                1 +
                                                ".&nbsp;" +
                                                result[i]
                                                    .questionTitle}</a></p>`;
                                            that.qsAllArr = msg.qsArr;
                                        }
                                    }
                                    that.addChatMsg(msg, () => {
                                        this.$refs.common_chat.goEnd();
                                    });
									this.initialNews = false;
									this.getMsg();
                                });
                        } else {
                            that.addChatMsg(msg, () => {
                                this.$refs.common_chat.goEnd();
                            });
							this.initialNews = false;
							this.getMsg();
                        }
                    }else{
						this.getMsg();
					}
                });
            }
		},
		/**
         * 获取推广信息
         */
		getMsg(){
			let groupIDArray = window.location.href.split("?");
            if (groupIDArray.length == 0) {
                this.$message1({
                    message: "聊天链接地址错误",
                    type: "error"
                });
                return;
            }

            let groupID = "";
			let seatsGroupId = "";
            if (groupIDArray[1].indexOf("seatsGroupId") > -1) {
                groupID = groupIDArray[1].split("&")[0]; //防止多个参数
                seatsGroupId = "";
                seatsGroupId = groupID.substring(
                    parseInt(groupID.indexOf("=")) + 1,
                    groupID.length
                ); //组ID
            } else {
                this.$message1({
                    message: "对话链接地址错误！",
                    type: "error"
                });
                return;
            }
			let params = {
				ownerId: seatsGroupId
			}
			this.seatsGroupId = seatsGroupId;
			this.$axios.get('/set/robotServiceConfig/promotionMessage',{params}).then( res => {
				if(res && res.data.data){
					let data = res.data.data;
					this.stopAfterVisitorsReply = data.stopAfterVisitorsReply;
					this.promotionMessages = data.promotionMessages;
					clearInterval(window.timeoutFuc);
					window.intervalTime = 0;
					window.timeoutFuc = null;
					window.timeoutFuc = setInterval( () => {
						if(window.intervalTime > 60){
							clearInterval(window.timeoutFuc)
							return;
						}
						for(let i=0;i<data.promotionMessages.length;i++){
							if(data.promotionMessages[i].delay == window.intervalTime){
								this.addChatMsg({
									center: data.promotionMessages[i].message,
									contentType: 40,
									msgType: 5,
									sender: "1",
									time: this.$ak.Utils.getNowFormatDate(),
									type: "sys"
								});
							}
						}
						window.intervalTime++;
					},1000)
				}
			})
		},
        /**
         * 获取排队信息
         */
        queueTitle() {
            getQueueRule(this.clientDept_id).then(res => {
                if (res.data.code === 0 && res.data.data) {
                    this.formQueue.remind = res.data.data.remind;
                }
            });
        },
        /**
         * 转人工
         */
        transferToManpowe() {
            let that = this;
            let msg = {
                center: "正在为您转接,请稍后...",
                contentType: 10,
                msgType: 5,
                sender: "1",
                time: "",
                type: "sys"
            };
            that.addChatMsg(msg, () => {
                that.$refs.common_chat.goEnd();
            });
        },
        /**
         * 初始化 服务端、客户端创建 ID
         */
        init: function() {
            let that = this;
            let serverChatEn = "";
            // 判断本地是否存在clientId
            if (localStorage.getItem("clientId")) {
                serverChatEn = localStorage.getItem("clientId");
            } else {
                serverChatEn = that.$ak.Utils.generateMixed(18); //随机ID(唯一)，用于获取访客ID
                localStorage.setItem("clientId",serverChatEn);
            }
            let groupIDArray = window.location.href.split("?");
            if (groupIDArray.length == 0) {
                this.$message1({
                    message: "聊天链接地址错误",
                    type: "error"
                });
                return;
            }

            let groupID = "";
            let seatsGroupId = "";
            if (groupIDArray[1].indexOf("seatsGroupId") > -1) {
                groupID = groupIDArray[1].split("&")[0]; //防止多个参数
                seatsGroupId = "";
                seatsGroupId = groupID.substring(
                    parseInt(groupID.indexOf("=")) + 1,
                    groupID.length
                ); //组ID
            } else {
                this.$message1({
                    message: "对话链接地址错误！",
                    type: "error"
                });
                return;
            }
            that.clientDept_id = seatsGroupId;
            let senderIdArray = "";
            if (groupIDArray[1].indexOf("userId") > -1) {
                senderIdArray = groupIDArray[1].split("&")[1];
                that.userId = senderIdArray.substring(
                    parseInt(senderIdArray.indexOf("=")) + 1,
                    senderIdArray.length
                ); //坐席ID
            }
            that.isQueue = "1"; //正在通话
            that.$axios
                .post(that.$httpServer.checkBlackList, {
                    visitorId: serverChatEn
                })
                .then(opt => {
					// 判断是否黑名单
                    if(opt){
                        if (opt.data.data != null) {
                        if (
                            opt.data.data == "" ||
                            (JSON.parse(opt.data.data).data.country == 0 && 
                            JSON.parse(opt.data.data).data.province == 0 )
                        ) {
                            that.clientProvince = "未知区域";
                            that.clientCity = "";
                            that.clientCountry = "";
                        } else {
                            that.clientProvince = JSON.parse(
                                opt.data.data
                            ).data.province;
                            that.clientCity = JSON.parse(
                                opt.data.data
                            ).data.city;
                            that.clientCountry = JSON.parse(
                                opt.data.data
                            ).data.country;
                            
                        }
                        let isIe = that.$ak.Utils.myBrowser().toLowerCase().indexOf('ie') > -1
                        let url =
                                that.$httpServer.getImClientBindInfo +
                                    "?clientId=" +
                                    serverChatEn +
                                    "&seatsGroupId=" +
                                    seatsGroupId +
                                    "&clientName=" +
                                    document.title +
                                    "&clientBrowser=" +
                                    that.$ak.Utils.myBrowser() +
                                    "&clientPlatform=" +
                                    that.$ak.Utils.getOS() +
                                    "&clientProvince=" +
                                    that.clientProvince +
                                    "&clientCity=" +
                                    that.clientCity+
                                    "&userId=" +
                                    that.userId+
                                    "&clientCountry=" +
                                    that.clientCountry
                        if(isIe) {
                            url = encodeURI(url)
                        }
                        that.$axios
                            .get(url)
                            .then(res => {
                                // 判断座席端是否上线
                                if (
                                    res.data.data != "" &&
                                    res.data.data != null
                                ) {

                                    // 判断是否排队
                                    if (res.data.data.bindInfo.isLineUp > 0) {
                                        that.isQueueType = false; //展示排队
                                        that.isQueue = "2"; //排队
                                        that.formQueue.queueCount =
                                            res.data.data.lineUpNum;
                                        that.queueTitle();
                                    } else {
                                        that.$refs.common_chat.init();
                                    }
                                    localStorage.setItem(
                                        "clientId",
                                        res.data.data.bindInfo.clientId
                                    );
                                    that.clientValue = res.data.data;
                                    if (res.data.data.bindInfo.businessCardName) {
                                        that.serverChatEn.serverChatName =
                                            res.data.data.bindInfo.businessCardName;
                                    }else if(res.data.data.bindInfo.seatsName){
										that.serverChatEn.serverChatName =
                                            res.data.data.bindInfo.seatsName;
									}
									if (res.data.data.bindInfo.signature) {
										that.serverChatEn.signature =
											res.data.data.bindInfo.signature;
									}
                                    that.serverChatEn.serverChatImg =
                                        "url(" + defaultImg + ")";
                                    if (res.data.data.bindInfo.headUrl) {
                                        that.serverChatEn.serverChatImg =
                                            "url(" +
                                            res.data.data.bindInfo.headUrl +
                                            ")";
                                    }
                                    // 转接延迟
                                    setTimeout(() => {
										that.regSocket(seatsGroupId); // 创建客户端 通话
                                    }, 1500);
                                } else {
                                    that.isQueue = "3";
                                    that.seatsOnline = false;
                                }
                            })
                    } else {
                        that.addChatMsg(
                            {
                                center: "",
                                contentType: 20,
                                msgType: 5,
                                sender: "1",
                                time: "",
                                type: "sys"
                            },
                            () => {
                                that.$refs.common_chat.goEnd();
                            }
                        );
                    }
                    }

                });
        },
        /**
         * 排队转通话
         */
        showImQueue() {
            this.isQueue = "1"; //更改头部
            this.isQueueType = true;
			this.seatsOnline = true;
			let params = {
				ownerId: this.clientDept_id
			}
			this.$axios.get('/set/robotServiceConfig/promotionMessage',{params}).then( res => {
				if(res && res.data.data){
					let data = res.data.data;
					this.stopAfterVisitorsReply = data.stopAfterVisitorsReply;
					clearInterval(window.timeoutFuc2);
					window.intervalTime2 = 0;
					window.timeoutFuc2 = null;
					window.timeoutFuc2 = setInterval( () => {
						if(window.intervalTime2 > 60){
							clearInterval(window.timeoutFuc2)
							return;
						}
						for(let i=0;i<data.promotionMessages.length;i++){
							if(data.promotionMessages[i].delay == window.intervalTime2){
								this.addChatMsg({
									center: data.promotionMessages[i].message,
									contentType: 0,
									sender: "1",
									time: this.$ak.Utils.getNowFormatDate(),
									type: "sys"
								});
							}
						}
						window.intervalTime2++;
					},1000)
				}
			})
        },
        /**
         * 显示客户端
         */
        showImClient() {
            this.imClientShow = true;
            this.showLeaveMess = true;
            this.seatsOnline = true;
            this.showCustomerService = true;
            this.isQueueType = true;
            this.isQueue = "1";
            if (this.socket == null) {
                this.chatInfoEn.state = "on";
            }
            this.chatInfoEn.num = 0;
            setTimeout(() => {
                this.initialNewsFun(); //初始化消息
                // let bool = this.isIosSafari();
                // if (bool) {
                //     document.getElementsByClassName(
                //         "imClient-main"
                //     )[0].style.height = "88vh";
                // }
            }, 300);

            // this.initClientData(); //用户下线初始化值
        },
        /**
         *  留言
         */
        showLeaveFun() {
            this.isQueueType = true; //是否显示排队框
            this.seatsOnline = false;
            this.showLeaveMess = false;
            this.isQueue = "3"; //留言关闭排队框
        },
        /**
         * 用户下线初始化访客值
         */
        initClientData() {
            this.chatInfoEn = {
                chatState: "robot", // chat状态；robot 机器人、agent 客服
                inputContent: "", // 输入框内容
                msgList: [], // 消息列表
                state: "on", // 连接状态;on ：在线；off：离线
                lastMsgShowTime: null, // 最后一个消息的显示时间
                searchHistoryCondition: {
                    currentSize:1, //当前页数
                    historySumPage: 0 // 历史记录总页数
                },
                blankList: "on", //开启黑名单
                clienBankList: "on", //访客是否黑名单
                num: 0
            }; //初始化访客端对象
            this.socket = null; // 关闭会话
            this.initialNews = true; // 转换状态为初次登录
            this.isQueueType = true; // 关闭排队
            this.showCustomerService = true; // 关闭查看历史、开启转人工按钮
            this.seatsOnline = true; // 转换状态为初次登录
            this.isQueue = "1"; // 转换状态为初始会话状态
        },
        /**
         * 注册socket
         *
         */

        // chatInfoEn: {
        //         chatState: 'robot', // chat状态；robot 机器人、agent 客服
        //         inputContent: '', // 输入框内容
        //         msgList: [], // 消息列表
        //         state: 'on', // 连接状态;on ：在线；off：离线
        //         lastMsgShowTime: null // 最后一个消息的显示时间
        //     }, // 会话信息，包括聊天记录、状态
        regSocket: function(ownerId) {
            let that = this;
            if (window.WebSocket) {
                that.socket = new WebSocket(
                    "wss://" + this.$API_CONFIG.client_api + "/ws"
                );
                that.socket.binaryType = "arraybuffer";
                that.socket.onmessage = function(event) {
                    var ta = "";
                    if (event.data instanceof ArrayBuffer) {
                        var msg = proto.Model.deserializeBinary(event.data);
                        var sender = msg.getSender();
                        var time = msg.getTimestamp();
                        var msgCon = proto.MessageBody.deserializeBinary(
                            msg.getContent()
                        );
                        var msgType = msg.getCmd();
                        var contentType = msgCon.getType();
                        let clientValues = {}; // 消息集合
                        ta += "类型：" + msgType + "\r\n";
                        if (msgType == 1) {
                            ta += "消息类型：绑定socket" + "\r\n";
                        } else if (msgType == 2) {
                            
                            // 检查心跳时间 - 发送时间 > 30000ms
                            let sendMsg = that.$data.chatInfoEn.msgList; // 发送的信息
                            if(sendMsg.length > 0){
                                that.lastSendTime = (new Date(sendMsg[sendMsg.length-1].time)).getTime();
                            }
                            if((((new Date()).getTime() - that.lastSendTime)/1000 < 300)){
                                ta += "消息类型：访客端检查心跳" + "\r\n";
                                let message1 = new proto.Model();
                                message1.setCmd(2);
                                message1.setMsgtype(4);
                                that.socket.send(message1.serializeBinary());
                            }else{
                                ta += "消息类型：访客端停止检查心跳" + "\r\n";
                            }
                        } else if (msgType == 3) {
                            ta += "消息类型：用户上线推送" + "\r\n";
                        } else if (msgType == 4) {
                            ta += "消息类型：用户下线推送" + "\r\n";
                        } else if (msgType == 5) {
                            ta += "消息类型：推送消息" + "\r\n";
                        } else if (msgType == 6) {
                            ta += "消息类型：断线重连" + "\r\n";
                        } else if (msgType == 7) {
                            ta += "消息类型：转接" + "\r\n";
                        }
                        ta += "时间：" + time + "\r\n";
                        ta += "发送人：" + sender + "\r\n";
                        ta += "消息内容：" + "\r\n";
                        if (contentType == 0) {
                            ta += "消息内容类型：文字" + "\r\n";
                            ta +=
                                that.$utilHtml.HtmlUtil.htmlEncodeByRegExp(
                                    msgCon.getContent()
                                ) + "\r\n";
                        } else if (contentType == 1) {
                            ta += "消息内容类型：图片" + "\r\n";
                            // $("#base64").attr("src",msgCon.getContent());
                        } else if (contentType == 2) {
                            ta += "消息内容类型：文件" + "\r\n";
                            ta += msgCon.getContent();
                        } else if (contentType == 3) {
                            ta += "消息内容类型：邀评" + "\r\n";
                            that.evaluateDialogShow = true;
                        }
                        console.log(ta)
                        /**
                         * 坐席转接
                         */
                        if (msgType == 7) {
                            that.clientValue.bindInfo.seatsId = parseInt(
                                msg.getSender()
                            );
                            that.clientValue.bindInfo.trackId = msg.getTrackid();
                            let message1 = new proto.Model();
                            message1.setCmd(2);
                            message1.setMsgtype(4);
                            that.socket.send(message1.serializeBinary());
                        }
                        /**
                         * 排队转通话
                         */
                        if (msgType == 9) {
                            that.showImQueue();
                        }
                        clientValues.type = "sys"; // 服务端回传数据
                        clientValues.msgType = msgType; // 用户类型
                        clientValues.trackid = that.clientValue.trackId; // 会话ID
                        clientValues.time = time; // 时间：
                        clientValues.sender = sender; // 发送人：
                        clientValues.contentType = contentType; // 消息内容类型
                        clientValues.center = msgCon.getContent(); // 消息内容
                        ;

                        // 连接成功
                        if (!that.initialNewsWhere) {
                            that.initialNewsWhere = true;
                            that.$data.chatInfoEn.msgList = [];
                            that.$data.chatInfoEn.searchHistoryCondition = {
                                currentSize: 0, //当前页数
                                historySumPage: 1 // 历史记录总页数
                            }
                        }
                        if (!that.initialConnect) {
                            that.initialConnect = true;
                        }
                        // 当消息内容为空时，不推送
                        if (
                            msgCon.getContent() == "" ||
                            msgCon.getContent() == null
                        ) {
                            return;
                        } else {
                            if (!that.imClientShow) {
                                if (that.chatInfoEn.num > 99) return;
                                that.chatInfoEn.num++;
                            } else {
                                that.chatInfoEn.num = 0;
                            }
                        }
                        that.addChatMsg(clientValues, () => {
                            that.$refs.common_chat.goEnd();
                        });
                    }
                };

                that.socket.onopen = function(event) {
                    // var ta = document.getElementById('responseText');
                    // ta.value = "这里显示服务器推送信息"+"\r\n";
                    let message = new proto.Model();
                    message.setVersion("1.0");
                    message.setCmd(1);
                    message.setClientplatform(that.$ak.Utils.getOS()); // 系统
                    message.setClientbrowser(that.$ak.Utils.myBrowser()); // 浏览器
                    message.setCountry(that.clientCountry); // 国家
                    message.setProvince(that.clientProvince); // 省份
                    message.setCity(that.clientCity); // 城市
                    message.setUserid(that.userId); // 用户ID 判断是否为登录用户
                    message.setGroupid(
                        that.clientValue.bindInfo.seatsGroupId.toString()
                    ); // 坐席组ID
                    message.setSender(that.clientValue.bindInfo.clientId); //访客id
                    message.setReceiver(
                        that.clientValue.bindInfo.seatsId.toString()
                    ); //坐席id
                    // message.setReceiver("4");//坐席id
                    message.setMsgtype(1);
                    message.setRole("2"); // 访客
                    message.setFlag(1);
                    // 是否排队中
                    if (that.clientValue.bindInfo.isLineUp > 0) {
                        message.setIslineup(1);
                    } else {
						message.setIslineup(0);
						let params = {
							ownerId: ownerId
						}
						that.$axios.get('/set/robotServiceConfig/promotionMessage',{params}).then( res => {
							if(res && res.data.data){
								let data = res.data.data;
								that.stopAfterVisitorsReply = data.stopAfterVisitorsReply;
								clearInterval(window.timeoutFuc1);
								window.intervalTime1 = 0;
								window.timeoutFuc1 = null;
								window.timeoutFuc1 = setInterval( () => {
									if(window.intervalTime1 > 60){
										clearInterval(window.timeoutFuc1)
										return;
									}
									for(let i=0;i<data.promotionMessages.length;i++){
										if(data.promotionMessages[i].delay == window.intervalTime1){
											that.addChatMsg({
												center: data.promotionMessages[i].message,
												contentType: 0,
												sender: "1",
												time: that.$ak.Utils.getNowFormatDate(),
												type: "sys"
											});
										}
									}
									window.intervalTime1++;
								},1000)
							}
						})
                    }
                    message.setToken(that.clientValue.token);
                    message.setTrackid(that.clientValue.bindInfo.trackId); //会话id
                    message.setClientip(that.clientValue.bindInfo.clientIp);
                    var bytes = message.serializeBinary();
                    that.socket.binaryType = "arraybuffer";
                    // console.log("client："+bytes);
                    that.socket.send(bytes);
                    that.lastSendTime = (new Date()).getTime(); //最后一次发送时间
                };
                that.socket.onerror = function(event) {
                    // that.chatCallback(); // 重连
                    // alert("error: "+event.data)
                };
                that.socket.onclose = function(event) {
                    //1006：:期望连接，但连接不成功
                    // that.initialNewsWhere 已经连接成功过，不需要成功发起连接
                    if (event.code == 1006 && !that.initialNewsWhere) {
                        if (that.initSocketSum >= 10) {
                            that.$message1({
                                showClose: true,
                                duration: 0, // 不自动关闭
                                message: "连接服务失败，请重新连接",
                                type: "error"
                            });
                            return;
                        }
                        that.initSocketSum += 1;
                        console.log("重连：" + that.initSocketSum);
                        setTimeout(() => {
                            that.regSocket();
                        }, 2000);
                    } else {
                        that.isQueue = "4"; //对话已结束
                        that.$data.chatInfoEn.state = "off";
                        that.socket = null;
                        that.initialConnect = false;
                        // 判断是否排队 排队对话关闭，转初始化
                        if(!that.isQueueType){
                            that.initialNews = true; //初始化
                            that.initialNewsWhere = false;
                            that.showImClient();
                        }
						that.showCustomerService = true; // 显示转接
						clearInterval(window.timeoutFuc1);
                        // that.initClientData(); //用户下线初始化值
                    }
                    console.log(event.code);
                };
                that.$store.imServerStore.commit(
                    "setClientSocket",
                    that.socket
				);
            } else {
                alert("您的浏览器不支持会话！");
                that.showCustomerService = true; // 显示转接

            }
        },

        /**
         * 结束会话
         */
        closeChat: function() {
            this.imClientShow = false;
        },

        /**
         * 添加chat对象的msg
         * @param {Object} msg 消息对象；eg：{role:'sys',content:'含有新的消息'}
         * @param {String} msg.role 消息所有者身份；eg：'sys'系统消息；
         * @param {String} msg.contentType 消息类型；text:文本(默认)；image:图片
         * @param {String} msg.content 消息内容
         * @param {Function} successCallback 添加消息后的回调
         */
        addChatMsg: function(msg, successCallback) {
            let that = this;
            // 1.设定默认值
            this.$data.chatInfoEn.chatState = "agent"; // 客户端数据显示
            // 如果上传为图片，只需替换
            // if(msg.contentType == 1){
            //     this.$data.chatInfoEn.msgList[this.imgLoadingShow].center = msg.center; // 替换URL地址
            //     return;
            // }else{

            // }
            // 2)插入消息

            // 是否已加入黑名单
            if (msg.contentType == 20) {
                let that = this;
                this.$data.chatInfoEn.state = "off";
                this.$data.chatInfoEn.blankList = "off";
                this.$data.chatInfoEn.clienBankList = "off";
                // 删除转接提示信息
                that.$data.chatInfoEn.msgList.map((v, i) => {
                    if (v.contentType == 10) {
                        that.$data.chatInfoEn.msgList.splice(i, 1);
                    }
                });
            } else {
                this.$data.chatInfoEn.state = "on";
                this.$data.chatInfoEn.blankList = "on";
                this.$data.chatInfoEn.clienBankList = "on";
            }
            if (msg.center == "" && msg.contentType != 3) {
                return;
            }
            msg.time =
                msg.time == "" ? this.$ak.Utils.getNowFormatDate() : msg.time;
            var msgList = this.$data.chatInfoEn.msgList
                ? this.$data.chatInfoEn.msgList
                : [];
            msgList.push(msg);
            // 3.设置chat对象相关属性
            this.$data.chatInfoEn.msgList = msgList;
            // if (msg.contentType != "1" && msg.contentType != "2") {
            //     this.chatInfoEn.inputContent = ""; // 发送成功清空
            // }
            if (msg.contentType == "3") {
                this.evaluateDialogShow = true;
            }
            // 更改聊天tilte
            if (
                msg.contentType != 40 &&
                msg.contentType != 20 &&
                msg.contentType != -20 &&
                msg.contentType != 10 &&
                msg.center != ""
            ) {
                setTimeout(
                    () => {
                        if (msg.type == "client") {
                            if (!(that.isQueue == "5")) {
                                that.isQueue = "5";
                            }
                        } else {
                            that.isQueue = "1";
                        }
                    },
                    msg.type == "client" ? 2000 : 0
                );
            }
            // 4.回调
            if (!this.initialNews) {
                this.goEnd();
            }
        },

        /**
         * 发送消息
         * @param {Object} rs 回调对象
         */
        sendMsg: function(rs) {
			let that = this;
            if (!window.WebSocket) {
                return;
			}
            // let reg = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;
            // if(reg.test(rs.center)){
                let length = this.chatInfoEn.msgList.length;
                if (length > 0) {
                    let obj = this.chatInfoEn.msgList[length - 1];

                    if (obj.contentType == 40 && rs.contentType == 0) {
                        this.addChatMsg({
                            center: rs.center,
                            contentType: 40,
                            msgType: 5,
                            sender: "1",
                            time: this.$ak.Utils.getNowFormatDate(),
                            type: "client"
						});
						if(this.stopAfterVisitorsReply){
							clearInterval(window.timeoutFuc);
						}
                        // if(obj.code){
                        //     let params = {
                        //         code: obj.code,
                        //         inputValue: rs.center
                        //     };
                        //     this.$axios
                        //         .get("/set/questionConfig/command", { params })
                        //         .then(res => {
                        //             if (res.data.code == 0) {
                        //                 this.addChatMsg({
                        //                     center: res.data.data,
                        //                     contentType: 40,
                        //                     msgType: 5,
                        //                     sender: "1",
                        //                     time: this.$ak.Utils.getNowFormatDate(),
                        //                     type: "sys"
                        //                 });
                        //             }
                        //         });
                        //     return;
                        // }else{
							let reg = /<img[^>]*>/gi;
							if(reg.test(rs.center)){
								setTimeout( () => {
									this.addChatMsg({
										center: '抱歉，能否再描述一下您的问题，没太听懂呢~',
										contentType: 40,
										msgType: 5,
										sender: "1",
										time: this.$ak.Utils.getNowFormatDate(),
										type: "sys"
									});
								},1000)
								return;
							}
                            let params = {
                                inputValue: rs.center
                            };
                            this.$axios
                                .get("/set/questionConfig/search", { params })
                                .then(res => {
                                    if (res.data.code == 0) {
                                        let text = res.data.data.content[0] ? res.data.data.content[0].defaultAnswerRich : '抱歉，能否再描述一下您的问题，没太听懂呢~'
                                        this.addChatMsg({
                                            center: text,
                                            contentType: 40,
                                            msgType: 5,
                                            sender: "1",
                                            time: this.$ak.Utils.getNowFormatDate(),
                                            type: "sys"
                                        });
                                    }
                                });
                            return;
                        // }
                    }
                }
            // }

            if (that.socket == null) {
                this.$message1({
                    message: "您的问题需要专员解答，请转接专员服务！",
                    type: "error"
                });
                return;
            }
            if (that.socket.readyState == WebSocket.OPEN) {
                var message = new proto.Model();
                var content = new proto.MessageBody();
                message.setMsgtype(4);
                message.setRole(2);
                message.setCmd(5);
                message.setGroupid(
                    that.clientValue.bindInfo.seatsGroupId.toString()
                ); // 坐席组ID
                message.setToken(that.clientValue.token);
                message.setSender(that.clientValue.bindInfo.clientId); // 访客ID
                message.setReceiver(
                    JSON.stringify(that.clientValue.bindInfo.seatsId)
                ); // 坐席ID
                content.setContent(rs.center);
                content.setType(rs.contentType); //0、文字,1、图片,2、文件,3、转接,4、访客正在输入,5、访客关闭输入状态
                message.setContent(content.serializeBinary());
                message.setTrackid(that.clientValue.bindInfo.trackId);
                message.setType(1); //聊天类型,1单聊 ，2群聊
                that.socket.binaryType = "arraybuffer";
                that.socket.send(message.serializeBinary());
                // 2.添加到消息集合李
				that.addChatMsg(rs, function() {});
				if(that.stopAfterVisitorsReply){
					clearInterval(window.timeoutFuc1);
				}
                console.log(rs.center);
            } else {
                alert("聊天服务连接失败！");
            }
        },

        /**
         * 注销dialog_提交
         */
        logoutDialog_submit: function() {
            this.$data.logoutDialogVisible = false;
            this.addChatMsg({
                role: "sys",
                content: "本次会话已结束"
            });
        },

        /**
         * 注销dialog_取消
         */
        logoutDialog_cancel: function() {
            this.$data.logoutDialogVisible = false;
        },

        /**
         * 聊天记录滚动到底部
         */
        goEnd: function() {
            this.$refs.common_chat.goEnd();
        },

        /**
         * chat回调
         */
        chatCallback: function(rs) {
			clearInterval(window.timeoutFuc);
            this.chatInfoEn = {
                chatState: "robot", // chat状态；robot 机器人、agent 客服
                inputContent: "", // 输入框内容
                msgList: [], // 消息列表
                state: "on", // 连接状态;on ：在线；off：离线
                lastMsgShowTime: null, // 最后一个消息的显示时间
                searchHistoryCondition: {
                    currentSize:0, //当前页数
                    historySumPage: 1 // 历史记录总页数
                },
                blankList: "on", //开启黑名单
                clienBankList: "on", //访客是否黑名单
                num: 0
            }; //初始化访客端对象
            this.showCustomerService = false; //关闭
            this.transferToManpowe(); //成功创建通话之前的消息提示
			this.init();
        },
        /**
         * 显示评分dialog
         */
        showRateDialog: function() {
            this.$data.rateDialogVisible = true;
            this.$nextTick(() => {
                // this.init();
                // this.$refs.im_rate.init();
            });
        },
        /**
         * 显示留言dialog
         */
        showLeaveDialog: function() {
            this.$data.leaveDialogVisible = true;
            this.$nextTick(() => {
                // this.init();
                // this.$refs.im_leave.init();
            });
        }
    },
    mounted() {
        this.clientPreLogin();
    },
    updated(){
        console.log(111)
    }
};
</script>

    <style lang="less" scoped>
@import "../../common/css/base.less";

.imClient-wrapper {
    overflow-x: hidden;
    z-index: 10000;
    box-sizing: border-box;
    #common-wrapper();
}

.el-row,
.el-col {
    margin: 0 !important;
    padding: 0 !important;
}
.imClient-inner {
    position: relative;
    // width: auto;
    // position: fixed;
    // bottom: 0;
    // right: 35px;
    // width: 320px;
    // height: 480px;
    // margin: 0 auto;
    // overflow: hidden;
    // box-shadow: 0 1px 5px 2px #ccc;
    .evaluationMask {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.35);
        z-index: 3;
    }
    .imClient-header {
        width: 100%;
        height: 45px;
        line-height: 45px;
        // position: relative;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        // height: 7vh;
        // line-height: 7vh;
        box-sizing: border-box;
        background: #007aff;
        color: #ffffff;
        .customerService {
            margin-bottom: 5px;
            font-size: 0.75rem;
            font-weight: 100;
        }
        .serverChatImg {
            width: 34px;
            height: 34px;
            background-position: 0px 0px;
            background-size: 34px 34px;
            background-repeat: no-repeat;
            display: inline-block;
            vertical-align: middle;
            border-radius: 50%;
        }
        .nameBox {
            display: inline-block;
			max-width: 150px;
			line-height: 20px;
			vertical-align: middle;
			.name{
				white-space: nowrap;
				text-overflow: ellipsis;
				width: 100%;
				overflow: hidden;
				font-size: 14px;
			}
			.signature{
				white-space: nowrap;
				text-overflow: ellipsis;
				width: 100%;
				overflow: hidden;
				font-size: 12px;
			}
        }
        .name-wrapper {
            margin-left: 20px;
        }
        .logo {
            height: 45px;
            width: auto;
        }
        .opr-wrapper {
            vertical-align: middle;
            right: 20px;
            font-size: 16px;

            .fa {
                margin-left: 10px;
            }
            i {
                vertical-align: middle;
            }
            .btnCallAgent {
                // float: left;
                // height: 22px;
                // line-height: 22px;
                vertical-align: middel;
                font-size: 12px;
                margin-right: 2px;
                color: #fff;
                filter: alpha(opacity=80);
                opacity: 0.8;
                margin-right: 6px;
                cursor: pointer;
            }
            .btnCallAgent:hover {
                opacity: 1;
            }
        }
    }
    .imClient-main {
        > div {
            width: 100%;
            height: 100%;
        }
        // max-width: 100%;
        // height: 550px;
        // position: relative;
        // & > .item {
        //     float: left;
        //     height: 100%;
        //     border-top-width: 0px;
        //     border-right-width: 0px;
        //     box-sizing: border-box;
        //     &:last-child {
        //         border-right-width: 1px;
        //     }
        // }
        // & > .imClientChat-wrapper {
        //     width: 100%;
        //     border: 1px solid #ccc;
        // }
        // & > .imClientInfo-wrapper {
        //     width: 300px;
        // }
    }
}
// 信息区域
.imClientInfo-wrapper {
    width: 100%;
    height: 100%;
    background: #ffffff;
    .imClientInfo-notice-wrapper,
    .imClientInfo-faq-wrapper {
        .imClientInfo-item-header {
            font-weight: bolder;
            font-size: 16px;
            color: #1072b5;
            padding: 10px 15px 0;
        }
    }
    .imClientInfo-notice-wrapper {
        .imClientInfo-notice-main {
            padding: 0 15px;
            & > .link {
                margin: 10px 0;
                font-size: 12px;
                color: #000000;
            }
        }
    }
    .imClientInfo-faq-wrapper {
        height: 380px;
        border-top: 1px solid #ccc;
        .imClientInfo-faq-main {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            .el-collapse {
                border: 0px;
                .el-collapse-item__header {
                    position: relative;
                    padding: 0px 15px;
                    font-size: 12px;
                    background: transparent;
                    color: #000000;
                    &.is-active {
                        color: #f7455d;
                    }
                    .el-collapse-item__arrow {
                        position: absolute;
                        left: 267px;
                    }
                }
                .el-collapse-item__wrap {
                    background: transparent;
                    .el-collapse-item__content {
                        font-size: 12px;
                        color: #959699;
                        padding: 0px 15px 10px;
                    }
                }
            }
        }
    }
}

// element-UI
.el-dialog {
    width: 500px;
    background: #ffffff;
    color: #000000;
}
.imClient-body {
    margin: 0 auto;
    // position: fixed;
    // bottom: 0;
    // right: 60px;
    width: auto;
    height: auto;
    padding: 0;
    border: 0;
    font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB",
        "Microsoft YaHei", sans-serif;
    background-color: transparent;
}
.imClient-body .imClient-bto {
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.16);
    cursor: pointer;
    text-decoration: none;
    background-color: #007aff;
    position: relative;
    .unreadMsg {
        position: absolute;
        top: -16px;
        left: -10px;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1);
    }
}
.imClient-bin-border {
    display: block;
    float: left;
    width: 1px;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.08);
    // vertical-align: middle;
}
.imClient-bto .imClient-bin-icon {
    display: block;
    float: left;
    width: 22px;
    height: 22px;
    margin: 10px 10px 0;
}
.imClient-bto .imClient-bin-text {
    display: block;
    float: left;
    height: 40px;
    margin: 0 10px;
    line-height: 40px;
    overflow-y: hidden;
    font-size: 16px;
    color: #fff;
}
.pull-left {
    display: flex;
    align-items: center;
}
.pull-left .agent-avatar {
    width: 30px;
    height: 30px;
    border-radius: 15px;
    box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1);
}
.pull-left span {
    margin-left: 6px;
    font-size: 13px;
}

.footer {
    height: 1.875rem;
    background-color: #f4f4f4;
    border-top: 1px solid #ededed;
    text-align: center;
    line-height: 30px;
    // position: absolute;
    width: 100%;
    // bottom: -20px;
}
.footer span {
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    color: #b7bac2;
}
.unableService {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    // position: absolute;
    // left: 0;
    // right: 0;
    // z-index: 3;
    width: 100%;
    // top: 60px;
    // bottom: 30px;
    background-color: #fff;
    text-align: center;
}
.unableService img {
    display: block;
    width: 4rem;
    height: 3.125rem;
    margin: 0 auto 1rem;
    // margin: 80px auto 0;
}
.unableService > div {
    // margin-top: 20px;
    color: #979797;
}
.unableService .btn-go-ticket {
    background-color: #007aff;
    color: #fff;
    display: block;
    width: 210px;
    height: 35px;
    margin: 20px auto 0;
    line-height: 35px;
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
}
</style>
