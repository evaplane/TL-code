<!--  -->
<template>
  <div class="add-tickets">
    <el-dialog
      width="30%"
      :title="type == 0 ? '添加自动规则':'编辑自动规则'"
      append-to-body
      :visible.sync="visible"
      @close="closeDialog"
    >
      <div class="content">
        <div class="content-item">
          <label>工单分类为</label>
          <div class="form">
            <el-cascader
              ref="refSubCat"
              :show-all-levels="false"
              :options="allSubCatList"
              :props="subCatProps"
              @change="handleSubCat"
              v-model="subCatValue"
            ></el-cascader>
          </div>
        </div>
        <div class="content-item">
          <label>工单分配给</label>
          <div class="form">
            <el-cascader
              v-model="handleValue"
              ref="refHandle"
              :show-all-levels="false"
              change-on-select
              :options="handler"
              @change="handleChange"
              :props="handleOprops"
              expand-trigger="hover"
            ></el-cascader>
          </div>
        </div>
        <div class="content-item">
          <label>工单抄送给</label>
          <div class="form">
            <el-cascader
              v-model="ccValue"
              ref="ccCascader"
              separator="/"
              :options="ccData"
              :props="props"
              @change="ccChange"
              clearable
              collapse-tags
            ></el-cascader>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel" @click="closeDialog">取 消</el-button>
        <el-button v-if="type==0" class="create" type="primary" @click="addTicketOrder()">创 建</el-button>
        <el-button v-if="type==1" class="create" type="primary" @click="editTicketOrder()">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Tinymce from "../../../components/common/Tinymce";
