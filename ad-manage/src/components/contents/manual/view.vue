<template>
  <div>
    <!-- 内容 -->
    <div class="content sub" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>审核详情</div></el-col>
        </el-row>
        <el-form :model="editDeptForm" ref="editDeptForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="内容标题:">
            <div v-html="showData.contentTitle" style="padding: 0 15px;background-color: #F5F7FA;border-color: #E4E7ED;color: #C0C4CC;cursor: not-allowed;border-radius: 4px;"></div>
          </el-form-item>
          <el-form-item label="审核状态:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" v-if="showData.auditStatus == 0" value="未审核"></el-input>
            <el-input autocomplete="off" readonly="readonly" :disabled="true" v-if="showData.auditStatus == 1" value="审核通过"></el-input>
            <el-input autocomplete="off" readonly="readonly" :disabled="true" v-if="showData.auditStatus == 2" value="审核驳回"></el-input>
            <el-input autocomplete="off" readonly="readonly" :disabled="true" v-if="showData.auditStatus == 3" value="审核中"></el-input>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.createTime"></el-input>
          </el-form-item>
          <el-form-item label="审核时间:" v-if="showData.auditStatus>0">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.auditTime"></el-input>
          </el-form-item>
          <el-form-item label="操作员:" v-if="showData.auditStatus>0">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.operator"></el-input>
          </el-form-item>
          <el-form-item label="审核意见:" v-if="showData.auditStatus>0">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.auditMsg"></el-input>
          </el-form-item>
          <el-form-item label="上传形式:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.uploadWay==1?'图片':'视频'"></el-input>
          </el-form-item>
          <el-form-item label="封面图:" v-if="showData.uploadWay==2">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content">
                <el-image 
                  v-show="mainSrc"
                  class="showImg"
                  :src='mainSrc'
                  fit="contain"
                   ref="mainImg"
                   style="width:120px;"
                   @load="loadimg"
                  :preview-src-list="[mainSrc]"
                >
                </el-image>
              </div>
              </el-row>
          </el-form-item>
          <el-form-item label="预览视频:" v-if="showData.uploadWay==2">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content">
                <videoPlay
                v-if="showData.previewVideoUrl"
                style="height:200px;width:400px;float:left;"
                :type='0'
                :contentVideoUrl="showData.previewVideoUrl"></videoPlay>
                <div v-else>预览视频生成中...</div>
                <!-- <video ref="previewVideo" muted preload class="showVideo" :src="showData.previewVideoUrl" style="height:200px;width:300px;margin:8px;float:left;" controls autoplay></video> -->
              </div>
            </el-row>
          </el-form-item>
          <el-form-item label="视频内容:" v-if="showData.uploadWay==2">
            <el-row style="margin-bottom:0px;">
              <videoPlay
              class="grid-content lookvideo videobox"
              :type='2'
              :contentVideoUrl="showData.contentVideoUrl"
              :mainSrc="mainSrc"></videoPlay>
            </el-row>
          </el-form-item>
          <el-form-item label="内容明细:" v-if="showData.uploadWay==1">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content showallpic">
                <image-big 
                  v-for="(src,index) in showData.imgUrls" :key="index"
                  class="showImg"
                  :src='src'
                  fit="contain"
                  :preview-src-list="showData.imgUrls"
                  @load='loadimg2($event,index)'
                >
                <!-- @dblclick="showDigPic(src)" -->
                </image-big>
              </div>
            </el-row>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="10"><div class="grid-content"></div></el-col>
          <el-col :span="2"><div class="grid-content">
              <el-button plain @click="backToDept">返回</el-button>
          </div></el-col>
        </el-row>
    </div>
  </div>
