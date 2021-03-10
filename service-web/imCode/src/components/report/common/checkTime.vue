<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-09-27 14:38:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-27 18:09:59
 -->
<template>
  <div class="volume">
    <el-popover
        placement="bottom"
        width="400"
        trigger="click"
        >
        <div class="volumeData">
          <div class="time">
            <el-button-group>
              <el-button :class="{active: num == 0}" @click="toDayData('0','今天')">今天</el-button>
              <!-- type="primary" -->
              <el-button :class="{active: num == 1}" @click="toDayData('1','昨天')">昨天</el-button>
              <el-button :class="{active: num == 8}" @click="toDayData('8','过去7天')">过去7天</el-button>
              <el-button :class="{active: num == 31}" @click="toDayData('31','过去30天')">过去30天</el-button>
            </el-button-group>
          </div>
          <div class="searchData">
            <el-date-picker
              v-model="dataValue"
              type="daterange"
              @change="checkSearchData"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
      <el-button slot="reference">{{timeValue}}</el-button>
    </el-popover>
  </div>
</template>
<script>
export default {
  data(){
    return{
      num:-1,
      dataValue:[],
      timeValue:'今天',
    }
  },
  methods:{
    toDayData(n,v){
      let that = this;
      that.timeValue = v;
      that.num = n;
      that.dataValue = [];
      let beginDate = this.$ak.Utils.getNowFormatDateYMD(n);
      let endData = this.$ak.Utils.getNowFormatDateEndYMD(n - 1 >= 0 ? 1 : 0);
      that.dataValue.push(beginDate);
      that.dataValue.push(endData);
      this.$emit("checkData",this.dataValue)
    },
    // 选择时间
    checkSearchData(){
      this.$emit("checkData",this.dataValue)
    },
    // 选择分组
    changGrouping(id){

    }
  },
  mounted(){
  },
}
</script>
<style scoped>
.volume{
  display: inline-block;
}
.volumeData > .time,.volumeData>.searchData {
    width: 100%;
    display: flex;
    justify-content: center;
        padding-top: 10px;
}
.volumeData > .time > .el-button-group > .el-button:hover,
.volumeData > .time > .el-button-group > .el-button.active{
  background-color: #009de7;
  color: #fff;
}
.volumeData > .time > .el-button-group > .el-button {
  color: #009de7;
  padding: 8px 15px !important;
  border: 1px solid #009de7 !important;
}
.volumeData{
    height: 120px;
    background-color: #fff;
}
</style>