<template>
  <div class="slider-box">
    <component
      :hide-label="true"
      :is="asyncComp"
      @touchmove.stop
      height="2px"
      tooltip="none"
      tooltip-formatter="{value}%"
      v-bind="$attrs"
      v-on="listeners"
    >
      <template v-slot:dot>
        <span class="custom-dot">
          <i></i>
        </span>
      </template>
      <template v-slot:mark="{ pos }">
        <span :class="{ acitve: pos <= value }" :style="{ left: pos + '%' }" class="custom-mark"></span>
      </template>
    </component>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit } from 'vue-property-decorator';
@Component
export default class Slider extends Vue {
  asyncComp: any = null;
  value: number = 0;
  async created() {
    let webpackModule = await import(/* webpackChunkName: 'vue-slider' */ 'vue-slider-component');
    this.asyncComp = webpackModule.default;
  }
  get listeners() {
    return Object.assign(this.$listeners, {
      change: (v: number) => {
        this.value = v;
        this.change(v);
      }
    });
  }
  @Emit()
  change(v: number) {
    return v;
  }
}
</script>

<style lang='scss'>
@import 'vue-slider-component/lib/theme/default.scss';
.slider-box {
  .custom-dot {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 13px; /* no */
    height: 20px; /* no */
    border-radius: 20px; /* no */
    display: flex;
    align-items: center;
    justify-content: center;
    &::before,
    &::after {
      content: '';
      width: 1px; /* no */
      height: 8px; /* no */
      background-color: currentColor;
    }
    i {
      width: 1px; /* no */
      height: 8px; /* no */
      background-color: currentColor;
      margin: 0 1px;
    }
    @include light {
      background: #fff;
      color: #aeb3ba;
      border: 1px solid #c8c8d6; /* no */
    }
    @include dark {
      color: #74798a;
      background: #32353a;
      border: 1px solid #74798a; /* no */
    }
  }
  .vue-slider-process {
    background: #a5a7ac;
  }
  .vue-slider-rail {
    @include light {
      background: #e4e9ef;
    }
    @include dark {
      background: #74798a;
    }
  }
  .vue-slider-marks {
    position: relative;
  }
  .vue-slider-dot-tooltip-bottom,
  .vue-slider-dot-tooltip-top {
    left: 80%;
  }
  .custom-mark {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 5px; /* no */
    height: 8px; /* no */
    border-radius: 10px; /* no */
    @include light {
      background: #e4e9ef;
      border: 1px solid #fff; /* no */
      &.acitve {
        background-color: #a5a7ac;
      }
    }
    @include dark {
      background: #32353a;
      border: 1px solid #74798a; /* no */
      &.acitve {
        border-color: #a5a7ac;
        background-color: #a5a7ac;
      }
    }
  }
}
</style>
