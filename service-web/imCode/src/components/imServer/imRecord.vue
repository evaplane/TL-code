<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-17 16:08:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-30 04:09:56
 -->
<!-- 会话记录 -->
<template>
    <div class="imRecord-wrapper">
        <!-- <header class="header">
            <div class="kf-info-wrapper">
                <img class="kf-avatar" :src="storeServerChatEn.avatarUrl" />
                <span class="kf-name position-h-v-mid">{{storeServerChatEn.serverChatName}}</span>
            </div>
            <div class="client-info-wrapper">
                <p>
                    <i class="fa fa-user on-line"></i>{{storeCurrentChatEnlist.length}}</p>
            </div>
        </header> -->
        <ul>
            <li>
                <el-collapse v-model="activeNames" @change="handleChange('1')"  class="imChat-header">
                    <i class="chat_jiao" :class="{changChatClass:changChat}"></i>
                    <span class="chat_right">{{currentChatEnlistNumFun('dialog')}}&nbsp;/{{userInfo}}</span>
                    <el-collapse-item title="我的对话" name="1">
                         <!-- <div class="main"> -->
                            <div v-if="storeCurrentChatEnlist.length>0"  class="item-list">
                                <span  v-for="(tmpEn, index) in storeCurrentChatEnlist" :key="index" @click="selectChat(tmpEn)">
                                    <!-- 对话图像 -->
									<div class="item" v-if="tmpEn.contentType != 8" :class="{unreadClass:tmpEn.newMsgCount > 0,active: selectedChatEn!=null && active==tmpEn.sender}">
										<div class="item-box">
											<div class="item-img" :class="tmpEn.state == 'on'?'on':'off'"><i :class="tmpEn.clientplatform == 'Android'|| tmpEn.clientplatform == 'Ios'?'el-icon-mobile':'el-icon-monitor'"></i></div>
											<span v-if="tmpEn.newMsgCount > 0" class="list-classic">{{tmpEn.newMsgCount}}</span>
											<div class="item-center">
												<!-- 对话消息 -->
												<div class="item-aree">
													<!-- 地址 -->
													<div class="item-address">
														<div>{{tmpEn.clientCountry}}{{tmpEn.clientProvince}}{{tmpEn.clientCity}}</div>
														<!-- 消息内容 -->
														<span class="inputNewContent" v-if="tmpEn.inputNewContentStatus!=''">{{tmpEn.inputNewContentStatus}}</span>
													</div>
												</div>
												<!-- 消息时间 -->
												<span class="item-time">{{tmpEn.accessTime}}</span>
											</div>
										</div>
										<div class="item-label-box">
											<div class="item-label" v-for="(obj,i) in tmpEn.customerTagInfo" :key="i" :style="{backgroundColor:obj.bgColor}">
												{{obj.name}}
											</div>
										</div>
									</div>
                                </span>
                            </div>
                            <div v-else-if="storeCurrentChatEnlist.length==0" class="empty-wrapper">
                                <div class="content">
                                    <img src="../../../static/image/chat.png"/>
                                    <p class="title">暂无对话</p>
                                </div>
                            </div>
                        <!-- </div> -->
                    </el-collapse-item>
                </el-collapse>
            </li>
             <li v-if="false">
                <el-collapse v-model="activeNames" @change="handleChange('2')" class="imChat-header">
                    <i class="chat_jiao" :class="{changChatClass:changWorkedTogether}"></i>
                    <el-collapse-item title="同事的对话" name="2">
                       <div class="empty-wrapper">
                                <div class="content">
                                    <img src="../../../static/image/chat.png"/>
                                    <p class="title">暂无对话</p>
                                </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </li>
             <li v-if="isShowQueue == 1">
                <el-collapse v-model="activeNames" @change="handleChange('3')" class="imChat-header">
                    <i class="chat_jiao" :class="{changChatClass:changQueue}"></i>
                    <span class="chat_right">{{currentChatEnlistNumFun('queue')}}&nbsp;/{{showQueueCount}}</span>
                    <el-collapse-item title="排队" name="3">
                        <div v-if="queueChatEnlistNumFun()"  class="item-list">
                                <span  v-for="(tmpEn, index) in storeCurrentChatEnlist" :key="index" v-bind:class="{ active: selectedChatEn!=null && tmpEn.clientChatId==selectedChatEn.clientChatId}">
                                    <!-- 对话图像 -->
                                    <div class="item" v-if="tmpEn.contentType == 8" :class="{unreadClass:tmpEn.newMsgCount > 0}">
                                        <div class="item-box">
											<div class="item-img"><i :class="tmpEn.clientplatform == 'Android'|| tmpEn.clientplatform == 'Ios'?'el-icon-mobile':'el-icon-monitor'"></i></div>
											<span v-if="tmpEn.newMsgCount > 0" class="list-classic">{{tmpEn.newMsgCount}}</span>
											<div class="item-center">
												<!-- 对话消息 -->
												<div class="item-aree">
													<!-- 地址 -->
													<div>{{tmpEn.clientCountry}}{{tmpEn.clientProvince}}{{tmpEn.clientCity}}</div>
													<!-- 消息内容 -->
													<!-- <div><span>{{getqqemojiEmoji(tmpEn.inputNewContent)}}</span> </div> -->
												</div>
												<!-- 消息时间 -->
												<span class="item-time">{{tmpEn.accessTime}}</span>
											</div>
                                        </div>
										<div class="item-label-box">
											<div class="item-label" v-for="(obj,i) in tmpEn.customerTagInfo" :key="i" :style="{backgroundColor:obj.bgColor}">
												{{obj.name}}
											</div>
										</div>
                                    </div>
                                </span>
                            </div>
                        <div v-else class="empty-wrapper">
                            <div class="content">
                                <img src="../../../static/image/visitor.png"/>
                                <p class="title">暂无排队</p>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </li>
        </ul>


    </div>
