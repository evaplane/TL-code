<template>
  <div class="virtual-input">
    <div class="virtual-input-wrap">
      <div :class="{ focus: isFocus }" @click.stop="click" class="input">
        <span class="value" v-show="model">{{ model }}</span>
        <span class="placeholder" v-show="!model">{{ placeholder }}</span>
        <span class="unit">
          <slot name="right-icon"></slot>
        </span>
      </div>
      <input class="hide-inp" type="text" />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Prop, Emit, Vue } from 'vue-property-decorator';
import mixinsInputNumber from '@/mixins/input/number';
let virtualInputList = (window as any)['__virtualInputList'];
if (!virtualInputList) {
  virtualInputList = (window as any)['__virtualInputList'] = [];
}
@Component
export default class VirtualInput extends Mixins(mixinsInputNumber) {
  isFocus = false;
  isVirtualKeyborad = false;
  hideInp: HTMLInputElement | null = null;
  @Prop({ type: String, default: '' }) label!: string;
  @Prop({ type: String, default: '' }) placeholder!: string;
  @Prop({ type: String, default: '' }) rightIcon!: string;
  @Prop({ type: Boolean, default: false }) isSystemKeyboard!: boolean;
  @Prop({ type: Boolean, default: true }) border!: boolean;
  @Emit()
  click() {
    this.hideInp && this.hideInp.focus();
    this.focus();
  }
  @Emit()
  focus() {
    virtualInputList.map((component: VirtualInput) => {
      if (component !== this && component.isFocus === true) {
        component.isFocus = false;
        component.blur();
      }
    });
    this.isFocus = true;
  }
  @Emit()
  blur() {
    this.isFocus = false;
  }
  registerKeyboardDirective() {
    if (this.isSystemKeyboard === false) {
      Vue.directive('keyboard', {
        bind: () => {
          this.isVirtualKeyborad = true;
        }
      });
    }
  }
  created() {
    this.registerKeyboardDirective();
  }
  mounted() {
    // 添加
    virtualInputList.push(this);
    let inputWarp: HTMLDivElement | null = this.$el.querySelector('.input');
    if (inputWarp !== null) {
      let value: HTMLSpanElement | null = inputWarp.querySelector('.value');
      if (value !== null) {
        value.style.maxWidth = inputWarp.offsetWidth - 2 + 'px';
      }
    }
    if (this.isSystemKeyboard === false) {
      document.addEventListener('click', this.blur, false);
      return;
    }
    this.hideInp = this.$el.querySelector('.hide-inp');
    if (this.hideInp) {
      this.hideInp.addEventListener('blur', this.blur, false);
    }
  }
  beforeDestroy() {
    // 移除
    virtualInputList.splice(virtualInputList.indexOf(this), 1);
    if (this.isSystemKeyboard === false) {
      document.removeEventListener('click', this.blur, false);
      return;
    }
    if (this.hideInp) {
      this.hideInp.removeEventListener('blur', this.blur, false);
    }
  }
}
</script>

<style lang='scss'>
.virtual-input {
  @keyframes inputAnimate {
    0% {
      visibility: visible;
    }
    50% {
      visibility: hidden;
    }
  }

  .hide-inp {
    position: absolute;
    left: -33333px;
    top: 0;
  }
  .input {
    width: 100%;
    height: 46px;
    border: 1px solid #e4e8ec; /* no */
    border-radius: 2px; /* no */
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    z-index: 1;
    .placeholder {
      position: absolute;
      left: 13px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      z-index: -1;
      color: var(--thin-color);
    }
    .unit {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
    }
    .value {
      color: #313038;
      font-size: 16px;
      @include bold;
    }
    &.focus::after {
      content: '';
      margin-left: 3px;
      visibility: hidden;
      width: 1px; /* no */
      height: 16px;
      background-color: #313038;
      animation: inputAnimate 1s ease-out infinite;
    }
  }
  @include dark {
    .input {
      border-color: #4d4b58;
      .value {
        color: #b2b8c1;
      }
      &.focus::after {
        background-color: #b2b8c1;
      }
    }
  }
}
</style>
