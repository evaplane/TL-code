<template>
  <div class='contentlist'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation' style='width:100%;'>
      <!-- 输入框 -->
      <el-form :inline="true" :model='userData' class="demo-form-inline">
        <el-col :span="5">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="用户ID:">
              <el-input placeholder="用户ID" clearable v-model="userData.userId" @change='check_num' type="text"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户类型: " prop="pid">
            <el-select v-model="userData.userType" clearable placeholder="全部">
              <el-option
                v-for="item in userTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="上传形式: " prop="pid">
              <el-select v-model="userData.uploadWay" clearable placeholder="全部">
                <el-option
                  v-for="item in uploadWays"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
          <!-- 按钮 -->
          <el-button type="primary" v-if="this.$store.state.roleList.indexOf('content:pageList') > -1" size="medium"  @click='handleSearch'>查询</el-button>
          <el-button type="primary" v-if="this.$store.state.roleList.indexOf('comment:pageList') > -1"  size="medium" @click="checkComment">查看评论</el-button>
          <el-button type="primary" v-if="this.$store.state.roleList.indexOf('content:onlineStatus') > -1"  size="medium" @click="handleDelete">下线</el-button>
          <el-button type="primary" v-if="this.$store.state.roleList.indexOf('content:onlineStatus') > -1"  size="medium" @click="handleUp">上线</el-button>
        </el-col>
      </el-form>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
        @row-dblclick="handleView" :default-sort = "{prop: 'auditTime', order: 'descending'}">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(userData.pageNo - 1) * userData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="100" :resizable = "false"></el-table-column>
        <el-table-column label="用户类型" width="80" :resizable = "false">
          <template slot-scope="scope">
            {{scope.row.userType==1?'普通':'运营'}}
          </template>
        </el-table-column>
        <el-table-column prop="contentTitle" label="内容标题"  show-overflow-tooltip :resizable = "false">
          <template slot-scope="scope">
            <div v-html="scope.row.contentTitle"></div>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" width="120" :resizable = "false">
          <template slot-scope="scope">
            <el-dropdown  size="medium" @command="changeRecommendStatus">
              <span v-if="scope.row.recommend == 1" class="el-dropdown-link" >
                不推荐<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <span v-else-if="scope.row.recommend == 2" class="el-dropdown-link">
                热门<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <span v-else-if="scope.row.recommend == 3" class="el-dropdown-link">
                榜单<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <span v-else-if="scope.row.recommend == 4" class="el-dropdown-link">
                置顶<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <span v-else class="el-dropdown-link">
                {{scope.row.recommend}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled='dropDisabled' :command="composeValue(4,scope.row.id)">置顶</el-dropdown-item>
                <el-dropdown-item :disabled='dropDisabled' :command="composeValue(3,scope.row.id)">榜单</el-dropdown-item>
                <!-- <el-dropdown-item :disabled='dropDisabled' :command="composeValue(2,scope.row.id)">热门</el-dropdown-item> -->
                <el-dropdown-item :disabled='dropDisabled' :command="composeValue(1,scope.row.id)">不推荐</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" :resizable = "false">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :value="scope.row.status" disabled active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="上传形式" width="100" :resizable = "false">
          <template slot-scope="scope">
            {{scope.row.uploadWay==1?'图片':'视频'}}
          </template>
        </el-table-column>
        <el-table-column prop="auditTime" label="审核时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="operator" label="操作员" width="100" :resizable = "false"></el-table-column>
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
import {formatterDateTime,numberFormatter} from '../../../js/util'
export default {
  name: 'contentList',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      userData: {
        userType: '',
        uploadWay: '',
        userId:'',
        pageNo:1,
        pageSize:10
      },
      userTypes:[
        {
          value:'',
          label:'全部',
        },
        {
          value:1,
          label:'普通',
        },
        {
          value:2,
          label:'运营'
        }
      ],
      uploadWays:[
        {
          value:'',
          label:'全部',
        },
        {
          value:1,
          label:'图片',
        },
        {
          value:2,
          label:'视频'
        }
      ],
      // 表格信息
      tableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      showContentData:{},
      listArr:[],
      // 显示详情
      reportContentListDetailVisible:false,
      // 图片预览
      innerVisible:false,
      // 推荐选择弹窗
      recommendVisible:false,
      addDeptForm:{
        id:'',
        radio:''
      },
      // 新增校验规则
      addDeptRules:{
        radio: [
          { required: true, message: '请选择推荐类型', trigger: 'change' }
        ],
      },
      showPage:false,
      pageSizes:[],
      dropDisabled:true,
    }
  },
  created() {
    this.dropDisabled = this.$store.state.roleList.indexOf('content:onlineStatus') == -1;
    const query = this.$route.query;
    this.userData.pageNo = Number(query.page)||1;
    this.userData.pageSize = Number(query.pageSize)||10;
    this.userData.userType = query.userType;
    this.userData.uploadWay = query.uploadWay;
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
    this.getUserData();
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
    composeValue(recommend,id){
      return {
        id:id,
        recommend:recommend
      }
    },
    check_num(){
      this.userData.userId = this.userData.userId.replace(/[^0-9]/g, '');
    },
    // 改变推荐状态按钮
    changeRecommendStatus(data){
      this.$post(`content-web/content/recommend`,data).then(res=>{
        if(res.code=='000000'){
          this.$message({
            type: 'success',
            message: res.message
          });
          this.getUserData();
        }else{
          this.$message({
            type: 'warning',
            message: res.message
          });
        }
      });
      // this.addDeptForm.id = id;
      // this.recommendVisible = true;
    },
    // 关闭推荐弹窗
    closeDialog(){
      this.recommendVisible = false;
      this.$refs.addDeptForm.resetFields();
    },
    // 改变推荐确定按钮
    changeConSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post(`content-web/content/recommend`,{id:this.addDeptForm.id,recommend:this.addDeptForm.radio}).then(res=>{
            if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: res.message
              });
              this.closeDialog();
              this.getUserData();
            }else{
              this.$message({
                type: 'warning',
                message: res.message
              });
            }
          });
        };
      });
      
    },
    // 获取用户
    getUserData(flag) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(flag){
        this.userData.pageNo = 1;
        query.page = 1;
      };
      query.userType = this.userData.userType;
      query.uploadWay = this.userData.uploadWay;
      query.userId = this.userData.userId;
      this.$router.replace({query:query});
      this.$get('content-web/content/pageList', this.userData).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.auditTime = formatterDateTime(v.auditTime)
            v.updateTime = formatterDateTime(v.updateTime)
            if(v.status == 100){
              v.status = true;
            }else if(v.status == -100){
              v.status = false;
            };
            let title = v.contentTitle;
            title = title.replace(/<e:(.*?)>/g,function(){
                return eval("'" + arguments[1] + "'");
            });
            v.contentTitle = this.$emoji.parse(title);
          });
          this.tableData = JSON.parse(JSON.stringify(res.data.rows));
          this.total = Number(res.data.total);
          if(this.total<=10){
            this.showPage=false
          }else{
            this.showPage=true
            if(this.total>20){
              this.pageSizes=[10,20,50]
            }else{
              this.pageSizes=[10,20]
            }
          };
        }else{
          this.$message.warning(res.message);
          this.showErrorDom = res.message;
        }
      })
    },
    // 查询
    handleSearch() {
      this.getUserData(1)
    },
    // 上线
    handleUp() {
      let selectRows = this.selectRows;
      if(selectRows.length==0){
        return this.$message({
          showClose: true,
          message: '请选择需要上线的数据',
          type: 'warning'
        });
      }else{
        console.log(selectRows)
        for (let index = 0; index < selectRows.length; index++) {
          const element = selectRows[index];
          if(element.status){
            this.$message({
              type: 'warning',
              message: '所选内容包含已上线数据，请取消已上线数据才能执行上线'
            });
            return 
          }
        };
        this.$confirm('是否确认上线?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let userIds =[];
          selectRows.forEach(v=>{
            userIds.push(v.id)
          })
          this.$post(`content-web/content/onlineStatus`,{ids:userIds.join(","),status:100}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '上线成功!'
              });
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
            message: '已取消下线'
          });          
        });
      }
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 下线
    handleDelete(){
      let selectRows = this.selectRows;
      if(selectRows.length==0){
        return this.$message({
          showClose: true,
          message: '请选择需要下线的数据',
          type: 'warning'
        });
      }else{
        for (let index = 0; index < selectRows.length; index++) {
          const element = selectRows[index];
          if(!element.status){
            this.$message({
              type: 'warning',
              message: '所选内容包含已下线数据，请取消已下线数据才能执行下线'
            });
            return 
          }
        };
        this.$confirm('是否确认下线?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
         }).then(() => {
          let userIds =[];
          selectRows.forEach(v=>{
            userIds.push(v.id)
          })
          this.$post(`content-web/content/onlineStatus`,{ids:userIds.join(","),status:110}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '下线成功!'
              });
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
            message: '已取消下线'
          });          
        });
      }
    },
    // 查看评论
    checkComment(){
        if(this.selectRows.length==0){
          this.$message({
            showClose: true,
            message: '请选择需要查看的用户',
            type: 'warning'
          });
          return
        }else if(this.selectRows.length>1){
          this.$message({
            showClose: true,
            message: '选择数据过多，当前仅支持查看单个用户',
            type: 'warning'
          });
          return
        }else{
          this.$router.push({
            path:'/modules/contents/contentList/checkComment.html',
            query:{
              contentId:this.selectRows[0].id
            }
          });
        }
    },
    handleView(row) {
      this.$router.push({path:'/modules/contents/contentListView.html',query:{id:row.id}})
    },
    // 格式化数字
    numberFormatter(){
      return numberFormatter(...arguments);
    }
  },
}
</script>
<style lang="scss">
.contentlist{
  .grid-content{
    text-align: left;
    padding-left:10px;
    display: flex;
    align-items: center;
    height: unset;
    line-height: unset;
  }
  .detail-bg.grid-content{
    text-align: right;
    padding-right:10px;
    padding-left:0;
    justify-content: flex-end;
  }
  .el-dropdown-menu{
    width:unset;
    text-align: center;
  }
  .detailBottom .detail-bg{
    height: calc( 100% - 2px);
  }
}
.showimgpic .el-carousel__container{
  height:500px;
}
</style>

