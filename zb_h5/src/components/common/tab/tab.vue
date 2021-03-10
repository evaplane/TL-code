<template>
  <div :class="{ 'tabs-dark': dark }" class="tabs-wrap" ref="warp">
    <div class="tabs-list">
      <slot />
      <span class="tab-line" ref="tabLine"></span>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Provide, Model, Emit, Watch, Prop } from 'vue-property-decorator';
import TabItem from './tab-item.vue';
type TValue = string | number;
@Component
export default class Tab extends Vue {
  isFirst: boolean = true;
  children: TabItem[] = [];
  @Prop({ type: Boolean }) border!: boolean;
  @Prop({ type: Boolean }) dark!: boolean;
  @Model('input', { type: [String, Number], required: true }) value!: TValue;
  '$children': TabItem[];
  '$refs': {
    tabLine: HTMLSpanElement;
    warp: HTMLSpanElement;
  };
  @Provide()
  rootTab = this.getThis();
  @Watch('children')
  __() {
    this.$nextTick(() => {
      if (this.children) {
        let arr = this.children.filter(item => item.name === this.value),
          name: string | number = '';
        if (arr.length > 0) {
          name = arr[0].name;
        } else {
          name = this.children[0].name;
        }
        this.updateActive(name);
        this.input(name);
      }
    });
  }
  @Watch('value', { immediate: true })
  _(nv: TValue, ov: TValue) {
    if (ov && nv === ov) return;
    this.$nextTick(() => {
      this.updateActive(nv);
    });
  }
  getCurrentComponentByName(name: TValue) {
    let [activeComp] = this.$children.filter(comp => name === comp.name);
    return activeComp || null;
  }
  updateActive(name: TValue) {
    if (!name) {
      name = this.value;
    }
    let activeComp = this.getCurrentComponentByName(name);
    if (activeComp) {
      let el = activeComp.$el as HTMLSpanElement,
        left = el.offsetLeft + el.offsetWidth / 2 - 7.5;
      this.lineTranslateX(left);
    }
  }
  clickHandle(name: TValue) {
    this.updateActive(name);
    this.input(name);
    this.autoTranslateX(name);
    this.change(name);
  }
  scrollLeftTo(el: HTMLElement, to: number, duration: number) {
    let count = 0;
    const from = el.scrollLeft;
    const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16);
    function animate() {
      el.scrollLeft += (to - from) / frames;
      if (++count < frames) {
        window.requestAnimationFrame(animate);
      }
    }
    animate();
  }
  autoTranslateX(name: TValue) {
    let { offsetWidth, scrollWidth } = this.$refs.warp;
    let maxScrollLeft = scrollWidth - offsetWidth;
    if (offsetWidth >= scrollWidth) {
      return;
    }
    let activeComp = this.getCurrentComponentByName(name);
    let span = activeComp.$el as HTMLSpanElement;
    let left = span.offsetLeft - (this.$refs.warp.offsetWidth - span.offsetWidth) / 2;
    this.scrollLeftTo(this.$refs.warp, Math.min(left, maxScrollLeft), 0.2);
  }
  lineTranslateX(left: number) {
    this.$refs.tabLine.style.transform = `translate(${left}px, 0)`;
    if (this.isFirst === false) {
      this.$refs.tabLine.classList.add('transition');
    }
    this.isFirst = false;
  }
  @Emit()
  disabled(name: string | number) {
    return name;
  }
  @Emit()
  change(val: TValue) {
    return val;
  }
  @Emit()
  input(val: TValue) {
    return val;
  }
  getThis() {
    return this;
  }
}
</script>

<style lang='scss'>
.tabs-wrap {
  flex: none;
  width: 100%;
  padding-left: 7px;
  border-bottom: 6px solid var(--line-color);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  .tabs-list {
    display: inline-flex;
    position: relative;
  }
  .tab-item {
    color: var(--default-color);
    font-size: 16px;
    padding: 10px 8px;
    transition: 0.3s;
    font-weight: bold;
  }
  .tab-item--active {
    color: var(--primary-color) !important;
  }
  .tab-line {
    position: absolute;
    bottom: 0px;
    left: 0px;
    height: 3px; /* no */
    width: 15px; /* no */
    border-radius: 6px; /* no */
    background-color: var(--primary-color);
    display: block;
    &.transition {
      transition: 0.3s;
    }
  }
  &.tabs-dark {
    background-color: #181a27;
    .tab-item {
      color: #8e96a7;
    }
  }
}
</style>
