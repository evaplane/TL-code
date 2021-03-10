<template>
  <div class='inner'>
    <!-- 内容 -->
    <div class="content" style='margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content innerTitle" style='color:#606266'>修改</div></el-col>
          </el-row>
        <el-form :model="editRuleForm" :rules="editRules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名: " prop="username">
              <el-input v-model="editRuleForm.username" autocomplete="off" placeholder="用户名" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="所属部门: " prop="deptName">
              <el-input autocomplete="off" readonly="readonly" style='cursor: pointer;' placeholder="所属部门" class='readonlyInput' @click.native="selectDept" v-model="checkedDept.name"></el-input>
            </el-form-item> -->
           <!-- <el-form-item label="密码: " prop="password">
              <el-input v-model="editRuleForm.password" autocomplete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码: " prop="confirmPassword">
              <el-input v-model="editRuleForm.confirmPassword" autocomplete="off" placeholder="确认密码"></el-input>
            </el-form-item> -->
            <el-form-item label="手机号码: " prop="mobile">
              <el-input v-model="editRuleForm.mobile" autocomplete="off" class='phoneInput' placeholder="手机号码"></el-input>
            </el-form-item>
             <el-form-item label="邮箱地址: " prop="email">
              <el-input v-model="editRuleForm.email" autocomplete="off" placeholder="邮箱地址"></el-input>
            </el-form-item>
            <el-form-item label="用户角色: " prop="roleId">
              <el-select v-model="roleId" placeholder="请选择" @change="changeRole">  
                <el-option v-for="item in editRuleForm.roleNames" :key="item.roleId" :label="item.roleName" :value="item.roleId"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="状态: ">
                <el-radio-group v-model="editRuleForm.status">
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">正常</el-radio>
                </el-radio-group>
            </el-form-item> -->
          </el-form>
          <!-- 功能权限树 -->
          <el-row class='rightsRow'>
            <el-col :span="4"><div class="grid-content" style='color:#606266'>
              <!-- <span style="font-weight:bold;">功能权限</span> -->
                <el-tree 
                    :data="featureTreeForm" 
                    ref="featureTreeForm" show-checkbox 
                    node-key="menuId" 
                    :props="defaultProps"
                    style="margin:20px 60px 0px;">
                </el-tree>     
            </div></el-col>
            <!-- 数据树 -->
            <!-- <el-col :span="4"><div class="grid-content" style='color:#606266'><span style="font-weight:bold;">数据权限</span>
                <el-tree 
                    :data="dataTreeForm"
                    ref="dataTreeForm" show-checkbox 
                    node-key="deptId" 
                    :props="defaultProps"
                    style="margin:20px 60px 0px;">
                </el-tree>     
            </div></el-col> -->
          </el-row>
           <el-row class='inner-button' style='margin-top:-70px;'>
            <el-col :span="2"><div class="grid-content">
                    <el-button plain @click="backToUser">返回</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button type="primary" @click="userUpdateSubmit('editRuleForm')">确定</el-button>
            </div></el-col>
          </el-row>
    </div>
    <!-- 所属部门的dialog -->
    <el-dialog title="所属部门" :visible.sync="deptVisbile" width="20%">
          <el-tree 
            :data="editRuleForm.deptName" 
            ref="treeForm" show-checkbox 
            default-expand-all node-key="deptId" 
            :props="defaultProps"  
            :check-strictly="deptCheck"   
            @check-change="handleClick">
           </el-tree>    
          <div slot="footer" class="dialog-footer">
            <el-button @click="deptVisbile = false">取 消</el-button>
            <el-button @click="getDeptName" type="primary">保存</el-button>
          </div>
    </el-dialog>
  </div>
</template>

