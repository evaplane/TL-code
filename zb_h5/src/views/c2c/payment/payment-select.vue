<template>
  <native-scroll>
    <div class="payment-select-wrap">
      <app-bar title="选择收付款方式" />
      <ul class="ul-wrap">
        <li :key="key" v-for="(item, key) in mixinsBankCard" class="ul-wrap-li">
          <div @click="jumpPage(item)" class="content-wrap">
            <div>
              <span>{{ item.name }}</span>
            </div>
            <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22" />
          </div>
        </li>
      </ul>
    </div>
  </native-scroll>
</template>
<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
// mixins
import mixinsC2CCommon, { IBankCard } from '@/mixins/c2c/common-data';

@Component({
  components: {
    appBar,
    iconPortrait
  }
})

export default class PaymentSelect extends Mixins(mixinsC2CCommon) {
  jumpPage(item: IBankCard) {
    this.$router.push({ name: item.value, params: { title: item.urlName, idCard: 'no' } });
  }
}
</script>

<style lang='scss'>
.payment-select-wrap {
  background: var(--default-bg);
  .ul-wrap {
    li {
      margin-left: 20px;
      padding-right: 20px;
      border-bottom: 1px solid var(--border-color); /* no */
    }
    .content-wrap {
      height: 65px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      font-weight: 500;
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
  }
}
</style>
