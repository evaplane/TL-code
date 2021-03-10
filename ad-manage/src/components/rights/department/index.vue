<template>
  <div class='department'>
    <!-- 栅格 -->
    <el-row class='operation' style="padding:20px;">
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" size="medium"  @click="handleAdd">新增</el-button>
        <el-button type="primary"  size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary"  size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="deptTable" border :data="deptTableData" highlight-current-row tooltip-effect="dark" style="width: 100%" @selection-change="handleCurrentChange" row-key="deptId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="selection" width="50" :resizable = "false"></el-table-column>
        <el-table-column prop="deptId" label="部门ID" width="400" :resizable = "false"></el-table-column>
        <el-table-column prop="name" label="部门名称" width="400" :resizable = "false"></el-table-column>
        <el-table-column prop="parentName" label="上级部门" width="400" :resizable = "false"></el-table-column>
        <el-table-column prop="orderNum" label="排序号" :resizable = "false"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {tree} from '../../../js/util'
export default {
  name: 'dept',
  data() {
    return {
      // 表格信息
      deptTableData: [],
      // 获取选中行
      selectEditRow:[],
    }
  },
  created() {
    this.getDeptData();
  },
  methods: {
    // 获取用户
    getDeptData() {
      this.$get('auth-web/sys/dept/list').then(res => {
        if (res.code == '000000') {
            this.deptTableData = tree(res.data)
        }
      })
    },
    // 新增操作
    handleAdd(){
        this.$router.push('/modules/sys/deptAdd.html')
    },
    // 修改
    handleEdit(){
      // 判断对象是否为空
      if(this.selectEditRow.length==0){
        this.$message({
          showClose: true,
          message: '请选择要修改的数据',
          type: 'warning'
        });
        return
      }else if(this.selectEditRow.length>1){
        this.$message({
          showClose: true,
          message: '选择数据过多,当前仅支持单条数据修改',
          type: 'warning'
        });
        return
      }else{
        this.$router.push({path:'/modules/sys/deptEdit.html',query:{...this.selectEditRow[0]}})
      }
    },
    // 获取选中行的数据
    handleCurrentChange(val){
      this.selectEditRow = val
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
      }else if(this.selectEditRow.length>1){
        this.$message({
          showClose: true,
          message: '选择数据过多,当前仅支持单条数据删除',
          type: 'warning'
        });
        return
      }else{
         this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          this.$post('auth-web/sys/dept/delete',{deptId:this.selectEditRow[0].deptId}).then(res=>{
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
.department .el-table__row--level-0 .el-icon-arrow-right{
  font-weight: 900;
}
.department .el-table__row--level-1 .el-icon-arrow-right{
  font-weight: 700;
}
</style>

