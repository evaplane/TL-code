<!--
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-31 16:48:38
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-10 17:01:03
 -->
<template>
  <div class="imCustomerlabel">
    <el-row class="child" :gutter="20">
      <el-col class="title-left" :span="4">
        <span class="lable">姓名</span>
        <span
          class="title-right"
          :title="visitorInformationData.clientName"
          @click="clickFun('clientName')"
        >
          <editDiv
            ref="clientName"
            v-model="visitorInformationData.clientName"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'clientName'"
            :valueData="visitorInformationData.clientName == null?'':visitorInformationData.clientName"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">年龄</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerAge"
          @click="clickFun('customerAge')"
        >
          <editDiv
            ref="customerAge"
            v-model="visitorInformationData.customerAge"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerAge'"
            :valueData="visitorInformationData.customerAge == null?'':visitorInformationData.customerAge"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">性别</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerGender"
          @click="clickFun('customerGender')"
        >
          <editDiv
            ref="customerGender"
            v-model="visitorInformationData.customerGender"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerGender'"
            :valueData="visitorInformationData.customerGender == null?'':visitorInformationData.customerGender"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">电话</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerPhone"
          @click="clickFun('customerPhone')"
        >
          <editDiv
            ref="customerPhone"
            v-model="visitorInformationData.customerPhone"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerPhone'"
            :valueData="visitorInformationData.customerPhone == null?'':visitorInformationData.customerPhone"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">QQ</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerQq"
          @click="clickFun('customerQq')"
        >
          <editDiv
            ref="customerQq"
            v-model="visitorInformationData.customerQq"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerQq'"
            :valueData="visitorInformationData.customerQq == null?'':visitorInformationData.customerQq"
          ></editDiv>
        </span>
      </el-col>
    </el-row>
    <el-row class="child" :gutter="20">
      <el-col class="title-left" :span="4">
        <span class="lable">微信</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerWx"
          @click="clickFun('customerWx')"
        >
          <editDiv
            ref="customerWx"
            v-model="visitorInformationData.customerWx"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerWx'"
            :valueData="visitorInformationData.customerWx == null?'':visitorInformationData.customerWx"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">地址</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerAddress"
          @click="clickFun('customerAddress')"
        >
          <editDiv
            ref="customerAddress"
            v-model="visitorInformationData.customerAddress"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerAddress'"
            :valueData="visitorInformationData.customerAddress== null?'':visitorInformationData.customerAddress"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">邮箱</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerEmail"
          @click="clickFun('customerEmail')"
        >
          <editDiv
            ref="customerEmail"
            v-model="visitorInformationData.customerEmail"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerEmail'"
            :valueData="visitorInformationData.customerEmail== null?'':visitorInformationData.customerEmail"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">备注</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerRemark"
          @click="clickFun('customerRemark')"
        >
          <editDiv
            ref="customerRemark"
            v-model="visitorInformationData.customerRemark"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerRemark'"
            :valueData="visitorInformationData.customerRemark== null?'':visitorInformationData.customerRemark"
          ></editDiv>
        </span>
      </el-col>
      <el-col class="title-left" :span="4">
        <span class="lable">联系人</span>
        <span
          class="title-right"
          :title="visitorInformationData.customerLinkman"
          @click="clickFun('customerLinkman')"
        >
          <editDiv
            ref="customerLinkman"
            v-model="visitorInformationData.customerLinkman"
            @loadingVisitorInformation="loadingVisitorInformation"
            :visitorInformationData="visitorInformationData"
            :valueDataString="'customerLinkman'"
            :valueData="visitorInformationData.customerLinkman== null?'':visitorInformationData.customerLinkman"
          ></editDiv>
        </span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import editDiv from "./innerHtml";
export default {
  components: {
    editDiv
  },
  props: {
    visitorInformationData: {
      required: true,
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  methods: {
    // 兼容火狐,空div点击失效
    clickFun(refName) {
      this.$refs[refName].$refs.innerHtml.focus();
    },
    loadingVisitorInformation() {
      this.$parent.loadingVisitorInformation();
    }
  }
};
</script>
<style scoped>
.imCustomerlabel {
  width: 100%;
}
.imCustomerlabel > .child {
  padding-left: 16px;
  color: #161e26;
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  margin-bottom: 6px;
  width: 100%;
}
.imCustomerlabel > .child .title-left .lable {
  float: left;
  display: inline-block;
  width: 46px;
  color: #767d85;
}
.imCustomerlabel > .child .title-right {
  line-height: 24px;
  min-height: 24px;
  cursor: pointer;
  transition: background 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
  width: calc(100% - 50px);
}
.imCustomerlabel > .child .title-right:hover {
  background: #fdf7d7;
}
</style>
