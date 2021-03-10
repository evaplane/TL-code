<template>
  <div class="zb-loading">
    <img class="loading-circle" src="@img/loading-circle.png" />
    <img class="loading-logo" src="@img/loading-logo.svg" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Loading extends Vue { }
</script>
<style lang="scss">
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.zb-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  opacity: 0.8;
  img {
    vertical-align: middle;
  }
  .loading-circle {
    width: 100%;
    height: 100%;
    animation: loading 1s linear infinite both;
  }
  .loading-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 50%;
  }
}
</style>
