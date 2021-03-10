<template>
  <div id="app">
    <router-view />
    <setting-panel />
    <van-popup :overlay="false" class="update-popup" get-container="body" position="top" v-model="visible">
      <div class="update-tips">
        <img class="update-bg" src="@img/update-bg.png" />
        <div class="tips-content">
          <h2 v-if="updateTitle">{{ updateTitle }}</h2>
          <p v-for="(text, index) in updateDescription" :key="index">
            {{ text }}
          </p>
        </div>
        <div class="tips-btn">
          <span @click="updateHandle" class="ok">立即更新</span>
          <span @click="noUpdateHandle">暂不更新</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import settingPanel from '@/components/index/setting-panel.vue';
import { subscribeInstalled, IVersion } from '@/utils/service-worker';

@Component({
  components: {
    settingPanel
  }
})
export default class App extends Vue {
  visible: boolean = false;
  updateTitle: string = '';
  updateDescription: string[] = [];
  onInstalled(info: IVersion) {
    this.updateTitle = info.title;
    this.updateDescription = info.description || [];
    this.visible = true;
  }
  noUpdateHandle() {
    this.visible = false;
  }
  updateHandle() {
    // 通知workbox启用新的service worker
    navigator.serviceWorker.getRegistration().then(sw => {
      if (sw && sw.waiting) {
        sw.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
    window.setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  created() {
    subscribeInstalled(this.onInstalled);
  }
}
</script>

<style lang='scss'>
.update-popup {
  background: transparent;
  height: 100%;
  .update-tips {
    font-size: 12px;
    width: 280px;
    position: absolute;
    left: 50%;
    top: calc(50% - 30px);
    transform: translate3d(-50%, -50%, 0);
    .update-bg {
      max-width: 100%;
      height: auto;
      vertical-align: middle;
    }
  }
  .tips-content {
    position: absolute;
    left: 40px;
    right: 40px;
    top: 160px;
    z-index: 1;
    h2 {
      font-size: 16px;
      @include bold;
      color: #313038;
      margin-bottom: 10px;
    }
    p {
      color: #6b707b;
      line-height: 1.5;
      word-break: break-all;
      margin-bottom: 3px;
    }
  }
  .tips-btn {
    position: absolute;
    left: 40px;
    right: 40px;
    bottom: 20px;
    z-index: 1;
    text-align: center;
    span {
      display: block;
      color: #8e939e;
      &.ok {
        font-size: 14px;
        background-color: #e91c41;
        color: #fff;
        padding: 12px 0;
        border-radius: 2px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