<script>
import {tree,menuTree,getArrDifference,getArrEqual,delSelectTag} from '../../../js/util'
import { setTimeout } from 'timers';
export default {
    name:'userEdit',
    data(){
        var validatorUsername = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'));
            } else {
              var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,26}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-26位数字、字母或者中文'));
              }
              callback();
            }
        };
        var validatorPassword = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,24}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入6-24位数字、字母或者符号'));
              }
              callback();
            }
        };
        var validatorConfirmPassword = (rule, value, callback) => {
            if (value != this.editRuleForm.password) {
              callback(new Error('确认密码要和密码相同'));
            } else {
              callback();
            }
        };
        var validatorEmail = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入邮箱'));
            } else {
              var reg =  /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
              if (!reg.test(value)) {
                callback(new Error('邮箱格式不正确'));
              }
              callback();
            }
        };
        var validatorMobile = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入手机号码'));
            } else {
              // var reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
              // if (!reg.test(value)) {
              //   callback(new Error('手机号码格式不正确'));
              // }
              var reg = /^[0-9]{6,11}$/
              if(!reg.test(value)){
                callback(new Error('手机号码为6-11位数字'));
              }
              callback();
            }
        };
        var validatorDept = (rule, value, callback) => {
            if (this.checkedDept.name === '') {
              callback(new Error('请选择部门名称'));
            }else{
                callback();
            }
        };
        var validatorRole = (rule, value, callback) => {
            if (this.roleId === '') {
              callback(new Error('请选择角色名称'));
            }else{
                callback();
            }
        };
        return {
            // 新增校验规则
            editRules:{
                username: [
                    {required:true,trigger: "change",validator:validatorUsername }
                ],
                password: [
                    {required:true,trigger: "change",validator:validatorPassword}
                ],
                confirmPassword: [
                    {required:true,trigger: "change",validator:validatorConfirmPassword}
                ],
                email: [
                    {required:true,trigger: "change",validator:validatorEmail}
                ],
                mobile: [
                    {required:true,trigger: "change",validator:validatorMobile}
                ],
                deptName: [
                    {required:true,trigger: 'change',validator:validatorDept }
                ],
                roleId: [
                    {required:true,trigger: 'change',validator:validatorRole }
                ],
            },
            // 新增数据
            editRuleForm:{
                username:'',
                deptName:[],
                password:'',
                confirmPassword:'',
                mobile:'',
                email:'',
                roleNames:[],
                status:"1"
            },
            // 新增被选中的角色value
            roleId:'',
            // 被选中的角色label
            roleSelectName:'',
            // 显示所属部门
            deptVisbile:false,
            // 树的属性
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            // 被选中的部门数据
            checkedDept:{
                name:'',
                deptId:0
            },
            // 部门框是否关联父子节点
            deptCheck:true,
             // 功能权限
            featureTreeForm:[],
            // 数据权限
            dataTreeForm:[],
            currentQuery:''
        }
    },
    created(){
        this.getRole()
        this.getUserData(),
        this.getFeatureRight()
        this.getDeptRight()
    },
    mounted(){
      setTimeout(()=>{
        this.getRoleData(this.roleId)
      },500)
    },
    methods:{
        // 获取角色
        getRole(){
            this.$get('auth-web/sys/role/select').then(res=>{
                if(res.code=='000000'){
                    this.editRuleForm.roleNames = res.data
                }
            })
        },
        // 获取选中的角色名称
        changeRole(value){
            this.getRoleData(value)
            this.editRuleForm.roleNames.find((item)=>{
                if(item.roleId == value){
                    this.roleSelectName = item.roleName
                }
            }); 
        },
         // 获取数据
        getRoleData(roleId){
            this.$get(`auth-web/sys/role/info/${roleId}`).then(res=>{
                if(res.code=='000000'){
                    let halfMenuList = []
                    let MenuList = []
                    halfMenuList = getArrEqual(this.hasChildrenMenuIdList,res.data.menuIdList)
                    MenuList = getArrDifference(halfMenuList,res.data.menuIdList);
                    this.$refs.featureTreeForm.setCheckedKeys(MenuList);
                    let halfDeptList = []
                    let DeptList = []
                    halfDeptList = getArrEqual(this.hasChildrenDeptIdList,res.data.deptIdList)
                    DeptList = getArrDifference(halfDeptList,res.data.deptIdList);
                    // this.$refs.dataTreeForm.setCheckedKeys(DeptList);
                }
            })
        },
         // 获取功能权限
        getFeatureRight(){
            this.$get('auth-web/sys/menu/list').then(res=>{
                if(res.code=='000000'){
                    res.data.forEach(v=>{
                      v.disabled=true
                    })
                    this.featureTreeForm = menuTree(res.data)
                    // function traverse(obj) {
                    //   obj.forEach((v)=>{
                    //     if(v.children.length>0){
                    //       traverse(v.children)
                    //     }else{
                    //       v.disabled=true
                    //     }
                    //   })
                    // }
                    // traverse(this.featureTreeForm)
                    let hasChildrenMenuIdList = []
                    function getHasChildrenKeys(item) {
                        item.forEach(v => {
                          if (v.children.length>0) {
                            getHasChildrenKeys(v.children);
                            hasChildrenMenuIdList.push(v.menuId);
                          }
                        });
                        return hasChildrenMenuIdList
                    }
                    this.hasChildrenMenuIdList = getHasChildrenKeys(menuTree(res.data))
                }
            })
        },
        // 获取数据权限
        getDeptRight(){
            this.$get('auth-web/sys/dept/list').then(res=>{
               if(res.code=='000000'){
                   this.dataTreeForm = tree(res.data)
                    let hasChildrenDeptIdList = []
                    function getHasDeptChildrenKeys(item) {
                        item.forEach(v => {
                          if (v.children.length>0) {
                            getHasDeptChildrenKeys(v.children);
                            hasChildrenDeptIdList.push(v.deptId);
                          }
                        });
                        return hasChildrenDeptIdList
                    }
                    setTimeout(()=>{
                        this.hasChildrenDeptIdList = getHasDeptChildrenKeys(tree(res.data))
                    },100)
                    
               }
            })
        },  
        // 修改保存
        userUpdateSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  var roleIdList = [];
                  roleIdList.push(this.roleId)
                  const data = {deptId:this.checkedDept.deptId,
                                deptName:this.checkedDept.name,
                                email:this.editRuleForm.email,
                                mobile:this.editRuleForm.mobile,
                                password:this.editRuleForm.password,
                                roleIdList:roleIdList,
                                status:this.editRuleForm.status,
                                username:this.editRuleForm.username,
                                userId:this.$route.query.id}
                this.$post("auth-web/sys/user/update",data).then(res=>{
                    if(res.code=='000000'){
                        this.$message.success(res.message)
                        this.backToUser()
                    }
                })
              } else {
                this.$message.error('输入格式不正确');
                return false;
              }
            });
        },  
        // 返回
        backToUser(){
            delSelectTag(this.$route)
            this.$router.history.go(-1);
        },
        // 展示部门树
        selectDept(){
            this.deptVisbile=true;
             // 获取所属部门
             this.$get('auth-web/sys/dept/list').then(res=>{
                if(res.code=='000000'){
                  this.editRuleForm.deptName = tree(res.data)
                }
            })
        },
        // 设置只能单选
        handleClick(data, checked, node){
            if(checked == true){
                this.checkedId = data.id;
                this.$refs.treeForm.setCheckedNodes([data]);
            }
        },
        // 获取树上选中的值
        getDeptName(){
            this.checkedDept = this.$refs.treeForm.getCheckedNodes()[0];
            this.deptVisbile=false;
        },
        // 获取用户信息
        getUserData() {
          this.currentQuery = this.$store.state.tagsview.visitedviews.filter(v=>{
            if(v.path == this.$route.path){
              return v
            }
          })
          let editData = ''
          if(Object.keys(this.$route.query).length>0){
            let views = this.$store.state.tagsview.visitedviews
            for(let i = 0;i<views.length;i++){
                if(views[i].path == this.$route.path){
                  views[i] = {
                    name:this.$route.name,
                    path:this.$route.path,
                    query:this.$route.query,
                    params:this.$route.params,
                    title:this.$route.meta.title
                  }
              }
            }
            this.$store.state.tagsview.visitedviews = views
            editData = this.$route.query
          }else{
            editData = this.currentQuery[0].query
          }
          this.$get(`auth-web/sys/user/info/${editData.id}`).then(res => {
            if (res.code == '000000') {
                const data = res.data
                this.editRuleForm.username = data.username;
                this.checkedDept.name = data.deptName;
                this.checkedDept.deptId = data.deptId;
                this.editRuleForm.email = data.email;
                this.editRuleForm.mobile = data.mobile;
                this.editRuleForm.status = data.status.toString();
                this.roleId = data.roleIdList[0]
            }
          })
    },
    }
}
</script>

<style style='scss'>
    .readonlyInput>.el-input__inner{
        cursor: pointer;
        background-color: rgb(238, 238, 238);
    }
</style>
