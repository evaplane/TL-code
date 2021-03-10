<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-19 16:04:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-22 23:02:09
 -->
<!-- 历史 -->
<template>
  <div class="history">
    <search-history
      ref="searchHistory"
      @historyParams="historyParams"
      @setHisOptList="setHisOptList"
    ></search-history>
    <main>
      <div class="history-main">
        <div class="history-header">
          <div class="history-exp">
            <span @click="exportSession">
              <i class="iconfont-main icon-exp"></i>
              导出数据
            </span>
            <span @click="checkExportSession">
              <i class="iconfont-main icon-see"></i>
              查看历史导出任务
            </span>
          </div>
        </div>
        <div class="main" v-show="historyList.length > 0">
          <table class="table table-striped">
            <thead>
              <tr>
                <th class="th1">顾客信息</th>
                <th class="th1">顾客标签</th>
                <th class="th3">对话标签</th>
                <th class="th4">
                  对话时间
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="对话时间分别显示对话的开始、结束时间和持续时长"
                    placement="bottom"
                  >
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                  <span class>
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </span>
                </th>
                <th class="th5">
                  响应时长
                  <span class>
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </span>
                </th>
                <th class="th6">接待客服</th>
                <th class="th7">消息量</th>
                <th class="th8">对话结果</th>
                <th class="th9">来源</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in historyList" :key="index" @click="loadedHistory(item,0)">
                <td>
                  <div class="customer">
                    <div class="terminal">
                      <i
                        class="el-icon-monitor"
                        v-if="item.clientPlatform == 'Win10' || item.clientPlatform == 'Mac' "
                      ></i>
                      <i
                        class="el-icon-mobile"
                        v-else-if="item.clientPlatform == 'Ios' || item.clientPlatform == 'Android'"
                      ></i>
                      <i class="el-icon-monitor" v-else></i>
                    </div>
                    <div>
                      <div class="title">{{item.clientName}}</div>
                      <div class="provinces">{{item.clientProvince}} {{item.clientCity}}</div>
                      <div class="ip">{{item.clientIp}}</div>
                      <div></div>
                      <!-- <div class="source">
                        <div class="source-icon">
                          <div class="icon-wrap cell-start">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="chrome"
                              placement="left"
                            >
                              <i class="el-icon-setting" title="chrome"></i>
                            </el-tooltip>
                          </div>
                        </div>
                        <div class="source-icon">
                          <div class="icon-wrap cell-end">
                            <el-tooltip
                              class="item"
                              effect="dark"
                              content="windows"
                              placement="right"
                            >
                              <i class="el-icon-setting" title="windows"></i>
                            </el-tooltip>
                          </div>
                        </div>
                      </div>-->
                    </div>
                  </div>
                </td>
                <td>
                  <div class="customerTag">
                    <div
                      class="tag"
                      v-for="(item1,index1) in item.customerTagInfo"
                      :key="index1"
                      :style="{backgroundColor:item1.bgColor}"
                    >{{item1.name}}</div>
                  </div>
                </td>
                <td>
                  <div class="dialogueTag">
                    <div
                      class="tag"
                      v-for="(item1,index1) in item.tag"
                      :key="index1"
                      :style="{backgroundColor:item1.labelType}"
                    >{{item1.labelName}}</div>
                  </div>
                </td>
                <td>
                  <div class="mutil">
                    <div>
                      <el-tooltip class="item" effect="dark" content="开始时间" placement="left">
                        <i class="start-time" title="开始时间"></i>
                      </el-tooltip>
                      <span>{{item.beginDate | dataFormat('MM/dd hh:mm:ss')}}</span>
                    </div>
                    <div>
                      <el-tooltip class="item" effect="dark" content="结束时间" placement="left">
                        <i class="end-time" title="结束时间"></i>
                      </el-tooltip>
                      <span>{{item.endDate | dataFormat('MM/dd hh:mm:ss')}}</span>
                    </div>
                    <div>
                      <el-tooltip class="item" effect="dark" content="持续时长" placement="left">
                        <i class="less-then" title="持续时长"></i>
                      </el-tooltip>
                      <span>{{reversedMessage(item.beginDate,item.endDate)}}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="mutil">
                    <div>接入: {{timeStamp(item.linkTime)}}</div>
                    <div>首次: {{timeStamp(item.firstResponseTime)}}</div>
                  </div>
                </td>
                <td>
                  <div>
                    <span>{{item.seatsName || '默认'}}</span>
                  </div>
                </td>
                <td>
                  <div class="mutil">
                    <div>客服 {{item.seatNum || 0}}</div>
                    <div>顾客 {{item.clientNum || 0}}</div>
                  </div>
                </td>
                <td>
                  <div class="mutil">
                    <div>
                      <span class="none"></span>
                      {{evaluateType(item.evaluateType)}}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="title-wrap" title>
                    <i class="direct" title="其它"></i>
                    <span title>直接访问</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="main-panel" v-show="loadedHistoryMain">
          <!-- 关闭按钮 -->
          <div class="close" @click="close()">
            <i class="el-icon-close"></i>
          </div>
          <!-- 主面板 -->
          <div class="tabpage">
            <header>
              <div class="client-info">
                <div class="name">{{historyObject.clientName}}</div>
                <!-- @click="openDialog" -->
                <div class="new-tickets" @click="addTicketOrder">
                  <i class="el-icon-folder-add"></i>
                  <span>创建工单</span>
                </div>
              </div>
              <div class="visitor-info clearfix">
                <span class="span-l">
                  <!-- <i class="el-icon-s-platform"></i> -->
                  <!-- <i class="el-icon-s-platform"></i> -->
                  <span>{{historyObject.clientPlatform}}</span>
                  <span>{{historyObject.clientBrowser}}</span>
                  <span>直接访问</span>
                </span>
                <span class="span-r">
                  <i class="el-icon-monitor"></i>
                  <span>IP：{{historyObject.clientIp}}</span>
                </span>
              </div>
            </header>
            <div class="tabpage-main">
              <!-- 历史回复记录 -->
              <div class="content">
                <div class="load-more top">
                  <div
                    v-show="this.isLoadMore && (historyListInfo.total > 5)"
                    @click="loadedHistory(historyObject,1)"
                  >
                    <i class="el-icon-caret-top"></i>
                    <span>查看之前的对话</span>
                  </div>
                </div>
                <div class="select">
                  <div
                    class="timeline"
                    v-for="(item,index) in historyListInfo.historyData"
                    :key="index"
                  >
                    <!-- 客服回复 -->
                    <div class="message-info clearfix" :class="item.userType=='sys'?'sys':'client'">
                      <div
                        class="time-sender"
                        v-show="item.userType=='sys'  && (item.contentType!= 3) && item.content"
                      >
                        <span>{{item.updatedate | dataFormat('MM-dd hh:mm:ss')}}</span>
                        {{item.createuser}}
                        <span>{{item.createuser}}</span>
                      </div>
                      <div
                        class="time-sender"
                        v-show="item.userType=='client'  && (item.contentType!= 3) && item.content"
                      >
                        <span>{{item.updatedate | dataFormat('MM-dd hh:mm:ss')}}</span>
                        <span v-if="item.userType=='client'">{{item.sendName}}</span>
                        <span>{{item.createuser}}</span>
                      </div>

                      <div
                        v-if="item.contentType== 0"
                        class="message-text"
                        v-html="getqqemojiEmoji(item.content)"
                      ></div>
                      <!-- 2)图片类型 -->
                      <div v-else-if="item.contentType== 1" class="message-text img">
                        <img class="img" :src="item.content" @click="imgViewDialog_show(item)" />
                      </div>
                      <!-- 3)文件类型 -->
                      <div v-else-if="item.contentType==2" class="item-content file">
                        <div class="file">
                          <div class="el-icon-document"></div>
                          <div class="file_content">
                            <div class="file_info">
                              <span class="file_name">{{showFile(item.content,'name')}}</span>
                              <span class="file_size">{{showFile(item.content,'size')}}</span>
                            </div>
                            <div v-if="fileUpdIndexFun(index) == index" class="progressTip">
                              <el-progress :percentage="percentage" :color="customColor"></el-progress>
                            </div>
                            <div class="file_status">
                              <a
                                v-if="showDownload(item.content)"
                                :href="showFile(item.content,'url')"
                                target="_blank"
                                :download="showFile(item.content,'name')"
                                class="file_download"
                              >
                                <i class="el-icon-download"></i>下载
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 4)评价类型 -->
                      <div v-else-if="item.contentType==3" class="evaluate">
                        <div
                          class="inviteEval"
                          v-if="setEvalData(item.content,'lv') == '1' || setEvalData(item.content,'lv') == '2' || setEvalData(item.content,'lv') == '3'"
                        >
                          <span>{{item.updatedate}}</span>
                          <span>顾客评价</span>
                          <div class="inviteEval">
                            <span
                              class="eval"
                              :class="{evalBackColor1:setEvalData(item.content,'lv') == '1',evalBackColor2:setEvalData(item.content,'lv') == '2',evalBackColor3:setEvalData(item.content,'lv') == '3'}"
                            >
                              <i
                                class="iconfont-main"
                                :class="{iconHaoping:setEvalData(item.content,'lv') == '1',iconZhongping:setEvalData(item.content,'lv') == '2',iconChaping:setEvalData(item.content,'lv') == '3'}"
                              ></i>
                              <span>{{setEvalData(item.content,'lvType')}}</span>
                            </span>
                          </div>
                          <div class="inviteEval evalDataParent">
                            <div
                              class="evalDataClass"
                              :title="setEvalData(item.content,'data')"
                            >{{setEvalData(item.content,'data')}}</div>
                          </div>
                          <!-- <span></span> -->
                        </div>
                        <div v-else>
                          <span>{{item.updatedate}}</span>
                          <span>{{setEvalData(item.content,'data')}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 侧边信息 -->
          <div class="info-panel">
            <!-- :serverValues="storeServerValues" -->
            <customerLabels
              @sendMsgServer="sendMsgServer"
			  @fetchData="fetchData"
              :serverValues="serverValues"
              :userBlackList="userBlackList"
              :getTicketMes="getTicketMes"
              :dialogueLabelData="dialogueLabelData"
              :tableShowData="tableShowData"
              :operatingSystems="operatingSystems"
              :cusData="cusData"
              :storeSelectedChatEn="storeSelectedChatEn"
              :visitorInformationData="visitorInformationData"
            ></customerLabels>
          </div>
        </div>
        <div class="empty-status" v-show="historyList.length <= 0">
          <img src="https://app-qcloud.meiqia.com/images/empty-status/chat.png" />
          <div class="text">没有对话</div>
        </div>
      </div>
      <div class="history-footer" v-show="total>0">
        <pagination
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="fetchData"
          ref="historyPagination"
        />
      </div>
    </main>

    <addTicketOrder
      v-if="addTicketOrderShow"
      :ticketOrderData="ticketOrderData"
      @closeTickets="closeTickets"
    ></addTicketOrder>
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
    <!-- 导出历史会话 -->
    <el-dialog
      title="提示"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :append-to-body="true"
      :before-close="exportSessionDialogClose"
      :visible.sync="exportSessionDialog"
      width="30%"
    >
      <span>导出的数据包含访问和对话的详细信息，数据范围与当前筛选范围一致。导出的CSV格式文件，可用Excel，Numbers等软件打开进行分析。</span>
      <div class="exportCheckedClass" v-if="expIsShow">
        <el-checkbox v-model="exportChecked">包含对话内容（最多导出1000条对话）</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="expIsShow" type="primary" @click="exportSessionFun()">创建导出任务</el-button>
        <el-button type="info" @click="checkExportSession">查看历史导出任务</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchHistory from "./searchHistory";
import Pagination from "../common/Pagination/index";
import { deepClone } from "../util/util";
import customerLabel from "../imServer/customerlabel.vue";
import customerLabels from "./labels";
import addTicketOrder from "./tickets.vue";
import { getUserById } from "@/common/api";

export default {
  name: "history",
  components: {
    searchHistory,
    Pagination,
    customerLabel,
    customerLabels,
    addTicketOrder
  },
  watch: {
    storeSelectedChatEn(value) {
      if (storeSelectedChatEn) {
        this.$refs.common_chat.goEnd();
      }
    },
    storeHaveNewMsgDelegate(value) {
      this.$refs.common_chat.goEnd();
    }
  },
  computed: {
    // 计算时间差返回 秒，分，时，天
    reversedMessage() {
      return function(startTime, endTime) {
        startTime = startTime.replace(/\-/g, "/");
        endTime = endTime.replace(/\-/g, "/");
        var sTime = new Date(startTime); //开始时间
        var eTime = new Date(endTime); //结束时间
        let seconds = parseInt(
          (eTime.getTime() - sTime.getTime()) / parseInt(1000)
        );
        return this.$ak.Utils.timeStamp(seconds);
      };
    },

    // 根据时间戳返回时间
    timeStamp() {
      return function(time) {
        if (time) {
          let seconds = parseInt(parseInt(time));
          return this.$ak.Utils.timeStamp(seconds);
        } else {
          return "少于1" + "秒";
        }
      };
    },
    // 评价格式化
    evaluateType() {
      return function(type) {
        let evaluateName = "";
        switch (type) {
          case 1:
            evaluateName = "好评";
            break;
          case 2:
            evaluateName = "中评";
            break;
          case 3:
            evaluateName = "差评";
            break;
          default:
            evaluateName = "无评价";
        }
        return evaluateName;
      };
    },
    storeServerValues() {
      if (this.$store.imServerStore.getters.serverValues == null) {
        return {};
      } else {
        return this.$store.imServerStore.getters.serverValues;
      }
    },
    storeUserRoles() {
      return this.$store.imServerStore.state.userInfo.roles[0];
    },
    // serverValues(){
    //   if(serverValues == null){
    //     return {}
    //   }
    // },
    storeSelectedChatEn() {
      // if (this.$store.imServerStore.getters.selectedChatEn == null) {
      return {};
      // } else {
      //   return this.$store.imServerStore.getters.selectedChatEn;
      // }
    },
    storeHaveNewMsgDelegate() {
      return this.$store.imServerStore.getters.haveNewMsgDelegate;
    },
    storeServerChatEn() {
      return this.$store.imServerStore.getters.serverChatEn;
    }
  },
  data() {
    return {
      expIsShow: true, //是否已导出完成
      exportSessionDialog: false, // 导出弹框
      exportChecked: false, //是否包含对话内容
      dialogueLabelData: [], //当前对话标签数据
      dialogueLabel: null,
      tableShowData: [], //当前顾客标签数据
      operatingSystems: "win",
      cusData: [], //对话标签数据
      visitorInformationData: {}, //访客数据
      addTicketOrderShow: false, //创建工单
      ticketOrderData: null, //创建工单需要的数据
      serverValues: {},

      isShowDialog: false, //添加工单的模态框
      loadedHistoryMain: false, //对话层
      isLoadMore: true, //显示加载更多
      getTicketMes: { id: -1, title: "" }, //最新工单信息
      userBlackList: "", //访客黑名单信息
      item: {},

      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      paramsData: {}, //查询条件
      // 历史对象
      historyInfo: {
        beginDate: null, //对话开始时间
        endDate: null, //对话结束时间
        clientBrowser: "", //访客浏览器
        clientName: "", //访客名称
        clientId: "", //访客ID
        clientIp: "", //访客IP
        clientNum: "", //访客发送消息数
        clientPlatform: "", //访客系统
        customerLabelIds: [], //顾客标签
        dialogueLabelIds: [], //对话标签
        dialogueTime: "", //对话时长
        evaluateType: "", //评价类型
        seatNum: 0, //对话坐席发送消息数
        seatsIds: [], //坐席ID
        trackId: "", //对话ID
        roleId: ""
      },

      // immessage/page

      historyList: [], //历史数据集合
      hisOptList: [], //历史-处理人集合
      historyObject: {}, //单个历史对象
      historyListInfo: {
        historyData: [], //对话集合
        total: 0, //总页数
        pages: 0, //一共多少页
        size: 5, //每页条数
        current: 1 //当前页
      },

      // 对话标签
      dialogueLabelList: [],
      // 顾客标签
      customerLabelList: [],
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
      imgViewDialogVisible: false, // 图片查看dialog的显示
      imgViewDialog_imgSrc: "", // 图片查看dialog的图片地址
      deg: 0,
      degStart: 0
    };
  },
  created() {
    let seatsId = JSON.parse(sessionStorage.getItem("userInfo")).user_id;
    this.getLabele();
    // this.getUserByIdHis(seatsId);
    this.fetchData();
  },
  methods: {
    setEvalData(data, modl) {
      let evalData = "";
      if (data != "" && data != undefined) {
        if (modl == "lv") {
          evalData = JSON.parse(data).lv;
        } else if (modl == "data") {
          evalData = JSON.parse(data).center;
        } else {
          evalData =
            JSON.parse(data).lv == 1
              ? "好评"
              : JSON.parse(data).lv == 2
              ? "中评"
              : "差评";
        }
      }
      return evalData;
    },
    /**
     * 显示导出历史会话
     */
    exportSession() {
      if (this.historyList.length == 0) {
        this.$message1({
          type: "error",
          message: "无导出数据,请重新筛选条件"
        });
        return;
      }
      this.exportSessionDialog = true;
    },
    /**
     * 导出历史会话
     */
    exportSessionFun() {
      this.getParams();
      let newDowParms = {
        beginDate: this.paramsData.beginDate, //开始时间
        endDate: this.paramsData.endDate, // 结束时间
        clientName:
          this.paramsData.clientName == undefined
            ? ""
            : this.paramsData.clientName, // 访客名称
        evaluateType:
          this.paramsData.evaluateType == undefined
            ? ""
            : this.paramsData.evaluateType, //评价类型
        isQueryConversationContent: this.exportChecked ? 0 : 1, // 是否包含对话内容
        // seatsGroupId: this.paramsData.seatsGroupId, //坐席组ID
        seatsIds: this.paramsData.seatsIds, //坐席ID
        customerLabelIds: this.paramsData.customerLabelIds, //坐席ID
        dialogueLabelIds: this.paramsData.dialogueLabelIds //坐席ID
      };
      this.$axios
        .post(this.$httpServer.conversationExport, newDowParms)
        .then(res => {
          if (res && res.data.code == "0") {
            this.$message1({
              message: "创建导出历史会话记录成功",
              type: "success"
            });
          }
        });
      this.expIsShow = false;
    },
    /**
     * 查看历史会话
     */
    checkExportSession() {
      this.$router.push({ path: "/history/exportTasList" });
    },
    /**
     * 关闭导出列表
     */
    exportSessionDialogClose() {
      this.exportSessionDialog = false;
      setTimeout(() => {
        this.expIsShow = true;
      }, 500);
    },
    //   正方向
    rotate() {
      this.degStart = this.deg;
      this.deg += 90;
      if (this.deg == 90 || this.deg == 270) {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientWidth + "px";
      } else {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientHeight + "px";
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
      this.degStart = this.deg;
      this.deg -= 90;
      if (this.deg == -90 || this.deg == -270) {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientWidth + "px";
      } else {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientHeight + "px";
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
    closeTickets(value) {
      this.addTicketOrderShow = value;
      this.loadingVisitorInformation();
    },
    /**
     * 会话创建工单
     */
    addTicketOrder() {
      let that = this;
      this.ticketOrderData = {
        trackId: this.storeSelectedChatEn.trackid,
        visitId: this.storeSelectedChatEn.sender
      };
      this.addTicketOrderShow = !this.addTicketOrderShow;
    },
    /**
     * 获取最新工单
     */
    getVisitorLatestTicket() {
      let that = this;
      let searData = JSON.parse(sessionStorage.getItem("userInfo"));
      that.$axios
        .get(
          that.$httpServer.getVisitorLatestTicket +
            "?ownerId=" +
            searData.user_id +
            "&visitId=" +
            that.storeSelectedChatEn.sender
        )
        .then(res => {
          if (res.data.data != null) {
            that.getTicketMes = res.data.data;
          } else {
            that.getTicketMes = { id: -1, title: "" };
          }
        });
    },
    /**
     * 加载访客信息
     */
    loadingVisitorInformation() {
      let that = this;
      this.$axios
        .get(
          this.$httpServer.getImClientInfo +
            "?clientId=" +
            this.storeSelectedChatEn.sender
        )
        .then(res => {
          let newData = res.data.data;
          this.checkUserBlackList(); //判断是否已加入黑名单
          // newData[dialogueTag] = that.dialogueLabelData;
		  // 强转换数据类型
          for (let i in newData) {
            //转换 顾客标签数据
            if (i == "customerTag") {

              that.zhDialogueLabel(newData[i]);
            }
            newData[i] =
              typeof newData[i] == "number"
                ? newData[i].toString()
                : newData[i];
          }
          //转换 对话标签数据dialogue
          newData["dialogueTag"] = that.dialogueLabel;
          that.zhDialogueTag(newData["dialogueTag"], 0);
          this.visitorInformationData = newData;
        });
    },
    sendMsgServer: function(rs) {
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
        alert("WebSocket 连接没有建立成功！");
      }
      // 2.添加到消息集合李
      // that.addChatMsg(rs, function() {
      //     that.goEnd();
      // });
    },
    /**
     * 转换对话标签
     */
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
        that.$axios.get(that.$httpServer.getLabele).then(res => {
          that.tableShowData = [];
          res.data.data.map((v, i) => {
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
        });
      } else {
        that.tableShowData = [];
        data = "";
      }
    },
    /**
     * 转换对话标签
     */
    zhDialogueTag(data, type) {
      // 如果是1 重新加载一次
      if (type == 1) {
        this.fetchData();
      }
      this.dialogueLabel = data;
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
        this.$axios.get(this.$httpServer.getTab).then(res => {
          that.dialogueLabelData = [];
          res.data.data.map((v, i) => {
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
        });
      } else {
        that.dialogueLabelData = [];
        data = "";
      }
    },
    /**
     * 校验是否已加入黑名单
     */
    checkUserBlackList() {
      let that = this;
      // let checkClientip = that.storeSelectedChatEn.clientip;
      let params = {
        ipAddress: this.storeSelectedChatEn.clientip,
        visitorId: this.storeSelectedChatEn.sender
      };
      that.$axios.post(that.$httpServer.checkBlackList, params).then(res => {
        that.userBlackList = res.data.data == null;
      });
    },
    // 加载更多
    loadedHistory(item, type) {
      // console.log(item);
      this.item = item;
      // 查看历史详情
      if (type == 0) {
        this.historyListInfo.historyData = [];
        this.historyListInfo.current = 1;
        this.isLoadMore = true;
        this.storeSelectedChatEn.clientip = item.clientIp;
        this.storeSelectedChatEn.sender = item.clientId;
        this.serverValues = {
          trackid: item.trackId,
          seatsId: item.seatsId
        };
        this.dialogueLabel = item.dialogueTag;
      } else {
        // 加载更多
        this.historyListInfo.current += 1;
        if (this.historyListInfo.current == this.historyListInfo.pages) {
          this.isLoadMore = false;
        }
        if (this.historyListInfo.current > this.historyListInfo.pages) {
          this.$message1({
            type: "error",
            message: "没有更多了！"
          });
          return false;
        }
      }
      this.loadedHistoryMain = true;
      let trackId = item.trackId;
      let obj = {
        trackId: item.trackId,
        size: this.historyListInfo.size,
        current: this.historyListInfo.current
      };
      this.$axios
        .get(
          this.$httpServer.loadedHistory + "?" + this.$ak.Utils.serialize(obj)
        )
        .then(res => {
          if (res && res.data.code == "0") {
            let that = this;
            that.historyListInfo.current;
            that.historyListInfo.total = res.data.data.total;
            that.historyListInfo.pages = res.data.data.pages;
            that.historyListInfo.current;
            let data = deepClone(res.data.data.records);
            let user_id = JSON.parse(sessionStorage.getItem("userInfo"))
              .user_id;
            data.sort(function(a, b) {
              return Date.parse(b.createdate) - Date.parse(a.createdate);
            });
            data.forEach((e, i) => {
              e.sendUser == item.clientId
                ? (e.userType = "sys")
                : (e.userType = "client");
              that.historyListInfo.historyData.unshift(e);
            });
          }
        });
      this.historyObject = deepClone(item);
      this.loadingVisitorInformation();
      this.getVisitorLatestTicket();
    },
    openDialog() {
      this.isShowDialog = !this.isShowDialog;
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
      this.saveAs(null, params.name);
    },
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement("a");
        var body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
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
    // 是否显示下载进度条
    fileUpdIndexFun(index) {
      if (this.$store.imServerStore.state.fileUpdIndex > 0) {
        return this.$store.imServerStore.state.fileUpdIndex;
      } else {
        this.percentage = 0;
        return -1;
      }
    },
    // 转换为QQ表情
    getqqemojiEmoji(value) {
      if (value == undefined) {
        return;
      }
      var self = this;
      return value.replace(/\[(.+?)\]/g, function(item, value) {
        return self.$ak.Utils.getImgByFaceName(value);
      });
    },
    close() {
      this.loadedHistoryMain = false;
    },
    // 获取历史数据
    historyParams(params) {
      this.listQuery.page = 1;
      this.loadedHistoryMain = false;
      this.historyInfo = params;
      this.fetchData();
    },
    /**
     * 获取客服帐号信息
     */
    getUserByIdHis(id) {
      let that = this;
      getUserById(id).then(res => {
        if (res.data.data) {
          let data = res.data.data;
          delete data.password;
          // // 把角色id取出来
          // return data.role = data.roleList[0].roleId;
          that.historyInfo.deptId = data.deptId;
          that.historyInfo.roleId = data.roleList[0].roleId;
          that.fetchData();
          // data.roleName = data.roleList[0].roleName;
        } else {
          that.historyInfo.roleId = 0;
          that.historyInfo.seatsGroupId = id; //组ID
          that.fetchData();
        }
      });
    },
    /**
     * 处理人集合
     */
    setHisOptList(data) {
      this.hisOptList = data;
    },
    getParams() {
      let that = this;
      let params = {
        size: this.listQuery.limit,
        current: this.listQuery.page
	  };
	  let flag = this.$store.imServerStore.state.userInfo.roles[0] === 1;  // true为管理员
	  if(!flag){
		  params.seatsGroupId = this.$store.imServerStore.state.userInfo.deptId
	  }
      params.seatsIds = this.historyInfo.seatsIds;
      params.customerLabelIds = this.historyInfo.customerLabelIds;
      params.dialogueLabelIds = this.historyInfo.dialogueLabelIds;

      if (this.historyInfo.clientName) {
        params.clientName = this.historyInfo.clientName;
      }
      if (this.historyInfo.evaluateType != "") {
        params.evaluateType = this.historyInfo.evaluateType;
      }
      // 如果不选默认传一个月之前的开始时间
      // if (this.historyInfo.beginDate) {
      //   params.beginDate = this.historyInfo.beginDate;
      // } else {
      //   params.beginDate = this.$ak.Utils.getNowFormatDateYMD(
      //     this.$ak.Utils.getCurrentMonthNum()
      //   );
      // }
      // console.log(this.historyInfo.begin)
      // console.log(this.historyInfo.end)
      if (this.historyInfo.end) {
        params.endDate = this.historyInfo.endDate;
      }
      if (this.historyInfo.begin) {
        params.beginDate = this.historyInfo.beginDate;
      }
      if (
        this.historyInfo.begin == undefined &&
        this.historyInfo.end == undefined
      ) {
        params.beginDate = this.$ak.Utils.getNowFormatDateYMD(
          this.$ak.Utils.getCurrentMonthNum()
        );
        this.historyInfo.endDate
          ? (params.endDate = this.historyInfo.endDate)
          : (params.endDate = this.$ak.Utils.getNowFormatDate());
      }
      this.paramsData = params;
      // 如果不选默认传当前结束时间
    },
    // 对话历史集合列表
    fetchData() {
      this.getParams();
      // if(this.historyInfo.seatsGroupId == null || this.historyInfo.seatsId == null){

      // }
      // console.log(this.historyInfo)
      // if(this.historyInfo.seatsGroupId){
      //   params.seatsGroupId = this.historyInfo.seatsGroupId
      // }
      // if(this.historyInfo.seatsId){
      //   params.seatsId = this.historyInfo.seatsId
      // }

      // 根据id去判断是什么角色

      // console.log(this.historyInfo.roleId);
      // console.log(this.historyInfo.seatsId)
      // 管理员

      this.$axios
        .get(
          this.$httpServer.getDialogueHistoryInfo +
            "?" +
            this.$ak.Utils.serialize(this.paramsData)
        )
        .then(res => {
          if (res && res.data.code == "0") {
            this.isHistoryEmpty = false;
            this.total = res.data.data.total;
            this.historyList = res.data.data.records;
            for (const key in this.historyList) {
			  this.historyList[key].customerTagInfo = JSON.parse(this.historyList[key].customerTagInfo);
              if (this.historyList[key].dialogueTag) {
                this.historyList[key].dialogueTagArr = this.historyList[
                  key
                ].dialogueTag.split(",");
                this.historyList[key].tag = this.getTabReturnName(
                  this.historyList[key].dialogueTagArr
                );
              }
            }
          }
        });
    },
    // 查询所有对话标签
    getLabele() {
      this.$axios.get(this.$httpServer.getTab).then(res => {
        if (res && res.data.code == "0") {
          this.dialogueLabelList = res.data.data;
        }
      });
    },
    // 根据对话标签的数组返回标签的名称
    getTabReturnName(arr) {
      let data = deepClone(this.dialogueLabelList);
      let TabAar = [];
      data.forEach(item => {
        arr.forEach(item2 => {
          if (item.id == item2) {
            let obj = {};
            obj.labelName = item.labelName;
            obj.labelType = this.colorLable[item.dialogueLabelType];
            TabAar.push(obj);
          }
        });
      });
      return TabAar;
    },
    // 查询所有顾客标签
    getCustomerLabele() {
      this.$axios.get(this.$httpServer.getLabele).then(res => {
        if (res && res.data.code == "0") {
          this.customerLabelList = res.data.data;
        }
      });
    },
    // 根据顾客标签的数组返回标签的名称
    getCustomerTabReturnName(arr) {
      let data = deepClone(this.customerLabelList);
      let TabAar = [];
      data.forEach(item => {
        arr.forEach(item2 => {
          if (item.id == item2) {
            let obj = {};
            obj.labelName = item.labelName;
            obj.labelType = this.colorLable[item.labelStype];
            TabAar.push(obj);
          }
        });
      });
      return TabAar;
    },
    /**
     * 图片查看dialog_显示
     */
    imgViewDialog_show: function(item) {
      this.imgViewDialogVisible = true;
      this.deg = 0;
      this.degStart = 0;
      this.imgViewDialog_imgSrc = item.content;
      this.$nextTick(function() {
        this.$refs.elDialogMain.style.height =
          this.$refs.elDialogImg.clientHeight + "px";
      });
    },
    /**
     * 图片查看dialog_显示
     */
    imgViewDialog_close: function() {
      this.imgViewDialogVisible = false;
      var self = this;
      setTimeout(function() {
        self.imgViewDialog_imgSrc = "";
      }, 100);
    }
  },
  mounted() {
    this.getLabele();
    this.getCustomerLabele();
    this.getVisitorLatestTicket();
    if (this.storeSelectedChatEn == {} || this.storeSelectedChatEn == null) {
      this.loadingVisitorInformation(); //加载访客信息
    }
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
@import "../../common/css/base.less";
@import "../../common/css/qqemoji.less";
.history {
  width: calc(100% - 70px);
  height: 100%;
  margin-left: 70px;
  background-color: #fbfbfc;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  main {
    // flex: 1;
    // display: flex;
    // flex-direction: column;
    // border-left: 1px #ededed solid;
    box-sizing: border-box;
    // // width: 1530px;
    // width: 100%;
    // height: 100%;
    // display: flex;
    // flex: 1 1 0%;

    border-left: 1px #ededed solid;
    display: flex;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 390px;
    height: 100%;
    z-index: 990;
    background-color: #fff;
    .history-main {
      height: 100%;
      height: calc(100% - 50px);
	  overflow-y: auto;
      flex: 1;
      .history-header {
        height: 40px;
        border-bottom: 1px solid #ededed;
        text-align: right;
        line-height: 40px;
        font-size: 15px;
        color: #009de7;
        .history-exp {
          padding-right: 10px;
          span {
            padding: 0 6px;
          }
        }
        .history-exp span:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .main {
        // width: 1530px;
        // width: 100%;
        height: calc(100% - 40px);
        overflow: scroll;
        .table {
          flex: 1;
          height: 100%;
          // width: 100%;
          overflow: auto;
          display: block;
          thead {
            display: table-header-group;
            vertical-align: middle;
            border-color: inherit;
            tr {
              background-color: #fff;
              border-bottom: 1px solid rgba(0, 0, 0, 0.07);
              height: 36px;
              // display: flex;
              th {
                // flex: 1;
                min-width: 140px;
                border-bottom: none;
                color: #767d85;
                font-size: 12px;
                height: 36px;
                line-height: 36px;
                padding: 0 18px;
                text-align: left;
                &.th1 {
                  // min-width: 257px;
                  // width: 10px;
                  padding-left: 30px;
                }
                &.th4 {
                  min-width: 158px;
                  max-width: 158px;
                  // width: 10px;
                  i {
                    font-size: 15px;
                    margin-left: 6px;
                    line-height: 36px;
                  }
                }
                &.th5 {
                  // min-width: 121px;
                  // width: 10px;
                  i {
                    font-size: 15px;
                    margin-left: 6px;
                    line-height: 36px;
                  }
                }
                &.th10 {
                  // min-width: 115px;
                  // width: 10px;
                  i {
                    font-size: 15px;
                    margin-left: 6px;
                    line-height: 36px;
                  }
                }
              }
            }
          }
          tbody {
            tr {
              cursor: pointer;
              &:nth-child(odd) {
                background-color: #ffffff;
              }
              &:nth-child(even) {
                background-color: #fbfbfc;
              }
              &:hover {
                background-color: #efefef;
              }
              td {
                &:nth-child(1) {
                  width: 300px;
                  max-width: 300px;
                  .customer {
                    display: flex;
                    flex-direction: row;
                    .terminal {
                      width: 30px;
                      min-width: 30px;
                      max-width: 30px;
                      height: 30px;
                      background-color: #4ca0ff;
                      margin: 17px 20px 0 0;
                      border-radius: 50%;
                      position: relative;
                      i {
                        width: 30px;
                        height: 30px;
                        min-width: 30px;
                        max-width: 30px;
                        font-size: 20px;
                        color: #fff;
                        position: absolute;
                        display: inline-block;
                        margin-top: 5px;
                        margin-left: 5px;
                      }
                    }
                    .title {
                      min-width: 165px;
                      max-width: 165px;
                      margin-bottom: 10px;
                      font-size: 13px;
                      color: rgb(52, 63, 75);
                      height: 18px;
                      line-height: 18px;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    }
                    .ip {
                      margin-bottom: 10px;
                      font-size: 12px;
                      color: rgb(118, 125, 133);
                      height: 17px;
                      line-height: 17px;
                    }
                    .provinces {
                      margin-bottom: 10px;
                      font-size: 12px;
                      color: rgb(118, 125, 133);
                      height: 17px;
                      line-height: 17px;
                    }
                    .source {
                      display: flex;
                      flex-direction: row;
                      height: 22px;
                      line-height: 22px;
                      .source-icon {
                        i {
                          width: 18px;
                          height: 18px;
                          font-size: 18px;
                        }
                        &:last-child {
                          margin-left: 10px;
                        }
                      }
                    }
                  }
                }
                &:nth-child(2) {
                  .customerTag {
                    width: 200px;
                    white-space: normal;
                    .tag {
                      max-width: 120px;
                      position: relative;
                      display: inline-block;
                      padding: 4px 7px;
                      margin-right: 5px;
                      margin-bottom: 5px;
                      line-height: 1;
                      font-size: 12px;
                      color: #fff;
                      text-align: left;
                      white-space: nowrap;
                      border-radius: 3px;
                      cursor: pointer;
                      text-overflow: ellipsis;
                      word-break: keep-all;
                      overflow: hidden;
                    }
                  }
                }
                &:nth-child(3) {
                  .dialogueTag {
                    width: 200px;
                    white-space: normal;
                    .tag {
                      max-width: 120px;
                      position: relative;
                      display: inline-block;
                      padding: 4px 7px;
                      margin-right: 5px;
                      margin-bottom: 5px;
                      line-height: 1;
                      font-size: 12px;
                      color: #fff;
                      text-align: left;
                      white-space: nowrap;
                      border-radius: 3px;
                      cursor: pointer;
                      text-overflow: ellipsis;
                      word-break: keep-all;
                      overflow: hidden;
                    }
                  }
                }
                &:nth-child(4) {
                  .mutil {
                    i {
                      font-size: 12px;
                      width: 12px;
                      height: 12px;
                      display: inline-block;
                      background-size: 12px;
                      background-repeat: no-repeat;
                      vertical-align: middle;
                      margin-right: 5px;
                      &.start-time {
                        background-image: url("../../../static/icon/startTime.png");
                      }
                      &.end-time {
                        background-image: url("../../../static/icon/endTime.png");
                      }
                      &.less-then {
                        background-image: url("../../../static/icon/timeLength.png");
                      }
                    }
                    span {
                      height: 14px;
                      line-height: 14px;
                      vertical-align: middle;
                    }
                  }
                }
                &:nth-child(6) {
                  > div {
                    img {
                      vertical-align: middle;
                      width: 24px;
                      border-radius: 50%;
                    }
                    span {
                      margin-left: 12px;
                      color: rgb(52, 63, 75);
                    }
                  }
                }
                &:nth-child(8) {
                  .none {
                    vertical-align: -3px;
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    margin-right: 10px;
                  }
                }
                &:nth-child(9) {
                  .title-wrap {
                    i {
                      width: 12px;
                      height: 12px;
                      display: inline-block;
                      background-size: 12px;
                      background-repeat: no-repeat;
                      vertical-align: middle;
                      margin-right: 2px;
                      &.direct {
                        background-image: url("../../../static/icon/connection.png");
                      }
                    }
                    span {
                      vertical-align: middle;
                    }
                  }
                }
                color: #343f4b;
                font-size: 12px;
                padding: 18px 20px;
                min-height: 100px;
                vertical-align: top;
                width: 200px;
                max-width: 400px;
                // overflow: hidden;
                .mutil {
                  > div {
                    height: 14px;
                    line-height: 14px;
                    margin-bottom: 10px;
                  }
                }
              }
            }
          }
        }
      }
      .main-panel {
        display: flex;
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 500px;
        height: 100%;
        z-index: 990;
        background-color: #fff;
        box-shadow: -10px 0 60px 0 rgba(52, 63, 75, 0.1),
          -5px 0 20px 0 rgba(52, 63, 75, 0.1), -1px 0 0 0 rgba(0, 0, 0, 0.04);
        .close {
          cursor: pointer;
          position: absolute;
          left: -40px;
          top: 10px;
          width: 40px;
          height: 40px;
          background-color: #fff;
          padding: 10px 13px;
          box-shadow: -2px 6px 12px 0 rgba(52, 63, 75, 0.16),
            -2px 3px 4px 0 rgba(52, 63, 75, 0.08),
            0 0 0 1px rgba(52, 63, 75, 0.04),
            inset 1px 0 0 0 rgba(89, 105, 120, 0.02),
            inset 2px 0 0 0 rgba(89, 105, 120, 0.01),
            inset 4px 0 0 0 rgba(89, 105, 120, 0.01),
            inset 6px 0 0 0 rgba(89, 105, 120, 0.01),
            inset 8px 0 0 0 rgba(89, 105, 120, 0.01),
            inset 10px 0 0 0 rgba(89, 105, 120, 0.01),
            inset 0 1px 0 0 hsla(0, 0%, 100%, 0.6),
            inset 0 -1px 0 0 hsla(0, 0%, 100%, 0.6),
            inset 1px 0 0 0 rgba(0, 0, 0, 0.04);
          i {
            color: #969faa;
            width: 14px;
            height: 14px;
            font-size: 14px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            &:hover {
              opacity: 0.7;
            }
          }
        }
        .tabpage {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
          height: 100%;
          background-color: #fff;
          box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.06);
          min-width: 500px;
          header {
            .client-info {
              position: relative;
              height: 50px;
              padding: 15px 20px;
              box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.02),
                0 1px 0 0 rgba(0, 0, 0, 0.07);
              .name {
                position: absolute;
                top: 15px;
                left: 20px;
                bottom: 13px;
                right: 440px;
                font-size: 15px;
                color: #161e26;
                line-height: 20px;
              }
              .new-tickets {
                position: relative;
                cursor: pointer;
                color: #009de7;
                height: 23px;
                line-height: 23px;
                display: -ms-flexbox;
                display: flex;
                float: right;
                i {
                  font-size: 20px;
                  margin-right: 8px;
                  vertical-align: text-bottom;
                }
                span {
                  font-size: 14px;
                  vertical-align: middle;
                }
              }
            }
            .visitor-info {
              width: 100%;
              z-index: 5;
              position: relative;
              height: 36px;
              padding: 9px 20px;
              box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.02),
                0 1px 0 0 rgba(0, 0, 0, 0.07);
              .span-l {
                display: inline-block;
                position: absolute;
                left: 20px;
                right: 150px;
                top: 9px;
                bottom: 9px;
                height: 18px;
                line-height: 18px;
              }
              .span-r {
                color: #969faa;
                height: 18px;
                line-height: 18px;
                float: right;
              }
              .span-l,
              .span-r {
                i {
                  vertical-align: middle;
                }
                span {
                  display: inline-block;
                  color: #767d85;
                  font-size: 12px;
                  vertical-align: middle;
                  height: 18px;
                  line-height: 18px;
                }
              }
            }
          }
          .tabpage-main {
            flex: 1;
            position: relative;
            .content {
              position: absolute;
              top: 0px;
              bottom: 0;
              left: 0;
              right: 0;
              display: flex;
              overflow-x: hidden;
              overflow-y: auto;
              flex-direction: column;
              .load-more {
                width: 100%;
                height: 36px;
                position: relative;
                > div {
                  padding: 11px 10px;
                  position: absolute;
                  left: 50%;
                  margin-left: -57px;
                  height: 36px;
                  border-radius: 4px;
                  background-color: #fff;
                  box-shadow: 0 0 20px 0 rgba(52, 63, 75, 0.12),
                    0 0 0 1px rgba(0, 0, 0, 0.04);
                  cursor: pointer;
                  i {
                    width: 14px;
                    height: 14px;
                    display: inline-block;
                    margin-right: 8px;
                    color: #009de7;
                  }
                  span {
                    color: #009de7;
                    font-size: 12px;
                    margin: 0;
                  }
                }
              }
              .select {
                flex: 1;
                padding: 36px 20px;
                .timeline {
                  // text-align: center;
                  color: #babcbb;
                  margin: 15px 0;
                  .event-item {
                    text-align: center;
                    color: #babcbb;
                    margin: 15px 0;
                    section {
                      font-size: 12px;
                      position: relative;
                      > div {
                        max-width: 67%;
                        overflow: hidden;
                        display: inline-block;
                        padding: 2px 8px;
                        color: #969faa;
                        border-radius: 10px;
                        background-color: #f2f3f5;
                        span {
                          margin-right: 10px;
                        }
                      }
                    }
                  }
                  // 坐席
                  .agent-message {
                    height: 100%;
                    padding-left: 80px;
                    width: 100%;
                    margin-bottom: 15px;
                    text-align: right;
                    .time-sender {
                      text-align: right;
                      line-height: 1;
                      margin-bottom: 5px;
                      font-size: 12px;
                      color: #adb2bb;
                      .span {
                        padding-right: 5px;
                        margin-right: 5px;
                      }
                    }
                    .message {
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
                    }
                    .message {
                      background-color: #f0f1f3;
                    }
                  }
                  // 客服
                  .message-info {
                    &.sys,
                    &.client {
                      .time-sender {
                        line-height: 1;
                        margin-bottom: 5px;
                        font-size: 12px;
                        color: #adb2bb;
                      }
                      .message-text {
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
                      }
                      .inviteEval.evalDataParent {
                        display: flex;
                        justify-content: center;
                        .evalDataClass {
                          font-size: 14px;
                          margin-top: 6px;
                          max-width: 200px;
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        }
                      }
                      .evaluate {
                        text-align: center;
                        line-height: 1;
                        margin-bottom: 5px;
                        font-size: 12px;
                        color: #adb2bb;
                        .inviteEval {
                          text-align: center;
                          margin-top: 6px;
                          .eval {
                            span {
                              margin: 0;
                              padding: 0;
                              border-radius: 15px;
                              color: #fff;
                              display: inline-block;
                            }
                          }
                          .iconfont-main {
                            font-size: 14px !important;
                            color: #fff !important;
                          }
                          .iconHaoping {
                            span {
                              background-color: #00ce7d;
                            }
                          }
                          .iconZhongping {
                            span {
                              background-color: #ffb652;
                            }
                          }
                          .iconChaping {
                            span {
                              background-color: #ff5c5e;
                            }
                          }
                        }
                      }
                      .item-content.file {
                        background-color: #e7f4ff;
                        padding: 8px 12px;
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
                            flex-direction: column;
                            min-width: 180px;
                            .file_info {
                              display: flex;
                              .file_name {
                                margin-right: 6px;
                                max-width: 154px;
                                text-overflow: ellipsis;
                                overflow: hidden;
                                display: inline-block;
                                white-space: nowrap;
                              }
                              .file_size {
                                font-size: 12px;
                                color: #b8bcc4;
                                display: inline-block;
                                width: 63px;
                              }
                            }
                            .file_status {
                              font-size: 12px;
                              color: #b8bcc4;
                              margin-top: 10px;
                              .file_download {
                                float: right;
                                display: flex;
                                -ms-flex-align: center;
                                align-items: center;
                                cursor: pointer;
                                margin-left: 10px;
                                color: #009de7;
                                a {
                                  text-decoration: none;
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    &.sys {
                      .time-sender {
                        text-align: left;
                      }
                      .message-text {
                        float: left;
                        background-color: #f0f1f3;
                        img {
                          max-width: 300px;
                          display: block;
                          max-height: 300px;
                        }
                      }
                      .item-content.file {
                        float: left;
                        background-color: #f0f1f3;
                      }
                    }
                    &.client {
                      .time-sender {
                        text-align: right;
                      }
                      .message-text {
                        float: right;
                        background-color: #e7f4ff;
                        img {
                          max-width: 300px;
                          display: block;
                          max-height: 300px;
                        }
                      }
                      .item-content.file {
                        float: right;
                        background-color: #e7f4ff;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        .info-panel {
          position: relative;
          width: 270px;
          height: 100%;
          padding: 0 15px;
          overflow-x: hidden;
          overflow-y: auto;
          .imCustomerlabel {
            padding: 0;
          }
        }
      }
      .empty-status {
        text-align: center;
        padding-top: 60px;
        img {
          width: 80px;
        }
        .text {
          font-size: 12px;
          color: #989ea6;
        }
      }
    }
    .history-footer {
      // height: 50px;
      // width: 100%;
      // display: flex;
      position: fixed;
      // top: 0;
      bottom: 0;
      right: 0;
      left: 390px;
      // height: 100%;
      // z-index: 990;、
      border-left: 1px solid #ededed;
      border-top: 1px solid #ededed;
      background-color: #fff;
      background: #ccc;
      /deep/ .el-input__inner {
        border: none;
      }
    }
  }
}
.imgView-dialog {
  background: #00000080;
  height: 100%;
  /deep/ .el-dialog__header {
    height: 10px;
    line-height: 10px;
  }
  /deep/ .el-dialog__headerbtn {
    top: 10px;
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
</style>
<style scoped>
.el-dialog__wrapper >>> .el-dialog__body {
  padding: 30px 20px 10px 20px;
  height: auto;
}
/* 历史记录导出样式 */
.exportCheckedClass {
  padding: 10px 0;
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
</style>
