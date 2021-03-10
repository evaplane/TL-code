<template>
  <nativeScroll class="add-bank-card-wrap">
    <div class="add-bank-card" v-show="!isShowSelectBank">
      <app-bar title="银行卡" />
      <div class="top-content">
        <!--<div class="user-name">-->
          <!--<span>{{userInfo.realName}}</span>-->
        <!--</div>-->
        <div class="input-border">
          <input
            :disabled="!isModification"
            :placeholder="isModification ? '请输入真实姓名' : userInfo.realName"
            autocomplete="off"
            class="input-bank-card"
            type="text"
            v-model="bankCardParams.realName"
          />
        </div>
        <div @click="openSelectBank" class="select-bank">
          <span>{{bankCardParams.bankName === '' ? '选择银行' : bankCardParams.bankName}}</span>
          <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22" />
        </div>
      </div>
      <div class="middle-top-content">
        <div class="input-border">
          <input
            :disabled="!isModification"
            :placeholder="isModification ? '请输入银行卡号' : bankCardInfo.account "
            autocomplete="off"
            class="input-bank-card"
            type="number"
            v-model="bankCardParams.account"
          />
        </div>
        <div class="input-border">
          <input
            :disabled="!isModification"
            :placeholder="isModification ? '请输入银行卡号' : bankCardInfo.account "
            autocomplete="off"
            class="input-bank-card"
            type="number"
            v-model="againAccountInput"
          />
        </div>
      </div>
      <div class="middle-bottom-content">
        <div @click="showPop" class="select-address">
          <span>{{openAccountAddress === '' ? '开户地址' : openAccountAddress}}</span>
          <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22" />
        </div>
        <div class="input-border">
          <input
            :disabled="!isModification"
            autocomplete="off"
            class="input-bank-card"
            placeholder="开户支行：如上海虹桥支行"
            type="text"
            v-model="bankCardParams.subBranch"
          />
        </div>
      </div>
      <div class="bottom-content">
        <merchant-list-switch
          :switch-value="bankCardParams.receive"
          @change-switch="getMoneyBool"
          leftText="用于收款"
          size="small"
        />
        <merchant-list-switch
          :switch-value="bankCardParams.payment"
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
      <orderPopup :is-show-order-detail="areaListShow" @close-Windows="areaListShow = false">
        <van-area
          :area-list="areaList"
          :columns-num="2"
          @cancel="cancelSub"
          @confirm="selectArea"
          value="150000"
        />
      </orderPopup>
    </div>
    <select-bank @select-bank="selectBank" v-show="isShowSelectBank" />
    <help-dialog
      :visible.sync="cancelBankVisible"
      @confirm="delBankHandle"
      cancel-button-text="__('返回')"
      confirm-button-text="确认"
      message="是否确认删除该银行卡"
    />
  </nativeScroll>
</template>

<script lang='ts'>
import { Component, Vue, Mixins } from 'vue-property-decorator';
// component
import { State } from 'vuex-class';
import { Area } from 'vant';
import appBar from '@/components/c2c/app-bar.vue';
import otcButton from '@/components/c2c/otc-button.vue';
import selectBank from '@/components/c2c/select-bank.vue';
import orderPopup from '@/components/c2c/order-popup.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';
import merchantListSwitch from '@/components/c2c/list-switch.vue';
// api
import { reqAddAccount, reqGetByAccountId, reqDeleteBank, reqUpdateBank, IAccountResponse, IAccountUpdateParams, TPayStatus, IAddAccountParams } from '@/api/otc/bank';
// store
import { IUser } from '@/store/modules/user.ts';
// mixins
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

Vue.use(Area);

interface IArea {
  name: string;
  code: string;
}

interface IAreaJson {
  default: {
    province_list: IObj<string>;
    city_list: IObj<string>;
    county_list: IObj<string>;
  };
}

@Component({
  components: {
    appBar,
    iconPortrait,
    merchantListSwitch,
    selectBank,
    helpDialog,
    orderPopup,
    otcButton
  }
})

export default class AddBankCard extends Mixins(mixinsOtcGetUserToken) {
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;

  isModification: boolean = true; // 内容是否可修改
  isShowSelectBank: boolean = false; // 是否打开选择银行
  bankCardInfo: object = {}; // 根据id查询用户的账户信息
  cancelBankVisible: boolean = false; // 删除确认弹窗

  bankCardParams: IAddAccountParams = { // 提交参数
    realName: '',
    type: 1,
    account: '', // 银行卡号/账号/账户
    bankName: '',
    subBranch: '',
    receive: 0,
    payment: 0,
    provinceCode: 1300,
    cityCode: 200
  };

  changeParams: IAccountUpdateParams = { // 修改参数
    accountId: '', // 账号id
    receive: 0,
    payment: 0,
    deleted: false
  };

  openAccountAddress: string = ''; // 开户地址
  againAccountInput: string = ''; // 再次输入卡号

  areaList: object = {}; // 城市json
  areaListShow: boolean = false; // 城市show

