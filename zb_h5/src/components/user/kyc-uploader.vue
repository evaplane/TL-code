<template>
  <div v-loading="uploading" class="kyc-img-uploader" @click="uploaderClickHandle">
    <input type="file" ref="input" @change="fileChangeHandle" />
    <img class="img-stage" :src="value || defaultBg" />
    <slot>
      <i class="zbicon-camera"></i>
      <i class="icon-corner left top"></i>
      <i class="icon-corner right top"></i>
      <i class="icon-corner left bottom"></i>
      <i class="icon-corner right bottom"></i>
    </slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { uploadKycImageJson } from '@/api/user';

@Component
export default class KycUploader extends Vue {
  @Prop({ type: String, default: '' }) defaultBg!: string;
  @Prop({ type: String, default: '' }) value!: string;

  file: File | null = null;
  uploading: boolean = false;

  '$refs': {
    input: HTMLInputElement;
  };

  /** 点击上传选择图片 */
  uploaderClickHandle() {
    this.$refs.input.value = '';
    this.$refs.input.click();
  }

  /** 文件发生变更 */
  fileChangeHandle(e: any) {
    if (e.target && e.target.files) {
      this.file = e.target.files[0];
      this.uploadImg();
    }
  }
  @Emit()
  input(url: string) {
    return url;
  }
  async uploadImg() {
    if (this.file === null) return;
    try {
      this.uploading = true;
      const fd = new FormData();
      fd.append('file', this.file);
      let res = await uploadKycImageJson({ type: 2 }, fd);
      if (res.resMsg.code === 1000) {
        this.input(res.datas.url);
      } else {
        if (res.resMsg) {
          this.$message.fail(res.resMsg.message);
        }
      }
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.uploading = false;
  }
}
</script>

<style lang="scss">
.kyc-img-uploader {
  position: relative;
  text-align: center;
  cursor: pointer;

  input[type='file'] {
    display: none;
  }

  img {
    width: 100%;
  }

  .icon-corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 1px solid rgba($color: #999, $alpha: 0.36); /* no */
    &.left {
      left: 0;
      border-right-color: transparent;
    }
    &.right {
      right: 0;
      border-left-color: transparent;
    }
    &.top {
      top: 0;
      border-bottom-color: transparent;
    }
    &.bottom {
      bottom: 0;
      border-top-color: transparent;
    }
  }
  .zbicon-camera {
    position: absolute;
    width: 60px;
    height: 60px;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background: url('~@img/user/zbicon-camera.svg') center no-repeat / contain;
  }
}
</style>
