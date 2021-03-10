<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-23 17:39:42
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-24 17:20:31
 -->
<!-- 聊天记录 -->
<template>
  <div class="im_chat">
    <!-- 头部 -->
    <div class="imChat-wrapper" :class="{'imChat-wrapperClass':isShowQuickResponse}">
      <header v-if="storeSelectedChatEn.userId == ''" class="imChat-header">
        <div >
          <span  class="name" :class="{activTypeClass:activTypeClass==1}">客户资料</span>
        </div>
      </header>
      <!-- 第三方已登录 -->
      <div class="content-title" v-else>
        <span v-if="myTabIsShow" class="tabLeft" @click="tabLeft">&lt;</span>
          <div class="tabContainer" ref="tabContainer">
            <div class="over">
              <div class="myTab" :style="{width:fastReplyGroupConfigsWidth+'px',left:myTabLeft+'px'}">
                <span class="myTabname"
                v-for="(item,index) in fastReplyGroupConfigs"
                :key="index"
                @click="displaylAbelContent(item.id)"
                :title="item.tabName"
                :class="{activTypeClass:charActivTypeClass==item.id}">{{item.tabName}}</span>
              </div>
            </div>
          </div>
          <span v-if="myTabIsShow" class="tabRigth" @click="tabRigth">&gt;</span>
      </div>
      <!-- 没有用户ID的数据 -->
      <div v-if="storeSelectedChatEn.userId == ''" class="headerLable" >
        <customerDetails   :visitorInformationData="visitorInformationData"  ></customerDetails>
      </div>
      <div v-else class="headerTable">
        <switchingLabelData :isShowQuickResponse="isShowQuickResponse" :charCols.sync="charCols" :charTableData.sync="charTableData"></switchingLabelData>
      </div>
      <div class="headerAddress">
        <span>{{storeSelectedChatEn.state == "on"?'在线':'离线'}} {{storeSelectedChatEn.clientplatform}}&nbsp;{{storeSelectedChatEn.clientbrowser}}直接访问</span>
        <span>
          <i class="el-icon-monitor"></i>
          IP：{{storeSelectedChatEn.clientip}}
        </span>
      </div>
      <main class="imChat-main" :class="{imChatMainUser:storeSelectedChatEn.userId != ''}">
        <!-- 聊天框区域 -->
        <commonChat
          ref="common_chat"
          :initialConnect="false"
          :imgLoadingShow="imgLoadingShow"
          :evaluateDialogShow="true"
          :initialNewsWhere="true"
          :showCustomerService="showCustomerService"
          :clientValue="{}"
          :isImServer="isImServer"
          :serverValues="storeServerValues"
          :chatInfoEn="storeSelectedChatEn"
          :oprRoleName="'server'"
          @sendMsgServer="sendMsgServer"
          @showQuickResponseFun="showQuickResponseFun"
          @setInputContent="setInputContent"
        ></commonChat>
      </main>
    </div>
    <!-- 快捷回复 -->
    <quickResponse
      v-if="isShowQuickResponse"
      @showQuickResponseFun="showQuickResponseFun"
      @sendMsgServer="sendMsgServer"
    ></quickResponse>
    <!-- 右侧区域样式 -->
    <div class="headLableFunction">
      <div class="imChat-header-menu">
        <span @click="addTicketOrder">
          <i class="iconfont-main icon-creatingOrder"></i> 创建工单
        </span>
        <span @click="getOnlineSeatsList">
          <transfer :seatTableData="seatTableData" :visitorInformationData="visitorInformationData"></transfer>
        </span>
        <span @click="dialogVisibleClose">
          <i class="iconfont-main icon-noNeedealWith"></i>结束
        </span>
      </div>
      <!-- 顾客标签 -->
      <customerLabel
        ref="customer_label"
        @sendMsgServer="sendMsgServer"
        :serverValues="storeServerValues"
        :userBlackList="userBlackList"
        :getTicketMes="getTicketMes"
        :dialogueLabelData="dialogueLabelData"
        :tableShowData="tableShowData"
        :operatingSystems="operatingSystems"
        :cusData="cusData"
        :storeSelectedChatEn="storeSelectedChatEn"
        :visitorInformationData="visitorInformationData"
      ></customerLabel>
    </div>
    <!-- <div class="headLableFunction">
            <span class="imChat-header-menu">
                <span @click="addTicketOrder"><i class="iconfont-main icon-creatingOrder"></i> 创建工单</span>
                <span @click="getOnlineSeatsList"><transfer :seatTableData="seatTableData"></transfer></span>
                <span @click="dialogVisible = true"><i class="iconfont-main icon-noNeedealWith"></i>结束</span>
            </span>
    </div>-->


    <el-dialog title="提示" :modal-append-to-body="false" :visible.sync="dialogVisible" width="20%">
      <span>确定关闭当前会话？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="endSession">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 创建工单 -->
    <addTicketOrder
      v-if="addTicketOrderShow"
      :ticketOrderData="ticketOrderData"
      @closeTickets="closeTickets"
    ></addTicketOrder>
  </div>
