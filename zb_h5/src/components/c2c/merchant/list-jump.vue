<template>
  <div @click="$router.push({name: `${routerPath}`})" class="list-jump-wrap">
    <div class="merchant-list-jump">
      <icon-portrait :img-url="`${imgUrl}`" size="38" />
      <div class="middle-content">
        <span class="middle-content-top">{{topText}}</span>
        <span class="middle-content-bottom">{{bottomText}}</span>
      </div>
      <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22" />
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import iconPortrait from '@/components/c2c/icon-portrait.vue';

@Component({
  components: {
    iconPortrait
  }
})
export default class MerchantListJumpComplex extends Vue {
  @Prop({ type: String, default: '' }) imgUrl!: string;
  @Prop({ type: String, default: '' }) topText!: string;
  @Prop({ type: String, default: '' }) bottomText!: string;
  @Prop({ type: String, default: '' }) routerPath!: string;
}
</script>

<style lang='scss'>
.list-jump-wrap {
  @include light {
    background: var(--default-bg);
  }
  @include dark {
    background: var(--default-bg);
  }
  .merchant-list-jump {
    display: flex;
    margin-left: 14px;
    margin-right: 14px;
    height: 86px;
    border-bottom: 1px solid var(--border-color); /* no */
    align-items: center;
    justify-content: center;
    .middle-content {
      height: 100%;
      padding-left: 10px;
      padding-top: 24px;
      flex-direction: column;
      display: flex;
      flex: 1;
      .middle-content-top {
        padding-bottom: 4px;
        font-size: 18px;
        font-weight: 500;
        color: #27364a;
        @include light {
          color: var(--new-theme-color-3);
        }
        @include dark {
          color: var(--new-theme-color-3);
        }
      }
      .middle-content-bottom {
        font-size: 13px;
        font-weight: 400;
        @include light {
          color: var(--new-theme-color-3);
        }
        @include dark {
          color: var(--new-theme-color-c);
        }
      }
    }
  }
}
</style>
