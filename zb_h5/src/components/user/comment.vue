<template>
  <i @click="comment" class="zbicon-zbicon-write comment-box"></i>
</template>
<script lang='ts'>
import { Component, Vue, Emit } from 'vue-property-decorator';
@Component
export default class Comment extends Vue {
  @Emit()
  comment() {
    return '';
  }
}
</script>
<style lang='scss'>
.comment-box {
  display: block;
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 1;
  font-size: 40px;
  color: var(--primary-color);
  &::after {
    content: '';
    width: 90%;
    height: 35px;
    background-color: #fff;
    position: absolute;
    z-index: -1;
    left: 2px;
    border-radius: 50%;
    top: 3px;
  }
}
</style>
