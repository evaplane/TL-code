<template>
  <el-container class="index-container">
    <el-container>
        <!-- 导航菜单 -->
        <el-menu router default-active="2" class="el-menu-vertical-demo" @select="selectMenu" :collapse="isCollapse" :unique-opened='true'>
          <div class='nav-header' id='nav-header'>
            <div><img src="@/assets/images/pikaqiu.jpg" alt="" style="height:64px;border-radius: 50%;"></div>
            <el-dropdown trigger="click" class='navDrop'>
              <span class="el-dropdown-link" style="color:#dfe4ed;font-weight:600;">
                {{username}}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown" class='navDropdown'>
                <el-dropdown-item @click.native="editPasswordForm">修改密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 用户 -->
          <el-submenu
            v-for="(item, index) in $store.state.menuList"
            :key="index"
            :index="item.menuId.toString()"
          >
            <template slot="title">
              <i :class="item.icon" style="margin-right:10px;"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item v-for="(it, i) in item.list" :key="i" :index="'/'+it.url">
              <i :class="it.icon"></i>
              {{it.name}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      <el-main class='outer'>
          <el-header style='padding:0;border-bottom: 1px solid #e7eaec;' id='header'>
            <el-row style='height:60px;'>
              <el-col :span="1" style='height:60px;'>
                <div class="grid-content">
                  <a href="javascript:void(0)" class='btnShow' @click="showHide">
                    <i class='fa fa-bars listicon'></i>
                  </a>
                </div>
              </el-col>
              <el-col :span="6" style='min-width: 200px;height:60px;'>
                <div class="grid-content">
                  <!-- 面包屑 -->
                  <breadcrumb :firstLevelPageMenu="firstLevelPageMenu" :secondLevelPageMenu="secondLevelPageMenu" style='min-width: 800px;'></breadcrumb>
                </div>
              </el-col>
              <el-col :span="1" style='float:right;margin-right:30px;'>
                <div class="grid-content exit">
                  <a href="javascript:void('0')" class="el-icon-switch-button" @click='logout'> 退出</a>
                </div>
              </el-col>
            </el-row>
          </el-header>
        <tagview class='tagview' :visitedViewsFather="visitedViews" :delSelectTagFather = "delSelectTag" :isActiveFather="isActive" id='tagview' :screenWidthSon="screenWidth"></tagview>
        <el-main id='innerMain'>
        <!-- 嵌套路由 -->
        <router-view></router-view>
        <!-- 修改密码框 -->
         <el-dialog title="修改密码" :visible.sync="passwordFormVisible" style="margin-top:17vh;" :before-close="handleClose">
            <el-form :model="passwordForm" :rules="editPasswordRules" ref="editPassword">
              <el-form-item label="账号" :label-width="passwordWidth">
              <span>{{username}}</span>
              </el-form-item>
              <el-form-item label="原密码" :label-width="passwordWidth" prop='password'>
                <el-input v-model="passwordForm.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" :label-width="passwordWidth" prop='newPassword'>
                <el-input v-model="passwordForm.newPassword" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button type="primary" @click="editPassword('editPassword')" size="small">确 定</el-button>
          </div>
         </el-dialog>
          </el-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
import breadcrumb from '../breadcrumb/breadcrumb'
import tagview from '../TagsView/TagsView'
import { log } from 'util';
import { setTimeout } from 'timers';
export default {
  name: 'index',
  data() {
    var password = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入原密码'));
            } else {
              var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,24}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入6-24位数字、字母或者符号'));
              }
              callback();
            }
        };
        var newPassword = (rule, value, callback) => {
            if(value==''){
              callback(new Error('请输入新密码'));
            }else{
               var reg = /^[A-Za-z0-9`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]{6,24}$/
              if (!reg.test(value)) {
                callback(new Error('只能输入6-24位数字、字母或者符号'));
              }
              callback();
            }
        };
    return {
      passwordWidth: '100px',
      passwordFormVisible:false,
      passwordForm: {
        password: '',
        newPassword: ''
      },
      username:'',
      isShow: true,
       // 面包屑
      firstLevelPageMenu: '',
      secondLevelPageMenu: "",
      isCollapse:false,
      // 高度
      fullHeight:document.documentElement.clientHeight,
      screenWidth:document.body.clientWidth,
      // 固定的header
      timer : true,
      editPasswordRules:{
        password: [
            {required:true,trigger:"change",validator:password}
        ],
        newPassword: [
            {required:true,trigger:"change",validator:newPassword}
        ],
      }
    }
  },
  created() {
    if(document.body.clientWidth <= 1240){
      this.isCollapse = true;
    }else if(document.body.clientWidth > 1400){
      this.isCollapse = false;
    };
    this.getUserInfo();
  },
  mounted(){
    this.addViewTags();
    this.firstLevelPageMenu = this.$route.meta.parentTitle
    this.secondLevelPageMenu = this.$route.meta.title
    this.fullHeight = document.documentElement.clientHeight
    this.screenWidth = document.body.clientWidth;
    document.getElementById('innerMain').style.height=(this.fullHeight-100)+"px"
    const that = this
    window.onresize = () => {
      return (() => {
      window.fullHeight = document.documentElement.clientHeight
      that.fullHeight = window.fullHeight
      window.screenWidth = document.body.clientWidth
      that.screenWidth = window.screenWidth
      if(document.getElementById('innerMain')){
        document.getElementById('innerMain').style.height=(this.fullHeight-100)+"px"
      };
    })()
   }
  },
  components:{
    breadcrumb,
    tagview
  },
  computed:{
    visitedViews(){//store中取值
      return this.$store.state.tagsview.visitedviews
    }
  },
  watch:{
   $route(){
      this.addViewTags();
   },
   fullHeight (val) {
    this.fullHeight = val
    document.getElementById('innerMain').style.height=(this.fullHeight-100)+"px"
   },
   screenWidth(val){
     this.screenWidth=val
     if(val <= 1240){
       this.isCollapse = true;
     }else if(val >= 1400){
      this.isCollapse = false;
    };
   }
  },
  methods: {
    // 退出登录
    logout(){
      this.$confirm('真的要退出吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get('auth-web/sys/logout').then(res=>{
            if(res.code='000000'){
              window.localStorage.removeItem('token')
              window.localStorage.removeItem('store')
              this.$store.commit('closeAllViews')
              this.$router.push('/login')
              this.$message({
                type: 'success',
                message: '退出成功!'
              });
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
      
    },
    // 修改密码
    editPassword(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('auth-web/sys/user/password', this.passwordForm).then(res => {
              if (res.code == '000000') {
              this.$message({
                message: '密码修改成功',
                type: 'success'
              });
              this.handleClose()
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
    // 获取用户信息
    getUserInfo(){
      this.$get('auth-web/sys/menu/nav').then(res => {
        if(res.code=='000000'){
          this.$store.commit('changeMenuList',res.data);
          this.$get('auth-web/sys/user/info').then(res=>{
            if(res.code=='000000'){
              this.username = res.data.username;
              this.$get('auth-web/sys/menu/userPerms').then(res=>{
                if(res.code=='000000'){
                  this.$store.commit('roleList',res.data);
                }
              });
            };
          });
        }
      });
    },
    editPasswordForm(){
      this.passwordFormVisible = true
    },
    selectMenu(index,indexPath){
      let menuList = this.$store.state.menuList;
      menuList.forEach(v=>{
        if(v.menuId+""==indexPath[0]){
          this.firstLevelPageMenu = v.name
        }
        if(v.list){
          v.list.forEach(vi=>{
            if("/"+vi.url==indexPath[1]){
              this.secondLevelPageMenu = vi.name
            }
          })
        }
      })
    },
    // 显示隐藏
    showHide(){
      this.isCollapse=!this.isCollapse
    },
    addViewTags(){//路由改变时执行的方法
      let visitedviews = this.$store.state.tagsview.visitedviews
      setTimeout(()=>{
        if(visitedviews.length==1 && visitedviews[0].path=="/modules/pageHome.html"){
         setTimeout(() => {
           if(document.getElementsByClassName('closeTag')[0]){
             document.getElementsByClassName('closeTag')[0].style.display="none"
           }
         }, 20);
        }else{
          setTimeout(() => {
            if(document.getElementsByClassName('closeTag')[0]){
              document.getElementsByClassName('closeTag')[0].style.display="inline-block"
            }
          }, 20);
        }
      },100)
      for(let i = 0;i<visitedviews.length;i++){
        if(visitedviews[i].path==this.$route.path){
          return
        }
      }
      if(this.$route.name){
        const route = this.$route
        this.$store.dispatch('addVisitedViews',route);
      }
    },
    delSelectTag(route){//先提交删除数据的方法,数组删除出掉数据后，如果关闭的是当前打开的路由需要将路由改为数组最后一次push进去的路由
      this.$store.dispatch('delVisitedViews',route).then((views)=>{
        if(this.isActive(route)){//只有在关闭当前打开的标签页才会有影响
          let lastView = views.slice(-1)[0]//选取路由数组中的最后一位
          if(lastView){
            this.$router.push(lastView);
          }else{
            document.getElementsByClassName('slider-group')[0].style.width="147px"
            this.$router.push('/modules/pageHome.html');
          }
        }
      })
    },
    isActive(route){
      this.firstLevelPageMenu = this.$route.meta.parentTitle
      this. secondLevelPageMenu = this.$route.meta.title
      return route.path == this.$route.path
    },
    // 关闭修改密码
    handleClose(){
      this.$refs.editPassword.clearValidate()
      this.$refs['editPassword'].resetFields()
      this.passwordFormVisible=false;
    }
  },

}
</script>

<style lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg {
  background: #fff;
}
.bg-blue {
  background: #434f6a;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-dark {
  background: #2c3640;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  min-height: 50px;
  text-align: center;
  a {
    text-decoration: none;
    line-height: 58px;
    font-size: 14px;
    color: #606266;
  }
}
.edit-password,.exit{
    text-align: right;
}
.el-submenu__title{
  color: #a7b1c2;
  font-weight: 600;
  .fa{
    color: #a7b1c2;
    font-weight: 600;
  }
}
.el-menu-item{
  color: #a7b1c2;
  font-weight: 600;
  padding-left: 42px !important;
  .fa{
  color: #a7b1c2;
  font-weight: 600;
  }
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
h2 {
  text-align: left;
  line-height: 56px;
  color: #fff;
}

.index-container {
  height: 100%;
}
.el-menu {
  background-color: transparent;
  border: 0;
}
.el-dialog {
  width: 40%;
  .el-dialog__body {
    padding: 15px;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .operation .el-input__inner {
    width: 80%;
    height: 35px;
  }
}
.el-dialog__header {
  background-color: #409EFF;
  padding: 10px 20px;
  .el-dialog__headerbtn {
    top: 15px;
    .el-dialog__close {
      color: #fff;
    }
  }
  .el-dialog__title{
    color: #fff;
  }
}
.el-menu-item-group__title {
  height: 0;
  padding: 0;
}
.el-dialog__title {
  font-size: 14px;
  // color: #fff;
  line-height: 20px;
}
.el-submenu__title:hover {
  background-color: #293846;
  color: #fff;
  .fa{
    color: #fff;
  }
}
.el-menu-item:hover {
  background-color: #293846;
  color: #fff;
  .fa{
    color: #fff;
  }
}
.el-menu-item.is-active {
  background-color: #293846;
  color: #fff;
}
.el-icon-s-fold,.el-icon-s-unfold {
  color: #fff;
  font-size: 36px;
  margin-top: 10px;
  margin-left: 10px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fa{
  margin-right: 6px;
}
.listicon {
  font-size: 20px;
  line-height: 58px;
  text-align: center;
}
.el-menu-vertical-demo{
  height: 100%;
  background-color: #2f4050;
  font-size: 13px;
  overflow: hidden;
  overflow-y: scroll;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 220px;
}
.btnShow{
  width: 36px;
  height: 28px;
  display: block;
  background-color: #409EFF;
  margin: 14px 5px 0px 20px;
  border-radius: 4px;
  position: relative;
  &:active{
      background-color: #2f4050;
  }
  .fa-bars{
    font-size: 14px;
    position: absolute;
    top: -15px;
    left: 11px;
    color: #fff;
  }
}
.tagview{
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  border-bottom: solid 2px #2f4050;
  padding-left:10px;
  background: #fafafa;
}
.tags-view-item.active{
  background: #2f4050;
  color: #a7b1c2;
  font-size: 13px;
  padding: 5px 15px;
  height: 100%;
  line-height: 28px;
  border-right: solid 1px #eee;
  &:hover{
    background-color: #2f4050;
    color:#fff;
  }
}
.tags-view-item{
  background-color: #fafafa;
  color: #999;
  font-size: 13px;
  padding: 5px 15px;
  height: 100%;
  line-height: 28px;
  border-right: solid 1px #eee;
  &:hover{
    background-color: #f2f2f2;
    color:#777;
  }
}
.el-submenu .el-menu-item{
  height: 38px;
  line-height: 38px;
  padding: 0 45px;
  min-width: 200px;
}
.el-menu--collapse{
  #nav-header{
    display: none;
  }
}
.nav-header{
  width: 200px;
  height: 170px;
  padding: 33px 25px;
  box-sizing: border-box;
  img{
    margin-bottom: 5px;
  }
}
.el-popper .popper__arrow, .el-popper .popper__arrow::after{
  display: none !important;
}
.el-dropdown-menu{
    width: 160px;
    border-radius: 0;
    padding: 0;
    .el-dropdown-menu__item{
      font-size: 12px;
      &:hover{
        background-color: #f5f5f5;
        color: #333;
      }
    }
}
.navDropdown{
  top: 122px !important;
  left:25px !important;
}
.el-menu-vertical-demo::-webkit-scrollbar{display:none;}
</style>
