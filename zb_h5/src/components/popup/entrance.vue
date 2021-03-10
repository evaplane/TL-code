<template>
  <van-popup
    @closed="closeHandle"
    class="entrance-extend-popup"
    get-container="body"
    :overlay="false"
    position
    transition="entrance"
    v-model="modelVisible"
  >
    <div class="entrance-popup">
      <!-- <div class="tabs">
            <span class="tab-item" @click="isLogin = true" :class="{ 'tab-item--active': isLogin }">登录</span>
            <span class="tab-item" @click="isLogin = false" :class="{ 'tab-item--active': !isLogin }">注册</span>
          </div> -->
      <!-- <span @click="close" class="close-btn" v-if="isNext === false"><i></i></span> -->
      <span @click="close" class="close-btn"><i></i></span>
      <native-scroll>
        <transition :name="signType">
          <login-comp
            :is-next.sync="isNext"
            class="entrance-login"
            v-if="isLogin"
            @close="close"
            @slide-to-register="isLogin = false"
          />
          <register-comp class="entrance-register" v-else @slide-to-login="isLogin = true" />
        </transition>
      </native-scroll>
    </div>
  </van-popup>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import registerComp from './register.vue';
import loginComp from './login.vue';

@Component({
  components: {
    registerComp,
    loginComp
  }
})
export default class LoginPopup extends Vue {
  isLogin: boolean = true;
  modelVisible: boolean = false;
  isNext: boolean = false;
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: Function, default: null }) closeCallback!: Function | null;
  signType: string = 'sign-left';
  @Watch('visible', { immediate: true })
  _() {
    this.modelVisible = this.visible;
  }
  @Watch('isLogin')
  __(nv: boolean, ov: boolean) {
    if (!ov) {
      this.signType = 'sign-right';
    } else {
      this.signType = 'sign-left';
    }
  }
  @Emit('update:visible')
  close() {
    this.closeCallback && this.closeCallback();
    return (this.modelVisible = false);
  }
  closeHandle() {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
}
</script>

<style lang='scss'>
@import '@/assets/scss/login/style.scss';
.entrance-extend-popup {
  &.van-popup {
    transition: all 0.3s;
  }
  .entrance-login,
  .entrance-register {
    transition: 0.3s;
  }
  .sign-left-enter {
    transform: translate(100%);
  }
  .entrance-head {
    transition: 0.3s;
  }
  .sign-left-leave-active,
  .entrance-header-leave-active,
  .entrance-header-enter {
    position: absolute;
    width: 100%;
    transform: translate(-120%);
  }
  .sign-right-enter {
    transform: translate(-120%);
  }
  .sign-right-leave-active {
    position: absolute;
    width: 100%;
    transform: translate(100%);
  }
}
</style>
