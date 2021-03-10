<template>
  <div class="news-box" v-loading="loading">
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
        <div @click="detail(data.newsId)" class="news-item">
          <div :style="{ backgroundImage: `url(${data.titlePic})` }" class="item-image" />
          <div class="item-info">
            <h3 class="u-text-overflow2">{{ data.title }}</h3>
            <p>
              <span>{{ data.createTime | date('YYYY-MM-DD hh:mm:ss') }}</span>
            </p>
          </div>
        </div>
      </template>
    </native-scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import comment from '@/components/user/comment.vue';
import { newsList, IParams } from '@/api/community';
import { Getter } from 'vuex-class';
import mixinsSearch from '@/mixins/service/search';

@Component({
  components: {
    comment
  }
})
export default class News extends Mixins(mixinsSearch) {
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  loading: boolean = true;
  detailIndex: number = 0;
  params: IParams = {
    direction: 'up'
  };
  mounted() {
    this.getList();
  }
  pullup() {
    this.params.direction = 'down';
    this.params.time = this.list[this.list.length - 1].createTime;
    this.getList();
  }
  async pulldown() {
    this.params.direction = 'up';
    delete this.params.time;
    await this.getList();
  }
  async getList() {
    try {
      let { newses } = await newsList(this.params);
      this.list = this.params.direction === 'down' ? [...this.list, ...newses] : newses;
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }
  comment() {
    console.log('comment...');
  }
  detail(id: string) {
    this.$router.push({ name: 'news-detail', query: { id } });
  }
  noop() {}
  beforeDestroy() {
    this.$bus.$off('updateVisitCount');
  }
}
</script>
<style lang='scss'>
.news-box {
  .nodata-box {
    height: 80vh;
  }
  flex: 1;
  overflow: hidden;
  color: var(--default-color);
  .news-item {
    padding: 15px;
    border-bottom: 1px solid var(--line-color); /* no */
    display: flex;
  }
  .item-image {
    flex: none;
    width: 110px;
    height: 70px;
    overflow: hidden;
    border-radius: 2px;
    background-position: center;
    background-size: cover;
    margin-right: 15px;
  }
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    h3 {
      color: var(--heavy-color);
      font-size: 15px;
      word-break: break-all;
      line-height: 1.5;
      @include bold;
    }
    p {
      color: var(--thin-color);
    }
  }
}
</style>
