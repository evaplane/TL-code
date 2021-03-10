<template>
  <div>
    <van-dialog
      class="help-dialog"
      getContainer="body"
      show-cancel-button
      v-model="proxyVisible"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div class="help-icon">
        <slot name="icon">
          <img src="@img/c2c/zbicon-help.svg" />
        </slot>
      </div>
      <slot name="message">
        <div class="message">
          {{ message }}
        </div>
      </slot>
    </van-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Dialog } from 'vant';
@Component({
  components: {
    [Dialog.Component.name]: Dialog.Component
  }
})
export default class HelpDialog extends Vue {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ type: String, default: '' }) message!: string;
  get proxyVisible() {
    return this.visible;
  }
  set proxyVisible(val: boolean) {
    if (val === false) {
      this.close();
    }
  }
  @Emit('update:visible')
  close() {
    return false;
  }
}
</script>

<style lang='scss'>
.help-dialog {
  color: var(--theme-color);
  .van-button {
    background: var(--default-bg);
  }
  .help-icon {
    text-align: center;
    padding-top: 20px;
  }
  .van-dialog__cancel {
    color: var(--theme-color);
  }
  .message {
    max-height: 60vh;
    padding: 10px 25px;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
  }
}
</style>