</template>

<script scoped>
import commonChat from "@/components/common/common_chat.vue";
import customerLabel from "./customerlabel.vue";
import transfer from "./alert/transfer.vue";
import quickResponse from "./quickResponse.vue";
import customerDetails from "./customerDetails.vue";
import addTicketOrder from "./alert/addTicketOrder.vue";
import switchingLabelData from "./switchingLabelData.vue";
export default {
  name: "imServer",
  components: {
    commonChat: commonChat,
    customerLabel: customerLabel,
    transfer: transfer,
    quickResponse: quickResponse,
    customerDetails: customerDetails,
    addTicketOrder: addTicketOrder,
    switchingLabelData:switchingLabelData
  },
  props: {},
  data() {
    return {
      showCustomerService: false,
      isImServer: true,
      operatingSystems: "win",
      dialogVisible: false, //是否结束当前对话
      imgLoadingShow: -1,
      visitorInformationData: {}, //访客数据
      searchCustomer: "", //客服搜索
      cusData: [], //对话标签数据
      seatTableData: [], //所有坐席数据
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
      dialogueLabelData: [], //当前对话标签数据
      tableShowData: [], //当前顾客标签数据
      tableDataAll: [], //所有顾客标签数据
      dialogLabelAll: [], //所有对话标签数据
      addTicketOrderShow: false, //创建工单
      ticketOrderData: null, //创建工单需要的数据
      isShowQuickResponse: false, //是否显示快捷回复
      getTicketMes: { title: "", id: -1 }, //最新工单信息
      userBlackList: true, //访客黑名单信息
      keydown: "", // 按键
      serverKeyDown: false, //是否开启按键监听
      activTypeClass: 1, //
      charActivTypeClass: 1, //接入聊天样式
      fastReplyGroupConfigs:[], // 页签
      fastReplyGroupConfigsWidth:0, //页签宽度
      myTabIsShow:false, // 是否显示页签
      myTabLeft:26, //默认向右偏移
      charCols:[], // header
      charTableData:[], //body
    };
  },
  props:{

  },
  computed: {
    storeServerValues() {
      return this.$store.imServerStore.getters.serverValues;
    },
    storeSelectedChatEn() {
      return this.$store.imServerStore.getters.selectedChatEn;
    },
    storeHaveNewMsgDelegate() {
      return this.$store.imServerStore.getters.haveNewMsgDelegate;
    },
    storeServerChatEn() {
      return this.$store.imServerStore.getters.serverChatEn;
    },
    storeServerSocket() {
      return this.$store.imServerStore.state.serverSocket;
    }
  },
  created() {
    let arr = [];
    let that = this;
    document.onkeydown = function(e) {
      if (window.location.href.indexOf("imServer") > -1) {
        that.keydown = "";
        if (arr.length > 0) {
          // a-z按键长按去重
          if (arr.indexOf(e.key.toLowerCase()) >= 0) {
            return;
          }
        }
        arr.push(e.key.toLowerCase());
        that.keydown = arr.join("+");
        // 输入框未激活
        if (that.serverKeyDown) {
          switch (that.keydown) {
            case "r":
              //激活输入框
              that.$nextTick(function() {
                e.returnValue = false;
                that.$ak.Utils.positioningCursor("common_chat_input");
              });
              break;
            case "shift+r":
              //激活输入框，并选择【内部消息】模式
              break;
            case "t" || "alt+t":
              //给当前顾客添加标签
              that.$nextTick(function() {
                that.$refs.customer_label.visibleLabel = true;
                that.$refs.customer_label.addLable();
              });
              break;
            case "n":
              //给当前顾客添加备注
              that.$nextTick(function() {
                e.returnValue = false;
                that.$refs.customer_label.$refs.customerRemark.$refs.innerHtml.focus();
              });
              break;
            case "f2":
              //结束当前对话
              that.dialogVisible = true;
              break;
          }
        } else {
          switch (that.keydown) {
            case "enter":
              //发送消息
              that.$nextTick(function() {
                that.$refs.common_chat.sendText();
                e.returnValue = false;
              });
              break;
            case "control+enter":
              //发送消息
              that.$nextTick(function() {
                that.$refs.common_chat.sendText();
                e.returnValue = false;
              });
              break;
            case "f1":
              //退出输入模式
              e.returnValue = false;
              document.querySelector("#common_chat_input").blur();
              // that.$nextTick(function() {
              //     that.$refs.common_chat.input_blur();
              // });
              break;
            case "shift+enter":
            case "enter+shift":
              e.returnValue = false;
              //文字换行
              let myBrowser = that.$ak.Utils.myBrowser();
              let myDom = "";
              if (myBrowser == "IE" || myBrowser == "Edge") {
                myDom = document.createElement("div");
                myDom.innerText = "\n";
              } else if (myBrowser == "Firefox") {
                myDom = document.createElement("br");
              } else {
                myDom = document.createElement("div");
                myDom.innerText = "\n";
              }
              that.$nextTick(function() {
                document.getElementById("common_chat_input").appendChild(myDom);
                //设置输入焦点
                var o = document.getElementById("common_chat_input").lastChild;
                var textbox = document.getElementById("common_chat_input");
                var sel = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents(textbox);
                range.collapse(false);
                range.setEndAfter(o); //
                range.setStartAfter(o); //
                sel.removeAllRanges();
                sel.addRange(range);
              });
              break;
          }
        }
        this.keydown = "";
      }
    };

    document.onkeyup = function(e) {
      if (e && window.location.href.indexOf("imServer") > -1) {
        arr.splice(arr.indexOf(e.key.toLowerCase()), 1);
        this.keydown = arr.join("+");
        arr = [];
      }
    };
  },
  watch: {
    storeSelectedChatEn(value) {
      this.$refs.common_chat.goEnd();
    },
    storeHaveNewMsgDelegate(value) {
      this.$refs.common_chat.goEnd();
    },
    isShowQuickResponse:function(v, oldV){
      if(this.storeSelectedChatEn.userId != ''){
        let tabContainerWidth = document.getElementsByClassName('tabContainer')[0].scrollWidth; //原始宽度
        // 120 每个页签宽度,；200 快捷回复宽度
        if(v){
          // 实际宽度 - 页签宽度 > 0
          this.myTabIsShow = !(tabContainerWidth-(this.fastReplyGroupConfigs.length*120+200)> 0);
        }else{
          // 实际宽度 - 页签宽度 > 0
          this.myTabIsShow = !(tabContainerWidth-(this.fastReplyGroupConfigs.length*120-200)> 0);
          // 如果原始宽度 > 每个页签之和额宽度
          if(tabContainerWidth > this.fastReplyGroupConfigs.length*120 - 200){
            this.myTabLeft = 0
          }
        }

      }

    },
  },
  methods: {
    closeTickets(value) {
      this.addTicketOrderShow = value;
    },
    dialogVisibleClose() {
      this.dialogVisible = true;
    },
    tabLeft(){
      // 当页签left 为正数时，是第一个页签
      if(this.myTabLeft < 0){
        this.myTabLeft+=120;
      }
    },
    tabRigth(){
      let visualWidth = this.$refs.tabContainer.offsetWidth; // 可视宽度
      // 120 每个页签宽度; 20 多余宽度

      if(visualWidth +Math.abs(this.myTabLeft) < this.fastReplyGroupConfigsWidth-20){
        this.myTabLeft-=120;
      }

    },
    /**
     * 接入聊天链接-获取已配置页签
     */
    getCustomerTabLists() {
      let that = this;
      if(!that.$refs.tabContainer){
        return;
      }
      this.$axios.get(this.$httpServer.getCustomerTab).then(res => {
        if(res.data.data){
            that.fastReplyGroupConfigs = res.data.data;
            let visualWidth = this.$refs.tabContainer.offsetWidth; // 可视宽度
            if(res.data.data.length*120 - visualWidth > 0){
              that.myTabIsShow = true;
              that.myTabLeft = 26;
            }else{
              that.myTabIsShow = false;
              that.myTabLeft = 0; // 默认
            }
            that.fastReplyGroupConfigsWidth = res.data.data.length*120+20;
            if( res.data.data.length >0 ){
              that.charActivTypeClass = res.data.data[0].id; //默认选中第一个
              that.displaylAbelContent(res.data.data[0].id.toString(),that.storeSelectedChatEn.userId);
            }
        }else{
            that.fastReplyGroupConfigs = [];
        }
      })
    },
    /**
     * 接入聊天链接-展示标签内容
     */
    displaylAbelContent(charTabId,charUserId){
      let that = this;
      // if(charTabId == that.charActivTypeClass){
      //   return
      // }
      that.charActivTypeClass = charTabId
      let opt = {
          seatsGroupId: this.$store.imServerStore.state.userInfo.deptId, //组ID
          tabId: charTabId, //标签ID
          userId: charUserId?charUserId:this.storeSelectedChatEn.userId, //用户ID
      }
      that.$axios.post(that.$httpServer.getTabContents,opt).then((res)=>{
        if(res){
          let resData = res.data.data;
          that.charCols = []; // header
          that.charTableData = []; //body
          let newCols = [];
          let newTableData = [];
          if(res.data.code == 0){

            resData.map((v,i)=>{
            if(i < 3){
              let newOpt = {};
              v.map((m,n)=>{
                // 取第一条数据做header
                if(i == 0){
                  newCols.push({
                    prop:m.tabKey,
                    label:m.tabName
                  })
                }
                let newKey = m.tabKey;
                newOpt[newKey] = m.value;
              })
              newTableData.push(newOpt)
              }
          })
          that.charCols = newCols;
          that.charTableData = newTableData;
          }

        }

      })
    },
    /**
     * 获取所有在线坐席
     */
    getOnlineSeatsList() {
      let that = this;
      let sessData = JSON.parse(sessionStorage.getItem("userInfo"));
      that.$axios
        .get(
          that.$httpServer.getOnlineSeatsListByGroupId +
            "?seatsGroupId=" +
            sessData.dept_id
        )
        .then(res => {
          that.seatTableData = [];
          res.data.data.map((v, i) => {
            if (sessData.user_id != v.seatsId) {
              let data = {
                id: v.id,
                name: v.seatsName,
                seatsId: v.seatsId
              };
              that.seatTableData.push(data);
            }
          });
        });
    },
    /**
     * 会话创建工单
     */
    addTicketOrder() {
      this.ticketOrderData = {
        trackId: this.storeSelectedChatEn.trackid,
        visitId: this.storeSelectedChatEn.sender
      };
      this.addTicketOrderShow = !this.addTicketOrderShow;
    },
    /**
     * 校验是否已加入黑名单
     */
    checkUserBlackList(send) {
      let that = this;
      let checkClientip = that.storeSelectedChatEn.clientip;
      let visitId = send?send:that.storeSelectedChatEn.sender;
      that.$axios
        .post(that.$httpServer.checkBlackList, {
          visitorId: visitId,
          ipAddress: checkClientip
        })
        .then(res => {
          that.userBlackList = res.data.data == null;
          let contentTypeValue = that.userBlackList ? 20 : -20;
          that.dialogVisible = false;
          that.$store.imServerStore.dispatch("addChatMsg", {
            clientChatId: that.storeServerValues.seatsId,
            msg: {
              type: "sys",
              contentType: contentTypeValue,
              time: this.$ak.Utils.getNowFormatDate(),
              center: ""
            }
          });
        });
    },
    /**
     * 获取最新工单
     */
    getVisitorLatestTicket(send) {
      let that = this;
      let searData = JSON.parse(sessionStorage.getItem("userInfo"));
      let visitId = send?send:that.storeSelectedChatEn.sender;
      that.$axios
        .get(
          that.$httpServer.getVisitorLatestTicket +
            "?ownerId=" +
            searData.user_id +
            "&visitId=" +
            visitId
        )
        .then(res => {
          if (res.data.data == null) {
            that.getTicketMes = {
              title: "",
              id: -1
            };
          } else {
            that.getTicketMes = res.data.data;
          }
        });
    },
    /**
     * 是否显示快捷回复
     */
    showQuickResponseFun() {
      this.isShowQuickResponse = !this.isShowQuickResponse;
    },
    getAllLables() {
      this.$axios
        .all([this.getDialogLables(), this.getTableDataAll()])
        .then(([res, result]) => {
          this.dialogLabelAll = res.data.data ? res.data.data : [];
          this.tableDataAll = result.data.data ? result.data.data : [];
          this.loadingVisitorInformation(); //加载访客信息
        });
    },
    /**
     * 所有对话标签
     */
    getDialogLables() {
      return this.$axios.get(this.$httpServer.getTab);
    },
    /**
     * 所有顾客标签
     */
    getTableDataAll() {
      return this.$axios.get(this.$httpServer.getLabele);
    },
    /**
     * 转换顾客标签
     */
    zhDialogueLabel(data) {
      // dialogueLabelData
      let that = this;
      let newStr = "";
      let newArr = [];
      if (data != "" && data != null) {
        if (data.indexOf(",") == -1) {
          newStr = [data];
        } else {
          newStr = data.split(",");
        }
        let arr = [];

        that.tableShowData = [];
        that.tableDataAll.map((v, i) => {
          arr.push(v.id.toString());
          for (let j in newStr) {
            if (v.id == newStr[j]) {
              let newData = {
                id: v.id,
                name: v.labelName,
                bgColor: that.colorLable[parseInt(v.labelStype)],
                bgColorIndex: parseInt(v.labelStype)
              };
              that.tableShowData.push(newData);
            }
          }
        });

        newStr.map((v, i) => {
          if (arr.indexOf(v) > -1) {
            newArr.push(v);
          }
        });

        data = newArr.toString();
      } else {
        that.tableShowData = [];
        data = "";
      }

      return data;
    },
    /**
     * 转换对话标签
     */
    zhDialogueTag(data, type) {
      console.log(5)
      // 如果是1 重新加载一次
      let that = this;
      let newStr = "";
      let newArr = [];
      if (data != "" && data != null) {
        if (data.indexOf(",") == -1) {
          newStr = [data];
        } else {
          newStr = data.split(",");
        }
        let arr = [];
        that.dialogueLabelData = [];
        this.dialogLabelAll.map((v, i) => {
          arr.push(v.id.toString());
          for (let j in newStr) {
            if (v.id == newStr[j]) {
              let newData = {
                id: v.id,
                lable: v.labelName,
                color: that.colorLable[parseInt(v.dialogueLabelType)],
                colorIndex: parseInt(v.dialogueLabelType),
                parentId: v.parentId
              };
              that.dialogueLabelData.push(newData);
            }
          }
        });

        newStr.map((v, i) => {
          if (arr.indexOf(v) > -1) {
            newArr.push(v);
          }
        });

        data = newArr.toString();
      } else {
        that.dialogueLabelData = [];
        data = "";
      }

      console.log(6)
      return data;
    },
    /**
     * 加载访客信息
     */
    loadingVisitorInformation(send) {
      send = send ? send : this.storeSelectedChatEn.sender;
      let that = this;
      this.$axios
        .get(this.$httpServer.getImClientInfo + "?clientId=" + send)
        .then(res => {
          console.log(3)
          let newData = res.data.data;
          // 强转换数据类型
          for (let i in newData) {
            //转换 对话标签数据？不回选
            // if (i == "dialogueTag") {
            //   newData[i] = that.zhDialogueTag(newData[i]);
            // }
            //转换 顾客标签数据
            if (i == "customerTag") {
              newData[i] = that.zhDialogueLabel(newData[i]);
            }
            newData[i] =
              typeof newData[i] == "number"
                ? newData[i].toString()
                : newData[i];
          }
          let data =
            that.$store.imServerStore.getters.selectedChatEn.dialogueTag;
          let newDialogueTag = that.zhDialogueTag(data);
          newData.dialogueTag = newDialogueTag;
          that.visitorInformationData = newData;
          console.log(4)
        });
    },
    /**
     * 排队变更状态
     */
    queueChatEnlistFun(send) {
        let that = this;
        that.$axios
            .get(
                that.$httpServer.lineUpTurnDialogue +
                    "?clientId=" +
                    send +
                    "&seatsId=" +
                    JSON.parse(sessionStorage.getItem("userInfo"))
                        .user_id
            )
            .then(res => {
                
            });
    },
    /**
     * 结束当前会话
     */
    endSession() {
      let that = this;
      let sendID = that.$store.imServerStore.state.selectedChatEn.sender; //访客ID
      let trackid = that.$store.imServerStore.state.selectedChatEn.trackid; //会话ID
      let sessionValue = that.$store.imServerStore.state.currentChatEnlist; //当前会话数据
      that.$axios
        .get(that.$httpServer.seatsCloseDialogue + "?clientId=" + sendID+"&trackId="+trackid)
        .then(res => {
           let changeStatus = false;
          sessionValue.map((v, i) => {
            if (v.sender == sendID) {
              sessionValue.splice(i, 1);
              that.$store.imServerStore.state.selectedChatEn = null; //当前打开的窗口数据置为空
            }
            
          });
          sessionValue.map((v, i) => {
            // 结束会话 排队变更状态
            if(v.contentType == 8 && !changeStatus){
              that.queueChatEnlistFun(v.sender)
              v.contentType =3;
              changeStatus = true;
            }
          });
          that.dialogVisible = false;
        });
    },
    /**
     * 转接对话
     */
    transfer() {},
    setInputContent(data){
      this.storeSelectedChatEn.inputContent = data;
    },
    /**
     * 发送消息
     * @param {Object} rs 回调对象
     */
    sendMsgServer: function(rs) {
        console.log(rs);
      let that = this;
      if (!window.WebSocket) {
        return;
      }
      if (
        that.$store.imServerStore.state.serverSocket.readyState ==
        WebSocket.OPEN
      ) {
        var message = new proto.Model();
        var content = new proto.MessageBody();
        message.setMsgtype(4);
        message.setRole(2);
        message.setCmd(5);
        message.setGroupid(
          JSON.parse(sessionStorage.getItem("userInfo")).dept_id.toString()
        ); // 坐席组ID
        message.setToken(sessionStorage.getItem("token")); // 登录回传
        message.setSender(sessionStorage.getItem("userId")); //坐席ID
        message.setReceiver(that.storeServerValues.seatsId); // 接受人
        content.setContent(rs.center);
        content.setType(rs.contentType); // 0：文字 1：图片 2文件
        message.setContent(content.serializeBinary());
        message.setTrackid(that.storeServerValues.trackid); // 会话ID
        message.setType(1); //聊天类型,1单聊 ，2群聊
        that.$store.imServerStore.state.serverSocket.binaryType = "arraybuffer";
        that.$store.imServerStore.state.serverSocket.send(
          message.serializeBinary()
        );
        // 2.附加到此chat对象的msg集合里
        that.$store.imServerStore.dispatch("addChatMsg", {
          clientChatId: that.storeServerValues.seatsId,
          msg: rs,
          successCallback: function() {
            rs.successCallbcak && rs.successCallbcak();
          }
        });
      } else {
        alert("聊天服务连接失败！");
      }
      // 2.添加到消息集合李
      // that.addChatMsg(rs, function() {
      //     that.goEnd();
      // });
    },
    addChatMsg: function(msg, successCallback) {
      // 1.设定默认值
      this.$data.chatInfoEn.chatState = "agent"; // 客户端数据显示
      msg.time = msg.time == "" ? this.$ak.Utils.getNowFormatDate() : msg.time;
      var msgList = this.$data.chatInfoEn.msgList
        ? this.$data.chatInfoEn.msgList
        : [];
      // 2)插入消息
      msgList.push(msg);
      // 3.设置chat对象相关属性
      this.$data.chatInfoEn.msgList = msgList;
      console.log(this.$data.chatInfoEn);
      // 4.回调
    },
    goEnd: function() {
      this.$refs.common_chat.goEnd();
    },

    /**
     * 获取chat的访问时间
     * @param {Date} accessTime 问时间
     */
    getAccessTimeStr: function(accessTime) {
      return this.$ak.Utils.getDateTimeStr(accessTime, "Y-m-d H:i:s");
    }
  },
  mounted() {
    this.checkUserBlackList(); //判断是否已加入黑名单
    this.getAllLables();
    // this.loadingVisitorInformation(); //加载访客信息
    this.getVisitorLatestTicket(); //加载最新工单
    this.getCustomerTabLists();
    // this.zhDialogueTag();
  }
};
</script>
<style lang="less" >
.im_chat {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.imChat-wrapper {
  height: 100%;
  // width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: start;
  // width: calc(~"100% - 270px");
  // float: left;
  border-right: 1px solid #e6e6e6;
  flex: 1;
  // 标签页
  .content-title{
    display: flex;
    flex-direction: row;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.02), 0 1px 0 0 rgba(0, 0, 0, 0.07);
    height: 41px;
    .tabLeft,.tabRigth{
      color: #000000;
      line-height: 41px;
      z-index: 1000;
      padding: 0 7px;
      background-color: #f2f3f5;
      cursor: pointer;
    }
    .tabContainer{
      width: 100%;
      .over{
        border: none;
        .myTab{
          border: none;
          position: absolute;
          left: 26px;
          margin: 0;
          .myTabname{
            display: inline-block;
            text-align: center;
            line-height: 41px;
            color: #666;
            min-width: 120px;
            max-width: 120px;
            cursor: pointer;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .activTypeClass {
      background-color: #f2f3f5;
      font-size: 17px;
    }
  .imChat-header {
    height: 41px;
    font-size: 15px;
    color: #161e26;
    border-bottom: 1px solid #e6e6e6;


    .name {
      display: inline-block;
      line-height: 40px;
      min-width: 60px;
      text-align: center;
      padding: 0 16px;
      cursor: pointer;
    }

    > span {
      margin-right: 20px;
    }
    .on-line {
      color: #70ed3a;
    }
    .off-line {
      color: #bbbbbb;
    }
  }
  .imChat-main {
    // flex: 1;
    height: calc(~"100% - 140px");
  }
  .imChatMainUser{
    height: calc(~"100% - 240px");
  }
  .headerLable {
    width: 100%;
    color: #767d85;
    font-size: 12px;
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.02), 0 1px 0 0 rgba(0, 0, 0, 0.07);
  }
  .headerTable{
    color: #767d85;
    font-size: 12px;
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.02), 0 1px 0 0 rgba(0, 0, 0, 0.07);
    padding: 10px 10px;
  }
  .headerAddress {
    height: 36px;
    line-height: 36px;
    color: #767d85;
    font-size: 12px;
    box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.02), 0 1px 0 0 rgba(0, 0, 0, 0.07);
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      padding: 0 10px;
      display: flex;
      align-items: center;
    }
    .el-icon-monitor {
      font-size: 18px;
      margin-right: 8px;
      vertical-align: middle;
      color: #009de7;
    }
  }
}
.imChat-wrapper.imChat-wrapperClass {
  width: calc(~"100% - 470px") !important;
}
.headLableFunction {
  width: 269px;
  // float: right;
  height: 100%;
}
.headLableFunction .imChat-header-menu {
  color: #009de7;
  cursor: pointer;
  width: 100%;
  height: 41px;
  border-bottom: 1px solid #e6e6e6;
  line-height: 40px;
  padding-left: 15px;
  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    margin-right: 10px;
  }
  .iconfont-main {
    font-size: 18px;
    font-weight: 600;
    margin-right: 6px;
  }
}



</style>
