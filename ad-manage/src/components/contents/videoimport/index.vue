<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="昵称:">
            <el-input placeholder="请输入昵称" v-model="labelData.nickName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span='6'>
         <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户ID:">
            <el-input placeholder="请输入用户ID" v-model="labelData.userId"  @change='check_num' clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span='6'>
         <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="用户名:">
            <el-input placeholder="请输入用户名" v-model="labelData.loginAccount" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('execute:executeCommand') > -1" size="medium" @click="handleEdit">导入视频</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="deptTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80"  :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" width="55" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(pagingDetails.pageNo - 1) * pagingDetails.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column :resizable = "false" prop="id" label="用户ID" width="100"></el-table-column>
        <el-table-column :resizable = "false" prop="account" label="用户名" width="120"></el-table-column>
        <el-table-column :resizable = "false" prop="nickName" label="昵称"  show-overflow-tooltip></el-table-column>
        <el-table-column :resizable = "false" prop="sex" label="性别" width="80"></el-table-column>
        <el-table-column :resizable = "false" prop="birthday" label="生日" width="120"></el-table-column>
        <el-table-column :resizable = "false" prop="status" label="用户状态" width="80">
          <template slot-scope="scope">
            <switchItem :val="scope.row.status" :id="scope.row.id" :reqUrl="'user-web/user/updateStatus'" @result="getDeptData"></switchItem>
          </template>
        </el-table-column>
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
          :current-page="pagingDetails.pageNo"
          :page-sizes="pagingDetails.pageSizes"
          :page-size="pagingDetails.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagingDetails.total"
        >
        </el-pagination>
      </div>
      <el-dialog
        :title="addDeptForm.title" 
        :visible.sync="addDeptForm.adCategoryAddVisible" 
        :before-close="closeDialog">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading?'100%':'1px',height:loading?'100%':'1px'}" 
          v-loading="loading"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="addDeptForm" :rules="addDeptRules" ref="addDeptForm" label-width="100px" style="margin-top: 10px; margin-left: 40px;" class="demo-ruleForm">
          <el-form-item label="目标桶名称: " prop="bucketName">
            <el-input v-model="addDeptForm.bucketName" autocomplete="off" placeholder="目标桶名称" ></el-input>
          </el-form-item>
          <el-form-item label="视频格式: " prop="playType">
            <el-radio-group v-model="addDeptForm.playType">
              <el-radio label="mp4"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图片类型: " prop="picType">
            <el-radio-group v-model="addDeptForm.picType">
              <el-radio label="jpg"></el-radio>
              <el-radio label="png"></el-radio>
              <el-radio label="jpeg"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="adCategoryAddSubmit('addDeptForm')">确 定</el-button>
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
import switchItem from '../../common/switchItem'
export default {
  name: 'labelContent',
  data() {
    var validatorName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入目标桶名称'));
        } else {
          var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
          // var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}$/
          if (reg.test(value)) {
            callback(new Error('禁止输入特殊字符'));
          }else{
            var reg2 = /^[\S\s]{1,30}$/;
            if(!reg2.test(value)){
              callback(new Error('名称长度不能超过30位'));
            }
          }
          callback();
        }
    };
    var validatorPlay = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择视频格式'));
        }
        callback();
    };
    var validatorPic = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择图片格式'));
        }
        callback();
    };
    return {
      showAllData:false,
      showErrorDom:null,
      loading:false,
      // 搜索框
      labelData: {
        nickName: '',
        loginAccount:'',
        userId:''
      },
      // 分页数据
      pagingDetails:{
        // 总条数
        total:0,
        pageSizes:[],
        pageNo:1,
        pageSize:10,
      },
      statusDisabled:true,
      // 表格信息
      deptTableData: [],
      // 获取选中行
      selectEditRow:{},
      // 新增校验规则
      addDeptRules:{
        bucketName: [
          { required: true,trigger: "change",validator:validatorName }
        ],
        playType: [
          { required: true,trigger: "change",validator:validatorPlay }
        ],
        picType: [
          { required: true,trigger: "change",validator:validatorPic }
        ],
      },
      // 新增数据
      addDeptForm:{
        title:'',
        ids:'',
        adCategoryAddVisible:false,
        bucketName:'',
        playType:'mp4',
        picType:'jpg',
      },
      showPage:false
    }
  },
  components: {
    switchItem
  },
  created() {
    const query = this.$route.query;
    this.pagingDetails.pageNo = Number(query.page)||1;
    this.pagingDetails.pageSize = Number(query.pageSize)||10;
    this.labelData.nickName = query.nickName;
    this.labelData.loginAccount = query.loginAccount;
    if(!query.userId){
      this.labelData.userId = undefined;
    }else{
      var userId = Number(query.userId);
      if(isNaN(userId)){
        this.labelData.userId = undefined;
      }else{
        this.labelData.userId = userId;
      }
    }
    this.getDeptData();
  },
  methods: {
    // 获取列表数据
    getDeptData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.pagingDetails.pageNo = 1;
        query.page = 1;
      }
      query.nickName = this.labelData.nickName;
      query.loginAccount = this.labelData.loginAccount;
      query.userId = this.labelData.userId;
      this.$router.replace({query:query});
      this.$get("user-web/user/findUser",{
        nickName:this.labelData.nickName,
        loginAccount:this.labelData.loginAccount,
        userId:this.labelData.userId,
        pageNo:this.pagingDetails.pageNo,
        pageSize:this.pagingDetails.pageSize,
        userType:2
      }).then(res => {
        if (res.code == "000000") {
          this.showAllData = true;
          res.data.rows.forEach(row=>{
            row.createTime = formatterDateTime(row.createTime);
            row.updateTime = formatterDateTime(row.updateTime);
            row.updateName = row.updateName||row.createName;
            row.status === 100 ? row.status = true : row.status = false;
            if(row.sex==0){
              row.sex = '未知'
            }else if(row.sex==1){
              row.sex = '男'
            }else if(row.sex == 2){
              row.sex = '女'
            }
          })
          this.deptTableData = res.data.rows;
          this.pagingDetails.total = Number(res.data.total);
          if(this.pagingDetails.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.pagingDetails.total>20){
              this.pagingDetails.pageSizes=[10,20,50]
            }else{
              this.pagingDetails.pageSizes=[10,20]
            }
          }
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        }
        
      });
    },
    // 改变页容量
    handleSizeChange(val) {
        this.pagingDetails.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getDeptData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.pagingDetails.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getDeptData()
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectEditRow = val
    },
    check_num(){
      this.labelData.userId = this.labelData.userId.replace(/[^0-9]/g, '');
    },
    // 查询
    handleSearch() {
      this.getDeptData(1)
    },
    // 导入视频
    handleEdit(){
      // 判断对象是否为空
      if(Object.keys(this.selectEditRow).length==0){
        this.$message({
          showClose: true,
          message: '请选择需要导入视频的用户',
          type: 'warning'
        });
        return
      }else{
        let deleteArr = [];
        this.selectEditRow.forEach(item=>{
          deleteArr.push(item.id);
        });
        this.addDeptForm.title = "导入视频";
        this.addDeptForm.ids = deleteArr.join(",");
        this.addDeptForm.adCategoryAddVisible = true;
      }
    },
    // 新增修改弹窗确定按钮
    adCategoryAddSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
         this.editHandle({
            userIds:this.addDeptForm.ids,
            bucketName:this.addDeptForm.bucketName,
            playType:this.addDeptForm.playType,
            picType:this.addDeptForm.picType,
          });
        } else {
          this.$message.error('输入格式不正确');
          return false;
        }
      });
    },
    // 修改
    editHandle(data){
      this.$post("content-web/execute/executeCommand",data).then(res=>{
        this.loading = false;
        if(res.code=='000000'){
          this.$message({
            message: '导入视频操作成功',
            type: 'success'
          });
          this.closeDialog();
          return this.getDeptData();
        }else{
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      }).catch(()=>{
        this.loading = false;
      });
    },
    // 关闭并重置弹窗
    closeDialog(){
      this.addDeptForm.adCategoryAddVisible = false;
      this.$refs.addDeptForm.resetFields();
      this.addDeptForm.ids = "";
      this.addDeptForm.bucketName = "";
    },
  },
}
</script>
<style style="scss">

</style>

