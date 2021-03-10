<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-09-27 14:38:18
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-27 17:50:07
 -->
<template>
  <div class="volume">
    <el-dropdown>
      <el-button>
        {{totalGrouping.data}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(v,index) in totalGroupingData" :key="index" @click="changGrouping(v.id)">{{v.data}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data(){
    return{
      num:-1,
      dataValue:[],
      timeValue:'今天',
      totalGroupingData:[{data:'全部分组',id:1},{data:'13',id:1},{data:'13',id:1},{data:'13',id:1}],
      totalGrouping:{data:'全部分组',id:1}

    }
  },
  methods:{
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