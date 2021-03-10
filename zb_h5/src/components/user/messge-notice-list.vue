<template>
  <native-scroll v-if="list.length" :data="defaultList" :size="20" virtual-scroll>
    <template #virtual="{ data }">
      <div @click="toChat(data)" class="message-item" v-hover:hover-active-user>
        <div class="item-icon">
          <img v-img="{ src: `${data.headUrl}`, err: require('@/assets/img/chat/defaultHead.jpg') }" />
          <span class="unread" v-show="data.offLineCount" v-text="data.offLineCount <= 99 ? data.offLineCount : '┅'"></span>
        </div>
        <div class="item-info">
          <h3>
            {{ data.name || data.nickName }}<span class="time">{{ data.historyTime | filterTime }}</span>
          </h3>
          <p :class="{ warn: data.historyType && data.historyType !== 0 && data.offLineCount !== 0 }">
            {{ data.lastOfflineContent }}
          </p>
        </div>
      </div>
    </template>
  </native-scroll>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { IChatMessageInfo } from '@/store/modules/chat';

@Component({
  filters: {
    filterTime(time: number) {
      let timestamp = time + ''.length >= 13 ? time / 1000 : time;
      function zeroize(num: number) {
        return (String(num).length === 1 ? '0' : '') + num;
      }
      let dateNow = new Date().getTime();
      let curTimestamp = parseInt((dateNow / 1000) as any);
      let timestampDiff = curTimestamp - timestamp;
      let curDate = new Date(curTimestamp * 1000);
      let tmDate = new Date(timestamp * 1000);
      let Y = tmDate.getFullYear(),
        m = tmDate.getMonth() + 1,
        d = tmDate.getDate();
      let H = tmDate.getHours(),
        i = tmDate.getMinutes();
      if (timestampDiff < 100) {
        return '__("刚刚")';
      } else if (timestampDiff < 3600) {
        return Math.floor(timestampDiff / 60) + '__("分钟前")';
      } else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
        return '__("今天")' + zeroize(H) + ':' + zeroize(i);
      } else {
        let newDate = new Date((curTimestamp - 86400) * 1000);
        if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
          return '__("昨天")' + zeroize(H) + ':' + zeroize(i);
        } else if (curDate.getFullYear() === Y) {
          return zeroize(m) + '__("月")' + zeroize(d) + '__("日")' + zeroize(H) + ':' + zeroize(i);
        } else {
          return Y + '__("年")' + zeroize(m) + '__("月")' + zeroize(d) + '__("日")' + zeroize(H) + ':' + zeroize(i);
        }
      }
    }
  }
})
export default class MessageNotice extends Vue {
  @Prop({ default: null }) list!: any[];
  timer: any = null;
  defaultList: IChatMessageInfo[] = [];
  @Watch('list', { immediate: true, deep: true })
  _() {
    this.defaultList = [];
    this.defaultList = [...this.list];
  }
  mounted() {
    this.timer = setInterval(() => {
      this.defaultList = [];
      this.defaultList = [...this.list];
    }, 1000 * 60);
  }
  @Emit()
  pullup() {}

  @Emit('item-click')
  toChat(items: any) {
    return items;
  }
  @Emit()
  pulldown() {}
}
</script>
<style lang='scss'>
.message-list {
  .message-item {
    padding: 0 15px;
    height: 70px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .virtual-item:not(:first-of-type) {
    .message-item::before {
      content: '';
      position: absolute;
      left: 73px;
      right: 0;
      top: 0;
      height: 1px; /* no */
      background-color: #f3f4f9;
      @include dark {
        background-color: rgba(255, 255, 255, 0.06);
      }
    }
  }
  .item-icon {
    flex: none;
    position: relative;
    margin-right: 10px;
    .unread {
      position: absolute;
      right: -2px;
      top: -2px;
      background: var(--primary-color);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      color: #fff;
      border-radius: 50%;
      width: 16px;
      height: 16px;
    }
    img {
      vertical-align: middle;
      width: 48px;
      height: 48px;
      border-radius: 24px;
    }
  }
  .item-info {
    flex: 1;
    overflow: hidden;
    h3 {
      font-size: 16px;
      @include bold;
      color: var(--heavy-color);
      display: flex;
      .time {
        margin-left: auto;
        color: var(--thin-color);
        white-space: nowrap;
        font-weight: normal;
        font-size: 12px;
      }
    }
    p {
      font-size: 13px;
      margin-top: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .warn {
      color: var(--primary-color) !important;
    }
  }
}
</style>
