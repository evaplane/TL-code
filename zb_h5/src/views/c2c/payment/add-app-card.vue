<template>
  <div class="add-app-card">
    <app-bar :title="titleType[$route.params.title].value" />
    <div class="top-content">
      <!--<div class="user-name">-->
      <!--<span>{{userInfo.realName}}</span>-->
      <!--</div>-->
      <div class="input-border">
        <input
          :disabled="!isModification"
          :placeholder="isModification ? '请输入真实姓名' : userInfo.realName"
          autocomplete="off"
          class="input-bank-card-number"
          type="text"
          v-model="accountRealName"
        />
      </div>
      <div class="input-border">
        <input
          :disabled="!isModification"
          :placeholder="isModification ? '请输入账号' : appCardInfo.account"
          autocomplete="off"
          class="input-bank-card-number"
          type="text"
          v-model="appCardParams.account"
        />
      </div>
    </div>
    <div class="bottom-content">
      <merchant-list-switch :switch-value="switchReceiveValue" @change-switch="getMoneyBool" leftText="用于收款" size="small" />
      <merchant-list-switch :switch-value="switchPaymentValue" @change-switch="payMoneyBool" leftText="用于付款" size="small" />
    </div>
    <native-scroll class="add-app-card-scroll">
      <div class="pay-img-wrap">
        <van-uploader :after-read="setUserAvatar" class="add-pay-img" v-if="isModification">
          <div class="add-pay-img" v-if="isShow">
            <icon-portrait :img-url="require('@img/c2c/payment/add-pay-img.png')" size="80" />
            <p>上传收款二维码</p>
          </div>
          <div class="add-pay-img" v-else>
            <img :src="userAvatar" class="show-img" />
          </div>
        </van-uploader>
        <div class="no-change-img" v-if="!isModification">
          <img :src="userAvatar" class="show-img" />
        </div>
      </div>
      <otc-button
        :button-type="isModification ? 'bigConfirm' : 'bigCancel'"
        @click.native="submitButton"
        :text="isModification ? '保存' : '删除'"
      />
    </native-scroll>
    <help-dialog
      :visible.sync="cancelBankVisible"
      @confirm="delAppCardHandle"
      cancel-button-text="再考虑下"
      confirm-button-text="确认删除"
      message="是否删除当前收付款方式？"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { State } from 'vuex-class';
// component
import { Uploader } from 'vant';
import appBar from '@/components/c2c/app-bar.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import merchantListSwitch from '@/components/c2c/list-switch.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';

// api
import {
  reqAddAccount,
  reqUpdateBank,
  reqGetByAccountId,
  reqDeleteBank,
  IAccountResponse,
  IAccountUpdateParams,
  TPayStatus
} from '@/api/otc/bank';
// store
import { IUser } from '@/store/modules/user.ts';
// mixins
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

Vue.use(Uploader);

interface ITitleTypeItem {
  value: string;
  key: number;
}

interface ITitleType {
  alipay: ITitleTypeItem;
  wechat: ITitleTypeItem;
}

@Component({
  components: {
    appBar,
    iconPortrait,
    merchantListSwitch,
    helpDialog,
    otcButton
  }
})
export default class AddAppCard extends Mixins(mixinsOtcGetUserToken) {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;

  isModification: boolean = true; // 内容是否可修改
  switchPaymentValue: TPayStatus = 0;
  switchReceiveValue: TPayStatus = 0;

  cancelBankVisible: boolean = false; // 删除确认弹窗
  appCardInfo: object = {}; // 根据id查询用户的账户信息

  appCardParams: any = {
    realName: '',
    type: 1,
    account: '',
    receive: 0,
    payment: 0,
    file0: ''
  };

  changeParams: IAccountUpdateParams = {
    // 修改参数
    accountId: '', // 账号id
    receive: 0,
    payment: 0,
    deleted: false
  };

  titleType: ITitleType = {
    alipay: {
      value: '支付宝',
      key: 3
    },
    wechat: {
      value: '微信支付',
      key: 2
    }
  };

  isShow: boolean = true;
  userAvatar: string = '';

  accountRealName: string = '';

  urlFile: any = '';

  async mounted() {
    if (this.$route.params.idCard !== 'no') {
      this.isModification = false;
      // 不可修改内容初始化
      const res: IAccountResponse = await reqGetByAccountId(this.$route.params.idCard, true);
      this.appCardInfo = Object.assign({}, res);
      this.switchPaymentValue = res.payment;
      this.switchReceiveValue = res.receive;
      this.userAvatar = res.payQrUrl;
      // 修改收付款参数
      this.changeParams.accountId = this.$route.params.idCard;
      this.changeParams.payment = res.payment;
      this.changeParams.receive = res.receive;
    }
  }

  setUserAvatar(file: any) {
    this.userAvatar = file.content;
    this.urlFile = file;
    this.isShow = false;
  }

  // 收款
  async getMoneyBool() {
    let valueSwitch: TPayStatus = this.switchReceiveValue === 1 ? 0 : 1;
    if (this.isModification) {
      this.switchReceiveValue = valueSwitch;
      this.appCardParams.receive = valueSwitch;
    } else {
      try {
        this.changeParams.receive = valueSwitch;
        await reqUpdateBank(this.changeParams);
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
      this.appCardParams.payment = valueSwitch;
    } else {
      try {
        this.changeParams.payment = valueSwitch;
        await reqUpdateBank(this.changeParams);
        this.switchPaymentValue = valueSwitch;
      } catch (e) {
        this.$message.fail(e.resMsg.message);
      }
    }
  }

  async submitButton() {
    // this.appCardParams.realName = this.userInfo.realName;
    if (this.isModification) {
      this.appCardParams.realName = this.accountRealName;
      this.appCardParams.type = this.titleType[this.$route.params.title as keyof ITitleType].key;
      this.appCardParams.file0 = this.urlFile.file;
      if (this.isVerification()) {
        let param = new FormData();
        param.append('realName', this.accountRealName);
        param.append('account', this.appCardParams.account);
        param.append('type', `${this.appCardParams.type}`);
        param.append('file0', this.urlFile.file);
        param.append('receive', `${this.appCardParams.receive}`);
        param.append('payment', `${this.appCardParams.payment}`);
        await reqAddAccount(param);
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

  isVerification(): boolean {
    if (this.appCardParams.account === '') {
      this.$message.fail('请输入账号');
      return false;
    }
    return true;
  }
}
</script>

<style lang='scss'>
.add-app-card {
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

  .input-bank-card-number {
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
  .add-app-card-scroll {
    padding-bottom: 33px;
    flex: 1;
    flex-direction: column;
    display: flex;
    align-items: center;
  }
  .input-border {
    padding-right: 20px;
    border-bottom: 1px solid var(--border-color); /* no */
  }

  .bottom-content {
    width: 100%;
    margin-top: 6px;
  }

  .baseBtn {
    margin-bottom: 33px;
    width: 345px;
    height: 45px;
    line-height: 45px;
    font-size: 17px;
    font-weight: 600;
  }
  .pay-img-wrap {
    padding: 15px 0;
    display: flex;
    flex: 1;
    align-items: center;
  }

  .add-pay-img {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      padding-top: 13px;
      font-size: 11px;
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
  }
  .no-change-img {
    width: 214px;
  }

  .show-img {
    width: 214px;
  }
}
</style>
