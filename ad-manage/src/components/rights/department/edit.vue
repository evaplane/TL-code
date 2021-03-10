<template>
  <div>
    <!-- 内容 -->
    <div class="content" style='padding:0;margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content" style='color:#606266'>修改</div></el-col>
          </el-row>
        <el-form :model="editDeptForm" :rules="editDeptRules" ref="editDeptForm" label-width="100px" style="padding:30px" class="demo-ruleForm">
             <el-form-item label="部门名称: " prop="name">
              <el-input v-model="editDeptForm.name" autocomplete="off" style='width:300px;' placeholder="部门名称" ></el-input>
            </el-form-item>
            <el-form-item label="上级部门: " prop="parentDeptList">
              <el-input autocomplete="off" readonly="readonly" style='width:300px;cursor: pointer;' placeholder="上级部门" class='readonlyInput' @click.native="selectParentMenu" v-model="checkedParentDept.name"></el-input>
            </el-form-item>
            <el-form-item label="排序号: " prop="orderNum">
                <el-input-number v-model="editDeptForm.orderNum" controls-position="right" :min="0" :max="100"></el-input-number>
            </el-form-item>
          </el-form>
          <el-row>
            <el-col :span="2"><div class="grid-content"></div></el-col>
            <el-col :span="2"><div class="grid-content">
                <el-button type="primary" @click="deptEditSubmit('editDeptForm')">确定</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                <el-button plain @click="backToDept">返回</el-button>
            </div></el-col>
          </el-row>
    </div>
    <!-- 所属部门的dialog -->
    <el-dialog title="上级菜单" :visible.sync="deptParentVisbile" width="20%">
          <el-tree 
            :data="editDeptForm.parentDeptList" 
            ref="treeForm" show-checkbox 
            default-expand-all node-key="deptId" 
            :props="defaultProps"
            :check-strictly="deptCheck"   
            @check-change="handleClick"
            >
           </el-tree>    
          <div slot="footer" class="dialog-footer">
            <el-button @click="deptParentVisbile = false">取 消</el-button>
            <el-button @click="getDeptParent" type="primary">保存</el-button>
          </div>
    </el-dialog>
  </div>
</template>

<script>
import {tree,delSelectTag} from '../../../js/util'
export default {
    name:'deptEdit',
    data(){
        var validatorName = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入部门名称'));
            } else {
              var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,16}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-16位数字、字母或者中文'));
              }
              callback();
            }
        };
        var validatorparentDeptList = (rule, value, callback) => {
            if (this.checkedParentDept.name === '') {
              callback(new Error('请选择上级部门'));
            }else{
                callback();
            }
        };
        return {
            // 新增校验规则
            editDeptRules:{
                name: [
                    {required:true,trigger: "change",validator:validatorName }
                ],
                parentDeptList: [
                    {required:true,trigger: 'change',validator:validatorparentDeptList }
                ],
                orderNum:[
                    {required:true,trigger: "change"}
                ]
            },
            // 新增数据
            editDeptForm:{
                name:'',
                parentDeptList:[],
                orderNum:'1',
            },
            // 显示上级部门
            deptParentVisbile:false,
            // 树的属性
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            // 被选中的上级菜单
            checkedParentDept:{
                name:'',
                deptId:0
            },
            // tree是否显示父子关系
            deptCheck:true
        }
    },
    created(){
        // this.getDeptData();
        let data = this.$route.query
        this.editDeptForm.name = data.name;
        this.editDeptForm.orderNum = data.orderNum;
        this.checkedParentDept.name = data.parentName;
        this.checkedParentDept.deptId = data.parentId
    },
    methods:{
        // 返回
        backToDept(){
          delSelectTag(this.$route)
          this.$router.history.go(-1);
        },
        // 展示上级菜单树,只显示目录类型
        selectParentMenu(){
            this.deptParentVisbile=true;
             // 获取上级部门
             this.$get('auth-web/sys/dept/list').then(res=>{
                if(res.code=='000000'){
                    this.editDeptForm.parentDeptList = tree(res.data)
                }
            })
        },
        // 获取树上选中的值
        getDeptParent(){
            this.checkedParentDept = this.$refs.treeForm.getCheckedNodes()[0];
            this.deptParentVisbile=false;
        },
        // 设置只能单选
        handleClick(data, checked, node){
            if(checked == true){
                this.checkedId = data.id;
                this.$refs.treeForm.setCheckedNodes([data]);
            }
        },
        // 菜单修改保存
        deptEditSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  const data = {name:this.editDeptForm.name,
                                orderNum:this.editDeptForm.orderNum,
                                parentId:this.checkedParentDept.deptId,
                                parentName:this.checkedParentDept.name,
                                deptId:this.$route.query.deptId}
                this.$post("auth-web/sys/dept/update",data).then(res=>{
                    if(res.code=='000000'){
                      this.$message.success(res.message)
                      this.backToDept()
                    }else{
                      this.$message({
                        message: res.message,
                        type: 'warning'
                      });
                    }
                })
              } else {
                this.$message.error('输入格式不正确');
                return false;
              }
            });
        }, 
        // 获取部门信息
        // getDeptData(){
        //     this.$get(`auth-web/sys/dept/info/${this.$route.query.id}`).then(res=>{
        //         if(res.code=="000000"){
        //             this.editDeptForm.name = res.data.name;
        //             this.editDeptForm.orderNum = res.data.orderNum;
        //             this.checkedParentDept.name = res.data.parentName;
        //             this.checkedParentDept.deptId = res.data.parentId
        //         }
        //     })
        // } 
    }
}
</script>

<style style='scss'>
    .readonlyInput>.el-input__inner{
        cursor: pointer;
        background-color: rgb(238, 238, 238);
    }
    .el-input-number{
        width: 300px;
    }
    .el-input-number.is-controls-right .el-input-number__decrease{
        bottom: 2px;
        height: 18px;
    }
    .el-input-number.is-controls-right .el-input-number__increase{
        top: 3px;
        height: 18px;
    }
</style>
