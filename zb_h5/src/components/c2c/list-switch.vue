<template>
  <div class="list-switch-wrap">
    <div :class="`switch-${size}`" class="switch-list">
      <span class="left-text">{{leftText}}</span>
      <m-switch :value="switchValue" @input="changeHandle" :active-value='activeValue'  :inactive-value='inactiveValue' />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import mSwitch from '@/components/common/switch/index.vue';

@Component({
  components: {
    mSwitch
  }
})

export default class MerchantListSwitch extends Vue {
  @Prop({ type: Number, default: 0 }) switchValue!: number;
  @Prop({ type: String, default: '' }) leftText!: string;
  @Prop({ type: String, default: 'big' }) size!: string;

  activeValue: number = 1;
  inactiveValue: number = 0;

  @Emit('change-switch')
  changeHandle() { }
}
</script>

<style lang='scss'>
.list-switch-wrap {
  background: var(--default-bg);
  .switch-list {
    border-bottom: 1px solid var(--border-color); /* no */
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-text {
      font-size: 15px;
      font-weight: 500;
      color: var(--new-theme-color-3);
    }
    &.switch-big {
      margin-left: 15px;
      margin-right: 15px;
      height: 65px;
    }
    &.switch-small {
      margin-left: 20px;
      margin-right: 20px;
      height: 55px;
    }
  }

}
</style>
