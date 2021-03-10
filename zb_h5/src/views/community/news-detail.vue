<template>
  <div class="new-detail-box" v-loading="loading">
    <back :shadow="backBarShadow"  title="__('新闻详情')"/>
    <no-data :visible="!info && !loading" />
    <div class="new-detail-content" v-if="info">
      <native-scroll @scroll="scrollHandle">
        <div class="new-detail-wrap">
        <h1 class="new-detail-title">{{ info.title }}</h1>
        <div class="new-detail-time">{{ info.createTime | date('YYYY-MM-DD hh:mm:ss') }}</div>
        <div class="new-detail-summary" v-if="info.summary">{{ info.summary }}</div>
        <div class="new-detail-info" v-html="info.content" />
        </div>
      </native-scroll>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { newDetail, INewsList } from '@/api/community';
import { Getter } from 'vuex-class';
import MixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';

@Component({
  components: {
    back
  }
})
export default class NewDetail extends Mixins(MixinsSignHooks) implements ISignHooks {
  @Getter('isLogin', { namespace: 'user' }) public isLogin!: boolean;
  // eslint-disable-next-line
  info = {} as INewsList;
  loading: boolean = true;
  backBarShadow: boolean = false;
  mounted() {
    if (!this.isLogin) {
      this.getDetail();
    }
  }
  signIn() {
    this.getDetail();
  }
  signOut() {}
  async getDetail() {
    try {
      let { news } = await newDetail({
        newsId: this.$route.query.id + ''
      });
      this.info = news;
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }
  scrollHandle(pos: INativeScrollPos) {
    this.backBarShadow = pos.y > 10;
  }
}
</script>
<style lang='scss'>
.new-detail-box {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background: var(--default-bg);
  .new-detail-content {
    flex: 1;
    overflow: hidden;
    .new-detail-wrap {
      padding: 15px;
    }
    .new-detail-title {
      word-break: break-all;
      font-size: 18px;
      line-height: 1.5;
      color: var(--heavy-color);
    }
    .new-detail-time {
      color: var(--thin-color);
      margin-top: 10px;
    }
    .new-detail-summary {
      background: #f7f8fd;
      @include dark {
        background: #2f2e35;
      }
      margin: 20px 0;
      font-size: 14px;
      padding: 15px;
      position: relative;
      overflow: hidden;
      border-radius: 4px; /* no */
      line-height: 1.5;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0px;
        width: 4px;
        background: var(--primary-color);
      }
    }
    .new-detail-info {
      font-size: 14px;
      word-break: break-all;
      color: var(--title-color);
      line-height: 1.8;
      img {
        width: 100%;
      }
      h1 {
        font-size: 18px;
      }
      strong {
        color: var(--heavy-color);
      }
      p {
        padding: 10px 0;
      }
    }
  }
}
</style>
