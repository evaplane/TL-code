<template>
  <span>
    <van-popup
      :class="popupClass"
      :close-on-click-overlay="closeOnClickOverlay"
      :id="id"
      :overlay-class="overlay === false ? 'transparent' : ''"
      class="menu-popup"
      get-container="body"
      position="top"
      v-model="visible"
    >
      <transition name="menu-list">
        <div class="m-menu-list" v-if="visible">
          <slot />
        </div>
      </transition>
    </van-popup>
    <slot name="reference" />
  </span>
</template>

<script lang='ts'>
import { Component, Vue, Provide, Emit, Prop } from 'vue-property-decorator';
import { on, off } from '@/utils/event';
@Component
export default class Menu extends Vue {
  @Prop({ type: Boolean, default: true }) closeOnClickOverlay!: boolean;
  @Prop({ type: Boolean, default: true }) closeOnClick!: boolean;
  @Prop({ type: Boolean, default: true }) overlay!: boolean;
  @Prop({ type: String, default: '' }) popupClass!: '';
  visible = false;
  id: string = '';
  x: number = 0;
  referenceEl!: HTMLElement | undefined;
  @Provide()
  rootMenu = this.getMenu();
  getMenu() {
    return this;
  }
  openHandle() {
    this.$nextTick(() => {
      let popupEl: HTMLDivElement | null = document.querySelector(`#${this.id}`);
      let referenceBtn = this.referenceEl;
      if (!popupEl || !referenceBtn) {
        return;
      }
      let listEl: HTMLDivElement | null = popupEl.querySelector('.m-menu-list');
      if (listEl === null) return;
      let y = referenceBtn.offsetHeight + referenceBtn.offsetTop,
        x = this.x;
      if (x + listEl.offsetWidth > window.screen.availWidth) {
        listEl.style.right = '20px';
      } else {
        listEl.style.left = x + 'px';
      }
      if (y + listEl.offsetHeight > window.screen.availHeight) {
        listEl.style.bottom = '20px';
      } else {
        listEl.style.top = y + 'px';
      }
    });
  }
  clickHandle(event: MouseEvent) {
    this.visible = true;
    if (this.referenceEl && this.referenceEl.offsetLeft > 0) {
      this.x = this.referenceEl.offsetLeft;
    } else {
      this.x = event.pageX - event.offsetX;
    }
  }
  trigger() {
    this.visible = !this.visible;
  }
  @Emit()
  change(value: any) {
    if (this.closeOnClick === true) {
      this.visible = false;
    }
    return value;
  }
  created() {
    this.id =
      'menu-popup-' +
      Math.random()
        .toString()
        .slice(-5);
  }
  mounted() {
    let { reference } = this.$slots;
    if (reference) {
      this.referenceEl = reference[0].elm as HTMLElement;
    }
    if (this.referenceEl) {
      if (this.$el.parentNode) {
        this.$el.parentNode.appendChild(this.referenceEl);
        this.$el.parentNode.removeChild(this.$el);
      }
      on(this.referenceEl, 'click', this.clickHandle);
    }
  }
  beforeDestroy() {
    off(this.referenceEl, 'click', this.clickHandle);
    if (this.referenceEl) {
      let parent = this.referenceEl.parentNode;
      if (parent) {
        parent.removeChild(this.referenceEl);
      }
    }
  }
}
</script>

<style lang='scss'>
.menu-popup {
  background-color: transparent;
  overflow-y: visible;
}
.van-overlay.transparent {
  background-color: transparent;
}
.m-menu-list {
  display: inline-block;
  background: var(--popup-bg);
  color: var(--heavy-color);
  position: absolute;
  right: 15px;
  top: 15px;
  border-radius: 3px;
  overflow: hidden;
  padding: 8px 0;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.2);
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transform-origin: right top;
  transition: all 0.3s;
}
.menu-list-enter,
.menu-list-leave-active,
.van-popup-slide-top-enter .m-menu-list {
  opacity: 0;
  transform: scale(0.5);
  visibility: hidden;
}
</style>
