<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="提示语分类名称:">
            <el-input placeholder="请输入提示语分类名称" clearable v-model="labelData.markedName" type="text"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2">
        <!-- 按钮 -->
        <el-button type="primary" size="medium" @click='handleSearch'  v-if="this.$store.state.roleList.indexOf('marked:pageList') > -1">查询</el-button>
        <!-- <el-button type="primary" size="medium" @click="handleAdd">新增</el-button>
        <el-button type="primary" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" size="medium" @click="handleDelete">删除</el-button> -->
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table 
        ref="multipleTable"
        border
        :data="deptTableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="80"  :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" width="100" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(pagingDetails.pageNo - 1) * pagingDetails.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="markedName" label="提示语分类名称" width="350" :resizable = "false"></el-table-column>
        <el-table-column prop="markedCategory" label="提示语分类值" width="350" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'common-web/marked/updateStatus'" @result="getDeptData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip :resizable = "false"></el-table-column>
        <!-- <el-table-column prop="createUser" label="创建人" width="100"></el-table-column> -->
        <el-table-column prop="updateTime" label="最新更新时间" show-overflow-tooltip :resizable = "false"></el-table-column>
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
        <el-form :model="addDeptForm" :rules="addDeptRules" ref="addDeptForm" label-width="100px" style="margin-top: 10px; margin-left: 40px;" class="demo-ruleForm">
          <el-form-item label="提示语分类名称："  prop="markedName" label-width="150px">
            <el-input  type="text" v-model="addDeptForm.markedName" autocomplete="off" placeholder="提示语分类名称"></el-input>
          </el-form-item>
          <el-form-item label="提示语分类值："  prop="markedCategory" label-width="150px">
            <el-input  type="text" v-model="addDeptForm.markedCategory" autocomplete="off" placeholder="提示语分类值"></el-input>
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
  name: 'prompt',
  data() {
    var validatorName = (rule, value, callback) => {
      console.log(value)
        if (value === '') {
          callback(new Error('请输入分类名称'));
        } else {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,26}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-26位数字、英文或者中文'));
          }
          callback();
        }
    };
    var validatorValue = (rule, value, callback) => {
      console.log(value)
        if (value === '') {
          callback(new Error('请输入分类值'));
        } else {
          var reg = /^[A-Za-z0-9]{1,26}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-26位数字、英文'));
          }
          callback();
        }
    };
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      labelData: {
        markedName: '',
      },
      // 分页数据
      pagingDetails:{
        // 总条数
        total:0,
        pageSizes:[],
        pageNo:1,
        pageSize:10,
      },
      // 表格信息
      deptTableData: [],
      // 获取选中行
      selectEditRow:{},
      // 新增校验规则
      addDeptRules:{
          markedName: [
              {required: true,trigger: "change",validator:validatorName }
          ],
          markedCategory: [
              {required: true,trigger: 'change',validator:validatorValue }
          ],
      },
      // 新增数据
      addDeptForm:{
        id:null,
        title:'',
        adCategoryAddVisible:false,
        markedName:'',
        markedCategory:'',
      },
      // 展示分页
      showPage:false,
      statusDisabled:true,
    }
  },
  components:{
    switchItem
  },
  created() {
     this.statusDisabled = this.$store.state.roleList.indexOf('marked:updateStatus') == -1;
    const query = this.$route.query;
    this.pagingDetails.pageNo = Number(query.page)||1;
    this.pagingDetails.pageSize = Number(query.pageSize)||10;
    this.labelData.markedName = query.markedName;
    this.getDeptData();
  },
  methods: {
    // 获取用户
    // 获取列表数据
    getDeptData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.pagingDetails.pageNo = 1;
        query.page = 1;
      };
      query.markedName = this.labelData.markedName;
      this.$router.replace({query:query});
      this.$get("common-web/marked/pageList",{
        markedName:this.labelData.markedName,
        pageNo:this.pagingDetails.pageNo,
        pageSize:this.pagingDetails.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.showAllData = true;
          res.data.rows.forEach(row=>{
            row.createTime = formatterDateTime(row.createTime);
            row.updateTime = formatterDateTime(row.updateTime);
            row.updateUser = row.updateUser || row.createUser;
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
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getDeptData();
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectEditRow = val
    },
    // 查询
    handleSearch() {
      this.getDeptData(1)
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
        this.addDeptForm.markedName = this.selectEditRow[0].markedName;
        this.addDeptForm.markedCategory = this.selectEditRow[0].markedCategory;
        this.addDeptForm.adCategoryAddVisible = true;
      }
    },
    // 修改当前行状态
    statechange(row){
      row.status ? row.status = 100 : row.status = -100;
      this.$get("common-web/marked/updateStatus",{
        id:row.id,
        status:row.status
      }).then(res => {
        if (res.code == "000000") {
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
      .catch((e) => {
        this.$message({
          type: "info",
          message: e
        });
      });
    },
    // 新增修改弹窗确定按钮
    adCategoryAddSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.addDeptForm.title === "新增"){
            this.createdHandle({
              markedName:this.addDeptForm.markedName,
              markedCategory:this.addDeptForm.markedCategory
            });
          }else{
            this.editHandle({
              id:this.addDeptForm.id,
              markedName:this.addDeptForm.markedName,
              markedCategory:this.addDeptForm.markedCategory
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
      this.$post("common-web/marked/saveMarked",data).then(res=>{
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
      })
    },
    // 修改
    editHandle(data){
      this.$post("common-web/marked/updateMarked",data).then(res=>{
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
      })
    },
    // 关闭并重置弹窗
    closeDialog(){
      this.addDeptForm.adCategoryAddVisible = false;
      this.$refs.addDeptForm.resetFields();
      this.addDeptForm.markedName = "";
      this.addDeptForm.markedCategory = "";

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
          this.$post('common-web/marked/deleteMarked',{ids: deleteArr.join(",")}).then(res=>{
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