</template>

<script>
import { getQueueRule} from "@/common/api";
export default {
    data() {
        return {
            activeNames:['1','2','3'],
            kfList: "", // 获取当前列表
            trackid: "", // 会话ID
            changChat: false,//样式
            changWorkedTogether: false,
            changQueue: false,
            currentChatEnlistNum:0, //当前会话的人数
            queueChatEnlistNum:0, //当前排队的人数
            isShowQueue:"", //是否排队1：true
            showQueueCount : 0, //排队人数
            active:'',
			fastReplyGroupConfigs:'', //所有页签
			customerLabelObj: {}, //所有顾客标签
			colorLable: [
				"#ffb652",
				"#b59177",
				"#6fd048",
				"#9264cd",
				"#fc7cb3",
				"#ff8947",
				"#00ce7d",
				"#4ca0ff",
				"#ff5c5e",
				"#707070"
			], //标签颜色
        };
    },
    computed: {
        selectedChatEn() {
            return this.$store.imServerStore.getters.selectedChatEn;
        },
        // 当前会话列表   监听是否有新对象接进来
        storeCurrentChatEnlist() {
            return this.$store.imServerStore.getters.currentChatEnlist;
        },
        storeServerChatEn() {
            return this.$store.imServerStore.getters.serverChatEn;
        },
        // 用户权限信息
        userInfo() {
            if(this.$store.imServerStore.state.userInfo){
                return this.$store.imServerStore.state.userInfo.serviceCeiling;
            }else{
                return '0'
            }

        }
    },
    watch: {

    },
    created(){
		this.getQueueRule();
    },
    mounted(){
        // 获取访客会话
        // this.myConversation();

    },
    methods: {
		/**
		 * 查询所有顾客标签
		 */
		getCustomerLabele() {
			let that = this;
			this.$axios.get(this.$httpServer.getLabele).then(res => {
				if (res.data.code == 0) {
					let arr = res.data.data;
					for(let i in arr){
						that.customerLabelObj[arr[i].id] = {
							name: arr[i].labelName,
							color: that.colorLable[parseInt(arr[i].labelStype)]
						}
					}
					console.log(that.customerLabelObj)
					that.getQueueRule();
				}
			});
		},
        /**
         * 判断是否排队
         */
        getQueueRule() {
            getQueueRule(JSON.parse(sessionStorage.getItem("userInfo")).dept_id).then(res => {
                if (res.data.code === 0 && res.data.data) {
                    this.isShowQueue = res.data.data.customerQueueSwitch;
                    this.showQueueCount = res.data.data.queueCount;
                }
            });
        },
        currentChatEnlistNumFun(value){
            let num = 0;
            if(this.storeCurrentChatEnlist == null){
                this.currentChatEnlistNum = num;
                return num
            }
            this.storeCurrentChatEnlist.map((v,i)=>{
                // 正在排队个数
                if(value == 'queue'){
                    if(v.contentType == 8){
                        num+=1;
                    }
                }else{
                    if(v.contentType != 8){
                        num+=1;
                    }
                }

            });
            return num
        },
        queueChatEnlistNumFun(){
            let num = 0;
            this.storeCurrentChatEnlist.map((v,i)=>{
                // 正在排队个数
                if(v.contentType == 8){
                    num+=1;
                }
            });
            this.queueChatEnlistNum = num;
            return this.queueChatEnlistNum > 0
        },
        /**
         * 根据face名称返回一个img图片
         * @param {String} faceName face名称
         */
        getImgByFaceName: function(faceName) {
            var imgStr = '<img class="qqemoji small qqemoji@faceIndex" text="@faceName" src="/static/image/im_emoji_spacer.gif"/>';
            var faceIndex = 0;
            for (var i = 0; i < this.$data.qqemojiList.length; i++) {
                if (this.$data.qqemojiList[i] == faceName) {
                    faceIndex = i;
                    break;
                }
            }
            imgStr = imgStr.replace(/@faceIndex/g, faceIndex).replace(/@faceName/g, faceName);
            return imgStr;
        },
        /**
         * 转换为QQ表情
         */
        getqqemojiEmoji: function(value) {
            if (value == undefined) {
                return;
            }
            var self = this;
            return value.replace(/\[(.+?)\]/g, function(item, value) {
                return self.getImgByFaceName(value);
            });
        },
        // 我的对话列表，同时登陆在线
        myConversation(){
            // 默认 坐席ID AAAAAAAAAAAAAAA

        },
        handleChange(v){
            if(v == 1){
                this.changChat = !this.changChat;
            }else if(v == 2){
                this.changWorkedTogether = !this.changWorkedTogether;
            }else if(v == 3){
                this.changQueue = !this.changQueue;
            }
        },
        /**
         * 选中当前列表的chat
         * @param {Object} en call实体类
         */
        selectChat: function(en) {
            // sender
            // trackid
            this.active= en.sender;
            this.$store.imServerStore.commit('setServerValues',{
                trackid:en.trackid,
                seatsId:en.sender
            })
            let that = this;
            that.$store.imServerStore.dispatch('selectChat', { clientChatId: en.sender }).then(res=>{
                if(that.$parent.storeSelectedChatEn != null && that.$parent.$refs.im_chat){
                    that.$store.imServerStore.state.currentChatEnlist.map((v,i)=>{
                        if(en.sender == v.sender && v.msgList.length == 0){
                            let opt = {
                                currentSize: 0, //当前页数
                                historySumPage: 1, // 历史记录总页数
                                lastTrackId: ""
                            };
                            this.$parent.storeSelectedChatEn.searchHistoryCondition = {
                                currentSize: 1, //当前页数
                                historySumPage: 2, // 历史记录总页数
                                lastTrackId: ""
                            };
                            that.$parent.$refs.im_chat.$refs.common_chat.loadHistory(en.trackid,opt);
                        }
                    })
                }
                
            })
            // this.$emit('selectedChat', {trackid:en.trackid,seatsId:en.sender}); // 事件上传
            this.trackid = en.trackid ; // 会话ID
            /**
             * 更新访客信息
             * 当前打开的会话与选择的会话不一致
             */
            if(this.$parent.storeSelectedChatEn != null){
                if(en.sender != this.$parent.storeSelectedChatEn.sender){
                    this.$parent.$refs.im_chat.checkUserBlackList(en.sender); //校验黑名单
                    this.$parent.$refs.im_chat.loadingVisitorInformation(en.sender);
                    this.$parent.$refs.im_chat.getVisitorLatestTicket(en.sender);
                    
                    if(en.userId != ""){
                        this.$parent.$refs.im_chat.getCustomerTabLists(); //展示标签
                    }
                    this.$parent.$refs.im_chat.storeSelectedChatEn.inputContent = ""; //切换清空
                    document.getElementById("common_chat_input").innerHTML = "";
                }
            }
        },
        /**
         * 设置关注
         */
        toggleFollowIcon: function(en) {
            en.isFollow = !en.isFollow;
            // 排序
            this.$store.imServerStore.commit('sortCurrentChatEnlist', {});
        },

        /**
         * 获取背景class
         * @param {string} clientChatName 姓名
         */
        getBgClass: function(clientChatName) {
            return "";
            // var rs = clientChatName.charCodeAt(0) % 5;
            // return 'bg' + rs;
        },

        /**
         * 返回chat对象的最后一次消息时间
         * @param {String|Date} sValue 传入的时间字符串
         */
        getLastMsgTimeStr: function(sValue) {
            if (sValue == null) {
                return '';
            }
            var rs = this.$ak.Utils.getDateTimeStr(sValue, 'H:i:s');
            return rs;
        }
    }
};
</script>

