import { Component, Vue, Emit, Prop, Watch, Provide } from 'vue-property-decorator';
import { debounce } from '@/utils/date';
import { on, off, once } from '@/utils/event';
import { isScroll as isScroller, getStyle, setStyle, removeStyle } from '@/utils/dom';
import virtualScroll from './virtual-list.vue';
import virtualScrollRef from './virtual-list';
@Component({
  components: {
    virtualScroll
  }
})
export default class NativeScroll extends Vue {
  /** 下拉像素至指定值时触发刷新 */
  @Prop({ type: Number, default: 50 }) private readonly pullDownOffset!: number;
  /** 开启上拉加载 */
  @Prop({ type: Boolean, default: false }) private readonly pullup!: boolean;
  /** 开启下拉刷新 */
  @Prop({ type: Boolean, default: false }) private readonly pulldown!: boolean;
  /** 开启flex */
  @Prop({ type: Boolean, default: false }) private readonly flexLayout!: boolean;
  /** 是否启用滚动 */
  @Prop({ type: Boolean, default: true }) private readonly enabled!: boolean;
  /** 是否开启虚拟滚动 */
  @Prop({ type: Boolean, default: false }) private readonly virtualScroll!: boolean;
  /** 列表数据, 当开启上拉加载,下拉刷新,虚拟滚动任意或多个功能时该值必传 */
  @Prop({ type: [Object, Array], default: () => [] }) private readonly data!: any[];
  /** 虚拟滚动显示数据数量 */
  @Prop({ type: Number, default: 10 }) private readonly size!: number;
  /** 唯一值, 变更时用于重置组件状态 */
  @Prop({ type: [String, Number], default: '' }) private readonly name!: string | number;
  @Provide()
  private rootScroll = this.getScroll();
  private offsetHeight: number = 0;
  private offEvent: Function | null = null;
  private scrollEndHandle: Function | null = null;
  private loading: boolean = false;
  private moveDistance: number = 0;
  private refreshLoading: boolean = false;
  private showRefreshTips: boolean = false;
  private duration: number = 0;
  private firstListLength: number = 0;
  private refreshLoadingEL: HTMLDivElement | null = null;
  private refreshTipsEL!: HTMLDivElement;
  private dataUnWatcher: Function | null = null;
  public scrollY: number = 0;
  '$refs': {
    scroll: HTMLDivElement;
    vScroll: virtualScrollRef;
  };
  '$el': HTMLDivElement;
  private get enabledPullup() {
    return this.pullup || this.virtualScroll;
  }
  private get pulldownStyle() {
    return this.pulldown || this.refreshLoading ? {
      transition: `${this.duration}ms`,
      transform: this.moveDistance > 0 ? `translate3d(0, ${this.moveDistance}px, 0)` : null
    } : null;
  }
  @Watch('enabled', { immediate: true })
  private _enabled() {
    if (this.enabled === true) {
      this.$nextTick(() => {
        // 开启下拉刷新
        if (this.pulldown === true) {
          this.initPullDownEvent();
        } else {
          this.initMovePreventDefault();
        }
        this.resetOffsetHeight();
        on(this.$el, 'scroll', this.scrollHandle);
      });
    } else {
      this.offEvent && this.offEvent();
      off(this.$el, 'scroll', this.scrollHandle);
    }
  }
  @Watch('refreshLoading')
  private _refreshLoadingChange(state: boolean) {
    if (!state && this.duration === 300 && this.pulldown) {
      this.moveDistance = 0;
    }
  }
  @Watch('name')
  private _nameChange() {
    this.reset();
  }

