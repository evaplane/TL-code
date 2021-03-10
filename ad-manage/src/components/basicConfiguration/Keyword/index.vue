<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation' style="padding-bottom:20px;">
      <!-- 输入框 -->
      <el-col :span="12">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('illegal:saveIllegal') > -1" size="medium" @click="handleAdd">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('illegal:updateIllegal') > -1" size="medium" @click="handleEdit">修改</el-button>
        <!-- accept=".xlsx,.xls" -->
        <el-upload
          v-if="this.$store.state.roleList.indexOf('illegal:illegalUpload') > -1"
          style="display:inline-block;margin:0 10px;"
          ref="upload"
          class="upload-demo" 
          :headers="headers"
          action="api/common-web/illegal/illegalUpload"
          :on-success="handleSuccess"
          :show-file-list="false"
          :before-upload = "beforeUploadFile">
          <el-button size="medium" type="primary"><i class="el-icon-upload"></i>&nbsp;&nbsp;点击上传</el-button>
        </el-upload>
        <input v-show="false" id="excel" ref="picture" accept=".xls .xlsx" type="file" @change="upload($event)">
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('illegal:downIllegalNameTemp') > -1"  size="medium" @click="handleManage"><i class="el-icon-download"></i>&nbsp;&nbsp;下载模板</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('illegal:deleteIllegal') > -1"  size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="deptTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" width="100" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(pagingDetails.pageNo - 1) * pagingDetails.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="illegalName" label="非法关键字" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最新更新时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100" :resizable = "false"></el-table-column>
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
      <el-dialog :title="addDeptForm.title" :visible.sync="addDeptForm.adCategoryAddVisible" :before-close="closeDialog">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading?'100%':'1px',height:loading?'100%':'1px'}" 
          v-loading="loading"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="addDeptForm" :rules="addDeptRules" ref="addDeptForm" label-width="100px" style="margin-top: 10px; margin-left: 40px;" class="demo-ruleForm">
            <el-form-item label="非法关键字："  prop="illegalName" label-width="150px">
              <el-input  type="text" v-model="addDeptForm.illegalName" autocomplete="off" placeholder="非法关键字"></el-input>
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
export default {
  name: 'Keyword',
  data() {
    var illegalName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入非法关键字'));
        } else {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,26}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-26位数字、字母或者中文'));
          }
          callback();
        }
    };
    return {
      showAllData:false,
      showErrorDom:null,
      loading:false,
      // 分页数据
      pagingDetails:{
        // 总条数
        total:0,
        currentPage:1, 
        pageSizes:[],
        pageNo:1,
        pageSize:10,
      },
      // 新增校验规则
      addDeptRules:{
          illegalName: [
              {required: true,trigger: 'change',validator:illegalName }
          ],
      },
      // 新增数据
      addDeptForm:{
        id:null,
        title:'',
        adCategoryAddVisible:false,
        illegalName:'',
      },
      // 表格信息
      deptTableData: [],
      // 获取选中行
      selectEditRow:{},
      token:'',
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
    this.pagingDetails.pageNo = Number(query.page)||1;
    this.pagingDetails.pageSize = Number(query.pageSize)||10;
    this.token = localStorage.getItem('token')
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
      this.$router.replace({query:query});
      this.$get("common-web/illegal/pageList",{
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
              this.pagingDetails.pageSizes=[10,20,50]
            }else{
              this.pagingDetails.pageSizes=[10,20]
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
      this.$router.replace('?page='+val);
      this.getDeptData();
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectEditRow = val
    },
     // 新增操作
    handleAdd(){
      this.addDeptForm.title = "新增";
      this.addDeptForm.adCategoryAddVisible = true;
    },
    // 修改
    handleEdit(){
      // 判断对象是否为空
      if(Object.keys(this.selectEditRow).length==0){
        this.$message({
          showClose: true,
          message: '请选择要修改的数据',
          type: 'warning'
        });
        return
      }else if(Object.keys(this.selectEditRow).length>1){
        return this.$message({
          showClose: true,
          message: '当前选择数据过多无法处理，仅能修改单条数据',
          type: 'warning'
        });
      }else{
        // 注意修改数据，此处传递是数组
        this.addDeptForm.title = "修改";
        console.log(this.selectEditRow[0]);
        this.addDeptForm.id = this.selectEditRow[0].id;
        this.addDeptForm.illegalName = this.selectEditRow[0].illegalName;
        this.addDeptForm.adCategoryAddVisible = true;
      }
    },
    // 新增修改弹窗确定按钮
    adCategoryAddSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          if(this.addDeptForm.title === "新增"){
            this.createdHandle({
              illegalName:this.addDeptForm.illegalName
            });
          }else{
            this.editHandle({
              id:this.addDeptForm.id,
              illegalName:this.addDeptForm.illegalName
            });
          }
        } else {
          this.$message.error('输入格式不正确');
          return false;
        }
      });
    },
    // 新增
    createdHandle(data){
      this.$post("common-web/illegal/saveIllegal",data).then(res=>{
        this.loading = false;
        if(res.code=='000000'){
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.closeDialog();
          return this.getDeptData(1);
        }else{
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      });
    },
    closeDialog(){
      this.addDeptForm.adCategoryAddVisible = false;
      this.$refs.addDeptForm.resetFields();
      this.addDeptForm.illegalName = "";
    },
    // 修改
    editHandle(data){
      this.$post("common-web/illegal/updateIllegal",data).then(res=>{
        this.loading = false;
        if(res.code=='000000'){
          this.$message({
            message: '修改成功',
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
      });
    },
    // 下载模板
    handleManage(){
      this.$get('common-web/illegal/downIllegalNameTemp').then(data=>{
        let blob = new Blob([data], {type: "application/vnd.ms-excel;charset=utf-8"});
        var link = document.createElement('a');
        link.download = "非法关键字.xls";
        link.href = window.URL.createObjectURL(blob);
        link.click();
      })
    },
    // 文件上传成功
    handleSuccess(response){
      if(response.code == '000000'){
        this.$message.success(response.message)
        this.getDeptData();
      }else{
        this.$message.warning(response.message);
      };
    },
    beforeUploadFile(file) {
     let extension = file.name.substring(file.name.lastIndexOf('.')+1)
     if(extension != 'xlsx' && extension != 'xls') {
       this.$message.warning(`只能上传后缀是.xlsx或者.xsl的文件`);
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
          this.$post('common-web/illegal/deleteIllegal',{ids: deleteArr.join(",")}).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.pagingDetails.pageNo == Math.max(1, Math.ceil(this.pagingDetails.total / this.pagingDetails.pageSize))&&this.selectEditRow.length==this.deptTableData.length){
                this.pagingDetails.pageNo = 1;
              };
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

