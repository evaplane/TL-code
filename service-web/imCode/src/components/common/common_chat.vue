<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-05 21:23:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-30 04:03:08
 -->
<!-- 聊天记录 -->
<template>
  <div
    class="common_chat-wrapper"
    :class="{commonChatFooterClientBorder:oprRoleName!='server'}"
    @click="clear_popup()"
  >
    <div class="common_chat-inner">
      <!-- 聊天记录 -->
      <div class="common_chat-main" id="common_chat_main" ref="common_chat_main">
        <div
          v-if="!showCustomerService && chatInfoEn.searchHistoryCondition.historySumPage > chatInfoEn.searchHistoryCondition.currentSize"
          class="messHistory"
          :class="{messHistoryClient:oprRoleName=='client'}"
          @click="loadHistory()"
        >
          <i class="el-icon-caret-top pull-left"></i>
          <p class="pull-left">查看之前的对话</p>
        </div>
        <!-- <p class="niuTag" v-if="niuDialogVisible">
          请点此
          <a target="_blank" :href="niuUrl">安装</a>截图插件
          <i class="el-alert__closebtn el-icon-close" @click="niuDialogVisible = false"></i>,安装成功后请刷新当前页面
        </p> -->
        <div class="common_chat-main-content">
          <div class="inner">
            <div v-for="(item ,index) in chatInfoEn.msgList" :key="index">
              <!-- 系统消息 -->
              <div v-if="chatInfoEn.chatState=='sys'" class="item sys">
                <!-- 1)文本类型 -->
                <div v-if="item.contentType=='text'" class="text-content">
                  <p>{{item.content}}</p>
                </div>
              </div>
              <!-- 客户、客服 -->
              <div
                v-else
                class="item"
                :class="{oprRoleName:oprRoleName=='server',sender:item.type == 'sys',receiver: item.type == 'client' }"
              >
                <div class="info-wrapper" :class="item.state">
                  <!-- 头像 -->
                  <!-- <div class="avatar-wrapper">
                                        <img class="kf-img" :src="item.avatarUrl">
                  </div>-->

                  <!-- 时间 -->
                  <div
                    v-if="item.contentType != 10 && item.contentType!=3 && item.contentType!=50"
                    class="info-wrapper-time"
                  >
                    <span>
                      {{item.time}}
                      <span
                        v-if="oprRoleName=='server' && item.type == 'sys'"
                      >{{item.sendUserName}}</span>
                    </span>
                  </div>
                  <!-- 1)文本类型 -->
                  <div
                    v-if="item.contentType== 0"
                    class="item-content common_chat_emoji-wrapper-global"
                  >
                    <span v-if="oprRoleName == 'client'" class="arrow-bg"></span>
                    <span v-if="oprRoleName == 'client'" class="arrow"></span>
                    <p class="text" v-html="getqqemojiEmoji(item.center)"></p>
                  </div>
                  <!-- 2)图片类型 -->
                  <div v-else-if="item.contentType== 1" class="item-content img">
                    <img
                      class="img"
                      :src="item.center"
                      @click="imgViewDialog_show(item)"
                      v-if="!isMobile"
                    />
                    <div v-else>
                      <img
                        v-preview="item.center"
                        :src="item.center"
                        :key="index"
                        preview-title-enable="true"
                        preview-nav-enable="true"
                      />
                    </div>
                  </div>
                  <!-- 3)文件类型 -->
                  <div v-else-if="item.contentType==2" class="item-content file">
                    <div class="file">
                      <div class="el-icon-document"></div>
                      <div class="file_content">
                        <div class="file_info">
                          <span class="file_name">{{showFile(item.center,'name')}}</span>
                          <span class="file_size">{{showFile(item.center,'size')}}</span>
                        </div>
                        <div v-if="fileUpdIndexFun(index) == index" class="progressTip">
                          <el-progress :percentage="percentage" :color="customColor"></el-progress>
                        </div>
                        <div class="file_status">
                          <!-- <span>13小时后过期</span> -->
                          <a
                            v-if="showDownload(item.center)"
                            :href="showFile(item.center,'url')"
                            target="_blank"
                            :download="showFile(item.center,'name')"
                            class="file_download"
                          >
                            <i class="el-icon-download"></i>下载
                          </a>
                        </div>
                      </div>
                      <!-- <div class="file-info">
                                                <p class="file-name">{{getFileName(item.fileName)}}</p>
                                                <div class="file-opr">
                                                    <div v-show="item.state=='success'">
                                                        <a class="file-download" :href="item.fileUrl" target="_blank" :download="item.fileUrl">下载</a>
                                                    </div>
                                                </div>
                      </div>-->
                    </div>
                  </div>
                  <!-- 邀请评论 -->
                  <div v-else-if="item.contentType==3 " class="info-wrapper-time dialog inviteDiv">
                    <!-- 座席端显示 -->
                    <span class="invite" :ss="item.center" v-if="oprRoleName=='server' && setEvalData(item.center,'lv') == 0">
                      {{item.time}}{{setEvalData(item.center,'data')}}
                    </span>
                    <!-- 座席端显示评价结果 -->
                    <div v-else-if="oprRoleName=='server' && setEvalData(item.center,'lv') != 0">
                      <div class="inviteEval">
                        <span>{{item.time}}</span>
                        <span>顾客评价</span>
                      </div>
                      <div class="inviteEval">
                        <span class="eval" :class="{evalBackColor1:setEvalData(item.center,'lv') == '1',evalBackColor2:setEvalData(item.center,'lv') == '2',evalBackColor3:setEvalData(item.center,'lv') == '3'}"
                        >
                          <i
                            class="iconfont-main"
                            :class="{iconHaoping:setEvalData(item.center,'lv') == '1',iconZhongping:setEvalData(item.center,'lv') == '2',iconChaping:setEvalData(item.center,'lv') == '3'}"
                          ></i>
                          <span >{{setEvalData(item.center,'lvType')}}</span>
                        </span>
                      </div>
                      <div class="inviteEval evalDataParent">
                        <div class="evalDataClass" :title="setEvalData(item.center,'data')">{{setEvalData(item.center,'data')}}</div>
                      </div>
                    </div>

                    <!-- 访客端显示 -->
                    <evaluateDialog
                      v-else-if="oprRoleName!='server' && evaluateDialogShow"
                      @closeEvaluateDialog="closeEvaluateDialog"
                      :clientValue="clientValue"
                    ></evaluateDialog>
                    <span
                      class="invite inviteClientJg"
                      v-else-if="oprRoleName!='server' && (setEvalData(item.center,'lv') == '1' || setEvalData(item.center,'lv') == '2' ||setEvalData(item.center,'lv') == '3')"
                    >
                      你给出了
                      <span
                        :class="{evalClient1:setEvalData(item.center,'lv') == '1',evalClient2:setEvalData(item.center,'lv') == '2',evalClient3:setEvalData(item.center,'lv') == '3'}"
                      >{{setEvalData(item.center,'lvType')}}</span>
                      <div class="evalDataClass" :title="setEvalData(item.center,'data')">{{setEvalData(item.center,'data')}}</div>
                    </span>
                  </div>
                  <!-- 4)转接提示类型 -->
                  <div
                    v-else-if="item.contentType==10 && !initialNewsWhere"
                    class="info-wrapper-time dialog"
                  >
                    <span>{{item.center}}</span>
                  </div>
                  <!-- 5)欢迎语+问题 类型 -->
                  <div
                    v-else-if="item.contentType==40 && !initialNewsWhere"
                    class="item-content common_chat_emoji-wrapper-global"
                  >
                    <span v-if="oprRoleName == 'client'" class="arrow-bg"></span>
                    <span v-if="oprRoleName == 'client'" class="arrow"></span>
                    <p class="text" v-html="getqqemojiEmoji(item.center)"></p>
                    <p class="text" @click="robotQs" v-html="getqqemojiEmoji(item.str)"></p>
                  </div>
				  <!-- 6)添加或删除 顾客标签 -->
				  <div v-else-if="oprRoleName=='server' && item.contentType==50" class="info-wrapper-time dialog changeCustomerLabel">
					  <span class="invite">
						{{item.time}} {{setEvalData(item.center,'data')}}
					  </span>
					  <br>
					  <div class="customerLabel" :style="{backgroundColor: JSON.parse(item.center).bgColor}">{{JSON.parse(item.center).name}}</div>
				  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 底部区域 -->
      <div class="common_chat-footer" :class="{commonChatFooterServer:oprRoleName=='server'}">
        <div class="imServerAndClient">
          <!-- 表情、文件选择等操作 服务端 -->
          <div class="opr-wrapper" :class="!isImServer?'imClientClass':'imServer'">
            <common-chat-emoji title="表情" class="item" ref="qqemoji" @select="qqemoji_selectFace"></common-chat-emoji>
            <a class="item" href="javascript:void(0)" @click="fileUpload_click('img')">
              <i title="发送图片" class="iconfont-main icon-tupian"></i>
            </a>
            <!-- <a class="item" href="javascript:void(0)" @click="domToImg()" v-if="!isMobile">
              <i title="截图" class="iconfont-main el-icon-scissors"></i>
            </a> -->
            <a
              v-if="oprRoleName=='server'"
              class="item"
              href="javascript:void(0)"
              @click="fileUpload_click('file')"
            >
              <i title="发送文件" class="iconfont-main icon-wenjian1"></i>
            </a>
            <a class="item" href="javascript:void(0)" @click="invite_click()">
              <i title="评价" class="iconfont-main icon-invitationcomment"></i>
            </a>
            <form method="post" enctype="multipart/form-data">
              <input
                type="file"
                name="uploadFile"
                accept="image/jpeg, image/jpg, image/png"
                id="common_chat_opr_fileUpload"
                style="display:none;position:absolute;left:0;top:0;width:0%;height:0%;opacity:0;"
              />
            </form>
            <form method="post" enctype="multipart/form-data">
              <input
                type="file"
                name="uploadFile"
                id="common_chat_opr_fileUploadFile"
                style="display:none;position:absolute;left:0;top:0;width:0%;height:0%;opacity:0;"
              />
            </form>
            <a
              v-if="oprRoleName=='server'"
              class="item quickResponse"
              href="javascript:void(0)"
              @click="quickResponse_click()"
            >
              <i title="快捷回复" class="iconfont-main icon-kuaijiehuifu"></i>快捷回复
            </a>
          </div>
          <!-- 聊天输入框 -->

          <div class="input-wrapper" :class="isImServer?'imServerClass':''">
            <div
              maxlength="500"
              class="inputContent common_chat_emoji-wrapper-global"
              id="common_chat_input"
              tabindex="0"
              contenteditable="true"
              @paste.stop="inputContent_paste"
              @drop="inputContent_drop"
              @keydown="inputContent_keydown"
              @mouseup="inputContent_mouseup"
              @mouseleave="inputContent_mouseup"
              @blur="input_blur"
              @focus="input_focus"
            ></div>
          </div>
          <div :class="!isImServer?'imClientBtoClass':''">
            <!-- 表情、文件选择等操作 客户端 -->
            <!-- <div class="opr-wrapper" v-if="!isImServer">
                            <common-chat-emoji class="item" ref="qqemoji" @select="qqemoji_selectFace"></common-chat-emoji>
                            <a class="item" href="javascript:void(0)" @click="fileUpload_click('file')">
                                <i class="iconfont fa fa-file-o"></i>
                            </a>
                            <form method="post" enctype="multipart/form-data">
                                <input type="file" name="uploadFile" id="common_chat_opr_fileUpload" style="display:none;position:absolute;left:0;top:0;width:0%;height:0%;opacity:0;">
                            </form>
            </div>-->
            <el-button
              type="primary"
              size="small"
              class="send-btn"
              @click="sendText()"
              :disabled="chatInfoEn.inputContent.length==0 && chatInfoEn.inputNewContent == ''"
            >发送</el-button>
          </div>
          <!-- 发送按钮 -->

          <div v-if="!isImServer" class="footer">
            <span>客服软件</span>
          </div>
        </div>
        <!-- 离线 -->
        <div v-if="chatInfoEn.state=='off' || chatInfoEn.state=='end'" :class="{offWrapperClient:oprRoleName!='server',offWrapper:oprRoleName=='server'&&chatInfoEn.blankList == 'off'}">
          <!-- 是否已加入黑名单 -->
          <div v-if="chatInfoEn.blankList == 'off'" class="blankList" >
            <div class="content contentDilog">
              <div v-if="chatInfoEn.clienBankList == 'on'" class="blankListFlex">
                当前顾客已被移至黑名单
                <span @click="removeBlackList " class="btn-restart-chat">移出黑名单</span>
              </div>
              <div v-else class="blankListFlex">抱歉，客服系统暂时无法使用</div>
            </div>
          </div>
          <div v-else>
            <div v-if="oprRoleName!='server'" class="content">
              对话已结束，您可以
              <span @click="newDialogue" class="btn-restart-chat">开始新的对话</span>或
              <span @click="leaveMessage" class="btn-restart-chat">留言</span>
            </div>
            <!-- <div class="content contentDilog">访客已下线</div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 图片查看dialog -->
    <!-- <el-dialog
      title
      :visible.sync="imgViewDialogVisible"
      class="imgView-dialog"
      :modal="false"
      :modal-append-to-body="false"
    >
      <div class="main">
        <img class="img" :src="imgViewDialog_imgSrc" />
      </div>
    </el-dialog>-->
    <!-- 图片查看dialog -->
    <el-dialog
      height="auto"
      ref="elDialog"
      :visible.sync="imgViewDialogVisible"
      @close="imgViewDialog_close"
      class="imgView-dialog"
      :modal="false"
    >
      <div class="main" ref="elDialogMain">
        <img
          class="img"
          ref="elDialogImg"
          id="elDialogImg"
          :src="imgViewDialog_imgSrc"
          :style="{transform:'rotateZ('+deg+'deg)'}"
        />
      </div>
      <div class="main-edit">
        <i class="iconfont-main icon-anticlockwise" title="逆时针旋转" @click="rotateFan"></i>
        <i class="iconfont-main icon-clockwise" title="顺时针旋转" @click="rotate"></i>
      </div>
    </el-dialog>
    <!-- 截图预览 -->
    <el-dialog
      height="auto"
      title="发送图片"
      center
      :visible.sync="screenCapture"
      @close="screenCapture_close"
      class="screenCapture-dialog"
      :modal="false"
    >
      <div class="main">
        <img class="img" :src="screenCapture_imgSrc" />
      </div>
      <div class="main-edit">
        <el-button type="primary" @click="screenCaptureSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import common_chat_emoji from "./common_chat_emoji.vue";
