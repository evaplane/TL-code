<template>
  <div>
    <!-- 内容 -->
    <div class="content sub" style='padding:0;margin-right:10px;'>
        <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
          <el-col :span="1"><div class="grid-content" style='color:#606266'>审核</div></el-col>
        </el-row>
        <el-form :model="editDeptForm" :rules="editDeptRules" ref="editDeptForm" label-width="100px" class="demo-ruleForm">
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
                <videoPlay  v-if="editDeptForm.videoPoint.length == 0 &&showData.previewVideoUrl" :type='0' style="height:200px;width:400px;float:left;" :contentVideoUrl="showData.previewVideoUrl"></videoPlay>
                <!-- <video  controlsList="nodownload noremoteplayback" v-if="editDeptForm.videoPoint.length == 0 &&showData.previewVideoUrl" ref="previewVideo" muted preload class="showVideo" :src="showData.previewVideoUrl" style="height:200px;width:300px;margin:8px;float:left;" controls autoplay></video> -->
                <div v-if='!showData.previewVideoUrl&&editDeptForm.videoPoint.length == 0'  style="height:200px;">
                  <p>预览视频不存在</p>
                </div>
                <div v-if='editDeptForm.videoPoint.length>0' style="display:flex;align-items: center;min-height:200px;flex-flow:row wrap;">
                  <el-image 
                    v-for="(src,index) in videoPointPic" :key="index"
                    class="showImg"
                    style="height:200px;width:25%"
                    :src='src'
                    fit="contain"
                    :preview-src-list="videoPointPic"
                    @load='loadimg2($event,index)'
                  >
                  </el-image>
                  <div style="height:100%;"><el-button size="mini" type="primary" @click="previewPost">生成预览视频</el-button></div>
                </div>
              </div>
            </el-row>
          </el-form-item>
          <el-form-item label="审核视频:" v-if="showData.uploadWay==2">
            <el-row style="margin-bottom:0px;">
              <videoPlay
                class="grid-content lookvideo videobox"
                :type='1' :sub='true'
                :contentVideoUrl="showData.auditVideoUrl"
                :fullUrl='showData.contentVideoUrl'
                :mainSrc="mainSrc"
                @loadvideo='getVideoTime'
                @captureImage='captureImage'
                @captureImage2='captureImage2'
              ></videoPlay>
            </el-row>
          </el-form-item>
          <el-form-item label="内容明细:" v-if="showData.uploadWay==1">
            <el-row style="margin-bottom:0px;">
              <div class="grid-content showallpic">
                <image-big
                  v-for="(src,index) in showData.imgUrls" :key="index"
                  class="showImg"
                  :src='src'
                  :preview-src-list="showData.imgUrls"
                  @load='loadimg2($event,index)'
                >
                <!-- @dblclick="showDigPic(src)" -->
                </image-big>
              </div>
            </el-row>
          </el-form-item>
          <el-form-item label="审核：" prop="name">
            <el-radio-group v-model="editDeptForm.name" v-for="item in tabs" :key="item.id" class="elradio">
              <el-radio :label="item.name" :value="item.id"></el-radio>
          </el-radio-group>
          </el-form-item>
          <el-form-item label="选择标签：" v-if="editDeptForm.name == '通过'" prop="category">
            <el-row v-for="label in categoryList" :key="label.id">
              <el-col :span="2">
                <div style="font-size:14px;text-indent: 10px;">{{label.categoryName}}</div>
              </el-col>
              <el-col :span="20">
                <el-checkbox-group v-model="label.selectList">
                  <el-checkbox v-for="item in label.children" :key="item.id"
                  :label="item.categoryName"
                  :value="item.categoryValue"
                  style="width:170px;white-space: pre-wrap;"
                    name="type"></el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="审核意见：" v-if="editDeptForm.name == '不通过'" prop="region">
            <el-select v-model="editDeptForm.region" placeholder="请选择">
              <el-option
                v-for="item in reasonList"
                :key="item.id"
                :label="item.reasonDesc"
                :value="item.reasonDesc">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="10"><div class="grid-content"></div></el-col>
          <el-col :span="2"><div class="grid-content">
              <el-button plain @click="backToDept">取消</el-button>
          </div></el-col>
          <el-col :span="2"><div class="grid-content">
              <el-button type="primary" @click="deptEditSubmit('editDeptForm')">确认</el-button>
          </div></el-col>
        </el-row>
    </div>
    <el-dialog
      class="subdialog"
      top='5vh'
      :visible.sync="innerVisible"
      center>
      <img :src="listArr" alt="" width="100%" style="display:block">
      <!-- <el-carousel arrow="none" :loop='false' ref="carousel">
        <el-carousel-item v-for="item in listArr" :key="item">
          <el-image
          style="width: 100%; height: 100%"
          :src="item"
          fit="contain"></el-image>
        </el-carousel-item>
      </el-carousel> -->
    </el-dialog>
  </div>