import { deepClone } from "../../util/util";
export default {
  components: {
    Tinymce
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    ruleItem: {
      required: true,
      type: Object,
      default: ""
    },
    type:{
      required:true,
      type:Number,
    }
  },
  //监控data中的数据变化
  watch: {
    show: {
      immediate: true,
      handler(show) {
        this.visible = show;
      }
    },
    ruleItem:{
      immediate:true,
      handler(data){
        this.ruleItem = data;
        this.subCatValue = this.ruleItem.classId;
        if(this.ruleItem.processTeamId){
          this.handleValue = this.ruleItem.processTeamId;
        }
        this.ticketOrder.id = this.ruleItem.id;
      }
    },
    type:{
      immediate:true,
      handler(data){
        this.type = data;
        if(data == 0){
          this.handleValue = '';
          this.subCatValue = '';
        }
      }
    }
  },
  data() {
    return {
      visible: this.show,
      props: { multiple: true },
      subCatProps: {
        value: "id",
        label: "className",
        children: "subcat"
      }, // 格式化工单信息
      allSubCatList: [], // 工单分类列表
      subCatValue: "",
      handleOprops: {
        value: "id",
        label: "name",
        children: "children"
      }, // 格式化处理人
      handler: [], // 处理人列表
      handleValue: [], //处理人默认值
      ccData: [], //抄送列表
      ccValue: [],
      ccList: [],
      // checkList: [[25, 13, 16, 11]], //抄送
      checkList: [], //抄送
      // 工单对象
      ticketOrder: {
        // 如果选择的是具体人就传assigneeId   如果选择的某个组就传assigneeGroupId
        id:'',
        assigneeGroupId: null, // 处理人分组ID
        assigneeId: null, // 处理人ID,
        assigneeName: "",
        cc: [], //抄送
        classId: null, // 工单ID
        className: "",
        content: "", // 内容
        deadline: "", // 截止时间
        trackId: "",
        visitId: "",
        autoRule: [],
        processTeamId: null, //处理人如果是组传 [1,2]
        processPersonIdList: [], //处理人如果是人传人ID
        ccTeamId: [],
        ccPersonIdList: []
      },
      autoRule: {
        processTeamId: "",
        processPersonIdList: ""
      }
    };
  },
  created() {
    this.getAllSubCatList();
    this.listDeptTreeUsers();

  },
  methods: {

    closeDialog() {
      this.$emit("closeMain", false); // 子组件更新弹框隐藏
      this.ticketOrder = [];
    },
    // ----------------------------------------------工单------------------------------------------------
    // 获取工单分类列表
    getAllSubCatList() {
      this.$axios.get(this.$httpServer.getAllSubCatList, {}).then(res => {
        if (res && res.data.code == "0") {
          this.allSubCatList = this.getTreeSubCat(res.data.data);
        }
      });
    },
    // 获取工单分类ID
    handleSubCat(value) {
      this.ticketOrder.classId = value[value.length - 1];
      this.ticketOrder.className = this.$refs[
        "refSubCat"
      ].getCheckedNodes()[0].label;

      // // 获取默认的工单自动规则
      // this.$axios
      //   .get(this.$httpServer.autoRule + "/" + this.ticketOrder.classId)
      //   .then(res => {
      //     if (res && res.data.code == "0" && res.data.data) {
      //       // ccTeamId:
      //       let data = {
      //         // 抄送
      //         // ccTeamId:[23,17],
      //         // ccPersonIdList: [24, 22]
      //         // 处理人
      //         // processTeamId:25, //团队
      //         // processPersonIdList:13+"=" //个人
      //       };
      //       this.autoRule = data;
      //       this.autoRule = res.data.data;
      //       this.handleValue = [];
      //       // 处理人 团队
      //       if (this.autoRule.processTeamId) {
      //         this.handleValue = this.autoRule.processTeamId;
      //       }
      //       // 处理人 个人
      //       if (this.autoRule.processPersonIdList) {
      //         this.handleValue = this.autoRule.processPersonIdList + "=";
      //       }
      //       // 抄送个人
      //       if (data.ccTeamId) {
      //         let arr = data.ccTeamId;
      //         let item = [];
      //         for (let i = 0; i < arr.length; i++) {
      //           let arr1 = this.getParents(this.ccData, arr[i] + "=").reverse();
      //           arr1.push(arr[i] + "=");
      //           item.push(arr1);
      //         }
      //         this.ccValue = item;
      //       }

      //       // 抄送团队
      //       // if(data.ccPersonIdList){

      //       // }
      //       // console.log(this.ccData);

      //       // this.getChildIds(this.ccData, 24);
      //       // console.log(this.getChildIds(this.ccData, 24));
      //     }
      //   });
    },
    // 根据父ID获取下面所有的子ID
    // getSon(data,id){
    //   for(var i in data){
    //     if(data[i].children){
    //       var ro = this.getSon(data[i].children,id);
    //     }else{
    //       if(ro !== undefined){
    //         console.log(data[i].value);
    //       }
    //       // console.log(ro)
    //       // console.log(data[i].value)
    //       // console.log(data[i]);
    //       // if(data[i].value == id){
    //       //   console.log(data[i])
    //       // }
    //       // data[i]
    //       // console.log(data[i]);
    //     }
    //   }
    // },

    //获取指定id的子节点id数组
    //找到某一父节点下的所有子节点
    getChildIds(arr, id) {
      var childIds = [];
      function a(arr) {
        for (var i = 0; i < arr.length; i++) {
          if (id.length >= arr[i].id.length) {
            if (id.startsWith(arr[i].id)) {
              if (arr[i].id.length == id.length) {
                childIds.push(arr[i].id);
              }
              a(arr[i].children);
            }
          } else {
            if (arr[i].id.startsWith(id)) {
              childIds.push(arr[i].id);
              a(arr[i].children);
            }
          }
        }
      }
      a(arr);
      return childIds;
    },

    // 根据 子ID找到所有的父节点
    getParents(data, id) {
      for (var i in data) {
        if (data[i].children) {
          var ro = this.getParents(data[i].children, id);
          if (ro !== undefined) {
            return ro.concat(data[i].value);
          }
        }
        if (data[i].value == id) {
          return [];
        }
      }
    },
    // children 若为空数组，则将children设为undefined
    getTreeSubCat(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].subcat.length < 1) {
          data[i].subcat = undefined;
        } else {
          this.getTreeSubCat(data[i].subcat);
        }
      }
      return data;
    },

    // ----------------------------------------------处理人------------------------------------------------
    // 获取处理人的集合列表
    listDeptTreeUsers() {
      this.$axios.get(this.$httpServer.listDeptTreeUsers).then(res => {
        if (res && res.data.code == "0") {
          this.handler = this.getHandleChildren(
            this.getTreeHandle(res.data.data)
          );
          this.ccData = this.getHandleChildren(
            this.taCC(deepClone(res.data.data))
          );
        }
      });
    },

    getHandleChildren(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.getHandleChildren(data[i].children);
        }
      }
      return data;
    },
    // 修改处理人的数据结构，把最后一项的children 追加userList数据
    getTreeHandle(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        // 不存在分组
        // 不存在子children 或者有 userList
        if (
          (data[i].children && data[i].children.length < 1) ||
          data[i].userList.length > 0
        ) {
          // children等于[] 并且 存在userList 的时候 赋值
          if (
            data[i].userList &&
            data[i].userList.length > 0 &&
            data[i].children.length < 1
          ) {
            let arr = [];
            for (let index in data[i].userList) {
              let item = data[i].userList[index];
              let obj = {};
              obj.id = item.userId + "=";
              obj.name = item.username;
              obj.children = [];
              arr.push(obj);
            }
            data[i].children = arr;
            // children有值 且存在userList的时候 追加userList到children
          } else if (
            data[i].children &&
            data[i].userList &&
            data[i].children.length > 0
          ) {
            for (const key in data[i].userList) {
              let items = data[i].userList[key];
              let objs = {};
              objs.id = items.userId + "=";
              objs.ownerType = 1;
              objs.name = items.username;
              objs.children = [];
              data[i].children.push(objs);
            }
            this.getTreeHandle(data[i].children);
          }
        } else {
          this.getTreeHandle(data[i].children);
        }
      }
      return data;
    },

    // 根据ID值 递归遍历集合 判断是组还是个人
    recursive(data, obj) {
      let that = this;
      data.map(function(item) {
        if (item.id !== obj.id && item.children && item.children.length) {
          that.recursive(item.children, obj);
        } else if (item.id == obj.id) {
          if (item.name == obj.name && item.userList) {
            that.ticketOrder.assigneeGroupId = obj.id;
          }
          if (!item.children && !item.userList && item.name == obj.name) {
            that.ticketOrder.assigneeId = obj.id;
          }
        }
      });
      return data;
    },
    // 获取处理人
    handleChange(data) {
      this.ticketOrder.processTeamId = null;
      this.ticketOrder.processPersonIdList = [];
      let tag = true;
      for (let i = 0; i < data.length; i++) {
        if (typeof data[i] == "string") {
          tag = false;
        }
      }
      if (tag) {
        // 组
        this.ticketOrder.processTeamId = data[data.length - 1];
      } else {
        // 人
        this.ticketOrder.processPersonIdList = data;
      }
      // 处理人名称
      this.ticketOrder.processTeamName = this.$refs[
        "refHandle"
      ].getCheckedNodes()[0].label;
      // console.log(data);
      // let name = this.$refs["refHandle"].getCheckedNodes()[0].label;
      // let id = this.$refs["refHandle"].getCheckedNodes()[0].value;
      // this.ticketOrder.assigneeName = name;
      // let object = {
      //   id: id,
      //   name: name
      // };
      // this.ticketOrder.assigneeGroupId = null;
      // this.ticketOrder.assigneeId = null;
      // this.index = 0;
      // this.recursive(this.handler, object);
    },

    // ----------------------------------------------抄送------------------------------------------------
    // 将抄送的集合转换为指定的集合格式
    taCC(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length) {
          arr[i].children = this.taCC(arr[i].children);
        } else {
          arr[i].children = [];
        }
        arr[i].name && (arr[i].label = arr[i].name);
        arr[i].id && (arr[i].value = arr[i].id);
        delete arr[i].name;
        delete arr[i].id;
        delete arr[i].delFlag;
        delete arr[i].parentId;
        delete arr[i].sort;
        delete arr[i].tenantId;
        delete arr[i].userList;
      }
      return arr;
    },
    // 获取抄送
    ccChange(value) {
      console.log(value);
      this.ticketOrder.cc = [];
      let nodes = this.$refs["ccCascader"].getCheckedNodes();
      for (const key in nodes) {
        this.getCurrentPart(nodes[key].value, this.ccData);
      }
    },

    getCurrentPart(id, data) {
      let obj = {};
      let arr = [];
      for (var i in data) {
        if (data[i].value == id) {
          if (typeof data[i].children == "undefined") {
            obj = {
              ownerId: data[i].value,
              ownerType: 0
            };
          } else {
            obj = {
              ownerId: data[i].value,
              ownerType: 1
            };
          }
          this.ticketOrder.cc.push(obj);
          break;
        } else if (data[i].children) {
          this.getCurrentPart(id, data[i].children);
        }
      }
      return arr;
    },
    // ----------------------------------------------截止日期------------------------------------------------
    // 截止日期
    handleDate(value) {
      this.deadline = value;
    },
    // 添加工单信息
    addTicketOrder() {
      let ticketOrder = {
        classId: this.ticketOrder.classId,
        className: this.ticketOrder.className,
        processTeamName: this.ticketOrder.processTeamName //处理人
      };
      // 处理人
      if (this.ticketOrder.processPersonIdList.length > 0) {
        let data = this.ticketOrder.processPersonIdList;
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] == "string") {
            data[i] = parseInt(data[i].split("=")[0]);
          }
        }
        ticketOrder.processPersonIdList = JSON.stringify(data);
      }
      if (this.ticketOrder.processTeamId != null) {
        ticketOrder.processTeamId = this.ticketOrder.processTeamId;
      }
      ticketOrder.ccPersonIdList = "[1,100019]";
      ticketOrder.ccTeamName = "yml";

      // 抄送
      // if (this.ticketOrder.cc.length > 0) {
      //   let data = deepClone(this.ticketOrder.cc);
      //   ticketOrder.cc = data;
      // }
      let that = this;
      this.$axios
        .post(this.$httpServer.saveRule, ticketOrder)
        .then(res => {
          if (res && res.data.code == "0") {
            this.$message({
              type: "success",
              message: "新建成功",
              showClose: true
            });
            that.ticketOrder = [];
            this.$emit("closeMain", false); // 子组件更新弹框隐藏
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: error.data.msg,
            showClose: true
          });
          that.ticketOrder = [];
        });
    },
    // 编辑工单规则
    editTicketOrder(){
      let ticketOrder = {
        id:this.ticketOrder.id,
        classId: this.ticketOrder.classId,
        className: this.ticketOrder.className,
        processTeamName: this.ticketOrder.processTeamName //处理人
      };
      // 处理人
      if (this.ticketOrder.processPersonIdList.length > 0) {
        let data = this.ticketOrder.processPersonIdList;
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] == "string") {
            data[i] = parseInt(data[i].split("=")[0]);
          }
        }
        ticketOrder.processPersonIdList = JSON.stringify(data);
      }
      if (this.ticketOrder.processTeamId != null) {
        ticketOrder.processTeamId = this.ticketOrder.processTeamId;
      }
      ticketOrder.ccPersonIdList = "[1,100019]";
      ticketOrder.ccTeamName = "yml";

      let that = this;
      console.log(ticketOrder)
      this.$axios
        .put(this.$httpServer.updateRule, ticketOrder)
        .then(res => {
          if (res && res.data.code == "0") {
            this.$message({
              type: "success",
              message: "修改成功",
              showClose: true
            });
            that.ticketOrder = [];
            this.$emit("closeMain", false); // 子组件更新弹框隐藏
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: error.data.msg,
            showClose: true
          });
          that.ticketOrder = [];
        });
    }
  },
  mounted() {
    if(this.ruleItem){
      console.log(this.ruleItem);
      let that =this;
      this.subCatValue = this.ruleItem.classId;
      if(this.ruleItem.processTeamId){
        this.handleValue = this.ruleItem.processTeamId;
      }
      // if(this.ruleItem)
    }
  },
  updated(){

  }
};
</script>

