<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-07-17 16:08:09
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-24 15:57:26
 -->
<template>
  <div class="imCustomerlabel">
    <el-row class="title">
      <el-col class="title-left" :span="6">对话标签</el-col>
      <el-col class="title-right" :span="17">
        <div class="pull-rigth">
          <el-popover
            placement="bottom"
            width="400"
            v-model="visible"
            tab-position="right"
            trigger="click"
          >
            <div>
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="一级标签" name="first" disabled>
                  <span v-if="cusData.length > 0">
                    <div v-for="(v,index) in cusData" :key="index">
                      <div>
                        <div
                          :title="v.lable"
                          class="tag-item"
                          :style="{backgroundColor: v.color}"
                          @click="choseLab(v.id,v,'2')"
                        >{{v.lable}}</div>
                      </div>
                    </div>
                  </span>
                  <span v-else class="agentCenter">暂无可用标签</span>
                </el-tab-pane>
                <el-tab-pane label="二级标签" name="second" disabled>
                  <div v-for="(v,index) in cusData" :key="index">
                    <div>
                      <div
                        :title="v.lable"
                        class="tag-item"
                        :style="{backgroundColor: v.color}"
                        @click="choseLab(v.id,v,'3')"
                      >{{v.lable}}</div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="三级标签" name="third" disabled>
                  <div v-for="(v,index) in cusData" :key="index">
                    <div>
                      <div
                        :title="v.lable"
                        class="tag-item"
                        :style="{backgroundColor: v.color} "
                        @click="choseLab(v.id,v,'4')"
                      >{{v.lable}}</div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>

            <span slot="reference" @click="addSublabe()">添加</span>
            <!-- <el-button slot="reference">添加</el-button> -->
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-row class="tab childMinHe">
      <el-col :span="18">
        <div v-if="dialogueLabelData.length > 0">
          <span v-for="(v,index) in dialogueLabelData" :key="index">
            <div :title="v.lable" class="tag-tag" :style="{backgroundColor: v.color} ">
              <span class="tag-del" @click="delConversationsTab('dialogueTag',v.id)">删除</span>
              <span class="tag-tag-lable">{{v.lable}}</span>
            </div>
          </span>
        </div>
        <div v-else>暂无标签</div>
      </el-col>
    </el-row>
    <el-row class="title">
      <el-col class="title-left" :span="18">来源信息</el-col>
    </el-row>
    <el-row class="child childMinHe">
      <el-col
        class="title-left"
        :span="10"
      >{{visitorInformationData.clientPlatform == null || visitorInformationData.clientPlatform == ''?'暂无来源信息':visitorInformationData.clientPlatform}}</el-col>
      <!-- <el-col class="title-right" :span="17">{{operatingSystems}}</el-col> -->
    </el-row>
    <el-row class="title">
      <el-col class="title-left" :span="6">顾客标签</el-col>
      <el-col class="title-right" :span="17">
        <div>
          <el-popover
            v-model="visibleLabel"
            style="margin-top:200px;"
            placement="bottom-end"
            trigger="click"
            width="160"
          >
            <div class="agent-single-selector-shadowPanel">
              <span v-if="tableData.length > 0">
                <div
                  v-for="(v,index) in tableData"
                  :key="index"
                  :style="{'pointerEvents':(isDisabled == v.id ? 'none' : 'auto')}"
                >
                  <div>
                    <div
                      :title="v.name"
                      class="tag-item"
                      :style="{backgroundColor: v.bgColor}"
                      @click="selectingCustomerLabels(v.id,v,index)"
                    >{{v.name}}</div>
                  </div>
                </div>
              </span>
              <span v-else class="agentCenter">暂无可用标签</span>
            </div>
            <span slot="reference" @click="addLable()">添加</span>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-row class="tab childMinHe">
      <el-col :span="24">
        <div v-if="tableShowData.length > 0">
          <span v-for="(v,index) in tableShowData" :key="index">
            <div
              :title="v.name"
              class="tag-tag"
              :style="{backgroundColor: v.bgColor} "
              @click="choseCustomer(v.id,v)"
            >
              <span class="tag-del" @click="delLab('customerTag',v.id)">删除</span>
              <span class="tag-tag-lable">{{v.name}}</span>
            </div>
          </span>
        </div>
        <div v-else>暂无标签</div>
      </el-col>
    </el-row>
    <el-row class="title">
      <el-col class="title-left" :span="18">最新工单</el-col>
    </el-row>
    <el-row class="tab childMinHe">
      <el-col :span="18">
        <span v-if="getTicketMes.title != ''">
          <span
            class="info-panel-ticket-desp"
            @click="openTickect(getTicketMes)"
          >{{getTicketMes.title}}</span>
        </span>
        <span v-else>暂无工单</span>
      </el-col>
    </el-row>
    <el-row class="tab">
      <el-col :span="18">{{storeSelectedChatEn.trackid}}</el-col>
    </el-row>
    <el-row class="title childMinHe">
      <el-col class="title-left" :span="8">
        <span class="currOptClass" @click="dialogVisible = true">{{!userBlackList?'加入':'移出'}}黑名单</span>
      </el-col>
      <el-col class="title-right" :span="16">
        <router-link to="/config/blacklist">
          <span class="info-panel-ticket-desp currOptClass">管理</span>
        </router-link>
      </el-col>
    </el-row>
    <el-dialog title="提示" :modal-append-to-body="false" :visible.sync="dialogVisible" width="20%">
      <span>确认{{!userBlackList?'加入':'移出'}}黑名单</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addBackList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import editDiv from "./innerHtml";
