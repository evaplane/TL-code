<template>
  <div class='inner'>
    <!-- 内容 -->
    <div class="content" style='margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content innerTitle" style='color:#606266'>修改</div></el-col>
          </el-row>
        <el-form :model="editMenuForm" :rules="editMenuRules" ref="editMenuForm" label-width="100px" class="demo-ruleForm">
             <el-form-item label="类型: ">
                <el-radio-group v-model="editMenuForm.type" @change = 'changeMenu'>
                    <el-radio label="0">目录</el-radio>
                    <el-radio label="1">菜单</el-radio>
                    <el-radio label="2">按钮</el-radio>
                </el-radio-group>
             </el-form-item>
             <div v-if="editMenuForm.type=='0'">
                <el-form-item label="目录名称: " prop="name">
                  <el-input v-model="editMenuForm.name" autocomplete="off" placeholder="目录名称" ></el-input>
                </el-form-item>
             </div>
             <div v-if="editMenuForm.type=='1'">
                 <el-form-item label="菜单名称: " prop="name">
                  <el-input v-model="editMenuForm.name" autocomplete="off" placeholder="菜单名称" ></el-input>
                </el-form-item>
             </div>
             <div v-if="editMenuForm.type=='2'">
              <el-form-item label="按钮名称: " prop="name">
                <el-input v-model="editMenuForm.name" autocomplete="off" placeholder="按钮名称" ></el-input>
              </el-form-item>
            </div>
            <div v-if="editMenuForm.type=='1' || editMenuForm.type=='2'">
              <el-form-item label="上级菜单: " prop="parentMenuList">
                <el-input autocomplete="off" readonly="readonly" style='cursor: pointer;' placeholder="上级菜单" class='readonlyInput' @click.native="selectParentMenu" v-model="checkedParentMenu.name"></el-input>
              </el-form-item>
            </div>
             <div v-if="editMenuForm.type=='1'">
                <el-form-item label="菜单URL: " prop="url">
                   <el-input v-model="editMenuForm.url" autocomplete="off" placeholder="菜单URL"></el-input>
                 </el-form-item>
             </div>
             <div v-if="editMenuForm.type=='1' || editMenuForm.type=='2'">
                 <el-form-item label="授权标识: ">
                   <el-input autocomplete="off" readonly="readonly" style='cursor: pointer;' placeholder="授权标识" class='readonlyInput' @click.native="menuPermsClick" v-model="checkedParentMenuPerms.name"></el-input>
                 </el-form-item>
             </div>
             <div v-if="editMenuForm.type=='1' || editMenuForm.type=='0'">
                  <el-form-item label="排序号: " prop="orderNum">
                     <el-input-number v-model="editMenuForm.orderNum" controls-position="right" :min="0" :max="100"></el-input-number>
                 </el-form-item>
                 <el-form-item label="图标: " prop="icon">
                   <el-input v-model="editMenuForm.icon" autocomplete="off" placeholder="菜单图标"></el-input>
                   <span style="color:#F56C6C;cursor:pointer" @click="openFonts">获取图标</span>
                 </el-form-item> 
            </div>
          </el-form>
          <el-row class='inner-button'>
            <el-col :span="2"><div class="grid-content">
                    <el-button plain @click="backToMenu">返回</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button type="primary" @click="menuEditSubmit('editMenuForm')">确定</el-button>
            </div></el-col>
          </el-row>
    </div>
    <!-- 所属部门的dialog -->
    <el-dialog title="上级菜单" :visible.sync="menuParentVisbile" width="20%">
          <el-tree 
            :data="editMenuForm.parentMenuList" 
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
        :data="editMenuForm.permsList" 
        ref="treeFormPerms"
        show-checkbox
        :check-strictly='true'
        default-expand-all
        node-key="permId"
        @check='nodePermsClick'
        :props="defaultPropsPerms"
        @node-click="nodePermsClick"
        >
        </el-tree>    
      <div slot="footer" class="dialog-footer">
        <el-button @click="sysVisbile = false">取 消</el-button>
        <el-button @click="getMenuPermsParent" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {menuTree,delSelectTag,permsTree} from '../../../js/util'
