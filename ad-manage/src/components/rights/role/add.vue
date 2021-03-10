<template>
  <div class='inner'>
    <!-- 内容 -->
    <div class="content" style='margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content innerTitle" style='color:#606266'>新增</div></el-col>
          </el-row>
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称: " prop="roleName">
              <el-input v-model="addRoleForm.roleName" autocomplete="off" placeholder="角色名称" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="所属部门: " prop="deptName">
              <el-input autocomplete="off" readonly="readonly" style='cursor: pointer;' placeholder="所属部门" class='readonlyInput' @click.native="selectDept" v-model="checkedDept.name"></el-input>
            </el-form-item> -->
           <el-form-item label="备注: " prop="remark">
              <el-input  type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addRoleForm.remark" autocomplete="off" placeholder="备注"></el-input>
            </el-form-item>
          </el-form>
          <!-- 功能权限树 -->
          <el-row class="rightsRow">
            <el-col :span="5"><div class="grid-content" style='color:#606266'>
                <span style="font-weight:bold;margin-left: -56px;">功能权限</span>
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
          <el-row class='inner-button'>
            <el-col :span="2"><div class="grid-content">
                    <el-button plain @click="backToRole">返回</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button type="primary" @click="roleAddSubmit('addRoleForm')">确定</el-button>
            </div></el-col>
          </el-row>
    </div>
    <!-- 所属部门的dialog -->
    <el-dialog title="所属部门" :visible.sync="deptVisbile" width="20%">
          <el-tree 
            :data="addRoleForm.deptName" 
            ref="treeForm" show-checkbox 
            default-expand-all node-key="deptId" 
            :props="defaultProps"  
            @check-change="handleClick"
            :check-strictly="deptCheck">
           </el-tree>    
          <div slot="footer" class="dialog-footer">
            <el-button @click="deptVisbile = false">取 消</el-button>
            <el-button @click="getDeptName" type="primary">保存</el-button>
          </div>
    </el-dialog>
  </div>
</template>

<script>
import {menuTree,tree,delSelectTag} from '../../../js/util'
export default {
    name:'roleAdd',
    data(){
        var validatorRoleName = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入角色名称'));
            } else {
              var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,26}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-26位数字、字母或者中文'));
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
        var validatorRemark = (rule, value, callback) => {
            if (value.length>256) {
              callback(new Error('只能输入256位以下'));
            }else{
                callback();
            }
        };
        return {
            // 新增校验规则
            addRoleRules:{
                roleName: [
                    {required:true,trigger: "change",validator:validatorRoleName }
                ],
                remark: [
                    {trigger: "change",validator:validatorRemark}
                ],
                deptName: [
                    {required:true,trigger: 'change',validator:validatorDept }
                ]
            },
            // 新增数据
            addRoleForm:{
                roleName:'',
                deptName:[],
                remark:''
            },
            // 显示所属部门
            deptVisbile:false,
            // 部门树的属性
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            // 被选中的部门数据
            checkedDept:{
                name:'',
                deptId:0
            },
            // 功能权限
            featureTreeForm:[],
            // 数据权限
            dataTreeForm:[],
            // 部门树父子节点之间的关系
            deptCheck:true
        }
    },
    created(){
        this.getFeatureRight()
        this.getDeptRight()
    },
    methods:{
        // 获取功能权限
        getFeatureRight(){
            this.$get('auth-web/sys/menu/list').then(res=>{
                if(res.code=='000000'){
                    this.featureTreeForm = menuTree(res.data)
                }
            })
        },
        // 获取所属部门
        getDeptRight(){
            this.$get('auth-web/sys/dept/list').then(res=>{
               if(res.code=='000000'){
                   this.dataTreeForm = tree(res.data)
               }
            })
        },  
        // 新增保存
        roleAddSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  // 获取功能树上的值
                  let checkedMenuKeys = this.$refs.featureTreeForm.getCheckedKeys();
                  let checkedMenuHalfKeys = this.$refs.featureTreeForm.getHalfCheckedKeys();
                  checkedMenuKeys = checkedMenuKeys.concat(checkedMenuHalfKeys);
                  // 获取数据树上的值
                  let checkedDeptKeys=[]
                  // let checkedDeptKeys = this.$refs.dataTreeForm.getCheckedKeys();
                  // let checkedDeptHalfKeys = this.$refs.dataTreeForm.getHalfCheckedKeys();
                  // checkedDeptKeys = checkedDeptKeys.concat(checkedDeptHalfKeys);
                  const data = {deptId:this.checkedDept.deptId,
                                deptName:this.checkedDept.name,
                                menuIdList:checkedMenuKeys,
                                remark:this.addRoleForm.remark,
                                roleName:this.addRoleForm.roleName,
                                deptIdList:checkedDeptKeys}
                this.$post("auth-web/sys/role/save",data).then(res=>{
                    if(res.code=='000000'){
                        this.$message.success(res.message)
                        this.backToRole()
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
        // 返回
        backToRole(){
            delSelectTag(this.$route)
            this.$router.history.go(-1);
        },
        // 展示部门树
        selectDept(){
            this.deptVisbile=true;
            this.$get('auth-web/sys/dept/list').then(res=>{
               if(res.code=='000000'){
                   this.addRoleForm.deptName = tree(res.data)
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
        // 获取部门树上选中的值
        getDeptName(){
            this.checkedDept = this.$refs.treeForm.getCheckedNodes()[0];
            this.deptVisbile=false;
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
