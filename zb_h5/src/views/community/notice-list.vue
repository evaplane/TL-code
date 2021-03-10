<template>
  <div class="community-panel">
    <back :shadow="backBarShadow" :title="info.name" @back="back" />
    <div class="community-body">
      <native-scroll :data="info.list" :size="20" @scroll="scrollHandle" virtual-scroll>
        <template #virtual="{ data }">
          <div @click="path(data)" class="message-item" :class="{ unread: !data.read }">
            <p class="message-item_content">{{ data.content }}</p>
            <p class="message-item_time">{{ data.publishTime | date('YYYY-MM-DD hh:mm') }}</p>
            <span class="more-arrow"></span>
          </div>
        </template>
      </native-scroll>
    </div>
    <van-popup :style="{ height: '100%', width: '100%' }" get-container="body" position="right" v-model="detailVisit">
      <notice-detail :detail="detail" @close="detailVisit = false" v-if="detailVisit" />
    </van-popup>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { INoticy } from '@/api/community';
import noticeDetail from '@/components/user/notice-detail.vue';
import { Getter } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { setSystemNotifyIsRead } from '@/api/user';
interface IList {
  name: string;
  list: INoticy[];
  lastOfflineContent: string;
  historyTime: number;
  offLineCount?: number;
  index: number;
}

@Component({
  components: {
    back,
    noticeDetail
  }
})
export default class NoticeList extends Vue {
  @Getter('userInfo', { namespace: 'user' }) userInfo!: IUser;
  // eslint-disable-next-line
  info = {} as IList;
  backBarShadow: boolean = false;
  detailVisit: boolean = false;
  // eslint-disable-next-line
  detail = {} as INoticy;
  mounted() {
    this.info = JSON.parse(localStorage.getItem(`notice-list${this.userInfo.userId}`) as string);
    this.info.list = this.info.list.map((item, index) => {
      return {
        ...item,
        index
      };
    });
  }
  @Watch('detailVisit')
  _(val: boolean) {
    this.$nextTick(() => {
      let d = document.querySelector('.van-overflow-hidden #app') as HTMLDivElement;
      if (d) {
        d.style.filter = val ? 'blur(0)' : 'blur(5px)';
      }
    });
  }

  scrollHandle(pos: INativeScrollPos) {
    this.backBarShadow = pos.y > 10;
  }
  async path(item: INoticy) {
    try {
      if (!item.read) {
        await setSystemNotifyIsRead({ id: item.id + '' });
      }
      this.detail = item;
      this.detailVisit = true;
      this.info.list[item.index].read = true;
    } catch (error) {}
  }
  back() {
    return this.$bus.$emit('notice-list-back');
  }
}
</script>
<style lang='scss'>
.community-panel {
  position: fixed;
  z-index: 3000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f3f4f9;
  @include dark {
    background-color: #000;
  }
  color: var(--default-color);
  .community-body {
    flex: 1;
    overflow: hidden;
    .virtual-scroll-list {
      padding-top: 15px;
    }
    .virtual-item {
      padding: 0 15px 15px 15px;
    }
    .message-item {
      background-color: #fff;
      @include dark {
        background-color: #211f27;
      }
      padding: 15px 40px 15px 15px;
      position: relative;
      border-radius: 4px;
      .message-item_content {
        font-size: 14px;
        color: var(--title-color);
        line-height: 1.5;
      }
      .message-item_time {
        margin-top: 8px;
        color: var(--thin-color);
        display: flex;
      }
      &.unread .message-item_content {
        color: var(--heavy-color);
      }
      .more-arrow {
        position: absolute;
        right: 20px;
        top: 50%;
        width: 9px;
        height: 9px;
        border-right: 1px solid var(--thin-color); /* no */
        border-top: 1px solid var(--thin-color); /* no */
        transform: rotate(45deg) translateY(-50%);
      }
    }
  }
}
</style>
