<template>
  <div class="button-list-wrap">
    <div :class="`pt${topSize}`">
      <div class="button-list">
        <div>
          <span class="left-Style">{{leftText}}</span>
        </div>
        <div class="right-Style-wrap">
          <span class="right-Style">{{rightText}}</span>
          <div v-if="isJump == 'false'">
            <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22" />
          </div>
        </div>
      </div>
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

export default class ButtonList extends Vue {
  @Prop({ type: String, default: '' }) leftText!: string;
  @Prop({ type: String, default: '' }) rightText!: string;
  @Prop({ type: String, default: '' }) topSize!: string;
  @Prop({ type: String, default: false }) isJump!: string;
}
</script>

<style lang='scss'>
.button-list-wrap {
  margin-left: 15px;
  margin-right: 15px;
  .button-list {
    width: 345px;
    height: 55px;
    padding-left: 24px;
    padding-right: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f7f8fe;
    border-radius: 28px;
    @include dark {
      background: var(--new-theme-color-c);
    }
  }
  .left-Style {
    font-size: 15px;
    font-weight: 500;
    line-height: 21px;
    color: var(--new-theme-color-3);
  }
  .right-Style-wrap {
    display: flex;
    flex-direction: row;
    align-items: center;
    .right-Style {
      font-size: 15px;
      font-weight: 500;
      color: var(--new-theme-color-6);
    }
  }
  .pt20 {
    padding-top: 20px;
  }
}
</style>
