<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="广告分类名称:">
            <el-input placeholder="请输入广告分类名称" v-model="adCategoryData.categoryName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtCategory:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <!-- <el-button type="primary" size="medium" @click="adCategoryAddVisible=true">新增</el-button>
        <el-button type="primary" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" size="medium" @click="handleDelete">删除</el-button> -->
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="adCategoryTable" border :data="adCategoryTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" width="80" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(adCategoryData.pageNo - 1) * adCategoryData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="广告分类名称" width="300" :resizable = "false"></el-table-column>
        <el-table-column prop="categoryCode" label="广告分类值"  show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch> -->
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'content-web/advtCategory/updateStatus'" @result="getadCategoryData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateName" label="操作员" width="100" :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="adCategoryData.pageNo"
          :page-sizes="pageSizes"
          :page-size="adCategoryData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
       <!-- 新增框 -->
      <el-dialog title="新增" :visible.sync="adCategoryAddVisible" :before-close="handleClose">
        <el-form :model="adCategoryAddData" label-width="110px" style='margin-top:10px;' :rules="adCategoryAddRules" ref="adCategoryAddData">
          <el-form-item label="广告分类名称" prop='categoryName'>
            <el-input v-model="adCategoryAddData.categoryName" autocomplete="off" placeholder="广告分类名称"></el-input>
          </el-form-item>
          <el-form-item label="广告分类值" prop="categoryCode">
             <el-input v-model="adCategoryAddData.categoryCode" autocomplete="off" placeholder="广告分类值"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="adCategoryAddSubmit('adCategoryAddData')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改框 -->
      <el-dialog title="修改" :visible.sync="adCategoryEditVisible">
        <el-form :model="adCategoryEditData" label-width="110px" style='margin-top:10px;' :rules="adCategoryAddRules" ref="adCategoryEditData">
          <el-form-item label="广告分类名称" prop='categoryName'>
            <el-input v-model="adCategoryEditData.categoryName" autocomplete="off" placeholder="广告分类名称"></el-input>
          </el-form-item>
          <el-form-item label="广告分类值" prop="categoryCode">
             <el-input v-model="adCategoryEditData.categoryCode" autocomplete="off" placeholder="广告分类值"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adCategoryEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="adCategoryEditSubmit('adCategoryEditData')">确 定</el-button>
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
  name: 'adCategory',
  data() {
    var categoryCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入广告分类值'));
      } else { 
        var reg = /^[A-Za-z0-9]{1,26}$/
        if (!reg.test(value)) {
          callback(new Error('只能输入1-26位数字或字母'));
        }
        callback()
      }
    };
    var categoryName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入广告分类名称'));
      } else {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,26}$/
        if (!reg.test(value)) {
          callback(new Error('只能输入1-26位数字、字母或者中文'));
        }
        callback()
        
      }
    };
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      adCategoryData: {
        categoryName: '',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      adCategoryTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 新增框的显示
      adCategoryAddVisible:false,
      // 新增框的数据
      adCategoryAddData:{
        categoryName:'',
        categoryCode:''
      },
      // 新增框的规则
      adCategoryAddRules:{
        categoryName: [
            {required:true,trigger:"change",validator:categoryName}
        ],
        categoryCode: [
            {required:true,trigger:"change",validator: categoryCode}
        ]
      },
      // 修改框的显示
      adCategoryEditVisible:false,
      // 修改框的数据
      adCategoryEditData:{
        categoryName:'',
        categoryCode:''
      },
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:true,
      statusDisabled:true
    }
  },
  created() {
    this.statusDisabled = this.$store.state.roleList.indexOf('advtCategory:updateStatus') == -1;
    
    const query = this.$route.query;
    this.adCategoryData.pageNo = Number(query.page)||1;
    this.adCategoryData.pageSize = Number(query.pageSize)||10;
    this.adCategoryData.categoryName = query.categoryName;
    this.getadCategoryData();
  },
  components:{
    switchItem
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
      this.adCategoryData.pageSize = val
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.pageSize = val;
      this.$router.replace({query:query});
      this.getadCategoryData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.adCategoryData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getadCategoryData()
    },
    // 获取广告分类
    getadCategoryData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.adCategoryData.pageNo = 1;
        query.page = 1;
      }
      query.categoryName = this.adCategoryData.categoryName;
      this.$router.replace({query:query});
      let data = {
        categoryName:this.adCategoryData.categoryName,
        pageNo:this.adCategoryData.pageNo,
        pageSize:this.adCategoryData.pageSize
      }
      this.$post('content-web/advtCategory/pageList', data).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateName = v.updateName||v.createName
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
          })
          this.adCategoryTableData = res.data.rows
          this.total = parseInt(res.data.total)
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
    // 查询
    handleSearch() {
      this.getadCategoryData(1)
    },
    // 修改
    handleEdit(){
      if(this.selectRows.length==0){
        this.$message({
          showClose: true,
          message: '请选择要修改的数据',
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
        this.adCategoryEditVisible=true;
        this.adCategoryEditData.categoryName = this.selectRows[0].categoryName
        this.adCategoryEditData.categoryCode = this.selectRows[0].categoryCode
      }
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
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
          this.$post(`content-web/advtCategory/delete`,{ids:ids}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getadCategoryData()
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
    // 改变状态
    statechange(row){
      let status =100;
      if(row.status==true){
        status=100
      }else{
        status=-100
      }
      const data = {status:status,id:row.id}
      this.$post('content-web/advtCategory/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getadCategoryData();
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    // 新增提交
    adCategoryAddSubmit(formName){
       this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              categoryName:this.adCategoryAddData.categoryName, 
              categoryCode:this.adCategoryAddData.categoryCode    
            }
            this.$post('content-web/advtCategory/save',data).then(res=>{
              if(res.code=='000000'){
                this.$refs[formName].clearValidate()
                this.$refs[formName].resetFields()
                this.adCategoryAddVisible=false
                this.getadCategoryData(1)
                this.$message({
                   message: res.message,
                   type: 'success'
                 });
              }else{
                 this.$message({
                   message: res.message,
                   type: 'warning'
                 });
              }
            })
          } else {
            this.$message.error('输入格式不正确');
            return false;
          }
        });
    },
    // 修改提交
    adCategoryEditSubmit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              categoryName:this.adCategoryEditData.categoryName, 
              categoryCode:this.adCategoryEditData.categoryCode,
              id:this.selectRows[0].id                
            }
            this.$post('content-web/advtCategory/update',data).then(res=>{
              if(res.code=='000000'){
                this.adCategoryEditVisible=false
                this.getadCategoryData()
                this.$message({
                   message: res.message,
                   type: 'success'
                 });
              }else{
                 this.$message({
                   message: res.message,
                   type: 'warning'
                 });
              }
            })
          } else {
            this.$message.error('输入格式不正确');
            return false;
          }
        });
    },
    // 关闭新增
    handleClose(){
      this.$refs.adCategoryAddData.clearValidate()
      this.$refs['adCategoryAddData'].resetFields()
      this.adCategoryAddVisible=false
    }
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
</style>

