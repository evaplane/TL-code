<template>
  <div class="m-menu-item-box" v-hover @click="clickHandle">
    <slot>
      <i class="menu-icon" :class="iconClass"></i>
      <span class="menu-text u-text-overflow1">{{ label }}</span>
    </slot>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Inject, Emit } from 'vue-property-decorator';
import Menu from './menu.vue';
@Component
export default class MenuItem extends Vue {
  @Prop({ type: String, default: '' }) iconClass!: string;
  @Prop({ type: String, default: '' }) label!: string;
  @Prop({ type: [String, Number, Object] }) value!: string | number | object;
  @Inject() rootMenu!: Menu;
  clickHandle() {
    this.rootMenu.change(this.value);
    this.click();
  }
  @Emit()
  click() {}
}
</script>

<style lang='scss'>
.m-menu-item-box {
  display: flex;
  align-items: center;
  &.hover-active {
    @include light {
      background: #e2e2e2;
    }
    @include dark {
      background: #2e2e2e;
    }
  }
  padding: 12px 18px;
  .menu-icon {
    margin-right: 6px;
    font-size: 20px;
    vertical-align: middle;
  }
  .menu-text {
    vertical-align: middle;
    font-size: 14px;
  }
}
</style>
