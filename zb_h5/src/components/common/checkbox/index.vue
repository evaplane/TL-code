<template>
  <div class="m-checkbox" @click="clickHandle">
    <input type="checkbox" v-model="model" />
    <label>
      <svg height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M.838 5.505a.7.7 0 0 1 .99 0l2.756 2.758 5.588-5.586a.7.7 0 0 1 .99.99L5.09 9.737a.7.7 0 0 1-1 .01L.838 6.496a.7.7 0 0 1 0-.99z"
          fill-rule="evenodd"
        />
      </svg>
    </label>
    <span>{{ label }}</span>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Model, Emit, Watch } from 'vue-property-decorator';
@Component
export default class MCheckbox extends Vue {
  model: any = null;
  @Prop({ type: String, default: '' }) label!: string;
  @Prop({ type: [String, Number, Boolean], default: true }) activeValue!: string | number | boolean;
  @Prop({ type: [String, Number, Boolean], default: false }) inactiveValue!: string | number | boolean;
  @Model('input') value!: any;
  @Watch('value', { immediate: true })
  _() {
    this.model = this.value;
  }
  clickHandle() {
    this.change();
    this.input();
  }
  @Emit()
  change() {
    return this.activeValue !== this.value ? this.activeValue : this.inactiveValue;
  }
  @Emit()
  input() {
    return this.activeValue !== this.value ? this.activeValue : this.inactiveValue;
  }
}
</script>

<style lang='scss'>
.m-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  input {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 14px; /* no */
    height: 14px; /* no */
    border: 1px solid #cdd0d8; /* no */
    border-radius: 1px; /* no */
    @include dark {
      border-color: #686d77;
    }
    svg {
      fill: var(--primary-color);
      opacity: 0;
      transform: scale(0.8);
    }
  }
  span {
    color: var(--default-color);
    margin-left: 3px;
  }
  input:checked ~ label {
    border-color: var(--primary-color);
    svg {
      opacity: 1;
    }
  }
}
</style>
