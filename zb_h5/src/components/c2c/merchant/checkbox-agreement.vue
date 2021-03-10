<template>
  <div class="checkbox-span-wrap">
    <div class="checkbox-span">
      <checkbox @checkbox-click="clickHandle" />
      <p class="has-read-span">我已阅读并同意</p>
      <p class="agreement-span">《OTC服务协议》</p>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit } from 'vue-property-decorator';
import checkbox from '@/components/c2c/check-box.vue';

@Component({
  components: {
    checkbox
  }
})
export default class CheckboxAgreement extends Vue {
  @Emit('checkbox-click')
  clickHandle(value: boolean) {
    return value;
  }
}
</script>

<style lang='scss'>
.checkbox-span-wrap {
  .checkbox-span {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
  }

  .has-read-span {
    padding-left: 6px;
    font-size: 14px;
    font-weight: 400;
    @include light {
      color: var(--new-theme-color-6);
    }
    @include dark {
      color: var(--new-theme-color-c);
    }
  }

  .agreement-span {
    font-size: 14px;
    font-weight: 400;
    @include light {
      color: var(--new-theme-color-3);
    }
    @include dark {
      color: var(--new-theme-color-3);
    }
  }
}
</style>