<style lang="less">
.imRecord-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0px;
    // & > .header {
    //     display: flex;
    //     align-items: center;
    //     height: 50px;
    //     border-bottom: 1px solid #e6e6e6;
    //     .kf-info-wrapper {
    //         position: relative;
    //         width: 150px;
    //         height: 50px;
    //         padding: 0 20px;
    //         .kf-avatar {
    //             width: 50px;
    //             height: 50px;
    //         }
    //         .kf-name {
    //             font-size: 16px;
    //         }
    //     }
    //     .client-info-wrapper {
    //         p:first-child {
    //             margin-bottom: 5px;
    //         }
    //         .fa {
    //             margin-right: 10px;
    //         }
    //     }
    // }

}
.imRecord-wrapper>ul{
    height: 100%;
    width: 100%;
    overflow-y: auto;
}
.imRecord-wrapper>ul>li{
    height: 50%;
    width: 100%;
    overflow-x: hidden;
    cursor: pointer;
}
.item-list {
            height: calc(~'100% - 46px');
			overflow-y: auto;
            .item{
                min-height: 87px;
                border-bottom: 1px solid #e6e6e6;
            }
            .active{
                background-color: #f2f3f5;
            }
            .item {
                position: relative;
                // height: 100%;
                padding: 0px;
                // border-bottom: 1px solid #e6e6e6;
                cursor: pointer;
                // display: flex;
				.item-box{
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					height: 87px;
				}
                .item-img{
                    font-size: 30px;
                    margin-right: 10px;
                    width: 40px;
                    &.on i{
                        color: #009de7;
                    }
                    &.off i{
                        color: #d5d5d5;
                    }
                }
                .item-center{
                    width: 150px;
                    .item-aree{
                        font-size: 12px;
                        color: #767d85;
                        margin-right: 10px;
                        width: 110px;
                        float: left;
                    }
                    .inputNewContent{
                        max-width: 100px;
                        display: inline-block;
                        overflow: hidden;
                        text-overflow: ellipsis
                    }
                    .item-time{
                        width: 30px;
                        font-size: 12px;
                        color: #767d85;
                        float: left;
					}
				}

                // &.active,
                // &:hover {
                    // background-color: #0095ff;
                    // .info-wrapper .first-p .name,
                    // .info-wrapper .second-p .lastMsgContent,
                    // .info-wrapper .first-p .lastMsgTime {
                    //     color: #eaf4fb;
                    // }
                    // .iconfont {
                    //     display: initial !important;
                    // }
                // }
                .followicon-wrapper {
                    position: relative;
                    float: left;
                    width: 25px;
                    height: 100%;
                    .iconfont {
                        display: none;
                        font-size: 12px;
                        color: #eaf4fb;
                        &.active {
                            display: initial;
                            color: #f9ce1d;
                        }
                    }
                }

			}
			.item-label-box{
				padding-left: 100px;
				margin-top: -20px;
    			margin-bottom: 10px;
				.item-label{
					max-width: 120px;
					position: relative;
					display: inline-block;
					padding: 4px 7px;
					margin-right: 5px;
					line-height: 1;
					font-size: 12px;
					color: #fff;
					text-align: left;
					white-space: nowrap;
					border-radius: 3px;
					cursor: pointer;
					overflow: hidden;
					text-overflow: ellipsis;
					vertical-align: middle;
				}
			}
        }
