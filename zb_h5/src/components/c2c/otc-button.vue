<template>
  <div class="otc-button-wrap">
    <div
      :class="[
        { 'is-disabled': buttonType.indexOf('Cancel') !== -1 && !isDisabled },
        { 'wave otc-button': !isDisabled },
        buttonTypeClass[buttonType]
      ]"
    >
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {}
})
export default class OtcButton extends Vue {
  @Prop({ type: String, default: 'bigConfirm' }) buttonType!: string;
  @Prop({ type: String, default: '' }) text!: string;
  @Prop({ type: Boolean, default: false }) isDisabled!: boolean;

  buttonTypeClass: IObj<string> = {
    bigConfirm: 'otc-button-big-confirm',
    bigCancel: 'otc-button-big-cancel',
    middleConfirm: 'otc-button-middle-confirm',
    middleCancel: 'otc-button-middle-cancel',
    smallConfirm: 'otc-button-small-confirm',
    smallCancel: 'otc-button-small-cancel'
  };
}
</script>

<style lang="scss">
.otc-button-wrap {
  .otc-button-big-confirm {
    position: relative;
    width: 345px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 23px;
    background: #e91c41;
    color: white;
    font-size: 17px;
  }
  .otc-button-big-cancel {
    position: relative;
    width: 345px;
    height: 45px;
    line-height: 45px;
    border: 1px solid #4caf50;
    text-align: center;
    border-radius: 23px;
    background: transparent;
    color: #4caf50;
    font-size: 17px;
  }
  .otc-button-middle-confirm {
    width: 220px;
    height: 50px;
    background: #e91c41;
    border-radius: 100px;
    color: white;
    text-align: center;
    line-height: 50px;
    font-size: 17px;
  }
  .otc-button-middle-cancel {
    width: 220px;
    height: 50px;
    background: rgba(241, 242, 245, 0);
    border-radius: 100px;
    border: 1px solid rgba(76, 175, 80, 0.2);
    color: rgba(76, 175, 80, 0.5);
    text-align: center;
    line-height: 50px;
    font-size: 17px;
  }
  .otc-button-small-confirm {
    width: 105px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #e91c41;
    color: white;
    border-radius: 100px;
    font-size: 17px;
  }
  .otc-button-small-cancel {
    width: 105px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: transparent;
    border: 1px solid #4caf50;
    color: #4caf50;
    border-radius: 100px;
    font-size: 17px;
  }
  .otc-button:active {
    top: 1px;
  }
  .wave {
    position: relative;
    overflow: hidden;
  }
  .wave:after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.3s, opacity 0.5s;
  }
  .wave:active:after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }
  .is-disabled {
    border: 1px solid #4caf50;
    color: #4caf50;
  }
}
</style>
