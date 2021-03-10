<template>
  <div class="business-application">
    <app-bar title="商家申请" />
    <list-jump
      :img-url="require('@img/c2c/merchant/ordinary-business.svg')"
      :router-path="jumpMerchantUrl"
      bottom-text="手续简易，普通玩家也能立即买卖"
      top-text="普通商家"
      v-show="userIdentity !== 2"
    />
    <list-jump
      :img-url="require('@img/c2c/merchant/authentication-businesses.svg')"
      :router-path="`${jumpMerchantUrl === 'ordinary-business' ? 'apply-authentication-business' : jumpMerchantUrl}`"
      bottom-text="享受优先排名，一对一专属服务"
      top-text="认证商家"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { Getter, Action } from 'vuex-class';
// component
import appBar from '@/components/c2c/app-bar.vue';
import listJump from '@/components/c2c/merchant/list-jump.vue';

@Component({
  components: {
    listJump,
    appBar
  }
})
export default class BusinessApplication extends Vue {
  @Action('getMerchantInfo', { namespace: 'merchant' }) getMerchantInfo!: Function;
  @Getter('judgeUserIdentity', { namespace: 'merchant' }) userIdentity!: number;
  @Getter('jumpMerchantUrl', { namespace: 'merchant' }) jumpMerchantUrl!: string;

  async mounted() {
    await this.getMerchantInfo();
  }
}
</script>

<style lang='scss'>
.business-application {
  flex: 1;
  height: 100%;
  background: var(--default-bg);
}
</style>
