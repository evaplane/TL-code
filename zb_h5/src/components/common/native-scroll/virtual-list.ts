import { Component, Vue, Prop, Watch, Inject } from 'vue-property-decorator';
import virtualItem from './virtual-item.vue';
import nativeScroll from './index';
import { isNotEmpty } from '@/utils/is';
import { debounce } from '@/utils/date';
export interface IScrollItem {
  id: number;
  data: any;
  height: number;
  offset: number;
  loaded: boolean;
}

@Component({
  components: {
    virtualItem
  }
})
export default class VirtualScroll extends Vue {
  cacheList: IScrollItem[] = [];
  height: number = 0;
  loadings: number[] = [];
  start: number = 0;
  startOffset: number = 0;
  debounceItemCalcHeight: Function | null = null;
  get visibleList() {
    return this.cacheList.slice(Math.max(0, this.start - this.size), Math.min(this.cacheList.length, this.start + this.size));
  }
  get loading(): boolean {
    return this.loadings.length > 0;
  }
  get scroller() {
    return this.rootScroll.$refs.scroll;
  }
  '$el': HTMLDivElement;
  @Inject() rootScroll!: nativeScroll;
  @Prop({ type: Array, required: true }) list!: any[];
  @Prop({ type: Number, default: 10 }) size!: number;
  @Watch('list', { immediate: true })
  listChange(arr: any[]) {
    if (isNotEmpty(arr) === true) {
      this.loadings.pop();
      if (!this.loading) {
        this.loadItems();
      }
    } else {
      this.init();
    }
    this.updateIndex();
  }
  @Watch('cacheList')
  itemsChange() {
    if (this.cacheList.length > this.list.length) {
      this.getItems();
    }
  }
  created() {
    this.debounceItemCalcHeight = debounce(() => {
      this.height = 0;
      for (let i = 0; i < this.cacheList.length; i++) {
        let pre = this.cacheList[i - 1];
        this.cacheList[i].offset = pre ? pre.offset + pre.height : 0;
        this.height += this.cacheList[i].height;
      }
      if (this.startOffset) {
        this.setScrollTop();
      }
      this.updateIndex();
    }, 10);
  }
  mounted() {
    window.addEventListener('resize', this.onResize);
  }
  init() {
    this.reset();
    this.load();
  }
  reset() {
    this.cacheList = [];
    this.height = 0;
    if (this.scroller) {
      this.scroller.scrollTop = this.height = this.start = 0;
    }
  }
  load() {
    if (!this.loading) {
      this.getItems();
    }
  }
  getItems() {
    this.loadings.push(1);
    // this.loadData();
  }
  loadItems() {
    for (let i = 0, end = this.list.length; i < end; i++) {
      if (!this.cacheList[i]) {
        let data = this.list[i];
        this.$set<IScrollItem>(this.cacheList, i, {
          data: data || {},
          height: 0,
          offset: -1000,
          loaded: !!data,
          id: i
        });
      }
    }
  }
  /** 由virtual-item组件计算完高度之后调用 */
  updateItemTop(id: number, itemHeight: number) {
    this.$set(this.cacheList[id], 'height', itemHeight);
    this.debounceItemCalcHeight && this.debounceItemCalcHeight();
  }
  updateIndex() {
    let index = 0,
      low = 0,
      high = this.cacheList.length - 1;
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const middleOffset = this.cacheList[middle].offset;
      if (middleOffset === this.rootScroll.scrollY) {
        index = middle;
        break;
      } else if (middleOffset > this.rootScroll.scrollY) {
        high = middle - 1;
      } else {
        low = middle + 1;
      }
    }
    if (low > 0) {
      index = low - 1;
    }
    this.start = Math.max(0, index - 1);
  }
  getStartItemOffset() {
    if (this.cacheList[this.start]) {
      this.startOffset = this.cacheList[this.start].offset - this.rootScroll.scrollY;
    }
  }
  setScrollTop() {
    if (this.cacheList[this.start]) {
      this.scroller.scrollTop = this.cacheList[this.start].offset - this.startOffset;
      this.startOffset = 0;
    }
  }
  loadMore() {
    this.load();
    this.updateIndex();
  }
  onResize() {
    this.getStartItemOffset();
    this.cacheList.forEach(item => {
      item.loaded = false;
    });
    this.loadItems();
  }
  destroyed() {
    window.removeEventListener('resize', this.onResize);
  }
}
