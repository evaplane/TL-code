<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="广告类别名称:">
            <el-input placeholder="请输入广告类别名称" v-model="adSortData.typeName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtCategory:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtCategory:save') > -1" size="medium" @click="adSortAddVisible=true">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtCategory:update') > -1" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('advtCategory:delete') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="adSortTable" border :data="adSortTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" width="80" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(adSortData.pageNo - 1) * adSortData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="广告类别名称" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="typeValue" label="广告类别值" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="150" :resizable = "false">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch> -->
            <switchItem :val="scope.row.status" :disabled='statusDisabled' :id="scope.row.id" :reqUrl="'content-web/advtType/updateStatus'" @result="getadSortData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100" :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="adSortData.pageNo"
          :page-sizes="pageSizes"
          :page-size="adSortData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
       <!-- 新增框 -->
      <el-dialog title="新增" :visible.sync="adSortAddVisible" :before-close="handleClose">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading1?'100%':'1px',height:loading1?'100%':'1px'}" 
          v-loading="loading1"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="adSortAddData" label-width="110px" style='margin-top:10px;' :rules="adSortAddRules" ref="adSortAddData">
          <el-form-item label="广告类别名称" prop='typeName'>
            <el-input v-model="adSortAddData.typeName" autocomplete="off" placeholder="广告类别名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="adSortAddSubmit('adSortAddData')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改框 -->
      <el-dialog title="修改" :visible.sync="adSortEditVisible">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading2?'100%':'1px',height:loading2?'100%':'1px'}" 
          v-loading="loading2"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="adSortEditData" label-width="110px" style='margin-top:10px;' :rules="adSortAddRules" ref="adSortEditData">
          <el-form-item label="广告类别名称" prop='typeName'>
            <el-input v-model="adSortEditData.typeName" autocomplete="off" placeholder="广告类别名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adSortEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="adSortEditSubmit('adSortEditData')">确 定</el-button>
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
  name: 'adSort',
  data() {
      var categoryCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入广告类别值'));
        } else { 
          var reg = /^[1-9]\d{0,19}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-20位正整数'));
          }
          callback();
        }
      };
    var categoryName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入广告类别名称'));
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
      loading1:false,
      loading2:false,
      // 搜索框
      adSortData: {
        typeName: '',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      adSortTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 新增框的显示
      adSortAddVisible:false,
      // 新增框的数据
      adSortAddData:{
        typeName:'',
        typeValue:''
      },
      // 新增框的规则
      adSortAddRules:{
        typeName: [
            {required:true,trigger: "change",validator: categoryName}
        ],
        typeValue: [
            {required:true,trigger: "change",validator: categoryCode}
        ]
      },
      // 修改框的显示
      adSortEditVisible:false,
      // 修改框的数据
      adSortEditData:{
        typeName:'',
        typeValue:''
      },
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:true,
      statusDisabled:true
    }
  },
  created() {
    const query = this.$route.query;
    this.statusDisabled = this.$store.state.roleList.indexOf('advtCategory:updateStatus') == -1;
    this.adSortData.pageNo = Number(query.page)||1;
    this.adSortData.pageSize = Number(query.pageSize)||10;
    this.adSortData.typeName = query.typeName;
    this.getadSortData();
  },
  components:{
    switchItem
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.adSortData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getadSortData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.adSortData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getadSortData()
    },
    // 获取用户
    getadSortData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.adSortData.pageNo = 1;
        query.page = 1;
      };
      query.typeName = this.adSortData.typeName;
      this.$router.replace({query:query});
      this.adSortData.typeName = this.adSortData.typeName
      this.$post('content-web/advtType/pageList', this.adSortData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateUser = v.updateUser||v.createUser
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
          })
          this.adSortTableData = res.data.rows
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
        };
      })
    },
    // 查询
    handleSearch() {
      this.getadSortData(1)
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
        this.adSortEditVisible=true;
        this.adSortEditData.typeName = this.selectRows[0].typeName
        this.adSortEditData.typeValue = this.selectRows[0].typeValue
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
          let ids =[];
          this.selectRows.forEach(v=>{
            ids.push(v.id)
          })
          ids= ids.join(',')
          this.$post(`content-web/advtType/delete`,{ids:ids}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: res.message
              });
              if(this.adSortData.pageNo == Math.max(1, Math.ceil(this.total / this.adSortData.pageSize))&&this.selectRows.length==this.adSortTableData.length){
                this.adSortData.pageNo = 1;
              };
              this.getadSortData()
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
    // 改变状态
    statechange(row){
      let status =100;
      if(row.status==true){
        status=100
      }else{
        status=-100
      }
      const data = {status:status,id:row.id}
      this.$post('content-web/advtType/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getadSortData();
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    // 新增提交
    adSortAddSubmit(formName){
       this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading1 = true;
            // typeValue:this.adSortAddData.typeValue  
            const data = {
              typeName:this.adSortAddData.typeName,   
            }
            this.$post('content-web/advtType/save',data).then(res=>{
              this.loading1 = false;
              if(res.code=='000000'){
                this.getadSortData(1)
                this.adSortAddVisible=false
                this.$refs[formName].clearValidate()
                this.$refs[formName].resetFields()
                this.handleClose()
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
    adSortEditSubmit(formName){
      this.$refs[formName].validate((valid) => {
        // typeValue:this.adSortEditData.typeValue,
          if (valid) {
            this.loading2 = true;
            const data = {
              typeName:this.adSortEditData.typeName, 
              id:this.selectRows[0].id                
            }
            this.$post('content-web/advtType/update',data).then(res=>{
              this.loading2 = false;
              if(res.code=='000000'){
                this.adSortEditVisible=false
                this.getadSortData()
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
    // 新增取消
    handleClose(){
      this.$refs.adSortAddData.clearValidate()
      this.$refs['adSortAddData'].resetFields()
      this.adSortAddVisible=false;
    }
  },
}
</script>
<style style="scss">
</style>

