<template>
  <div class="app-warp">
    <div class="back">
      <a v-if="isHideMode === false" href="https://m.zb.plus/cn/#/i/index" class="return-btn"><back /></a>APP下载
      <a href="javascript:;"
        v-if="isHideMode === false"
        :data-clipboard-text="url"
        @click="pasteHandle"
        class="btn-copy app-download-url"
        data-clipboard-action="copy"
        >
        分享地址
      </a>
    </div>
    <div class="app-content">
      <native-scroll>
        <div class="banner">
          <h1>全球领先的数字资产交易平台</h1>
          <h3>APP 4.0邀请体验</h3>
          <div class="banner-block">
            <img src="@/assets/img/app/banner-center.svg" />
          </div>
        </div>
        <div class="app-main">
          <ul class="list">
            <li>
              <img src="@/assets/img/app/1.svg" />
              <h3>6年安全运营</h3>
              <p>6年安全运营，7x24小时在线客服</p>
            </li>
            <li>
              <img src="@/assets/img/app/2.svg" />
              <h3>一站式服务</h3>
              <p>场外发币交易、现货交易、杠杆交易</p>
            </li>
            <li>
              <img src="@/assets/img/app/3.svg" />
              <h3>数字资产管理</h3>
              <p>支持数百币种资产，商业级数字资产管理体系</p>
            </li>
          </ul>
          <div class="app-img">
            <img src="@/assets/img/app/app.svg" />
          </div>
        </div>
      </native-scroll>
    </div>
    <div class="app-footer">
      <button @click="download" class="download">下载APP</button>
    </div>
    <transition name="fade">
      <div @click="modalActive = false" @touchmove.prevent class="modal" v-if="modalActive">
        <div class="modal-content">
          <img src="@/assets/img/app/dotted-line.svg" />
          <img class="browser safari" src="@/assets/img/app/safari.svg" />
          <img class="browser android" src="@/assets/img/app/android-browser.svg" />
          <div class="content">
            <p class>请点击右上角</p>
            <p class="text safari">选择“在Safari中打开”</p>
            <p class="text android">选择“在浏览器中打开”</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { isIOS, isAndroid, isWeixin } from '@/utils/is';
import { Vue, Component } from 'vue-property-decorator';
import back from '@/components/common/icons/return.vue';
import Clipboard from 'clipboard';

@Component({
  components: {
    back
  }
})
export default class AppView extends Vue {
  modalActive: boolean = false;
  url: string = window.location.href;
  backClick() {
    this.$router.back();
  }
  get isHideMode(): boolean {
    return !!this.$route.query.h;
  }
  pasteHandle() {
    let clipboard = new Clipboard('.app-download-url');
    clipboard.on('success', () => {
      this.$message.success('__("拷贝地址成功")');
    });
    clipboard.on('error', () => {
      this.$message.warn('__("复制失败,请手动复制")');
    });
  }
  download() {
    if (isIOS === true) {
      if (isWeixin === true) {
        this.modalActive = true;
        return;
      }
      window.location.href = 'https://testflight.apple.com/join/tMvR2ZOy';
    } else if (isAndroid === true) {
      if (isWeixin === true) {
        this.modalActive = true;
        return;
      }
      window.location.href = 'https://wowchat-test.oss-cn-shenzhen.aliyuncs.com/zb/Test/ZB.apk';
    }
  }
  mounted() {
    if (isIOS === true) {
      document.body.classList.add('ios');
    } else {
      document.body.classList.add('android');
    }
  }
}
</script>
<style lang='scss'>
body.dark {
  background-color: #fff;
}
$sidle: 32px;
.app-warp {
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  .back {
    position: relative;
    flex: none;
    background-color: #1b1924;
    transition: all 0.3s;
    font-size: 20px;
    text-align: center;
    padding: 15px 0;
    color: #fff;
    .return-btn {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
    .btn-copy {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 0.8;
    }
  }
  .app-content {
    flex: 1;
    overflow: hidden;
  }
  .banner {
    height: 310px;
    background: url('~@/assets/img/app/banner.svg') no-repeat;
    background-size: cover;
    position: relative;
    color: #ffffff;
    h1 {
      font-size: 24px;
      text-align: center;
      padding: 40px 20px 10px;
      font-weight: 500;
    }
    h3 {
      font-size: 16px;
      text-align: center;
      font-weight: 400;
    }
  }
  .banner-block {
    text-align: center;
    padding-top: 24px;
  }
  .app-main {
    .list {
      h3 {
        font-size: 16px;
        color: #333333;
      }

      li {
        padding: 20px $sidle;
      }

      p {
        font-size: 12px;
        padding-top: 6px;
        color: #999999;
      }

      img {
        width: 48px;
        height: 48px;
        float: left;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
    .app-img {
      padding: 30px 0;
      text-align: center;
    }
  }

  .app-footer {
    flex: none;
    text-align: center;
    background-color: #fff;
    padding: 15px;
    box-shadow: 0 0 10px rgba(0,0,0,.1);
    button {
      border: 1px solid #e91c41;
      border-radius: 2px;
      font-size: 16px;
      color: #ffffff;
      background: #e91c41;
      display: block;
      width: 100%;
      padding: 14px 0;
      outline: none;
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.9);
    transition: all 0.3s;
    .modal-content {
      position: absolute;
      right: 20px;
      top: 20px;
    }
    img {
      display: block;
    }
    .browser {
      margin: 5px 0;
      transform: translateX(-50%);
      display: none;
    }
    .content {
      text-align: center;
      color: #fff;
      position: absolute;
      transform: translateX(-50%);
      font-size: 14px;
      color: #ffffff;
      line-height: 24px;
    }
    .text {
      display: none;
      max-width: 230px;
      min-width: 170px;
    }
  }
  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
}
.ios .modal .safari {
  display: block;
}
.android .modal .android {
  display: block;
}
</style>
