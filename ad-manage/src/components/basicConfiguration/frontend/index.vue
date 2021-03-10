<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="参数编码:">
            <el-input placeholder="请输入参数编码" clearable v-model="labelData.paramCode" type="text"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <!-- 按钮 -->
        <!-- <el-button type="primary" size="medium" @click='handleAdd'>新增</el-button> -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('frontConfig:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('frontConfig:updateConfig') > -1" size="medium" @click="handleEdit">修改</el-button>
        <!-- <el-button type="primary" size="medium" @click="handleDelete">删除</el-button> -->
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="deptTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" width="40" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(pagingDetails.pageNo - 1) * pagingDetails.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="paramCode" label="参数编码" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="paramName" label="参数名字" width="150" :resizable = "false"></el-table-column>
        <el-table-column prop="paramValue" label="参数值" width="300" :resizable = "false"></el-table-column>
        <el-table-column prop="description" label="描述"  width="250" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'common-web/frontConfig/updateStatus'" @result="getDeptData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最新更新时间" width="180" :resizable = "false"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100" :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagingDetails.pageNo"
          :page-sizes="pageSizes"
          :page-size="pagingDetails.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagingDetails.total"
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
import switchItem from '../../common/switchItem'
export default {
  name: 'frontend',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      labelData: {
        paramCode: '',
      },
      // 分页数据
      pagingDetails:{
        // 总条数
        total:0,
        pageNo:1,
        pageSize:10,
      },
      // 表格信息
      deptTableData: [],
      // 获取选中行
      selectEditRow:{},
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false,
      statusDisabled:true,
    }
  },
  components:{
    switchItem
  },
  created() {
    this.statusDisabled = this.$store.state.roleList.indexOf('frontConfig:updateStatus') == -1;
    const query = this.$route.query;
    this.pagingDetails.pageNo = Number(query.page)||1;
    this.pagingDetails.pageSize = Number(query.pageSize)||10;
    this.labelData.paramCode = query.paramCode;
    this.getDeptData();
  },
  methods: {
    // 获取列表数据
    getDeptData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.pagingDetails.pageNo = 1;
        query.page = 1;
      };
      query.paramCode = this.labelData.paramCode;
      this.$router.replace({query:query});
      this.$get("common-web/frontConfig/pageList",{
        paramCode:this.labelData.paramCode,
        pageNo:this.pagingDetails.pageNo,
        pageSize:this.pagingDetails.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.showAllData = true;
          res.data.rows.forEach(row=>{
            row.createTime = formatterDateTime(row.createTime);
            row.updateTime = formatterDateTime(row.updateTime);
            row.updateUser = row.updateUser||row.createUser;
            row.status === 100 ? row.status = true : row.status = false;
          })
          this.deptTableData = res.data.rows;
          this.pagingDetails.total = res.data.total;
          if(this.pagingDetails.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.pagingDetails.total>20){
              this.pageSizes=[10,20,50]
            }else{
              this.pageSizes=[10,20]
            }
          }
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        };
      });
    },
    // 改变页容量
    handleSizeChange(val) {
      this.pagingDetails.pageSize = val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.pageSize = val;
      this.$router.replace({query:query});
      this.getDeptData();
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.pagingDetails.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getDeptData();
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectEditRow = val
    },
    // 状态改变
    statechange(row){
      let status = row.status ? 100 : -100;;
      const data = {status:status,id:row.id}
      this.$post('common-web/frontConfig/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message({
            type: "success",
            message: res.message
          });
          this.getDeptData();
        }else{
          this.$message({
            type: "warning",
            message: res.message
          });
        }
      })
      
    },
    // 查询
    handleSearch() {
      this.getDeptData(1)
    },
    // 修改
    handleEdit(){
      // 判断对象是否为空
      let length = Object.keys(this.selectEditRow).length;
      if(length==0){
        return this.$message({
          showClose: true,
          message: '请选择要修改的数据',
          type: 'warning'
        });
      }else if(length>1){
        return this.$message({
          showClose: true,
          message: '选择数据过多，当前仅支持修改单条数据',
          type: 'warning'
        });
      }else{
        // 注意修改数据，此处传递是数组
        this.$router.push({path:'/modules/basicConfiguration/frontendEdit.html',query:{...this.selectEditRow[0]}})
      }
    },
    // 删除
    handleDelete(){
       // 判断对象是否为空
      if(Object.keys(this.selectEditRow).length==0){
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
          let deleteArr = [];
          this.selectEditRow.forEach(item=>{
            deleteArr.push(item.id);
          });
          this.$post('common-web/frontConfig/deleteConfig',{ids: deleteArr.join(",")}).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getDeptData()
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
    }
  },

}
</script>
<style style="scss">
</style>

