<template>
  <div class="shareDialog">
    <transition name="dialog-fade">
      <div v-show="dialogShareVisible" class="sharedialogcontainer">
        <div class="dialogbody" element-loading-background="rgb(255, 255, 255,)">
          <div class="close" @click="closeDialog">X</div>
          <div class="body">
            <el-col :span="12">
              <img class="qrimg" src="../../assets/1565408567left.png" alt="">
              <div class="btnshow">IOS下载</div>
            </el-col>
            <el-col :span="12" style="text-align:right;">
              <img class="qrimg" src="../../assets/1565408567right.png" alt="">
              <div class="btnshow">Android下载</div>
            </el-col>
          </div>
          <div class="foot">
            <p class="scan">扫码下载小视频app</p>
            <p>捕捉和分享你的每一精彩瞬间。</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "shareDialog",
  props: ['dialogShareVisible','swpierData'],
  data() {
    return {
      isLogin:false,
      carArrow:'hover',
    };
  },
  created() {
    if(navigator.userAgent.indexOf('MSIE') !== -1){
        document.attachEvent('onkeydown', ()=>{
          if(event.keyCode == 27){
            if(this.dialogShareVisible){
              this.closeDialog();
            };
          }
        });
      }else{
        document.addEventListener('keydown', (e)=>{
          if(e.which == 27){
            if(this.dialogShareVisible){
              this.closeDialog();
            };
          }
        }, false);
      }
  },
  updated(){
    if(this.dialogShareVisible){
      this.stop();
    }else{
      this.move();
    }
  },
  methods: {
    // 关闭弹窗
    closeDialog(){
      this.$emit('changeShareTable',false);
    },
    /***滑动限制***/
    stop(){
      var mo=function(e){e.preventDefault();};
      document.body.style.overflow='hidden';
      document.addEventListener("touchmove",mo,false);//禁止页面滑动
    },
    /***取消滑动限制***/
    move(){
      var mo=function(e){e.preventDefault();};
      document.body.style.overflow='';//出现滚动条
      document.removeEventListener("touchmove",mo,false);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">
.shareDialog{
  .sharedialogcontainer {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    z-index: 200;
    .dialogbody {
      position: relative;
      margin: 300px auto 0;
      background: #ffffff;
      border-radius: 2px;
      -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      .close {
          position: absolute;
          cursor: pointer;
          color:#fff;
          width: 30px;
          line-height: 30px;
          height: 30px;
          top: -190px;
          font-size: 30px;
      }
      .body{
        margin:0 auto;
        .body{
          padding-top: 30px;
        }
        .el-col{
          height:100%;
          text-align: left;
          .btnshow{
            display: inline-block;
            text-align: center;
            background-color:#000;
            color:#fff;
            border-radius: 10px;
          }
        }
      }
      .foot{
        color:#000;
        text-align: center;
        font-weight: bolder;
        font-size: 16px;
        .scan{
          color:#333;
          margin-bottom: 10px;
          font-weight: 400;
        }
      }
      
    }
  }
}

@media (min-width: 0px){
  .shareDialog{
    .dialogbody{
      width: 450px;
      height: 320px;
      .close{
        right:-125px;
      }
      .body{
        height: 210px;
        width: 450px;
        padding-top: 30px;
      }
      .body .el-col{
        text-align: center!important;
        .qrimg{
          width:150px;
          height:150px;
          margin-bottom:18px;
        }
        .btnshow{
          width: 150px;
          height: 36px;
          line-height: 36px;
        }
      }
      .foot{
        margin-top:15px;
      }
    }
  }
  
} /* 700px*/

@media (min-width: 1100px) {
  .shareDialog{
    .dialogbody{
      width: 520px;
      height: 320px;
      .close{
        right:-187px;
      }
      .body{
        height: 210px;
        width: 520px;
        padding-top: 30px;
      }
      .body .el-col{
        text-align: center!important;
        .qrimg{
          width:150px;
          height:150px;
          margin-bottom:18px;
        }
        .btnshow{
          width: 150px;
          height: 36px;
          line-height: 36px;
        }
      }
      .foot{
        margin-top:15px;
      }
    }
  }
} /* 900px*/
@media (min-width: 1280px) {
  .shareDialog{
    .dialogbody{
      width: 792px;
      height: 480px;
      .close{
        right:-200px;
      }
      .body{
        height: 270px;
        width: 520px;
        padding-top: 67px;
      }
      .body .el-col{
        text-align: center!important;
        .qrimg{
          height: 200px;
          width: 200px;
          margin-bottom:18px;
        }
        .btnshow{
          width: 200px;
          height: 48px;
          line-height: 48px;
        }
      }
      .foot{
        margin-top:50px;
      }
    }
  }
} /*  1200px*/
</style>
