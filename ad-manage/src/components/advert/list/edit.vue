<template>
  <div class='inner'>
    <!-- 内容 -->
    <div class="content" style='margin-right:10px;'>
         <el-row style="margin-bottom:0;border-bottom:1px solid #DCDFE6;line-height:50px;">
            <el-col :span="1"><div class="grid-content" style='color:#606266'>修改</div></el-col>
          </el-row>
        <el-form :model="adListEditForm" :rules="adListEditRules" ref="adListEditForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="广告分类名称: " prop="categoryCode">
              <el-select v-model="categoryCode" placeholder="请选择" @change="changeCategoryCode">  
                <el-option v-for="(item,index) in adListEditForm.categoryName" :key="index" :label="item.categoryName" :value="item.categoryCode"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告分类值: " prop="categoryCode">
              <el-input autocomplete="off" readonly="readonly" placeholder="广告分类值" class='readonlyInput' v-model="categoryCode"></el-input>
            </el-form-item>
            <el-form-item label="广告类别名称: " prop="typeValue">
              <el-select v-model="advtTypeValue" placeholder="请选择" @change='changeTypeValue'>  
                <el-option v-for="(item,index) in adListEditForm.advtType" :key="index" :label="item.typeName" :value="item.typeValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="广告名称: " prop="advtName">
              <el-input v-model="adListEditForm.advtName" autocomplete="off" placeholder="广告名称"></el-input>
            </el-form-item>
            <el-form-item label="广告URL: " prop="redirectUrl">
              <el-input v-model="adListEditForm.redirectUrl" autocomplete="off" class='phoneInput' placeholder="广告URL"></el-input>
            </el-form-item>
            <el-form-item label="广告标识: " prop="advtSign">
              <el-input v-model="adListEditForm.advtSign" :autosize="{ minRows: 2, maxRows: 4}" type='textarea' autocomplete="off" placeholder="广告标识"></el-input>
            </el-form-item>
             <el-form-item label="广告简介: " prop="advtDesc">
              <el-input v-model="adListEditForm.advtDesc" :autosize="{ minRows: 2, maxRows: 4}" type='textarea' autocomplete="off" placeholder="广告简介"></el-input>
            </el-form-item>
            <el-form-item label="广告内容: " prop="contentURL">
              <el-row style="margin-bottom:0px;">
                <el-upload
                  class="thumbnail-uploader"
                  ref="uploadImage"
                  :class="{hide:hideUpload}"
                  :file-list="contentFileList"
                  :action="uploadContentAction"
                  :on-change="imageChange"
                  list-type="picture-card"
                  name="files"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP,.mp4,.MP4"
                  :limit="9"
                  multiple
                  :auto-upload="false"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemovePicture"
                  :on-exceed="handleExceedPicture">
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}" v-if="previewVideo">
                    <video :src='file.url' preload="auto" class="thumbnail"></video>
                    <span class="el-upload-list__item-actions">
                      <span  class="el-upload-list__item-preview" @click="handleVideoPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                      </span>
                      <span class="el-upload-list__item-delete" @click="handleVideoRemove(file)">
                      <i class="el-icon-delete"></i>
                      </span>
                    </span>
                  </div>
                </el-upload>
                <el-dialog append-to-body title="图片详情" :visible.sync="contentVisible" width='60%'>
                  <img :src="dialogImageUrl" alt="" style="height:500px;width:100%">
                </el-dialog>
                <el-dialog append-to-body title="视频详情" :visible.sync="videoPreVisible" width='60%' :before-close="closeVideo">
                  <video :src='dialogVideo' ref="video" class="thumbnail" style="height:500px;width:100%" controls autoplay></video>
                </el-dialog>
              </el-row>
              <!-- 预览 -->
            </el-form-item>
            <el-form-item label="广告缩略图: " prop="thumbnailURL">
              <el-row style="margin-bottom:0px;">
                <el-upload
                  class="thumbnail-uploader"
                  :class="{hidethum:hideUploadThum}"
                  :action="uploadContentAction"
                  :show-file-list="true"
                  :file-list="thumFileList"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                  list-type="picture-card"
                  :on-change="showThumbnail"
                  :on-preview="handleThumbnailPreview"
                  :on-remove="handleThumbnailRemove"
                  :auto-upload='false'>
                  <i slot="default" class="el-icon-plus"></i>
                </el-upload>
                <el-dialog append-to-body title="图片详情" :visible.sync="contentthumVisible" width='60%'>
                  <img :src="dialogThumUrl" alt="" style="height:500px;width:100%">
                </el-dialog>
                </el-row>
            </el-form-item>
          </el-form>
          <el-row class='inner-button'>
            <el-col :span="2"><div class="grid-content">
                    <el-button plain @click="backToUser">返回</el-button>
            </div></el-col>
            <el-col :span="2"><div class="grid-content">
                    <el-button type="primary" @click="adListEditSubmit('adListEditForm')">确定</el-button>
            </div></el-col>
          </el-row>
    </div>
  </div>
