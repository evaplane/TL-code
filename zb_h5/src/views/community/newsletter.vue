<template>
  <div class="newletter-box" v-loading="loading">
    <no-data :visible="list.length === 0 && !loading" />
    <h3 class="label" v-if="list.length">{{ lastTime | timeType }}</h3>
    <native-scroll
      :data="list"
      @refresh="pulldown"
      @scroll-end="pullup"
      virtual-scroll
      pulldown
      pullup
      v-if="list.length && !loading"
    >
      <template #virtual="{ data }">
        <div class="newletter-box-items" v-hover:hover-active-user>
          <span class="time">{{ data.createTime | date('YYYY-MM-DD hh:mm:ss') }}</span>
          <p class="title">{{ data.title }}</p>
          <p class="content">{{ data.content }}</p>
          <p class="author">__('来源'): {{ data.source }}</p>
        </div>
      </template>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { quickNewsList, IQuicknews, IParams } from '@/api/community';
import MixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import { Getter } from 'vuex-class';
import { formatDate } from '@/utils/date';

@Component({
  filters: {
    timeType(time: string) {
      return formatDate(new Date(), 'YYYY-MM-DD') === formatDate(time, 'YYYY-MM-DD') ? '__("今天")' : '__("之前")';
    }
  }
})
export default class Newletter extends Mixins(MixinsSignHooks) implements ISignHooks {
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  list: IQuicknews[] = [];
  loading: boolean = true;
  params: IParams = {
    direction: 'up'
  };
  mounted() {
    if (!this.isLogin) {
      this.getList();
    }
    this.$bus.$on('newletter-detail-back', () => this.getList());
  }
  signIn() {
    this.getList();
  }
  signOut() {}
  get lastTime() {
    if (this.list.length) {
      let lastItem = this.list[this.list.length - 1];
      return lastItem.createTime;
    }
    return 0;
  }
  pullup() {
    this.params.direction = 'down';
    this.params.time = this.lastTime;
    this.getList();
  }
  pulldown() {
    this.params.direction = 'up';
    delete this.params.time;
    this.getList();
  }
  async getList() {
    try {
      let { newsFlashs } = await quickNewsList(this.params);
      this.list = this.params.direction === 'down' ? [...this.list, ...newsFlashs] : newsFlashs;
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }
  beforeDestroy() {
    this.$bus.$off('newletter-detail-back');
  }
}
</script>
<style lang='scss'>
.newletter-box {
  .nodata-box {
    height: 80vh;
  }
  flex: 1;
  overflow: hidden;
  .label {
    font-size: 14px;
    color: var(--heavy-color);
    padding: 15px 0 10px 15px;
    background-color: var(--default-bg);
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 2;
  }
  .item-title {
    color: #333;
    padding: 15px 15px 0 15px;
    margin-bottom: 10px;
    @include dark {
      color: #d7dce2;
    }
  }
  .newletter-box-items {
    padding: 15px;
    margin-left: 25px;
    border-left: 1px solid var(--line-color); /* no */
    position: relative;
    .time {
      color: #888;
      position: relative;
      @include dark {
        border-left-color: #7c8792;
      }
      &::before {
        content: '';
        box-sizing: content-box;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: #fff;
        border: 3px solid #e91c41;
        width: 3px; /* no */
        height: 3px; /* no */
        border-radius: 50%;
        box-shadow: 0 0 0 3px rgba(#e91c41, 0.1); /* no */
        left: -20px; /* no */
        z-index: 1;
        @include dark {
          opacity: 0.7;
        }
      }
    }
    .title {
      color: #333;
      font-size: 16px;
      font-weight: 700;
      margin: 10px 0;
      line-height: 1.2;
      @include dark {
        color: #d7dce2;
      }
    }
    .content {
      color: var(--theme-color);
      line-height: 1.6;
      margin: 5px 0;
      font-size: 14px;
    }
    .author {
      font-size: 12px;
      color: #c7c7c7;
    }
    & + li {
      margin-top: 15px;
    }
  }
}
</style>