<style lang="less" scoped>
@import "../../../common/css/base.less";

/deep/ .el-dialog__header {
  .el-dialog__title {
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: 300;
    text-align: center;
    color: #2a3541;
  }
}
/deep/ .el-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 56px;
  border-radius: 3px;
  background-color: #f6f6f9;
  padding: 20px 30px;
  box-shadow: inset 0 1px 0 0 rgba(52, 63, 75, 0.08);
  .cancel {
    background-color: #c6cbd0;
  }
  .create {
    background-color: #009de7;
  }
  .cancel,
  .create {
    display: inline-block;
    position: relative;
    padding: 7px 21px;
    margin-bottom: 0;
    font-size: 13px;
    font-weight: 400;
    line-height: 1.385;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: none;
    border-radius: 4px;
    color: #fff;
    &:hover {
      opacity: 0.8;
    }
  }
}
.content {
  overflow: auto;
  box-sizing: border-box;
  height: 100%;
  //   background-color: #fbfbfc;
  padding: 0px 20px;
  //   width: 80%;
  /deep/ .content-item {
    margin-bottom: 20px;
    &:nth-child(1) {
      label {
        color: #4ca0ff;
      }
      .form {
        background-color: #fff4e6;
        background-color: #f8fff8;
        border: 1px solid #eff5ee;
      }
    }
    &:nth-child(2) {
      label {
        color: #30cc80;
      }
      .form {
        background-color: #f8fff8;
        border: 1px solid #eff5ee;
      }
    }
    &:nth-child(3) {
      label {
        color: #fdb55b;
      }
      .form {
        background-color: #fff4e6;
        border: 1px solid #f5eadc;
      }
    }
    label {
      display: block;
      font-size: 14px;
      color: #000;
      margin-bottom: 8px;
    }
    .form {
      padding: 20px 15px;
    }
    .el-cascader {
      height: 34px;
      width: 100%;
      .el-input__inner {
        height: 34px;
        border-radius: 0px;
        border: none;
        box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
        color: #969faa;
      }
      .el-cascader__tags {
        display: inline-block;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
    }
    .el-cascader__label {
      width: 100%;
    }
    &.add-work-order {
      span {
        background: #009de7;
        border: none;
        color: #fff;
      }
      width: 100%;
      display: inline-block;
      height: 32px;
      line-height: 32px;
      font-size: 13px;
      font-weight: 400;
      text-align: center;
      cursor: pointer;
      border: none;
      border-radius: 4px;
      background: #009de7;
      &:hover {
        background-color: #008cce;
        span {
          background: #008cce;
        }
      }
    }
    // 抄送
    .el-select {
      .el-input__inner {
        height: 34px;
        border-radius: 0px;
        border: none;
        box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
        color: #969faa;
      }
      .el-input__icon {
        line-height: 34px;
      }
    }
  }
}
</style>
