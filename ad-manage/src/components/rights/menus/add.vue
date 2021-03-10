<template>
  <div class='inner'>
    <!-- 内容 -->
    <div class="content" style='margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content innerTitle" style='color:#606266'>新增</div></el-col>
          </el-row>
        <el-form :model="addMenuForm" :rules="addMenuRules" ref="addMenuForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="类型: ">
                <el-radio-group v-model="addMenuForm.type" @change = 'changeMenu'>
                    <el-radio label="0">目录</el-radio>
                    <el-radio label="1">菜单</el-radio>
                    <el-radio label="2">按钮</el-radio>
                </el-radio-group>
             </el-form-item>
             <div v-if="addMenuForm.type=='0'">
              <el-form-item label="目录名称: " prop="name">
                <el-input v-model="addMenuForm.name" autocomplete="off" placeholder="目录名称" ></el-input>
              </el-form-item>
            </div>
             <div v-if="addMenuForm.type=='1'">
              <el-form-item label="菜单名称: " prop="name">
                <el-input v-model="addMenuForm.name" autocomplete="off" placeholder="菜单名称" ></el-input>
              </el-form-item>
             </div>
              <div v-if="addMenuForm.type=='2'">
             <el-form-item label="按钮名称: " prop="name">
              <el-input v-model="addMenuForm.name" autocomplete="off" placeholder="按钮名称" ></el-input>
            </el-form-item>
            </div>
            <div v-if="addMenuForm.type!='0'">
              <el-form-item label="上级菜单: " prop="parentMenuList">
                <el-input autocomplete="off" readonly="readonly" style='cursor: pointer;' placeholder="上级菜单" class='readonlyInput' @click.native="selectParentMenu" v-model="checkedParentMenu.name"></el-input>
              </el-form-item>
            </div>
             <div v-if="addMenuForm.type=='1'">
                <el-form-item label="菜单URL: " prop="url">
                   <el-input v-model="addMenuForm.url" autocomplete="off" placeholder="菜单URL"></el-input>
                 </el-form-item>
             </div>
             <div v-if="addMenuForm.type=='1' || addMenuForm.type=='2'">
                 <el-form-item label="授权标识: " prop="perms">
                   <el-input autocomplete="off" readonly="readonly" style='cursor: pointer;' placeholder="授权标识" class='readonlyInput' @click.native="selectParentMenuPerms" v-model="checkedParentMenuPerms.name"></el-input>
                 </el-form-item>
             </div>
             <div v-if="addMenuForm.type=='1' || addMenuForm.type=='0'">
                  <el-form-item label="排序号: " prop="orderNum">
                     <el-input-number v-model="addMenuForm.orderNum" controls-position="right" :min="0" :max="100"></el-input-number>
                 </el-form-item>
                 <el-form-item label="图标: " prop="icon">
                   <el-input v-model="addMenuForm.icon" autocomplete="off" placeholder="菜单图标"></el-input>
                   <span style="color:#F56C6C;cursor:pointer" @click="openFonts">获取图标</span>
                 </el-form-item> 
            </div>
          </el-form>
          <el-row class='inner-button'>
            <el-col :span="2"><div class="grid-content">
                    <el-button plain @click="backToMenu">返回</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button type="primary" @click="menuAddSubmit('addMenuForm')">确定</el-button>
            </div></el-col>
          </el-row>
    </div>
    <!-- 所属部门的dialog -->
    <el-dialog title="上级菜单" :visible.sync="menuParentVisbile" width="20%">
          <el-tree 
            :data="addMenuForm.parentMenuList" 
            ref="treeForm" show-checkbox 
            default-expand-all node-key="menuId" 
            :props="defaultProps"  
            @check-change="handleClick">
           </el-tree>    
          <div slot="footer" class="dialog-footer">
            <el-button @click="menuParentVisbile = false">取 消</el-button>
            <el-button @click="getMenuParent" type="primary">保存</el-button>
          </div>
    </el-dialog>
    <!-- 图标的dialog -->
    <el-dialog title="图标" :visible.sync="fontVisible" width="40%" classs='fontsDialog'>
        <div class="row fontawesome-icon-list" style="height: 365px;">
          <el-col :span="3" v-for="item in this.$params.FONTS" :key="item.id" @click.native="getFont(item)" :class="item==isFontActive?active:''"><i :class="item.name" aria-hidden="true"></i></el-col>
        </div>
        <div clas='moreFonts' style='height:20px;'>
          <el-col :span='3' style='float:right;'>
            <el-link type="danger" :underline="false" href="http://www.fontawesome.com.cn/faicons/" target="_blank" style="margin-right:10px;float:right;width:60px">更多图标</el-link>
          </el-col>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="fontVisible = false">取 消</el-button>
          <el-button type="primary" @click="getFontClassName">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="授权标识" :visible.sync="sysVisbile" width="20%">
      <el-tree 
        :data="addMenuForm.permsList" 
        ref="treeFormPerms"
        show-checkbox
        :check-strictly='true'
        default-expand-all
        node-key="permId"
        @check='nodePermsClick'
        :props="defaultPropsPerms"
        @node-click="nodePermsClick"
        @check-change="handlePermsClick">
        </el-tree>    
      <div slot="footer" class="dialog-footer">
        <el-button @click="sysVisbile = false">取 消</el-button>
        <el-button @click="getMenuPermsParent" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {menuTree,disabledTree,permsTree,delSelectTag} from '../../../js/util'
