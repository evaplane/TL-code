<template>
  <div class="c2c-header-back" :class="{ border }">
    <div @click="back" class="left">
      <icon-return />
    </div>
    <div class="center">
      <slot />
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component({})
export default class HeaderBack extends Vue {
  @Prop({ type: Boolean, default: false }) border!: boolean;

  @Emit('back')
  back() {
    this.$router.back();
  }
}
</script>

<style lang="scss">
.c2c-header-back {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--padding-lr) 10px;
  color: var(--new-theme-color-3);
  background: var(--default-bg);
  max-height: 54px;
  &.border {
    border-bottom: 1px solid var(--border-color);
  }
  .center {
    flex: 1;
    font-size: 24px;
    font-weight: 800;
  }
  .left {
    padding-right: 20px;
  }
  .right {
    padding-left: 20px;
  }
}
</style>
