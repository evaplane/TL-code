<template>
  <div :class="{ active: rootSelect.value === value }" @click="clickHandle" class="m-option">
    {{ label }}
    <slot />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import Select from './select.vue';
@Component
export default class Option extends Vue {
  name: string = 'option';
  width: string = 'auto';
  @Prop({ required: true }) value!: any;
  @Prop({ type: String, required: true }) label!: string;
  @Inject() rootSelect!: Select;
  clickHandle() {
    this.rootSelect.click(this.value);
  }
}
</script>

<style lang='scss'>
.m-option {
  text-align: center;
  border-radius: 2px; /* no */
  font-size: 12px;
  color: var(--theme-color);
  position: relative;
  display: inline-block;
  padding: 8px 10px;
  border: 1px solid transparent; /* no */
  transition: 0.3s;
  &::after {
    transition: 0.4s;
    content: '';
    border: 0px solid transparent;
    position: absolute;
    display: inline-block;
    right: 0;
    top: 0;
  }
  @include light {
    background: #f7f8fe;
  }
  @include dark {
    background: #32353a;
  }
  &.active {
    border-color: var(--primary-color);
    color: var(--primary-color);
    background: transparent;
    &::after {
      border: 4px solid var(--primary-color); /* no */
      border-left-color: transparent;
      border-bottom-color: transparent;
    }
  }
  .icon-arrow {
    margin-right: -5px;
  }
}
</style>