.item .unreadClass{
    color: #fe471a;
    position: relative;
    .list-classic{
        position: absolute;
        left: 55px;
        top: 40px;
        width: auto;
        min-width: 22px;
        height: 22px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        line-height: 19px;
        background-color: #fe471a;
        border: 2px solid #fff;
        border-radius: 50%;
    }
    .item-aree{
        color: #fe471a !important;
    }
    .item-time{
        color: #fe471a !important;
    }
}
.imChat-header{
    position: relative;
}
.imChat-header .chat_jiao{
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px solid #767d85;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    transition: all .3s;
    top: 18px;
    left: 2px;
    transform: rotate(360deg);
}
.imChat-header .chat_right{
    position: absolute;
    display: inline-block;
    vertical-align: middle;
    top: 14px;
    right: 4px;
    font-size: 13px;
    color: #767d85;
}
.imChat-header .chat_jiao.changChatClass{
    transform: rotate(270deg);
}
.imChat-header .content{
    text-align: center;
}
.imChat-header .content img{
    // font-size: 100px;
    width: 80px;
}
.imChat-header .content .title{
    font-size: 12px;
    color: #989ea6;
}
// .main {
//         height: calc(~'100% - 50px');
//         position: relative;
//         .item-list {
//             height: calc(~'100% - 46px');
//             overflow-y: auto;
//             .item {
//                 position: relative;
//                 height: 87px;
//                 padding: 0px;
//                 border-bottom: 1px solid #e6e6e6;
//                 background-color: #f2f3f5;
//                 cursor: pointer;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//                 .item-img{
//                     font-size: 30px;
//                     margin-right: 10px;
//                     width: 40px
//                 }
//                 .item-center{
//                     width: 150px;
//                     .item-aree{
//                         font-size: 12px;
//                         color: #767d85;
//                         margin-right: 10px;
//                         width: 110px;
//                         float: left;
//                     }
//                     .item-time{
//                         width: 30px;
//                         font-size: 12px;
//                         color: #767d85;
//                         float: left;
//                     }
//                 }


//                 // &.active,
//                 // &:hover {
//                     // background-color: #0095ff;
//                     // .info-wrapper .first-p .name,
//                     // .info-wrapper .second-p .lastMsgContent,
//                     // .info-wrapper .first-p .lastMsgTime {
//                     //     color: #eaf4fb;
//                     // }
//                     // .iconfont {
//                     //     display: initial !important;
//                     // }
//                 // }
//                 .followicon-wrapper {
//                     position: relative;
//                     float: left;
//                     width: 25px;
//                     height: 100%;
//                     .iconfont {
//                         display: none;
//                         font-size: 12px;
//                         color: #eaf4fb;
//                         &.active {
//                             display: initial;
//                             color: #f9ce1d;
//                         }
//                     }
//                 }

//             }
//         }
//         .empty-wrapper {
//             font-size: 16px;
//             color: #3e3e3e;
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             .content {
//                 width: 170px;
//                 height: 200px;
//                 margin: 0px auto;
//                 text-align: center;
//                 color: #867c7c;
//                 .iconfont {
//                     font-size: 90px;
//                 }
//                 .title {
//                     margin-top: 25px;
//                 }
//             }
//         }
//     }
</style>