</template>

<script>
import {delSelectTag} from '../../../js/util'
import SparkMD5 from 'spark-md5';
export default {
    name:'adListEdit',
    data(){
      var validateRedirectUrl = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入广告URL'));
        } else {
          var strRegex = "^((https|http)?://)"
            + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
            + "|" // 允许IP和DOMAIN（域名）
            + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
            + "[a-z]{2,6})" // first level domain- .com or .museum
            + "(:[0-9]{1,4})?" // 端口- :80
            + "((/?)|" // a slash isn't required if there is no file name
            + "(/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
          var re=new RegExp(strRegex);
          if (!re.test(value)||value == 'http'||value == 'https'){
            callback(new Error('只能输入http、https开头网址值'));
          }
          callback();
        }
      };  
      var validateThumbnailURL = (rule, value, callback) => {
        if(this.thumFileList.length == 0){
          callback(new Error('请选择缩略图'));
        } else {
          callback();
        }
      };
      var validateContentURL = (rule, value, callback) => {
        if(this.categoryCode == 'videoPauseAd'||this.categoryCode=='detailsAd'){
          if(this.contentFileList.length == 0){
            callback(new Error('请选择图片'));
          } else {
            if(this.contentFileList.length > 1){
              callback(new Error('仅能选择一张图片'));
            }else if(this.contentFileList[0].url.indexOf(".mp4") > -1){
              callback(new Error('仅能选择图片，不能选择视频'));
            }
            callback();
          }
        }else{
          if(this.contentFileList.length == 0 && this.previewVideo==''){
            callback(new Error('请选择图片或者视频'));
          } else {
            if(this.contentFileList.length > 1){
              callback(new Error('仅能选择一张图片'));
            }
            callback();
          }
        }
      };
      var validatorCategoryCode = (rule, value, callback) => {
           if (this.categoryCode === '') {
             callback(new Error('请选择广告分类名称'));
           }else{
               callback();
           }
       };
      var validatorTypeValue = (rule, value, callback) => {
           if (this.typeValue === '') {
             callback(new Error('请选择广告类别名称'));
           }else{
               callback();
           }
       };
      var validateAdvtSign = (rule, value, callback) => {
        if(this.adListEditForm.advtSign ==''){
          callback();
        }else if (this.adListEditForm.advtSign.match(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g)) {
          callback(new Error('不能输入表情'));
        }else{
          if(this.adListEditForm.advtSign&&this.adListEditForm.advtSign.length > 64){
            callback(new Error('请输入1-64位'));
          }
          callback();
        }
      };
      var advtDesc = (rule, value, callback) => {
        if(value==''){
          callback(new Error('请输入广告简介'));
        }else{
          if (value.length>120) {
            callback(new Error('请输入1-120位'));
          } else {
            callback();
          }
        }
      };  
      var advtName = (rule, value, callback) => {
        if(value==''){
          callback(new Error('请输入广告名称'));
        }else{
          if (value.length>26) {
            callback(new Error('请输入1-26位'));
          } else {
            callback();
          }
        }
      };  
      return {
        // 新增校验规则
        adListEditRules:{
            categoryCode: [
                {required:true,trigger: "change",validator:validatorCategoryCode }
            ],
            typeValue: [
                {required:true,trigger: "change",validator:validatorTypeValue}
            ],
            advtName: [
                {required:true,trigger: "change",validator:advtName}
            ],
            advtDesc: [
                {required:true,trigger: "change",validator:advtDesc}
            ],
            redirectUrl: [
                {required:true,trigger: "change", validator: validateRedirectUrl} 
            ],
            contentURL:[
                {required:true,trigger: "change", validator:validateContentURL}
            ],
            thumbnailURL:[
                {required:true,trigger: "change", validator:validateThumbnailURL}
            ],
            advtSign: [
                {type:'string',trigger: "change",validator: validateAdvtSign}
            ],
        },
        // 新增数据 
        adListEditForm:{
          categoryName:[],
          advtName:'',
          sortNo:'',
          advtDesc:'',
          advtType:[],
          advtSign:'',
          redirectUrl:''
        },
        // 新增被选中的广告分类值
        categoryCode:'',
        categoryName:'',
        // 被选中的广告类别值
        advtTypeValue:'',
        advtTypeName:'',
        currentQuery:'',
        // 视频还是图片
        type:10,
        contentFileList:[],
        // 内容列表对象

        // 内容视频对象
        previewVideo:'',
        // 预览图对象
        previewThumbnail:'',
        // 是否展示内容上传按钮
        hideUpload:false,
        // 上传地址,改为不传递
        uploadContentAction:'',
        // 内容图片详情dialog
        contentVisible:false,
        dialogImageUrl:'',
        // 内容视频详情dialog
        videoPreVisible:false,
        dialogVideo:'',
        // 是否展示缩略图上传按钮
        hideUploadThum:false,
        thumFileList:[],
        // 缩略图详情dialog
        contentthumVisible:false,
        dialogThumUrl:'',
        imgWidth:'',
        imgHeight:''
      }
    },
    created(){
        this.getCategoryName()
        this.getAdvtType()
        if(this.$route.query.id){
          this.showEditData()
        }
        
        // ie 11兼容 readAsBinaryString方法
        FileReader.prototype.readAsBinaryString = function (fileData) {
          var binary = "";
          var pt = this;
          var reader = new FileReader();
          reader.onload = function () {
              var bytes = new Uint8Array(reader.result);
              var length = bytes.byteLength;
              for (var i = 0; i < length; i++) {
                  binary += String.fromCharCode(bytes[i]);
              }
              pt.content = binary;
              pt.onload(pt); //页面内data取pt.content文件内容
          }
          reader.readAsArrayBuffer(fileData);
        } 
    },
    methods:{
        // 获取广告分类名称
        getCategoryName(){
          this.$get('content-web/advtCategory/categoryList').then(res=>{
              if(res.code=='000000'){
                this.adListEditForm.categoryName = res.data
              }
          })
        },
        // 获取广告类别名称
        getAdvtType(){
          this.$get('content-web/advtType/categoryList').then(res=>{
              if(res.code=='000000'){
                  this.adListEditForm.advtType = res.data
              }
          })
        },
        // 获取选中的广告分类名称
        changeCategoryCode(value){
          this.adListEditForm.categoryName.find((item)=>{
              if(item.categoryCode == value){
                this.categoryName = item.categoryName
              }
          });
        },
        // 获取选中的广告类别名称
        changeTypeValue(value){
          this.adListEditForm.advtType.find((item)=>{
            if(item.typeValue == value){
                this.advtTypeName = item.typeName
            }
          });
        },
        // 获取值显示在页面上
        showEditData(){
          this.$post('content-web/advtInfo/view',{id:this.$route.query.id}).then(res=>{
            if(res.code=='000000'){
              this.currentQuery = res.data;
              this.adListEditForm.advtDesc = this.currentQuery.advtDesc
              this.adListEditForm.advtName = this.currentQuery.advtName
              this.type = this.currentQuery.contentType
              this.categoryCode = this.currentQuery.categoryValue
              this.categoryName = this.currentQuery.categoryName
              this.advtTypeValue = this.currentQuery.advtTypeValue,
              this.advtTypeName = this.currentQuery.advtTypeName,
              this.adListEditForm.redirectUrl = this.currentQuery.redirectUrl
              this.adListEditForm.sortNo = this.currentQuery.sortNo
              this.adListEditForm.advtSign = this.currentQuery.advtSign
              if(this.currentQuery.contentType == 10){
                let srcs = this.currentQuery.contentUrl.split(',')
                for(let i =0;i<srcs.length;i++){
                  this.contentFileList.push({
                    name:'',
                    url:srcs[i]
                  });
                }
                
              }else{
                this.contentFileList = [{
                  name:'',
                  url:this.currentQuery.contentUrl
                }];
                this.previewVideo = [{
                  name:'',
                    url:this.currentQuery.contentUrl
                }];
              }
              this.hideUpload = true;
              this.thumFileList = [{
                name:'',
                url:this.currentQuery.thumbnailUrl
              }];
              this.hideUploadThum = true;
              let that = this;
              setTimeout(()=>{
                var img = new Image();
                img.src  = res.data.thumbnailUrl;
                img.onload = function(){
                  that.imgWidth = img.width;
                  that.imgHeight = img.height;
                };
              },0)
            }
          })
        },
        // 修改保存 
        adListEditSubmit(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
               let contentUrl = '';
                if(this.type==10){
                  const fileList = this.contentFileList;
                  for(let i = 0;i<fileList.length;i++){
                    contentUrl += fileList[i].url;
                    if(i !== fileList.length-1){
                      contentUrl += ','
                    }
                  }
                }else{
                  if(Object.prototype.toString.call(this.previewVideo) === "[object Array]"){
                    contentUrl = this.previewVideo[0].url;
                  }else{
                    contentUrl = this.previewVideo.url;
                  }
                }
                this.submit(contentUrl);
              } else {
                this.$message.error('输入格式不正确');
                return false;
              }
            });
        },  
        // 返回
        backToUser(){
            delSelectTag(this.$route);
            this.$router.history.go(-1);
        },
        // 提交
        submit(contentUrl){
          let data ={
            id:this.currentQuery.id,
            advtDesc:this.adListEditForm.advtDesc,
            advtName:this.adListEditForm.advtName,
            contentType:this.type,
            categoryName:this.categoryName,
            categoryValue:this.categoryCode,
            redirectUrl:this.adListEditForm.redirectUrl,
            advtTypeValue:this.advtTypeValue,
            advtTypeName:this.advtTypeName,
            contentUrl:contentUrl,
            sortNo:this.adListEditForm.sortNo,
            thumbnailUrl:this.thumFileList[0].url,
            advtSign:this.adListEditForm.advtSign,
            thumbnailWide:this.imgWidth,
            thumbnailHigh:this.imgHeight
          };
          this.$post('content-web/advtInfo/update',data).then(res=>{
            if(res.code=='000000'){
              this.$message.success(res.message)
              this.backToUser()
            }else{
              this.$message.warning(res.message)
            }
          })      
        },
        imageChange(file,fileList){
          var selectArr = ["image/png","image/x-png","image/pjpeg","image/jpeg","application/x-jpg","image/gif","application/x-bmp"];
          var videoArr = ["video/mpeg4","video/mp4"];
          if(this.categoryCode == 'videoPauseAd'||this.categoryCode=='detailsAd'){
            if(selectArr.indexOf(file.raw.type) == -1){
              fileList.pop();
              this.$message.error('请选择图片');
              return;
            }
          }else{
            if(selectArr.indexOf(file.raw.type) == -1&&videoArr.indexOf(file.raw.type) == -1){
              fileList.pop();
              this.$message.error('请选择图片或视频');
              return;
            }
          }
          let that = this;
          setTimeout(()=>{
            if(this.type == 10){
              this.hideUpload = fileList.length >= 1;
            }else{
              this.hideUpload = this.$refs.uploadImage.uploadFiles.length >= 1;
            }
          },0);
          if(file.raw.type.indexOf('image')!=-1){
            this.type = 10;
            let formData = new FormData();
            let fileReader = new FileReader();
            let spark = new SparkMD5();
            fileReader.readAsBinaryString(file.raw);
            fileReader.onload = function(e) {
              spark.appendBinary(e.content);
              var md5 = spark.end()
              formData.append("fileMd5",md5)
              formData.append("fileMd5",md5)
              formData.append("file",file.raw)
              formData.append("objKeyName",file.name)
              that.$post('/storage-web/storageObj/upload',formData).then(res=>{
                if(res.code=='000000'){
                  fileList.forEach(v=>{
                    if(v.name == file.name){
                      file.url = res.data
                    }
                  });
                  that.contentFileList = fileList;
                  that.$refs.adListEditForm.validateField('contentURL');
                }else{
                  this.$message.warning(res.message);
                }
              })
            };    
          }else{
            if(fileList.length>1){
              if(file.raw.type.indexOf('video')!=-1){
              fileList.pop()
              this.$message.warning('不能选择视频')
              return
              }
            }else{
              const isLt10M = file.size / 1024 / 1024  < 20;
              if(!isLt10M){
                fileList.pop();
                this.$message.error('上传视频大小不能超过20MB哦');
                return false;
              }
            }
            this.type = 20;
            this.hideUpload = true;
            fileList = fileList[fileList.length-1]
            let formData = new FormData();
            let fileReader = new FileReader();
            let spark = new SparkMD5();
            fileReader.readAsBinaryString(file.raw);
            fileReader.onload = function(e) {
              spark.appendBinary(e.content);
              var md5 = spark.end()
              formData.append("fileMd5",md5)
              formData.append("fileMd5",md5)
              formData.append("file",file.raw)
              formData.append("objKeyName",file.name)
              that.$post('/storage-web/storageObj/upload',formData).then(res=>{
                if(res.code=='000000'){
                  fileList.url =  res.data
                  that.previewVideo = fileList;
                  that.$refs.adListEditForm.validateField('contentURL');
                }else{
                  this.$message.warning(res.message);
                }
              })
            }; 
          }
        },
        handlePictureCardPreview(file){
          this.contentVisible = true
          this.dialogImageUrl = file.url;
        },
        handleExceedPicture(){
          this.$message.error("当前选择的图片已超过9张，无法上传")
        },
        handleRemovePicture(file,fileList){
          this.hideUpload = fileList.length >= 1;
          this.contentFileList = fileList;
        },   
        showThumbnail(file,fileList){
          var selectArr = ["image/png","image/x-png","image/pjpeg","image/jpeg","application/x-jpg","image/gif","application/x-bmp"];
          if(selectArr.indexOf(file.raw.type) == -1){
            fileList.pop();
            this.$message.error('请选择图片');
            return;
          }
          let that = this;
          setTimeout(()=>{
            this.hideUploadThum = fileList.length >= 1;
            var img = new Image();
            img.src  = file.url;
            img.onload = function(){
              that.imgWidth = img.width;
              that.imgHeight = img.height;
            };
          },0);
          var formData = new FormData();
          var fileReader = new FileReader();
          var spark = new SparkMD5();
          fileReader.readAsBinaryString(file.raw);
          fileReader.onload = function(e) {
            spark.appendBinary(e.content);
            var md5 = spark.end()
            formData.append("fileMd5",md5)
            formData.append("fileMd5",md5)
            formData.append("file",file.raw)
            formData.append("objKeyName",file.name)
            that.$post('/storage-web/storageObj/upload',formData).then(res=>{
              if(res.code=='000000'){
                fileList.forEach(v=>{
                  if(v.name == file.name){
                    file.url = res.data
                  }
                });
                that.thumFileList = fileList;
                that.$refs.adListEditForm.validateField('thumbnailURL');
              }else{
                that.$message.warning(res.message);
              }
            })
          };
          
        },
        handleThumbnailPreview(file){
          this.contentthumVisible = true
          this.dialogThumUrl = file.url;
        },
        // 移除视频
        handleVideoRemove(){
        this.$refs.uploadImage.clearFiles();
        this.hideUpload = this.$refs.uploadImage.uploadFiles.length >= 1;
        this.previewVideo = ''
        this.contentFileList = []
        this.$refs.uploadImage.clearFiles();
        },
        handleVideoPreview(file){
          this.videoPreVisible = true
          this.dialogVideo = file.url;
        },
        closeVideo(done){
          this.$refs.video.pause();
          this.$refs.video.currentTime=0;
          done();
        },
        // 移除缩略图
        handleThumbnailRemove(file,fileList){
          this.hideUploadThum = fileList.length >= 1;
          this.thumFileList = fileList;
        }
    }
}
</script>

