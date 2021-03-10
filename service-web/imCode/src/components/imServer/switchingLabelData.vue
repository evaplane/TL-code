<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-09-16 18:31:51
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-09-20 17:35:27
 -->
<template>
     <div class="switchTable" :class="{quickSwitchTable:isShowQuickResponse}">
       <el-table
        :data="charTableData"
        border
        style="width: 100%">
        <el-table-column
          v-for="(item,index) in charCols"
          :key="index"
          :fixed="index==0?'left':false"
          :label="item.label"
          min-width="100" 
          >
          <template slot-scope="scope">
            <span :title="scope.row[item.prop]">{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
     </div>
</template>
<script>
export default {
  props:{
    charTableData:{
      required: false,
      type: Array,
      default: () => {
        return [];
      }
    },
    charCols:{
      required: false,
      type: Array,
      default: () => {
        return [];
      }
    },
    isShowQuickResponse:{
      required: false,
      type: Boolean,
      default: false
    }
  },
  watch:{
  },
  data() {
      return {
        tableData: [
          {
          date: '2016-05-02',
        }],
        cols: [
          {prop: 'date', label: '日期'},
        ]
      }
    },
    methods: {
      handleClick(row) {
        console.log(row);
      },
    },
}
</script>
<style scoped>
  .switchTable{
    padding:10px 0;
  }
 @media (max-width: 1100px) {
      .switchTable {
          width: 400px;
      }
      .quickSwitchTable{
        width: 200px;
      }
  }
  @media (max-width: 1199px) {
      .switchTable {
          width: 500px;
      }
      .quickSwitchTable{
        width: 300px;
      }
  }
  @media (min-width: 1200px) {
      .switchTable {
          width: 600px;
      }
      .quickSwitchTable{
        width: 400px;
      }
  }
  @media (min-width: 1340px) {
      .switchTable {
          width: 800px;
      }
      .quickSwitchTable{
        width: 600px;
      }
  }
  @media (min-width: 1600px) {
      .switchTable {
          width: 1000px;
      }
      .quickSwitchTable{
        width: 800px;
      }
  }
  @media (min-width: 1700px) {
      .switchTable {
          width: 1240px;
      }
      .quickSwitchTable{
        width: 1040px;
      }
  }
</style>