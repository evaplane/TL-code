<template>
  <div class='gatherContent'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="5">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="昵称:">
            <el-input placeholder="请输入昵称" v-model="gatherContentData.userName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="5">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="内容类型:">
            <el-select v-model="gatherContentData.contentType" placeholder="全部" clearable>
                <el-option v-for="item in contentTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-form :inline="true" class="demo-form-inline publishTime">
          <el-form-item label="发布时间:">
               <DateRange ref="rangeTime"  @func="getTimeFromChild" :rangeType='dateRangeType' :defaultTime="dateDefaultTime"></DateRange>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectContentInfo:pageList') > -1" size="medium" @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectContentInfo:delete') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="gatherContentTable" border :data="gatherContentTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @row-dblclick="dbclickDetail">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(gatherContentData.pageNo - 1) * gatherContentData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="100" :resizable = "false"></el-table-column>
        <el-table-column prop="userName" label="昵称" width="100" :resizable = "false"></el-table-column>
        <el-table-column prop="contentId" label="用户内容ID" width="100" :resizable = "false"></el-table-column>
        <el-table-column prop="contentTitle" label="内容标题" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="contentType" label="内容类型" width="60" :resizable = "false"></el-table-column>
        <el-table-column prop="previewVideoStatus" label="预览视频状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <span v-if="scope.row.previewVideoStatus == 0">不生成</span>
            <span v-if="scope.row.previewVideoStatus == 1">未生成</span>
            <span v-if="scope.row.previewVideoStatus == 2">已生成</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishStatus" label="发布状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <span v-if="scope.row.publishStatus == 0">初始化</span>
            <span v-if="scope.row.publishStatus == 1">发布成功</span>
            <span v-if="scope.row.publishStatus == 2">发布失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" width="160" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch> -->
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'common-web/collectContentInfo/updateStatus'" @result="getContentData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="praiseCount" label="点赞数" width="80" :resizable = "false"></el-table-column>
        <el-table-column prop="collectTime" label="采集时间" width="160" :resizable = "false"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" :resizable = "false"></el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间" width="160" :resizable = "false"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100" :resizable = "false"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="gatherContentData.pageNo"
          :page-sizes="pageSizes"
          :page-size="gatherContentData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
       <!-- 详情框 -->
      <el-dialog title="详情" :visible.sync="adListDetailVisible" class='detailDialog'>
        <div class='detail opendialog'>
            <el-row type="flex">
                <el-col :span="3"><div class="grid-content detail-bg right">用户ID:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.userId}}</div></el-col>
                <el-col :span="3"><div class="grid-content detail-bg right">昵称:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.userName}}</div></el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="3"><div class="grid-content detail-bg right">用户内容ID:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.contentId}}</div></el-col>
                <el-col :span="3"><div class="grid-content detail-bg right">内容类型:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.contentType}}</div></el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="3"><div class="grid-content detail-bg right">发布时间:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.publishTime}}</div></el-col>
                <el-col :span="3"><div class="grid-content detail-bg right">点赞数:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.praiseCount}}</div></el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="3"><div class="grid-content detail-bg right">封面链接:</div></el-col>
                <el-col :span="9"><div class="grid-content left link" v-html="detail.mainImageUrl"></div></el-col>
                <el-col :span="3"><div class="grid-content detail-bg right">内容明细:</div></el-col>
                <el-col :span="9"><div class="grid-content left link" v-html="detail.contentUrl"></div></el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="3"><div class="grid-content detail-bg right">状态:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.dstatus}}</div></el-col>
                <el-col :span="3"><div class="grid-content detail-bg right">采集时间:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.collectTime}}</div></el-col>
            </el-row>
            <el-row type="flex">
                <el-col :span="3"><div class="grid-content detail-bg right">创建时间:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.createTime}}</div></el-col>
                <el-col :span="3"><div class="grid-content detail-bg right">最近更新时间:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.updateTime}}</div></el-col>
            </el-row>
            <el-row type="flex" class='detailBottom'>
                <el-col :span="3"><div class="grid-content detail-bg right">操作员:</div></el-col>
                <el-col :span="9"><div class="grid-content left">{{detail.updateUser}}</div></el-col>
                <el-col :span="3"><div class="grid-content detail-bg"></div></el-col>
                <el-col :span="9"><div class="grid-content left"></div></el-col>
            </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="adListDetailVisible = false">关 闭</el-button>
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
import {formatterDateTime,formatDateTime2} from '../../../js/util'
import DateRange from '../../dateRange/dateRange.vue';
import switchItem from '../../common/switchItem'
export default {
  name: 'gatherContent',
  data() {
    return {
      showAllData:false,
      showErrorDom:null,
      // 搜索框
      gatherContentData: {
        contentType: '',
        pageNo:1,
        pageSize:10,
        publishTime:''
      },
      // 表格信息
      gatherContentTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 详情的显示
      adListDetailVisible:false,
      contentTypeData:[{
          value: '1',
          label: '图片'
        }, {
          value: '2',
          label: '视频'
      }],
      // 详情
      detail:{
        userId:'',
        userName:'',
        collectTime:'',
        contentId:'',
        contentType:'',
        contentUrl:'',
        createTime:'',
        createUser:'',
        mainImageUrl:'',
        praiseCount:'',
        publishTime:[],
        status:100,
        updateTime:'',
        updateUser:''
      },
      // 默认时间
      dateRangeType:'currentMonth',
      dateDefaultTime:'false',
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false,
      statusDisabled:true,
    }
  },
  created() {
    this.statusDisabled = this.$store.state.roleList.indexOf('collectContentInfo:updateStatus') == -1;
    this.getContentData();
  },
  components:{
    DateRange,
    switchItem
  },
  methods: {
    // 获取时间
    getTimeFromChild(data){
      this.gatherContentData.publishTime = data;
    },
    // 改变页容量
    handleSizeChange(val) {
        this.gatherContentData.pageSize = val
        this.getContentData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.gatherContentData.pageNo= val;
      this.getContentData()
    },
    // 获取用户
    getContentData(type) {
      if(type){
        this.gatherContentData.pageNo=1
      }
      let publishTimeStart =null      
      let publishTimeEnd =null   
      let data ={} 
      if(this.gatherContentData.publishTime==''){
        publishTimeStart=null
        publishTimeEnd=null
        data = {
          contentType:this.gatherContentData.contentType,
          userName:this.gatherContentData.userName,
          pageNo:this.gatherContentData.pageNo,
          pageSize:this.gatherContentData.pageSize
        }
      } else{
        publishTimeStart=formatDateTime2(this.gatherContentData.publishTime[0]);
        publishTimeEnd=formatDateTime2(this.gatherContentData.publishTime[1])
        data = {
          contentType:this.gatherContentData.contentType,
          userName:this.gatherContentData.userName,
          pageNo:this.gatherContentData.pageNo,
          pageSize:this.gatherContentData.pageSize,
          publishTimeStart:publishTimeStart,
          publishTimeEnd:publishTimeEnd
        }
      }
      this.$post('common-web/collectContentInfo/pageList',data).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateUser = v.updateUser || v.createUser
            v.publishTime = formatterDateTime(v.publishTime)
            v.collectTime = formatterDateTime(v.collectTime)
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
            if(v.contentType==1){
              v.contentType = '图片'
            }else if(v.contentType==2){
              v.contentType = '视频'
            }
            v.mainImageUrl = "<a target='_blank' href='"+v.mainImageUrl+"'>"+v.mainImageUrl+"</a>"
            v.contentUrl = "<a target='_blank' href='"+v.contentUrl+"'>"+v.contentUrl+"</a>"
          })
          this.gatherContentTableData = res.data.rows
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
      this.getContentData(1)
    },
    handleAdd(){
        this.$router.push('/modules/advert/listAdd.html')
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
          this.$post(`common-web/collectContentInfo/delete`,{ids:ids}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.gatherContentData.pageNo == Math.max(1, Math.ceil(this.total / this.gatherContentData.pageSize))&&this.selectRows.length==this.gatherContentTableData.length){
                this.gatherContentData.pageNo = 1;
              };
              this.getContentData()
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
      this.$post('common-web/collectContentInfo/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getContentData();
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    // 表格双击事件
    dbclickDetail(row){
      this.adListDetailVisible=true
      row.collectTime = formatterDateTime(row.collectTime)
      row.updateTime = formatterDateTime(row.updateTime)
      row.publishTime = formatterDateTime(row.publishTime)
      this.detail = row
      if(row.status==true){
        this.detail.dstatus="启用"
      }else{
        this.detail.dstatus="禁用"
      }
    }
  },
}
</script>
<style lang="scss">
.gatherContent .right{
  text-align: right;
  padding-right: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.gatherContent .left{
  text-align: left;
  white-space: pre-line;
  padding-left: 5px;
}
.gatherContent .detail .el-col-6{
  min-width: 0px;
}
.gatherContent .el-date-editor.el-input__inner, .gatherDialog .el-date-editor.el-input{
  width:90%;
}
.link{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.grid-content.link a{
  line-height: 40px;
  text-decoration:underline;
}
.opendialog{
  .el-row{
    min-width: 100% !important;
  }
  .el-col-6{
    min-width: unset !important;
  }
  .grid-content{
    min-width: unset !important;
    height:100%;
  }
  .imgbox{
    border-right:1px solid #ccc;
    text-align:left;
    line-height:10px;
    text-indent:unset;
    height: calc( 100% - 2px);
  }
  .videobox{
    border-right:1px solid #ccc;
    text-align:left;
    line-height:10px;
    height: 200px;
  }
}
</style>