  private initPullDownEvent() {
    this.$nextTick(() => {
      this.refreshTipsEL = this.$el.querySelector('.m-scroll-refresh-line') as HTMLDivElement;
      this.$el.removeChild(this.refreshTipsEL);
    });
    on(this.$el, 'touchstart', (startEvent: TouchEvent) => {
      if (!this.pulldown) return;
      const parentNode = this.$el.parentNode as HTMLDivElement;
      let result = ['relative', 'absolute', 'fixed'].filter((value) => getStyle(parentNode, 'position') === value);
      if (result.length === 0) {
        (parentNode as any)._addPosition = true;
        setStyle(parentNode, 'position', 'relative');
      }
      parentNode.insertBefore(this.refreshTipsEL, this.$el);
      let startY = startEvent.touches[0].clientY;
      this.resetOffsetHeight();
      const touchMoveHandle = (event: TouchEvent) => {
        let { scrollTop } = this.$refs.scroll;
        if (scrollTop > 0) return;
        let move = (event.targetTouches[0].clientY - startY);
        if (move > 0) {
          event.preventDefault();
          this.moveDistance = Math.pow(move, 0.8);
          this.showRefreshTips = move >= this.pullDownOffset;
        }
      };
      /** touchmove */
      on(this.$el, 'touchmove', touchMoveHandle);
      /** touchend */
      once(this.$el, 'touchend', () => {
        off(this.$el, 'touchmove', touchMoveHandle);
        this.duration = 300;
        this.showRefreshTips = false;
        if (this.moveDistance > this.pullDownOffset) {
          this.refreshLoading = true;
          this.moveDistance = this.pullDownOffset;
          this.firstListLength = -1;
          this.refresh();
        } else {
          this.moveDistance = 0;
        }
      });
    });
  }
  /** 处理滚动禁止拉出白底 */
  private initMovePreventDefault() {
    let el = this.$refs.scroll,
      warp = el.parentNode as HTMLDivElement;
    let clientY = 0,
      maxScroll = 0,
      canMove = true,
      isScroll = false;
    const preventDefault = (evt: TouchEvent) => {
      if (isScroll === true) {
        evt.preventDefault();
      }
    };
    const ontouchstart = (evt: TouchEvent): void => {
      clientY = evt.touches[0].pageY;
      maxScroll = el.scrollHeight - el.clientHeight;
      canMove = true;
      let node = evt.target as HTMLElement;
      let path: any[] = [node];
      while ((node = node.parentNode as any) !== (document.body as any)) {
        path.push(node);
      }
      // 查找可滚动对象
      let scollers = path.filter(node => isScroller(node));
      if (scollers && scollers.length > 0) {
        return;
      }
      isScroll = path.indexOf(el) > -1;
      let scrollTop = el.scrollTop;
      if (scrollTop < 0) {
        canMove = false;
        preventDefault(evt);
      }
    };
    const ontouchmove = (evt: TouchEvent): void => {
      let { cancelable } = evt;
      if (maxScroll <= 0 || canMove === false) {
        // 禁止滚动
        cancelable && preventDefault(evt);
      }
      // 上下边缘检测
      let distanceY = evt.touches[0].pageY - clientY,
        scrollTop = el.scrollTop;
      if (scrollTop <= 0 && distanceY > 0) {
        cancelable && preventDefault(evt);
        return;
      }
      // 往下滑，并且到头
      if (distanceY < 0 && scrollTop + 1 >= maxScroll) {
        cancelable && preventDefault(evt);
      }
      evt.stopPropagation();
    };
    const ontouchend = (): void => {
      maxScroll = 0;
      isScroll = false;
    };
    on(warp, 'touchstart', ontouchstart);
    on(warp, 'touchmove', ontouchmove);
    on(warp, 'touchend', ontouchend);
    this.offEvent = () => {
      off(warp, 'touchstart', ontouchstart);
      off(warp, 'touchmove', ontouchmove);
      off(warp, 'touchend', ontouchend);
    };
  }
  private resetOffsetHeight() {
    this.offsetHeight = this.$el.scrollHeight - this.$el.offsetHeight;
    this.duration = 0;
    this.moveDistance = 0;
  }
  private scrollHandle(event: Event) {
    let scroller = event.target as HTMLDivElement;
    this.scroll(
      {
        x: scroller.scrollLeft,
        y: this.scrollY = scroller.scrollTop
      },
      event
    );
  }
  private initWatchData() {
    if ([this.pulldown, this.pullup, this.virtualScroll].every(enabled => !enabled) === true) {
      return;
    }
    if (this.dataUnWatcher) {
      this.dataUnWatcher();
      this.dataUnWatcher = null;
    }
    const dataChange = (nv: any[], ov: any[] = []) => {
      if (this.pulldown === true) {
        if (nv.length > 0 && this.firstListLength <= 0) {
          // 如果是下拉操作(处理下拉加载的loading状态)
          if (this.firstListLength === -1) {
            this.resetPulldownState();
          }
          this.firstListLength = nv.length;
        }
        if (nv.length === 0) {
          this.refreshLoading = false;
          this.moveDistance = 0;
        }
      }
      if (nv.length === 0) {
        this.firstListLength = 0;
      }
      // 判定如果新的数组(处理上拉加载的loading状态)
      if (ov.length <= nv.length) {
        // 比较数据长度, 如果新的值的长度少于正常长度则判定已经没有更多数据
        if (nv.length - ov.length < this.firstListLength) {
          this.loading = false;
          return;
        }
        this.resetPullupState();
      }
    };
    this.$watch('data', dataChange, { immediate: true });
  }
  @Emit()
  private scrollEnd() { }
  @Emit()
  // eslint-disable-next-line
  private scroll(pos: INativeScrollPos, event: Event) {
    if (this.enabledPullup === true) {
      this.scrollEndHandle && this.scrollEndHandle();
    }
    if (this.virtualScroll === true) {
      this.$refs.vScroll.updateIndex();
    }
  }
  @Emit()
  private refresh() { }
  public getScroll() {
    return this;
  }
  public reset() {
    const { scroll, vScroll } = this.$refs;
    scroll.scrollTop = 0;
    this.loading = this.showRefreshTips = this.refreshLoading = false;
    this.resetOffsetHeight();
    if (vScroll) {
      vScroll.init();
    }
    this.initWatchData();
  }
  public resetPulldownState() {
    this.refreshLoading = false;
    this.moveDistance = 0;
    this.$nextTick(() => {
      let parentNode = this.$el.parentNode;
      if (parentNode) {
        if (this.refreshTipsEL) {
          parentNode.removeChild(this.refreshTipsEL);
        }
        if ((parentNode as any)._addPosition) {
          removeStyle(parentNode as HTMLElement, 'position');
        }
      }
    });
  }
  /** 重置上拉加载数据 */
  public resetPullupState() {
    // 如果新的数据新增则继续注册加载更多处理, 否则不注册
    if (this.enabledPullup === false) {
      this.scrollEndHandle = null;
      return;
    }
    this.loading = false;
    this.scrollEndHandle = debounce(() => {
      let { scrollTop } = this.$refs.scroll;
      if (this.offsetHeight - scrollTop < this.pullDownOffset) {
        this.loading = true;
        this.scrollEnd();
        this.scrollEndHandle = null;
      }
    }, 60);
  }
  created() {
    this.initWatchData();
  }
  destroyed() {
    this.dataUnWatcher = null;
    off(this.$el, 'scroll', this.scrollHandle);
    this.offEvent && this.offEvent();
  }
}
