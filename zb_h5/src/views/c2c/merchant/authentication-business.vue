<template>
  <div class="authentication-business-state-wrap">
    <app-bar title="认证商家" />
    <div class="ordinary-business">
      <div class="ordinary-business-wait" v-if="isShowAwait">
        <icon-portrait :img-url="require('@img/c2c/merchant/ordinary-business-wait.png')" size="80" />
        <p>
          您的申请正在审核中
          <br />请耐心等待并留意手机短信结果通知
        </p>
      </div>
      <div class="ordinary-business-success" v-else>
        <div class="portrait">
          <icon-portrait :img-url="require('@img/c2c/merchant/authentication-businesses-big.png')" size="80" />
          <p>您已是OTC认证商家</p>
        </div>
        <div class="cancel" @click="cancelAuthentication">
          <p>申请解除认证商家</p>
          <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
// component
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import appBar from '@/components/c2c/app-bar.vue';
// api
import { reqReleaseAuth } from '@/api/otc/business-user';
// mixins
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

@Component({
  components: {
    iconPortrait,
    appBar
  }
})
export default class AuthenticationBusiness extends Mixins(mixinsOtcGetUserToken) {
  @State('merchant', { namespace: 'merchant' }) merchant!: any;
  @Action('getMerchantInfo', { namespace: 'merchant' }) getMerchantInfo!: Function;
  isShowAwait: boolean = false;
  async created() {
    await this.getMerchantInfo();
    this.isShowAwait = this.merchant.checkStatus === 1;
  }

  async cancelAuthentication() {
    try {
      await reqReleaseAuth();
      this.isShowAwait = true;
    } catch (e) {
      this.$message.fail(e.resMsg.message);
    }
  }
}
</script>

<style lang='scss'>
.authentication-business-state-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .ordinary-business {
    padding-top: 161px;
    display: flex;
    flex-direction: column;
    background: var(--default-bg);
    flex: 1;
    .ordinary-business-success {
      padding-bottom: 44px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      p {
        padding-top: 19px;
        font-size: 15px;
        font-weight: 500;
        color: #27364a;
        @include dark {
          color: var(--new-theme-color-6);
        }
      }
      .cancel {
        flex: 1;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        color: #9da8b3;
        p {
          font-size: 14px;
          font-weight: 400;
          color: #9da8b3;
          padding-top: 0;
          padding-bottom: 4px;
        }
      }
    }
    .portrait {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
    .ordinary-business-wait {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        padding-top: 20px;
        text-align: center;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 400;
        color: rgba(39, 54, 74, 1);
        line-height: 20px;
      }
    }
  }
}
</style>