export default {
  props: {
    operatingSystems: {
      required: true,
      type: String,
      default: ""
    },
    // 所有对话标签
    // cusData:{
    //   required: true,
    //   type: Array,
    //   default: ()=>{
    //     return [];
    //   }
    // },
    storeSelectedChatEn: {
      required: true,
      type: Object,
      default: {}
    },
    visitorInformationData: {
      required: true,
      type: Object,
      default: []
    },
    dialogueLabelData: {
      required: true,
      type: Array,
      default: []
    },
    tableShowData: {
      required: true,
      type: Array,
      default: () => {
        return [];
      }
    },
    // 工单
    getTicketMes: {
      required: true,
      type: Object,
      default: {
        id: -1,
        tilte: ""
      }
    },
    // 黑名单
    userBlackList: {
      required: true,
      type: Boolean,
      default: false
    },
    // 座席端 选择聊天对象的数据
    serverValues: {
      required: true,
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    editDiv
  },
  watch: {
    addChatMsg: (v, o) => {
      console.log(v);
      console.log(o);
    }
  },
  data() {
    return {
      dialogVisible: false, //是否添加黑名单
      dialogueLabelAllData: [], //所有标签数据
      sumDataNum: [], // 标签等级个数
      visible: false, //是否显示顾客标签
      visibleLabel: false, //是否显示对话标签
      cusData: [], //所有对话标签
      tableData: [], //所有顾客标签
      // tableShowData:[], //添加的顾客标签数据
      // dialogueLabelData:[], //对话标签数据
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
      activeName: "first", //默认展示
      socket: null,
      isDisabled: -1 //当前选择的顾客标签ID
    };
  },
  mounted() {
    this.getLabele();
  },
  methods: {
    openTickect(openTickect) {
      console.log(openTickect);
      this.$router.push({
        path: `/tickets/0`,
        query: { ticketsId: openTickect.id, status: openTickect.status }
      });
    },
    /**
     * 删除标签
     */
    delCus(k, id) {
      let that = this;
      let newStr = this.visitorInformationData[k].split(",");
      newStr.map((v, i) => {
        if (v == id) {
          newStr.splice(i, 1);
        }
      });
      /**
       * 转字符串
       */
      let str = "";
      newStr.map((v, i) => {
        if (i == newStr.length - 1) {
          str += v;
        } else {
          str += v + ",";
        }
      });
      this.visitorInformationData[k] = str;
      let arr = JSON.parse(this.visitorInformationData["customerTagInfo"]);
      arr.map((m, i) => {
        if (m.id == id) {
          arr.splice(i, 1);
        }
      });
      this.visitorInformationData["customerTagInfo"] = JSON.stringify(arr);
      this.$axios
        .post(
          this.$httpServer.saveOrUpdateClientInfo,
          this.visitorInformationData
        )
        .then(res => {
          //  that.$emit("loadingVisitorInformation",'')
          this.$parent.loadingVisitorInformation(); //加载访客数据
          this.$message1({
            message: "修改成功",
            type: "success"
          });
          if (k == "customerTag") {
            let newObj = {};
            that.tableShowData.map(obj => {
              if (obj.id == id) {
                newObj = obj;
              }
			});
			newObj.center = "删除标签";
			let rs = {
				type: "sys",
				contentType: 50, // 50.删除顾客标签
				time: this.$ak.Utils.getNowFormatDate(),
				center: JSON.stringify(newObj)
			}
            let sender = that.storeSelectedChatEn.sender;
            that.$store.imServerStore.state.currentChatEnlist.map(v => {
              if (v.sender == sender) {
                v.customerTagInfo.map((k, i) => {
                  if (k.id == newObj.id) {
                    v.customerTagInfo.splice(i, 1);
                  }
                });
              }
			});
			that.$store.imServerStore.dispatch("addChatMsg", {
              clientChatId: sender,
              msg: rs,
            });
          }
        });
    },
    /**
     * 新增标签次数
     */
    submitAddNum(v, id) {
      let urlNum = "";
      let opt = {};
      // 顾客标签
      if (v == "customerTag") {
        urlNum = this.$httpServer.updateLabelNum;
        opt = {
          labelUseCount: 1,
          id: id
        };
      } else {
        urlNum = this.$httpServer.updateDialogNum;
        opt = {
          dialogueLabelUserCount: 1,
          id: id
        };
      }
      this.$axios.post(urlNum, opt).then(res => {});
    },
    /**
     * 更新对话标签
     */
    addSaveDialogueTag(k, obj) {
      let that = this;
      let newData = "";
      that.dialogueLabelData.map((v, i) => {
        if (i != that.dialogueLabelData.length - 1) {
          newData += v.id + ",";
        } else {
          newData += v.id;
        }
      });
      let opt = {
        dialogueTag: newData,
        trackId: this.serverValues.trackid
      };
      //
      this.$axios.post(this.$httpServer.saveDialogueTag, opt).then(res => {});
    },
    /**
     * 提交新增标签
     */
    submitCus(k, obj, idDel) {
      let that = this;
      let newStr = this.visitorInformationData[k];
      if (idDel == "del") {
        newStr = obj;
      } else {
        if (newStr != "" && newStr != null) {
          newStr = newStr + "," + obj.id;
        } else {
          newStr = obj.id.toString();
        }
      }
      this.visitorInformationData[k] = newStr;
      let arr = this.visitorInformationData["customerTagInfo"]
        ? JSON.parse(this.visitorInformationData["customerTagInfo"])
        : [];
      arr.push(obj);
      this.visitorInformationData["customerTagInfo"] = JSON.stringify(arr);
      this.$axios
        .post(
          this.$httpServer.saveOrUpdateClientInfo,
          this.visitorInformationData
        )
        .then(res => {
          //  that.$emit("loadingVisitorInformation",'')
          //  this.$parent.loadingVisitorInformation(); //加载访客数据
          that.$parent.loadingVisitorInformation(); //重新加载数据
          if (!idDel) {
            that.submitAddNum(k, obj.id); //新增标签次数
          }
          this.isDisabled = -1;
          this.$message1({
            message: "修改成功",
            type: "success"
          });
          if (k == "customerTag") {
            let sender = that.storeSelectedChatEn.sender;
            that.$store.imServerStore.state.currentChatEnlist.map(v => {
              if (v.sender == sender) {
                v.customerTagInfo.push({
                  id: obj.id,
                  name: obj.name,
                  bgColor: obj.bgColor
                });
              }
			});
			let newObj = obj;
			newObj.center = "添加标签";
			let rs = {
				type: "sys",
				contentType: 50, // 50.添加顾客标签
				time: this.$ak.Utils.getNowFormatDate(),
				center: JSON.stringify(newObj)
			}
            that.$store.imServerStore.dispatch("addChatMsg", {
              clientChatId: sender,
              msg: rs,
            });
          }
        });
    },
    submitDialogueTag(obj, idDel) {
      let that = this;
      let newObj = this.$store.imServerStore.getters.selectedChatEn;
      let newStr = newObj.dialogueTag;
      if (idDel == "del") {
        newStr = obj;
      } else {
        if (newStr != "" && newStr != null) {
          newStr = newStr + "," + obj.id;
        } else {
          newStr = obj.id.toString();
        }
      }

      newObj.dialogueTag = newStr;
      that.$store.imServerStore.dispatch("addClientChat", newObj, true);
      that.addSaveDialogueTag("dialogueTag", newObj);
      if (!idDel) {
        that.submitAddNum("dialogueTag", obj.id); //新增标签次数
      }
      this.$message1({
        message: "修改成功",
        type: "success"
      });
    },
    loadingVisitorInformation() {
      this.$parent.loadingVisitorInformation();
    },
    /**
     * 根据id查询子集
     */
    getChildren(id, pid, arr) {
      let that = this;
      let newArr = [];
      let parentArr = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          newArr = arr[i].children;
          break;
        }
        if (arr[i].id == pid) {
          parentArr = arr[i].children;
        }
      }
      if (newArr.length == 0 && parentArr.length > 0) {
        for (let i = 0; i < parentArr.length; i++) {
          if (parentArr[i].id == id) {
            newArr = parentArr[i].children;
            break;
          }
        }
      }

      if (newArr.length == 0 && parentArr.length == 0) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children.length > 0) {
            newArr = that.getChildren(id, pid, arr[i].children);
          }
        }
      }

      return newArr;
    },
    /**
     * 查询当前ID子集
     */
    choseLab(id, oldData, index) {
      let that = this;
      if (this.$parent.$data.dialogueLabelData.length > 4) {
        this.$message1({
          message: "最多选择5个对话标签",
          type: "error"
        });
        return false;
      }
      that.cusData = [];
      let pid = oldData.parentId;
      let arr = that.getChildren(id, pid, that.dialogueLabelAllData);

      if (arr.length == 0) {
        //   无子集
        let newData = {
          id: oldData.id,
          lable: oldData.lable,
          color: oldData.color,
          colorIndex: oldData.colorIndex,
          parentId: oldData.parentId
        };
        that.$parent.$data.dialogueLabelData.push(newData);
        that.visible = false; //关闭弹框
        that.addSaveDialogueTag("dialogueTag", newData);
        that.changeStatus(oldData.id, that.dialogueLabelAllData);
        that.submitDialogueTag(newData);
        for (let i = 0; i < that.dialogueLabelAllData.length; i++) {
          if (that.dialogueLabelAllData[i].children.length > 0) {
            that.dialogueLabelAllData[i].status = that.updateDialogStatus(
              that.dialogueLabelAllData[i].children
            );
          }
        }
        return;
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].status) {
            let obj = {
              id: arr[i].id,
              lable: arr[i].labelName,
              color: that.colorLable[parseInt(arr[i].dialogueLabelType)],
              colorIndex: parseInt(arr[i].dialogueLabelType),
              parentId: arr[i].parentId
            };
            that.cusData.push(obj);
          }
        }
      }

      if (that.cusData.length == 0) {
        index = index - 1;
      }
      // that.visible = false; //关闭弹框
      if (index == 2) {
        that.activeName = "second"; //默认展示
      } else {
        that.activeName = "third"; //默认展示
      }
      return;
    },
    /**
     * 选择顾客标签
     */
    selectingCustomerLabels(id, oldData, index) {
      if (this.$parent.$data.tableShowData.length > 9) {
        this.$message1({
          message: "顾客标签最多选择10个",
          type: "error"
        });
        return false;
      }
      this.isDisabled = id;
      let that = this;
      let newData = {
        // index:i,
        name: oldData.name, //标签名
        id: oldData.id, // 标签ID
        num: oldData.num, // 标签使用次数
        bgColor: oldData.bgColor, //标签颜色
        bgColorIndex: oldData.bgColorIndex // 标签颜色下标
      };
      that.visibleLabel = false;
      that.$parent.$data.tableShowData.push(newData);
      that.submitCus("customerTag", newData);
    },
    /**
     * 查询所以顾客标签
     */
    getLabele() {
      let that = this;
      this.$axios.get(this.$httpServer.getLabele).then(res => {
        that.tableData = [];
        that.dataCustomerFilter(
          res.data.data,
          that.$parent.$data.tableShowData
        );
      });
    },
    /**
     * 加载标签数据
     */
    loadData() {
      let that = this;
      that.activeName = "first"; //默认展示
      that.dialogueLabelAllData = [];
      this.$axios.get("/set/dialogueLabelConfig/tree").then(res => {
        that.dialogueLabelAllData = res.data.data;
        //数据过滤

        that.dataFilter(that.$parent.$data.dialogueLabelData, "1");
      });
    },
    /**
     * 数据过滤
     * 新数据、对话标签数据
     * dataLab：已选数据
     */
    dataFilter(dataLab, type) {
      let that = this;
      that.cusData = []; // 数据清空
      // 是否删除父标签
      // 判断当前父标签的子集与选中的标签对比
      /**
       * 删除子集
       */

      for (let i = 0; i < dataLab.length; i++) {
        let id = dataLab[i].id;
        that.changeStatus(id, that.dialogueLabelAllData);
      }
      for (let i = 0; i < that.dialogueLabelAllData.length; i++) {
        if (that.dialogueLabelAllData[i].children.length > 0) {
          that.dialogueLabelAllData[i].status = that.updateDialogStatus(
            that.dialogueLabelAllData[i].children
          );
        }
      }

      that.createData(that.dialogueLabelAllData, type);
    },
    changeStatus(id, arr) {
      let that = this;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children.length > 0) {
          that.changeStatus(id, arr[i].children);
        } else {
          if (arr[i].id === id) {
            arr[i].status = false;
          }
        }
      }
    },
    updateDialogStatus(arr) {
      let that = this;
      let status = false;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children.length > 0) {
          let childrenStatus = that.updateDialogStatus(arr[i].children);
          arr[i].status = childrenStatus;
          if (childrenStatus) {
            status = childrenStatus;
          }
        } else {
          if (arr[i].status) {
            status = arr[i].status;
          }
        }
      }
      return status;
    },
    createData(arr, type) {
      let that = this;
      for (let i = 0; i < arr.length; i++) {
        if (type !== "1" && arr[i].children.length > 0) {
          that.createData(arr[i].children, type);
        } else {
          if (arr[i].status && type == arr[i].labelExp) {
            let obj = {
              id: arr[i].id,
              lable: arr[i].labelName,
              color: that.colorLable[parseInt(arr[i].dialogueLabelType)],
              colorIndex: parseInt(arr[i].dialogueLabelType),
              parentId: arr[i].parentId
            };
            that.cusData.push(obj);
          }
        }
      }
    },
    choseCustomer() {},
    /**
     * 数据过滤
     * 新数据、顾客标签数据
     */
    dataCustomerFilter(newData, dataLab) {
      let that = this;
      for (let i = 0; i < newData.length; i++) {
        let pushTrue = true;
        let data = {
          id: newData[i].id,
          name: newData[i].labelName,
          bgColor: that.colorLable[parseInt(newData[i].labelStype)],
          bgColorIndex: parseInt(newData[i].labelStype)
        };
        for (let j = 0; j < dataLab.length; j++) {
          if (dataLab[j].id == newData[i].id) {
            pushTrue = false;
            break;
          }
        }
        if (pushTrue) {
          that.tableData.push(data);
        }
      }
    },
    addLable() {
      this.tableData = [];
      // this.visibleLabel = !this.visibleLabel;
      this.getLabele();
    },
    /**
     * 添加对话标签
     */
    addSublabe() {
      this.loadData();
    },
    /**
     * 加载数据
     */
    handleClick(tab, event) {},
    /**
     * 删除对话标签
     */
    delConversationsTab(k, id) {
      let that = this;
      let newData = [];
      let inx = null;
      that.$parent.$data.dialogueLabelData.map((v, i) => {
        if (v.id == id) {
          inx = i;
        } else {
          newData.push(v.id);
        }
      });
      that.$parent.$data.dialogueLabelData.splice(inx, 1);
      newData = newData.join(",").toString();
      that.changeStatus(id, that.dialogueLabelAllData);
      that.submitDialogueTag(newData, "del");
      for (let i = 0; i < that.dialogueLabelAllData.length; i++) {
        if (that.dialogueLabelAllData[i].children.length > 0) {
          that.dialogueLabelAllData[i].status = that.updateDialogStatus(
            that.dialogueLabelAllData[i].children
          );
        }
      }
    },
    /**
     * 删除顾客标签
     */
    delLab(k, id) {
      let that = this;
      // that.$parent.$data.tableShowData.map((v,i)=>{
      //   if(v.id == id){
      //     that.$parent.$data.tableShowData.splice(i,1);
      //   }
      // })
      that.delCus(k, id);
    },
    // 修改访客信息
    updVisitor(k, value) {},
    addBackList() {
      let that = this;
      let isShow = false;
      let opt = {
        ipAddress: that.storeSelectedChatEn.clientip, //ip地址
        visitorId: that.storeSelectedChatEn.sender
      };
      if (!this.userBlackList) {
        opt.attribution =
          this.storeSelectedChatEn.clientProvince +
          " " +
          this.storeSelectedChatEn.clientCity +
          " " +
          this.$parent.visitorInformationData.clientName;
        opt.maskingId = 7;
        isShow = true; // 显示黑名单
      }
      if (!this.userBlackList) {
        // 加入黑名单
        that.$axios
          .get(
            that.$httpServer.turnToBlacklist +
              "?clientId=" +
              that.storeSelectedChatEn.sender
          )
          .then(res => {})
          .catch(error => {});
      }

      let contentTypeValue = isShow ? 20 : -20;
      that.$axios
        .post(that.$httpServer.saveOrDeleteBlackVisitor, opt)
        .then(res => {
          that.dialogVisible = false;
          that.$store.imServerStore.dispatch("addChatMsg", {
            clientChatId: that.serverValues.seatsId,
            msg: {
              type: "sys",
              contentType: contentTypeValue,
              time: this.$ak.Utils.getNowFormatDate(),
              center: ""
            },
            successCallback: function() {}
          });
          that.$parent.$data.userBlackList = !that.$parent.$data.userBlackList;
        });
    }
  }
};
</script>
<style scoped>
.imCustomerlabel {
  width: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  height: 100%;
  float: right;
}
.imCustomerlabel .headLableFunction {
  line-height: 50px;
  width: 260px;
  margin-bottom: 50px;
}
.imCustomerlabel > .title {
  font-size: 13px;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
  color: #343f4b;
  line-height: 50px;
}

