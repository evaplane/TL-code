<template>
  <div class="safety-box">
    <component :data="chartData" :extend="chartSettings" :is="asyncComp" height="150px"></component>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
@Component
export default class Safety extends Vue {
  @Getter('theme', { namespace: 'theme' }) theme!: string
  chartData: any = {
    columns: ['type', 'value'],
    rows: [
      { type: '__("安全系数")', value: 90 }
    ]
  }
  @Watch('theme', { immediate: true })
  themeChanged(value: string) {
    this.$set(this.chartSettings.series.axisLine.lineStyle.color[0], 1, value === 'light' ? '#7c8792' : '#fff');
    this.$set(this.chartSettings.series.splitLine.lineStyle, 'color', this.bgColor());
  }
  chartSettings: any = {
    series: {
      axisLabel: {
        show: false
      },
      splitLine: {
        length: 12,
        lineStyle: {
          width: 4,
          color: '#fff'
        }
      },
      splitNumber: 4,
      axisTick: {
        show: false
      },
      pointer: {
        length: '50%',
        width: 5
      },
      axisLine: {
        lineStyle: {
          width: 8,
          color: [[1, '']]
        }
      },
      detail: {
        fontSize: 14,
        formatter: function (value: string) {
          return `${value}%\n\n __('安全系数')`;
        },
        padding: [40, 0, 0, 0]
      }
    }
  }
  asyncComp: any = null
  async created() {
    const webpackModule = await import(/* webpackChunkName: 'chart-line' */ 'v-charts/lib/gauge.common');
    this.asyncComp = webpackModule.default || webpackModule;
  }
  bgColor() {
    return getComputedStyle(document.body).getPropertyValue('--theme-bg').trim();
  }
}
</script>
<style lang='scss'>
.safety-box {
  height: 150px;
}
</style>
