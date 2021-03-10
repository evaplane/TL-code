<template>
  <div class="popup-bottom-wrap">
    <transition name="popup-bottom">
      <div class="popup-bottom" v-if="isShowOrderDetail">
        <slot></slot>
      </div>
    </transition>
    <div class="meng-ceng" v-if="isShowOrderDetail" @click="closeWindows"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
@Component({
  components: {
  }
})

export default class OrderPopup extends Vue {
  @Prop({ default: true, type: Boolean }) isShowOrderDetail!: boolean;

  @Emit('close-Windows')
  closeWindows() {}
}
</script>

<style lang='scss'>
.popup-bottom-wrap {
  .popup-bottom {
    position: fixed;
    z-index: 2001;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0;
    background: #f6f6fd;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

    .return-btn {
      width: 15px;
      height: 15px;
      border-top: 2px solid #202025; /* no */
      border-left: 2px solid #202025; /* no */
      transform: rotate(-45deg);
    }

    h2 {
      color: #202025;
      font-size: 20px;
      @include bold;
      margin-left: 5px;
    }
  }
  .popup-bottom-enter,
  .popup-bottom-leave-active {
    transform: translateY(100%);
    visibility: hidden;
  }
  [class*='enter-active'],
  [class*='leave-active'] {
    transition: all 0.3s;
  }
  .meng-ceng {
    background: black;
    opacity: 0.5;
    z-index: 99;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
  }
}
</style>
