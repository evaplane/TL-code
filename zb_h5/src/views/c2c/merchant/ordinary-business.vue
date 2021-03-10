<template>
  <native-scroll>
    <app-bar title="普通商家" />
    <div class="ordinary-business-wrap">
      <div class="ordinary-business-card">
        <icon-portrait :img-url="require('@img/c2c/merchant/ordinary-business-big.png')" size="96" />
        <p>
          您已是一名OTC的普通商家
          <br />现在您可发布买卖广告进行交易
        </p>
      </div>
      <p class="hint-p">如您想进阶交易更大额和专业的OTC交易，可申请认证商家</p>
      <otc-button
        button-type="bigConfirm"
        @click.native="$router.push({ name: 'apply-authentication-business' })"
        text="申请认证商家"
      />
    </div>
  </native-scroll>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import buttonList from '@/components/c2c/merchant/button-list.vue';

@Component({
  components: {
    iconPortrait,
    buttonList,
    appBar,
    otcButton
  }
})
export default class OrdinaryBusiness extends Vue {}
</script>

<style lang='scss'>
.ordinary-business-wrap {
  display: flex;
  flex-direction: column;
  background: var(--default-bg);
  align-items: center;
  padding-top: 35px;
  .ordinary-business-card {
    width: 345px;
    height: 270px;
    box-shadow: 0px 3px 6px 2px var(--border-color); /* no */
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    @include light {
      background-color: #ffffff;
    }
    @include dark {
      background-color: #2c2e32;
    }
    p {
      text-align: center;
      width: 210px;
      padding-top: 18px;
      line-height: 21px;
      font-size: 15px;
      font-weight: 500;
      color: #27364a;
      @include dark {
        color: var(--new-theme-color-6);
      }
    }
  }
  .hint-p {
    width: 100%;
    font-size: 12px;
    line-height: 17px;
    text-align: left;
    font-weight: 400;
    color: #9da8b3;
    padding: 16px 15px 46px 15px;
  }
}
</style>
