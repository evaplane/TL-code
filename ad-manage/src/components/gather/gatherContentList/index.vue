<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation' style="padding-bottom:20px;">
      <el-col :span="6">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectContentConfig:save') > -1" size="medium" @click='handleAdd'>新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectContentConfig:update') > -1" size="medium" @click='handleEdit'>修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectContentConfig:delete') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="adListTable" border :data="gatherContentListData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" label="序号" width="50" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(gatherContentList.pageNo - 1) * gatherContentList.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户昵称" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="dailyCollectNum" label="用户日采集量" width="150" :resizable = "false"></el-table-column>
        <el-table-column prop="collectSchedule" label="采集进度" width="200" :resizable = "false"></el-table-column>
        <el-table-column prop="collectTime" label="采集时间" width="120" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :resizable = "false">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch> -->
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'common-web/collectContentConfig/updateStatus'" @result="getgatherContentListData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="120" :resizable = "false"></el-table-column>
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
          :current-page="gatherContentList.pageNo"
          :page-sizes="pageSizes"
          :page-size="gatherContentList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
       <!-- 新增框 -->
      <el-dialog title="新增" :visible.sync="addGatherContentListVisible" class='gatherDialog' :before-close="handleClose">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading1?'100%':'1px',height:loading1?'100%':'1px'}" 
          v-loading="loading1"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="addGatherContentListForm" label-width="120px" style='margin-top:10px;' :rules="addGatherContentListRules" ref="addGatherContentListForm">
          <el-form-item label="用户昵称:"  prop="userName">
            <el-input v-model="addGatherContentListForm.userName" autocomplete="off" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item label="用户日采集量:" prop="dailyCollectNum">
             <el-input v-model="addGatherContentListForm.dailyCollectNum" autocomplete="off" placeholder="用户日采集量"></el-input>
          </el-form-item>
          <el-form-item label="采集时间:" prop="collectTime">
            <el-row type="flex" justify="space-between">
              <el-col :span="2"><el-checkbox v-model="allDay" @change="allDayChange">全天</el-checkbox></el-col>
              <el-col :span="22" style="justify-content: space-between;display: inline-flex;">
                <el-time-picker
                  v-model="addGatherContentListForm.addStartTime"
                  format='HH:mm'
                  value-format="HH:mm"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  placeholder="起始时间"
                  class='startTime'>
                </el-time-picker>
                <span style='color:#C0C4CC'> - </span>
                <el-time-picker
                  v-model="addGatherContentListForm.addEndTime"
                  format='HH:mm'
                  value-format="HH:mm"
                  :picker-options="{
                    selectableRange:addSelectableRange
                  }"
                  placeholder="结束时间"
                  class='endTime'>
                </el-time-picker>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addGatherContentListSubmit('addGatherContentListForm')">确 定</el-button>
        </div>
      </el-dialog>
       <!-- 修改框 -->
      <el-dialog title="修改" :visible.sync="editGatherContentListVisible" class='gatherDialog'>
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading2?'100%':'1px',height:loading2  ?'100%':'1px'}" 
          v-loading="loading2"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="editGatherContentListForm" label-width="120px" style='margin-top:10px;' :rules="editGatherContentListRules" ref="editGatherContentListForm">
          <el-form-item label="用户昵称:" prop="userName">
            <el-input v-model="editGatherContentListForm.userName" autocomplete="off" placeholder="用户昵称"></el-input>
          </el-form-item>
          <el-form-item label="用户日采集量:" prop="dailyCollectNum">
             <el-input v-model="editGatherContentListForm.dailyCollectNum" autocomplete="off" placeholder="用户日采集量"></el-input>
          </el-form-item>
          <el-form-item label="采集时间:" prop="collectTime">
            <el-row type="flex" justify="space-between">
              <el-col :span="2"><el-checkbox v-model="allDayEdit" @change="allDayEditChange">全天</el-checkbox></el-col>
              <el-col :span="22" style="justify-content: space-between;display: inline-flex;">
                <el-time-picker
                  v-model="editGatherContentListForm.addStartTime"
                  format='HH:mm'
                  value-format="HH:mm"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                  }"
                  placeholder="起始时间"
                  class='startTime'>
                </el-time-picker>
                <span style='color:#C0C4CC'> - </span>
                <el-time-picker
                  v-model="editGatherContentListForm.addEndTime"
                  format='HH:mm'
                  value-format="HH:mm"
                  :picker-options="{
                    selectableRange:editSelectableRange
                  }"
                  placeholder="结束时间"
                  class='endTime'>
                </el-time-picker>
              </el-col>
            </el-row>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editGatherContentListVisible = false">取 消</el-button>
          <el-button type="primary" @click="editGatherContentListSubmit('editGatherContentListForm')">确 定</el-button>
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
import {formatterDateTime,collectTime} from '../../../js/util'
import switchItem from '../../common/switchItem'
export default {
  name: 'gatherContent',
  data() {
     var validateCollectTime = (rule, value, callback) => {
         if (!this.addGatherContentListForm.addStartTime) {
           callback(new Error('请选择起始时间'));
         } else if(!this.addGatherContentListForm.addEndTime){
            callback(new Error('请选择结束时间'));
         }else {
           callback();
         }
     };
     var validateEditCollectTime = (rule, value, callback) => {
         if (!this.editGatherContentListForm.addStartTime) {
           callback(new Error('请选择起始时间'));
         } else if(!this.editGatherContentListForm.addEndTime){
            callback(new Error('请选择结束时间'));
         }else {
           callback();
         }
     };
      var userName = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('请输入用户昵称'));
        } else { 
          var reg = /[\s\S]{1,64}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-64位用户昵称'));
          }
          callback();
        }
     };
      var dailyCollectNum = (rule, value, callback) => {
         if (value === '') {
          callback(new Error('请输入用户日采集量'));
        } else { 
          var reg = /^[0-9]{1,5}$/
          if (!reg.test(value)) {
            callback(new Error('只能输入1-5位数字'));
          }
          callback();
        }
     };
    return {
      showAllData:false,
      showErrorDom:null,
      loading1:false,
      loading2:false,
      // 搜索框
      gatherContentList: {
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      gatherContentListData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 新增的显示
      addGatherContentListVisible:false,
      // 新增的表格数据
      addGatherContentListForm:{
        userName:'',
        dailyCollectNum:'',
        addStartTime:'',
        addEndTime:''
      },
      // 新增的规则
      addGatherContentListRules:{
        userName: [
          {required:true,trigger: "change",validator: userName}
        ],
        collectTime: [
          {required:true,trigger: "change",validator: validateCollectTime}
        ],
        dailyCollectNum:[
          {required:true,trigger: "change",validator: dailyCollectNum}
        ]
      },
      // 修改的显示
      editGatherContentListVisible:false,
      // 修改的表格数据
      editGatherContentListForm:{
        userName:'',
        dailyCollectNum:'',
        addStartTime:'',
        addEndTime:''
      },
      // 修改的规则
      editGatherContentListRules:{
        userName: [
          {required:true,trigger: "change",validator: userName}
        ],
        collectTime: [
          {required:true,trigger: "change",validator: validateEditCollectTime}
        ],
        dailyCollectNum:[
          {required:true,trigger: "change",validator: dailyCollectNum}
        ]
      },
      // 新增采集时间
      allDay:false,
      // 修改采集时间
      allDayEdit:false,
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false,
      statusDisabled:true
    }
  },
  created() {
    this.statusDisabled = this.$store.state.roleList.indexOf('collectContentConfig:updateStatus') == -1;
    const query = this.$route.query;
    this.gatherContentList.pageNo = Number(query.page)||1;
    this.gatherContentList.pageSize = Number(query.pageSize)||10;
    this.getgatherContentListData();
  },
  computed:{
    addSelectableRange(){
      if(this.addGatherContentListForm.addEndTime == '23:59'){
        if(this.addGatherContentListForm.addStartTime === '00:00'||this.addGatherContentListForm.addStartTime === '0:00'){
          this.allDay = true;
        }else{
          this.allDay = false;
        }
      }else{
        this.allDay = false;
      };
      return this.computedTime(this.addGatherContentListForm.addStartTime);
    },
    editSelectableRange(){
      if(this.editGatherContentListForm.addEndTime == '23:59'){
        if(this.editGatherContentListForm.addStartTime === '00:00'||this.editGatherContentListForm.addStartTime === '0:00'){
          this.allDayEdit = true;
        }else{
          this.allDayEdit = false;
        }
      }else{
        this.allDayEdit = false;
      };
      return this.computedTime(this.editGatherContentListForm.addStartTime);
    }
  },
  components:{
    switchItem
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.gatherContentList.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getgatherContentListData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.gatherContentList.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getgatherContentListData()
    },
    // 获取用户
    getgatherContentListData(type) {
      if(type){
        this.gatherContentList.pageNo=1
      }
      this.$post('common-web/collectContentConfig/pageList', this.gatherContentList).then(res => {
        if (res.code == '000000') {
          this.showAllData = true;
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            v.updateUser = v.updateUser||v.createUser
            if(v.collectTimeType==10){
              v.collectTimeStart = collectTime(v.collectTimeStart,v.collectTimeEnd).startTime
              v.collectTimeEnd = collectTime(v.collectTimeStart,v.collectTimeEnd).endTime
              v.collectTime = "0:00 - 23:59"
            }else{
              v.collectTimeStart = collectTime(v.collectTimeStart,v.collectTimeEnd).startTime
              v.collectTimeEnd = collectTime(v.collectTimeStart,v.collectTimeEnd).endTime
              v.collectTime = v.collectTimeStart +" - "+ v.collectTimeEnd
            }
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
            v.collectSchedule = v.currentCollectNum+"/"+v.userContentTotal
          })
          this.gatherContentListData = res.data.rows
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
    // 新增
    handleAdd(){
      this.addGatherContentListVisible = true;
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
        this.editGatherContentListVisible = true;
        this.editGatherContentListForm.userName = this.selectRows[0].userName
        this.editGatherContentListForm.dailyCollectNum = this.selectRows[0].dailyCollectNum
        if(this.selectRows[0].collectTimeType==10){
          this.allDayEdit=true
        }else{
          this.allDayEdit=false
        }
        this.editGatherContentListForm.addStartTime = this.selectRows[0].collectTimeStart
        this.editGatherContentListForm.addEndTime = this.selectRows[0].collectTimeEnd
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
          this.$post(`common-web/collectContentConfig/delete`,{ids:ids}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.gatherContentList.pageNo == Math.max(1, Math.ceil(this.total / this.gatherContentList.pageSize))&&this.selectRows.length==this.gatherContentListData.length){
                this.gatherContentList.pageNo = 1;
              };
              this.getgatherContentListData()
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
      this.$post('common-web/collectContentConfig/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getgatherContentListData();
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    allDayChange(val){
      if(val==true){
        document.getElementsByClassName('startTime')[0].children[0].value='00:00'
        document.getElementsByClassName('endTime')[0].children[0].value='23:59'
        this.addGatherContentListForm.addStartTime = "00:00"
        this.addGatherContentListForm.addEndTime = "23:59"
      }else{
        document.getElementsByClassName('startTime')[0].children[0].value=''
        document.getElementsByClassName('endTime')[0].children[0].value=''
        this.addGatherContentListForm.addStartTime = ""
        this.addGatherContentListForm.addEndTime = ""
      }
    },
    allDayEditChange(val){
      if(val==true){
        this.editGatherContentListForm.addStartTime = "00:00"
        this.editGatherContentListForm.addEndTime = "23:59"
      }else{
        this.editGatherContentListForm.addStartTime = ""
        this.editGatherContentListForm.addEndTime = ""
      }
    },
    // 新增提交
    addGatherContentListSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading1 = true
          let addStartTime ="0"
          if(this.addGatherContentListForm.addStartTime == '00:00'||this.addGatherContentListForm.addStartTime == '0:00'){
            addStartTime="0"
          }else{
            addStartTime = this.addGatherContentListForm.addStartTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let addEndTime ="0"
          if(this.addGatherContentListForm.addEndTime == '00:00'||this.addGatherContentListForm.addEndTime == '0:00'){
            addEndTime="0"
          }else{
            addEndTime = this.addGatherContentListForm.addEndTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let collectTimeType;
          if(addStartTime=="0" && addEndTime=="2359"){
            collectTimeType=10
          }else{
            collectTimeType=20
          }
          let data ={
            userName:this.addGatherContentListForm.userName,
            dailyCollectNum:this.addGatherContentListForm.dailyCollectNum,
            collectTimeType:collectTimeType,
            collectTimeStart:addStartTime,
            collectTimeEnd:addEndTime
          }
          this.$post('common-web/collectContentConfig/save',data).then(res=>{
            this.loading1 = false
            if(res.code=='000000'){
              this.$message.success(res.message)
              this.handleClose()
              this.getgatherContentListData();
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
    editGatherContentListSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading2 = true
          let editStartTime ="0"
          if(this.editGatherContentListForm.addStartTime == '00:00'||this.editGatherContentListForm.addStartTime == '0:00'){
            editStartTime="0"
          }else{
            editStartTime = this.editGatherContentListForm.addStartTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let editEndTime ="0"
          if(this.editGatherContentListForm.addEndTime == '00:00'||this.editGatherContentListForm.addEndTime == '0:00'){
            editEndTime="0"
          }else{
            editEndTime = this.editGatherContentListForm.addEndTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let collectTimeType;
          if(editStartTime=="0" && editEndTime=="2359"){
            collectTimeType=10
          }else{
            collectTimeType=20
          }
          let data ={
            userName:this.editGatherContentListForm.userName,
            dailyCollectNum:this.editGatherContentListForm.dailyCollectNum,
            collectTimeType:collectTimeType,
            collectTimeStart:editStartTime,
            collectTimeEnd:editEndTime,
            id:this.selectRows[0].id
          }
          this.$post('common-web/collectContentConfig/update',data).then(res=>{
            this.loading2 = false;
            if(res.code=='000000'){
              this.$message.success(res.message)
              this.editGatherContentListVisible = false;
              this.getgatherContentListData();
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
    // 关闭
    handleClose(){
      this.allDay=false;
      this.$refs.addGatherContentListForm.clearValidate()
      this.$refs['addGatherContentListForm'].resetFields()
      document.getElementsByClassName('startTime')[0].children[0].value=''
      document.getElementsByClassName('endTime')[0].children[0].value=''
      this.addGatherContentListVisible=false;
    },
    computedTime(time){
      if(!time) return '00:00:00-23:59:59';
        let leftTime = '',timeArr = time.split(":"),left = Number(timeArr[0]),right = Number(timeArr[1])+1;
        if(right < 10){
            right = '0'+right;
            leftTime = left + ':' + right;
        }else if(right < 60){
            right = right;
            leftTime = left + ':' + right;
        }else{
            right = '00';
            left = left+1;
            if(left >= 24){
                leftTime = time;
            }else{
                if(left < 10){
                    left = '0'+left;
                }else{
                    left = left;
                }
                leftTime = left + ':' + right;
            }
        };
        return leftTime + ':00-23:59:59';
    },
  },
}
</script>
<style style="scss">
.gatherDialog .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width: 47%;
}
.gatherDialog .el-date-editor .el-input__inner{
  width: 100%;
}
.gatherDialog .el-checkbox:last-of-type{
  margin-right: 30px;
}
</style>

