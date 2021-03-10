<template>
  <div class="transfer-confirm">
    <transition name="popup-bottom">
      <div class="popup-bottom" v-if="visible" v-loading="loading">
        <span class="popup-close" @click="close"></span>
        <div class="popup-transfer">
          <div class="popup-transfer-head">
            <slot name="title">__('站内划转')</slot>
          </div>

          <div class="popup-transfer-content">
            <div class="card-wrap">
              <div class="card card-form">
                <p>{{ fromLabel }}</p>
                __('账户')
              </div>
              <div class="arrow">
                <span></span>
                <span></span>
              </div>
              <div class="card card-to">
                <p>{{ toLabel }}</p>
                __('账户')
              </div>
            </div>

            <div>
              <div class="label">__('转账金额')</div>
              <p class="amount">{{ amount }}</p>
            </div>
          </div>
          <div class="btn">
            <button @click="confirmClickHanlde" :disabled="loading">__('确认')</button>
          </div>
        </div>
      </div>
    </transition>
    <transition name="overlay">
      <div class="m-overlay" v-if="visible"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Emit, Mixins, Watch } from 'vue-property-decorator';
import mixinsAccountCommomData, { IActions } from '@/mixins/assets/account-common-data';
import { doMortgageTransferIn, doMortgageTransferOut, IMortgageTransferParams } from '@/api/mortgage';

import { fundTransferOuter, fundTransferInFromOuter, IFundTransferParams } from '@/api/activity';
import { IDoTransferParamsTypes, doTransferInLever, doTransferOutLever } from '@/api/lever';

@Component
export default class TransfterConfirm extends Mixins(mixinsAccountCommomData) {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  // 转出账户
  @Prop({ type: Object, default: null }) from!: IActions;
  // 转入账户
  @Prop({ type: Object, default: null }) to!: IActions;
  // 金额
  @Prop({ type: String, default: '0' }) amount!: string;

  // 从基本账户 转入其他账户对应的方法
  transferInFunMap: IObj<Function> = {
    mortgage: doMortgageTransferIn,
    lever: doTransferInLever,
    activity: fundTransferOuter
  };
  // 从 其他账户 转出对应的方法
  transferOutFunMap: IObj<Function> = {
    mortgage: doMortgageTransferOut,
    lever: doTransferOutLever,
    activity: fundTransferInFromOuter
  };

  transferFun: Function | null = null;
  transferParams: IDoTransferParamsTypes | IMortgageTransferParams | IFundTransferParams | null = null;
  loading: boolean = false;

  get fromLabel() {
    return this.from && this.mixinsAccountLabelMap[this.from.value];
  }
  get toLabel() {
    return this.to && this.mixinsAccountLabelMap[this.to.value];
  }
  // 获取非基本账户的 value
  get otherAccountValue() {
    return this.from.value === 'basic' ? this.to.value : this.from.value;
  }

  /** 当前币种的名称 */
  get coinName() {
    const coinName = this.$route.query.coin + '' || '';
    return coinName.toLowerCase();
  }

  @Watch('visible', { immediate: true })
  visibleWatcher(visible: boolean) {
    if (visible) {
      this.setFunAndParams();
    }
  }

  @Emit('update:visible')
  close() {
    return false;
  }

  @Emit()
  done() {
    this.close();
  }

  async confirmClickHanlde() {
    if (!this.transferFun || !this.transferParams) {
      // 方法或者参数为空时，无法调接口
      return;
    }
    try {
      this.loading = true;
      await this.transferFun(this.transferParams);
      this.$message.success('__("划转成功")');
      this.done();
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }

  setFunAndParams() {
    // form 为 basic 从 基本账户 转入 其他账户; 否则 从 其他账户 转出到 基本账户
    const transferFunMap = this.from.value === 'basic' ? this.transferInFunMap : this.transferOutFunMap;
    this.transferFun = transferFunMap[this.otherAccountValue] || null;
    this.transferParams = null;

    if (this.otherAccountValue === 'mortgage' && this.mixinsMortgageCoin) {
      this.transferParams = {
        fundsType: this.mixinsMortgageCoin.fundsType,
        amount: this.amount
      };
    } else if (this.otherAccountValue === 'activity' && this.mixinsActivityCoin) {
      this.transferParams = {
        coinName: this.coinName,
        amount: this.amount
      };
    } else if (this.otherAccountValue === 'lever' && this.mixinsLeverCoin) {
      this.transferParams = {
        coin: this.coinName,
        marketName: this.mixinsLeverCoin.key,
        amount: this.amount
      };
    }
  }
}
</script>

<style lang="scss">
.transfer-confirm {
  .popup-bottom-enter,
  .popup-bottom-leave-active {
    transform: translateY(100%);
    visibility: hidden;
  }
  .popup-bottom-enter-active,
  .popup-bottom-leave-active {
    transition: all 0.3s;
  }

  .popup-bottom {
    position: fixed;
    z-index: 2001;
    left: 0;
    bottom: 0;
    right: 0;
    background: #f6f6fd;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);

    .return-btn {
      width: 15px;
      height: 15px;
      border-top: 2px solid #313038;
      /* no */
      border-left: 2px solid #313038;
      /* no */
      transform: rotate(-45deg);
    }
  }
  .popup-close {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #000;
    width: 25px;
    height: 25px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 1px;
      /* no */
      background-color: #000;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }

  .popup-transfer {
    padding: 35px 0;
    .popup-transfer-head {
      padding: 0 25px;
      font-size: 16px;
      color: #000;
      @include bold;
    }
    .popup-transfer-content {
      padding: 25px;
    }
    .card-wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 35px;
    }
    .arrow {
      flex: none;
      display: flex;
      align-items: center;
      margin: 0 10px;

      span:first-of-type {
        height: 4px;
        background-color: var(--primary-color);
        width: 10px;
      }

      span:last-of-type {
        width: 0;
        height: 0;
        border-top: 6px solid transparent;
        border-bottom: 6px solid transparent;
        border-left: 10px solid var(--primary-color);
      }
    }
    .card {
      flex: none;
      padding: 15px 0 15px 20px;
      width: 130px;
      font-size: 14px;
      background-color: #fff;
      border: 1px solid rgba(112, 94, 94, 0.1); /* no */
      border-radius: 4px; /* no */
      color: #6b707b;
      p {
        font-size: 18px;
        @include bold;
        margin-bottom: 5px;
        color: #313038;
      }
    }

    .label {
      margin-bottom: 10px;
      font-size: 14px;
      color: #5f5f5f;
    }
    .amount {
      font-size: 22px;
      color: #000;
      @include bold;
    }

    .btn {
      padding: 0 25px;
      button {
        position: relative;
        width: 100%;
        height: 44px;
        font-size: 16px;
        border-radius: 2px;
        border: none;
        color: #fff;
        background-color: var(--primary-color);
        @include bold;
        &::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          background-color: #000;
          border: inherit;
          border-color: #000;
          border-radius: inherit;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          opacity: 0;
          content: ' ';
        }
        &:active::before {
          opacity: 0.1;
        }
      }
    }
  }
}
</style>
