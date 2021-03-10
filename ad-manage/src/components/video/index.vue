<template>
    <div class='video' v-loading="loading">
        <!-- x-webkit-airplay="allow" preload="auto" -->
       <!-- <video id="video1" src="../../assets/video/620x252_bend_reality.mp4" autoplay controls @error="error"></video>
        <div id="output"></div>
        <el-button @click="captureImage">默认按钮</el-button> -->
        <video :src="src" style="width:150px;" autoplay controls id='breakVideo' v-show="showVideo"></video>
        <!-- 进度条 -->
        <div class="progressBox" v-if="showProgress">
            <span class="progressItem" ref="progressItem"></span>
        </div>
        <input type="file" class="bigFile" @change="computedSliceMd5" ref="file" name="file">
        <div class="btns">
            <Button type="primary" v-if="!pauseStatus" @click="toUpload">上传</Button>
            <Button type="default" v-if="pauseStatus" @click="pauseUpload">取消</Button>
        </div>
    </div>


</template>
<script>
import { setTimeout } from 'timers';
import SparkMD5 from 'spark-md5';
export default {
    name:'video2',
    data(){
        return {
           videoSrc:"../../assets/video/620x252_bend_reality.mp4",
           showVideo: false,
           blobSlice: null,
           file: null,
           identifier: null,
           chunkSize: 10240000,
           chunks: 0,
           currentChunk: 0,
           spark: null,
           fileReader: null,
           tmpDataList: [],
           formDataList: [],
           uploadedList: [],
           start: 0,
           end: 0,
           headers: {},
           xhr: null,
           pauseStatus: false,
           showProgress: false,
           percent: 0,
           src:'',
           // 分片上传id
           uploadId:'',
           // 是否是最后一片
           isLast:false,
           loading:false
        }
    },
    created() { //一些变量的初始化
        // if (Boolean(this.src)) {
        //     this.showVideo = true;
        // }
        this.blobSlice =
            window.File.prototype.slice ||
            window.File.prototype.mozSlice ||
            window.File.prototype.webkitSlice;
        this.spark = new SparkMD5.ArrayBuffer();
        this.fileReader = new FileReader();
        this.percent = 0;
    },
    methods:{
        // 上传
        toUpload(){
            if(this.formDataList.length == this.tmpDataList.length){
                this.uploadFile(1,this.formDataList)
            }
        },
        captureImage() {
            setTimeout(()=>{
            const output = document.getElementById('output')
            const video = document.getElementById('video1')
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth 
            canvas.height = video.videoHeight
            const img = new Image()
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
            const dataUrl = canvas.toDataURL('image/png')
            img.src = dataUrl
            output.appendChild(img)
            },100)
        },
        error(val){
            console.log(val);
        },
        /**
         * 计算MD5
         */
        computedSliceMd5() {  //获取文件的md5编码
            this.file = this.$refs.file.files[0];
            this.identifier = this.spark.end(); //文件的MD5身份标识
            this.checkMd5();
            if(this.file.type!='video/mp4'){
                this.$message.warning('只能上传MP4格式的视频')
                return
            }
            if(this.file.size<10240000){
                this.$message.info('直接上传')
                return 
            }
            // 总片数
            this.chunks = Math.ceil(this.file.size / this.chunkSize);
            this.fileReader.onload = e => {
                this.spark.append(e.target.result); // Append array buffer
                // 每片的num
                this.currentChunk++;
                if (this.currentChunk < this.chunks) {
                    this.loadNext();
                } else {
                    this.tmpDataList.map((el, i) => {
                        let formData = new FormData();
                        formData.append("objKeyName", this.file.name);
                        formData.append("file", el.file);
                        formData.append("partNum", el.partNum);
                        formData.append("uploadId", this.uploadId);
                        formData.append("isLast", el.isLast);
                        this.formDataList.push(formData);
                    })
                }
            };
            this.fileReader.onerror = function() {
                this.$message.error("读取文件出错，请重试");
            };
            this.loadNext();
        },
        checkMd5() { //断点续传需要用的方法，断点续传获取到的是已经上传过去的分片编号，已经上传过的分片直接跳过去
            this.$get(`storage-web/storageObj/getUploadId?fileMd5=${this.identifier}&objKeyName=${this.file.name}`).then(res=>{
                if(res.code=='000000'){
                    this.uploadId = res.data
                    this.showVideo = false;
                }
            })
        },
        loadNext() { //文件切片
            (this.start = this.currentChunk * this.chunkSize),
                (this.isLast = this.start + this.chunkSize >= this.file.size?true:false),
                (this.end =
                    this.start + this.chunkSize >= this.file.size
                        ? this.file.size
                        : this.start + this.chunkSize);
            let pieceFile = this.blobSlice.call(
                this.file,
                this.start,
                this.end
            );
            pieceFile.name = this.file.name;
            let tmpObj = {
                file: pieceFile,
                objKeyName:this.file.name,
                partNum: this.currentChunk,
                isLast:this.isLast,
                currentSize:this.end - this.start
            };
            this.tmpDataList.push(tmpObj);
            this.fileReader.readAsArrayBuffer(pieceFile);
        },
        // 分片上传
        uploadFile(n,formDataList) {
            console.log("formDataList",formDataList);
            console.log("n",n);
            this.loading=true
            let status = formDataList.indexOf(n+1) == -1 ? true : false;
            console.log("status",status);
            let key = n - 1;
            if (status) {
               this.$post('storage-web/storageObj/multipartUpload',formDataList[key]).then(res=>{
                if(res.code=='000000'){
                    this.percent += Math.floor(100/this.chunks);
                    // this.changeProgress(1)
                    if(res.data!=''){
                        this.loading=false
                        this.src = res.data
                        this.showVideo=true
                        setTimeout(()=>{
                            this.initParam(1, "上传成功");
                        },20)
                        return
                    }
                    this.uploadFile(n+1,this.formDataList)
                }else{
                    this.$message.warning(res.message)
                }
               })
            }else{
                // this.percent += Math.floor(100/this.chunks);
                // this.changeProgress(1);
            }
        },
        // 显示进度条
         getProgress(evt) { //ajax进度条回调方法
            console.log(evt);
            if (evt.lengthComputable) {
                this.percent += Math.floor(
                    (evt.loaded * 100) / this.chunks / evt.total
                );
                if(this.percent>=99){
                    this.percent = 99;
                }
                // this.changeProgress(1);
            } else {
                // this.changeProgress(0);
            }
        },
        // changeProgress(type) { //进度条展示
        //     if (type) {
        //         this.$refs.progressItem.innerHTML =
        //             this.percent.toFixed(2) + "%";
        //         this.$refs.progressItem.style.width =
        //             this.percent.toFixed(2) + "%";
        //     } else {
        //         this.$refs.progressItem.innerHTML = "上传失败";
        //     }
        // },
        initParam(type, msg) { //成功或失败之后的初始化
            this.percent = 0;
            this.pauseStatus = false;
            this.showProgress = false;
            this.file = null;
            this.identifier = null;
            this.chunks = 0;
            this.currentChunk = 0;
            this.tmpDataList = [];
            this.formDataList = [];
            this.uploadedList = [];
            this.start = 0;
            this.end = 0;
            this.$refs.file.value = "";
            if (type == 1) {
                this.showVideo = true;
                this.$Message.success(msg);
            } else {
                this.showVideo = false;
                this.$Message.error(msg);
            }
        },
    }
}
</script>
<style lang="scss">
    .progressBox {
        display: inline-block;
        width: 200px;
        height: 20px;
        background-color: gray;
        vertical-align: middle;
    }
    .progressItem {
        display: inline-block;
        height: 20px;
        background-color: #2d8cf0;
        font-weight: bold;
        color:#ffffff;
    }
</style>