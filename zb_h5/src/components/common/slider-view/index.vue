<template>
  <transition :name="transitionName">
    <router-view />
  </transition>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'vue-property-decorator';
import { Route } from 'vue-router';
@Component
export default class SliderView extends Vue {
  transitionName: string = '';
  @Watch('$route', { immediate: true })
  _(to: Route, from: Route) {
    if (from && to.meta.level && from.meta.level) {
      this.transitionName = (to.meta.level || 0) < from.meta.level ? 'left-slide' : 'right-slide';
    } else {
      this.transitionName = '';
    }
  }
}
</script>

<style lang="scss">
.right-slide-enter-active,
.right-slide-leave-active,
.left-slide-enter-active,
.left-slide-leave-active {
  transition: all 0.3s !important;
}
.right-slide-enter,
.left-slide-leave-active {
  transform: translate3d(100%, 0, 0) !important;
}
</style>
