<template>
  <div class="keyboard-box">
    <div class="keyboard-control">
      <div class="keyboard-tips">{{ label }}</div>
      <a @click="hide" class="keyboard-confirm-btn" href="javascript:;">{{ confirmBtnText }}</a>
    </div>
    <div class="keyboard-item keyboard-number">
      <i :key="item" v-tap.stop="{ methods: inputHandle(item + '') }" v-hover class="key" v-for="item in 9">{{ item }}</i>
      <i v-tap.stop="{ methods: inputHandle('.') }" class="key clear-bg" v-hover>.</i>
      <i v-tap.stop="{ methods: inputHandle('0') }" class="key" v-hover>0</i>
      <i v-tap.stop="{ methods: deleteHandle }" class="zbicon-delete key clear-bg" v-hover />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit, Watch, Prop } from 'vue-property-decorator';
import VirtualInput from '@/components/common/virtual-input/index.vue';
import { isMobile } from '@/utils/is';
function isTap(self: any) {
  if (self.disabled) {
    return false;
  }
  var tapObj = self.tapObj;
  return self.time < 300 && Math.abs(tapObj.distanceX) < 10 && Math.abs(tapObj.distanceY) < 10;
}

function touchstart(e: TouchEvent, self: any) {
  var touches = e.touches[0];
  var tapObj = self.tapObj;
  tapObj.pageX = touches.pageX;
  tapObj.pageY = touches.pageY;
  tapObj.clientX = touches.clientX;
  tapObj.clientY = touches.clientY;
  self.time = +new Date();
}

function touchend(e: TouchEvent, self: any) {
  var touches = e.changedTouches[0];
  var tapObj = self.tapObj;
  self.time = +new Date() - self.time;
  tapObj.distanceX = tapObj.pageX - touches.pageX;
  tapObj.distanceY = tapObj.pageY - touches.pageY;

  if (!isTap(self)) return;
  self.handler(e);
}
@Component({
  directives: {
    tap: {
      bind: function(el: any, binding) {
        el.tapObj = {};
        el.handler = function(e: Event, isPc: boolean) {
          // This directive.handler
          var value = binding.value;

          if (!value && el.href && !binding.modifiers.prevent) {
            return (window.location = el.href);
          }

          value.event = e;
          var tagName = value.event.target.tagName.toLocaleLowerCase();

          if (!isPc) {
            value.tapObj = el.tapObj;
          }

          if (tagName === 'input' || tagName === 'textarea') {
            return value.event.target.focus();
          }

          value.methods.call(this, value);
        };
        if (isMobile === false) {
          el.addEventListener(
            'click',
            function(e: Event) {
              if (binding.modifiers.stop) {
                e.stopPropagation();
              }
              if (binding.modifiers.prevent) {
                e.preventDefault();
              }
              el.handler(e, true);
            },
            false
          );
        } else {
          el.addEventListener(
            'touchstart',
            function(e: TouchEvent) {
              if (binding.modifiers.stop) {
                e.stopPropagation();
              }
              if (binding.modifiers.prevent) {
                e.preventDefault();
              }
              touchstart(e, el);
            },
            false
          );
          el.addEventListener(
            'touchend',
            function(e: TouchEvent) {
              try {
                Object.defineProperty(e, 'currentTarget', {
                  // 重写currentTarget对象 与jq相同
                  value: el,
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              } catch (e) {
                e.currentTarget = el;
              }
              e.preventDefault();
              return touchend(e, el);
            },
            false
          );
        }
      },
      componentUpdated: function(el: any, binding) {
        el.tapObj = {};
        el.handler = function(e: Event, isPc: boolean) {
          // This directive.handler
          var value = binding.value;
          value.event = e;
          if (!isPc) {
            value.tapObj = el.tapObj;
          }
          value.methods.call(this, value);
        };
      },
      unbind: function(el: any) {
        // 卸载，别说了都是泪
        el.handler = function() {};
      }
    }
  }
})
export default class Keyboard extends Vue {
  @Prop({ type: [String, Number], default: '' }) label!: string;
  @Prop({ type: [String, Number], default: '完成' }) confirmBtnText!: string;
  @Prop({ default: '' }) value: any;
  @Prop({ type: Boolean, default: true }) visible!: boolean;
  model = '';
  virtualInputList: VirtualInput[] = [];
  @Watch('value', { immediate: true })
  _(val: any) {
    this.model = val + '';
  }
  deleteHandle() {
    this.model = this.model.slice(0, -1);
    this.input('', 'delete');
  }
  clear() {
    this.model = '';
    this.input('', 'clear');
  }
  @Emit()
  confirm() {
    return this.model;
  }
  inputHandle(char: string) {
    return () => {
      this.input(char);
    };
  }
  @Emit()
  input(char: string, type?: string) {
    this.model += char;
    this.virtualInputList.map(input => {
      if (input.isFocus === true) {
        if (type === 'delete') {
          input.model = input.model.toString().slice(0, -1);
        } else {
          input.model = !this.model ? '' : input.model + char;
        }
      }
    });
    return this.model;
  }
  @Emit()
  hide() {
    // 让文本框失去焦点
    this.virtualInputList.map(input => {
      if (input.isFocus === true) {
        input.blur();
      }
    });
    return false;
  }
  mounted() {
    this.virtualInputList = (window as any)['__virtualInputList'] || [];
  }
}
</script>

<style lang='scss'>
.keyboard-box {
  padding: 0px 8px 20px;
  position: relative;
  border-top: 1px solid #eaeaea; /* no */
  background-color: #fff;
  @include dark {
    border-color: rgb(46, 48, 51);
    background-color: rgb(23, 24, 26);
  }
  .keyboard-item {
    color: #555;
    @include dark {
      color: #8d9ba8;
    }
  }
  .keyboard-tips {
    text-align: center;
    color: #989798;
    font-size: 14px;
    line-height: 1.15em;
    height: 1.15em;
  }
  .keyboard-control {
    position: relative;
    padding: 14px 0;
  }
  .keyboard-confirm-btn {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    color: #555;
    @include dark {
      color: #fff;
    }
  }
  .key {
    flex: none;
    display: flex;
    font-size: 22px;
    font-weight: 500;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    margin-top: 8px;
    font-style: normal;
    user-select: none;
    -webkit-user-select: none;
    height: 45px;
    transition: all 0.3s;
    background-color: #e9e9e9;
    @include dark {
      background-color: rgba(115, 115, 115, 0.97);
      color: #fff;
    }
    &.hover-active {
      background-color: #bebebe;
      @include dark {
        background-color: #2e2e2e;
      }
    }

    &[class*='zbicon'] {
      font-size: 16px;
    }
    &.clear-bg {
      background: transparent;
    }
  }
  .submit-btn {
    width: 100%;
    color: #fff;
    font-weight: bold;
    border: none;
    transition: all 0.3s;
    background: var(--primary-color);
  }
  .keyboard-left {
    flex: none;
    width: 68px;
    .key {
      &:first-child {
        height: 95px;
      }
    }
  }
  .keyboard-number {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .key {
      width: calc((100% - 16px) / 3);
    }
  }
  .keyboard-right {
    flex: none;
    width: 68px;
    .key {
      height: 95px;
    }
  }
}
</style>
