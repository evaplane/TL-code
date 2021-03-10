<template>
  <div class='user'>
    <div v-if="showAllData"
      v-loading="loading"
      element-loading-text="正在创建用户中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="5">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="昵称:">
            <el-input placeholder="请输入昵称" v-model="userData.nickName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span='5'>
         <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户ID:">
            <el-input placeholder="请输入用户ID" v-model="userData.userId" @change='check_num' clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span='5'>
         <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户名:">
            <el-input placeholder="请输入用户名" v-model="userData.loginAccount" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('user:findUser') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('user:importOperation') > -1" size="medium" @click='handleAdd'>新增运营用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <div class='content'>
      <el-table ref="multipleTable" border :data="userTableData" tooltip-effect="dark" style="width: 100%">
        <!-- <el-table-column :resizable = "false" type="selection" width="55"></el-table-column> -->
        <el-table-column type="index" label="序号" width="55" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(userData.pageNo - 1) * userData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable = "false" prop="id" label="用户ID" width="100"></el-table-column>
        <el-table-column :resizable = "false" prop="account" label="用户名" width="120"></el-table-column>
        <el-table-column :resizable = "false" prop="nickName" label="昵称" width="150"></el-table-column>
        <el-table-column :resizable = "false" prop="sex" label="性别" width="80"></el-table-column>
        <el-table-column :resizable = "false" prop="birthday" label="生日" width="120"></el-table-column>
        <el-table-column :resizable = "false" prop="status" label="用户状态" width="80">
          <template slot-scope="scope">
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'user-web/user/updateStatus'" @result="getUserData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column :resizable = "false" prop="userType" label="用户角色" width="150"></el-table-column>
        <el-table-column :resizable = "false" prop="userSign" label="个性签名"  show-overflow-tooltip></el-table-column>
        <el-table-column :resizable = "false" prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column :resizable = "false" prop="updateTime" label="最近更新时间" width="180"></el-table-column>
        <el-table-column :resizable = "false" prop="updateUser" label="操作员" width="100"></el-table-column>
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
  name: 'user',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      userData: {
        nickName: '',
        pageSize:10,
        pageNo:1,
        userId:'',
        loginAccount:''
      },
      userTableData: [],
      total:0,
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false,
      statusDisabled:true,
      loading:false
    }
  },
  created(){
    this.statusDisabled = this.$store.state.roleList.indexOf('user:updateStatus') == -1;
    const query = this.$route.query;
    this.userData.pageNo = Number(query.page)||1;
    this.userData.pageSize = Number(query.pageSize)||10;
    this.userData.nickName = query.nickName;
    if(!query.userId){
      this.userData.userId = undefined;
    }else{
      var userId = Number(query.userId);
      if(isNaN(userId)){
        this.userData.userId = undefined;
      }else{
        this.userData.userId = userId;
      }
    };
    this.userData.loginAccount = query.loginAccount;
    this.getUserData()
  },
  components: {
    switchItem
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
    check_num(){
      this.userData.userId = this.userData.userId.replace(/[^0-9]/g, '');
    },
    getUserData(type) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(type){
        this.userData.pageNo = 1
        query.page = 1;
      };
      query.nickName = this.userData.nickName;
      query.userId = this.userData.userId;
      query.loginAccount = this.userData.loginAccount;
      this.$router.replace({query:query});
      this.$get('user-web/user/findUser', this.userData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateUser = v.updateUser||v.createUser;
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
            if(v.userType==1){
              v.userType="普通用户"
            }else{
              v.userType="运营用户"
            }
            if(v.sex==0){
              v.sex = '未知'
            }else if(v.sex==1){
              v.sex = '男'
            }else{
              v.sex = '女'
            }
            v.region = v.country +" - "+v.city
          })
          this.userTableData = res.data.rows
          this.total = res.data.total
          if(this.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.total>50){
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
    handleSearch(){
      this.getUserData(1)
    },
    // 状态改变
    statechange(row){
      console.log(row);
      let status =100;
      if(row.status==true){
        status=100
      }else{
        status=-100
      }
      const data = {status:status,userId:row.id}
      this.$post('user-web/user/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.getUserData();
          this.$message.success(res.message)
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    handleAdd(){
      this.loading = true;
      // user:importOperation
      this.$post('user-web/user/createWaistCoat',{}).then(res=>{
        if(res.code=='000000'){
          this.loading = false;
          this.$message.success(res.message)
          this.getUserData();
          
        }else{
          this.$message.warning(res.message)
        }
      })
    },

  }
}
</script>

<style style="scss">
</style>
