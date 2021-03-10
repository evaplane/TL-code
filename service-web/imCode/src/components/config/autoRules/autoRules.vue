<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-08-14 11:09:58
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-08-15 17:27:02
 -->

<template>
  <!-- 顾客标签 -->
  <div class="main">
    <div class="main-conter">
      <div class="main-block">
        <div class="main-blockInner">
          <h3>自动规则设置</h3>
          <p class="main-sub">根据设置好的条件，自动出发如分配处理人，抄送，通知等工单操作。</p>
          <div>
            <button class="main-btn" @click="addRule">添加自动规则</button>
          </div>
        </div>
      </div>
      <div class="main-block">
        <div class="main-table">
          <div class="item clearfix" v-for="(item,index) in autoRuleList" :key="index">
            <i class="el-icon-share"></i>
            <span class="tip1">{{item.className}}</span>
            <span class="tip2">类工单分配给</span>
            <span class="tip3">{{item.processTeamName}}</span>
            <span class="tip4">抄送给</span>
            <span class="tip5">{{item.ccTeamName}}</span>
            <span class="operation">
              <span class="el-icon-edit tip6">
                <a @click="editRule(item)">修改</a>
              </span>
              <span class="el-icon-delete tip7">
                <a @click="delRuleById(item)">删除规则</a>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <addAutoRules @closeMain="closeMain" :show="autoRulesVisible" :ruleItem="ruleItem" :type="type"></addAutoRules>
  </div>
</template>
<script>
import addAutoRules from "./addAutoRules.vue";

export default {
  data() {
    return {
      autoRulesVisible: false, //是否显示新增弹框
      autoRuleList: [],
      visible: false,
      ruleItem: {},
      type: 0
    };
  },
  components: {
    addAutoRules
  },
  methods: {
    // 新增工单规则
    addRule() {
      this.autoRulesVisible = !this.autoRulesVisible;
      this.type = 0;
    },
    closeMain() {
      this.autoRulesVisible = false;
      this.getAutoRule();
    },
    // 编辑工单规则
    editRule(item) {
      this.ruleItem = item;
      this.type = 1;
      this.autoRulesVisible = true;
    },
    // 删除自动规则
    delRuleById(item) {
      let that = this;
      this.$axios
        .delete(this.$httpServer.delRuleById + "/" + item.id)
        .then(res => {
          if (res && res.data.data) {
            this.$message({
              type: "success",
              message: "删除成功",
              showClose: true
            });
            that.getAutoRule();
          }
        });
    },
    // 获取所有的自动规则
    getAutoRule() {
      this.$axios.get(this.$httpServer.getAutoRule).then(res => {
        if (res && res.data.data) {
          this.autoRuleList = res.data.data;
        }
      });
    }
  },
  mounted() {
    this.getAutoRule();
  }
};
</script>
<style lang="less" scoped>
@import "../../../common/css/base.less";
.main {
  .main-conter {
    width: 680px;
    .main-block {
      height: 100%;
      margin-bottom: 20px;
      background-color: #fff;
      box-shadow: 0 1px 3px rgba(52, 63, 75, 0.1);
      .main-table {
        text-align: left;
        // padding: 20px 30px;
        display: block;
        position: relative;
        .item {
          box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.04);
          padding: 0 30px;
          height: 50px;
          line-height: 50px;
          cursor: pointer;
          &:hover{
            background-color: #f5fbfe;
          }
          .el-icon-share {
            margin-right: 10px;
            color: rgb(0, 160, 233);
            font-size: 20px;
            vertical-align: middle;
          }
          span {
            margin-left: 10px;
            color: rgb(118, 125, 133);
          }
          .tip1 {
            color: rgb(0, 160, 233);
          }
          .tip3 {
            color: rgb(48, 204, 128);
          }
          .tip5 {
            color: rgb(253, 181, 91);
          }
          .operation {
            position: absolute;
            display: inline-block;
            right: 10px;
            span {
              color: #009de7;
              cursor: pointer;
            }
          }
        }
      }
    }
    .main-blockInner {
      padding: 20px 30px;
      display: block;
      h3 {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-align: center;
        align-items: center;
        font-size: 14px;
        color: #323c42;
        font-weight: 400;
        margin-top: 0;
        margin-bottom: 13px;
      }
      .main-sub {
        font-size: 14px;
        color: #969faa;
        margin-top: 0;
        margin-bottom: 15px;
      }
      .main-btn {
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
        background-color: #009de7;
      }
    }
  }
}
</style>
