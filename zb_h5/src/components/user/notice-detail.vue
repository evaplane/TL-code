<template>
  <div class="notice-detail-box">
    <back :shadow="backBarShadow" title="__('通知')" close @close="close" />
    <div class="notice-detail-wrap">
      <native-scroll @scroll="scrollHandle">
        <span class="notice-detail-time">__('通知时间') {{ detail.publishTime | date('YYYY-MM-DD') }}</span>
        <p class="notice-detail-content" v-html="detail.content" />
      </native-scroll>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { INoticy } from '@/api/community';

@Component({
  components: {
    back
  }
})
export default class NoticeDetail extends Vue {
  @Prop({ default: {} }) detail!: INoticy;
  // eslint-disable-next-line
  backBarShadow: boolean = false;
  scrollHandle(pos: INativeScrollPos) {
    this.backBarShadow = pos.y > 10;
  }
  @Emit()
  close() {}
}
</script>
<style lang='scss'>
.notice-detail-box {
  position: fixed;
  z-index: 3000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--default-bg);
  .notice-detail-wrap {
    color: #444;
    line-height: 1.15;
    @include dark {
      color: #c4cad2;
    }
    height: 100%;
    .m-scroll {
      padding: 15px;
    }
    .notice-detail-title {
      word-break: break-all;
      color: #333;
      font-size: 20px;
      line-height: 1.4;
      margin: 0;
      @include dark {
        color: #d7dce2;
      }
    }
    .notice-detail-time {
      display: block;
      text-align: center;
      font-size: 0.32rem /* 12px */;
      margin-top: 0.1333333rem /* 5px */;
      color: #888;
    }
  }
  .notice-detail-content {
    margin-top: 16px;
    align-self: flex-start;
    font-size: 14px;
    word-break: break-all;
    p {
      line-height: 1.5;
      margin: 15px 0;
    }
    img {
      max-width: 100% !important;
      height: auto !important;
      padding: 10px 0;
    }
    h1.art_tit {
      display: none;
    }
    span.author,
    span.push_time {
      display: none;
    }
  }
}
</style>
