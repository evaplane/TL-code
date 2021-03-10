<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-01 17:14:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-22 16:13:33
 -->
<template>
    <div class="main">
        <left @openOrCloseStatus="openOrCloseStatus"></left>
        <!-- <video ref="vio" style="display:none"></video>
        <iframe ref="ifa" allow="autoplay" style="display:none" src="../../../static/video/ly.mp3"></iframe> -->
    </div>
</template>
<script>
import left from "./left.vue";
import { mapGetters } from "vuex";
import "../../common/proto/message.js"; // Protobuf
import "../../common/proto/messagebody.js"; // Protobuf
import { deleteReplyById } from '../../common/api';
// import { setTimeout } from 'timers';
export default {
    components: {
        left: left
    },
    ...mapGetters(["getSocketValues"]),
    data() {
        return {
            listener: false,
            listenerFun: [],
            initSocketSum: 0, //重连次数
            serverSend: false, // 是否连接成功
            messageTitle: {
                time: 0,
                title: "对话",
                timer: null
			}
        };
    },
    computed: {
        getDoamin() {
            return this.$store.imServerStore.getters.getDomain;
        },
        userInfo() {
            return this.$store.imServerStore.state.userInfo;
        }
    },
    watch: {
        listener: {
            handler: function(newV, old) {
                if (newV) {
                    let that = this;
                    var hiddenProperty =
                        "hidden" in document
                            ? "hidden"
                            : "webkitHidden" in document
                            ? "webkitHidden"
                            : "mozHidden" in document
                            ? "mozHidden"
                            : null;
                    var visibilityChangeEvent = hiddenProperty.replace(
                        /hidden/i,
                        "visibilitychange"
                    );
                    if (document[hiddenProperty]) {
                        console.log("页面非激活");
                        that.show();
                    }
                }
            }
        }
    },
    destroyed() {
        // window.onbeforeunload = null;
    },
    methods: {
        clear: function() {
            clearTimeout(this.messageTitle.timer);
            document.title = "对话";
            this.listener = false;
        },
        // title
        show: function() {
            let that = this;
            let title = that.messageTitle.title
                .replace("【　　　】", "")
                .replace("【您有新消息】", "");
            // 定时器，设置消息切换频率闪烁效果就此产生
            let timerTimeout = setTimeout(function() {
                that.messageTitle.time++;
                that.show();
                if (that.messageTitle.time % 2 == 0) {
                    document.title = "【您有新消息】" + title;
                } else {
                    document.title = "【　　　】" + title;
                }
            }, 300);
            that.messageTitle.timer = timerTimeout;
        },
        // 监听用户是否已离开
        listenerHide() {
            let that = this;
            var hiddenProperty =
                "hidden" in document
                    ? "hidden"
                    : "webkitHidden" in document
                    ? "webkitHidden"
                    : "mozHidden" in document
                    ? "mozHidden"
                    : null;
            var visibilityChangeEvent = hiddenProperty.replace(
                /hidden/i,
                "visibilitychange"
            );
            var onVisibilityChange = function() {
                if (!document[hiddenProperty] && that.listener) {
                    console.log("激活状态！");
                    that.clear();
                }
            };
            document.addEventListener(
                visibilityChangeEvent,
                onVisibilityChange
            );
        },
        /**
         * 播放提示音
         */
        playAudio(){
            // this.$refs.ifa.onload = function(){
            //     this.$refs.vio.src = '../../../static/video/lyq1711209.mp3';
            //     this.$refs.vio.oncanplay = function(){
            //         this.$refs.vio.play();
            //     };
			// };
			var audio= new Audio("../../../static/video/lyq1711209.mp3");//这里的路径写上mp3文件在项目中的绝对路径
			audio.play();//播放
        },
        /**
         * 排队变更状态
         */
        queueChatEnlistFun() {
            let that = this;
            if(that.userInfo.serviceStatus != 0){
                return;
            }
            let currentChatData =
                that.$store.imServerStore.getters.currentChatEnlist;
            let isFirst = true;
            let clientIdFirst = "";
            if (currentChatData != null) {
                currentChatData.map((v, i) => {
                    if (isFirst && v.contentType == 8) {
                        clientIdFirst = v.sender;
                        isFirst = false;
                    }
                });
                if (!isFirst) {
                    that.$axios
                        .get(
                            that.$httpServer.lineUpTurnDialogue +
                                "?clientId=" +
                                clientIdFirst +
                                "&seatsId=" +
                                JSON.parse(sessionStorage.getItem("userInfo"))
                                    .user_id
                        )
                        .then(res => {
                            // 可能存在异步操作list,需重新执行
                            currentChatData.map((v, i) => {
                                if (v.sender == clientIdFirst) {
                                    currentChatData[i].contentType = 3;
                                }
                            });
                        });
                }
            }
        },
        // 关闭服务端会话
        closeServerSocket() {
            var message = new proto.Model();
            // var browser = BrowserUtil.info();
            message.setVersion("1.0");
            message.setDeviceid("");
            message.setCmd(4);
            message.setSender(sessionStorage.getItem("userId")); // 登录接受  会话ID
            message.setMsgtype(1);
            message.setRole("1"); // 1 坐席 2访客
            message.setFlag(1);
            // message.setPlatform(browser.name);
            // message.setPlatformversion(browser.version);
            message.setToken(sessionStorage.getItem("token")); // 登录回传
            // message.setTrackid(that.clientValue.tocken);  //服务端 不需要
            var bytes = message.serializeBinary();
            this.$store.imServerStore.state.serverSocket.binaryType =
                "arraybuffer";
            this.$store.imServerStore.state.serverSocket.send(bytes);
            this.$store.imServerStore.state.serverSocket.close();
        },
        // 坐席开启会话
        onStatus: function() {
            let that = this;
            // if(JSON.parse(sessionStorage.getItem("setServerSocket")) != ""){
            //   that.$store.imServerStore.commit("setServerSocket",JSON.parse(sessionStorage.getItem("setServerSocket")));
            //   return;
            // }
            if (!window.WebSocket) {
                window.WebSocket = window.MozWebSocket;
            }
            if (window.WebSocket) {
                let sysOrClient = "";
                //访客 client  坐席 seats
                sysOrClient = new WebSocket(
                    "wss://"+this.$API_CONFIG.client_api + "/ws"
                );
                sysOrClient.binaryType = "arraybuffer";
                sysOrClient.onmessage = function(event) {
                    let ta = ""; // 聊天内容
                    if (event.data instanceof ArrayBuffer) {
                        let msg = proto.Model.deserializeBinary(event.data);
                        let sender = msg.getSender();
                        let time = msg.getTimestamp();
                        let msgCon = proto.MessageBody.deserializeBinary(
                            msg.getContent()
                        );
                        let msgType = msg.getCmd();
                        let contentType = msgCon.getType();
                        let clientplatform = msg.getClientplatform();
                        let clientbrowser = msg.getClientbrowser();
                        let clientCountry = msg.getCountry();
                        let clientProvince = msg.getProvince();
                        let clientCity = msg.getCity();
                        let clientip = msg.getClientip();
                        let trackid = msg.getTrackid();
						let userId = msg.getUserid(); //用户ID
						let customerTagInfo = msg.getCustomertaginfo();
                        let clientValues = {};
                        clientValues.msgType = msgType; // 用户会话类型
                        ta += "用户会话类型：" + msgType + "\r\n";
                        if (msgType == 1) {
                            ta += "消息类型：绑定socket" + "\r\n";
                        } else if (msgType == 2) {
                            ta += "消息类型：服务端检查客服端心跳" + "\r\n";
                            let message1 = new proto.Model();
                            message1.setCmd(2);
                            message1.setMsgtype(4);
                            sysOrClient.send(message1.serializeBinary());
                        } else if (msgType == 3 || msgType == 8) {
                            clientValues.trackid = trackid; // 会话ID
                            clientValues.clientplatform = clientplatform; // 上线用户系统
                            clientValues.clientbrowser = clientbrowser; // 上线用户浏览器
                            clientValues.clientCountry = clientCountry; // 上线用户 国家
                            clientValues.clientProvince = clientProvince; // 上线用户 省市
                            clientValues.clientCity = clientCity; // 上线用户 市区
                            clientValues.clientip = clientip; // 用户上线用户IP
							clientValues.userId = userId; // 是否第三方登录
							clientValues.customerTagInfo = customerTagInfo;
                            ta += "消息类型：用户上线推送" + "\r\n";
                            ta += "会话ID：" + trackid + "\r\n";
                            ta += "登录ID：" + userId + "\r\n";
                            ta += "上线用户系统:" + clientplatform + "\r\n";
                            ta += "上线用户浏览器:" + clientbrowser + "\r\n";
                            ta += "上线用户国家:" + clientCountry + "\r\n";
                            ta += "上线用户省份:" + clientProvince + "\r\n";
                            ta += "上线用户城市:" + clientCity + "\r\n";
							ta += "上线用户IP:" + clientip + "\r\n";
							ta += "顾客标签信息:" + customerTagInfo + "\r\n";
                        } else if (msgType == 4) {
                            ta += "消息类型：用户下线推送" + "\r\n";
                        } else if (msgType == 5) {
                            ta += "消息类型：推送消息" + "\r\n";
                        } else if (msgType == 6) {
                            ta += "消息类型：断线重连" + "\r\n";
                        }
                        ta += "时间：" + time + "\r\n";
                        ta += "发送人：" + sender + "\r\n";
                        ta += "消息内容：" + "\r\n";

                        if (contentType == 0) {
                            ta += "消息内容类型：文字" + "\r\n";
                            ta += msgCon.getContent();
                        } else if (contentType == 1) {
                            ta += "消息内容类型：图片" + "\r\n";
                            // $("#base64").attr("src",msgCon.getContent());
                        } else if (contentType == 2) {
                            ta += "消息内容类型：文件" + "\r\n";
                            ta += msgCon.getContent();
                        } else if (contentType == 3) {
                            ta += "消息内容类型：评价" + "\r\n";
                            ta += msgCon.getContent();
                        } else if (contentType == 4) {
                            ta += "消息内容类型：访客正在输入" + "\r\n";
                            ta += msgCon.getContent();
                        } else if (contentType == 5) {
                            ta += "消息内容类型：访客离开输入" + "\r\n";
                            ta += msgCon.getContent();
                        }
                        console.log(ta)
                        // 连接成功
                        if (!that.serverSend) {
                            that.serverSend = true;
                        }
                        clientValues.type = "client"; // 时间：
                        clientValues.time = time; // 时间：
                        clientValues.sender = sender; // 发送人：
                        clientValues.contentType = contentType; // 消息内容类型
                        clientValues.center = msgCon.getContent(); // 消息内容
                        clientValues.dialogueStatus = 1; //在线
                        // 1：排队
                        // if(msgType == 8){
                        //   if(msg.getIslineup() == 1){
                        //     // 排队
                        //     that.$store.imServerStore.dispatch("addClientChat",{clientChatId:sender,msg:clientValues})
                        //   }
                        // }
                        // 新访客

                        if (msgType == 3 || msgType == 8) {
                            that.$store.imServerStore.dispatch(
                                "addClientChat",
                                clientValues
                            );
                            // 10.10 新增需求
                            that.playAudio(); //播放提示音
                        } else {
                            // 访客下线

                            if (
                                (msgCon.getContent() == "" ||
                                    msgCon.getContent() == null) &&
                                msgType != 4 &&
                                msgType != 8 &&
                                contentType != 4 &&
                                contentType != 5
                            ) {
                                return;
                            }
                            if(msgCon.getContent() != ""){
                                that.playAudio(); //播放提示音
                            }
                            that.$store.imServerStore.dispatch("addChatMsg", {
                                clientChatId: sender,
                                msg: clientValues
                            });
                        }
                        if (msgType == 4) {
                            // that.queueChatEnlistFun(); 10.22 删除
                        } else {
                            // 访客是否正在输入
                            if (contentType != 5 && contentType != 4) {
                                that.listener = true;
                            }
                        }
                    }
                };
                sysOrClient.onopen = function(event) {
                    var taServer = ""; // 聊天内容
                    var message = new proto.Model();
                    // var browser = BrowserUtil.info();
                    message.setVersion("1.0");
                    message.setDeviceid("");
                    message.setCmd(1);
                    message.setGroupid(
                        JSON.parse(
                            sessionStorage.getItem("userInfo")
                        ).dept_id.toString()
                    );
                    message.setSender(sessionStorage.getItem("userId")); // 登录接受  会话ID
                    message.setMsgtype(1);
                    message.setRole("1"); // 1 坐席 2访客
                    message.setFlag(1);
                    // message.setPlatform(browser.name);
                    // message.setPlatformversion(browser.version);
                    message.setToken(sessionStorage.getItem("token")); // 登录回传
                    // message.setTrackid(that.clientValue.tocken);  //服务端 不需要
                    var bytes = message.serializeBinary();
                    sysOrClient.binaryType = "arraybuffer";
                    sysOrClient.send(bytes);
                    console.log(bytes);
                };
                sysOrClient.onclose = function(event) {
                    if (event != undefined) {
                        //1006：:期望连接，但连接不成功
                        // that.serverSend： 连接成功，不是初次连接
                        if (event.code == 1006 && !that.serverSend) {
                            if (that.initSocketSum >= 10) {
                                that.$message1({
                                    showClose: true,
                                    duration: 0, // 不自动关闭
                                    message: "连接聊天服务器失败，请联系管理员",
                                    type: "error"
                                });
                                return;
                            }
                            that.initSocketSum += 1;
                            console.log("重连：" + that.initSocketSum);
                            setTimeout(() => {
                                that.listenerUser();
                            }, 2000);
                        }
                        console.log(event.code);
                    } else {
                        console.log("正常关闭");
                        that.closeServerSocket();
                    }
                };
                that.$store.imServerStore.commit(
                    "setServerSocket",
                    sysOrClient
                );
            } else {
                alert("您的浏览器不支持WebSocket协议！");
            }
        },
        // 监听用户状态
        listenerUser(){
            //隐身
            // if(this.userInfo.serviceStatus == 0){
                this.onStatus();
            // }
        },
        // 切换用户状态时
        openOrCloseStatus(num){
            if(num == 0){
                this.onStatus();
            }else{
                this.closeServerSocket();
            }
        },
    },
    mounted() {
        // 1.socket发送消息
        this.listenerUser(); // 监听用户状态
        this.listenerHide();
        // this.$store.imServerStore.dispatch('onStatus', {
        //     type: "sys",
        //     responseText: "开启会话"
		// });
    },
    created() {}
};
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100%;
}
</style>
