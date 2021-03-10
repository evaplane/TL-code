<template>
  <div class='app'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="操作平台:">
            <el-select v-model="appData.mobileType" clearable placeholder="全部">
                <el-option v-for="item in operatingDeckData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('upgrade:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('upgrade:saveUpgrade') > -1" size="medium" @click="handleAdd">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('upgrade:updateUpgrade') > -1" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('upgrade:deleteUpgrade') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="adCategoryTable" border :data="appTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column type="index" label="序号" width="50" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(appData.pageNo - 1) * appData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="mobileType" label="操作平台" width="80" :resizable = "false">
          <template slot-scope="scope">
            {{scope.row.mobileType == 1 ? 'Android' : 'iOS'}}
          </template>
        </el-table-column>
        <el-table-column prop="versionName" label="版本名称" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="version" label="版本值" width="80" :resizable = "false"></el-table-column>
        <el-table-column prop="coerceVersion" label="强制升级版本值" width="120" :resizable = "false"></el-table-column>
        <el-table-column label="版本说明" min-width="200" show-overflow-tooltip :resizable = "false">
          <template slot-scope="scope">
              <div v-html="scope.row.versionExplain" style=" white-space: pre-wrap;text-align:left;"></div>
          </template>
        </el-table-column>
        <el-table-column prop="releaseDate" label="发布日期" width="100" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100" :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="appData.pageNo"
          :page-sizes="pageSizes"
          :page-size="appData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
       <!-- 新增框 -->
      <el-dialog 
        :title="appAddData.title"
        :visible.sync="appAddVisible"
        :before-close="handleClose">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading?'100%':'1px',height:loading?'100%':'1px'}" 
          v-loading="loading"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="appAddData" label-width="130px" style='margin-top:10px; margin-left:40px;' :rules="appAddRules" ref="appAddData">
          <el-form-item label="操作平台" prop='mobileType'>
            <el-select v-model="appAddData.mobileType" placeholder="请选择" style="width:100%;">
                <el-option v-for="item in operatingDeckData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="版本名称" prop='versionName'>
            <el-input v-model="appAddData.versionName" autocomplete="off" placeholder="版本名称"></el-input>
          </el-form-item>
          <el-form-item label="版本值" prop="version">
             <el-input v-model="appAddData.version" autocomplete="off" placeholder="版本值"></el-input>
          </el-form-item>
          <el-form-item label="强制升级版本值" prop="coerceVersion">
             <el-input v-model="appAddData.coerceVersion" autocomplete="off" placeholder="强制升级版本值"></el-input>
          </el-form-item>
          <el-form-item label="上传安装包地址" v-if="appAddData.mobileType==1" prop="appUrl">
            <el-upload
              class="upload-demo"
              :action="uploadContentAction"
              multiple
              :limit="1"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-exceed="handleChange"
              :file-list="fileList"
              :auto-upload='false'
              >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item style="margin-top:24px;" v-if="appAddData.mobileType==1" label="安装包地址" prop='x'>
             <el-input v-model="appAddData.appUrl" type="textarea" :disabled="true" autocomplete="off" @input='urlchange' placeholder="安装包地址"></el-input>
          </el-form-item>
          <el-form-item style="margin-top:24px;" v-if="appAddData.mobileType==''||appAddData.mobileType==2" label="安装包地址"  prop="appUrl">
             <el-input v-model="appAddData.appUrl" type="textarea" autocomplete="off" @input='urlchange' placeholder="安装包地址"></el-input>
          </el-form-item>
          <el-form-item label="版本说明" prop="versionExplain">
             <el-input v-model="appAddData.versionExplain" rows="6" type='textarea' autocomplete="off" placeholder="版本说明"></el-input>
          </el-form-item>
          <el-form-item label="发布日期" prop="releaseDate" class='publishData'>
            <el-date-picker v-model="appAddData.releaseDate" :picker-options="pickerOptions" type="date" placeholder="选择日期"  style="width:100%;"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="appAddSubmit('appAddData')">确 定</el-button>
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
import {formatterDateTime,formatDateTime2,formatterDateTime3} from '../../../js/util'
export default {
  name: 'appVersionUpgrade',
  data() {
    var validatorMobileType = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请选择操作平台'));
         } else {
           callback();
         }
     };
    var coerceVersionValue = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入强制版本值'));
      }else{
        var reg = /^\d{1,10}$/;
        if (!reg.test(value)) {
          callback(new Error('只能输入1-10位纯数字'));
        }else{
          if(value < 0){
            callback(new Error('强制版本值必须不小于0'));
          };
          if(!this.appAddData.version){
            this.$message.warning("输入强制版本值前请输入版本值");
          }else{
            let version = Number(this.appAddData.version.split('.').join(""));
            if(value > version){
              callback(new Error('强制版本值不能大于'+version));
            }
          };
        };
        callback();
      }
    };
    var versionValue = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入版本值'));
      } else {
        var reg = /^[1-9].[0-9].[0-9]$/;
      //  var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,12}$/
        if (!reg.test(value)) {
          callback(new Error('只能输入版本值，如：1.0.0等'));
        }
        callback();
      }
    };
    var appUrlValue = (rule, value, callback) => {
      if(this.appAddData.mobileType == 1){
        if (this.fileList.length == 0) {
          callback(new Error('请上传安装包'));
        }else{
          if(this.fileList[0].name.indexOf('.apk') == -1){
            callback(new Error('请输入上传Android安装包'));
          }
        };
      }else{
        if(value == ''){
          callback(new Error('请输入安装包地址'));
        }else{
          const strRegex = '((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]';
      　　const reg = new RegExp(strRegex, 'i'); // 大小写不敏感
          if (!reg.test(value)) {
            callback(new Error('请输入以http://或https://开头的安装包地址'));
          }else{
            if(value.length > 120){
              callback(new Error('请输入120位以内的安装包地址'));
            }
          }
        }
      };
      callback();
    };
    var versionNameRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入版本名称'));
      } else {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5.]{1,26}$/
        if (!reg.test(value)) {
          callback(new Error('只能输入1-26位数字、字母或者中文'));
        }
        callback();
      }
    };
    var versionExplainRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入版本说明'));
      } else {
        var reg = /^[\s\S]{1,255}$/;
        if (!reg.test(value)) {
          callback(new Error('只能输入1-255位说明内容'));
        }else{
          if(value.match(/^\s+$/)){
            callback(new Error('禁止只输入空格'));
          }
        }
        callback();
      }
    };
    return {
      showAllData:false,
      showErrorDom:null,
      loading:false,
      fileList:[],
      // 上传地址,改为不传递
      uploadContentAction:'',
      // 搜索框
      appData: {
        mobileType: '',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      appTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 新增框的显示
      appAddVisible:false,
      // 新增框的数据
      appAddData:{
        title:'',
        mobileType:'',
        coerceVersion:'',
        releaseDate:'',
        version:'',
        versionExplain:'',
        versionName:'',
        appUrl:'',
      },
      // 新增框的规则
      appAddRules:{
        mobileType: [
          {required:true,trigger: "change",validator:validatorMobileType}
        ],
        coerceVersion: [
          {required:true,trigger: "change",validator:coerceVersionValue}
        ],
        releaseDate: [
          {required:true,trigger: "change",message:'请输入发布日期'}
        ],
        version: [
          {required:true,trigger: "change",validator:versionValue}
        ],
        appUrl: [
          {required:true,trigger: "change",validator:appUrlValue}
        ],
        versionExplain: [
          {required:true,trigger: "change",validator:versionExplainRule}
        ],
        versionName: [
          {required:true,trigger: "change",validator:versionNameRule}
        ],
      },
      // 修改框的数据
      pickerOptions:{
        disabledDate: (time) => {
            return time.getTime() < Date.now() - 8.64e7
         }
      },
      // 操作平台select
      operatingDeckData:[
        {
          value: '1',
          label: 'Android'
      },{
          value: '2',
          label: 'IOS'
      }],
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false,
      loading:false
    }
  },
  created() {
    const query = this.$route.query;
    this.appData.pageNo = Number(query.page)||1;
    this.appData.pageSize = Number(query.pageSize)||10;
    this.appData.mobileType = query.mobileType;
    this.getAppData();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.appData.pageSize = val      
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getAppData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.appData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getAppData()
    },
    urlchange(){
      this.$forceUpdate();
    },
    // 获取数据
    getAppData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.appData.pageNo = 1;
        query.page = 1;
      };
      query.mobileType = this.appData.mobileType;
      this.$router.replace({query:query});

      this.$get('common-web/upgrade/pageList', this.appData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)            
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateUser = v.updateUser||v.createUser;
            v.status = v.status==100?true:false;
            if(new Date(v.releaseDate) == 'Invalid Date'){
              v.releaseDate = formatterDateTime3(new Date());   
            }else{
              v.releaseDate = formatterDateTime3(new Date(v.releaseDate));
            }
                        
          })
          this.appTableData = res.data.rows
          this.total = res.data.total
          this.appData.pageNo = this.appData.pageNo;
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
      this.getAppData(1);
    },
    // 新增
    handleAdd(){
      this.appAddData.title = "新增";
      this.appAddVisible=true;
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
          message: '只能修改一个用户',
          type: 'warning'
        });
        return
      }else{
        this.$refs.appAddData&&this.$refs.appAddData.resetFields();
        for(var item in this.appAddData){
          this.appAddData[item] = this.selectRows[0][item]
          item == 'mobileType' && (this.appAddData[item] = String(this.appAddData[item]));
        };
        this.appAddData.title = "修改";
        if(this.appAddData.mobileType == 1){
          var prename = this.appAddData.appUrl.split('?')[0].split('/');
          this.fileList = [{
            name:prename[prename.length-1],
            url:this.appAddData.appUrl
          }];
        };
        this.appAddVisible=true;
      }
    },
    handleClose() {
      this.appAddVisible = false;
      this.$refs.appAddData.resetFields();
      this.appAddData = {
        title:'',
        mobileType:'',
        coerceVersion:'',
        releaseDate:'',
        version:'',
        versionExplain:'',
        versionName:'',
        appUrl:''
      };
      this.fileList=[];
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
          ids = ids.join(',');
          this.$post(`common-web/upgrade/deleteUpgrade`,{ids}).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.appData.pageNo == Math.max(1, Math.ceil(this.total / this.appData.pageSize))&&this.selectRows.length==this.appTableData.length){
                this.appData.pageNo = 1;
              };
              this.getAppData()
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
    // 新增保存
    appAddSubmit(formName) {
      console.log(this.$refs[formName].validate)
      this.$refs[formName].validate((valid) => {
        console.log(123)
        if (valid) {
          console.log(2);
          this.loading = true;
          if(this.appAddData.title == '新增'){
            this.createdHandle();
          }else{
            this.editHandle();
          };
        } else {
          return false;
        }
      });
    },
    // 新增版本升级
    createdHandle(){
      this.appAddData.releaseDate = formatDateTime2(new Date(this.appAddData.releaseDate));
      this.$post('common-web/upgrade/saveUpgrade',this.appAddData).then(res=>{
        this.loading = false;
        if(res.code=='000000'){
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.handleClose();
          this.getAppData(1);
        }else{
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    // 修改版本升级
    editHandle(){
      this.appAddData.releaseDate = formatDateTime2(new Date(this.appAddData.releaseDate));
      let data ={
        ...this.appAddData,
        id:this.selectRows[0].id
      };
      this.$post('common-web/upgrade/updateUpgrade',data).then(res=>{
        this.loading = false;
        if(res.code=='000000'){
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.handleClose();
          this.getAppData();
        }else{
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      })
    },
    handleChange(file,fileList){
      let fileRaw;
      if(file.length){
        fileRaw = file[0];
      }else{
        fileRaw = file.raw;
      };
      let selectArr = ["application/vnd.android.package-archive"];
      let noAndroid = selectArr.indexOf(fileRaw.type) == -1;
      let noIos = fileRaw.name.indexOf(".ipa") == -1;
      if(this.appAddData.mobileType){
        if(this.appAddData.mobileType == 1){
          if(noAndroid){
             fileList.pop();
            return this.$message.error('请选择Android安装包');
          }
        }else{
          if(noIos){
            fileList.pop();
            return this.$message.error('请选择IOS安装包');
          }
        }
      }else{
        if(noAndroid){
          if(noIos){
            fileList.pop();
            return this.$message.error('请选择ios或Android安装包');
          };
        }
      };
      var that = this;
      this.loading = true;
      var formData = new FormData();
      var fileReader = new FileReader();
      fileReader.readAsBinaryString(fileRaw);
      fileReader.onload = function(e) {
        formData.append("file",fileRaw)
        formData.append("objKeyName",fileRaw.name)
        that.$post('/common-web/upgrade/appUpload',formData).then(res=>{
          that.loading = false;
          if(res.code=='000000'){
            that.fileList = [{
              name:fileRaw.name,
              url:res.data
            }];
            that.appAddData.appUrl = res.data;
            that.$refs.appAddData.validateField('appUrl');
          }else{
            that.fileList = [];
            that.appAddData.appUrl = '';
            that.$message.warning(res.message);
          }
        }).catch((e)=>{
          that.loading = false;
          that.fileList = [];
          that.appAddData.appUrl = '';
          that.$message.error(res.message);
        })
      };
      
    },
    handleRemove(){
      this.fileList = [];
      this.appAddData.appUrl = '';
    },
  }
}
</script>
<style style="scss">

</style>

