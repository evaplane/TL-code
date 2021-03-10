<template>
  <div class="input-field" :class="'input-direction--' + direction">
    <div class="input-field-prepend" v-if="$slots.prepend || label">
      <slot name="prepend">
        <span class="label">{{ label }}</span>
      </slot>
    </div>
    <div class="input-field-form">
      <input v-model="model" v-bind="$attrs" v-on="listeners" class="form-control" placeholder="_" />
      <span class="form-placeholder">{{ placeholder }}</span>
    </div>
    <div class="input-field-append" v-if="$slots.append || unit">
      <slot name="append">
        <span class="unit">{{ unit }}</span>
      </slot>
    </div>
  </div>
  <!-- <van-field v-bind="$attrs" v-model="model" v-on="listeners" size="large">
    <slot name="prepend" slot="prepend"></slot>
    <slot name="append" slot="append"></slot>
    <slot name="button" slot="button"></slot>
    <slot name="right-icon" slot="right-icon"></slot>
    <slot></slot>
  </van-field> -->
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import mixinsInputNumber from '@/mixins/input/number';
type ValueType = string | number;
@Component
export default class ElInput extends Mixins(mixinsInputNumber) {
  @Prop({ type: [String], default: '' }) label!: string;
  @Prop({ type: [String], default: '' }) unit!: string;
  @Prop({ type: [String], default: '' }) placeholder!: string;
  @Prop({ type: [String], default: 'right', validator: v => ['left', 'right'].indexOf(v) > -1 }) direction!: string;

  name = 'VanField';
  componentName = 'VanField';
  get listeners() {
    return {
      ...this.$listeners,
      input() {},
      blur: (event: any) => {
        this.$emit('blur', event);
        let { value } = event.target;
        if (value !== '' && value < this.min) {
          this.$emit('input', this.min);
        }
      }
    };
  }
  inputHandle(event: any) {
    let value = event.target.value;
    this.input(value);
  }
  mounted() {
    if (this.itype === 'number') {
      this.$el.addEventListener('input', this.inputHandle, false);
    }
  }
  beforeDestroy() {
    if (this.itype === 'number') {
      this.$el.removeEventListener('input', this.inputHandle, false);
    }
  }
}
</script>

<style lang="scss">
.input-field {
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: var(--default-color);
  &.input-direction--left {
    .form-placeholder {
      left: 15px;
    }
    .form-control {
      text-align: left;
    }
  }
  &.input-direction--right {
    .form-placeholder {
      right: 15px;
    }
    .form-control {
      text-align: right;
    }
  }
}

.input-field-prepend {
  flex: none;
  display: flex;
  align-items: center;
  .label {
    padding-left: 15px;
    color: var(--heavy-color);
  }
}
.input-field-append {
  flex: none;
  display: flex;
  align-items: center;
  .unit {
    padding-right: 15px;
    margin-left: -8px;
  }
}
.input-field-form {
  flex: 1;
  position: relative;
  z-index: 1;
  .form-placeholder {
    color: var(--thin-color);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: -1;
  }
  .form-control {
    font-family: inherit;
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    background-color: transparent;
    border-radius: 0;
    padding: 0 15px;
    color: var(--heavy-color);
    font-size: 16px;
    -webkit-appearance: none;
    &:placeholder-shown::placeholder {
      color: transparent;
    }
    &:not(:placeholder-shown) ~ .form-placeholder {
      display: none;
    }
  }
}
</style>
