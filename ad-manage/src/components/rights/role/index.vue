<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="角色名称:">
            <el-input placeholder="请输入角色名称" v-model="roleData.roleName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:role:list') > -1" size="medium"  @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:role:save') > -1" size="medium"  @click="handleAdd">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:role:update') > -1"  size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:role:delete') > -1"  size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="roleTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"  min-width="10%" :resizable = "false"></el-table-column>
        <el-table-column type="index" label="角色ID" width="80" :resizable = "false"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200" :resizable = "false"></el-table-column>
        <!-- <el-table-column prop="deptName" label="所属部门" width="300" :resizable = "false"></el-table-column> -->
        <el-table-column prop="remark" label="备注" width="500" :resizable = "false"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="250" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="250" :resizable = "false"></el-table-column>
        <el-table-column prop="updateName" label="操作员" show-overflow-tooltip :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="roleData.pageNo"
          :page-sizes="pageSizes"
          :page-size="roleData.pageSize"
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
  name: 'role',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      roleData: {
        roleName: '',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      roleTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false
    }
  },
  created() {
    const query = this.$route.query;
    this.roleData.pageNo = Number(query.page)||1;
    this.roleData.pageSize = Number(query.pageSize)||10;
    this.roleData.roleName = query.roleName;
    this.getroleData();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.roleData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getroleData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.roleData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getroleData()
    },
    // 获取用户
    getroleData(type) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(type){
        this.roleData.pageNo = 1;
        query.page = 1;
      };
      query.roleName = this.roleData.roleName;
      this.$router.replace({query:query});
      this.$get('auth-web/sys/role/list', this.roleData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime);
            v.updateTime = formatterDateTime(v.updateTime);
            v.updateName = v.updateName||v.createName;
          })
          this.roleTableData = res.data.rows
          this.total = res.data.total
          if(this.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.total>20){
              this.pageSizes=[10,20,50]
            }else{
              this.pageSizes=[10,20]
            }
          }
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        };
      })
    },
    // 查询
    handleSearch() {
      this.getroleData(1)
    },
    // 新增操作
    handleAdd(){
        this.$router.push('/modules/sys/roleAdd.html')
    },
    // 修改
    handleEdit(){
      if(this.selectRows.length==0){
        this.$message({
          showClose: true,
          message: '请选择需要修改的数据',
          type: 'warning'
        });
        return
      }else if(this.selectRows.length>1){
        this.$message({
          showClose: true,
          message: '选择数据过多,当前仅支持单条数据修改',
          type: 'warning'
        });
        return
      }else{
        this.$router.push({path:'/modules/sys/roleEdit.html',query:{id:this.selectRows[0].roleId}})
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
          message: '请选择需要删除的数据',
          type: 'warning'
        });
        return
      }else{
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let roleIds =[];
          this.selectRows.forEach(v=>{
            roleIds.push(v.roleId)
          })
          this.$post(`auth-web/sys/role/delete`,roleIds).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.roleData.pageNo == Math.max(1, Math.ceil(this.total / this.roleData.pageSize))&&this.selectRows.length==this.roleTableData.length){
                this.roleData.pageNo = 1;
              };
              this.getroleData()
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
.distpicker-address-wrapper select {
  height: 35px;
  font-size: 14px;
}
.phoneSelect .el-input__inner {
  width: 65px;
  padding: 15px;
  font-size: 12px;
}
.phoneSelect .el-input__suffix {
  right: 0;
}
.phoneSelect .el-select__caret {
  font-size: 12px;
}
</style>

