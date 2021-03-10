<template>
  <div>
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BetterScroll from '@better-scroll/core';
import scrollBar from '@better-scroll/scroll-bar';
import pullDown from '@better-scroll/pull-down';
import pullUp from '@better-scroll/pull-up';
import { on, off } from '@/utils/event';
import BScrollTypes from '@better-scroll/core/dist/types/index';
import mouseWheel from '@better-scroll/mouse-wheel';
import { isIOS } from '@/utils/is';

BetterScroll.use(scrollBar);
BetterScroll.use(pullDown);
BetterScroll.use(pullUp);
BetterScroll.use(mouseWheel as any);
@Component
export default class BScroll extends Vue {
  name = 'scroll';
  isDisable: boolean = false;
  scroll: BScrollTypes | undefined = undefined;
  swipeTime: number = isIOS ? 2300 : 2000;
  /**
   * 1 滚动的时候会派发scroll事件，会截流。
   * 2 滚动的时候实时派发scroll事件，不会截流。
   * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
   */
  @Prop({ type: Number, default: 1 }) probeType!: number;
  // 点击列表是否派发click事件
  @Prop({ type: Boolean, default: true }) click!: boolean;
  // 是否开启横向滚动
  @Prop({ type: Boolean, default: false }) scrollX!: boolean;
  // 是否开启纵向滚动
  @Prop({ type: Boolean, default: true }) scrollY!: boolean;
  // 是否派发滚动事件
  @Prop({ type: Boolean, default: false }) listenScroll!: boolean;
  // 是否派发滚动到底部的事件，用于上拉加载
  @Prop({ type: Boolean, default: false }) pullup!: boolean;
  // 是否派发顶部下拉的事件，用于下拉刷新
  @Prop({ type: Boolean, default: false }) pulldown!: boolean;
  // 是否显示滚动条
  @Prop({ type: Boolean, default: false }) scrollbar!: boolean;
  // 是否派发列表滚动开始的事件
  @Prop({ type: Boolean, default: false }) beforeScroll!: boolean;
  // 当数据更新后，刷新scroll的延时。
  @Prop({ type: Number, default: 20 }) refreshDelay!: number;
  // 是否阻止事件冒泡。多用在嵌套 scroll 的场景。
  @Prop({ type: Boolean, default: false }) stopPropagation!: boolean;
  // 是否move事件绑定到父盒子
  @Prop({ type: Boolean, default: true }) bindToWrapper!: boolean;
  // 是否开启touchstart事件互斥, 用于禁用父级better-scroll touchstart事件
  @Prop({ type: Boolean, default: false }) isDisableTouchstart!: boolean;
  @Prop({ type: Boolean, default: false }) bounceTop!: boolean;
  @Prop({ type: Boolean, default: false }) bounceBottom!: boolean;
  '$refs': {
    wrapper: HTMLDivElement;
  };
  initScroll() {
    if (!this.$refs.wrapper) {
      return;
    }
    // better-scroll的初始化
    this.scroll = new BetterScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      bindToWrapper: this.bindToWrapper,
      click: this.click,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      pullDownRefresh: false,
      pullUpLoad: this.pullup,
      scrollbar: this.scrollbar,
      stopPropagation: this.stopPropagation,
      deceleration: 0.0007,
      momentumLimitTime: 250,
      swipeTime: this.swipeTime,
      momentumLimitDistance: 25,
      bounce: {
        top: this.bounceTop,
        bottom: this.bounceBottom
      },
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300
      }
    });
    // 是否派发滚动事件
    if (this.listenScroll) {
      this.scroll.on('scroll', (pos: any) => {
        this.$emit('scroll', pos);
      });
    }

    // 是否派发滚动到底部事件，用于上拉加载
    if (this.pullup) {
      this.scroll.on('scrollEnd', () => {
        if (!this.scroll) return;
        // 滚动到底部
        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
          this.$emit('scrollToEnd');
        }
      });
    }

    // 是否派发顶部下拉事件，用于下拉刷新
    if (this.pulldown) {
      // this.scroll.on('touchEnd', (pos: any) => {
      //   // 下拉动作
      //   if (pos.y > 50) {
      //     this.$emit('pulldown');
      //   }
      // });
    }

    // 是否派发列表滚动开始的事件
    if (this.beforeScroll) {
      this.scroll.on('beforeScrollStart', () => {
        this.$emit('beforeScroll');
      });
    }
  }
  disable() {
    // 代理better-scroll的disable方法
    this.scroll && this.scroll.disable();
  }
  enable() {
    // 代理better-scroll的enable方法
    this.scroll && this.scroll.enable();
  }
  refresh() {
    if (this.isDisableTouchstart === true) {
      return;
    }
    // 代理better-scroll的refresh方法
    this.scroll && this.scroll.refresh();
  }
  scrollTo() {
    // 代理better-scroll的scrollTo方法
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
  }
  scrollToElement() {
    // 代理better-scroll的scrollToElement方法
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
  }
  scrollInit() {
    off(this.$el, 'touchstart', this.refresh);
    this.scroll && this.scroll.destroy();
    on(this.$el, 'touchstart', this.refresh);
    this.$nextTick(() => {
      // 保证在DOM渲染完毕后初始化better-scroll
      window.setTimeout(() => {
        this.initScroll();
      }, 20);
    });
  }
  mounted() {
    on(this.$el, 'touchstart', this.refresh);
    this.$nextTick(() => {
      // 保证在DOM渲染完毕后初始化better-scroll
      window.setTimeout(() => {
        this.initScroll();
      }, 20);
    });
  }
  beforeDestroy() {
    off(this.$el, 'touchstart', this.refresh);
    this.scroll && this.scroll.destroy();
  }
}
</script>

<style lang="scss">
.m-scroll-warp {
  height: 100%;
  overflow: hidden;
}
</style>
