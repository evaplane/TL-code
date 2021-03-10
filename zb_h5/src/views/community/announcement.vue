<template>
  <div class="announcemnet-box" v-loading="loading">
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
        <div @click="path(data)" class="announcemnet-item">
          <div class="item-info">
            <h3>{{ data.defaultTitle }}</h3>
            <p>{{ data.publicNotice.publishTime | date('YYYY-MM-DD hh:mm') }}</p>
          </div>
          <div class="item-image" v-bg="{ src: data.picture }" />
        </div>
      </template>
    </native-scroll>
  </div>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { getNotify, INotifyList } from '@/api/community';
import { State, Getter, Action } from 'vuex-class';
import { isNotEmpty } from '@/utils/is';
import mixinsSearch from '@/mixins/service/search';
@Component
export default class Announcement extends Mixins(mixinsSearch) {
  @State('lang', { namespace: 'lang' }) lang!: string;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @Action('updateNewMsgSatus', { namespace: 'user' }) updateNewMsgSatus!: Function;
  loading: boolean = true;
  pageNo: number = 1;
  pictureList: string[] = [
    'https://beenews-group.oss-cn-shanghai.aliyuncs.com/95d7b210d6d7c1702956d8494c0ca34f.jpeg',
    'https://img.jinse.com/1708793_image1.png',
    'https://beenews-image.oss-cn-shanghai.aliyuncs.com/62b1f9a0ffbbfb24d5e6ac1208b6aa70ffe00f89.png'
  ];
  mounted() {
    this.getList();
  }
  pullup() {
    this.pageNo++;
    this.getList();
  }
  async pulldown() {
    this.pageNo = 1;
    await this.getList();
  }
  async getList() {
    try {
      let { notifyMap, publicNoticeNum, systemNotfyNnm, activiryCenterNum } = await getNotify<INotifyList>({
        type: 2001,
        pageNo: this.pageNo
      });
      this.updateNewMsgSatus({ publicNoticeNum, systemNotfyNnm, activiryCenterNum });
      if (!this.isLogin) {
        isNotEmpty(notifyMap.notifyList) &&
          notifyMap.notifyList.map(item => {
            item.publicNotice = {
              title: item.title,
              content: item.content,
              cnTag: item.cnTag,
              enTag: item.enTag,
              publishTime: item.publishTime,
              forwardCount: item.forwardCount,
              englishTitle: item.englishTitle,
              englishContent: item.englishContent,
              read: item.read
            };
          });
      }
      if (isNotEmpty(notifyMap.notifyList) === true) {
        notifyMap.notifyList.map((item, index) => {
          if (this.lang === 'cn') {
            item.defaultTitle = item.publicNotice.title;
            item.defaultContent = item.publicNotice.content;
            item.defaultTag = item.publicNotice.cnTag;
          } else {
            item.defaultTitle = item.publicNotice.englishTitle;
            item.defaultContent = item.publicNotice.englishContent;
            item.defaultTag = item.publicNotice.enTag;
          }
          item.index = index;
        });
      }
      this.list = this.pageNo !== 1 ? this.list.concat(notifyMap.notifyList) : notifyMap.notifyList;
      this.list = this.list.map((item, index) => {
        return {
          ...item,
          picture: this.pictureList[index % this.pictureList.length]
        };
      });
    } catch (err) {
      console.log(err);
    }
    this.loading = false;
  }
  path(item: INotifyList) {
    if (this.isLogin) {
      this.$router.push({
        name: 'annoucement-detail',
        query: { detailId: item.publicNoticeId + '', notifyId: item.id + '', isRead: item.read + '' }
      });
    } else {
      this.$router.push({ name: 'annoucement-detail', query: { detailId: item.id + '', notifyId: item.id + '' } });
    }
    this.list[item.index].read = true;
  }
}
</script>
<style lang='scss'>
.announcemnet-box {
  flex: 1;
  overflow: hidden;
  color: var(--default-color);
  .nodata-box {
    height: 80vh;
  }
  .announcemnet-item {
    padding: 15px;
    display: flex;
    border-bottom: 1px solid var(--line-color); /* no */
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    h3 {
      color: var(--heavy-color);
      font-size: 15px;
      @include bold;
      word-break: break-all;
      line-height: 1.5;
    }
    p {
      color: var(--thin-color);
    }
  }
  .item-image {
    flex: none;
    margin-left: 10px;
    width: 110px;
    height: 70px;
    overflow: hidden;
    background-color: #eaeaea;
    background-position: center;
    background-size: cover;
  }
  .unread {
    display: relative;
    &:after {
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      background: var(--color);
      position: absolute;
      right: 2px;
      top: 2px;
      border-radius: 2px;
    }
  }
}
</style>