<style lang='scss'>
    #previewBox,#previewThumbnailBox{
      border: 1px solid #ccc;
      min-height: 100px;
    }
    .readonlyInput>.el-input__inner{
        cursor: pointer;
        background-color: rgb(238, 238, 238);
    }
    .el-input-number{
        width: 7%;
    }
    .el-input-number.is-controls-right .el-input-number__decrease{
        bottom: 2px;
        height: 18px;
    }
    .el-input-number.is-controls-right .el-input-number__increase{
        top: 3px;
        height: 18px;
    }
    #previewImgBox,#previewThumbnailBox{
      border: 1px solid #ccc;
      text-align:left;
      line-height:10px;
      text-indent:unset;
      min-height: 100px;                        
      height: calc( 100% - 2px);
    }
    #previewBox{
      border: 1px solid #ccc;
      text-align:left;
      line-height:10px;
      height: 200px;
    }
    .inputBox{
      padding: 10px;
    }
    .thumbnail-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .thumbnail-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .thumbnail {
      width: 148px;
      height: 148px;
      display: block;
    }
    .el-upload--picture-card{
      background-color: #fff;
    }
    .el-upload-list.el-upload-list--text{
      display: none
    }
    .hide .el-upload--picture-card {
      display: none!important;
    }
    .hidethum .el-upload--picture-card {
      display: none!important;
    }
    .el-upload-list__item.is-success .el-upload-list__item-status-label{
      display: none;
    }
</style>
