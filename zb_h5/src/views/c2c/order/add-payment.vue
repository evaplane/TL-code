<template>
  <div class="add-payment-wrap">
    <app-bar :title="`购买${mixinsOtcOrderDetail.emoneyUnit}`"   v-show="!isShowSelectBank" />
    <ctc-header-nav
      :order-status-desc="mixinsOrderStatusDesc"
      :otc-order-deatil="mixinsOtcOrderDetail"
      :order-progress-arr="mixinsOrderProgressView"
      :order-id="$route.params.orderId"
      v-show="!isShowSelectBank"
    />
    <native-scroll class="add-payment" ref="scroll">
      <div v-show="!isShowSelectBank" class="add-payment-content">
        <div class="add-payment-bank">
          <div
            @click="addPayForCard"
            class="add-pay"
          >{{ `新增${bankListMap[mixinsOtcOrderDetail.payInfo.type].name}` }}
          </div>
          <div v-show="isShowBankCard">
            <div class="name-wrap">qq</div>
            <div @click="openSelectBank" class="select-bank">
              <span>{{ selectBankCard === '' ?  '选择银行' :  selectBankCard}}</span>
              <icon-portrait :imgUrl="require('@img/c2c/merchant/right-icon-jump.svg')" size="22"/>
            </div>
            <div class="name-wrap">
              <input
                autocomplete="off"
                class="input-bank-card"
                placeholder="卡号"
                type="number"
                v-model="accountInput"
              />
            </div>
            <div class="name-wrap">
              <input
                autocomplete="off"
                class="input-bank-card"
                placeholder="开户行(用户提现或退款可不填，或后期补充"
                type="text"
                v-model="subBranchInput"
              />
            </div>
            <div class="btn-option">
              <div @click="addAction">取消</div>
              <div @click="addCardConfirmOrder = true">确认</div>
            </div>
          </div>
          <div v-show="isShowAppCard">
            <div class="name-wrap">qq</div>
            <div class="name-wrap">
              <input autocomplete="off" class="input-bank-card" placeholder="卡号" type="text"/>
            </div>
            <div class="upload-img">
              <div class="pay-img-wrap">
                <van-uploader :after-read="setUserAvatar" class="add-pay-img">
                  <div class="add-pay-img" v-if="isShowUploadImg">
                    <icon-portrait
                      :img-url="require('@img/c2c/payment/add-pay-img.png')"
                      size="80"
                    />
                    <p>收款二维码</p>
                    <p>用于交易失败退款(选填)</p>
                  </div>
                  <div class="add-pay-img" v-else>
                    <img :src="userAvatar" class="show-img"/>
                  </div>
                </van-uploader>
              </div>
              <div class="btn-option">
                <div @click="addAction">取消</div>
                <div @click="addCardConfirmOrder = true">确认</div>
              </div>
            </div>
          </div>
          <p>选择使用历史付款账户</p>
          <ul>
            <li class="long-card" v-for="item in paymentList" :key="item.accountId" @click="openPayFor(item.accountId)">
              <icon-portrait :img-url="bankListMap[`${item.type}`].imgUrl" size="34"/>
              <div class="long-card-content">
                <span>{{ item.bankName }}</span>
                <span>{{ item.account }}</span>
              </div>
              <icon-portrait :img-url="require('@img/c2c/merchant/right-icon-jump.svg')" size="22"/>
            </li>
          </ul>
        </div>
      </div>
      <help-dialog
        :visible.sync="addCardConfirmOrder"
        @confirm="addCardConfirmOrderHandle"
        cancel-button-text="__('返回')"
        confirm-button-text="__('确认付款')"
        :message="`您确定从上述您的账户付款成功¥${mixinsOtcOrderDetail.money}元么？`"
      />
      <help-dialog
        :visible.sync="confirmOrder"
        @confirm="confirmOrderHandle"
        cancel-button-text="__('返回')"
        confirm-button-text="__('确认付款')"
        :message="`您确定从上述您的账户付款成功¥${mixinsOtcOrderDetail.money}元么？`"
      />
      <select-bank @select-bank="selectBank" v-show="isShowSelectBank"/>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Mixins } from 'vue-property-decorator';
