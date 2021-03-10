/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-26 10:30:54
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-30 04:04:37
 */
/*!
 *  im服务端Store
 */

import Vue from 'vue';
import Vuex from 'vuex';
import ak from '@/common/ak.js';
import { getUserInfo, getUserMenu, logout, getIp } from "@/common/api";
import { getLoadhis } from '../common/api';

Vue.use(Vuex);
export const imServerStore = new Vuex.Store({
    state: {
        // domain: {
        //     development: '192.168.1.111:2048',
        //     testing: '192.168.1.111:2048',
        //     production: '172.18.61.254:2048'// 预留
        // },
        serverChatEn: {
            serverChatId: Number.parseInt(Date.now() + Math.random()),
            serverChatName: '小P',
            avatarUrl: '/static/image/im_server_avatar.png'
        },
        selectedChatEn: null, // 选取的会话对象
        currentChatEnlist: [], // 当前正在会话chat实体集合
        notificationChatEnlist: [], // 通知chat实体集合
        haveNewMsgDelegate: null, // 当前已选中的用户含有新消息
        socket: null,
        socketValues: "",   // 客户端建立数据
        serverSocket: null, // 坐席服务
        clientSocket: null, // 客户端服务
        fileUpdIndex: -1, // 上传文件预处理下标
        userInfo: {}, // 存储用户信息
        permissions: [], // 存储用户权仙点
        serverValues: null, // 当前打开会话的数据
        userMenus: [],
        isRefresh: 0,  // 对话页面初始化
        isMobile: false,
        imTimeOut:{}, // 需要定时清除的 下线访客
    },
    mutations: {
        setPlat(state, bool) {
            state.isMobile = bool
        },
        closeServerSocket(state) {
            state.serverSocket.onclose()
        },
        resetUserInfo(state, data) {
            state.userInfo = data.adminUser
			state.permissions = data.permissions
        },
        setUserMenu(state, menu) {
            state.userMenus = menu
        },
        /**
         * 当前打开会话集合数据
         */
        setServerValues: function (state, values) {
            state.serverValues = values;
        },
        // 客户端建立数据
        setFileUpdIndex: (state, values) => {
            state.fileUpdIndex = values;
        },
        // 客户端建立数据
        setSocketValues: (state, values) => {
            state.socketValues = values;
        },
        // 创建服务端对象
        setServerSocket: (state, value) => {
            state.serverSocket = value;
        },
        // 创建服务端通信
        setServerSocketCorresponded: (state, value) => {
            state.serverSocket.onopen = value;
        },
        // 创建访客端对象
        setClientSocket: (state, value) => {
            state.clientSocket = value;
        },
        // 获取当前会话列表
        setCurrentChatEnlist: function (state, value) {
            state.currentChatEnlist = value;
        },
        /**
         * 触发当前选择的chat含有新的消息
         * @param {Object} payload 载荷对象
         */
        triggerHaveNewMsgDelegate: function (state, payload) {
            state.haveNewMsgDelegate = Date.now();
        },
        /**
         * 设置当前用户头像
         */
        setUserInfo: function (state, values) {
            state.userInfo.avatar = values;
        },

        /**
         * 排序当前会话列表
         */
        sortCurrentChatEnlist: function (state, payload) {
            var enlist = state.currentChatEnlist.concat();

            // 排序规则：
            // 1)已关注放最前面，关注状态下按最后一条获取时间正序
            // 2)非关注状态下，按最后一条获取时间正序

            // 1.首先按最后一次更新时间排序
            for (var i = 0; i < enlist.length; i++) {
                for (var j = i; j < enlist.length; j++) {
                    var iTimeSpan = Date.parse(enlist[i].lastMsgTime);
                    var jTimeSpan = Date.parse(enlist[j].lastMsgTime);
                    if (iTimeSpan < jTimeSpan) {
                        var tmp = enlist[i];
                        enlist[i] = enlist[j];
                        enlist[j] = tmp;
                    }
                }
            }

            // 2.已关注的排在最前面并按最后一次时间倒序
            var followEnlist = [];
            var unfollowEnlist = [];
            for (var i = 0; i < enlist.length; i++) {
                var en = enlist[i];
                if (en.isFollow) {
                    followEnlist.push(en);
                } else {
                    unfollowEnlist.push(en);
                }
            }

            // 3.合并
            state.currentChatEnlist = followEnlist.concat(unfollowEnlist);
        },

        /**
         * 清除通知chat
         */
        clearNotificationChat: function (state) {
            state.notificationChatEnlist = [];
        }
    },
    actions: {
        async logout({ commit,state }) {
            await logout().then(res => {
                if (res.data.code == "0") {
                    commit('closeServerSocket');
                    state.currentChatEnlist = [];
                    state.selectedChatEn = null;
                    sessionStorage.clear();
                }
            })
        },
        async getUserInfo({ commit }) {
            const data = await getUserInfo().then(res => {
                if (res.data.data) {
                    let data = res.data.data;
                    data.adminUser.roles = data.roles;
                    return data
                }
            })
            commit('resetUserInfo', data)
        },
        async getUserMenu({ commit }) {
            const data = await getUserMenu().then(res => {
                if (res.data.data) {
                    return res.data.data
                }
            })
            commit('setUserMenu', data)
        },
        /**
         * 添加访客端chat对象
         * @param {Object} payload 载荷对象
         * @param {String} payload.newChatEn 新的chat对象
         */
        addClientChat: function (context, newChatEn, isEdit) {
            context.dispatch('getChatEnByChatId', { clientChatId: newChatEn.sender,msgName:false,newChatEn:newChatEn }).then((chatEn) => {
                // if (chatEn == null) {
                if (chatEn != null) {
                    // 2)增加消息
                    context.dispatch('addChatMsg', {
                        clientChatId: newChatEn.sender,
                        msg: newChatEn
                    });
                    // ????
                    // for(let i in context.state.currentChatEnlist){
                    //     if(context.state.currentChatEnlist[i].sender == newChatEn.sender){
                    //         context.state.currentChatEnlist[i] = newChatEn
                    //     }
                    // }
                    return;
				}
				let v = {};
                // 1)公共属性
                v.msgList = [];
                v.state = newChatEn.dialogueStatus == 3?'off':'on'; //判断访客是否已离线
                v.blankList = 'on'; // 服务端判断访客是否加入黑名单
                v.clienBankList = 'on'; // 访客端判断是否加入黑名单
                v.userId = newChatEn.userId; //是否第三方登录
				v.realTime = newChatEn.time; // 完整时间
                v.accessTime = newChatEn.time != null && newChatEn.time != '' ? newChatEn.time.substring(newChatEn.time.length - 8) : ''; // 时间
                v.inputContent = ''; // 输入框内容
                v.inputNewContent = ''; // 新消息
                v.sender = newChatEn.sender;  // 发送人：
                v.trackid = newChatEn.trackid;  // 会话ID
                v.clientplatform = newChatEn.clientplatform;  // 上线用户系统
                v.clientbrowser = newChatEn.clientbrowser;  // 上线用户浏览器
                v.clientCountry = newChatEn.clientCountry;  // 上线用户国家
                v.clientProvince = newChatEn.clientProvince;  // 上线用户省份
                v.clientCity = newChatEn.clientCity;  // 上线用户浏览器
				v.dialogueTag = newChatEn.dialogueTag ? newChatEn.dialogueTag : ''; //对话标签数据
				v.customerTagInfo = newChatEn.customerTagInfo ? JSON.parse(newChatEn.customerTagInfo) : []; //顾客标签数据
                v.clientip = newChatEn.clientip;  // 用户上线用户IP
                v.inputNewContentStatus = ''; // 访客输入状态
                v.searchHistoryCondition = {
                    currentSize: 0, //当前页数
                    historySumPage: 1, // 历史记录总页数
                    lastTrackId: ""
                };
                if (newChatEn.lastTrackId) {
                    v.searchHistoryCondition.lastTrackId = newChatEn.lastTrackId
                }
                v.newMsgCount = 0;
                v.contentType = newChatEn.msgType; //用户类型
                // v.isFollow = false; // 是否关注
                v.lastMsgTime = null;
                v.lastMsgShowTime = null; // 最后一个消息的显示时间
                // 排队
                context.state.currentChatEnlist.push(v);

                // }
                // if(context.state.imTimeOut['fun_'+newChatEn.sender]){
                //     clearTimeout(context.state.imTimeOut['fun_'+newChatEn.sender]);
                //     delete  context.state.imTimeOut['fun_'+newChatEn.sender]; // 在线删除定时器
                // }

                // 2)增加消息
                context.dispatch('addChatMsg', {
                    clientChatId: newChatEn.senderID,
                    msg: {
                        role: 'sys',
                        type: 'sys', // 坐席发送
                        msgType: newChatEn.msgType, // 访客会话类型
                        contentType: 'text',
                        createTime: newChatEn.time,
                        content: true ? '新客户接入' : '重新连接'
                    }
                });
            });

        },
        /**
         * 根据jobId获取chat对象
         * @param {String} trackid 需要修改的chatEn的id，根据此id匹配当前集合或历史集合
         * @param {String} listName 指定的集合名称；e.g. currentChatEnlist、historyChatEnlist、allHistoryChatEnlist
         */
        getChatEnByChatId: function (context, { clientChatId, listName,newChatEn }) {
            var chatEn = null;
            if (listName) {
                // 1.指定了列表
                var targetList = context.state[listName];
                for (var i = 0; i < targetList.length; i++) {
                    var tmpEn = targetList[i];
                    if (tmpEn.clientChatId == clientChatId) {
                        chatEn = tmpEn;
                        break;
                    }
                }
            } else {
                // 2.未指定列表
                // 1)从当前会话列表查找
                if(clientChatId){
                    for (var i = 0; i < context.state.currentChatEnlist.length; i++) {
                        var tmpEn = context.state.currentChatEnlist[i];
                        if (tmpEn.sender == clientChatId) {
                            if(tmpEn.state == "off"){
                                if(context.state.selectedChatEn){
                                    // context.state.selectedChatEn.state = "on";
                                    if(newChatEn){
                                        context.state.selectedChatEn.trackid = newChatEn.trackid; // 更新当前会话ID
                                        context.state.serverValues.trackid = newChatEn.trackid; // 更新会话ID
                                        tmpEn.trackid = newChatEn.trackid; // 如果是离线推得消息，更新会话ID
                                    }
                                }
                            }
                            chatEn = tmpEn;
                            if(context.state.selectedChatEn){
                                chatEn.inputContent = context.state.selectedChatEn.inputContent;
                            }
                            break;
                        }
                    }
                }
            }
            return chatEn;
        },

        /**
         * 修改Chat对象的属性
         * @param {Object} payload 载荷对象
         * @param {Object} payload.clientChatId 需要修改的chatEn的id，根据此id匹配当前集合或历史集合
         * @param {Array} payload.extends Chat需要变更的属性对象数组
         */
        extendChatEn: function (context, payload) {
            return context.dispatch('getChatEnByChatId', { clientChatId: payload.clientChatId }).then((chatEn) => {

                // 1.若没有，就附加到当前会话列表里
                if (chatEn == null) {
                    return;
                }

                // 2.extend属性
                for (var key in payload.extends) {
                    Vue.set(chatEn, key, payload.extends[key]);
                }

                // 3.若选中的当前chatEn 与 传入的一直，更新选中额chatEn
                if (context.state.selectedChatEn && context.state.selectedChatEn.clientChatId == chatEn.clientChatId) {
                    context.state.selectedChatEn = Object.assign({}, chatEn);
                    Vue.nextTick(function () { });
                }
                return chatEn;
            });
        },
        /**
         * 排队转对话
         */
        lineUpTurndialogue: function () {

        },
        /**
         * 删除定时器
         */
        setTimeoutFun: function (context,{msg:msg}) {
            context.state.currentChatEnlist.map((v, i) => {
                if (v.sender == msg.sender) {
                    context.state.currentChatEnlist.splice(i, 1);
                    // 如果打开的会话与需要关闭的会话一致
                    if(context.state.selectedChatEn.sender == msg.sender){
                        context.state.selectedChatEn = null;
                    }
                }
            });
        },
        /**
         * 添加chat对象的msg
         * @param {String} clientChatId 会话Id
         * @param {Object} msg 消息对象；eg：{role:'sys',content:'含有新的消息'}
         * @param {String} msg.role 消息所有者身份；eg：'sys'系统消息；
         * @param {String} msg.contentType 消息类型；text:文本(默认)；image:图片
         * @param {String} msg.content 消息内容
         * @param {Function} successCallback 添加消息后的回调
         */
        addChatMsg: function (context, { clientChatId, msg, successCallback }) {
            context.dispatch('getChatEnByChatId', { clientChatId: clientChatId }).then((chatEn) => {
                if (chatEn == null) {
                    return;
                }
                // 用户下线
                if (msg.msgType == 4) {
                    chatEn.state = "off";
                    chatEn.inputNewContentStatus = ""; // 清空提示输入框
                    // var funTimeOut = 'fun_'+msg.sender;
                    // window[funTimeOut] = setTimeout(()=>{
                    //     context.state.currentChatEnlist.map((v, i) => {
                    //         if (v.sender == msg.sender) {
                    //             context.state.currentChatEnlist.splice(i, 1);
                    //             // 如果打开的会话与需要关闭的会话一致
                    //             if(context.state.selectedChatEn.sender == msg.sender){
                    //                 context.state.selectedChatEn = null;
                    //             }
                    //         }
                    //     });
                    // },20000);
                    // 如果关闭的访客聊天的 访客ID 与 当前打开会话的页面的ID一样，刷新聊天
                    if (context.state.selectedChatEn) {
                        if (context.state.selectedChatEn.sender == clientChatId) {
                            context.state.selectedChatEn.state = "off";
                        }
                    }
                    // 排队状态下线，会话清除
                    if(chatEn.contentType == 8){
                        context.state.currentChatEnlist.map((v, i) => {
                            // 结束会话 排队变更状态
                            if(v.sender == chatEn.sender){
                                context.state.currentChatEnlist.splice(i, 1);
                            }
                          });
                    }
                }
                // 访客上线
                if(msg.msgType == 3){

                    for (var i = 0; i < context.state.currentChatEnlist.length; i++) {
                        var tmpEn = context.state.currentChatEnlist[i];
                        if (tmpEn.sender == clientChatId && tmpEn.state == "off" && msg.type == "client") {
                            tmpEn.msgList = [];
                            tmpEn.state = 'on';
                            tmpEn.searchHistoryCondition = {
                                currentSize: 0,
                                historySumPage: 1,
                                lastTrackId: ''
                            };
                            if(context.state.selectedChatEn && context.state.selectedChatEn.sender == clientChatId){
                                context.state.selectedChatEn.state = "on";
                                context.state.selectedChatEn.msgList = [];
                                context.state.selectedChatEn.searchHistoryCondition = {
                                    currentSize: 0,
                                    historySumPage: 1,
                                    lastTrackId: ''
                                };
                                let opt = {
                                    trackId:context.state.selectedChatEn.trackid,
                                    currentSize: 1,
                                    historySumPage: 2,
                                    filterDialogFlag:1
                                }
                                // 离线转在线 重新加载对话
                                getLoadhis(opt).then(res =>{
                                    if (res.data.data == null) {
                                        context.state.selectedChatEn.searchHistoryCondition.historySumPage = 0;
                                        return;
                                    }
                                    context.state.selectedChatEn.searchHistoryCondition.historySumPage = res.data.data.pages; // 总页数
                                    let resData = res.data.data.records;
                                    for (let i = 0; i < resData.length; i++) {
                                        let newMess = {
                                        center: resData[i].content, //消息内容
                                        contentType: resData[i].contentType, //消息类型
                                        msgType: 5, //客户状态,消息推送
                                        sender: resData[i].sendUser, //发送人
                                        time: resData[i].updatedate, //发送时间
                                        trackid: resData[i].trackId, //会话ID
                                        sendUserName:
                                            resData[i].sendName != null ? resData[i].sendName : "",
                                        type: "" // 用户类型 sys： 坐席发送  client：客户端发送
                                        };
                                        if (resData[i].senderType == 1) {
                                        newMess.type = "sys";
                                        } else {
                                        newMess.type = "client";
                                        }
                                        context.state.selectedChatEn.msgList.unshift(newMess);
                                    }
                                })
                            }
                            return;
                        }
                    }

                }
                if(msg.msgType == 8){
                    chatEn.contentType = 8; // 聊天转排队
                    chatEn.state = "on" ;
                    if(context.state.selectedChatEn && context.state.selectedChatEn.sender == clientChatId){
                        context.state.selectedChatEn = null
                    }
                }
                // 黑名单，手动结束黑名单
                if (msg.contentType == 20) {
                    chatEn.state = "off"; // 访客设置离线
                    chatEn.blankList = "off"; // 访客设置黑名单
                    // 如果关闭的访客聊天的 访客ID 与 当前打开会话的页面的ID一样，刷新聊天
                    if (context.state.selectedChatEn.sender == clientChatId) {
                        context.state.selectedChatEn.state = chatEn.state ;
                        context.state.selectedChatEn.blankList = chatEn.blankList;
                    }
                }
                if (msg.contentType == -20   ) {
                    if(chatEn.state == "off"){
                        chatEn.state = "off"; // 访客设置离线
                    }else{
                        chatEn.state = "on"; // 访客设置离线

                    }
                    chatEn.blankList = "on"; // 访客设置黑名单
                    // 如果关闭的访客聊天的 访客ID 与 当前打开会话的页面的ID一样，刷新聊天
                    if (context.state.selectedChatEn.sender == clientChatId) {
                        context.state.selectedChatEn.state = chatEn.state ;
                        context.state.selectedChatEn.blankList = chatEn.blankList;
                    }
                }
                // 访客输入状态
                if (msg.contentType == 4) {
                    chatEn.inputNewContentStatus = "用户正在输入...";
                } else if (msg.contentType == 5) {
                    chatEn.inputNewContentStatus = "";
                }

                // 发送信息为空
                if (msg.center == "" || msg.center == null ) {
                    return;
                }

                // 状态离线 并且 接受的消息为 访客发的消息，需清空当前会话 并重置历史纪录查询条件
                // if(chatEn.state == "off" && msg.type == "client"){
                //     chatEn.state = 'on';
                //     chatEn.msgList = []; //清空
                //     chatEn.searchHistoryCondition = {
                //         currentSize: 0,
                //         historySumPage: 1,
                //         lastTrackId: ""
                //     };
                // }
                // 1.设定默认值
                msg.createTime = msg.createTime == undefined ? new Date() : msg.createTime;
                var msgList = chatEn.msgList ? chatEn.msgList : [];
                // 上传类型为文件 并且内容为 -1，需做预处理
                let fileUrl = "";
                if (msg.contentType == 2) {
                    fileUrl = msg.center.split('?')[0];
                }
                if (msg.contentType == 2 && fileUrl == -1) {
                    // 记录预处理的文件下标
                    context.commit('setFileUpdIndex', msgList.length);
                }
                // 上传成功后替换
                if (msg.contentType == 2 && fileUrl != -1) {
                    chatEn.msgList[context.state.fileUpdIndex].center = msg.center;
                    context.commit('setFileUpdIndex', -1);
                    return
                }

                // 2.插入消息
                // 1)插入日期
                // 实际场景中，在消息上方是否显示时间是由后台传递给前台的消息中附加上的，可参考 微信Web版
                // 此处进行手动设置，5分钟之内的消息，只显示一次消息
                // msg.createTime = new Date(msg.createTime);
                // if (chatEn.lastMsgShowTime == null || msg.createTime.getTime() - chatEn.lastMsgShowTime.getTime() > 1000 * 60 * 5) {
                //     msgList.push({
                //         role: 'sys',
                //         contentType: 'text',
                //         content: ak.Utils.getDateTimeStr(msg.createTime, 'H:i')
                //     });
                //     chatEn.lastMsgShowTime = msg.createTime;
                // }

                // 2)插入消息

                msgList.push(msg);
                chatEn.inputNewContent = msg.center;  // 提示消息
                // 3.设置chat对象相关属性
				chatEn.msgList = msgList;
				if(msg.contentType !== 50){
					chatEn.accessTime = msg.time.substring(11);
				}
                if (msg.type != "sys") {

                }
                switch (msg.contentType) {
                    case 'text':
                        chatEn.lastMsgContent = msg.content;
                        break;
                    case 'image':
                        chatEn.lastMsgContent = '[图片]';
                        break;
                    case 'file':
                        chatEn.lastMsgContent = '[文件]';
                        break;
                    case 'sound':
                        chatEn.lastMsgContent = '[语音]';
                        break;
                }
				// 更新列表 选中列表 与 发送信息 发送人是否一致
				if (msg.contentType !== 50){
					if (context.state.selectedChatEn && chatEn.sender == context.state.selectedChatEn.sender) {
						chatEn.newMsgCount = 0;
						if(msg.type != "client"){
							chatEn.inputNewContent = "";
						}
						context.state.selectedChatEn = Object.assign({}, chatEn);
						context.commit('triggerHaveNewMsgDelegate');
					} else {
						chatEn.newMsgCount++;
					}
				}

                // 4.排序
                context.commit('sortCurrentChatEnlist', {});

                // 5.加入通知
                if (msg.isNewMsg && msg.role == 'client' && msg.contentType != 'preInput') {
                    context.dispatch('addNotificationChat', {
                        chatEn: chatEn,
                        oprType: 'msg'
                    });
                }
                if(context.state.selectedChatEn && context.state.selectedChatEn.sender == clientChatId){
                    chatEn.searchHistoryCondition.lastTrackId = chatEn.trackid;
                    context.state.selectedChatEn.searchHistoryCondition.lastTrackId = chatEn.trackid; //最后一次会话ID
                }else{
                    chatEn.searchHistoryCondition.lastTrackId = chatEn.trackid;
                }
                // 6.回调
                successCallback && successCallback();
            });
        },

        /**
         * 选中会话
         * @param {String} clientChatId 选中会话Id
         */
        selectChat: function (context, { clientChatId }) {

            context.dispatch('getChatEnByChatId', { clientChatId: clientChatId }).then((chatEn) => {
                var state = context.state;
                chatEn.newMsgCount = 0; // 设置新消息为0
                chatEn.inputNewContent = ""; // 设置新消息为空
                // 1.设置当前选中的会话
                context.state.selectedChatEn = Object.assign({}, chatEn);

                // 2.刷新当前会话集合
                for (var i = 0; i < state.currentChatEnlist.length; i++) {
                    var tmpEn = state.currentChatEnlist[i];
                    if (tmpEn.sender == chatEn.sender) {
                        state.currentChatEnlist[i] = state.selectedChatEn;
                        if(context.state.selectedChatEn.sender == clientChatId){
                            context.state.selectedChatEn.searchHistoryCondition.lastTrackId = tmpEn.searchHistoryCondition.lastTrackId; //最后一次会话ID
                        }
                        context.state.selectedChatEn.state = chatEn.state; // 访客是否在线
                        context.state.selectedChatEn.blankList = chatEn.blankList; // 访客是否已加入黑名单
                        break;
                    }
                }
            });
        },

        /**
         * 添加通知chat
         * @param {Object} chatEn 会话对象
         * @param {String} oprType 操作类型；eg：chat(添加会话)、msg(添加消息)
         */
        addNotificationChat: function (context, { chatEn, oprType }) {
            var state = context.state;
            // 当前的路由是否在im模块里，若不在im模块里，才显示通知
            if (window.polkVue.$route.name == 'im') {
                return;
            }

            // 1.判断当前通知集合里是否已存在次会话，若已存在去除此会话
            for (var i = 0; i < state.notificationChatEnlist.length; i++) {
                if (state.notificationChatEnlist[i].clientChatId == chatEn.clientChatId) {
                    state.notificationChatEnlist.splice(i, 1);
                    break;
                }
            }

            // 2.集合最多只能有5个
            if (state.notificationChatEnlist.length > 5) {
                state.notificationChatEnlist = state.notificationChatEnlist.splice(4);
            }

            // 3.转换后加入到当前通知集合里
            var tmpChatEn = {
                clientChatId: chatEn.clientChatId,
                sourceInfo_way: chatEn.sourceInfo_way,
                site: window.location.host
            };
            if (oprType == 'chat') {
                tmpChatEn.title = '新用户';
                tmpChatEn.content = '客户 ' + chatEn.clientChatName + ' 接入新会话';
            } else if (oprType == 'msg') {
                tmpChatEn.title = '客户 ' + chatEn.clientChatName + ' ' + chatEn.newMsgCount + '条新消息';
                tmpChatEn.content = chatEn.lastMsgContent;
            }

            // 4.内容大于25个截断
            if (tmpChatEn.content.length > 25) {
                // tmpChatEn.content = tmpChatEn.content.substr(0, 24) + '...';
            }

            // 5.加入到集合里
            state.notificationChatEnlist.push(tmpChatEn);

            // 6.当通知数量大于5个时清除通知
            window.imServerStore_notificationList = window.imServerStore_notificationList || [];
            if (window.imServerStore_notificationList.length > 5) {
                window.imServerStore_notificationList.forEach((item, index) => {
                    item.close();
                });
                window.imServerStore_notificationList = [];
            }

            // 7.显示通知
            for (var i = 0; i < state.notificationChatEnlist.length; i++) {
                const item = state.notificationChatEnlist[i];
                // 1)已存在的通知列表是否包含此会话，若存在就关闭并移出
                for (var j = 0; j < window.imServerStore_notificationList.length; j++) {
                    if (window.imServerStore_notificationList[j].data == item.clientChatId) {
                        window.imServerStore_notificationList[j].close();
                        break;
                    }
                }

                // 2)创建新的通知
                const notification = new Notification(item.title, {
                    body: item.content,
                    data: item.clientChatId,
                    tag: Date.now(),
                    icon: ak.BLL.getPngFromWay(item.sourceInfo_way)
                });
                notification.onclick = function (e) {
                    window.focus();
                    window.polkVue.$router.push('im');
                    context.commit('clearNotificationChat');
                    context.dispatch('selectChat', { clientChatId: item.clientChatId });
                    notification.close();
                    imServerStore_notificationList = [];
                };

                notification.onclose = function (e) {
                    // remove en
                    for (var i = 0; i < state.notificationChatEnlist.length; i++) {
                        if (state.notificationChatEnlist[i].clientChatId == item.clientChatId) {
                            state.notificationChatEnlist.splice(i, 1);
                            break;
                        }
                    }
                    // remove notification
                    for (var i = 0; i < window.imServerStore_notificationList.length; i++) {
                        if (window.imServerStore_notificationList[i].tag == notification.tag) {
                            window.imServerStore_notificationList.splice(i, 1);
                            break;
                        }
                    }
                };

                setTimeout(function () {
                    notification && notification.close();
                }, 1000 * 10);

                window.imServerStore_notificationList.push(notification);
            }
        },

        /**
         * 发送消息
         */
        sendMsg: function (context, { clientChatId, msg }) {
            console.log(clientChatId);
            context.state.socket.emit('SERVER_SEND_MSG', {
                clientChatId: clientChatId,
                msg: msg
            });
        }
    },
    getters: {
        getUserMenus(state) {
            return state.userMenus
        },
        getDomain(state) {
            let environment = process.env.NODE_ENV
            return state.domain[environment]
        },
        //  上传文件的下标
        getFileUpdIndex: function (state) {
            return state.fileUpdIndex;
        },
        // 坐席端
        getServerSocket: function (state) {
            return state.serverSocket;
        },
        // 客服通信信息
        getSocketValues: function (state) {
            return state.socketValues;
        },
        /**
         * 获取选中的会话对象
         */
        selectedChatEn: function (state) {
            return state.selectedChatEn;
        },
        /**
         * 当前打开会话集合数据
         */
        currentChatEnlist: function (state) {
            return state.currentChatEnlist;
        },
        /**
         * 当前会话集合
         */
        serverValues: function (state) {
            return state.serverValues;
        },
        /**
         * 当前用户头像
         */
        getUserInfo: function (state, values) {
            return state.userInfo.avatar;
        },
        /**
         * 选中的chat含有新消息
         */
        haveNewMsgDelegate: function (state) {
            return state.haveNewMsgDelegate;
        },

        /**
         * 客服chat信息
         */
        serverChatEn: function (state) {
            return state.serverChatEn;
        },
    }
});
