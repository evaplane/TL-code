<template>
  <div class="activity-box" v-loading="loading">
    <no-data :visible="!returnList.length && !loading" />
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
        <div @click="detail(data)" class="activity-item" v-hover:hover-active-user>
          <div class="item-left">
            <h3 class="u-text-overflow1">
              <span :class="{ end: !isEnd(data.activityCenter.endTime) }" class="category">{{
                isEnd(data.activityCenter.endTime) ? '__("进行中")' : '__("已结束")'
              }}</span>
              {{ data.activityCenter.title }}
            </h3>
            <p class="u-text-overflow1 activity-time">
              __('活动时间'): {{ data.activityCenter.startTime | date('YYYY-MM-DD') }} -
              {{ data.activityCenter.endTime | date('YYYY-MM-DD') }}
            </p>
          </div>
          <div class="item-img">
            <div class="item-image" v-bg="{ src: data.activityCenter.popupPic }" />
            <p>
              <span>{{ data.activityCenter.publishTime | date('YYYY-MM-DD') }}</span>
              <span>
                <i class="zbicon-share"></i>
                {{ data.activityCenter.forwardCount }}
              </span>
            </p>
          </div>
        </div>
      </template>
    </native-scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { getNotify, IActivity } from '@/api/community';
import { State, Getter } from 'vuex-class';
import mixinsSearch from '@/mixins/service/search';
import { isNotEmpty } from '@/utils/is';

@Component({})
export default class Activity extends Mixins(mixinsSearch) {
  @State('lang', { namespace: 'lang' }) lang!: string;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  loading: boolean = true;
  pageNo: number = 1;
  mounted() {
    this.getList();
  }
  pullup() {
    this.pageNo++;
    this.getList();
  }
  pulldown() {
    this.pageNo = 1;
    this.getList();
  }
  async getList() {
    try {
      let { notifyMap } = await getNotify<IActivity>({
        type: 3001,
        pageNo: this.pageNo
      });
      if (!this.isLogin) {
        isNotEmpty(notifyMap.notifyList) &&
          notifyMap.notifyList.map(item => {
            item.activityCenter = {
              title: item.title,
              content: item.content,
              popupPic: item.popupPic,
              publishTime: item.publishTime,
              forwardCount: item.forwardCount,
              introduction: item.introduction,
              startTime: item.startTime,
              endTime: item.endTime
            };
          });
      }
      this.list = this.pageNo !== 1 ? [...this.list, ...notifyMap.notifyList] : notifyMap.notifyList;
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }
  detail(item: IActivity) {
    if (item.activityCenter.hasDetailPage) {
      window.open(item.activityCenter.detailPageUrl);
    }
  }
  isEnd(str: number) {
    return +str - new Date().getTime() > 0;
  }
}
</script>
<style lang='scss'>
.activity-box {
  flex: 1;
  overflow: hidden;
  .van-skeleton {
    display: flex;
    flex-direction: column-reverse;
    .van-skeleton__avatar {
      width: 100% !important;
      margin-top: 10px;
      height: 60px !important;
    }
  }
  .activity-item {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    border-bottom: 4px solid var(--line-color); /* no */
    &:last-child {
      border: 0;
    }
  }
  .item-left {
    flex: 1;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    > h3 {
      color: var(--heavy-color);
      font-size: 15px;
      @include bold;
      display: flex;
      align-items: center;
      .category {
        background: var(--primary-color);
        color: #fff;
        font-size: 12px;
        padding: 3px 5px;
        margin-right: 5px;
        border-radius: 2px; /* no */
      }
      .end {
        background: var(--gray-color);
      }
    }
    .activity-time {
      color: var(--gray-color);
      // line-height: 20px;
      margin: 5px 0;
    }
  }
  .item-img {
    overflow: hidden;
    height: 100px;
    margin-top: 5px;
    position: relative;
    width: 100%;
    .item-image {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      background-color: #eaeaea;
      background-size: cover;
      filter: brightness(90%);
      background-position: center;
    }
    > p {
      display: flex;
      justify-content: space-between;
      position: absolute;
      bottom: 4px;
      width: 100%;
      padding: 5px;
      color: #fff;
      &:last-child span {
        i {
          margin-right: 8px;
          line-height: 13.8px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