// components
import { Uploader } from 'vant';
import appBar from '@/components/c2c/app-bar.vue';
import selectBank from '@/components/c2c/select-bank.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import ctcHeaderNav from '@/components/c2c/order-progress.vue';
import helpDialog from '@/components/common/help-dialog/index.vue';
// api
import { reqGetOrderById, reqPayByBuyer } from '@/api/otc/order';
import { reqAddAccount, reqGetByAccount, IAccountListParams, IAccountResponse } from '@/api/otc/bank';
// mixins
import mixinsOtcOrder from '@/mixins/otc/order';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

Vue.use(Uploader);

interface IBankCardItem {
  imgUrl: any;
  name: string;
}

@Component({
  components: {
    helpDialog,
    iconPortrait,
    ctcHeaderNav,
    selectBank,
    appBar
  }
})
export default class AddPayment extends Mixins(mixinsOtcOrder, mixinsOtcGetUserToken) {
  addCardConfirmOrder: boolean = false;
  confirmOrder: boolean = false;
  saveCardId: number | string = '' ;

  isShowSelectBank: boolean = false; // 是否打开选择银行
  isShowUploadImg: boolean = true;
  userAvatar: string = '';

  // 历史支付
  paymentList: IAccountResponse[] = [];
  accountInput: string = ''; // 输入卡号
  subBranchInput: string = ''; // 开户行
  selectBankCard: string = '';

  bankListMap: IObj<IBankCardItem> = {
    1: {
      imgUrl: require('@img/c2c/icon_bank_card.png'),
      name: '银行卡'
    },
    2: {
      imgUrl: require('@img/c2c/icon_wechat.png'),
      name: '微信'
    },
    3: {
      imgUrl: require('@img/c2c/icon_alipay.png'),
      name: '支付宝'
    }
  };

  isShowBankCard: boolean = false;
  isShowAppCard: boolean = false;

  async mounted() {
    this.mixinsOtcOrderDetail = await reqGetOrderById(this.$route.params.orderId);
    this.mixinsGetOtcOrderDetail(this.$route.params.orderId);

    let params: IAccountListParams = {
      type: this.mixinsOtcOrderDetail.payInfo.type,
      pageIndex: 1,
      pageSize: 10,
      payment: 1
    };
    let res = await reqGetByAccount(params);
    this.paymentList = res.results;
  }

  // 上传二维码
  setUserAvatar(file: any) {
    this.userAvatar = file.content;
    this.isShowUploadImg = false;
  }

  addAction() {
    this.isShowBankCard = false;
    this.isShowAppCard = false;
  }

  // 打开新增支付
  addPayForCard() {
    if (this.mixinsOtcOrderDetail.payInfo.type === 1) {
      this.isShowBankCard = true;
    } else {
      this.isShowAppCard = true;
    }
  }
  // 选择已有的银行卡
  openPayFor(id: number) {
    this.confirmOrder = true;
    this.saveCardId = id;
  }

  // 买方添加银行卡确认支付确认支付
  async addCardConfirmOrderHandle() {
    const bankType = this.mixinsOtcOrderDetail.payInfo.type;
    let params: any = {
      payment: 0,
      receive: 1,
      account: this.accountInput,
      realName: 'qq'
    };
    if (bankType === 1) {
      params.bankName = this.selectBankCard;
      params.type = 1;
      params.subBranch = this.subBranchInput;
    } else {
      params.type = 3;
    }
    if (this.isVerification(bankType)) {
      let res = await reqAddAccount(params, true);
      await reqPayByBuyer(res.accountId, this.$route.params.orderId);
      this.$router.replace({ name: 'c2c-order-seller', params: { orderId: this.$route.params.orderId } });
    }
  }
  // 买方确认支付
  async confirmOrderHandle() {
    await reqPayByBuyer(this.saveCardId, this.$route.params.orderId);
    this.$router.replace({ name: 'c2c-order-seller', params: { orderId: this.$route.params.orderId } });
  }