export default {
    name:'menuAdd',
    data(){
        var validatorName = (rule, value, callback) => {
          let name = '菜单'
          if(this.addMenuForm.type=='0'){
            name = '目录'
          }else if(this.addMenuForm.type=='1'){
            name = '菜单'
          }else if(this.addMenuForm.type=='2'){
            name = '按钮'
          }   
            if (value === '') {
              callback(new Error('请输入'+name+'名称'));
            } else {
              var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{1,26}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入1-26位数字、字母或者中文'));
              }
              callback();
            }
        };
        var validatorUrl = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入URL'));
            } else {
              callback();
            }
        };
        var validatorPerms = (rule, value, callback) => {
            if (this.checkedParentMenuPerms.name === '') {
              callback(new Error('请选择授权标识'));
            }else{
                callback();
            }
        };
        var validatorParentMenuList = (rule, value, callback) => {
            if (this.checkedParentMenu.name === '') {
              callback(new Error('请选择上级菜单'));
            }else{
                callback();
            }
        };
        return {
            // 新增校验规则
            addMenuRules:{
                name: [
                    {required:true,trigger: "change",validator:validatorName }
                ],
                url: [
                    {required:true,trigger: "change",validator:validatorUrl}
                ],
                perms: [
                    {required:true,trigger: "change",validator:validatorPerms}
                ],
                parentMenuList: [
                    {required:true,trigger: 'change',validator:validatorParentMenuList }
                ],
                orderNum: [
                    {required:true,trigger: 'change',message:'请输入排序号'}
                ],
            },
            // 新增数据
            addMenuForm:{
                name:'',
                parentMenuList:[],
                url:'',
                orderNum:'1',
                perms:'',
                icon:'',
                type:"1",
                permsList:[]
            },
            // 显示上级菜单
            menuParentVisbile:false,
            // 树的属性
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            // 被选中的上级菜单
            checkedParentMenu:{
                name:'',
                menuId:0
            },
            // 展示图标
            fontVisible:false,
            isFontActive:'',
            active:'active',
            sysVisbile:false,
            // 树的属性
            defaultPropsPerms: {
                children: 'children',
                label: 'name'
            },
            // 被选中的上级菜单
            checkedParentMenuPerms:{
                name:'',
                menuId:0
            },
        }
    },
    created(){
      console.log(this.checkedParentMenuPerms);
    },
    methods:{
        // 返回
        backToMenu(){
          delSelectTag(this.$route)
          this.$router.history.go(-1);
        },
        // 展示上级菜单树,只显示目录类型
        selectParentMenu(){
             // 获取上级菜单
             this.$get('auth-web/sys/menu/select').then(res=>{
                if(res.code=='000000'){
                    if(this.addMenuForm.type==1){
                      // 菜单
                      const newData1 = res.data.filter(v=>
                        v.type==0
                      )
                      this.menuParentVisbile=true;
                      this.addMenuForm.parentMenuList = newData1
                    }else if(this.addMenuForm.type==0){
                      // 目录
                      const newData0 = res.data.filter(v=>
                          v.menuId==0
                      )
                      this.checkedParentMenu = newData0
                      this.menuParentVisbile=false;
                      this.$alert('没有上级菜单', {
                        confirmButtonText: '确定',
                        callback: action => {
                          // this.$message({
                          //   type: 'info',
                          //   message: `action: ${ action }`
                          // });
                        }
                      });
                      this.addMenuForm.parentMenuList = newData0
                    }else if(this.addMenuForm.type==2){
                      // 按钮
                      const data2 = res.data.filter(v=>{
                        return v.parentId!=-1
                      })
                      menuTree(data2).forEach(v=>{
                        if(v.children.length>0){
                          v.disabled=true
                        }else{
                          v.disabled=false
                        }
                      })
                      const newData2 = menuTree(data2)
                      this.menuParentVisbile=true;
                      this.addMenuForm.parentMenuList = newData2
                    }
                }  
            })
        },
        // 获取树上选中的值
        getMenuParent(){
          console.log(this.$refs.treeForm.getCheckedNodes()[0]);
            this.checkedParentMenu = this.$refs.treeForm.getCheckedNodes()[0];
            this.menuParentVisbile=false;
        },
        // 设置只能单选
        handleClick(data, checked, node){
            if(checked == true){
                this.checkedId = data.id;
                this.$refs.treeForm.setCheckedNodes([data]);
            }
        },
        // 设置标识树只能单选
        handlePermsClick(data, checked, node){
            if(checked == true){
              console.log(1);
                // this.checkedId = data.id;
                // this.$refs.treeFormPerms.setCheckedNodes([data]);
            }
        },
        nodePermsClick(item,node,self){
          console.log(item);
          this.checkedPermsId = item.permId;
          console.log(this.$refs.treeFormPerms.setCheckedKeys)
          this.$refs.treeFormPerms.setCheckedKeys([item.permId]);
        },
        // 展示上级菜单树,只显示目录类型
        selectParentMenuPerms(){
          // 获取上级菜单
          this.$get('auth-web/sys/perm/select').then(res=>{
            if(res.code=='000000'){
              const data2 = res.data.filter(v=>{
                return v.parentId!=-1
              })
              permsTree(data2).forEach(v=>{
                if(v.children.length>0){
                  v.disabled=true
                }else{
                  v.disabled=false
                }
              })
              const newData2 = permsTree(data2)
              this.sysVisbile=true;
              this.addMenuForm.permsList = newData2
            }  
        })
        },
        // 获取标识树选中的值
        getMenuPermsParent(){
            this.checkedParentMenuPerms = this.$refs.treeFormPerms.getCheckedNodes()[0];
            this.sysVisbile=false;
        },
        // 菜单新增保存
         menuAddSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.addMenuForm.type=='0'){
                  this.checkedParentMenu.menuId=0
                  this.checkedParentMenu.name=''
                }

                const data = {
                  type:parseInt(this.addMenuForm.type),
                  name:this.addMenuForm.name,
                  orderNum:this.addMenuForm.orderNum,
                  parentId:this.checkedParentMenu.menuId,
                  parentName:this.checkedParentMenu.name,
                  icon:this.addMenuForm.icon,
                  url:this.addMenuForm.url,
                  perms:this.checkedParentMenuPerms.perms
                };
                this.$post("auth-web/sys/menu/save",data).then(res=>{
                    if(res.code=='000000'){
                      this.$message.success(res.message)
                      this.$get('auth-web/sys/menu/nav').then(res=>{
                          this.$store.commit('changeMenuList',res.data)
                      });
                      this.backToMenu();
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
        // 切换菜单名称
        changeMenu(){
          this.$refs.addMenuForm.clearValidate()
        },
        // 获取font的class
        getFont(item){
          this.isFontActive=item
        },
        // 点击确定
        getFontClassName(){
          if(this.isFontActive==''){
            this.$message.warning('请选择图标')
            return
          }
          this.fontVisible = false;
          this.addMenuForm.icon = this.isFontActive.name
        },
        openFonts(){
          this.fontVisible = true
          this.isFontActive = ''
        }
    }
}
</script>

<style lang='scss'>
    .readonlyInput>.el-input__inner{
        cursor: pointer;
        background-color: rgb(238, 238, 238);
    }
    .el-input-number.is-controls-right .el-input-number__decrease{
        bottom: 2px;
        height: 18px;
    }
    .el-input-number.is-controls-right .el-input-number__increase{
        top: 3px;
        height: 18px;
    }
    .fontawesome-icon-list{
      .el-col{
        text-align: center;
        .fa{
          cursor: pointer;
          font-size: 16px;
          line-height: 26px;
        }
        &:hover{
          background-color: #409EFF;
          .fa{
            color: #fff;
          }
        }
        &.active{
          background-color: #409EFF;
          .fa{
            color: #fff;
          }
        }
      }
    }
</style>