</template>
<script>
import {formatterDateTime,delSelectTag,sys_formatDate} from '../../../js/util'
import videoPlay from '../../common/video'
import imageBig from '../../common/imageBig/main'
import BMF from 'browser-md5-file';
import { setTimeout } from 'timers';
export default {
    name:'manualSub',
    data(){
      var categoryRule = (rule, value, callback) => {
        let ArrayList = [];
        for (let index = 0; index < this.categoryList.length; index++) {
          const element = this.categoryList[index];
          ArrayList = ArrayList.concat(element.selectList);
        }
        if(ArrayList.length == 0){
          callback(new Error('请选择标签'));
        }else if(ArrayList.length > 15){
          callback(new Error('标签最多只能选择15个'));
        }else{
          let categorySelectList = [];
          for (let index = 0; index < this.categoryList.length; index++) {
            const category = this.categoryList[index];
            for (let i = 0; i < category.children.length; i++) {
              if(category.selectList.length !== 0){
                for (let j = 0; j < category.selectList.length; j++) {
                  const element = category.selectList[j];
                  if(element == category.children[i].categoryName){
                    // categorySelectList.push(category.children[i]);
                    categorySelectList.push(category.children[i].id);
                  }
                }
              };
            };
          };
          this.editDeptForm.categorySelectList = categorySelectList.join(",");
          callback();
        }
       return;
      };

      return {
        // 新增校验规则
        editDeptRules:{
            name: [
                {required: true,message: '请选择审核状态',trigger: "change"}
            ],
            category: [
              { required: true,trigger: 'change',validator:categoryRule }
            ],
            region: [
              { required: true, message: '请选择审核意见', trigger: 'change' }
            ],
        },
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
    watch:{
      'editDeptForm.name': function (val, oldVal) {
        if(val == '不通过'){
          this.editDeptForm.authStatus = 2;
          if(this.reasonList.length == 0){
            this.getReasonList();
          }
        }else{
          this.editDeptForm.authStatus = 1;
        }
      },
    },
    created(){
      this.getDeptData(this.$route.query.id);
      this.getLabelList();
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
        // 查询标签分类名称列表
        getCategoryList(){
            return this.$get(`content-web/labelCategory/categoryList`).then(res=>{
                return res;
            })
        },
        // 显示预览
        showDigPic(item,index){
          this.innerVisible = true;
          // if(typeof item !== 'object'){
            // this.listArr = [item];
            // this.$refs.carousel&&this.$refs.carousel.setActiveItem(0);
          // }else{
            this.listArr = item;
            // this.$refs.carousel&&this.$refs.carousel.setActiveItem(index);
          // };
          
        },
        loadimg(event){
          this.imgWidth = event.target.naturalWidth
          this.imgHeight = event.target.naturalHeight
          console.log("打印图片宽高")
          console.log(this.imgWidth)
          console.log(this.imgHeight)
        },
        loadimg2(event,index){
          console.log(index);
          if(index == 0){
            this.imgWidth = event.target.naturalWidth
            this.imgHeight = event.target.naturalHeight
            console.log("打印图片宽高")
            console.log(this.imgWidth)
            console.log(this.imgHeight)
          }
          
        },
        // 先查询分类再查询标签名称列表
        getLabelList(){
          this.getCategoryList().then((res)=>{
            var categoryList = res.data;
            this.$get(`content-web/labelCategory/labelList`).then(response=>{
                if(response.code=="000000"){
                  this.categoryList = this.concatLabel(categoryList,response.data);
                  return;
                }
            }).catch((e)=>{
              this.$message({
                message: e.message,
                type: 'warning'
              });
            })
          });
        },
        // 获取审核不通过原因列表
        getReasonList(){
          this.$post(`common-web/auditRejectReason/getReasonList`).then(response=>{
            if(response.code=="000000"){
              console.log(response.data);
              this.reasonList = response.data;
              return;
            }
          })
        },
        // 菜单修改保存
        deptEditSubmit(formName){
          if(this.editDeptForm.authStatus == 1&&!this.mainSrc&&this.showData.uploadWay == 2){
            return this.$message({
              message: '请截取视频片段为内容主图',
              type: 'warning'
            });
          };
          this.$refs[formName].validate((valid) => {
            if (valid) {
              // 验证不通过直接上报服务器无需传图片
              if(this.editDeptForm.authStatus == 2){
                return this.postAuth();
              };
              if(this.showData.uploadWay == 1){
                return this.postAuth();
              };
              if(!this.editDeptForm.videoWidth){
                return this.$message({
                        message: '当前尚未取得视频属性，无法审核，请稍后片刻',
                        type: 'warning'
                      });
              };
              if(this.mainSrc&&this.mainSrc.indexOf("://") > -1){
                this.postAuth();
              }else{
                let files = this.dataURItoBlob(this.mainSrc);
                var formData = new FormData();
                // 获取md5
                const bmf = new BMF();
                bmf.md5(
                  files,
                  (err, md5) => {
                    formData.append("fileMd5",md5)
                    formData.append("file",files)
                    formData.append('objKeyName',sys_formatDate(new Date().getTime(),'yyyy-MM-dd-HH-mm-ss')+this.getRandom(8)+'.png')
                    this.$post('/storage-web/storageObj/upload',formData).then(res=>{
                      if(res.code == '000000'){
                        this.postAuth(res.data);
                      }else{
                        this.$message({
                          message: res.message,
                          type: 'warning'
                        });
                      }
                    })
                  }
                );
              }
            } else {
              this.$message.error('输入格式不正确');
              return false;
            }
          });
        },
        previewPost(){
          let points = [];
          for (let index = 0; index < this.editDeptForm.videoPoint.length; index++) {
            const point = parseInt(this.editDeptForm.videoPoint[index].time);
            if(points.indexOf(point) == -1){
              points.push(point);
            }
          };
          this.$post("content-web/manualAudit/genPreviewVideo",{
            contentId:this.showData.id,
            videoSplitPoint:points.join(",")
          }).then(response=>{
              if(response.code !=='000000'){
                this.$message({
                  message: response.message,
                  type: 'warning'
                });
              }else{
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
                this.backToDept();
              };
          }); 
        },
        // 提交审核结果
        postAuth(url){
          let data = {
            labelArray:this.editDeptForm.categorySelectList,
            authMsg:this.editDeptForm.authStatus==1?'通过':this.editDeptForm.region,
            authStatus:this.editDeptForm.authStatus,
            mainImageUrl:url||this.mainSrc,
            id:this.showData.id,
            videoWidth:this.editDeptForm.videoWidth,
            videoHeight:this.editDeptForm.videoHeight,
            imageHeight:this.imgHeight,
            imageWidth:this.imgWidth,
          };
          this.$post("content-web/manualAudit/audit",data).then(response=>{
              if(response.code=='000000'){
                if(this.$refs.video){
                  this.$refs.video.pause();
                  this.$refs.video.currentTime=0;
                };
                if(this.$refs.previewVideo){
                  this.$refs.previewVideo.pause();
                  this.$refs.previewVideo.currentTime=0;
                };
                this.$message({
                  message: '审核完成',
                  type: 'success'
                });
                this.backToDept();
              }else{
                this.$message({
                  message: response.message,
                  type: 'warning'
                });
              }
          });
        },
        // 获取审核内容
        getDeptData(id){
            this.$get(`content-web/manualAudit/view`,{id}).then(res=>{
                if(res.code=="000000"){
                  res.data.contentHTML = '';
                  for(var item in res.data){
                    if(item == 'createTime'||item == 'updateTime'){
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
        // 标签分类和名称合并数组
        concatLabel(categoryList,labelList){
          for (let index = 0; index < categoryList.length; index++) {
            const element = categoryList[index];
            element.children = [];
            element.selectList = [];
            for (let item = 0; item < labelList.length; item++) {
              if(labelList[item].pid == element.id){
                element.children.push(labelList[item]);
              };
            }
          };
          return categoryList.filter( (i, v) => i.children.length != 0);
        },
        // base64转blob
        dataURItoBlob(base64Data) {
            var byteString;
            if(base64Data.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(base64Data.split(',')[1]);
            else
                byteString = unescape(base64Data.split(',')[1]);
            var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
            var ia = new Uint8Array(byteString.length);
            for(var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {
                type: mimeString
            });
        },

        // 视频控制相关
        showFullScreen(){
          if (!this.vcIsFull) {
            this.vcIsFull = true;
          } else {
            this.vcIsFull = false;
          }
        },
        videoTimeUpdate(){
          if(this.$refs.video){
            var currTime =this.$refs.video.currentTime;
            var duration =this.$refs.video.duration;
            this.vcCurrentTime = this.getFormatVideoTime(currTime);
            var pre = currTime / duration;
            this.vcProgress = pre*100;
            if(pre == 1){
              this.videoPlay();
            }
          };
        },
        changeSrc(){
          if(this.changeBtn == '播放完整视频'){
            this.changeBtn = '播放审核视频';
            this.$refs['video'].src = this.showData.contentVideoUrl;
          }else{
            this.changeBtn = '播放完整视频';
            this.$refs['video'].src = this.showData.contentVideoUrl;
          };
          this.$refs['video'].currentTime = 0;
        },
        getVideoTime(e){
          console.log("打印视频宽高")
          console.log(e.videoWidth);
          console.log(e.videoHeight);
          this.editDeptForm.videoWidth = e.videoWidth;
          this.editDeptForm.videoHeight = e.videoHeight;
        },
        showerrormsg(e){
          let str = "错误信息："+e.target.error.message;
          str += "<br/>";
          str += "视频链接："+e.target.src;
          this.error = str;
        },
        videoCanPlay(){
          if(this.$refs.video){
            var duration =this.$refs.video.duration;
            this.vcTotalTime = this.getFormatVideoTime(duration);
          };
        },
        //video play or stop
        videoPlay(){
          console.log(this.vcIsPlay)
            if(this.vcIsPlay){
              this.$refs.video.pause();
            }else{
              this.$refs.video.play();
            }
            this.vcIsPlay = !this.vcIsPlay;
        },
        onplay(){
          if(!this.vcIsPlay){
            this.vcIsPlay = true;
          };
        },
        progressControl(event){
          var mediaplayer = document.querySelector("#media");
          var progress_width = document.querySelector(".videoContent");
          var newCoor = event.pageX,
            offLeft = progress_width.getClientRects()[0].left, //距左边的距离
            progress_list_width = progress_width.offsetWidth,
          curPlay = newCoor - offLeft; //拖到的新的位置
          var newLocation = curPlay / progress_list_width * mediaplayer.duration;
          mediaplayer.currentTime = newLocation;
        },
        mutedControl(){
          var player = document.querySelector("#media");
          player.muted = !player.muted;
          if(player.muted) {
            //静音时，设置音量盒,不需要设置player.volume
            this.volumeLength = 0;
            this.muted = true;
          } else {
            this.volumeLength = player.volume;
            this.muted = false;
          }
        },
        pictopic(){
          var video = document.querySelector("#media");
          try {
            if (video !== document.pictureInPictureElement)
              video.requestPictureInPicture();
            else
              document.exitPictureInPicture();
          } catch(error) {
            console.log(`> Argh! ${error}`);
          } finally {
            console.log("结束")
          }
        },
        voiceMove(event){
          console.log(event)
          var voice_box = document.querySelector(".voice-box");
          var player = document.querySelector("#media");
          var clientX = event.pageX,
            ClientRect = voice_box.getBoundingClientRect().left, //相对于左边视口的距离
            volumeWidth = clientX - ClientRect;
          volumeWidth > voice_box.offsetWidth ? volumeWidth = voice_box.offsetWidth : volumeWidth;
          volumeWidth > 2 ? volumeWidth : volumeWidth = 0;
          if(volumeWidth == 0){
            this.muted = true;
            this.volumeLength = 0;
          }else{
            this.muted = false;
            var volumeLength = (volumeWidth / voice_box.offsetWidth).toFixed(2);
            player.volume = volumeLength;
            this.volumeLength = volumeLength;
          }
        },
        //格式化时间
        getFormatVideoTime(time) {
            var time = time;
            var m = parseInt(time%3600/60),
                s = parseInt(time%60);
            m = m < 10 ? "0"+m : m;
            s = s < 10 ? "0"+s : s;
            return m+":"+s;
        },
        captureImage(url) {
          this.mainSrc = url;
          return;
          if(this.changeBtn == '播放审核视频'){
            return;
          }
          setTimeout(()=>{
            // const output = document.getElementById('output')
            try {
              const video = document.getElementById('media')
              const canvas = document.createElement('canvas')
              canvas.width = video.videoWidth 
              canvas.height = video.videoHeight
              const img = new Image()
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
              const dataUrl = canvas.toDataURL('image/png');
              this.mainSrc = dataUrl;
              return;
            } catch (error) {
              this.$message({
                message: error.message,
                type: 'warning'
              });
            };
          },100)
        },
        captureImage2(urlData) {
          this.editDeptForm.videoPoint.push(urlData);
          this.videoPointPic.push(urlData.src);
          return;
          if(this.changeBtn == '播放审核视频'){
            return;
          }
          setTimeout(()=>{
            // const output = document.getElementById('output')
            try {
              const video = document.getElementById('media')
              const canvas = document.createElement('canvas')
              const time = video.currentTime;
              canvas.width = video.videoWidth 
              canvas.height = video.videoHeight
              const img = new Image()
              canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
              const dataUrl = canvas.toDataURL('image/png');
              this.editDeptForm.videoPoint.push({
                src:dataUrl,
                time:time
              });
              this.videoPointPic.push(dataUrl);
              return;
            } catch (error) {
              this.$message({
                message: error.message,
                type: 'warning'
              });
            };
          },100)
        },
        getRandom(num){
            return Math.floor((Math.random()+Math.floor(Math.random()*9+1))*Math.pow(10,num-1));
        }
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
    max-height:440px;
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
#media{
  width: 100%;
  height:100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 5;
}
.infull{
  height:300px;
}
.onfull{
  width:100%;
  position: fixed;
  top:0;
  left:0;
  background-color:#fff;
  height:100%;
  z-index: 99999;
  .big{
    font-size:34px;
    margin-top: 5px;
  }
}
.errshow{
  line-height: 30px;
}
.videoContent{
  width:100%;
  height:100%;
  text-indent:0;
  position: relative;
  .backgroundimg{
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    background-color: #000;
    -webkit-filter: blur(5px);
    -moz-filter: blur(5px);
    -ms-filter: blur(5px);
    filter: blur(5px);
    filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=5,MakeShadow=false);
  }
  .changesrc{
    position: absolute;
    top:20px;
    right:20px;
    z-index:10;
  }
  .videoControll{
    position: absolute;
    left:0;
    width:100%;
    z-index:10;
    background-color:rgba(0,0,0,0.4);
    bottom:0;
    height:60px;
    .vcTop{
      padding:0;
      margin:0;
      line-height:200px;
      list-style:none;
      display:-webkit-box;
      display:-moz-box;
      display:-ms-flexbox;
      display:-webkit-flex;
      display:flex;
      color:#fff;
      -webkit-flex-flow:row nowrap;
      justify-content:space-around;
      height:38px;
      line-height: 40px;
      .vcPlayBtn{
        margin-right:10px;
        font-size:24px;
      }
      .volumecontrol{
        display:table-cell;
        vertical-align:middle;
        .voice-box {
          display: inline-block;
          position: relative;
          height: 30px;
          width: 124px;
          opacity: 0.7;
          line-height: 30px;
          top: 5px;
          margin-left: 5px;
          filter: alpha(opacity=70);
        }

        .voice-line {
          cursor: pointer;
          position: absolute;
          top: 13px;
          height: 4px;
          width: 124px;
          background: #ddd;
        }

        .voice-volume {
          position: absolute;
          top: 13px;
          height: 4px;
          cursor: pointer;
          background: #57a900;
        }
        .pictopic{
          cursor: pointer;
        }
        .voice-btn {
          position: absolute;
          top: 9px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
        }
      }
      .captureBtn{
        font-size:24px;
        margin-right:10px;
      }
      .vcFullBtn{
        font-size:24px;
      }
    }
    .vcBottom{
      position: relative;
      height:22px;
      .up{
        position: relative;
        top:9px;
        height:4px;
        background-color:rgba(0,0,0,0.5);
        &:before{
          content:"";
          position:absolute;
          top:-9px;
          left:0;
          bottom:-9px;
          right:0;
        }
        .centercolor{
          height: 4px;
          margin-top: 0px;
          width: 0px;
          top: 0px;
          position: absolute;
          background-color:#fff;
        }
        .voice-btn {
          position: absolute;
          top: -3px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
        }
      }
    }
    .vcPlayTime{
        margin-right:10px;
        position: absolute;
        bottom:0;
        color:#fff;
        line-height: 22px;
        right:50px;
      }
  }
}
.videobox{
  height:300px;
}
.sub .el-icon-circle-close:before{
  font-size:40px;
  color:#fff;
}
</style>
