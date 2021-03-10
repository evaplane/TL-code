<!--
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-10-15 14:26:47
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-17 21:57:32
 -->
<template>
  <div class="config">
    <div class="visitor-visitor">
      <div class="header">
        <div class="title" v-if="!$route.meta.back">设置</div>
        <router-link :to="$route.meta.back" v-else>
          <span class="el-icon-arrow-left"></span>
          <span>{{$route.meta.title}}</span>
        </router-link>
      </div>
      <div class="body">
        <div class="exportDescription">
          <h4>导出说明</h4>
          <ul>
            <li>任务列表并非实时更新,请点击刷新按钮刷新数据</li>
          </ul>
          <el-button @click="downloadList">刷新</el-button>
        </div>
        <div class="exportTable">
          <el-table 
            :data="expTableData"
            height="100%"
            width="100%">
           <el-table-column label="名称"  min-width="15%">
            <template >
              <span>历史对话导出</span>
            </template>
          </el-table-column>
            <el-table-column
                prop="dataStartTime"
                label="数据开始时间"
                min-width="15%">
            </el-table-column>
            <el-table-column
                prop="dataEndTime"
                label="数据结束时间"
                min-width="15%">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="任务创建时间"
                min-width="15%">
            </el-table-column>
            <el-table-column
                prop="exportStatus"
                label="状态"
                min-width="15%">
                <template slot-scope="scope">
                  <span>{{scope.row.exportStatus == 1?'导出成功':'导出失败'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作"  min-width="15%">
            <template slot-scope="scope">
              <a target="_blank" :href="scope.row.fileUrl" >下载</a>
            </template>
          </el-table-column>
          </el-table>
          <div class="history-footer" v-show="listQuery.total>0">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.current"
            :page-sizes="[10, 20, 30]"
            :page-size="listQuery.size"
            layout="total, sizes, prev, pager, next"
            :total="listQuery.total">
          </el-pagination>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "../common/Pagination/index";
export default {
  data(){
    return{
      expTableData:[],
      total:0,
      listQuery: {
        page: 1, // 总页数
        limit: 10, //每页显示数
        size:10, // 每页显示条数
        total:0, // 总条数
        current:1 , //当前页
      },
    }
  },
  components: {
    Pagination,
  },
  methods:{
    // 更改每页最大数
    handleSizeChange(val){
      this.listQuery.size = val;
      this.listQuery.current = 1;
      this.downloadList();
    },
    // 切换分页
    handleCurrentChange(val){
      this.listQuery.current = val;
      this.downloadList();
    },
    downloadList(){
      // let opt = {
      //   size:this.listQuery.limit,
      //   current:this.listQuery.current
      // };
      this.expTableData = [];
      this.$axios.get(this.$httpServer.getConversationPage+'?size='+this.listQuery.size+'&current='+this.listQuery.current).then((res)=>{
        this.listQuery.total = res.data.data.total; //总条数
        this.listQuery.page = res.data.data.pages; // 总页数
        this.expTableData = res.data.data.records;
      })
    }
  },
  mounted(){
    this.downloadList();
  },
};
</script>


<style lang="less" scoped>
@import "../../common/css/base.less";

.config {
  width: calc(~'100% - 70px' );
  height: 100%;
  margin-left: 70px;
  background-color: #f2f3f5;
  overflow-y: auto;
  overflow-x: hidden;
  .visitor-visitor {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .header {
      line-height: 60px;
      width: 100%;
      background-color: #fff;
      border-bottom: 1px solid #e0e1e3;
      font-size: 16px;
      color: #323c42;
      padding-left: 30px;
      display: flex;
    }
    .body {
      padding: 30px 90px 30px 20px;
      display: flex;
      flex: 1;
      flex-direction: column;
      overflow-y: auto;
      .exportDescription{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        background-color: #fff;
        max-height: 100%;
        -ms-flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        padding: 20px;
        h4{
          display: block;
          -webkit-margin-before: 1.33em;
          margin-block-start: 1.33em;
          -webkit-margin-after: 1.33em;
          margin-block-end: 1.33em;
          -webkit-margin-start: 0px;
          margin-inline-start: 0px;
          -webkit-margin-end: 0px;
          margin-inline-end: 0px;
          margin-top: 0;
          font-size: 16px;
          font-family: inherit;
          font-weight: 500;
          color: inherit;
        }
        ul{
          margin-left: 18px;
          font-size: 14px;
          margin-bottom: 18px;
        }
        ul li{
          list-style-type: disc;
        }
        .el-button {
            width: 80px;
            padding: 10px 10px;
            color: #009de7;
            border-color: #009de7;
        }
      }
      .exportTable{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        background-color: #fff;
        max-height: 100%;
        -ms-flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        padding: 20px;
        margin-top: 20px;
        flex: 1;
        font-size: 14px;
        .el-table{
          margin-bottom: 28px;
        }
      }
    }
  }
}
a span {
  font-size: 18px;
  vertical-align: middle;
}
.history-footer {
      position: absolute;
      bottom: 0;
      right: 120px;
      background-color: #fff;
      margin-bottom: 50px;
      /deep/ .el-input__inner {
        border: none;
      }
    }
</style>

