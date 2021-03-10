<template>
  <div class="annoucement-detail-box">
    <back :shadow="backBarShadow" title="__('公告详情')" />
    <div class="annoucement-detail-wrap">
      <native-scroll @scroll="scrollHandle">
        <h1 class="annoucement-detail-title">{{ info.title }}</h1>
        <span class="annoucement-detail-time">{{ info.createTime | date('YYYY-MM-DD hh:mm:ss') }}</span>
        <p class="annoucement-detail-content" v-html="info.content" />
      </native-scroll>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { getNotifyDetail, INoticy, IAnnouncementParams } from '@/api/community';
@Component({
  components: {
    back
  }
})
export default class AnnoucementDetail extends Vue {
  // eslint-disable-next-line
  info = {} as INoticy;
  loading: boolean = true;
  backBarShadow: boolean = false;
  mounted() {
    this.getDetail();
  }
  scrollHandle(pos: INativeScrollPos) {
    this.backBarShadow = pos.y > 10;
  }
  async getDetail() {
    try {
      let { detailId, notifyId, isRead } = this.$route.query;
      let params: IAnnouncementParams = {
        type: 2001,
        detailId: detailId + '',
        notifyId: notifyId + ''
      };
      if (isRead) {
        params.isRead = isRead + '';
      }
      let { notifyDetail } = await getNotifyDetail(params);
      this.info = notifyDetail;
      this.loading = false;
    } catch (err) {
      this.loading = false;
    }
  }
}
</script>
<style lang='scss'>
.annoucement-detail-box {
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
  .annoucement-detail-wrap {
    height: 100%;
    .m-scroll {
      padding: 15px;
    }
    .annoucement-detail-title {
      word-break: break-all;
      font-size: 18px;
      line-height: 1.5;
      color: var(--heavy-color);
    }
    .annoucement-detail-time {
      display: block;
      margin-top: 10px;
      color: var(--thin-color);
    }
  }
  .annoucement-detail-content {
    p {
      font-size: 14px !important;
      line-height: 1.5;
      padding: 10px 0 !important;
      word-break: break-all;
      color: var(--title-color) !important;
    }
    img {
      width: 100%;
    }
  }
}
</style>
