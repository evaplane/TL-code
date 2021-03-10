<template>
  <div class='menu'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:menu:save') > -1" size="medium"  @click="handleAdd">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:menu:update') > -1" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:menu:delete') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="menuTable" border :data="menuTableData" highlight-current-row tooltip-effect="dark" style="width: 100%" @selection-change="handleCurrentChange" row-key="menuId" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
        <el-table-column prop="menuId" label="菜单ID" width="100" :resizable = "false"></el-table-column>
        <el-table-column prop="name" label="菜单名称" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="parentName" label="上级菜单" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="icon" label="图标" width="150" :resizable = "false">
             <template slot-scope="scope">
                <i :class='scope.row.icon'></i>
            </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="150" :resizable = "false">
            <template slot-scope="scope">
                <el-tag :type="scope.row.type|getMenuType">{{scope.row.type|getMenuTypeName}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序号" width="150" :resizable = "false"></el-table-column>
        <el-table-column prop="url" label="菜单URL" width="300" :resizable = "false"></el-table-column>
        <el-table-column prop="perms" label="授权标识" show-overflow-tooltip :resizable = "false"></el-table-column>
      </el-table>
    </div>
  </div>
  <div v-if="showErrorDom" style="text-align:center;line-height:400px;">
      {{showErrorDom}}
    </div>
  </div>
</template>

<script>
import {menuTree} from '../../../js/util'
import { log } from 'util';
export default {
  name: 'menus',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 表格信息
      menuTableData: [],
      // 获取选中行
      selectMenuRow:[],
    }
  },
  filters:{
      getMenuType(type){
        const typeList = {
          0:"primary",
          1:"success",
          2:"warning"
        }
        return typeList[type]
      },
      getMenuTypeName(type){
        const typeNameList = {  
          0:"目录",
          1:"菜单",
          2:"按钮"
        }
        return typeNameList[type]
      }
  },
  created() {
    this.getMenuData();
  },
  methods: {
    // 获取用户
    getMenuData(type) {
      this.$get('auth-web/sys/menu/list').then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          this.menuTableData = menuTree(res.data)
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        };
      })
    },
    // 新增操作
    handleAdd(){
        this.$router.push('/modules/sys/menuAdd.html')
    },
    // 修改
    handleEdit(){
      // 判断对象是否为空
      if(this.selectMenuRow.length==0){
        this.$message({
          showClose: true,
          message: '请选择需要修改的数据',
          type: 'warning'
        });
        return
      }else if(this.selectMenuRow.length>1){
        this.$message({
          showClose: true,
          message: '选择数据过多,当前仅支持单条数据修改',
          type: 'warning'
        });
        return
      }else{
        this.$router.push({path:'/modules/sys/menuEdit.html',query:{id:this.selectMenuRow[0].menuId}})
      }
    },
    // 获取选中行的数据
    handleCurrentChange(val){
      this.selectMenuRow = val
    },
    // 删除
    handleDelete(){
       // 判断对象是否为空
      if(this.selectMenuRow.length==0){
        this.$message({
          showClose: true,
          message: '请选择需要删除的数据',
          type: 'warning'
        });
        return
      }else if(this.selectMenuRow.length>1){
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
           this.$post('auth-web/sys/menu/delete',{menuId:this.selectMenuRow[0].menuId}).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getMenuData()
              this.$get('auth-web/sys/menu/nav').then(res=>{
                this.$store.commit('changeMenuList',res.data)
              })
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
.menu .el-table__row--level-0 .el-icon-arrow-right{
  font-weight: 900;
}
.menu .el-table__row--level-1 .el-icon-arrow-right{
  font-weight: 500;
}
</style>

