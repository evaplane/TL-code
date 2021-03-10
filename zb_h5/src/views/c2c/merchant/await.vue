<template>
  <div class="ordinary-business-wrap">
    <app-bar title="认证商家" />
    <div class="ordinary-business">
      <div class="ordinary-business-wait">
        <icon-portrait
          :img-url="require('@img/c2c/merchant/ordinary-business-wait.png')"
          size="80"
        />
        <p>
          您的申请正在审核中
          <br />请耐心等待并留意手机短信结果通知
        </p>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';

@Component({
  components: {
    iconPortrait,
    appBar
  }
})
export default class BusinessAwait extends Vue {
}
</script>

<style lang='scss'>
.ordinary-business-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.ordinary-business {
  display: flex;
  flex-direction: column;
  background: var(--default-bg);
  flex: 1;
  .ordinary-business-wait {
    height: 100%;
    padding-top: 145px;
    display: flex;
    align-items: center;
    flex-direction: column;
    p {
      padding-top: 20px;
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      color: #27364a;
      line-height: 20px;
      @include dark {
        color: var(--new-theme-color-6);
      }
    }
  }
  .portrait {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
