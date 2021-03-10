<template>
  <div class="tabbar">
    <router-link :class="{ 'tabbar-item--active': activeIndex === 0 }" :to="{ name: 'index' }" class="tabbar-item">
      <icon-home />
      <span>__('首页')</span>
    </router-link>
    <router-link
      :class="{ 'tabbar-item--active': activeIndex === 1 }"
      :to="{ name: 'trade-handicap', params: { type: 'btc_usdt' } }"
      class="tabbar-item"
    >
      <icon-trade />
      <span>__('交易')</span>
    </router-link>
    <router-link
      :class="{ 'tabbar-item--active': activeIndex === 2 }"
      :to="{ name: 'c2c', params: { type: 'buy' } }"
      class="tabbar-item"
    >
      <icon-legal />
      <span>__('法币')</span>
    </router-link>
    <router-link :class="{ 'tabbar-item--active': activeIndex === 3 }" :to="{ name: 'assets-index' }" class="tabbar-item">
      <icon-finance />
      <span>__('财务')</span>
    </router-link>
    <router-link
      :class="{ 'tabbar-item--active': activeIndex === 4, unread: unread }"
      :to="{ name: 'community-announcement' }"
      class="tabbar-item"
    >
      <icon-info />
      <span>__('信息')</span>
    </router-link>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { Getter, State, Action } from 'vuex-class';

@Component
export default class TabBar extends Vue {
  @Prop({ type: Boolean, default: true }) fixed!: boolean;
  activeIndex: number = 0;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @Getter('unread', { namespace: 'user' }) unread!: boolean;
  @State('first', { namespace: 'user' }) first!: boolean;
  @Action('getNewMsgSatus', { namespace: 'user' }) getNewMsgSatus!: Function;
  @Action('updateNewMsgSatus', { namespace: 'user' }) updateNewMsgSatus!: Function;
  @Watch('$route', { deep: true, immediate: true })
  _() {
    ['/i', '/trade', '/c2c', '/assets', '/community'].map((path, index) => {
      if (this.$route.path.indexOf(path) === 0) {
        this.activeIndex = index;
      }
    });
  }
  mounted() {
    if (this.isLogin && this.first) {
      this.getNewMsgSatus();
    }
  }
}
</script>

<style lang='scss'>
.tabbar {
  flex: none;
  display: flex;
  height: 60px;
  @include light {
    position: relative;
    background-color: #fff;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 1px; /* no */
      background-color: #000;
      opacity: 0.1;
    }
  }
  @include dark {
    background-color: #1d1f2f;
  }
  font-size: 12px; /* no */
  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    color: var(--default-color);
    .icon {
      fill: currentColor;
    }
    span {
      margin-top: 6px;
    }
    &.tabbar-item--active {
      color: var(--primary-color);
      opacity: 1;
    }
  }
  .unread {
    position: relative;
    &:after {
      content: '';
      display: block;
      position: absolute;
      background: var(--color);
      width: 6px;
      height: 6px;
      border-radius: 3px;
      left: 68%;
      top: 10px;
    }
  }
}
</style>
