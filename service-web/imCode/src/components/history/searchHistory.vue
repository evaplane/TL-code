<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-23 11:32:07
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-28 22:25:46
 -->
<!--  -->
<template>
  <div class="search-history">
    <aside>
      <div class="aside-main">
        <div class="content">
          <div class="content-item">
            <div class="tab">快速搜索</div>
            <div class="user-name">
              <el-input
                v-model="historyInfo.clientName"
                clearable
                prefix-icon="el-icon-search"
                placeholder="搜索用户名称"
              ></el-input>
            </div>
          </div>
          <div class="content-item">
            <div class="tab">常用筛选</div>
            <label>对话开始时间</label>
            <div>
              <el-date-picker
                v-model="historyInfo.beginDate"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                @change="beginDateChange"
              ></el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <label>对话结束时间</label>
            <div>
              <el-date-picker
                v-model="historyInfo.endDate"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                @change="endDateChange"
              ></el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <label>客服</label>
            <div>
              <el-cascader
                clearable
                :collapse-tags="true"
                v-model="handlerValue"
                ref="refHandle"
                :show-all-levels="false"
                change-on-select
                :options="handler"
                :props="handleOprops"
                expand-trigger="hover"
              ></el-cascader>
            </div>
          </div>
          <div class="content-item">
            <label>顾客标签</label>
            <div class="customerLabel">
              <el-select
                v-model="customerLabel"
                multiple
                placeholder="请选择"
                :collapse-tags="true"
                popper-class="search-history-select"
              >
                <el-option
                  v-for="item in customerLabelArr"
                  :key="item.id"
                  :label="item.labelName"
                  :value="item.id"
                >
                  <div
                    class="bgColor"
                    :style="{backgroundColor:colorLable[parseInt(item.labelStype)]}"
					:title="item.labelName"
                  >{{item.labelName}}</div>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="content-item">
            <label>对话标签</label>
            <div>
              <el-cascader
                clearable
                :collapse-tags="true"
                v-model="dialogueLabel"
                ref="refHandle"
                :show-all-levels="false"
                change-on-select
                :options="dialogueLabelArr"
                :props="handleOprops"
                expand-trigger="hover"
				popper-class="search-history-dialogueLabel"
              >
			  	<template slot-scope="{ node, data }">
					<span :style="{backgroundColor:data.color}" :title="data.name">{{ data.name }}</span>
				</template>
			  </el-cascader>
            </div>
          </div>
          <div class="content-item">
            <div class="tab">其他</div>
            <label>评价结果</label>
            <el-radio-group v-model="historyInfo.evaluateType">
              <el-radio :label="'3'">差</el-radio>
              <el-radio :label="'2'">中</el-radio>
              <el-radio :label="'1'">好</el-radio>
              <el-radio :label="'0'">无</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="aside-footer" @click="getDialogueHistoryInfo()">开始筛选</div>
    </aside>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    //这里存放数据
    return {
      customer: "", //客服
      handler: [], // 处理人列表
      handlerValue: [], //处理人默认值
      customerLabel: [], // 顾客标签默认值
	  customerLabelArr: [], // 顾客标签列表
      dialogueLabel: [], // 对话标签默认值
      dialogueLabelArr: [], // 对话标签列表
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
      handleOprops: {
        value: "id",
        label: "name",
        children: "children",
        multiple: true,
        checkStrictly: false,
        emitPath: false
      }, // 格式化处理人
      // evaluateTypeLsit:[],
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
        evaluateType: "", //评价类型 0无 1好 2中 3差
        seatNum: 0, //对话坐席发送消息数
        seatsIds: [], //坐席ID
        trackId: "" //对话ID
      },
      ticketOrder: {
        // 如果选择的是具体人就传assigneeId   如果选择的某个组就传assigneeGroupId
        assigneeGroupId: null, // 处理人分组ID
        assigneeId: null, // 处理人ID,
        assigneeName: "",
        begin: null,
        end: null
      }
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    handlerValue() {
      if (this.$refs.refHandle) {
        this.$refs.refHandle.dropDownVisible = false;
      }
    }
  },
  //方法集合
  methods: {
    // 获取处理人的集合列表
    listDeptTreeUsers() {
      this.$axios.get(this.$httpServer.listDeptByDataScope).then(res => {
        if (res && res.data.code == "0") {
          // this.handler = this.$ak.BLL.getHandleChildren(
          //   this.getTreeHandle(res.data.data)
          // );

          this.handler = this.$ak.BLL.getHandleChildren(
            this.getTreeHandle(res.data.data)
          );
          let newHandler = [];
          this.handler.forEach((item, index) => {
            if (item.userList && item.userList.length > 0) {
              newHandler.push(item);
            }
          });
          this.handler = newHandler;
          this.$emit("setHisOptList", newHandler);
        }
      });
    },
    // 获取处理人
    handleChange(value) {
      if (value.length > 0) {
        let name = this.$refs["refHandle"].getCheckedNodes()[0].label;
        let id = this.$refs["refHandle"].getCheckedNodes()[0].value;
        this.ticketOrder.assigneeName = name;
        let object = {
          id: id,
          name: name
        };
        this.ticketOrder.assigneeGroupId = null;
        this.ticketOrder.assigneeId = null;
        this.index = 0;
        this.recursive(this.handler, object);
      } else {
        this.ticketOrder.assigneeGroupId = null;
        this.ticketOrder.assigneeId = null;
      }
    },
    /**
     * 查询所有顾客标签
     */
    getCustomerLabele() {
      let that = this;
      this.$axios.get(this.$httpServer.getLabele).then(res => {
        if (res.data.code == 0) {
          that.customerLabelArr = [];
          that.customerLabelArr = res.data.data;
        }
      });
    },
    // 获取对话标签的集合列表
    getDialogLabelArr() {
      this.$axios.get(this.$httpServer.getTab).then(res => {
        if (res && res.data.code == "0") {
          this.dialogueLabelArr = this.getTree(this.getDialogLabel(res.data.data));
		  console.log(this.dialogueLabelArr);
          // this.$emit("setHisOptList",newArr)
        }
      });
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

    // // 递归把最后一个 children [] 改为 undefined
    // getHandleChildren(data) {
    //   for (var i = 0; i < data.length; i++) {
    //     if (data[i].children.length < 1) {
    //       data[i].children = undefined;
    //     } else {
    //       this.getHandleChildren(data[i].children);
    //     }
    //   }
    //   return data;
    // },
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
              obj.id = item.userId;
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
              objs.id = items.userId;
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
    // 处理对话标签列表
    getDialogLabel(data) {
      let that = this;
      let newArr = [];
      data.map(v => {
        let obj = {
          id: v.id,
          name: v.labelName,
          color: that.colorLable[parseInt(v.dialogueLabelType)],
          colorIndex: parseInt(v.dialogueLabelType),
          parentId: v.parentId
        };
        newArr.push(obj);
      });
      newArr.sort((a, b) => {
        return a.parentId - b.parentId;
      });
      return newArr;
	},
	// 将数组转为树结构
	getTree(data){
		var midObj = {};
          // 从后向前遍历
          for (var i = data.length - 1; i >= 0; i--) {
            var nowPid = data[i].parentId;
            var nowId = data[i].id;
            // 建立当前节点的父节点的children 数组
            if (midObj[nowPid]) {
              midObj[nowPid].push(data[i]);
            } else {
              midObj[nowPid] = [];
              midObj[nowPid].push(data[i]);
            }
            // 将children 放入合适的位置
            if (midObj[nowId]) {
              data[i].children = midObj[nowId];
              delete midObj[nowId];
            }
		  }
		  return midObj[0];
	},
    // 截止日期
    handleDate(value) {
      this.deadline = value;
    },
    getDialogueHistoryInfo() {
      if (this.historyInfo.beginDate > this.historyInfo.endDate) {
        this.$message1({
          message: "开始时间不能大于截止时间"
        });
        return false;
      }
	  // 默认传开始时间一个月前 和结束时间当前时间,格式是2019-07-22 10:55:10
	  // 如果是管理员,什么都不传，其他的都传seatsGroupId
	  this.historyInfo.seatsIds = this.handlerValue;
	  this.historyInfo.customerLabelIds = this.customerLabel;
	  this.historyInfo.dialogueLabelIds = this.dialogueLabel;
      this.$emit("historyParams", this.historyInfo);
    },
    beginDateChange(value) {
      this.historyInfo.beginDate = value;
      if (value) {
        this.historyInfo.begin = "begin";
      } else {
        this.historyInfo.begin = null;
      }
    },
    endDateChange(value) {
      this.historyInfo.endDate = value;
      if (value) {
        this.historyInfo.end = "end";
      } else {
        this.historyInfo.end = null;
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.listDeptTreeUsers();
	this.getCustomerLabele();
	this.getDialogLabelArr();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    setInterval(function() {
      document.querySelectorAll(".el-cascader-node__label").forEach(el => {
        el.onclick = function() {
          if (this.previousElementSibling) this.previousElementSibling.click();
        };
      });
    }, 1000);
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
.search-history {
  aside {
    width: 320px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .aside-main {
      flex: 1;
      overflow: auto;
      .content {
        overflow: auto;
        box-sizing: border-box;
        background-color: #fbfbfc;
        padding: 20px 20px 40px 20px;
        /deep/ .content-item {
          .tab {
            margin-bottom: 20px;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
          }
          .user-name {
            margin-bottom: 50px;
            .el-input__inner {
              padding-left: 25px !important;
            }
            i {
              font-size: 14px;
            }
          }
          margin-bottom: 20px;
          label {
            display: block;
            font-size: 12px;
            color: #767d85;
            margin-bottom: 6px;
            height: 20px;
            line-height: 20px;
          }
          .el-cascader {
            height: 40px;
            width: 100%;
            .el-input__inner {
              height: 34px;
              border-radius: 0px;
              border: none;
              box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
              color: #969faa;
            }
          }
          .el-cascader__label {
            width: 100%;
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
          // 日期
          .el-date-editor.el-input__inner {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
            .el-input__inner {
              width: 100%;
              padding-left: 30px;
              height: 34px;
              line-height: 34px;
              border-radius: 0px;
              border: none;
              font-size: 13px;
              box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
              color: #969faa;
            }
            .el-input__icon {
              line-height: 34px;
            }
          }
          .el-input__inner {
            width: 100%;
            height: 34px;
            border-radius: 0px;
            border: none;
            font-size: 13px;
            box-shadow: 0 1px 3px 0 rgba(52, 63, 75, 0.16);
            color: #969faa;
          }
          // 单选框
          .el-radio-group {
            display: flex;
            .el-radio {
              flex: 1;
              display: inline-block;
            }
          }
          // 顾客标签
          .customerLabel {
            .el-select {
              width: 100%;
            }
          }
        }
      }
    }
    .aside-footer {
      font-size: 14px;
      text-align: center;
      width: 100%;
      background-color: #fff;
      color: #009de7;
      line-height: 50px;
      cursor: pointer;
      box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.06);
      //   border-top: 1px solid rgba(0, 0, 0, 0.07);
    }
  }
}
</style>
<style>
.search-history .el-tag.el-tag--info{
	display: inline-flex !important;
}
.search-history .el-tag.el-tag--info .el-select__tags-text{
	flex: 1 !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important;
}
.search-history .el-tag.el-tag--info .el-tag__close{
	top: 5px !important;
}
.search-history .el-cascader__tags .el-tag.el-tag--info .el-tag__close{
	top: 0 !important;
}
.search-history .el-tag, .el-cascader__tags .el-tag{
	max-width: 180px !important;
	overflow: hidden !important;
	text-overflow: ellipsis !important;
}
.search-history .el-cascader__tags .el-tag{
	margin: 6px 0 2px 6px !important;
}
</style>
