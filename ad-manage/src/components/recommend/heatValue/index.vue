<template>
  <div class='user heatValue'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="6">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="类别: ">
            <el-select v-model="heartData.categoryId" placeholder="全部" @change="changeValue" clearable >
              <el-option v-for="item in options" :key="item.id" :label="item.categoryName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('config:pageList') > -1" size="medium"  @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('config:insertScoreConfig') > -1" size="medium"  @click="heatValueAddVisible=true">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('config:updateScoreConfig') > -1" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('config:deleteById') > -1" size="medium" @click="handleDelete">删除</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('config:updateActionScoreConfig') > -1" size="medium" @click='handleActionConfig'>配置交互热度值</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('config:updateDefaultScoreConfig') > -1" size="medium" @click="golbalDefaultConfig">配置全局默认值</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" :resizable = "false"></el-table-column>
        <el-table-column type="index" label="序号" width="80" :resizable = "false"></el-table-column>
        <el-table-column prop="categoryName" label="类别" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="userType" label="话题来源" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="initSocre" label="初始热度值" width="150" :resizable = "false"></el-table-column>
        <!-- <el-table-column prop="recommendScore" label="推荐分数值" width="150" :resizable = "false"></el-table-column> -->
        <!-- <el-table-column prop="hotScore" label="热门分数值" width="150" :resizable = "false"></el-table-column> -->
        <el-table-column prop="createTime" label="创建时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="220" :resizable = "false"></el-table-column>
        <el-table-column prop="updateOperator" label="操作员" :resizable = "false" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="heartData.pageNo"
          :page-sizes="pageSizes"
          :page-size="heartData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 新增 -->
     <el-dialog title="新增" :visible.sync="heatValueAddVisible" :before-close="handleClose">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading1?'100%':'1px',height:loading1?'100%':'1px'}" 
          v-loading="loading1"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="heatValueAddData" label-width="120px" style='margin-top:10px; margin-left:40px;' :rules="heatValueAddRules" ref="heatValueAddData">
          <el-form-item label="类别:" prop="categoryName">
             <el-select v-model="heatValueAddData.id" placeholder="请选择" @change="changeValueAdd">
              <el-option v-for="item in heatValueTypeAddData" :key="item.id" :label="item.categoryName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="话题来源:" prop="userType">
            <el-select v-model="topicSourceAdd" placeholder="请选择" @change="changeUserTypeAdd">
                <el-option v-for="item in topicSourceAddData" :key="item.value" :label="item.userType" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="初始热度值:" prop='initScore'>
            <el-input v-model="heatValueAddData.initScore" autocomplete="off" placeholder="初始热度值"></el-input>
          </el-form-item>
          <el-form-item label="推荐分数值:" prop="recommendScore" v-if="false">
             <el-input v-model="heatValueAddData.recommendScore" autocomplete="off" placeholder="推荐分数值"></el-input>
          </el-form-item>
          <!-- <el-form-item label="热门分数值" prop="hotScore">
             <el-input v-model="heatValueAddData.hotScore" autocomplete="off" placeholder="热门分数值"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="topicSourceAddSubmit('heatValueAddData')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改 -->
     <el-dialog title="修改" :visible.sync="heatValueEditVisible">
       <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading2?'100%':'1px',height:loading2?'100%':'1px'}" 
          v-loading="loading2"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="heatValueEditData" label-width="120px" style='margin-top:10px; margin-left:40px;' :rules="heatValueAddRules" ref="heatValueEditData">
          <el-form-item label="类别:" prop="categoryName">
            <el-select v-model="heatValueEditData.id" placeholder="请选择" @change="changeValueEdit">
                <el-option v-for="item in heatValueTypeEditData" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="话题来源:" prop="userType">
            <el-select v-model="topicSourceEdit" placeholder="请选择"  @change="changeUserTypeEdit">
                <el-option v-for="item in topicSourceAddData" :key="item.value" :label="item.userType" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="初始热度值:" prop='initScore'>
            <el-input v-model="heatValueEditData.initScore" autocomplete="off" placeholder="初始热度值"></el-input>
          </el-form-item>
          <el-form-item label="推荐分数值:" prop="recommendScore" v-if="false">
             <el-input v-model="heatValueEditData.recommendScore" autocomplete="off" placeholder="推荐分数值"></el-input>
          </el-form-item>
          <!-- <el-form-item label="热门分数值" prop="hotScore">
             <el-input v-model="heatValueEditData.hotScore" autocomplete="off" placeholder="热门分数值"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="heatValueEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="topicSourceEditSubmit('heatValueEditData')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 配置交互热度值 -->
      <el-dialog title="配置交互热度值" :visible.sync="mutualHeatValueVisible" class='mutualHeatValue'>
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading3?'100%':'1px',height:loading3?'100%':'1px'}" 
          v-loading="loading3"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="mutualHeatValuetData" label-width="60px" :inline="true" style='margin-top:10px; margin-left:40px;' :rules="mutualHeatValueRules" ref="mutualHeatValue">
          <el-form-item label="观看" prop="show">
            <el-input v-model="mutualHeatValuetData.show" autocomplete="off" placeholder="观看"></el-input>
          </el-form-item>
          <el-form-item label="评论" prop="comment">
            <el-input v-model="mutualHeatValuetData.comment" autocomplete="off" placeholder="评论"></el-input>
          </el-form-item>
          <el-form-item label="点赞" prop="like">
            <el-input v-model="mutualHeatValuetData.like" autocomplete="off" placeholder="点赞"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分享" prop="share">
             <el-input v-model="mutualHeatValuetData.share" autocomplete="off" placeholder="分享"></el-input>
          </el-form-item>
          <el-form-item label="转发" prop="collect">
             <el-input v-model="mutualHeatValuetData.collect" autocomplete="off" placeholder="收藏"></el-input>
          </el-form-item> -->
          <el-form-item label="踩" prop="step">
             <el-input v-model="mutualHeatValuetData.step" autocomplete="off" placeholder="踩"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="mutualHeatValueVisible = false">取 消</el-button>
          <el-button type="primary" @click="mutualHeatValueSubmit('mutualHeatValue')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 配置全局默认值 -->
       <el-dialog title="配置全局默认值" :visible.sync="golbalDefaultVisible">
         <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading4?'100%':'1px',height:loading4?'100%':'1px'}" 
          v-loading="loading4"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="golbalDefaultData" label-width="110px" style='margin-top:10px; margin-left:40px;' :rules="golbalDefaultRules" ref="golbalDefault">
          <el-form-item label="类别" prop="type">
            <el-input v-model="golbalDefaultData.type" autocomplete="off" disabled placeholder="类别"></el-input>
          </el-form-item>
          <el-form-item label="话题来源" prop="topicSource">
            <el-input v-model="golbalDefaultData.topicSource" disabled autocomplete="off" placeholder="话题来源"></el-input>
          </el-form-item>
          <el-form-item label="初始热度值" prop="initSocre">
            <el-input v-model="golbalDefaultData.initSocre" autocomplete="off" placeholder="初始热度值"></el-input>
          </el-form-item>
          <el-form-item label="推荐分数值" prop="recommendScore" v-if="false">
            <el-input v-model="golbalDefaultData.recommendScore" autocomplete="off" placeholder="推荐分数值"></el-input>
          </el-form-item>
          <!-- <el-form-item label="热门分数值" prop="hotScore">
            <el-input v-model="golbalDefaultData.hotScore" autocomplete="off" placeholder="热门分数值"></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="golbalDefaultVisible = false">取 消</el-button>
          <el-button type="primary" @click="golbalDefaultSubmit('golbalDefault')">确 定</el-button>
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
  name: 'reHeatValue',
  data() {
     var initScore = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请输入初始热度值'));
         }else if(parseInt(value)>200){
            callback(new Error('初始热度值不能大于200'));
         } else {
           var reg =/^[0-9]*$/
           if (!reg.test(value)) {
             callback(new Error('只能输入数字'));
           }
           callback();
         }
     };
     var recommendScore = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请输入推荐分数值'));
         }else if(parseInt(value)>200){
            callback(new Error('推荐分数值不能大于200'));
         } else {
           var reg =/^[0-9]*$/
           if (!reg.test(value)) {
             callback(new Error('只能输入数字'));
           }
           callback();
         }
     };
     var hotScore = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('请输入热门分数值'));
         }else if(parseInt(value)>200){
            callback(new Error('热门分数值不能大于200'));
         } else {
           var reg =/^[0-9]*$/
           if (!reg.test(value)) {
             callback(new Error('只能输入数字'));
           }
           callback();
         }
     };
     var step = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('值不能为空'));
         }else {
           var reg =/^(-|\+)?\d{1,4}$/
           if (!reg.test(value)) {
             callback(new Error('只能输入1-4位数字'));
           }
           callback();
         }
     };
     var step1 = (rule, value, callback) => {
         if (value === '') {
           callback(new Error('值不能为空'));
         }else {
           var reg =/^[-](\+)?\d{1,5}$/
           if (!reg.test(value)) {
             callback(new Error('只能输入1-5位数字并且为负数'));
           }
           callback();
         }
     };
    return {
      showAllData:false,
      showErrorDom:null,
      loading1:false,
      loading2:false,
      loading3:false,
      loading4:false,
      // 搜索框
      heartData: {
        categoryId: "",
        code:'',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      tableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 新增框
      heatValueAddVisible:false,
      // 类别默认值
      heatValueTypeAdd:'',
      // 类别全部值
      heatValueTypeAddData:[],
      // 话题来源值
      topicSourceAdd:'',
      // 话题来源全部值
      topicSourceAddData:[
        {
          value:'1',
          userType:'普通'
        },
        {
          value:'2',
          userType:'运营'
        },
        {
          value:'-1',
          userType:'全部'
        },
      ],
      // 新增框数据
      heatValueAddData:{
        id:"",
        categoryCode:'',
        categoryName:'',
        initScore:'',
        recommendScore:0,
        hotScore:0,
        userType:''
      },
      // 新增框校验
      heatValueAddRules:{
        categoryName: [
            {required:true,trigger: "change",message:'请选择类别'}
        ],
        userType: [
            {required:true,trigger: "change",message:'请选择话题来源'}
        ],
        initScore: [
            {required:true,trigger: "change",validator: initScore}
        ],
        // recommendScore: [
        //     {required:true,trigger: "change",validator: recommendScore}
        // ],
        hotScore: [
            {required:true,trigger: "change",validator: hotScore}
        ],
      },
      // 配置交互热度值规则
      mutualHeatValueRules:{
        step: [
            {required:true,trigger: "change",validator: step1}
        ],
        like: [
            {required:true,trigger: "change",validator: step}
        ],
        collect: [
            {required:true,trigger: "change",validator: step}
        ],
        comment: [
            {required:true,trigger: "change",validator: step}
        ],
        show: [
            {required:true,trigger: "change",validator: step}
        ],
        share: [
            {required:true,trigger: "change",validator: step}
        ],
      },
      // 修改框
      heatValueEditVisible:false,
      // 修改框类别默认值
      heatValueTypeEdit:'',
      // 修改框类别全部值
      heatValueTypeEditData:[],
      // 修改框话题来源默认值
      topicSourceEdit:'',
      // 修改框数据
      heatValueEditData:{
        id:"",
        categoryCode:'',
        categoryName:'',
        initScore:'',
        recommendScore:0,
        hotScore:'',
        userType:''
      },
      // 修改框校验
      heatValueEditRules:{},
      // 交互热度值
      mutualHeatValueVisible:false,
      // 交互热度值数据
      mutualHeatValuetData:{
          show:'',
          comment:'',
          like:'',
          share:'',
          collect:'',
          step:''
      },
      // 全局默认值显示
      golbalDefaultVisible:false,
      // 全局默认值数据
      golbalDefaultData:{
        type:'全部',
        topicSource:'全部',
        initSocre:0,
        recommendScore:0,
        hotScore:0
      },
      // 全局默认值规则
      golbalDefaultRules:{
        hotScore: [
            {required:true,trigger: "change",validator: hotScore}
        ],
        // recommendScore: [
        //     {required:true,trigger: "change",validator: recommendScore}
        // ],
        initSocre: [
            {required:true,trigger: "change",validator: initScore}
        ],
        type: [
            {required:true}
        ],
        topicSource: [
            {required:true}
        ],
      },
      // 分类下拉
      options:[],
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false
    }
  },
  created() {
    const query = this.$route.query;
    this.heartData.pageNo = Number(query.page)||1;
    this.heartData.pageSize = Number(query.pageSize)||10;
    this.heartData.code = query.code;
    this.getheartData();
    this.getSelectData();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.heartData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getheartData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.heartData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getheartData()
    },
    // 获取分类
    getSelectData(){
      this.$get('content-web/labelCategory/categoryList').then(res => {
        if (res.code == '000000') {
          this.heatValueTypeEditData = res.data
          this.heatValueTypeAddData = res.data
          res.data.forEach(v=>{
            this.options.push(v)
          })
        }
      });
    },
    // 绑定列表事件用于获取分类
    changeValue(id){
      let pCdata = this.options.filter(item => item.id == id)
      if(pCdata.length>0){
        this.heartData.code = pCdata[0].categoryValue;
      }else{
        this.heartData.code=''
      }
    },
    changeValueAdd(id){
      let pCdata = this.heatValueTypeAddData.filter(item => item.id == id)
      this.heatValueAddData.categoryCode = pCdata[0].categoryValue;
      this.heatValueAddData.categoryName = pCdata[0].categoryName;
    },
    changeValueEdit(id){
      let pCdata = this.heatValueTypeEditData.filter(item => item.id == id)
      this.heatValueEditData.categoryCode = pCdata[0].categoryValue;
      this.heatValueEditData.categoryName = pCdata[0].categoryName;
    },
    changeUserTypeAdd(id){
      let userType = this.topicSourceAddData.filter(item => item.value == id)
      this.heatValueAddData.userType= userType[0].userType
    },
    changeUserTypeEdit(id){
      let userType = this.topicSourceAddData.filter(item => item.value == id)
      this.heatValueEditData.userType= userType[0].userType
    },
    // 获取用户
    getheartData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.heartData.pageNo = 1;
        query.page = 1;
      };
      query.code = this.heartData.code;
      this.$router.replace({query:query});

      let data ={
        pageSize:this.heartData.pageSize,
        pageNo:this.heartData.pageNo,
        categoryCode:this.heartData.code
      }
      this.$get('recommend-web/config/pageList',data).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateOperator = v.updateOperator||v.createOperator
            if(v.userType==-1){
              v.userType="全部"
            }else if(v.userType==1){
              v.userType="普通"
            }else if(v.userType==2){
              v.userType="运营"
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
      this.getheartData(1)
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
        this.heatValueEditVisible=true
        let idData = this.options.filter(item => item.categoryName == this.selectRows[0].categoryName)
        this.heatValueEditData.id = idData[0].id
        this.heatValueEditData.categoryName = this.selectRows[0].categoryName
        this.heatValueEditData.categoryCode = this.selectRows[0].categoryCode
        this.heatValueEditData.initScore = this.selectRows[0].initSocre
        this.heatValueEditData.recommendScore = 0
        this.heatValueEditData.hotScore = this.selectRows[0].hotScore
        this.heatValueEditData.userType = this.selectRows[0].userType
        this.topicSourceEdit = this.selectRows[0].userType
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
      }else if(this.selectRows.length>1){
        this.$message({
          showClose: true,
          message: '选择数据过多,当前仅支持单条数据删除',
          type: 'warning'
        });
        return
      }else{
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          this.$post(`recommend-web/config/deleteById`,{id:this.selectRows[0].id}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.heartData.pageNo == Math.max(1, Math.ceil(this.total / this.heartData.pageSize))&&this.selectRows.length==this.tableData.length){
                this.heartData.pageNo = 1;
              };
              this.getheartData()
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
    // 新增提交
    topicSourceAddSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading1 = true;
          let data = {
            categoryName:this.heatValueAddData.categoryName,
            categoryCode:this.heatValueAddData.categoryCode,
            hotScore:this.heatValueAddData.hotScore,
            initSocre:this.heatValueAddData.initScore,
            recommendScore:this.heatValueAddData.recommendScore,
            userType:this.topicSourceAdd
          }
          this.$post('recommend-web/config/insertScoreConfig',data).then(res=>{
            this.loading1 = false;
            if(res.code=='000000'){
              this.heatValueAddVisible=false;
              this.heatValueAddData.id=''
              this.topicSourceAdd=''
              this.$refs[formName].clearValidate()
              this.$refs[formName].resetFields()
              this.getheartData(1)
              this.$message.success(res.message)
            }else{
              this.$message.warning(res.message)
            }
          })
        } else {
          this.$message.error('输入格式不正确');
          return false;
        }
      });
    },
    // 修改提交
    topicSourceEditSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading2 = true;
          let userType = -1
          if(this.topicSourceEdit=="普通"){
            userType=1
          }else if(this.topicSourceEdit=="运营"){
            userType=2
          }else{
            userType=-1
          }
          let data = {
            categoryName:this.heatValueEditData.categoryName,
            categoryCode:this.heatValueEditData.categoryCode,
            hotScore:this.heatValueEditData.hotScore,
            initSocre:this.heatValueEditData.initScore,
            recommendScore:this.heatValueEditData.recommendScore,
            userType:userType,
            id:this.selectRows[0].id
          }

          this.$post('recommend-web/config/updateScoreConfig',data).then(res=>{
            this.loading2 = false;
            if(res.code=='000000'){
              this.heatValueEditVisible=false;
              this.getheartData()
              this.$message.success(res.message)
            }else{
              this.$message.warning(res.message)
            }
          })
        } else {
          this.$message.error('输入格式不正确');
          return false;
        }
      });
    },
    // 显示交互热度值
    handleActionConfig(){
      this.mutualHeatValueVisible=true
      this.$get('recommend-web/config/findActionScoreConfig').then(res=>{
          if(res.code=='000000'){
            this.mutualHeatValuetData.collect=res.data.collect
            this.mutualHeatValuetData.like=res.data.like
            this.mutualHeatValuetData.comment=res.data.comment
            this.mutualHeatValuetData.share=res.data.share
            this.mutualHeatValuetData.show=res.data.show
            this.mutualHeatValuetData.step=res.data.step
          }
      })
    },
    // 提交交互热度值
    mutualHeatValueSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading3 = true;
          this.$get(`recommend-web/config/updateActionScoreConfig?collect=${this.mutualHeatValuetData.collect}&like=${this.mutualHeatValuetData.like}&comment=${this.mutualHeatValuetData.comment}&show=${this.mutualHeatValuetData.show}&step=${this.mutualHeatValuetData.step}&share=${this.mutualHeatValuetData.share}`).then(res=>{
            this.loading3 = false;
            if(res.code=='000000'){
              this.mutualHeatValueVisible=false;
              this.getheartData()
              this.$message.success(res.message)
            }else{
              this.$message.warning(res.message)
            }
          })
        } else {
          this.$message.error('输入格式不正确');
          return false;
        }
      });
    },
    // 配置全局默认值
    golbalDefaultConfig(){
      this.golbalDefaultVisible=true
      this.$get('recommend-web/config/findDefaultScoreConfig').then(res=>{
        if(res.code=='000000'){
          this.golbalDefaultData.hotScore = res.data.hotScore 
          this.golbalDefaultData.initSocre = res.data.initSocre
          this.golbalDefaultData.recommendScore = 0
        }
      })
    },
    // 修改全局默认值
    golbalDefaultSubmit(formName){
       this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading4 = true;
          let data = {
            hotScore:this.golbalDefaultData.hotScore,
            initSocre:this.golbalDefaultData.initSocre,
            recommendScore:this.golbalDefaultData.recommendScore
          }
          this.$post(`recommend-web/config/updateDefaultScoreConfig`,data).then(res=>{
            this.loading4 = false;
            if(res.code=='000000'){
              this.golbalDefaultVisible=false;
              this.getheartData()
              this.$message.success(res.message)
            }else{
              this.$message.warning(res.message)
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
      this.heatValueAddVisible = false
      this.heatValueAddData.id=''
      this.topicSourceAdd=''
      this.$refs.heatValueAddData.clearValidate()
      this.$refs['heatValueAddData'].resetFields()
    }
  },
  
}
</script>
<style lang="scss" scoped>
.mutualHeatValue .el-input__inner{
  width: 150px;
}
.mutualHeatValue .el-dialog .el-form-item{
  width: 45%;
}
.heatValue .el-select{
  width: 100%;
}
</style>

