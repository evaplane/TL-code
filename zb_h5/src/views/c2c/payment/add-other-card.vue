<template>
  <div class="add-other-card">
    <app-bar :title="titleType[$route.params.title]" />
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
          v-model="otherCardParams.realName"
        />
      </div>
      <div class="input-border">
        <textarea
          :disabled="!isModification"
          @keydown="checkValid"
          class="text-area"
          cols="30"
          placeholder="填写汇款信息"
          rows="5"
          v-model="otherCardParams.note"
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
import {
  reqAddAccount,
  IAccountUpdateParams,
  reqUpdateBank,
  reqDeleteBank,
  reqGetByAccountId,
  IAccountResponse,
  TPayStatus,
  IAddAccountParams
} from '@/api/otc/bank';
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

  otherCardInfo: object = {}; // 根据id查询用户的账户信息

  otherCardParams: IAddAccountParams = {
    realName: '',
    type: 5,
    note: '', // 填写备注信息
    receive: 0,
    payment: 0
  };

  otherChangeParams: IAccountUpdateParams = { // 修改参数
    accountId: '', // 账号id
    receive: 0,
    payment: 0,
    deleted: false
  };

  titleType: IObj<string> = {
    west: '西联汇款',
    swift: '国际Swift转账'
  };

  async mounted() {
    if (this.$route.params.idCard !== 'no') {
      this.isModification = false;
      // 不可修改内容初始化
      const res: IAccountResponse = await reqGetByAccountId(this.$route.params.idCard, true);
      this.otherCardInfo = Object.assign({}, res);
      this.switchPaymentValue = res.payment;
      this.switchReceiveValue = res.receive;
      this.otherCardParams.note = res.note;
      // 修改收付款参数
      this.otherChangeParams.accountId = this.$route.params.idCard;
      this.otherChangeParams.payment = res.payment;
      this.otherChangeParams.receive = res.receive;
    }
  }

  async submitButton() {
    if (this.isModification) {
      if (this.isVerification()) {
        this.otherCardParams.type = this.$route.params.title === 'west' ? 5 : 6;
        await reqAddAccount(this.otherCardParams, true);
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
      this.otherChangeParams.receive = valueSwitch;
    } else {
      try {
        this.otherChangeParams.receive = valueSwitch;
        await reqUpdateBank(this.otherChangeParams);
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
      this.otherChangeParams.payment = valueSwitch;
    } else {
      try {
        this.otherChangeParams.payment = valueSwitch;
        await reqUpdateBank(this.otherChangeParams);
        this.switchPaymentValue = valueSwitch;
      } catch (e) {
        this.$message.fail(e.resMsg.message);
      }
    }
  }

  checkValid() {
    if (this.otherCardParams.note && this.otherCardParams.note.length > 400) {
      this.otherCardParams.note = this.otherCardParams.note.substring(0, 399);
    }
  }

  isVerification(): boolean {
    if (this.otherCardParams.note === '') {
      this.$message.warn('请填写汇款信息');
      return false;
    }
    return true;
  }
}
</script>

<style lang='scss'>
.add-other-card {
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
  .text-area {
    width: 100%;
    border: none;
    padding-left: 20px;
    padding-top: 18px;
  }
  .text-area:disabled {
    background: transparent;
    color: #d4d4d4;
  }
}
</style>