import evaluateDialog from "../imClient/evaluateDialog";
import { setTimeout } from "timers";
import { types } from "util";
// import ImagePreview from 'image-preview'

export default {
  components: {
    commonChatEmoji: common_chat_emoji,
    evaluateDialog: evaluateDialog
  },
  props: {
    chatInfoEn: {
      required: true,
      type: Object,
      default: {
        inputContent: "",
        msgList: []
      }
    },
    // 访客端数据
    clientValue: {
      required: true,
      type: Object,
      default: ""
    },
    serverValues: {
      required: true,
      type: Object,
      default: () => {
        return {};
      }
    },
    // 判断当前是否为服务端
    isImServer: {
      required: true,
      type: Boolean,
      default: false
    },
    // 是否显示历史记录
    showCustomerService: {
      required: true,
      type: Boolean,
      default: false
    },
    // 人工转接提示
    initialNewsWhere: {
      required: true,
      type: Boolean,
      default: false
    },
    initialConnect: {
      required: true,
      type: Boolean,
      default: false
    },
    // 邀评
    evaluateDialogShow: {
      required: true,
      type: Boolean,
      default: false
    },
    oprRoleName: {
      required: true,
      type: String,
      default: ""
    }, // 操作者名称；e.g. server:服务端、client:客服端
    // 聊天下标
    imgLoadingShow: {
      required: true,
      type: Number,
      default: -1
    },
    // 常见问题 数组
    qsAllArr: {
      required: false,
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      showTransformServer: true,
      updImg: "", //上传类型选择
      // isImServer: false, //判断 当前是否为服务端
      inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容
      selectionRange: null, // 输入框选中的区域
      shortcutMsgList: [], // 聊天区域的快捷回复列表
      imgViewDialogVisible: false, // 图片查看dialog的显示
      screenCapture: false, //截图是否预览
      deg: 0,
      degStart: 0,
      imgViewDialog_imgSrc: "", // 图片查看dialog的图片地址
      screenCapture_imgSrc: "", // 截图预览图片地址
      // currentSize: 1, //当前页数
      percentage: 0, // 上传进度-- 废弃
      customColor: "#409eff", //进度颜色
      fileUpdIndex: -1,
      updFileType: "", //上传类型
      getTheFocusForFirstTim: true, //当访客获得输入框焦点时
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      captureObj: null,
      niuDialogVisible: false,
      niuUrl: "",
      niuTime: null
    };
  },
  computed: {
    isMobile() {
      return this.$store.imServerStore.state.isMobile;
    }
  },
  watch: {
    oprRoleName(val) {
      console.log("变化", val);
    }
  },
  methods: {
    handleClose() {},
    clear_popup(value) {
      if (this.$refs.qqemoji != undefined) {
        this.$refs.qqemoji.faceHidden = this.clear_popup;
      }
    },
    /**
     * 评价等级 + 评价内容
     */
    setEvalData(data,modl){
      let evalData = "";
      if(data != ''){
        if(modl == "lv"){
          evalData = JSON.parse(data).lv;
        }else if(modl == "data"){
          evalData = JSON.parse(data).center;
        }else{
          evalData = JSON.parse(data).lv == 1?"好评":JSON.parse(data).lv == 2?"中评":"差评";
        }
      }
      return evalData;
    },
    removeBlackList() {
      let that = this;
      let opt = {
        ipAddress: that.chatInfoEn.clientip, //ip地址
        visitorId: that.serverValues.seatsId
      };
      that.$axios
        .post(that.$httpServer.saveOrDeleteBlackVisitor, opt)
        .then(res => {
          that.$store.imServerStore.dispatch("addChatMsg", {
            clientChatId: that.serverValues.seatsId,
            msg: {
              type: "sys",
              contentType: -20, //移出-20
              time: this.$ak.Utils.getNowFormatDate(),
              center: ""
            },
            successCallback: function() {}
          });
          document.getElementById('common_chat_input').focus();
          that.$parent.$data.userBlackList = !that.$parent.$data.userBlackList;
        });
    },
    // 是否显示下载按钮
    showDownload(value) {
      let fileUrl = value.split("?")[0];
      if (fileUrl != "-1") {
        return true;
      } else {
        return false;
      }
    },
    closeEvaluateDialog(value) {
      this.$emit("closeEvaluateDialog", value);
    },
    // 是否显示下载进度条
    fileUpdIndexFun(index) {
      if (this.$store.imServerStore.state.fileUpdIndex > 0) {
        return this.$store.imServerStore.state.fileUpdIndex;
      } else {
        this.percentage = 0;
        return -1;
      }
    },
    // 关闭评价框
    evaluateDialogFun() {
      this.$parent.$parent.$parent.$data.evaluateDialogShow = false;
    },
    /**
     * 坐席端邀请评论
     */
    invite_click() {
      // 客户端发送
      if (this.oprRoleName == "client") {
        if (this.initialConnect) {
          this.$emit("addChatMsg", {
            center: "",
            contentType: 3,
            msgType: 5,
            sender: "1",
            time: "",
            type: "client"
          });
        } else {
          this.$message1({
            showClose: true,
            message: "请转接专员服务！",
            type: "error"
          });
        }
      } else {
        this.$emit("sendMsgServer", {
          type: "sys",
          contentType: 3, // 3.邀评
          time: this.$ak.Utils.getNowFormatDate(),
          center: JSON.stringify({lv:0,center:'邀评'})
        });
      }
      document.getElementById('common_chat_input').focus();
    },
    /**
     * 展示快捷回复
     */
    quickResponse_click() {
      this.$emit("showQuickResponseFun", "");
    },
    /**
     * 开始新对话
     */
    newDialogue() {
      this.$emit("chatCallback", "");
      this.chatInfoEn.state = "on";
    },
    /**
     *  留言
     *  */
    leaveMessage() {
      this.$emit("showLeaveFun", "");
      // this.$parent.showLeaveFun();
    },
    // 加载历史记录
    loadHistory(trackIdServer,opt) {
      let that = this;
      let trackIdValues = ""; // 会话ID
      let checkData = ""; // 校验数据
      let hisSearch = opt?opt:that.chatInfoEn.searchHistoryCondition; // 加载历史会话
      hisSearch.currentSize += 1; //当前页数+1
      // 转人工
      // if(that.clientValue){

      // }
      if (that.oprRoleName == "client") {
        trackIdValues = that.clientValue.bindInfo.trackId;
        checkData = that.clientValue.bindInfo.clientId;
      } else {
        trackIdValues = trackIdServer?trackIdServer:that.chatInfoEn.trackid;
        checkData = JSON.parse(sessionStorage.getItem("userInfo")).user_id;
      }
      let filterDialogFlag = 0; //0:屏蔽 1：不屏蔽当前会话
      if (that.$store.imServerStore.state.selectedChatEn) {
        filterDialogFlag = that.$store.imServerStore.state.selectedChatEn.searchHistoryCondition.lastTrackId == ''? 1: 0;
      }
      that.$axios
        .get(
          that.$httpServer.loadedHistory +
            "?trackId=" +
            trackIdValues +
            "&size=" +
            "5" +
            "&current=" +
            hisSearch.currentSize +
            "&filterDialogFlag=" +
            filterDialogFlag
        )
        .then(res => {
          if (res.data.data == null) {
            hisSearch.historySumPage = 0;
            return;
          }
          hisSearch.historySumPage = res.data.data.pages; // 总页数
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
            that.chatInfoEn.msgList.unshift(newMess);
          }
        });
    },
    // 文件名解析
    showFile(value, type) {
      var params = {};
      var url = value;
      var urls = url.split("?");
      var arr = urls[1].split("&");
      for (var i = 0, l = arr.length; i < l; i++) {
        var newUrl = arr[i].split("=");
        params[newUrl[0]] = newUrl[1];
      }
      if (type == "name") {
        return params.name;
      }
      if (type == "size") {
        return params.size;
      }
      if (type == "url") {
        return urls[0];
      }
    },
    /**
     * 初始化
     * @param {Object} opts 可选对象
     */
    init: function(opts) {
      var self = this;
      // 初始化状态
      document.getElementById("common_chat_input").innerHTML = "";
      self.$refs.qqemoji.$data.faceHidden = true;
      // 在线状态
      // if (this.chatInfoEn.state == "on") {
        // 1.显示在输入框的内容
        setTimeout(function() {
          // 未断开获取焦点
          document.getElementById("common_chat_input").focus();
          self.$parent.$data.serverKeyDown = true;
          self.setInputContentSelectRange();
          // 设置之前保存的输入框内容
          if (self.chatInfoEn.inputContent != "") {
            self.setInputDiv(self.chatInfoEn.inputContent);
          }
        }, 200);
      // } else {
      //   document.getElementById("common_chat_input").blur();
      // }

      // 2.滚动到底部
      this.$nextTick(function() {
        self.$refs.common_chat_main.scrollTop =
          self.$refs.common_chat_main.scrollHeight;
        // document.getElementById('common_chat_input').focus();
      });
    },

    /**
     * 发送文本
     */
    sendText: function() {
      let self = this;
      self.chatInfoEn.inputContent = document.querySelector(
        "#common_chat_input"
      ).innerHTML;

      let str = self.chatInfoEn.inputContent.replace(/&nbsp;/g, " "); //  去掉 nbsp;
      let newStr = str.replace(/\s+/g, ""); //  去掉空格;
      let newStrTag = newStr.replace(/<(?!img)[^>]+>/g, ""); //  去掉所有标签
      if (newStr == "" || newStrTag == "") {
        return false;
      }
      var msgContent = this.$ak.Utils.utf16toEntities(
        str
      );
      self.chatInfoEn.inputContent = "";
      document.getElementById("common_chat_input").innerHTML = "";
      // 客户端发送
      if (self.oprRoleName == "client") {
        self.$emit("sendMsg", {
          type: "client",
          contentType: 0,
          sendUserName: "", //发送人
          time: this.$ak.Utils.getNowFormatDate(),
          center: msgContent
        });
      } else {
        self.$emit("sendMsgServer", {
          type: "sys",
          contentType: 0,
          sendUserName: JSON.parse(sessionStorage.getItem("userInfo")).username, //发送人
          time: this.$ak.Utils.getNowFormatDate(),
          center: msgContent
        });
      }
      document.getElementById('common_chat_input').focus();
      // this.input_blur();
      // self.setInputContentByDiv();

      // this.sendMsg({
      //     contentType: 'text',
      //     content: msgContent
      // });
    },

    /**
     * 设置输入内容
     * 根据input输入框innerHTML转换为纯文本
     */
    setInputContentByDiv: function() {
      var self = this;
      var htmlStr = document.getElementById("common_chat_input").innerHTML;
      // 1.转换表情为纯文本：<img textanme="[笑]"/> => [笑]
      var tmpInputContent = htmlStr.replace(/<img.*?text="(.*?)".*?>/g, "[$1]");
      // var tmpInputContent = htmlStr.replace(/<img.+text=\"(.+?)\".+>/g, '[$1]').replace(/<.+?>/g, '');
      // 2.设置最长长度
      if (tmpInputContent.length > 500) {
        document.getElementById("common_chat_input").innerHTML = "";
        var value = tmpInputContent
          .substr(0, 499)
          .replace(/\[(.+?)\]/g, function(item, value) {
            return self.$refs.qqemoji.getImgByFaceName(value);
          });
        this.setInputDiv(value);
      }
      console.log(tmpInputContent)
      // 3.修改store
      // this.$emit("setInputContent",tmpInputContent)
      this.chatInfoEn.inputContent = tmpInputContent;
    },

    /**
     * 设置input输入框内容
     * @param {String} vlaue 设置的值
     */

    setInputDiv: function(value) {
      if (this.$data.selectionRange == null || !value) {
        // document.getElementById('common_chat_input').focus();
        return;
      }
      // 1.设置selectionRange
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(this.$data.selectionRange);
      } else {
        this.selectionRange && this.$data.selectionRange.select();
      }

      // 2.表情转换为img
      value = this.getqqemojiEmoji(value);

      // 3.聊天框中是否选中了文本，若选中文本将被替换成输入内容
      if (window.getSelection) {
        var sel = null,
          range = null;
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
          // 1)删除选中的文本(内容)
          range = sel.getRangeAt(0); // 获取鼠标选中的文本区域
          if (range.startOffset !== range.endOffset) {
            range.deleteContents(); // 删除选中的文本
          }

          // 2)创建以输入内容为内容的DocumentFragment
          var elemnet;
          if (range.createContextualFragment) {
            elemnet = range.createContextualFragment(value);
          } else {
            // 以下代码等同createContextualFragment
            // 创建一个DocumentFragment
            elemnet = document.createDocumentFragment();

            var divEl = document.createElement("div");
            divEl.innerHTML = value;
            // divEl下的元素，依次插入到DocumentFragment
            for (let i = 0, len = divEl.children.length; i < len; i++) {
              elemnet.appendChild(divEl.firstChild);
            }
          }
          // 3)选中文本的位置替换为新输入的内容，并把光标定位到新内容后方
          var lastNode = elemnet.lastChild;
          range.insertNode(elemnet);
          range.setStartAfter(lastNode);
          document.getElementById("common_chat_input").click();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(imgStr);
      }

      // 4.修改inputContent
      this.setInputContentByDiv();
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
        return self.$ak.Utils.getImgByFaceName(value);
      });
    },

    /**
     * 设置input输入框的选择焦点
     */
    setInputContentSelectRange: function() {
      if (window.getSelection && window.getSelection().rangeCount > 0) {
        var selectRange = window.getSelection().getRangeAt(0);
        if (
          selectRange.commonAncestorContainer.nodeName == "#text" &&
          selectRange.commonAncestorContainer.parentElement &&
          selectRange.commonAncestorContainer.parentElement.id ==
            "common_chat_input"
        ) {
          // 选中了输入框内的文本
          this.$data.selectionRange = selectRange;
        } else if (
          selectRange.commonAncestorContainer.id == "common_chat_input"
        ) {
          // 选中了输入框
          this.$data.selectionRange = selectRange;
          // setTimeout(() => {
          // this.rem -= document.body.scrollTop
          // }, 1000);
        }
      }
    },
    input_focus: function(e) {
      let that = this;
      // 客户端发送，访客状态
      if (that.getTheFocusForFirstTim && that.oprRoleName != "server") {
        if (that.initialConnect) {
          // setTimeout(()=>{
          that.$emit("sendMsg", {
            type: "client",
            contentType: 4,
            time: that.$ak.Utils.getNowFormatDate(),
            center: ""
          });

          // },1500)
          that.getTheFocusForFirstTim = false;
        }
      }
    },
    /**
     * 输入框离开事件
     */
    input_blur: function(e) {
      let that = this;
      that.$parent.$data.serverKeyDown = true;
      // 客户端发送，访客状态
      if (!that.getTheFocusForFirstTim && that.oprRoleName != "server") {
        if (that.initialConnect) {
          // setTimeout(() => {
          that.$emit("sendMsg", {
            type: "client",
            contentType: 5,
            time: that.$ak.Utils.getNowFormatDate(),
            center: ""
          });
          // }, 1500);

          that.getTheFocusForFirstTim = true;
        }
      }
    },
    /**
     * 输入框的mouseup
     */
    inputContent_mouseup: function(e) {
      this.setInputContentSelectRange();
    },

    /**
     * 输入框的keydown
     */
    inputContent_keydown: function(e) {
      if (this.$parent.$data.serverKeyDown && this.oprRoleName == "server") {
        this.$parent.$data.serverKeyDown = false;
        // return;
      }
      // 1.快捷键判断
      if (this.oprRoleName != "server" && e.keyCode == 13 && e.ctrlKey) {
        // 回车直接发送
        this.sendText();
        e.returnValue = false;
        return;
      }
      // if (this.oprRoleName != "server" && e.keyCode == 13) {
      //     // 回车直接发送
      //     this.sendText();
      //     e.returnValue = false;
      //     return;
      // }
      console.log("aaa");
      this.setInputContentSelectRange();
      var self = this;
      // keyup触发时，绑定的数据还没有被变更，需要进行延后访问
      clearTimeout(this.$data.inputContent_setTimeout);
      this.$data.inputContent_setTimeout = setTimeout(function() {
        self.setInputContentByDiv();
      }, 200);
    },

    /**
     * 输入框的粘贴
     */
    inputContent_paste: function(e) {
      var self = this;
      var isImage = false;
      if (e.clipboardData && e.clipboardData.items.length > 0) {
        // 1.上传图片
        for (var i = 0; i < e.clipboardData.items.length; i++) {
          var item = e.clipboardData.items[i];
          if (item.kind == "file" && item.type.indexOf("image") >= 0) {
            // 粘贴板为图片类型
            var file = item.getAsFile();
            let formData = new FormData();
            formData.append("file", file);
            self.$axios
              .post(self.$httpServer.im_fdfsupload, formData)
              .then(res => {
				self.screenCapture_show(res.data.data);
              });
            isImage = true;
          }
        }

        // 2.非图片，粘贴纯文本
        if (!isImage) {
          e.stopPropagation();
          e.preventDefault();
          var str = e.clipboardData.getData("text/plain");
          // 转化为纯文字
          var span = document.createElement("span");
          span.innerHTML = str;
          var txt = span.innerText;
          this.setInputDiv(
            txt
              .replace(/\n/g, "")
              .replace(/\r/g, "")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          );
        }
      }
    },

    /**
     * 文件上传_点击
     */
    fileUpload_click: function(fileType) {
      //上传图片
      let docUpdId = ""; // 上传对象
      if (fileType == "img") {
        docUpdId = document.getElementById("common_chat_opr_fileUpload");
      } else {
        docUpdId = document.getElementById("common_chat_opr_fileUploadFile");
      }
      this.updFileType = fileType;
      docUpdId.onchange = this.fileUpload_change;
      docUpdId.click();
    },
    rgb2value: function(r, g, b) {
      return r | (g << 8) | (b << 16);
    },
    onpluginLoaded: function() {
      captureObjSelf.pluginLoaded(false);
    },
    /**
     * 截图
     */
    // domToImg: function() {
    //   let that = this;
    //   html2canvas(document.body, {
    //     scale: 0.5,
    //     useCORS: true,
    //     backgroundColor: null
    //   }).then(function(canvas) {
    //     let img = canvas
    //       .toDataURL("image/png")
    //       .replace("image/png", "image/octet-stream");
    //     if (that.oprRoleName == "client") {
    //       that.$emit("sendMsg", {
    //         type: "client",
    //         contentType: 1,
    //         time: that.$ak.Utils.getNowFormatDate(),
    //         center: img
    //       });
    //     } else {
    //       that.$emit("sendMsgServer", {
    //         type: "sys",
    //         contentType: 1,
    //         time: that.$ak.Utils.getNowFormatDate(),
    //         center: img
    //       });
    //     }
    //     // document.body.appendChild(canvas);
    //   });
    // },
    // niuniuInit: function() {
    //   this.captureObj = null;
    //   this.niuUrl = "http://www.ggniu.cn/download/CaptureInstall.exe?";
    //   if (this.$ak.Utils.getOS() == "Mac") {
    //     this.niuUrl = "http://www.ggniu.cn/download/CaptureInstall.dmg?";
    //   }
    //   this.captureObj = new NiuniuCaptureObject();
    //   this.captureObj.NiuniuAuthKey = "niuniu";
    //   //此处可以设置相关参数
    //   this.captureObj.TrackColor = rgb2value(255, 0, 0);
    //   this.captureObj.EditBorderColor = rgb2value(0, 0, 255);

    //   //设置工具栏的TOOLTIP
    //   //this.captureObj.ToolTipText = "tipRectangle|tipCircle|tipArrow|tipBrush|tipGlitter|tipMosaic|tipText|tipUndo|tipSave|tipCancel|tipFinish|Finish";

    //   //设置控件加载完成以及截图完成的回调函数
    //   this.captureObj.FinishedCallback = this.OnCaptureFinishedCallback;
    //   this.captureObj.PluginLoadedCallback = this.PluginLoadedCallback;

    //   //初始化控件
    //   this.captureObj.InitNiuniuCapture();
    // },
    // domToImg: function() {
    //   var captureRet = this.captureObj.DoCapture("1.jpg", 0, 0, 0, 0, 0, 0);
    //   if(captureRet == emCaptureFailed){
    //     clearTimeout(this.niuTime);
    //     this.niuDialogVisible = true;
    //     this.niuTime = setTimeout( ()=>{
    //       this.niuDialogVisible = false;
    //     }, 3000)
    //   }else if(captureRet == emCaptureUnknown){
    //     clearTimeout(this.niuTime);
    //     this.niuDialogVisible = true;
    //     this.niuTime = setTimeout( ()=>{
    //       this.niuDialogVisible = false;
    //     }, 3000)
    //   }
    // },
    // OnCaptureFinishedCallback: function(
    //   type,
    //   x,
    //   y,
    //   width,
    //   height,
    //   info,
    //   content,
    //   localpath
    // ) {
    //   if (type < 0) {
    //     //需要重新安装控件
    //     this.$message1({
    //       message: "安装失败，请重新安装",
    //       type: "error"
    //     });
    //     return;
    //   }
    //   switch (type) {
    //     case 1:
    //       //截图完成
    //       this.UploadCaptureData(content, localpath);
    //       break;
    //     case 2:
    //       //取消截图
    //       break;
    //     case 3:
    //       //保存了截图到本地
    //       this.UploadCaptureData(content, localpath);
    //       break;
    //     case 4:
    //       if (info == "0") {
    //         //从剪贴板获取到了截图
    //         this.UploadCaptureData(content, localpath);
    //       } else {
    //         //从剪贴板获取图片失败
    //       }
    //       break;
    //   }
    // },
    // /*
    // 当控件成功加载后回调的的函数，您可以在此控制相应的UI显示
    // */
    // PluginLoadedCallback: function(success) {
    //   if (success) {

    //   }
    // },
    // UploadCaptureData: function(content, localpath) {
    //   var pos = localpath.lastIndexOf(".");
    //   var extendName = localpath.substr(pos + 1);
    //   let img = 'data:image/octet-stream;base64,'+content;
    //   this.screenCapture_show(img);

    // },
    // getBase64(img){//传入图片路径，返回base64
    //     function getBase64Image(img,width,height) {//width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    //         var canvas = document.createElement("canvas");
    //         canvas.width = width ? width : img.width;
    //         canvas.height = height ? height : img.height;

    //         var ctx = canvas.getContext("2d");
    //         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //         var dataURL = canvas.toDataURL();
    //         return dataURL;
    //     }

    //     var image = new Image();
    //     image.crossOrigin = '';
    //     image.src = img;
    //     image.onload =function (){
    //        return getBase64Image(image)//将base64传给done上传处理
    //     }
    // },
    // // 转base64
    // showImg(imgHttp){
    //    return this.getBase64(imgHttp);
    // },

    // 文件上传
    emitUpdFiles(conter) {
      // 客户端发送
      let that = this;
      if (that.oprRoleName == "client") {
        that.$emit("sendMsg", {
          type: "client",
          contentType: conter.type,
          time: this.$ak.Utils.getNowFormatDate(),
          center: conter.center
        });
      } else {
        that.$emit("sendMsgServer", {
          type: "sys",
          contentType: conter.type,
          time: this.$ak.Utils.getNowFormatDate(),
          center: conter.center
        });
      }
    },
    /**
     * 文件上传_选中文件
     */
    fileUpload_change: function(e) {
      // 1.判断有效
      // 1)大小
      let that = this;
      // 文件大小不能超过50MB
      if (e.target.files[0].size >= 1024 * 1024 * 50) {
        that.$message1({
          showClose: true,
          message: "文件大小不能超过50MB!",
          type: "error"
        });
        return false;
      }
      let fileSize = 0; // 文件大小
      let fileName = e.target.files[0].name; //文件名字
      if (e.target.files[0].size > 1024 * 1024) {
        fileSize =
          (
            Math.round((e.target.files[0].size * 100) / (1024 * 1024)) / 100
          ).toString() + "MB";
      } else {
        fileSize =
          (Math.round((e.target.files[0].size * 100) / 1024) / 100).toString() +
          "KB";
      }

      let type = ""; // 文件类型
      let conter = ""; // 文件值  小于10kb：base64，大于：网址
      let reg = /image\/\w+/; // 判断是否为图片

      // 上传监听进度
      var config = {
        onUploadProgress: function(e) {
          //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
          //如果lengthComputable为false，就获取不到e.total和e.loaded
          if (e.lengthComputable) {
            let computable = Math.round((e.loaded * 100) / e.total);
            if (computable <= 96) {
              that.percentage = computable;
            }
          }
        }
      };
      if (this.updFileType == "img") {
        // 判断是否为图片
        if (!reg.test(e.target.files[0].type)) {
          that.$message1({
            showClose: true,
            message: "请选择图片!",
            type: "error"
          });
          return;
        }
        /**
         * 图片上传 转base64
         */
        // if (e.target.files[0].size <= 1024 * 10) {
        //   let files = e.target.files[0];
        //   let reader = new FileReader();
        //   reader.readAsDataURL(files);
        //   reader.onload = function(e) {
        //     // 图片上传 base64
        //     that.emitUpdFiles({ type: 1, center: reader.result });
        //     document.getElementById("common_chat_opr_fileUpload").value = ""; //上传成功后清空
        //     document.getElementById("common_chat_opr_fileUploadFile").value =
        //       "";
        //   };
        // } else {
          // 图片上传 网址
          let myFormData = new FormData();
          myFormData.append("file", e.target.files[0]);
          that.$axios
            .post(that.$httpServer.im_fdfsupload, myFormData, config)
            .then(res => {
              if(res){
                setTimeout(() => {
                  that.emitUpdFiles({
                    type: 1,
                    center: res.data.data
                  });
                  document.getElementById("common_chat_opr_fileUpload").value = ""; //上传成功后清空
                  document.getElementById("common_chat_opr_fileUploadFile").value = "";
                }, 500);
              }
            });
        // }
      } else {
        // 预发送 文件地址为 -1
        this.$store.imServerStore.dispatch("addChatMsg", {
          clientChatId: that.serverValues.seatsId,
          msg: {
            type: "sys",
            contentType: 2,
            time: this.$ak.Utils.getNowFormatDate(),
            center: "-1" + "?name=" + fileName + "&size=" + fileSize // 预请求
          }
        });
        // 文件
        // 文件上传 网址
        let myFormData = new FormData();
        myFormData.append("file", e.target.files[0]);
        that.$axios
          .post(that.$httpServer.im_fdfsupload, myFormData, config)
          .then(res => {
            that.emitUpdFiles({
              type: 2,
              center: res.data.data + "?name=" + fileName + "&size=" + fileSize
            });
            that.percentage = 100;
            document.getElementById("common_chat_opr_fileUpload").value = ""; //上传成功后清空
            document.getElementById("common_chat_opr_fileUploadFile").value = "";
          });
      }
      document.getElementById('common_chat_input').focus();
    },

    /**
     * qqemoji选中表情
     */
    qqemoji_selectFace: function(rs) {
      var imgStr = rs.imgStr;
      this.setInputDiv(imgStr);
    },

    /**
     * 转换文件名，若文件名称超过9个字符，将进行截取处理
     * @param {String} fileName 文件名称
     */
    getFileName: function(fileName) {
      if (!fileName) {
        return;
      }
      var name = fileName.substring(0, fileName.lastIndexOf("."));
      var extend = fileName.substring(fileName.lastIndexOf(".") + 1);
      if (name.length > 9) {
        name = name.substring(0, 3) + "..." + name.substring(name.length - 3);
      }
      return name + "." + extend;
    },
    //   正方向
    rotate() {
      // console.log(this.deg)
      this.degStart = this.deg;
      this.deg += 90;
      if (this.deg == 90 || this.deg == 270) {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientWidth + "px";
        // console.log(this.deg,this.$refs.elDialogMain.style.height)
        // console.log(this.deg,this.$refs.elDialogImg.clientWidth,1)
      } else {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientHeight + "px";
        // console.log(this.deg,this.$refs.elDialogMain.style.height)
        // console.log(this.deg,this.$refs.elDialogImg.clientWidth,2)
        if (
          this.$refs.elDialogImg.clientHeight <
            this.$refs.elDialogImg.clientWidth &&
          this.degStart == -180
        ) {
          this.$refs.elDialogMain.style.height =
            this.$refs.elDialogImg.clientWidth + "px";
        }
      }
      if (this.deg >= 360) {
        this.deg = 0;
      }
    },
    //   反方向
    rotateFan() {
      // console.log(this.deg)
      this.degStart = this.deg;
      this.deg -= 90;
      if (this.deg == -90 || this.deg == -270) {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientWidth + "px";
        // console.log(this.deg,this.$refs.elDialogMain.style.height)
        // console.log(this.deg,this.$refs.elDialogImg.clientWidth,1)
      } else {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientHeight + "px";
        // console.log(this.deg,this.$refs.elDialogMain.style.height)
        // console.log(this.deg,this.$refs.elDialogImg.clientWidth,2)
        if (
          this.$refs.elDialogImg.clientHeight <
            this.$refs.elDialogImg.clientWidth &&
          (this.degStart == 0 || this.degStart == 180)
        ) {
          this.$refs.elDialogMain.style.height =
            this.$refs.elDialogImg.clientWidth + "px";
        }
      }
      if (this.deg >= 360 || this.deg == -360) {
        this.deg = 0;
      }
    },
    /**
     * 图片查看dialog_显示
     */
    imgViewDialog_show: function(item) {
      this.$data.imgViewDialogVisible = true;
      this.$data.deg = 0;
      this.$data.degStart = 0;
      this.$data.imgViewDialog_imgSrc = item.center;
      this.$nextTick(function() {
        this.$refs.elDialogMain.style.height = this.$refs.elDialogImg.clientHeight ? this.$refs.elDialogImg.clientHeight + "px" : "500px";
      });
    },
    /**
     * 图片查看dialog_关闭
     */
    imgViewDialog_close: function() {
      this.$data.imgViewDialogVisible = false;
      var self = this;
      setTimeout(function() {
        self.$data.screenCapture_imgSrc = "";
      }, 100);
    },
    /**
     * 图片预览dialog_显示
     */
    screenCapture_show: function(item) {
      this.$data.screenCapture = true;
      this.$data.screenCapture_imgSrc = item;
    },
    /**
     * 图片预览dialog_发送
     */
    screenCaptureSubmit: function() {
      if (this.oprRoleName == "client") {
        this.$emit("sendMsg", {
          type: "client",
          contentType: 1,
          time: this.$ak.Utils.getNowFormatDate(),
          center: this.$data.screenCapture_imgSrc
        });
      } else {
        this.$emit("sendMsgServer", {
          type: "sys",
          contentType: 1,
          time: this.$ak.Utils.getNowFormatDate(),
          center: this.$data.screenCapture_imgSrc
        });
      }
      this.$data.screenCapture = false;
      this.$data.screenCapture_imgSrc = "";
    },
    /**
     * 图片预览dialog_关闭
     */
    screenCapture_close: function() {
      this.$data.screenCapture = false;
      var self = this;
      setTimeout(function() {
        self.$data.imgViewDialog_imgSrc = "";
      }, 100);
    },

    /**
     * 输入框的拖拽
     */
    inputContent_drop: function(e) {
      var self = this;
      setTimeout(function() {
        self.setInputContentByDiv();
      }, 100);
    },

    /**
     * 预设问题回答
     */
    robotQs: function(e) {
      let target = e.target.nodeName;
      if (target == "A") {
        let inx = e.target.getAttribute("inx");
        let question = this.qsAllArr[inx].question;
        let answer = this.qsAllArr[inx].answer;
        let id = this.qsAllArr[inx].id;
        this.$emit("addChatMsg", {
          center: question,
          contentType: 40,
          msgType: 5,
          sender: "1",
          time: this.$ak.Utils.getNowFormatDate(),
          type: "client",
          code: id
        });
        setTimeout(() => {
          this.$emit("addChatMsg", {
            center: answer,
            contentType: 40,
            msgType: 5,
            sender: "1",
            time: this.$ak.Utils.getNowFormatDate(),
            type: "sys",
            code: id
          });
        }, 1000);
      }
    },

    /**
     * 发送消息，e.g. 文本、图片、文件
     * @param {Object} msg 消息对象
     */
    // sendMsg: function(msg) {
    //     var self = this;
    //     // 1.传递
    //     this.$emit('sendMsg', {
    //         msg: msg,
    //         successCallbcak: function() {
    //             document.getElementById('common_chat_input').focus();
    //             self.goEnd();
    //         }
    //     });
    // },

    /**
     * 传递回调
     */
    chatCallback: function(emitType, data) {
      // this.$parent.$parent.$parent.chatCallback();
      this.showTransformServer = false;
      this.$emit("chatCallback", {
        eventType: emitType,
        data: this.showTransformServer
      });
    },

    /**
     * 聊天记录滚动到底部
     */
    goEnd: function() {
      let that = this;
      this.$nextTick(() => {
        setTimeout(() => {
          if (that.$refs.common_chat_main) {
            that.$refs.common_chat_main.scrollTop = this.$refs.common_chat_main.scrollHeight;
          }
        }, 100);
      });
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
      if(this.oprRoleName=='server'){
        this.loadHistory();
      }
    });
  }
};
</script>
<style lang="less" scoped>
.common_chat-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  font-size: 12px;
  float: left;

  .common_chat-inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .commonChatFooterServer {
      // flex:5;
      height: 160px;
    }
    .common_chat-main {
      flex: 1;
      // position: relative;
      // height: calc(~'100% - 11.5rem');
      overflow-y: auto;
      overflow-x: hidden;
      // z-index: 500;
      .messHistory {
        padding: 11px 10px;
        position: absolute;
        left: 50%;
        margin-left: -57px;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 0 20px 0 rgba(52, 63, 75, 0.12),
          0 0 0 1px rgba(0, 0, 0, 0.04);
        cursor: pointer;
        color: #009de7;
        font-size: 12px;
        margin: 0;
        z-index: 500;
        .pull-left {
          margin-right: 8px;
        }
      }
      .messHistoryClient {
        left: 30%;
      }
      .niuTag {
        background: #f5edd7;
        color: #997c1f;
        line-height: 36px;
        text-align: center;
        z-index: 501;
        position: relative;
      }
      .common_chat-main-header {
        padding-top: 14px;
        text-align: center;
        .el-button {
          padding: 0px;
          font-size: 12px;
          color: #8d8d8d;
        }
      }
      .common_chat-main-content {
        margin: 36px 14px 14px;
        & > .inner {
          .item-content.file {
            background-color: #fdfdfe;
            color: #323c42;
            .file {
              display: flex;
              .el-icon-document {
                font-size: 34px;
                margin-right: 10px;
              }
              .file_content {
                display: flex;
                flex: 1;
                -ms-flex-direction: column;
                flex-direction: column;
                // min-width: 180px;

                .file_info {
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  .file_name {
                    margin-right: 6px;
                    max-width: 106px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    display: inline-block;
                    white-space: nowrap;
                  }
                  .file_size {
                    font-size: 12px;
                    color: #b8bcc4;
                    display: inline-block;
                    min-width: 38px;
                    // width: 63px;
                  }
                }
                .file_status {
                  font-size: 12px;
                  color: #b8bcc4;
                  .file_download {
                    float: right;
                    display: -ms-flexbox;
                    display: flex;
                    -ms-flex-align: center;
                    align-items: center;
                    cursor: pointer;
                    // margin-left: 10px;
                    color: #009de7;
                    // .el-icon-download{

                    // }
                    a {
                      text-decoration: none;
                    }
                  }
                }
              }
            }
          }
          padding-bottom: 20px;
          // .item{
          //     // min-height: 56px;
          // }
          .item:after {
            content: "";
            display: block;
            clear: both;
          }
          // 客户端
          .item.sender {
            clear: both;
            // overflow: hidden;
            margin-bottom: 20px;
            .info-wrapper-time {
              margin-bottom: 2px;
              font-size: 12px;
              line-height: 14px;
              color: #b2b2b2;
            }
            .info-wrapper-time.dialog {
              text-align: center !important;

              // .invite{
              //     text-align: center;
              // }
            }
            .item-content {
              float: left;
              position: relative;
              margin-right: 0;
              padding: 12px;
              color: #000;
              background-color: #fff;
              border: 1px solid #f0f0f0;
              border-radius: 3px;
              padding: 8px 12px;
              font-size: 13px;
              line-height: 20px;
              word-wrap: break-word;
              max-width: 200px;
              .arrow-bg {
                position: absolute;
                top: 13px;
                left: -7px;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-right: 7px solid #f0f0f0;
              }
              .arrow {
                position: absolute;
                top: 14px;
                left: -6px;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
                border-right: 6px solid #fff;
              }
              .text {
                line-height: 24px;
              }
            }
          }
          // 客户端
          .item.receiver {
            .info-wrapper-time {
              margin-bottom: 2px;
              font-size: 12px;
              line-height: 14px;
              color: #b2b2b2;
              width: 100%;
              text-align: right;
            }

            .item-content {
              float: right;
              width: auto;
              max-width: 200px;
              margin-left: 35px;
              position: relative;
              border-radius: 3px;
              padding: 8px 12px;
              font-size: 13px;
              line-height: 20px;
              word-wrap: break-word;
              background-color: #007aff;
              color: #fff;
              .arrow {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                font-size: 0;
                border-left: 6px solid #007aff;
                top: 14px;
                right: -6px;
                border-top: 5px solid transparent;
                border-bottom: 5px solid transparent;
              }
            }
            .item-content.img {
              background-color: #fff;
              border: 1px solid #f0f0f0;
              .imgTip {
                position: relative;
                // height: 80px;
                display: flex;
                align-items: center;
                .iconfont-main {
                  color: #c7c7c7 !important;
                  font-size: 80px !important;
                }
              }
            }
          }
          // 坐席端 坐席发送的信息
          .item.sender.oprRoleName {
            clear: both;
            overflow: hidden;
            margin-bottom: 20px;
            padding-right: 0;
            .info-wrapper-time {
              text-align: right;
            }
            .item-content {
              position: relative;
              float: right;
              background-color: #f0f1f3;
              color: #161e26;
              position: relative;
              border-radius: 3px;
              padding: 8px 12px;
              font-size: 13px;
              line-height: 22px;
              word-wrap: break-word;
              word-break: break-all;
              border: 1px dashed transparent;
              max-width: 90%;
            }
          }
          // 坐席端 坐席接受的信息
          .item.receiver.oprRoleName {
            clear: both;
            overflow: hidden;
            margin-bottom: 20px;
            .info-wrapper-time {
              text-align: left;
              line-height: 1;
              margin-bottom: 5px;
              font-size: 12px;
              color: #adb2bb;
            }
            .item-content {
              float: left;
              background-color: #e7f4ff;
              color: #161e26;
              position: relative;
              border-radius: 3px;
              padding: 8px 12px;
              font-size: 13px;
              line-height: 22px;
              word-wrap: break-word;
              word-break: break-all;
              border: 1px dashed transparent;
              margin-left: 0;
               max-width: 90%;
            }
          }
          .sys {
            color: #b0b0b0;
            font-size: 12px;
            text-align: center;
            .text-content {
              padding-top: 20px;
            }
            .myd-content {
              .desc {
                margin-top: 18px;
              }
              .text {
                color: #3e3e3e;
                margin-top: 12px;
              }
              .remark {
                margin-top: 10px;
              }
            }
          }
        }
      }
    }
    .common_chat-footer {
      position: relative;
      width: 100%;
      border-top: 1px solid #ccc;
      // margin-bottom: 4rem;
      .opr-wrapper {
        display: inline-block;
        // height: 20px;
        padding: 0 10px;
        text-align: left;
        & > .item {
          margin-right: 8px;
          float: left;
          font-weight: normal;
          text-decoration: blink;
          & > .iconfont {
            color: #969faa;
            font-size: 22px;
          }
        }
      }
      .input-wrapper {
        position: relative;
        padding: 2px 0px 0px 10px;
        height: 60px;
        .inputContent {
          width: 99%;
          padding: 2px;
          height: 100%;
          resize: none;
          overflow: auto;
          line-height: 1.5;
          outline: 0px solid transparent;
          word-break: break-all;
        }
        .shortcutPopover-wrapper {
          position: absolute;
          top: 30px;
          left: 10px;
          width: 440px;
          max-height: 80px;
          padding: 4px;
          font-size: 12px;
          overflow-y: auto;
          border: 1px solid #9b9aab;
          border-radius: 3px;
          background-color: #fff;
          cursor: pointer;
          p {
            padding: 4px;
            &.selected {
              background-color: #ded1cc;
            }
            .key {
              display: inline-block;
              width: 50px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .content {
              display: inline-block;
              width: 350px;
              margin-left: 10px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .highlight {
              color: #00a8d7;
            }
          }
        }
        .tips {
          position: absolute;
          top: 7px;
          left: 20px;
          width: auto;
          color: #8d8d8d;
        }
      }
      .send-btn {
        float: right;
        margin-right: 16px;

      }
      .offWrapperClient{
        position: absolute;
        top: 0;
        left: 0;
        // z-index: 3;
        width: 100%;
        height: 100px;
        background-color: #fff;
        text-align: center;
        line-height: 100px;
        .btn-restart-chat {
          margin: 0 5px;
          color: #6088e6;
          cursor: pointer;
        }
        .content {
          font-size: 14px;
          font-weight: 400;
        }
        .blankListFlex {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .offWrapper {
        position: absolute;
        top: 0;
        left: 0;
        // z-index: 3;
        width: 100%;
        height: 100px;
        background-color: #fff;
        text-align: center;
        line-height: 100px;

        .btn-restart-chat {
          margin: 0 5px;
          color: #6088e6;
          cursor: pointer;
        }
        .content {
          font-size: 14px;
          font-weight: 400;
        }
        .blankListFlex {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
.commonChatFooterClientBorder {
  border: 0.0625rem solid #ccc;
}
// 服务端样式
.common_chat-wrapper
  .common_chat-inner
  .common_chat-footer
  .input-wrapper.imServerClass {
  height: 80px;
  font-size: 15px;
}

// 客户端样式
.imServerAndClient {
  position: relative;
  font-size: 15px;
}
.imServerAndClient .imClientClass {
  position: absolute;
  left: 0;
  bottom: 31px;
}
// 坐席端样式
.imServerAndClient .imServer {
  padding: 10px !important;
  width: 100%;
  .quickResponse {
    float: right !important;
    color: #767d85;
    font-size: 12px;
    margin-right: 20px !important;
    display: flex;
    align-items: center;
  }
}
.imServerAndClient .imClientBtoClass {
  margin-bottom: 2.0625rem;
}
// /deep/ .my-gallery {
//     .pswp__top-bar{
//         .pswp__button{
//             display: none;
//         }
//     }
//   }

.imgView-dialog {
  background: #00000080;
  height: 100%;
  /deep/ .el-dialog__header {
    height: 24px;
	line-height: 24px;
	box-sizing: content-box;
  }
  /deep/ .el-dialog__headerbtn {
    top: 18px;
    right: 10px;
    font-size: 20px;
  }
  .el-dialog {
    max-width: 75%;
    position: relative;
    background: transparent;
    box-shadow: none;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 10px 20px !important;
      text-align: center;
      position: relative;
      height: 100%;
      .main {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .img {
          // height: 100%;
          display: block;
          max-width: 100%;
          max-height: 500px;
          transform: scale(0.5);
        }
      }
    }
  }
  .main-edit {
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-weight: 700;
      display: flex;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      margin: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.screenCapture-dialog{
  background: #00000080;
  height: 100%;
  /deep/ .el-dialog__header {
    height: 24px;
	line-height: 24px;
	box-sizing: content-box;
  }
  /deep/ .el-dialog__headerbtn {
    top: 18px;
    right: 10px;
    font-size: 20px;
  }
  .el-dialog {
    max-width: 75%;
    position: relative;
    background: transparent;
    box-shadow: none;
    .el-dialog__header {
      height: auto !important;
      line-height: 20px !important;
    }
    .el-dialog__body {
      padding: 10px 20px !important;
      text-align: center;
      position: relative;
      height: 100%;
      .main {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .img {
          // height: 100%;
          display: block;
          max-width: 100%;
          max-height: 500px;
          transform: scale(1);
        }
      }
    }
  }
  .main-edit {
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-weight: 700;
      display: flex;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      margin: 10px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.footer {
  height: 1.875rem;
  background-color: #f4f4f4;
  border-top: 1px solid #ededed;
  text-align: center;
  line-height: 1.875rem;
}
.footer span {
  text-align: center;
  line-height: 30px;
  font-size: 12px;
  color: #b7bac2;
}
.imServerAndClient .iconfont-main {
  font-size: 22px;
  color: #969faa;
}
.imServerAndClient .iconfont-main:hover {
  color: #ff0000;
}
.item .item-content img {
  max-width: 200px;
}
.content.contentDilog {
  font-size: 18px !important;
  color: #666;
}
.info-wrapper-time.dialog.inviteDiv {
  text-align: center !important;
  .inviteClientJg {
    display: inline-block;
    margin-bottom: 20px;
    .evalDataClass{
      font-size: 12px;
      margin-top: 6px;
      max-width: 100%;
      overflow: hidden;
      word-wrap: break-word;
      word-break: break-word;
    }
  }
  .evalClient1 {
    color: #00ce7d;
  }
  .evalClient2 {
    color: #ffb652;
  }
  .evalClient3 {
    color: #ff5c5e;
  }
  .inviteEval.evalDataParent{
    display: flex;
    justify-content: center;
  }
  .inviteEval {
    text-align: center;
    margin-bottom: 6px;
    .eval {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 15px;
      color: #fff;
    }
    .evalDataClass{
      font-size: 12px;
      margin-top: 6px;
      max-width: 100%;
      overflow: hidden;
      word-wrap: break-word;
      word-break: break-word;
    }
    .evalBackColor1 {
      background-color: #00ce7d;
    }
    .evalBackColor2 {
      background-color: #ffb652;
    }
    .evalBackColor3 {
      background-color: #ff5c5e;
    }
  }
}
.info-wrapper-time.dialog.changeCustomerLabel{
	.customerLabel{
		margin-top: 5px;
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
</style>

<style scoped>
.el-dialog__wrapper >>> .el-dialog__body {
  padding: 30px 20px 10px 20px;
  height: auto;
}
</style>
