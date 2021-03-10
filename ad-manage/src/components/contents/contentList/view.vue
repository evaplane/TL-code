<template>
  <div>
    <!-- 内容 -->
    <div class="content sub" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>内容详情</div></el-col>
        </el-row>
        <el-form v-if="showData" label-width="100px" class="demo-ruleForm">
          <el-form-item label="内容标题:">
            <div v-html="showData.contentTitle" style="padding: 0 15px;background-color: #F5F7FA;border-color: #E4E7ED;color: #C0C4CC;cursor: not-allowed;border-radius: 4px;"></div>
          </el-form-item>
          <el-form-item label="标签:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.labelName"></el-input>
          </el-form-item>
          <el-form-item label="点赞量:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.praiseCount"></el-input>
          </el-form-item>
          <el-form-item label="访问量:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.visitCount"></el-input>
          </el-form-item>
          <el-form-item label="评论量:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.commentCount"></el-input>
          </el-form-item>
          <el-form-item label="内容类型:">
            <el-input autocomplete="off" readonly="readonly" :disabled="true" :value="showData.contentType==1?'公共':'私人影集'"></el-input>
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
                  :preview-src-list="[mainSrc]"
                >
                </el-image>
              </div>
              </el-row>
          </el-form-item>
          <el-form-item label="预览视频:" v-if="showData.uploadWay==2&&showData.previewVideoUrl">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content">
                <videoPlay  style="height:200px;width:400px;margin:8px;float:left;" :type='0' :contentVideoUrl="showData.previewVideoUrl"></videoPlay>
              </div>
            </el-row>
          </el-form-item>
          <el-form-item label="内容视频:" v-if="showData.uploadWay==2">
            <el-row style="margin-bottom:0px;">
              <videoPlay  class="grid-content lookvideo videobox" :type='2' :contentVideoUrl="showData.contentVideoUrl" :mainSrc="mainSrc"></videoPlay>
            </el-row>
          </el-form-item>
          <el-form-item label="内容明细:" v-if="showData.uploadWay==1">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content showallpic">
                <image-big
                  v-for="(src,index) in showData.imgUrls" :key="index"
                  class="showImg"
                  fit="contain"
                  :src='src'
                  :preview-src-list="showData.imgUrls"
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
        mainSrc:null,
        showData:null
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
    methods:{
        // 返回
        backToDept(){
          delSelectTag(this.$route)
          this.$router.history.go(-1);
        },
        // 获取审核内容
        getDeptData(id){
            this.$get(`content-web/content/view`,{id}).then(res=>{
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
                  console.log(this.showData)
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
