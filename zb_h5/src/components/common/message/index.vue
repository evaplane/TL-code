<template>
  <transition name="message" @after-leave="afterLeaveHandle" @before-leave="beforeLeaveHandle">
    <div class="zb-message" v-if="visible" :style="{ zIndex: zIndex }" :class="className">
      <div class="zb-message-box" :class="'zb-message--' + type">
        <span class="zb-message-icon">
          <icon-warn v-if="type === 'warn'" />
          <icon-error v-else-if="type === 'fail'" />
          <icon-success v-else-if="type === 'success'" />
        </span>
        <p class="zb-message-text">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class ZbMessage extends Vue {
  maskVisible: boolean = false;
  mask: boolean = false;
  maskEl!: HTMLDivElement;
  timer: number = 0;
  close() {}
  mounted() {
    if (this.mask === true) {
      this.maskEl = document.createElement('div');
      this.maskEl.className = 'zb-overlay overlay--opacity';
      document.body.appendChild(this.maskEl);
      this.timer && window.clearTimeout(this.timer);
      window.setTimeout(() => {
        this.maskEl.classList.remove('overlay--opacity');
      });
    }
  }
  beforeLeaveHandle() {
    if (this.mask === true) {
      this.maskEl.classList.add('overlay--opacity');
      this.timer && window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => {
        document.body.removeChild(this.maskEl);
      }, 300);
    }
  }
  afterLeaveHandle() {
    let parentNode = this.$el.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.$el);
    }
  }
}
</script>

<style lang='scss'>
.zb-overlay {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(1, 7, 26, 0.7);
  z-index: 2000;
  transition: 0.3s;
  &.overlay--opacity {
    opacity: 0;
  }
}
.zb-message {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 4000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.zb-message-box {
  padding: 15px 20px;
  border-radius: 4px; /* no */
  font-size: 14px;
  display: flex;
  align-items: center;
  background-color: rgb(0, 0, 0);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  color: #fff;
  @include dark {
    background-color: #fff;
    color: #000;
  }
}
.zb-message-icon {
  .zb-icon {
    width: 20px;
  }
}
.zb-message-text {
  margin-left: 5px;
  line-height: 1.5;
  word-break: break-all;
}
.zb-message--warn {
  .zb-icon {
    fill: #ffb848;
  }
}
.zb-message--fail {
  .zb-icon {
    fill: #fb3030;
  }
}
.zb-message--success {
  .zb-icon {
    fill: #30de58;
  }
}
.message-enter-active,
.message-leave-active {
  transition: all 0.3s;
}
.message-enter,
.message-leave-to {
  transform: scale(0.7);
  opacity: 0;
}
</style>
