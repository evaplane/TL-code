<template>
  <div class="add-paypal-card">
    <app-bar title="Paypal" />
    <div class="top-content">
      <!--<div class="user-name">-->
      <!--<span>{{userInfo.realName}}</span>-->
      <!--</div>-->
      <div class="input-border">
        <input
          :disabled="!isModification"
          :placeholder="isModification ? '请输入真实姓名' : userInfo.realName"
          autocomplete="off"
          class="input-paypal-card"
          type="text"
          v-model="payPalCardParams.realName"
        />
      </div>
      <div class="input-border">
        <input
          :disabled="!isModification"
          :placeholder="isModification ? '请输入Paypal账号' : payPalCardInfo.account "
          autocomplete="off"
          class="input-paypal-card"
          type="text"
          v-model="payPalCardParams.account"
        />
      </div>
    </div>
    <div class="bottom-content">
      <merchant-list-switch
        :switch-value="switchReceiveValue"
        @change-switch="getMoneyBool"
        leftText="用于收款"
        size="small"
      />
      <merchant-list-switch
        :switch-value="switchPaymentValue"
        @change-switch="payMoneyBool"
        leftText="用于付款"
        size="small"
      />
    </div>
    <otc-button
      :button-type="isModification ? 'bigConfirm' : 'bigCancel'"
      @click.native="submitButton"
      :text="isModification ? '保存' : '删除'"
    />
    <help-dialog
      :visible.sync="cancelBankVisible"
      @confirm="delAppCardHandle"
      cancel-button-text="__('返回')"
      confirm-button-text="确认"
      message="是否确认删除该银行卡"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import { State } from 'vuex-class';
// component
import appBar from '@/components/c2c/app-bar.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import merchantListSwitch from '@/components/c2c/list-switch.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';
// api
import { reqAddAccount, IAccountUpdateParams, reqUpdateBank, reqDeleteBank, reqGetByAccountId, IAccountResponse, TPayStatus } from '@/api/otc/bank';
// store
import { IUser } from '@/store/modules/user.ts';
// mixins
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

@Component({
  components: {
    appBar,
    iconPortrait,
    merchantListSwitch,
    helpDialog,
    otcButton
  }
})
export default class AddUsdCard extends Mixins(mixinsOtcGetUserToken) {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  switchPaymentValue: TPayStatus = 0;
  switchReceiveValue: TPayStatus = 0;

  isModification: boolean = true; // 内容是否可修改
  cancelBankVisible: boolean = false; // 删除确认弹窗

  payPalCardInfo: object = {}; // 根据id查询用户的账户信息

  payPalCardParams = {
    realName: '',
    type: 4,
    account: '', // PayPal账户
    receive: 0,
    payment: 0
  };

  payPalChangeParams: IAccountUpdateParams = { // 修改参数
    accountId: '', // 账号id
    receive: 0,
    payment: 0,
    deleted: false
  };

  async mounted() {
    if (this.$route.params.idCard !== 'no') {
      this.isModification = false;
      // 不可修改内容初始化
      const res: IAccountResponse = await reqGetByAccountId(this.$route.params.idCard, true);
      this.payPalCardInfo = Object.assign({}, res);
      this.switchPaymentValue = res.payment;
      this.switchReceiveValue = res.receive;
      // 修改收付款参数
      this.payPalChangeParams.accountId = this.$route.params.idCard;
      this.payPalChangeParams.payment = res.payment;
      this.payPalChangeParams.receive = res.receive;
    }
  }

  async submitButton() {
    if (this.isModification) {
      if (this.isVerification()) {
        await reqAddAccount(this.payPalCardParams, true);
        this.$message.success('保存成功');
        this.$router.go(-2);
      }
    } else {
      this.cancelBankVisible = true;
    }
  }

  async delAppCardHandle() {
    try {
      await reqDeleteBank(this.$route.params.idCard, true);
      this.$message.success('删除成功');
      this.$router.go(-1);
    } catch (e) {
      this.$message.fail(e.resMsg.message);
    }
  }

  // 收款
  async getMoneyBool() {
    let valueSwitch: TPayStatus = this.switchReceiveValue === 1 ? 0 : 1;
    if (this.isModification) {
      this.switchReceiveValue = valueSwitch;
      this.payPalChangeParams.receive = valueSwitch;
    } else {
      try {
        this.payPalChangeParams.receive = valueSwitch;
        await reqUpdateBank(this.payPalChangeParams);
        this.switchReceiveValue = valueSwitch;
      } catch (e) {
        this.$message.fail(e.resMsg.message);
      }
    }
  }

  // 付款
  async payMoneyBool() {
    let valueSwitch: TPayStatus = this.switchPaymentValue === 1 ? 0 : 1;
    if (this.isModification) {
      this.switchPaymentValue = valueSwitch;
      this.payPalChangeParams.payment = valueSwitch;
    } else {
      try {
        this.payPalChangeParams.payment = valueSwitch;
        await reqUpdateBank(this.payPalChangeParams);
        this.switchPaymentValue = valueSwitch;
      } catch (e) {
        this.$message.fail(e.resMsg.message);
      }
    }
  }

  isVerification(): boolean {
    if (this.payPalCardParams.account === '') {
      this.$message.warn('请输入Paypal账号');
      return false;
    }
    return true;
  }
}
</script>

<style lang='scss'>
.add-paypal-card {
  width: 100%;
  height: 100%;
  background: #f7f8fe;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 15px;
  font-weight: 500;
  color: #27364a;
  margin-top: 6px;

  @include dark {
    background: var(--default-bg);
  }

  .top-content {
    width: 100%;
    background: var(--default-bg);
  }

  .user-name {
    padding-top: 18px;
    padding-bottom: 16px;
    margin-left: 20px;
    border-bottom: 1px solid var(--border-color); /* no */
    @include light {
      color: var(--new-theme-color-3);
    }
    @include dark {
      color: var(--new-theme-color-3);
    }
  }

  input {
    @include light {
      color: var(--new-theme-color-3);
    }
    @include dark {
      color: var(--new-theme-color-3);
    }
  }

  .input-paypal-card {
    width: 100%;
    height: 50px;
    text-indent: 20px;
    background: var(--default-bg);
    border: none;
  }

  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    font-size: 15px;
    font-weight: 500;
    /*color: var(--gray-color);*/
    @include light {
      color: var(--new-theme-input);
    }
    @include dark {
      color: var(--new-theme-input);
    }
  }

  .middle-bottom-content {
    width: 100%;
    margin-top: 24px;
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    background: var(--default-bg);
    @include light {
      color: var(--new-theme-color-3);
    }
    @include dark {
      color: var(--new-theme-color-3);
    }
  }

  .input-border {
    padding-right: 20px;
    border-bottom: 1px solid var(--border-color); /* no */
  }

  .bottom-content {
    width: 100%;
    margin-top: 6px;
    margin-bottom: 40px;
  }
}
</style>
