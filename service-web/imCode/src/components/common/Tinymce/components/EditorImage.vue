<template>
  <div class="upload-container">
    <!-- <el-button class="upload" :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
    </el-button> -->

    <el-upload
      :show-file-list="false"
      :on-success="handleSuccess"
      append-to-body="true"
      :headers="headers"
      :action="action"
      name="file"
      class="upload"
    >
      <!-- <el-tooltip content="图片" placement="bottom"> -->
      <i class="iconfont-main icon-tupian" title="图片"></i>
      <!-- </el-tooltip> -->
    </el-upload>

    <!-- <el-dialog :visible.sync="dialogVisible" append-to-body	>
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        append-to-body="true"
        class="editor-slide-upload"
        list-type="picture-card"
        :action="action"
      >
        <el-button size="small" type="primary">
          选择图片
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确定
      </el-button>

    </el-dialog> -->
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token")
      },
      dialogVisible: false,
      action:this.$httpServer.im_fdfsupload,
      ticketTimeSrc:'',
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message1('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
      // console.log(this.listObj,this.fileList)
      // console.log(arr);
      this.$emit('successCBK', arr)

    },
    handleSuccess(res,file) {
      // console.log(file)
      // console.log(res,file)
      // console.log(file.raw)
      // this.$emit('imgSrc', file.raw)
      let that = this;
      let formdata = new FormData();
      formdata.append("file", file.raw);
      this.$axios
        .post(this.action, formdata)
        .then(res => {
          if (res && res.data) {
            that.ticketTimeSrc = res.data.data;
            that.$emit('imgSrc', that.ticketTimeSrc)
          }
        })

      // const uid = file.uid
      // const objKeyArr = Object.keys(this.listObj)
      // for (let i = 0, len = objKeyArr.length; i < len; i++) {
      //   if (this.listObj[objKeyArr[i]].uid === uid) {
      //     this.listObj[objKeyArr[i]].url = response.files.file
      //     this.listObj[objKeyArr[i]].hasSuccess = true
      //     return
      //   }
      // }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  },
  created(){
      this.headers.Authorization = 'Bearer ' + sessionStorage.getItem("token")
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  position: relative;
  .upload{
    position:absolute;
  }
  /deep/ .el-upload--picture-card {
    width: 100%;
  }

}
.upload{
  position:absolute;
  // top: 0;
  bottom: -43px;
  // bottom: -38px;
  // bottom: 10px;
  right: 35px;
  i{
    color: #999999;
    font-size: 20px;
  }
}
</style>
