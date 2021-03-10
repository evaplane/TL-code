<template>
  <div class='user'>
    <!-- 栅格 -->
    <div v-if="showAllData">
      <el-row class='operation' style="padding-bottom:20px;">
        <el-col :span="5">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="昵称:">
              <el-input placeholder="请输入昵称" v-model="nicknameData.nickName" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 输入框 -->
        <el-col :span="10">
          <!-- 按钮 -->
          <el-button type="primary" v-if="this.$store.state.roleList.indexOf('user:nicknamePageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
          <el-button type="primary" v-if="this.$store.state.roleList.indexOf('user:downNickNameTemp') > -1"  size="medium" @click="handleManage">下载模板</el-button>
          <!-- accept=".xlsx,.xls" -->
          <el-upload
            v-if="this.$store.state.roleList.indexOf('user:nickNameUpload') > -1"
            style="display:inline-block;margin-right:10px;margin-left:10px;"
            ref="upload"
            class="upload-demo" 
            :headers="headers"
            action="api/user-web/user/nickNameUpload/"
            :on-success="handleSuccess"
            :show-file-list="false"
            :before-upload = "beforeUploadFile">
            <el-button size="medium" type="primary">点击上传</el-button>
          </el-upload>
          <input v-show="false" id="excel" ref="picture" accept=".xls .xlsx" type="file" @change="upload($event)">
          <el-button type="primary" v-if="this.$store.state.roleList.indexOf('user:deleteNickName') > -1" size="medium" @click="handleDelete">删除</el-button>
        </el-col>
      </el-row>
      <!-- 内容 -->
      <div class='content'>
        <!-- 表格 -->
        <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
          <el-table-column type="index" label="序号" width="100" :resizable = "false">
            <template slot-scope="scope">
              <span>{{(nicknameData.pageNo - 1) * nicknameData.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="用户ID" width="400" :resizable = "false"></el-table-column>
          <el-table-column prop="nickName" label="昵称" width="400" :resizable = "false"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="400" :resizable = "false"></el-table-column>
          <el-table-column prop="createUser" label="操作员" show-overflow-tooltip :resizable = "false"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination
            v-show="showPage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="nicknameData.pageNo"
            :page-sizes="pageSizes"
            :page-size="nicknameData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
        <!-- 重置密码框 -->
        <el-dialog title="重置密码" :visible.sync="resetPasswordVisible">
          <el-form :model="resetPasswordForm" label-width="100px" style='margin-top:10px;' :rules="resetPasswordRules" ref="resetPasswordForm">
            <el-form-item label="用户名">
              <el-input v-model="resetPasswordForm.username" autocomplete="off" disabled placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="resetPasswordForm.newPassword" autocomplete="off" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newConfirmPassword">
              <el-input v-model="resetPasswordForm.newConfirmPassword" autocomplete="off" placeholder="确认密码"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetPasswordVisible = false">取 消</el-button>
            <el-button type="primary" @click="resetPasswordSubmit('resetPasswordForm')">确 定</el-button>
          </div>
        </el-dialog>
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
  name: 'nickname',
  data() {
     var validatorNewPassword = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请输入密码'));
         } else {
           var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,12}$/
           if (!reg.test(value)) {
             callback(new Error('只能输入6-12位数字、字母或者符号'));
           }
           callback();
         }
     };
     var validatorNewConfirmPassword = (rule, value, callback) => {
         if (value != this.resetPasswordForm.newPassword) {
           callback(new Error('确认密码要和密码相同'));
         } else {
           callback();
         }
     };
    return {
      // 搜索框
      nicknameData: {
        nickName:'',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      tableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 重置密码
      resetPasswordForm:{
        username:'',
        newPassword:'',
        newConfirmPassword:''
      },
      // 显示重置密码框
      resetPasswordVisible:false,
      // 重置密码规则
      resetPasswordRules:{
        newPassword: [
            {trigger: "blur",validator:validatorNewPassword}
        ],
        newConfirmPassword: [
            {trigger: "blur",validator:validatorNewConfirmPassword}
        ]
      },
      showAllData:false,
      showErrorDom:null,
      token:'',
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false
    }
  },
  computed: {
    headers () {
      return {
        'Authorization': this.token
      }
    }
  },
  created() {
    const query = this.$route.query;
    this.nicknameData.pageNo = Number(query.page)||1;
    this.nicknameData.pageSize = Number(query.pageSize)||10;
    this.nicknameData.nickName = query.nickName;
    this.getnicknameData()
    this.token = localStorage.getItem('token')
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.nicknameData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getnicknameData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.nicknameData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getnicknameData()
    },
    // 获取昵称
    getnicknameData(type) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(type){
        this.nicknameData.pageNo = 1
        query.page = 1;
      }
      query.nickName = this.nicknameData.nickName;
      this.$router.replace({query:query});
      this.$get('user-web/user/nicknamePageList', this.nicknameData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
          })
          this.tableData = res.data.rows
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
        }
      })
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 查询
    handleSearch(){
      this.getnicknameData(1)
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
          this.$post(`user-web/user/deleteNickName`,{ids:ids}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.nicknameData.pageNo == Math.max(1, Math.ceil(this.total / this.nicknameData.pageSize))&&this.selectRows.length==this.tableData.length){
                this.nicknameData.pageNo = 1;
              };
              this.getnicknameData()
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
    // 下载模板
    handleManage(){
      this.$get('user-web/user/downNickNameTemp').then(data=>{
        let blob = new Blob([data], {type: "application/vnd.ms-excel;charset=utf-8"});
        var link = document.createElement('a');
        link.download="用户昵称"
        link.href = window.URL.createObjectURL(blob);
        link.click();
      })
    },
    // 文件上传成功
    handleSuccess(response){
     if(response.code=='000000'){
      this.$message.success(response.message)
      this.getnicknameData();
     }else{
      this.$message.warning(response.message)
     }
    },
    beforeUploadFile(file) {
     let extension = file.name.substring(file.name.lastIndexOf('.')+1)
     if(extension != 'xlsx' && extension != 'xls') {
       this.$message.warning(`只能上传后缀是.xlsx或者.xsl的文件`);
     }
    },

  },
}
</script>
<style style="scss">
.upload{
  height:36px;
  background:#409EFF;
  display:inline-block;
  color:#fff;
  border-radius:4px;
  padding:10px 20px;
  box-sizing:border-box;
  margin-right: 10px;
}
</style>

