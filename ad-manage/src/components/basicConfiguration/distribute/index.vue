<template>
  <div class='user'>
    <!-- 栅格 -->
    <el-row class='operation' style="padding-bottom:20px;">
      <el-col :span="8">
        <!-- 按钮 -->
        <el-button type="primary" size="medium" @click="handleAdd">新增</el-button>
        <el-button type="primary" size="medium" @click="handleEdit">修改</el-button>
        <el-button type="primary" size="medium" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 内容 -->
    <div class='content'>
        <!-- 表格 -->
      <el-table border :data="basisDistributeTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column type="index" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{(userData.pageNo - 1) * userData.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nodeArea" label="地区" show-overflow-tooltip></el-table-column>
        <el-table-column prop="nodeNetworkType" label="网络" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.nodeNetworkType == 10 ? '电信' :(scope.row.nodeNetworkType == 20 ? '移动' : '联通')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nodeIp" label="IP" width="160"></el-table-column>
        <el-table-column prop="nodeVersion" label="版本号" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <switchItem :val="scope.row.status" :id="scope.row.id" :reqUrl="'common-web/disNode/updateStatus'" @result="getDisnodeData"></switchItem>
            <!-- <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="statechange(scope.row)"></el-switch> -->
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updateTime" label="最后更新时间" width="180"></el-table-column>
        <el-table-column prop="updateUser" label="操作员" width="100"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          v-show="showPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userData.pageNo"
          :page-sizes="pageSizes"
          :page-size="userData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 新增 -->
      <el-dialog :title="basisDistributeForm.title" :visible.sync="addBasisDistributeVisible" class='addBasisDistribute gatherDialog' :before-close="closeDialog">
        <el-form :model="basisDistributeForm" label-width="100px" style='margin-top:10px;' :rules="basisDistributeRules" ref="basisDistributeForm">
          <el-form-item label="地区" class='linkage'  prop="countryName">
            <el-select v-model="basisDistributeForm.country.countryName" @change="changeCountry" style="width:33%">
                <el-option v-for="option in countryArr" :value="option.countryName" :key="option.id"></el-option>
            </el-select>
            <el-select v-model="basisDistributeForm.province.provinceName"  @change="changeProvince" style="width:32%">
                <el-option v-for="option in provinceArr" :value="option.provinceName" :key="option.id"></el-option>
            </el-select>
            <el-select v-model="basisDistributeForm.city.cityName"  @change="changeCity" style="width:33%">
                <el-option v-for="option in cityArr" :value="option.cityName" :key="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="网络" prop="netType">
              <el-select v-model="basisDistributeForm.netType" style="width:100%">
                <el-option v-for="item in netList" :value="item.value" :key="item.value" :label="item.label"></el-option>
            </el-select>
            <!-- <i class='fa fa-plus-square' @click='addNetVisible=true'></i> -->
          </el-form-item>
          <el-form-item label="IP" prop="validatorIP">
             <el-input v-model="basisDistributeForm.validatorIP" autocomplete="off" placeholder="对应服务器IP"></el-input>
          </el-form-item>
          <el-form-item label="版本号" prop="validatorEdition">
             <el-input v-model="basisDistributeForm.validatorEdition" autocomplete="off" placeholder="版本号"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="addBasisDistributeSubmit('basisDistributeForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {formatterDateTime} from '../../../js/util'
