<template>
  <div class='user'>
    <div v-if="showAllData">
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户名:">
            <el-input placeholder="请输入用户名" v-model="userData.username" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:user:list') > -1" size="medium"  @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:user:save') > -1" size="medium"  @click="handleAdd">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:user:update') > -1"  size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:user:delete') > -1"  size="medium" @click="handleDelete">删除</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('sys:user:update') > -1"  size="medium" @click="resetPassword">重置密码</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" :resizable = "false"  width="80">
           <template slot-scope="scope">
            <span>{{(userData.pageNo - 1) * userData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="userId" label="用户ID" width="80" :resizable = "false"></el-table-column> -->
        <el-table-column prop="username" label="用户名" width="150" :resizable = "false"></el-table-column>
        <!-- <el-table-column prop="deptName" label="所属部门" width="200" :resizable = "false"></el-table-column> -->
        <el-table-column prop="email" label="邮箱地址" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="120" :resizable = "false">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch> -->
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.userId" :reqUrl="'auth-web/sys/user/updateStatus'" @result="getUserData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="用户角色" width="150" :resizable = "false"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" :resizable = "false" width="220"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" :resizable = "false" width="220"></el-table-column>
        <el-table-column prop="updateName" label="操作员" :resizable = "false" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination 
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userData.pageNo"
          :page-sizes="pageSizes"
          :page-size="userData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 重置密码框 -->
      <el-dialog title="重置密码" :visible.sync="resetPasswordVisible" :before-close="handleClose">
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
          <el-button @click="handleClose">取 消</el-button>
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
import breadcrumb from '../../breadcrumb/breadcrumb'
import {formatterDateTime} from '../../../js/util'
import switchItem from '../../common/switchItem'
export default {
  name: 'user',
  data() {
     var validatorNewPassword = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请输入密码'));
         } else {
           var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,24}$/
           if (!reg.test(value)) {
             callback(new Error('只能输入6-24位数字、字母或者符号'));
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
      showAllData:false,
      showErrorDom:null,
      // 面包屑
      // firstLevelPageMenu: '系统管理',
      // secondLevelPageMenu: "管理员管理",
      // 搜索框
      userData: {
        username: '',
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
            {required:true,trigger: "blur",validator:validatorNewPassword}
        ],
        newConfirmPassword: [
            {required:true,trigger: "blur",validator:validatorNewConfirmPassword}
        ]
      },
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false,
      statusDisabled:true
    }
  },
  components: {
    // breadcrumb
    switchItem
  },
  created() {
    this.statusDisabled = this.$store.state.roleList.indexOf('sys:user:updateStatus') == -1;
    const query = this.$route.query;
    this.userData.pageNo = Number(query.page)||1;
    this.userData.pageSize = Number(query.pageSize)||10;
    this.userData.username = query.username;
    this.getUserData()
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.userData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getUserData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.userData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getUserData()
    },
    // 获取用户
    getUserData(type) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(type){
        this.userData.pageNo = 1;
        query.page = 1;
      };
      query.username = this.userData.username;
      this.$router.replace({query:query});
      this.$get('auth-web/sys/user/list', this.userData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateName = v.updateName||v.createName;
            if(v.status==1){
              v.status=true
            }else{
              v.status=false
            }
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
        };
      })
    },
    // 查询
    handleSearch() {
      this.getUserData(1)
    },
    // 新增操作
    handleAdd(){
        this.$router.push('/modules/sys/userAdd.html')
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
        this.$router.push({path:'/modules/sys/userEdit.html',query:{id:this.selectRows[0].userId}})
      }
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 状态改变
    statechange(row){
      let status =0;
      if(row.status==true){
        status=1
      }else{
        status=0
      }
      const data = {status:status,userId:row.userId}
      this.$post('auth-web/sys/user/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getUserData();
        }else{
          this.$message.warning(res.message)
        }
      })
      
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
          let userIds =[];
          this.selectRows.forEach(v=>{
            userIds.push(v.userId)
          })
          this.$post(`auth-web/sys/user/delete`,userIds).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.userData.pageNo == Math.max(1, Math.ceil(this.total / this.userData.pageSize))&&this.selectRows.length==this.tableData.length){
                this.userData.pageNo = 1;
              };
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
    // 重置密码
    resetPassword(){
       if(this.selectRows.length==0){
        this.$message({
          showClose: true,
          message: '请选择需要重置密码的数据',
          type: 'warning'
        });
        return
      }else if(this.selectRows.length>1){
        this.$message({
          showClose: true,
          message: '选择数据过多,当前仅支持单条数据重置密码',
          type: 'warning'
        });
        return
      }else{
        this.resetPasswordVisible=true
        this.resetPasswordForm.username= this.selectRows[0].username
      }
    },
    // 重置密码保存
    resetPasswordSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data ={
              userId:this.selectRows[0].userId,
              resetPassword:this.resetPasswordForm.newPassword
            }
            this.$post(`auth-web/sys/user/resetPassword`,data).then(res=>{
              if(res.code=='000000'){
                 this.resetPasswordVisible=false
                 this.$refs[formName].clearValidate()
                 this.$refs[formName].resetFields()
                 this.getUserData()
                 this.$message({
                    message: res.message,
                   type: 'success'
                 });
              }else{
                this.$message({
                    message: res.message,
                   type: 'error'
                });
              }
            })
          } else {
            this.$message.error('输入格式不正确');
            return false;
          }
        });
    }, 
    // 关闭重置密码
    handleClose(){
      this.$refs.resetPasswordForm.clearValidate()
      this.$refs['resetPasswordForm'].resetFields()
      this.resetPasswordVisible=false
    },
  },
}
</script>
<style style="scss">
</style>

