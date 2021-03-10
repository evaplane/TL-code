<template>
  <div class="apply-ordinary-business-wrap">
    <app-bar title="申请普通商家" />
    <native-scroll class="apply-ordinary-business-scroll">
      <div class="apply-ordinary-business">
        <icon-portrait :img-url="require('@img/c2c/merchant/ordinary-business-big.png')" size="98" />
        <p class="business-name">普通商家</p>
        <p class="business-content">普通商家可以自由发布广告，适合有经验和能力的用户。普通用户建议直接C2C或OTC下单交易</p>
        <button-list is-jump="true" left-text="绑定手机号" right-text="已绑定" topSize="20" />
        <button-list
          :right-text="otcUserInfo && otcUserInfo.authStatus >= 6 ? '已完成' : '去认证' "
          is-jump="false"
          left-text="高级实名认证"
          topSize="20"
        />
        <div class="bottom-content">
          <div>
            <checkbox-agreement @checkbox-click="clickCheckBox" />
          </div>
          <otc-button @click.native="submitButton" button-type="bigConfirm" text="成为商家" />
        </div>
      </div>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
// component
import appBar from '@/components/c2c/app-bar.vue';
import checkbox from '@/components/c2c/check-box.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import buttonList from '@/components/c2c/merchant/button-list.vue';
import checkboxAgreement from '@/components/c2c/merchant/checkbox-agreement.vue';
// api
import { reqBecomeBusiness } from '@/api/otc/business-user';
// mixins
import MixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
// store
import { IOtcUser } from '@/api/otc/user';

@Component({
  components: {
    iconPortrait,
    buttonList,
    checkbox,
    checkboxAgreement,
    appBar,
    otcButton
  }
})
export default class ApplyOrdinaryBusiness extends Mixins(MixinsOtcGetUserToken) {
  @Getter('otcUserInfo', { namespace: 'otc' }) otcUserInfo!: IOtcUser;

  checkboxAgree: boolean = false; // otc服务协议

  clickCheckBox(value: boolean) {
    this.checkboxAgree = value;
  }

  async submitButton() {
    if (this.isVerification()) {
      await reqBecomeBusiness();
      return this.$router.push({ name: 'ordinary-business' });
    }
  }

  isVerification(): boolean {
    if (!this.checkboxAgree) {
      this.$message.fail('请同意《OTC服务协议》');
      return false;
    }

    if (this.otcUserInfo.authStatus < 6) {
      this.$message.fail('请先完成高级实名认证');
      return false;
    }
    return true;
  }
}
</script>

<style lang='scss'>
.apply-ordinary-business-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  .apply-ordinary-business-scroll{
    flex: 1;
    display: flex;
  }
  .apply-ordinary-business {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 35px;
    background: var(--default-bg);
    .business-name {
      padding-top: 13px;
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
    .business-content {
      width: 240px;
      padding-top: 5px;
      padding-bottom: 56px;
      text-align: center;
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
      @include light {
        color: var(--new-theme-color-6);
      }
      @include dark {
        color: var(--new-theme-color-6);
      }
    }
    .bottom-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      padding-top: 33px;
      padding-bottom: 33px;
    }
  }
}
</style>
