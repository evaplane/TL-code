<template>
  <div class='inner'>
    <!-- 内容 -->
    <div class="content" style='margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content innerTitle" style='color:#606266'>新增</div></el-col>
          </el-row>
        <el-form :model="editRoleForm" :rules="editRoleRules" ref="editRoleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="角色名称: " prop="roleName">
              <el-input v-model="editRoleForm.roleName" autocomplete="off" placeholder="角色名称" ></el-input>
            </el-form-item>
            <!-- <el-form-item label="所属部门: " prop="deptName">
              <el-input autocomplete="off" readonly="readonly" style='width:300px;cursor: pointer;' placeholder="所属部门" class='readonlyInput' @click.native="selectDept" v-model="checkedDept.name"></el-input>
            </el-form-item> -->
           <el-form-item label="备注: " prop="remark">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editRoleForm.remark" autocomplete="off" placeholder="备注"></el-input>
            </el-form-item>
          </el-form>
          <!-- 功能权限树 -->
          <el-row class="rightsRow">
            <el-col :span="4"><div class="grid-content" style='color:#606266'>
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
                    <el-button @click="backToRole">返回</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button type="primary" @click="roleEditSubmit('editRoleForm')">确定</el-button>
            </div></el-col>
          </el-row>
    </div>
    <!-- 所属部门的dialog -->
    <el-dialog title="所属部门" :visible.sync="deptVisbile" width="20%">
          <el-tree 
            :data="editRoleForm.deptName" 
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
import {menuTree,tree,getArrEqual,getArrDifference,delSelectTag} from '../../../js/util'
import { setTimeout } from 'timers';
export default {
    name:'roleEdit',
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
            editRoleRules:{
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
            editRoleForm:{
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
            deptCheck:true,
            // 有children的menuId
            hasChildrenMenuIdList:[],
            // 有children的deptId
            hasChildrenDeptIdList:[],
            //返回的createTime
            createTime:'',
            currentQuery:''
        }
    },
    created(){
        this.getFeatureRight()
        this.getDeptRight()
        setTimeout(()=>{
            this.getRoleData();
        },100)
    },
    methods:{
        // 获取功能权限
        getFeatureRight(){
            this.$get('auth-web/sys/menu/list').then(res=>{
                if(res.code=='000000'){
                    this.featureTreeForm = menuTree(res.data)
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
        // 获取数据
        getRoleData(){
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
            this.$get(`auth-web/sys/role/info/${editData.id}`).then(res=>{
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
                    this.editRoleForm.roleName = res.data.roleName;
                    this.checkedDept.name = res.data.deptName;
                    this.editRoleForm.remark = res.data.remark
                    this.createTime = res.data.createTime
                }
            })
        },
        // 修改保存
        roleEditSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  // 获取功能树上的值
                  let checkedMenuKeys = this.$refs.featureTreeForm.getCheckedKeys();
                  let checkedMenuHalfKeys = this.$refs.featureTreeForm.getHalfCheckedKeys();
                  checkedMenuKeys = checkedMenuKeys.concat(checkedMenuHalfKeys);
                  // 获取数据树上的值
                  let checkedDeptKeys = []
                //   let checkedDeptKeys = this.$refs.dataTreeForm.getCheckedKeys();
                //   let checkedDeptHalfKeys = this.$refs.dataTreeForm.getHalfCheckedKeys();
                //   checkedDeptKeys = checkedDeptKeys.concat(checkedDeptHalfKeys);
                  const data = {deptId:this.checkedDept.deptId,
                                deptName:this.checkedDept.name,
                                menuIdList:checkedMenuKeys,
                                remark:this.editRoleForm.remark,
                                roleName:this.editRoleForm.roleName,
                                deptIdList:checkedDeptKeys,
                                roleId:this.$route.query.id,
                                createTime:this.createTime}
                this.$post("auth-web/sys/role/update",data).then(res=>{
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
                   this.editRoleForm.deptName = tree(res.data)
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