</template>
<script>
import {formatterDateTime,delSelectTag,sys_formatDate} from '../../../js/util'
import videoPlay from '../../common/video'
import imageBig from '../../common/imageBig/main'
import { setTimeout } from 'timers';
export default {
    name:'manualSub',
    data(){
      return {
        // 新增数据
        editDeptForm:{
            name:'',
            region:'',
            categorySelectList:'',
            videoWidth:'',
            videoHeight:'',
            videoPoint:[],
        },
        videoPointPic:[],
        checkList: [],
        listArr:[],
        innerVisible:false,
        mainSrc:null,
        showData:{
          auditMsg: "",
          auditStatus: null,
          auditTime: "",
          content: "",
          contentType: null,
          contentVideoUrl: "",
          createTime: "",
          id: "",
          imageHeight: null,
          imageWidth: null,
          labelName: null,
          mainImageUrl: "",
          operator: "",
          updateTime: "",
          uploadWay: null,
          videoHeight: null,
          videoWidth: null,
        },
        reasonList:[],
        categoryList:[],
        tabs: [{
          id:1,
          name:'通过'
        },
        {
          id:2,
          name:'不通过'
        }],
        imgWidth:null,
        imgHeight:null,
        error:null,
        vcCurrentTime:'00:00',//当前进度
        vcTotalTime:'00:00',//总时长
        vcIsPlay:true,//video是否播放
        vcProgress:0,//video进度
        muted:true,//是否静音
        volumeLength:0,// 音量大小
        vcIsFull:false,//是否全屏
        changeBtn:''
      }
    },
    components:{
      videoPlay,
      imageBig
    },
    created(){
      this.getDeptData(this.$route.query.id);
      if(navigator.userAgent.indexOf('MSIE') !== -1){
        document.attachEvent('onkeydown', ()=>{
          if(event.keyCode == 27){
            if (this.vcIsFull) {
              this.vcIsFull = false;
            };
          }
        });
      }else{
        document.addEventListener('keydown', (e)=>{
          if(e.which == 27){
            if (this.vcIsFull) {
              this.vcIsFull = false;
            };
          }
        }, false);
      }
    },
    destroyed(){
      console.log('1231313')
    },
    methods:{
        // 返回
        backToDept(){
          delSelectTag(this.$route)
          this.$router.history.go(-1);
        },
        loadimg(){
          this.imgWidth = this.$refs['mainImg'].naturalWidth
          this.imgHeight = this.$refs['mainImg'].naturalHeight
          console.log("打印图片宽高")
          console.log(this.imgWidth)
          console.log(this.imgHeight)
        },
        loadimg2(event,index){
          if(index == 0){
            this.imgWidth = event.target.naturalWidth
            this.imgHeight = event.target.naturalHeight
            console.log("打印图片宽高")
            console.log(this.imgWidth)
            console.log(this.imgHeight)
          }
        },
        // 获取审核内容
        getDeptData(id){
            this.$get(`content-web/manualAudit/view`,{id}).then(res=>{
                if(res.code=="000000"){
                  res.data.contentHTML = '';
                  for(var item in res.data){
                    if(item == 'createTime'||item == 'updateTime'||item == 'auditTime'){
                      res.data[item] = formatterDateTime(res.data[item]);
                    };
                    if(item == 'uploadWay'){
                      if(res.data[item]==1){
                        let imgUrls = res.data.contentVideoUrl.split(',')
                        res.data.imgUrls = imgUrls;
                      };
                    };
                  };
                  let title = res.data.contentTitle;
                  let that = this;
                  title = title.replace(/<e:(.*?)>/g,function(){
                      return eval("'" + arguments[1] + "'");
                  });
                  res.data.contentTitle = this.$emoji.parse(title);
                  if(res.data.mainImageUrl.indexOf("mp4") == -1){
                    this.mainSrc = res.data.mainImageUrl;
                  };
                  
                  this.showData = res.data;
                }
            })
        },
    }
}
</script>

<style lang='scss'>
  .sub .el-dialog{
    width:50% !important;
  }
  .elradio{
    margin-right:20px;
  }
  .inlinetop{
    vertical-align: top;
    display: inline-block;
    float: none;
  }
  .showallpic{
    max-width: 750px;
    display: flex;
    flex-wrap: wrap;
  }
  .showallpic .showImg{
    width:33.33%;
    margin-bottom:5px;
  }
.sub{
  .el-col-10{
    min-width: unset !important;
  }
  .grid-content{
    text-align: left;
    padding-right: 10px;
    text-indent: 10px
  }
  .detail-bg{
    text-align: right;
    justify-content: flex-end;
  }
  .demo-ruleForm{
    padding: 30px 30px 10px 50px;
  }
}
.subdialog .el-dialog__body{
  padding:0!important;
}
.subdialog .el-dialog__header{
  position: absolute;
  height: 25px;
  width: 15px;
  right: -55px;
  background-color: transparent;
}
.videobox{
  height:300px;
}
.sub .el-icon-circle-close:before{
  font-size:40px;
  color:#fff;
}
</style>
