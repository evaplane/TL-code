<template>
  <div class="payment-management-box">
    <div class="payment-management-header">
      <slot name="header">
        <label>__('我的收支方式管理')</label>
        <div class="payment-btn">
          <button @click="managementClickHandle">__('管理')</button>
        </div>
      </slot>
    </div>
    <native-scroll class="payment-management-content">
      <div
        :key="account.accountId"
        @click="accountClickHandle(account)"
        class="card"
        v-for="account in accountList"
        v-hover:hover-active-list
      >
        <i :class="[getAccountIconClass(account)]" class="bank-icon"></i>
        <div>
          <h3
            class="bank-name"
            v-if="account.type !== 2 && account.type !== 3"
          >{{ account.bankName }}</h3>
          <h3 class="bank-name" v-if="account.type === 2">__('微信支付')</h3>
          <h3 class="bank-name" v-if="account.type === 3">__('支付宝')</h3>
          <span class="crad-number">{{ account.account }}</span>
        </div>
        <i :class="{ checked: isChecked(account) }" class="icon-check" v-if="multiSelect"></i>
      </div>
    </native-scroll>
    <div class="payment-management-footer">
      <div @click="footBtnClickHandle" class="payment-btn" v-hover:hover-active-list>
        <slot name="footer">{{ multiSelect ? `__('确定')` : `__('取消')` }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { IOtcAccountResponse } from '@/api/otc/account';
import nativeScroll from '@/components/common/native-scroll/index.vue';

@Component({
  components: {
    nativeScroll
  }
})
export default class PaymentManagement extends Vue {
  selectedAccounttList: IOtcAccountResponse[] = [];

  @Prop({ type: Boolean, default: false }) multiSelect!: boolean;
  @Prop({ type: Array, default: () => [] }) value!: IOtcAccountResponse[];
  @Prop({
    type: Array,
    default: () => []
  }) accountList!: IOtcAccountResponse[];

  @Emit('management')
  managementClickHandle() {
    this.$router.push({
      name: 'c2c-Payment'
    });
  }

  @Emit()
  footBtnClickHandle() {
    if (this.multiSelect) {
      this.input();
    }
  }

  @Emit()
  input() {
    return this.selectedAccounttList;
  }

  @Emit()
  accountClickHandle(account: IOtcAccountResponse) {
    if (this.multiSelect) {
      const index = this.findAccountInSelectIndex(account);
      if (index !== -1) {
        this.selectedAccounttList.splice(index, 1);
      } else {
        this.selectedAccounttList.push(account);
      }
    }
  }

  @Watch('value', { deep: true, immediate: true })
  valueChange(val: IOtcAccountResponse[]) {
    this.selectedAccounttList = val ? [...val] : [];
  }

  getAccountIconClass(account: IOtcAccountResponse) {
    const iconClassMap: IObj<string> = {
      1: 'card',
      2: 'wechat',
      3: 'alipay',
      4: 'paypal',
      5: 'western-union',
      6: 'swift'
    };
    return iconClassMap[account.type] || 'card';
  }

  getSelectedAccount(): IOtcAccountResponse[] {
    return this.selectedAccounttList;
  }

  findAccountInSelectIndex(account: IOtcAccountResponse): number {
    return this.selectedAccounttList.findIndex(item => { return item.accountId === account.accountId; });
  }

  isChecked(account: IOtcAccountResponse): boolean {
    return this.findAccountInSelectIndex(account) !== -1;
  }
}
</script>

<style lang="scss">
.payment-management-box {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  padding: 0 var(--padding-lr);
  background-color: var(--default-bg);

  .payment-management-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    padding-top: 35px;
    border-bottom: 1px solid var(--border-color);
    label {
      padding: 10px 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--new-theme-color-3);
    }
    .payment-btn button {
      position: relative;
      border: none;
      width: 82px;
      height: 30px;
      line-height: 1;
      color: #fff;
      border-radius: 16px;
      font-size: 12px;
      background: linear-gradient(
        225deg,
        rgba(255, 85, 116, 1) 0%,
        rgba(186, 32, 60, 1) 100%
      );
      &::before{
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
      &:active::before{
        opacity: .1;
      }
    }
  }

  .payment-management-content {
    flex: 1;
    // position: relative;
    // height: 38vh;
  }
  .card {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding: 15px;
    height: 65px;
    .bank-icon {
      display: block;
      width: 34px;
      height: 34px;
      margin-right: 20px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      &.card {
        background-image: url('~@img/c2c/zbicon-card.svg');
      }
      &.wechat {
        background-image: url('~@img/c2c/zbicon-wechat.svg');
      }
      &.alipay {
        background-image: url('~@img/c2c/zbicon-alipay.svg');
      }
      &.paypal {
        background-image: url('~@img/c2c/icon-paypal.png');
      }
      &.western-union {
        background-image: url('~@img/c2c/icon-western-union.png');
      }
      &.swift {
        background-image: url('~@img/c2c/icon-swift.png');
      }
    }
    .bank-name {
      padding: 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--new-theme-color-6);
    }
    .card-number {
      font-size: 12px;
      color: var(--new-theme-color-c);
    }
  }
  .icon-check {
    position: relative;
    display: block;
    width: 30px;
    height: 30px;
    margin-left: auto;
    margin-right: 5px;
    border-radius: 50%;
    border: 3px solid var(--new-theme-color-6); /* no */
    &::before,
    &::after {
      position: absolute;
      display: block;
      content: '';
      background-color: var(--default-bg);
      transition: all 0.2s;
      opacity: 0;
    }
    &::before {
      top: -6px;
      right: 4px;
      width: 10px;
      height: 24px;
      transform: rotate(-135deg) translate(200%, 18%);
      border-top: 3px solid var(--new-theme-color-6);
    }
    &::after {
      top: 2px;
      right: 2px;
      width: 8px;
      height: 20px;
      transform: rotate(45deg) translate(0%, -100%);
      border-left: 3px solid var(--new-theme-color-6);
    }
    &.checked {
      &::before {
        opacity: 1;
        transform: rotate(-135deg);
      }
      &::after {
        opacity: 1;
        transform: rotate(45deg);
      }
    }
  }
  .payment-management-footer {
    margin: 0 -15px;
    border-top: 2px solid var(--border-color); /* no */
    .payment-btn {
      padding: 23px 0 28px;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: var(--theme-color);
    }
  }
}
</style>
