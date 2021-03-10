<template>
  <div class='user'>
    <div v-if="showAllData">
    <!-- 栅格 -->
    <el-row class='operation'>
      <!-- 输入框 -->
      <el-col :span="5">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="登录账号:">
            <el-input placeholder="请输入登录账号" v-model="userData.userAccount" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="5">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="昵称:">
            <el-input placeholder="请输入昵称" v-model="userData.userName" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <!-- 按钮 -->
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectUser:pageList') > -1" size="medium"  @click='handleSearch'>查询</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectUser:save') > -1" size="medium"  @click="addGatherUserVisbile=true">新增</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectUser:update') > -1" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" v-if="this.$store.state.roleList.indexOf('collectUser:delete') > -1" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table ref="multipleTable" border :data="gatherUserTableData" tooltip-effect="dark" style="width: 100%" 
                @selection-change="handleSelectionChange" @row-dblclick="showDetail">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" label="序号" width="60" :resizable = "false">
          <template slot-scope="scope">
            <span>{{(userData.pageNo - 1) * userData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userAccount" label="登录账号" width="160" :resizable = "false"></el-table-column>
        <el-table-column prop="userId" label="用户ID" width="160" :resizable = "false"></el-table-column>
        <el-table-column prop="userName" label="昵称" width="160" :resizable = "false"></el-table-column>
        <el-table-column prop="fansCount" label="关注数量" width="100" :resizable = "false"></el-table-column>
        <el-table-column prop="status" label="状态" width="100" :resizable = "false">
          <template slot-scope="scope">
            <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch> -->
            <switchItem :val="scope.row.status" :disabled="statusDisabled" :id="scope.row.id" :reqUrl="'common-web/collectUser/updateStatus'" @result="getGatherUserData"></switchItem>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip :resizable = "false"></el-table-column>
        <el-table-column prop="collectTime" label="采集时间" width="120" :resizable = "false"></el-table-column>
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
          :current-page="userData.pageNo"
          :page-sizes="pageSizes"
          :page-size="userData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 新增框 -->
      <el-dialog title="新增" :visible.sync="addGatherUserVisbile" class='gatherDialog' :before-close="handleClose">
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading1?'100%':'1px',height:loading1?'100%':'1px'}" 
          v-loading="loading1"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="addGatherUserForm" label-width="100px" style='margin-top:10px;' :rules="addGatherUserRules" ref="addGatherUserForm">
          <el-form-item label="登录账号" prop="userAccount">
            <el-input v-model="addGatherUserForm.userAccount" autocomplete="off" placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
             <el-input v-model="addGatherUserForm.userPassword" autocomplete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="采集时间" prop="collectTime">
            <el-row type="flex" justify="space-between">
              <el-col :span="2"><el-checkbox v-model="allDay" @change="allDayChange">全天</el-checkbox></el-col>
              <el-col :span="22" style="justify-content: space-between;display: inline-flex;">
                <el-time-picker
                  v-model="addStartTime"
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
                  v-model="addEndTime"
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
          <el-button type="primary" @click="addGatherSubmit('addGatherUserForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改框 -->
      <el-dialog title="修改" :visible.sync="editGatherUserVisbile" class='gatherDialog'>
        <div style="width:100%;height:100%;position:absolute;z-index:1000;top:0;left:0;" 
          :style="{width:loading2?'100%':'1px',height:loading2?'100%':'1px'}" 
          v-loading="loading2"
          element-loading-text="正在请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.1)">
        </div>
        <el-form :model="editGatherUserForm" label-width="100px" style='margin-top:10px;' :rules="editGatherUserRules" ref="editGatherUserForm">
          <el-form-item label="登录账号" prop="userAccount">
            <el-input v-model="editGatherUserForm.userAccount" autocomplete="off" placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPassword">
             <el-input v-model="editGatherUserForm.userPassword" autocomplete="off" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item label="采集时间" prop="collectTime">
            <el-row type="flex" justify="space-between">
              <el-col :span="2"><el-checkbox v-model="allDayEdit" @change="allDayEditChange">全天</el-checkbox></el-col>
              <el-col :span="22" style="justify-content: space-between;display: inline-flex;">
                <el-time-picker
                  v-model="editStartTime"
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
                  v-model="editEndTime"
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
          <el-button @click="editGatherUserVisbile = false">取 消</el-button>
          <el-button type="primary" @click="editGatherSubmit('editGatherUserForm')">确 定</el-button>
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
import { log } from 'util';
import loginVue from '../../login/login.vue';
import switchItem from '../../common/switchItem'
export default {
  name: 'gatherUser',
  data() {
     var validateCollectTime = (rule, value, callback) => {
         if (!this.addStartTime) {
           callback(new Error('请选择起始时间'));
         } else if(!this.addEndTime){
            callback(new Error('请选择结束时间'));
         }else {
           callback();
         }
     };
     var validateEditCollectTime = (rule, value, callback) => {
         if (!this.editStartTime) {
           callback(new Error('请选择起始时间'));
         } else if(!this.editEndTime){
            callback(new Error('请选择结束时间'));
         }else {
           callback();
         }
     };
     var userAccount = (rule, value, callback) => {
         if (value=='') {
           callback(new Error('请输入登录账号'));
         } else{
           var reg1 =  /[\u4e00-\u9fa5]/
           var reg2 =  /\s/
           var reg3 = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/
            if (reg1.test(value) || reg2.test(value) || reg3.test(value)) {
              callback(new Error('登录账号不可以输入中文、表情或者空格'));
            }else if(value.length>20){
              callback(new Error('登录账号长度小于20位'));
            }
            callback();
         }
     };
     var userPassword = (rule, value, callback) => {
         if (value=='') {
           if(this.editGatherUserVisbile){
             callback();
           }else{
              callback(new Error('请输入密码'));
           };
         } else if(this.editEndTime==''){
            var reg =  /^[^\u4e00-\u9fa5]{6,200}$/
            if (!reg.test(value)) {
              callback(new Error('密码格式不正确'));
            }
            callback();
         }else{
           callback();
         }
     };
    return {
      showAllData:false,
      showErrorDom:null,
      loading1:false,
      loading2:false,
      // 搜索框
      userData: {
        userAccount:'',
        userName: '',
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      gatherUserTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 新增框
      addGatherUserForm:{
        userAccount:'',
        userPassword:''
      },
      // 修改框数据
      editGatherUserForm:{
        userAccount:'',
        userPassword:''
      },
      // 显示重置密码框
      addGatherUserVisbile:false,
      // 新增规则
      addGatherUserRules:{
        userAccount: [
          {required:true,trigger: "change",validator: userAccount}
        ],
        collectTime: [
          {required:true,trigger: "change",validator: validateCollectTime}
        ],
        userPassword: [
          {required:true,trigger: "change",validator: userPassword}
        ]
      },
      // 修改规则
      editGatherUserRules:{
        userAccount: [
          {required:true,trigger: "change",validator: userAccount}
        ],
        collectTime: [
          {required:true,trigger: "change",validator: validateEditCollectTime}
        ],
        userPassword: [
          {trigger: "change",validator: userPassword}
        ]
      },
      // 新增采集时间
      allDay:false,
      // 新增时间
      addEndTime:'',
      addStartTime:'',
      // 修改时间
      editEndTime:'',
      editStartTime:'',
      // 修改框
      editGatherUserVisbile:false,
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
    this.statusDisabled = this.$store.state.roleList.indexOf('collectUser:updateStatus') == -1;
    const query = this.$route.query;
    this.userData.pageNo = Number(query.page)||1;
    this.userData.pageSize = Number(query.pageSize)||10;
    this.userData.userAccount = query.userAccount;
    this.userData.userName = query.userName;
    this.getGatherUserData();
  },
  computed:{
    addSelectableRange(){
      if(this.addEndTime == '23:59'){
        if(this.addStartTime === '00:00'||this.addStartTime === '0:00'){
          this.allDay = true;
        }else{
          this.allDay = false;
        }
      }else{
        this.allDay = false;
      };
      return this.computedTime(this.addStartTime);
    },
    editSelectableRange(){
      if(this.editEndTime == '23:59'){
        if(this.editStartTime === '00:00'||this.editStartTime === '0:00'){
          this.allDayEdit = true;
        }else{
          this.allDayEdit = false;
        }
      }else{
        this.allDayEdit = false;
      };
      return this.computedTime(this.editStartTime);
    }
  },
  components:{
    switchItem
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.userData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getGatherUserData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.userData.pageNo= val;
      let query = JSON.parse(JSON.stringify(this.$route.query));
      query.page = val;
      this.$router.replace({query:query});
      this.getGatherUserData()
    },
    // 获取用户
    getGatherUserData(type) {
      let query = JSON.parse(JSON.stringify(this.$route.query));
      if(type){
        this.userData.pageNo = 1;
        query.page = 1;
      };
      query.userAccount = this.userData.userAccount;
      query.userName = this.userData.userName;
      this.$router.replace({query:query});
      this.$post('common-web/collectUser/pageList', this.userData).then(res => {
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
          })
          this.gatherUserTableData = res.data.rows
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
      this.getGatherUserData(1)
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
        this.editGatherUserVisbile=true;
        this.editGatherUserForm.userAccount = this.selectRows[0].userAccount
        if(this.selectRows[0].collectTimeType==10){
          this.allDayEdit=true
        }else{
          this.allDayEdit=false
        }
        this.editStartTime = this.selectRows[0].collectTimeStart
        this.editEndTime = this.selectRows[0].collectTimeEnd
      }
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 状态改变
    statechange(row){
      let status =100;
      if(row.status==true){
        status=100
      }else{
        status=-100
      }
      const data = {status:status,id:row.id}
      this.$post('common-web/collectUser/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message.success(res.message)
          this.getGatherUserData();
        }else{
          this.$message.warning(res.message)
        }
      })
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
          this.$post(`common-web/collectUser/delete`,{ids,ids}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              if(this.userData.pageNo == Math.max(1, Math.ceil(this.total / this.userData.pageSize))&&this.selectRows.length==this.gatherUserTableData.length){
                this.userData.pageNo = 1;
              };
              this.getGatherUserData()
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
    allDayChange(val){
      if(val==true){
        document.getElementsByClassName('startTime')[0].children[0].value='00:00'
        document.getElementsByClassName('endTime')[0].children[0].value='23:59'
        this.addStartTime = "00:00"
        this.addEndTime = "23:59"
      }else{
        document.getElementsByClassName('startTime')[0].children[0].value=''
        document.getElementsByClassName('endTime')[0].children[0].value=''
        this.addStartTime = ""
        this.addEndTime = ""
      }
    },
    allDayEditChange(val){
      if(val==true){
        this.editStartTime = "00:00"
        this.editEndTime = "23:59"
      }else{
         this.editStartTime = ""
        this.editEndTime = ""
      }
    },
    // 新增提交
    addGatherSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading1 = true
          let addStartTime ="0"
          if(this.addStartTime == '00:00'||this.addStartTime == '0:00'){
            addStartTime="0"
          }else{
            addStartTime = this.addStartTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let addEndTime ="0"
          if(this.addEndTime == '00:00'||this.addEndTime == '0:00'){
            addEndTime="0"
          }else{
            addEndTime = this.addEndTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let collectTimeType;
          if(addStartTime=="0" && addEndTime=="2359"){
            collectTimeType=10
          }else{
            collectTimeType=20
          }
          let data ={
            userAccount:this.addGatherUserForm.userAccount,
            userPassword:this.addGatherUserForm.userPassword,
            collectTimeType:collectTimeType,
            collectTimeStart:addStartTime,
            collectTimeEnd:addEndTime
          }
          this.$post('common-web/collectUser/save',data).then(res=>{
            this.loading1 = false
            if(res.code=='000000'){
              this.$message.success(res.message)
              this.handleClose()
              this.getGatherUserData();
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
    editGatherSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading2 = true;
          let editStartTime ="0"
          if(this.editStartTime == '00:00'||this.editStartTime == '0:00'){
            editStartTime="0"
          }else{
            editStartTime = this.editStartTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let editEndTime ="0"
          if(this.editEndTime == '00:00'||this.editEndTime == '0:00'){
            editEndTime="0"
          }else{
            editEndTime = this.editEndTime.toString().replace(/:/,'').replace(/^0+/g,'')
          }
          let collectTimeType;
          if(editStartTime=="0" && editEndTime=="2359"){
            collectTimeType=10
          }else{
            collectTimeType=20
          }
          let data ={
            userAccount:this.editGatherUserForm.userAccount,
            userPassword:this.editGatherUserForm.userPassword,
            collectTimeType:collectTimeType,
            collectTimeStart:editStartTime,
            collectTimeEnd:editEndTime,
            id:this.selectRows[0].id
          }
          this.$post('common-web/collectUser/update',data).then(res=>{
            this.loading2 = false;
            if(res.code=='000000'){
              this.$message.success(res.message)
              this.editGatherUserVisbile = false;
              this.getGatherUserData();
            }else{
              this.$message.warning(res.message)
            }
          })
        } else {
          console.log(111)
          this.$message.error('输入格式不正确');
          return false;
        }
      });
    },
    // 去详情
    showDetail(row){
      if(this.$store.state.roleList.indexOf('collectUser:update') == -1){
        return;
      };
      if(row.userId){
        this.$router.push({path:'/modules/gather/userDetail.html',query:{...row}})
      }else{
        this.$message.warning("未采集到该用户ID")
      };
    },
    // 关闭
    handleClose(){
      this.$refs.addGatherUserForm.clearValidate()
      this.allDay=false;
      this.$refs['addGatherUserForm'].resetFields()
      document.getElementsByClassName('startTime')[0].children[0].value=''
      document.getElementsByClassName('endTime')[0].children[0].value=''
      this.addGatherUserVisbile=false;
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
<style lang="scss">
.gatherDialog .el-date-editor.el-input, .el-date-editor.el-input__inner{
  width:47%;
}
.gatherDialog .el-date-editor .el-input__inner{
  width: 100%;
}
</style>