export default {
    name:'menuEdit',
    data(){
        var validatorName = (rule, value, callback) => {
          let name = '菜单'
          if(this.editMenuForm.type=='0'){
            name = '目录'
          }else if(this.editMenuForm.type=='1'){
            name = '菜单'
          }else if(this.editMenuForm.type=='2'){
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
        var validatorParentMenuList = (rule, value, callback) => {
            if (this.checkedParentMenu.name === '' || this.checkedParentMenu.name === null) {
              callback(new Error('请选择上级菜单'));
            }else{
                callback();
            }
        };
        return {
            // 新增校验规则
            editMenuRules:{
                name: [
                    {required:true,trigger: "change",validator:validatorName }
                ],
                url: [
                    {required:true,trigger: "change",validator:validatorUrl}
                ],
                parentMenuList: [
                    {required:true,trigger: 'change',validator:validatorParentMenuList }
                ],
                orderNum: [
                    {required:true,trigger: 'change',message:'请输入排序号'}
                ],
            },
            // 新增数据
            editMenuForm:{
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
                menuId:""
            },
            // 展示图标
            fontVisible:false,
            isFontActive:'',
            active:'active',
            currentQuery:'',
            sysVisbile:false,
            // 树的属性
            defaultPropsPerms: {
                children: 'children',
                label: 'name'
            },
            // 被选中的上级菜单
            checkedParentMenuPerms:{
                name:'',
                permId:0
            },
        }
    },
    created(){
        this.getMenuData();
    },
    methods:{
        // 返回
        backToMenu(){
          delSelectTag(this.$route)
          this.$router.history.go(-1);
        },
        // 获取菜单信息
        getMenuData(){
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
           this.$get(`auth-web/sys/menu/info/${editData.id}`).then(res => {
                if (res.code == '000000') {
                    const data = res.data;
                    this.editMenuForm.type = data.type+'';
                    if(data.type==1){
                      this.editMenuForm.icon = data.icon;
                      this.editMenuForm.name = data.name;
                      this.editMenuForm.orderNum = data.orderNum;
                      this.editMenuForm.perms = data.perms;
                      this.editMenuForm.url = data.url;
                      this.checkedParentMenu.name = data.parentName;
                      this.checkedParentMenu.menuId = data.parentId;
                    }else if(data.type==0){
                      this.editMenuForm.icon = data.icon;
                      this.editMenuForm.name = data.name;
                      this.editMenuForm.orderNum = data.orderNum;
                       this.checkedParentMenu.name = data.parentName;
                      this.checkedParentMenu.menuId = data.parentId;
                    }else if(data.type==2){
                      this.editMenuForm.perms = data.perms;
                      this.editMenuForm.name = data.name;
                      this.checkedParentMenu.name = data.parentName;
                      this.checkedParentMenu.menuId = data.parentId;
                    }
                    this.checkedParentMenuPerms.perms = data.perms;
                    this.selectParentMenuPerms();
                }
          })
        },
        // 展示上级菜单树,只显示目录类型
        selectParentMenu(){
             // 获取上级菜单
             this.$get('auth-web/sys/menu/select').then(res=>{
                if(res.code=='000000'){
                    if(this.editMenuForm.type==1){
                      // 菜单
                      const newData1 = res.data.filter(v=>
                           v.type==0
                      )
                      this.menuParentVisbile=true;
                      this.editMenuForm.parentMenuList = newData1
                    }else if(this.editMenuForm.type==0){
                      // 目录
                      const newData0 = res.data.filter(v=>
                          v.menuId==0
                      )
                      this.menuParentVisbile=false;
                      this.editMenuForm.parentMenuList = newData0
                      this.$alert('没有上级菜单', {
                        confirmButtonText: '确定',
                        callback: () => {
                          
                        }
                      });
                    }else if(this.editMenuForm.type==2){
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
                      this.editMenuForm.parentMenuList = newData2
                    }
                }  
            })
        },
        // 获取树上选中的值
        getMenuParent(){
            this.checkedParentMenu = this.$refs.treeForm.getCheckedNodes()[0];
            this.menuParentVisbile=false;
        },
        // 设置只能单选
        handleClick(data, checked){
            if(checked == true){
                this.checkedId = data.id;
                this.$refs.treeForm.setCheckedNodes([data]);
            }
        },
        nodePermsClick(item){
          this.checkedPermsId = item.permId;
          this.$refs.treeFormPerms.setCheckedKeys([item.permId]);
        },
        // 展示上级菜单树,只显示目录类型
        selectParentMenuPerms(){
          // 获取上级菜单
          this.$get('auth-web/sys/perm/select').then(res=>{
            if(res.code=='000000'){
              const data2 = res.data.filter(v=>{
                if(v.perms && v.perms == this.checkedParentMenuPerms.perms){
                  this.checkedParentMenuPerms.name = v.name;
                  this.checkedParentMenuPerms.permId = v.permId;
                }
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
              this.editMenuForm.permsList = newData2
            }
          })
        },
        menuPermsClick(){
          this.sysVisbile = true;
          this.$nextTick(()=>{
            this.$refs.treeFormPerms.setCheckedKeys([this.checkedParentMenuPerms.permId])
          })
          
        },
        // 获取标识树选中的值
        getMenuPermsParent(){
            this.checkedParentMenuPerms = this.$refs.treeFormPerms.getCheckedNodes()[0];
            this.sysVisbile=false;
        },
        // 菜单新增保存
        menuEditSubmit(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
                const data = {type:parseInt(this.editMenuForm.type),
                              name:this.editMenuForm.name,
                              orderNum:this.editMenuForm.orderNum,
                              parentId:this.checkedParentMenu.menuId,
                              parentName:this.checkedParentMenu.name,
                              icon:this.editMenuForm.icon,
                              url:this.editMenuForm.url,
                              perms:this.editMenuForm.perms,
                              menuId:this.$route.query.id}
              if(data.perms !== this.checkedParentMenuPerms.perms){
                data.perms = this.checkedParentMenuPerms.perms;
              }
              this.$post("auth-web/sys/menu/update",data).then(res=>{
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
          this.$refs.editMenuForm.clearValidate()
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
          this.editMenuForm.icon = this.isFontActive.name
        },
        openFonts(){
          this.fontVisible = true
          this.isFontActive = ''
        }
    }
}
</script>

<style lang='scss'>
  .inner{
    .readonlyInput>.el-input__inner{
        cursor: pointer;
        background-color: rgb(238, 238, 238);
    }
    .el-input-number{
        width: 100%;
    }
    .el-input-number.is-controls-right .el-input-number__decrease{
        bottom: 2px;
        height: 18px;
    }
    .el-input-number.is-controls-right .el-input-number__increase{
        top: 3px;
        height: 18px;
    }
    .el-input-number .el-input__inner{
      text-align:left;
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
  }
</style>
