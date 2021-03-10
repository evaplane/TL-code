<template>
    <div class="tags-view-container">
      <div class="roll-nav roll-left tabLeft" @click='turnLeft'><i class="fa fa-backward"></i></div>
      <Scroll ref="scroll" class='scroll'>
        <router-link tag="li" v-for="tag in visitedViewsFather" :to="tag" :key="tag.path" class="tags-view-item" :class="isActiveFather(tag)?'active':''">
          {{tag.title}}
           <span class='el-icon-close closeTag' @click.prevent.stop="delSelectTagFather(tag)" v-show="showClose"></span>
        </router-link>
      </Scroll>
      <div class="roll-nav roll-right tabRight" @click='turnRight'><i class="fa fa-forward"></i></div>
      <el-dropdown @command="handleCommand" class='tagDropdown' trigger="click">
        <el-button type="primary">关闭操作<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="b" style="padding: 0 10px;">关闭全部选项卡</el-dropdown-item>
            <el-dropdown-item command="a" style="padding: 0 10px;">关闭其他选项卡</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
</template>

<script>
import Scroll  from './slider'
import BScroll from 'better-scroll'
import { setTimeout } from 'timers';
export default {
    name:'tagsView',
    props:['visitedViewsFather',"delSelectTagFather",'isActiveFather','screenWidthSon'],
    components:{
      Scroll
    },
    data(){
      return {
        showClose:true,
        sliderWidth:'',
        slider:'',
      }
    },
    methods:{
      handleCommand(command){
        if(command=='b'){
          this.visitedViewsFather.forEach(v=>{
            this.$store.commit('closeAllViews')
            document.getElementsByClassName('slider-group')[0].style.width="147px"
            this.$router.push('/modules/pageHome.html')
          })
        }else if(command=='a'){
          let dom = document.getElementById('tagview').getElementsByClassName('router-link-active');
          if(dom[0]){
            let current = dom[0].innerText.trim();
            this.$store.commit('closeOtherViews',current);
            this.turnLeft();
          };
        }
      },
      turnLeft(){
        this.sliderWidth = document.getElementsByClassName('slider-group')[0].clientWidth;
        this.slider =  document.getElementsByClassName('slider-group')[0]
        if(this.sliderWidth>(this.screenWidthSon-350) ){
          this.slider.style.transform="translate(0px, 0px) scale(1)"
        }
      },
      turnRight(){
        this.sliderWidth = document.getElementsByClassName('slider-group')[0].clientWidth;
        this.slider =  document.getElementsByClassName('slider-group')[0]
        if(this.sliderWidth>(this.screenWidthSon-350) ){
          this.slider.style.transform="translate("+(-this.screenWidthSon+400)+"px, 0px) scale(1)"
        }
      }
    },
    watch:{
      visitedViewsFather(newVal,oldVal){
        if(newVal.length==1 && newVal[0].path=="/modules/sys/user.html"){
          this.showClose = false
        }else{
          this.showClose = true
        }
      },
    }
}
</script>

<style lang="scss">
 .tags-view-container{
   position: relative;
 }
  .scroll{
    position: absolute;
    left: 40px;
    width: auto;
    overflow: hidden;
  }
  .slider-group{
    width: auto;
  }
  .tags-view-item{
    display: inline-block;
    cursor: pointer;
  }
  .tagDropdown{
    height: 100%;
    position: absolute;
    right: 0;
    top: -3px;
    .el-button{
      border-radius: 0;
      height: 38px;
      background: #fff;
      border: 0;
      color: #999;
      border-right: solid 1px #eee;
      border-left: solid 1px #eee;
      box-sizing: border-box;
    }
    .el-icon-caret-bottom{
      position: absolute;
      right: 8px;
    }
  }
  .el-popper[x-placement^=bottom]{
    margin-top: 2px;
  }
  .tabRight{
    position: absolute;
    right: 98px;
    height: 36px;
    top: 0px;
    border-left: solid 1px #eee;
    color: #999;
    background-color: #fff;
    width: 27px;
    text-align: center;
    line-height: 36px;
    padding: 1px 6px;
    cursor: pointer;
    &:hover{
      background-color: #f2f2f2;
      color:#777;
    }
  }
  .fa-forward{
    margin-right: 0 !important;
  }
  .tabLeft{
    position: absolute;
    left: 0px;
    height: 36px;
    top: 0px;
    border-left: solid 1px #eee;
    color: #999;
    background-color: #fff;
    width: 27px;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
    padding: 1px 6px;
    &:hover{
       background-color: #f2f2f2;
      color:#777;
    }
  }
</style>
