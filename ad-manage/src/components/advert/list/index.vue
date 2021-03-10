<template>
  <div class='advertList'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="广告分类名称: " prop="categoryCode">
            <el-select v-model="adListData.categoryValue" placeholder="全部" clearable>  
              <el-option v-for="(item,index) in adListData.categoryName" :key="index" :label="item.categoryName" :value="item.categoryCode"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtInfo:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtInfo:save') > -1" size="medium" @click="handleAdd">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtInfo:update') > -1" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtInfo:delete') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="adListTable" border :data="adListTableData" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange" @row-dblclick="handleView">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(adListData.pageNo - 1) * adListData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="广告分类名称" width="150" :resizable = "false"></el-table-column>
        <el-table-column prop="categoryValue" label="广告分类值" width="150" :resizable = "false"></el-table-column>
        <el-table-column prop="advtTypeName" label="广告类别名称" width="150" :resizable = "false"></el-table-column>
        <el-table-column prop="advtName" label="广告名称" show-overflow-tooltip :resizable = "false"></el-table-column>
        <!-- <el-table-column prop="sortNo" label="排序" width="80" :resizable = "false"></el-table-column> -->
        <el-table-column prop="status" label="状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :disabled="statusDisabled" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="pageViews" label="点击率" width="100" :resizable = "false"></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100" :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="adListData.pageNo"
          :page-sizes="pageSizes"
          :page-size="adListData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
  <div v-if="showErrorDom" style="text-align:center;line-height:400px;">
      {{showErrorDom}}
    </div>
  </div>
</template>
<script>
import {formatterDateTime} from '../../../js/util'
export default {
  name: 'adList',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      adListData: {
        categoryValue: '',
        categoryName:[],
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      adListTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:true,
      statusDisabled:true,
    }
  },
  created() {
     this.statusDisabled = this.$store.state.roleList.indexOf('advtInfo:update') == -1;
     const query = this.$route.query;
     this.adListData.pageNo = Number(query.page)||1;
     this.adListData.pageSize = Number(query.pageSize)||10;
     this.adListData.categoryValue = query.categoryValue;
    this.getadListData();
    this.getCategoryName();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.adListData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getadListData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.adListData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getadListData()
    },
    // 获取广告列表
    getadListData(type) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(type){
        this.adListData.pageNo = 1;
        query.page = 1;
      }
      query.categoryValue = this.adListData.categoryValue;
      this.$router.replace({query:query});
      let data ={
        categoryValue:this.adListData.categoryValue,
        pageNo:this.adListData.pageNo,
        pageSize:this.adListData.pageSize
      };
      this.$post('content-web/advtInfo/pageList',data).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateUser = v.updateUser||v.createUser
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
          })
          this.adListTableData = res.data.rows
          this.total = parseInt(res.data.total)
          if(this.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.total>20){
              this.pageSizes=[10,20,50]
            }else{
              this.pageSizes=[10,20]
            }
          };
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        }
      })
    },
    // 查询
    handleSearch() {
      this.getadListData(1)
    },
    handleAdd(){
        this.$router.push('/modules/advert/listAdd.html')
    },
    // 修改
    handleEdit(){
      if(this.selectRows.length==0){
        this.$message({
          showClose: true,
          message: '请选择要修改的数据',
          type: 'warning'
        });
        return
      }else if(this.selectRows.length>1){
        this.$message({
          showClose: true,
          message: '只能修改一个用户',
          type: 'warning'
        });
        return
      }else{
        this.$router.push({path:'/modules/advert/listEdit.html',query:{
          id:this.selectRows[0].id
        }});
      }
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 删除
    handleDelete(){
      if(this.selectRows.length==0){
        this.$message({
          showClose: true,
          message: '请选择要删除的数据',
          type: 'warning'
        });
        return
      }else{
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let ids =[];
          this.selectRows.forEach(v=>{
            ids.push(v.id)
          })
          ids = ids.join(',')
          this.$post(`content-web/advtInfo/delete`,{ids:ids}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.adListData.pageNo == Math.max(1, Math.ceil(this.total / this.adListData.pageSize))&&this.selectRows.length==this.adListTableData.length){
                this.adListData.pageNo = 1;
              };
              this.getadListData()
            }else{
              this.$message({
                type: 'warning',
                message: res.message
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    // 改变状态
    statechange(row){
      let status =100;
      if(row.status==true){
        status=100
      }else{
        status=-100
      }
      const data = {status:status,id:row.id}
      this.$post('content-web/advtInfo/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getadListData();
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    // 获取广告分类名称
    getCategoryName(){
      this.$get('content-web/advtCategory/categoryList').then(res=>{
          if(res.code=='000000'){
              this.adListData.categoryName = res.data
          }
      })
    },
    handleView(row) {
      this.$router.push({path:'/modules/advert/listview.html',query:{id:row.id}})
    },
  },
}
</script>
<style lang="scss">
.advertList{
  .detail .el-col-6{
    min-width: 0px;
  }
  .grid-content{
    text-align: left;
    padding-left:10px;
    display: flex;
    height: 100%;
    align-items: center;
    line-height: unset;
  }
  .detail-bg.grid-content{
    text-align: right;
    padding-right:10px;
    padding-left:0;
    justify-content: flex-end;
  }
  .opendialog{
    .el-row{
      min-width: 100% !important;
    }
    .el-col-6{
      min-width: unset !important;
    }
    .grid-content{
      height: 100%;
      line-height:20px;
      min-width: unset !important;
    }
    .imgbox{
      border-right:1px solid #ccc;
      text-align:left;
      line-height:10px;
      text-indent:unset;
      display: table;
      height: calc( 100% - 2px);
    }
    .videobox{
      border-right:1px solid #ccc;
      text-align:left;
      line-height:10px;
      height: 200px;
    }
  }
  .detailBottom .detail-bg{
    height: calc( 100% - 2px);
  }
} 
.showimgpic .el-carousel__container{
    height:500px;
  }
</style>