  async mounted() {
    if (this.$route.params.idCard !== 'no') {
      const area: IAreaJson = await import('@/config/area');
      const res: IAccountResponse = await reqGetByAccountId(this.$route.params.idCard, true);
      // 不可修改内容初始化
      this.bankCardInfo = Object.assign({}, res);
      this.bankCardParams.bankName = res.bankName;
      this.bankCardParams.subBranch = res.subBranch;
      this.isModification = false;
      const province = area.default.province_list[`${res.provinceCode}`];
      const cityCode = area.default.city_list[res.cityCode];
      this.openAccountAddress = `${province} ${cityCode}`;
      this.bankCardParams.payment = res.payment;
      this.bankCardParams.receive = res.receive;
      // 修改收付款参数
      this.changeParams.accountId = this.$route.params.idCard;
      this.changeParams.payment = res.payment;
      this.changeParams.receive = res.receive;
    }
  }

  // 选择银行
  selectBank(value: string) {
    this.isShowSelectBank = false;
    if (value) {
      this.bankCardParams.bankName = value;
    }
  }

  // 打开选择银行
  openSelectBank() {
    if (this.$route.params.idCard !== 'no') return;
    this.isShowSelectBank = true;
  }

  async submitButton() {
    if (this.isModification) {
      this.bankCardParams.realName = this.bankCardParams.realName;
      // this.bankCardParams.realName = this.userInfo.realName;
      if (this.isVerification()) {
        await reqAddAccount(this.bankCardParams, true);
        this.$message.success('保存成功');
        this.$router.go(-2);
      }
    } else {
      this.cancelBankVisible = true;
    }
  }

  async delBankHandle() {
    try {
      await reqDeleteBank(this.$route.params.idCard, true);
      this.$message.success('删除成功');
      this.$router.go(-1);
    } catch (e) {
      this.$message.fail(e.resMsg.message);
    }
  }

  // 地区picker
  async showPop() {
    if (this.$route.params.idCard !== 'no') return;
    const area: IAreaJson = await import('@/config/area');
    this.areaList = area.default;
    this.areaListShow = true;
  }

  // 地区picker确认 设置区号
  selectArea(value: IArea[]) {
    this.bankCardParams.provinceCode = +value[0].code;
    this.bankCardParams.cityCode = +value[1].code;
    this.openAccountAddress = `${value[0].name} ${value[1].name}`;
    this.areaListShow = false;
  }

  // 地区picker取消
  cancelSub() {
    this.areaListShow = false;
  }

  // 收款
  async getMoneyBool() {
    let valueSwitch: TPayStatus = this.bankCardParams.receive === 1 ? 0 : 1;
    if (this.isModification) {
      this.bankCardParams.receive = valueSwitch;
    } else {
      try {
        this.changeParams.receive = valueSwitch;
        await reqUpdateBank(this.changeParams);
        this.bankCardParams.receive = valueSwitch;
      } catch (e) {
        this.$message.fail(e.resMsg.message);
      }
    }
  }

  // 付款
  async payMoneyBool() {
    let valueSwitch: TPayStatus = this.bankCardParams.payment === 1 ? 0 : 1;
    if (this.isModification) {
      this.bankCardParams.payment = valueSwitch;
    } else {
      try {
        this.changeParams.payment = valueSwitch;
        await reqUpdateBank(this.changeParams);
        this.bankCardParams.payment = valueSwitch;
      } catch (e) {
        this.$message.fail(e.resMsg.message);
      }
    }
  }

  isVerification(): boolean {
    if (this.bankCardParams.bankName === '') {
      this.$message.warn('请选择银行');
      return false;
    }
    if (this.bankCardParams.account === '') {
      this.$message.warn('请输入银行卡号');
      return false;
    }
    if (this.againAccountInput === '') {
      this.$message.warn('请再次输入银行卡号');
      return false;
    }
    if (this.openAccountAddress === '') {
      this.$message.warn('请输入开户地址');
      return false;
    }
    if (this.bankCardParams.subBranch === '') {
      this.$message.warn('请输入开户支行');
      return false;
    }
    if (this.bankCardParams.account !== this.againAccountInput) {
      this.$message.warn('银行卡号不一致');
      return false;
    }
    return true;
  }
}
</script>

<style lang='scss'>
.add-bank-card-wrap {
  .add-bank-card {
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
    border-top: 6px solid var(--border-color); /* no */

    @include dark {
      background: var(--default-bg);
    }
    .van-popup {
      border-radius: 10px 10px 0 0;
    }
    .van-area {
      width: 100%;
      height: 270px;
      background: rgba(255, 255, 255, 1);
    }
    .van-picker-column__item {
      color: #27364a;
    }

    .van-picker__cancel {
      padding-left: 24px;
      color: #5e6c80;
    }

    .van-picker__confirm {
      padding-left: 24px;
      color: #27364a;
    }
    input {
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
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

    .select-bank {
      padding-top: 18px;
      padding-bottom: 16px;
      padding-right: 20px;
      margin-left: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }

    .middle-top-content {
      width: 100%;
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      background: var(--default-bg);
    }

    .input-bank-card {
      width: 100%;
      height: 50px;
      padding-left: 20px;
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
      margin-top: 6px;
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

    .select-address {
      height: 55px;
      padding-top: 18px;
      padding-bottom: 16px;
      margin-left: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color); /* no */
    }

    .bottom-content {
      width: 100%;
      margin-top: 6px;
      margin-bottom: 40px;
    }
    .baseBtn {
      margin-top: 40px;
      width: 345px;
      height: 45px;
      line-height: 45px;
      font-size: 17px;
      font-weight: 600;
    }
  }
}
</style>