.imCustomerlabel > .title .title-right {
  text-align: right;
  color: #009de7;
}
.imCustomerlabel > .tab {
  color: #969faa;
  font-size: 12px;
  padding-left: 16px;
}
.tab .info-panel-ticket-desp {
  white-space: normal;
  position: absolute;
  left: 6px;
  top: 10px;
  /* right: 0;
    bottom: 0; */
  font-size: 12px;
  line-height: 18px;
  vertical-align: middle;
  text-overflow: ellipsis;
  word-break: keep-all;
  overflow: hidden;
  white-space: nowrap;
}
.tab .info-panel-ticket-desp:hover {
  text-decoration: underline;
  cursor: pointer;
}
.imCustomerlabel > .child {
  padding-left: 16px;
  color: #161e26;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  margin-bottom: 6px;
}
.imCustomerlabel > .child .title-left {
  color: #767d85;
}
.imCustomerlabel > .child .title-right {
  line-height: 24px;
  min-height: 24px;
  /* min-width: 150px; */
  cursor: pointer;
  transition: background 0.3s;
  /* width: 180px; */
  /* max-width: 180px; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.imCustomerlabel > .child .title-right:hover {
  background: #fdf7d7;
}
.el-popover__reference {
  cursor: pointer;
}
.tag-item {
  float: left;
  max-width: 100px;
  margin: 0;
  padding: 6px 14px;
  cursor: pointer;
  line-height: normal;
  position: relative;
  /* display: inline-block; */
  font-size: 12px;
  color: #fff;
  text-align: left;
  white-space: nowrap;
  border-radius: 3px;
  text-overflow: ellipsis;
  word-break: keep-all;
  margin-right: 10px;
  margin-bottom: 10px;
  overflow: hidden;
}
.tag-tag {
  position: relative;
  display: inline-block;
  padding: 4px 7px;
  margin-right: 5px;
  margin-bottom: 5px;
  line-height: 1;
  font-size: 12px;
  color: #fff;
  text-align: left;
  border-radius: 3px;
  cursor: pointer;
}
.tag-tag-lable {
  max-width: 70px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pull-top {
  margin-top: 130px;
  height: 200px;
}
.tag-del {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  color: #fff;
  background: #2d2d2d;
  line-height: 20px;
  cursor: pointer;
  border-radius: 3px;
}
.tag-tag:hover .tag-del {
  display: block;
}
.agent-single-selector-shadowPanel {
  padding: 3px 0;
  min-width: 160px;
  min-height: 120px;
  text-align: left;
  background-color: #fff;
  background-clip: padding-box;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 6px rgba(52, 63, 75, 0.25);
  box-shadow: 0 1px 6px rgba(52, 63, 75, 0.25);
  padding: 10px 0 15px 15px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
}
.agent-single-selector-shadowPanel .agentCenter,
.pull-rigth .agentCenter {
  display: inline-block;
  width: 100%;
  text-align: center;
}
.currOptClass {
  cursor: pointer;
}
</style>

