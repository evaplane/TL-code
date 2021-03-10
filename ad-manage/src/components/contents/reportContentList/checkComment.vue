<template>
  <div class='user'>
     <!-- 内容 -->
    <div class="content" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;padding-left:10px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>评论</div></el-col>
        </el-row>
        <!-- 栅格 -->
        <el-row class='operation' style="margin-bottom:10px;">
          <!-- 输入框 -->
          <el-col :span="5">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="评论人ID:">
                <el-input placeholder="请输入评论人ID" v-model="userData.userId"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <!-- 按钮 -->
            <el-button type="primary" size="medium"  @click='handleSearch'>查询</el-button>
            <el-button type="primary" size="medium"  @click='handleDelete'>删除</el-button>
          </el-col>
        </el-row>
        <!-- 内容 -->
        <div class='content'>
            <!-- 表格 -->
          <el-table ref="multipleTable" border :data="gatherUserDetailTableData" tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="80"></el-table-column>
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="userId" label="评论人ID" width="100"></el-table-column>
            <el-table-column prop="authorId" label="被评论人ID" width="100"></el-table-column>
            <el-table-column prop="username" label="评论关系" width="100"></el-table-column>
            <el-table-column prop="content" label="评论内容" width="200"></el-table-column>
            <el-table-column prop="praiseCount" label="评论点赞量" width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="评论时间" width="200"></el-table-column>
            <el-table-column prop="updateTime" label="最近更新时间" width="200"></el-table-column>
            <el-table-column prop="userName" label="操作员" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="userData.pagenum"
              :page-sizes="[10, 20, 50]"
              :page-size="userData.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div> 
        </div>
          <el-row>
            <el-col :span="8"><div class="grid-content"></div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button plain @click="backToGatherUser">返回</el-button>
            </div></el-col>
          </el-row>
    </div>
  </div>
</template>

<script>
import {formatterDateTime,delSelectTag} from '../../../js/util'
export default {
  name: 'checkComment',
  data() {
    return {
      // 搜索框
      userData: {
        userId:'',
        contentId:''
      },
      // 表格信息
      gatherUserDetailTableData: [],
      // 获取选中行
      selectRows:[],
      // 总条数
      total:0,
    }
  },
  created() {
    this.userData.contentId = this.$route.query.content;
    this.userData.userId = this.$route.query.userId;
    this.getUserData();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.userData.pageSize = val
        this.getUserData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.userData.pageNo= val;
      this.getUserData()
    },
    // 获取用户
    getUserData() {
      console.log(this.userData)
      this.$get('content-web/comment/pageList', this.userData).then(res => {
        if (res.code == '000000') {
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
          })
          this.gatherUserDetailTableData = res.data.rows
          this.total = Number(res.data.total)
        }
      })
    },
    // 查询
    handleSearch() {
      this.getUserData()
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 返回首页
    backToGatherUser(){
      delSelectTag(this.$route)
      this.$router.history.go(-1);
    },
    // 删除
    handleDelete(){
      console.log(this.selectRows)
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
          this.$post(`content-web/comment/delete`,{ids:ids.join(",")}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getUserData()
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
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 150px;
}
.el-date-editor .el-input__inner{
  width: 150px;
}
</style>