  // 表单验证
  isVerification(type: number): boolean {
    if (this.accountInput === '') {
      this.$message.fail('请输入账号');
      return false;
    }
    if (type === 1 && this.selectBankCard === '') {
      this.$message.fail('请选择银行卡');
      return false;
    }
    return true;
  }

  // 打开银行卡
  openSelectBank() {
    this.isShowSelectBank = true;
  }

  // 选择银行
  selectBank(value: string) {
    this.isShowSelectBank = false;
    if (value) {
      this.selectBankCard = value;
    }
  }
}
</script>

<style lang='scss'>
  .add-payment-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    .add-payment {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      ::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        font-size: 14px;
        font-weight: 400;
        @include light {
          color: var(--new-theme-input);
        }
        @include dark {
          color: var(--new-theme-input);
        }
      }
      .add-payment-content {
        padding-left: 20px;
        padding-right: 20px;
        width: 100%;
      }
      .add-payment-bank {
        width: 100%;
        .select-bank {
          margin-top: 20px;
          width: 334px;
          height: 56px;
          font-size: 14px;
          font-weight: 500;
          color: #5e6c80;
          padding-left: 18px;
          padding-right: 23px;
          background: rgba(255, 255, 255, 0.5);
          box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(229, 229, 232, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .name-wrap {
          margin-top: 20px;
          width: 334px;
          height: 56px;
          font-size: 14px;
          font-weight: 500;
          color: #5e6c80;
          line-height: 56px;
          padding-left: 18px;
          background: rgba(255, 255, 255, 0.5);
          box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(229, 229, 232, 1);
        }
        .input-bank-card {
          background: transparent;
          width: 100%;
          border: none;
        }
        .btn-option {
          padding-top: 28px;
          padding-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          div:first-child {
            text-align: center;
            line-height: 50px;
            width: 153px;
            height: 50px;
            background: rgba(241, 242, 245, 1);
            border-radius: 100px;
            border: 1px solid rgba(76, 175, 80, 1);
            color: #4caf50;
            font-size: 17px;
            font-weight: 600;
          }
          div:last-child {
            text-align: center;
            line-height: 50px;
            width: 153px;
            height: 50px;
            background: #e91c41;
            border-radius: 100px;
            color: #ffffff;
            font-size: 17px;
            font-weight: 600;
          }
        }
      }
      .add-pay {
        margin-top: 23px;
        line-height: 34px;
        text-align: center;
        width: 84px;
        height: 34px;
        background: rgba(255, 255, 255, 0);
        border-radius: 2px;
        border: 1px solid rgba(115, 118, 128, 0.4);
        font-size: 12px;
        font-weight: 600;
        color: #455264;
      }
      p {
        padding-top: 20px;
        padding-top: 13px;
        font-size: 12px;
        font-weight: 600;
        color: #aeb9ca;
      }
      .long-card {
        width: 100%;
        display: flex;
        margin-top: 13px;
        padding: 17px 21px;
        border-radius: 10px;
        background: #ffffff;
        align-items: center;
        .long-card-content {
          padding-left: 5px;
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-around;
          span:first-child {
            display: block;
            padding-bottom: 2px;
            font-size: 18px;
            font-weight: 500;
            color: #27364a;
          }
          span:last-child {
            font-size: 13px;
            font-weight: 500;
            color: #5e6c80;
          }
        }
      }
    }
    .pay-img-wrap {
      padding-top: 40px;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      p {
        font-size: 12px;
        font-weight: 400;
        color: #aeb9ca;
      }
    }
    .add-pay-img {
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        padding-top: 13px;
        font-size: 11px;
        @include light {
          color: #aeb9ca;
        }
        @include dark {
          color: var(--new-theme-color-3);
        }
      }
    }

    .show-img {
      width: 108px;
      height: 108px;
      border-radius: 6px;
    }
  }
</style>
