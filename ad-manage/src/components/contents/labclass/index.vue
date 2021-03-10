<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="分类名称:">
            <el-input placeholder="请输入分类名称" clearable v-model="labelData.labelName" type="text"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('labelCategory:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('labelCategory:saveLabel') > -1" size="medium" @click="handleAdd">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('labelCategory:updateLabel') > -1" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('labelCategory:deleteLabel') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="deptTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column type="index" label="序号" width="100" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(pagingDetails.pageNo - 1) * pagingDetails.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="分类ID" width="100" :resizable = "false"></el-table-column>
        <el-table-column prop="categoryName" label="分类名称" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="categoryValue" label="分类值" width="120" :resizable = "false"></el-table-column>
        <el-table-column prop="sort" label="排序" width="60" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'content-web/labelCategory/updateStatus'" @result="getDeptData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最新更新时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="updateName" label="操作员" width="100" :resizable = "false"></el-table-column>
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
          <el-form-item label="分类名称: " prop="categoryName">
            <el-input v-model="addDeptForm.categoryName" autocomplete="off" placeholder="分类名称" ></el-input>
          </el-form-item>
          <el-form-item label="排序: " prop="sort">
            <el-input v-model="addDeptForm.sort" autocomplete="off" placeholder="排序" ></el-input>
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
  name: 'labclass',
  data() {
    var validatorName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入分类名称'));
        } else {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,26}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-26位数字、字母或者中文'));
          }
          callback();
        }
    };
    var validatorSort = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入排序值'));
        } else {
          var reg = /^[0-9]{1,4}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入不大于9999的纯数字'));
          }
          callback();
        }
    };
    return {
      showAllData:false,
      showErrorDom:null,
      loading:false,
      // 搜索框
      labelData: {
        labelName: '',
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
          categoryName: [
              {required: true,trigger: "change",validator:validatorName }
          ],
          sort: [
              {required: true,trigger: "change",validator:validatorSort }
          ],
      },
      // 新增数据
      addDeptForm:{
        title:'',
        adCategoryAddVisible:false,
        categoryName:'',
        sort:'9999'
      },
      showPage:false
    }
  },
  components:{
    switchItem
  },
  created() {
    this.statusDisabled = this.$store.state.roleList.indexOf('labelCategory:updateLabel') == -1;
    const query = this.$route.query;
    this.pagingDetails.pageNo = Number(query.page)||1;
    this.pagingDetails.pageSize = Number(query.pageSize)||10;
    this.labelData.labelName = query.labelName;
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
      query.labelName = this.labelData.labelName;
      this.$router.replace({query:query});
      this.$post("content-web/labelCategory/pageList",{
        categoryName:this.labelData.labelName,
        pageNo:this.pagingDetails.pageNo,
        pageSize:this.pagingDetails.pageSize
      }).then(res => {
        if (res.code == "000000") {
          this.showAllData = true;
          res.data.rows.forEach(row=>{
            row.createTime = formatterDateTime(row.createTime);
            row.updateTime = formatterDateTime(row.updateTime);
            row.updateName = row.updateName||row.createName;
            row.status === 100 ? row.status = true : row.status = false;
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
          };
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
          message: '请选择需要修改的数据',
          type: 'warning'
        });
        return
      }else if(Object.keys(this.selectEditRow).length>1){
        return this.$message({
          showClose: true,
          message: '选择数据过多，当前仅支持单条数据修改',
          type: 'warning'
        });
      }else{
        this.addDeptForm.title = "修改";
        this.addDeptForm.id = this.selectEditRow[0].id;
        this.addDeptForm.categoryName = this.selectEditRow[0].categoryName;
        this.addDeptForm.sort = this.selectEditRow[0].sort;
        this.addDeptForm.adCategoryAddVisible = true;
      }
    },
    // 修改当前行状态
    statechange(row){
      row.status ? row.status = 100 : row.status = -100;
      this.$get("content-web/labelCategory/updateStatus",{
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
    trim(str) {  
      if(str == null){  
          str = "";  
      }  
      return str.replace(/(^\s*)|(\s*$)/g, "");  
    }, 
    // 新增修改弹窗确定按钮
    adCategoryAddSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          if(this.addDeptForm.title === "新增"){
            this.createdHandle({
              categoryName:this.addDeptForm.categoryName,
              sort:Number(this.addDeptForm.sort)
            });
          }else{
            this.editHandle({
              id:this.addDeptForm.id,
              categoryName:this.addDeptForm.categoryName,
              sort:Number(this.addDeptForm.sort)
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
      this.$post("content-web/labelCategory/saveLabel",data).then(res=>{
        this.loading = false;
        if(res.code=='000000'){
          this.closeDialog();
          this.$message({
            message: '新增成功',
            type: 'success'
          });
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
      this.$post("content-web/labelCategory/updateLabel",data).then(res=>{
        this.loading = false;
        if(res.code=='000000'){
          this.closeDialog();
          this.$message({
            message: '修改成功',
            type: 'success'
          });
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
      this.addDeptForm.id = "";
      this.addDeptForm.categoryName = "";
      this.addDeptForm.sort = "9999";
    },
    // 删除
    handleDelete(){
       // 判断对象是否为空
      if(Object.keys(this.selectEditRow).length==0){
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
          let deleteArr = [];
          this.selectEditRow.forEach(item=>{
            deleteArr.push(item.id);
          });
          this.$post('content-web/labelCategory/deleteLabel',{ids: deleteArr.join(",")}).then(res=>{
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
<style lang="scss">

</style>

