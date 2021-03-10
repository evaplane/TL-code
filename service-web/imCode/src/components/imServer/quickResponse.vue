<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-16 11:12:33
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-29 15:17:07
 -->
<template>
  <!-- 快捷回复 -->
  <div class="quick-reply-panel imRecord-wrapper">
    <div class="quick-reply-panel-header">
      <div class="config">
        <router-link tag="li" to="/config/fasterply">
          <span class="iconfont-main el-icon-s-tools"></span>
          快捷回复
        </router-link>
      </div>
      <div class="close" @click="close()">
        <i class="iconfont-main icon-noNeedealWith"></i>
      </div>
    </div>
    <ul>
      <li>
        <el-collapse v-model="activeNames" @change="handleChange('2')" class="imChat-header">
          <i class="chat_jiao" :class="{changChatClass:changChat}"></i>
          <el-collapse-item title="我的快捷回复" name="2">
            <div class="quick-reply-panel-conter">
              <el-tree :data="personalData" :props="defaultProps" @node-click="handleNodeClick">
                <span slot-scope="{ node }">
                  <span v-if="node.data.children.length != 0" slot="reference">{{node.label}}</span>
                  <span v-else>
                    <el-tooltip v-if="node.data.value != ''" class="item" effect="dark" popper-class="dialogPopover" placement="left" :open-delay="300">
                      <div slot="content">{{node.data.value}}</div>
                      <span >{{node.label}}</span>
                    </el-tooltip>
                    <span v-else class="quick-reply">{{node.label}}</span>
                  </span>
                </span>
              </el-tree>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="activeNames" @change="handleChange('1')" class="imChat-header">
          <i class="chat_jiao" :class="{changChatClass:changWorkedTogether}"></i>
          <el-collapse-item title="组内回复" name="1">
            <div class="quick-reply-panel-conter">
              <el-tree :data="groupData" :props="defaultProps" @node-click="handleNodeClick">
                <span class="custom-tree-node" slot-scope="{ node }">
                  <span v-if="node.data.children.length != 0" slot="reference">{{node.label}}</span>
                  <span v-else>
                    <el-tooltip v-if="node.data.value != ''" class="item" effect="dark" popper-class="dialogPopover" placement="left" :open-delay="300">
                      <div slot="content">{{node.data.value}}</div>
                      <span >{{node.label}}</span>
                    </el-tooltip>
                    <span v-else class="quick-reply">{{node.label}}</span>
                  </span>
                  
                </span>
              </el-tree>
            </div>
          </el-collapse-item>
        </el-collapse>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      changChat: true,
      changWorkedTogether: true,
      activeNames: [2, 1],
      defaultProps: {
        children: "children",
        label: "label"
      }, //设置树形结构字段
      personalData: [], //个人快捷回复
      groupData: [], //组内快捷回复
      ruleInfoData: {} //引入规则
    };
  },
  mounted() {},
  methods: {
    hoverValue(node){
    },
    /**
     * 加载数据
     */
    loadingData(v) {
      this.$axios
        .get(this.$httpServer.fastReplyType + "?fastReplyType=" + v)
        .then(res => {
          let newData = res.data.data.fastReplyGroupConfigs;
          this.ruleInfoData = res.data.data.ruleInfo;
          let treeData = [];
          for (let i = 0; i < newData.length; i++) {
            let data = {
              label: newData[i].groupName,
              value: newData[i].groupName,
              whereToSend: false,
              children: []
            };
            for (let j = 0; j < newData[i].fastReplyConfigs.length; j++) {
              data.children.push({
                label: newData[i].fastReplyConfigs[j].fastReplyTitle,
                value: newData[i].fastReplyConfigs[j].fastReplyContent,
                whereToSend: true,
                children: []
              });
            }
            if(data.children.length == 0){
              data.children.push({
                label: '无快捷回复',
                value: '',
                whereToSend: true,
                children: []
              });
            }
            treeData.push(data);
          }
          if (v == 1) {
            this.groupData = treeData;
          } else {
            this.personalData = treeData;
          }
        });
        
    },
    handleChange(v) {
      if (v == 2) {
        this.changChat = !this.changChat;
        if (this.personalData.length == 0) {
          this.loadingData(v);
        }
      } else if (v == 1) {
        this.changWorkedTogether = !this.changWorkedTogether;
        if (this.groupData.length == 0) {
          this.loadingData(v);
        }
      }
    },
    /**
     * 关闭快捷回复
     */
    close() {
      this.$emit("showQuickResponseFun", "");
    },
    /**
     * 选择快捷回复
     */
    handleNodeClick(data) {
      // 覆盖引用
      if(data.value == ''){
        return
      }
      if (data.whereToSend) {
        if (this.ruleInfoData && this.ruleInfoData.refRuleType == 2) {
          document.getElementById("common_chat_input").innerHTML = data.value;
          this.$parent.$refs.common_chat.chatInfoEn.inputContent = data.value; // 输入框值
          // this.$emit("sendMsgServer", {
          //   type: "sys",
          //   contentType: 0,
          //   time: this.$ak.Utils.getNowFormatDate(),
          //   center: data.value
          // });
        } else {
          // 叠加引用
          let divData = document.getElementById("common_chat_input").innerHTML;
          if(divData.length + data.value.length > 500){
            this.$message1({
            showClose: true,
              message: "输入框内容不能大于500个字符",
              type: "error"
            });
            return;
          }
          document.getElementById("common_chat_input").innerHTML = divData + " " + data.value;
          this.$store.imServerStore.state.selectedChatEn.inputContent =
            divData + " " + data.value;
        }
      }
      this.$ak.Utils.positioningCursor('common_chat_input'); 
    }
  }
};
</script>
<style scoped>
.quick-reply-panel {
  min-width: 200px;
  max-width: 200px;
  background-color: #fff;
  margin: 0;
  height: 100%;
  display: -ms-flexbox;
  display: flex;
  padding: 0;
  box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  -ms-flex-direction: column;
  flex-direction: column;
  float: left;
}
.quick-reply-panel-header {
  height: 44px;
  padding: 0px 20px;
  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.01), 0 1px 0 0 rgba(0, 0, 0, 0.06);
  -ms-flex-pack: justify;
  justify-content: space-between;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
}
.quick-reply-panel-header .config {
  margin: 0;
  padding: 0;
  font-size: 13px;
  color: #5a6978;
  display: inline-block;
  cursor: pointer;
}
.quick-reply-panel-header .close .iconfont-main {
  color: rgb(90, 105, 120);
  font-size: 12px;
  cursor: pointer;
}
.imChat-header {
  position: relative;
}
.imChat-header .chat_jiao {
  position: absolute;
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 2px;
  vertical-align: middle;
  border-top: 4px solid #767d85;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  transition: all 0.3s;
  top: 22px;
  left: 2px;
  transform: rotate(360deg);
}
.treeClass {
  display: inline-block;
  width: 140px;
}
.imChat-header .chat_jiao.changChatClass {
  transform: rotate(270deg);
}
.imChat-header .chat_jiao.changChatClass {
  transform: rotate(270deg);
}
.imRecord-wrapper > ul > li {
  height: auto !important;
}
.quickReply{
      color: #009de7;
}
</style>