import { setTimeout } from 'timers';
import switchItem from '../../common/switchItem'
export default {
  name: 'basisDistribute',
  data() {
    var validatorIP = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入IP'));
      } else {
        var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
        if (!reg.test(value)) {
          callback(new Error('只能输入IP，如：0.0.0.0等'));
        }
        callback();
      }
    };
    var validatorEdition = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入版本号'));
      } else {
        var reg = /^\d+\.\d+\.\d+$/;
      //  var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,12}$/
        if (!reg.test(value)) {
          callback(new Error('只能输入版本号，如：1.0.0等'));
        }
        callback();
      }
    };
    var validatorArea = (rule, value, callback) => {
      callback();
    };
    return {
      // 搜索框
      userData: {
        pageNo:1,
        pageSize:10
      },
      // 表格信息
      basisDistributeTableData: [],
      // 总条数
      total:0,
      // 获取选中行
      selectRows:[],
      // 需要提交的数据
      basisDistributeForm:{
        // 国家对象
        country:{
          countryName:'',
          countryCode:''
        },
        id:'',
        title:'',
        // 省对象
        province: {
          provinceName:'',
          provinceCode:'',
        },
        // 市对象
        city: {
          cityName:'',
          cityCode:''
        },
        netType:'',
        validatorIP:'',
        validatorEdition:''
      },
      // 显示新增框
      addBasisDistributeVisible:false,
      // 重置密码规则
      basisDistributeRules:{
        countryName: [
          { required: true, message: '请选择地区',validator:validatorArea}
        ],
        netType: [
          { required: true, message: '请选择网络', trigger: 'change' }
        ],
        validatorIP: [
            {required: true,trigger: "change",validator:validatorIP}
        ],
        validatorEdition: [
            {required: true,trigger: "change",validator:validatorEdition}
        ]
      },
      countryArr: [],
      provinceArr: [],
      cityArr: [],
      // 网络
      netList:[
        {value:10,label:'电信'},
        {value:20,label:'移动'},
        {value:30,label:'联通'}
      ],
      netListValue:'',
      // 显示新增网络
      addNetVisible:false,
      // 显示修改框
      editBasisDistributeVisible:false,
      // 分页的数据
      pageSizes:[],
      // 展示分页
      showPage:false
    }
  },
  components:{
    switchItem
  },
  created() {
    const query = this.$route.query;
    this.userData.pageNo = Number(query.page)||1;
    this.userData.pageSize = Number(query.pageSize)||10;
    this.getDisnodeData();
    this.searchCountry();
  },
  methods: {
    // 改变页容量
    handleSizeChange(val) {
        this.userData.pageSize = val
        let query = JSON.parse(JSON.stringify(this.$route.query));
        query.pageSize = val;
        this.$router.replace({query:query});
        this.getDisnodeData()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.userData.pageNo= val;
      this.$router.replace('?page='+val);
      this.getDisnodeData()
    },
    // 监听国家改变
    changeCountry(name){
      this.countryArr.forEach((item)=>{
        if(item.countryName == name){
          this.basisDistributeForm.country.countryCode = item.countryCode;
          setTimeout(()=>{
            this.searchProvince(this.basisDistributeForm.country.countryCode);
          },0);
        }else{
          return;
        };
      });
    },
    // 监听省份
    changeProvince(name){
      this.provinceArr.forEach((item)=>{
        if(item.provinceName == name){
          this.basisDistributeForm.province.provinceCode = item.provinceCode;
          setTimeout(()=>{
            this.searchCity(this.basisDistributeForm.country.countryCode,this.basisDistributeForm.province.provinceCode);
          },0);
        }else{
          return;
        };
      });
    },
    // 监听城市
    changeCity(name){
      this.cityArr.forEach((item)=>{
        if(item.cityName == name){
          this.basisDistributeForm.city.cityCode = item.cityCode;          
        }else{
          return;
        };
      });
    },
    // 查询国家
    searchCountry() {
      this.$post('common-web/disNode/countryList').then(res => {
        if (res.code == '000000') {
          this.countryArr = res.data;
          console.log(res.data);
        }
      });
      return;
    },
    // 查询省份
    searchProvince(countryCode) {
      this.$post('common-web/disNode/provinceList',{
        countryCode:countryCode
      }).then(res => {
        if (res.code == '000000') {
          this.provinceArr = res.data;
          this.basisDistributeForm.province.provinceName = res.data[0].provinceName;
          this.basisDistributeForm.province.provinceCode = res.data[0].provinceCode;
          this.searchCity(this.basisDistributeForm.country.countryCode,this.basisDistributeForm.province.provinceCode);
        };
        return;
      })
    },
    // 查询城市
    searchCity(countryCode,provinceCode) {
      this.$post('common-web/disNode/cityList',{
        countryCode:countryCode,
        provinceCode:provinceCode
      }).then(res => {
        if (res.code == '000000') {
          this.cityArr = res.data;
          this.basisDistributeForm.city.cityName = res.data[0].cityName;
          this.basisDistributeForm.city.cityCode = res.data[0].cityCode;
          console.log(res.data);
        };
        return;
      })
    },
    // 获取分发节点信息
    getDisnodeData(flag) {
      if(flag){
        this.userData.pageNo = 1;
        this.$router.replace('?page=1');
      }
      this.$get('common-web/disNode/pageList', this.userData).then(res => {
        if (res.code == '000000') {
          res.data.rows.forEach(v=>{
            v.createTime = formatterDateTime(v.createTime)
            v.updateTime = formatterDateTime(v.updateTime)
            if(v.status==100){
              v.status=true
            }else{
              v.status=false
            }
          })
          this.basisDistributeTableData = res.data.rows
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
        }
      })
    },
    // 新增操作
    handleAdd(){
      this.basisDistributeForm.title = "新增";
      this.basisDistributeForm.id = null;
      this.addBasisDistributeVisible=true;
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
        this.basisDistributeForm.title = "修改";
        this.basisDistributeForm.id = this.selectRows[0].id;
        let nodeArea = this.selectRows[0].nodeArea.split(",");
        this.basisDistributeForm.country.countryName = nodeArea[0];
        this.basisDistributeForm.province.provinceName = nodeArea[1];
        this.basisDistributeForm.city.cityName = nodeArea[2];
        this.netList.forEach((item)=>{
          if(item.value == this.selectRows[0].nodeNetworkType){
            this.basisDistributeForm.netType = this.selectRows[0].nodeNetworkType;
          }
        });
        this.basisDistributeForm.validatorIP = this.selectRows[0].nodeIp;
        this.basisDistributeForm.validatorEdition = this.selectRows[0].nodeVersion;
        this.addBasisDistributeVisible=true;
        return;
      }
    },
    // 获取选中行的数据
    handleSelectionChange(val){
      this.selectRows = val
    },
    // 状态改变
    statechange(row){
      let status =0;
      if(row.status==true){
        status=100
      }else{
        status=-100
      }
      const data = {status:status,id:row.id}
      this.$post('common-web/disNode/updateStatus',data).then(res=>{
        if(res.code=='000000'){
          this.$message({
            type: "success",
            message: res.message
          });
          this.getDisnodeData();
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
      console.log('是否执行')
      this.addBasisDistributeVisible = false;
      this.$refs.basisDistributeForm.resetFields();
      // 手动清除
      this.basisDistributeForm.country.countryName = '';
      this.basisDistributeForm.province.provinceName = '';
      this.basisDistributeForm.city.cityName = '';
      this.basisDistributeForm.netType = null;
      this.basisDistributeForm.validatorIP = '';
      this.basisDistributeForm.validatorEdition = '';
    },
    // 提交表单
    addBasisDistributeSubmit(formName){
      console.log(this.basisDistributeForm.country.countryName)
      console.log(!this.basisDistributeForm.country.countryName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.basisDistributeForm)
          if(!this.basisDistributeForm.country.countryName){
            this.$refs[formName].fields[0].validateMessage = '请选择地区';
            this.$refs[formName].fields[0].validateState = 'error';
            return;
          };
          if(this.basisDistributeForm.title === "新增"){
            this.createdHandle({
              nodeCountry:this.basisDistributeForm.country.countryName,
              nodeProvince:this.basisDistributeForm.province.provinceName,
              nodeCity:this.basisDistributeForm.city.cityName,
              nodeNetworkType:this.basisDistributeForm.netType,
              nodeIp:this.basisDistributeForm.validatorIP,
              nodeVersion:this.basisDistributeForm.validatorEdition
            });
          }else{
            this.editHandle({
              id:this.basisDistributeForm.id,
              nodeCountry:this.basisDistributeForm.country.countryName,
              nodeProvince:this.basisDistributeForm.province.provinceName,
              nodeCity:this.basisDistributeForm.city.cityName,
              nodeNetworkType:this.basisDistributeForm.netType,
              nodeIp:this.basisDistributeForm.validatorIP,
              nodeVersion:this.basisDistributeForm.validatorEdition
            });
          };
        } else {
          this.$message.error('输入格式不正确');
          return false;
        }
      });
      if(!this.basisDistributeForm.country.countryName){
        this.$refs[formName].fields[0].validateMessage = '请选择地区';
        this.$refs[formName].fields[0].validateState = 'error';
      };
    },
    // 新增
    createdHandle(data){
      this.$post("common-web/disNode/save",data).then(res=>{
        if(res.code=='000000'){
          this.$message({
            message: '新增成功',
            type: 'success'
          });
          this.closeDialog();
          return this.getDisnodeData(1);
        }else{
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      });
    },
    // 修改
    editHandle(data){
      this.$post("common-web/disNode/update",data).then(res=>{
        if(res.code=='000000'){
          this.$message({
            message: '修改成功',
            type: 'success'
          });
          this.closeDialog();
          return this.getDisnodeData();
        }else{
          this.$message({
            message: res.message,
            type: 'warning'
          });
        }
      });
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
          let deleteArr =[];
          this.selectRows.forEach(v=>{
            deleteArr.push(v.id)
          })
          this.$post(`common-web/disNode/delete`,{ids: deleteArr.join(",")}).then(res=>{
          if(res.code=='000000'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getDisnodeData()
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
  },
}
</script>
<style style="scss">
.addBasisDistribute .el-dialog{
    width: 40%;
}
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
.linkage .el-select:nth-of-type(2) {
  margin:0 1%;
}
</style>

