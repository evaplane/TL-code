<template>
  <div class="mode-payment-wrap" v-loading="bankLoading">
    <app-bar title="收付款方式" />
    <native-scroll class="mode-payment-scroll">
      <div class="mode-payment">
        <div class="mode-payment-no" v-if="bankList.length === 0  && !bankLoading">
          <icon-portrait :imgUrl="require('@img/c2c/payment/no-payment.svg')" size="80" />
          <p class="mode-payment-text">绑定的收付款方式，仅做交易展示，ZB平台无法自动扣款，需您手动自行转账</p>
          <div @click="submitButton" class="jump-button">去绑定</div>
        </div>
        <ul class="mode-payment-content" v-else>
          <li
            :key="item.accountId"
            @click="jumpCard(item)"
            class="long-card"
            v-for="item in bankList"
          >
            <icon-portrait :img-url="bankListMap[`${item.type}`].imgUrl" size="34" />
            <div class="long-card-content">
              <span>{{ bankListMap[`${item.type}`].name }}</span>
              <span>{{item.account}}</span>
            </div>
          </li>
        </ul>
        <div
          @click="$router.push({ name: 'c2c-payment-select' })"
          class="add-bank"
          v-if="bankList.length !== 0"
        >
          <icon-portrait :img-url="require('@img/c2c/add-bank.png')" size="66" />
        </div>
      </div>
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
// api
import { reqGetByAccount, IAccountResponse } from '@/api/otc/bank';
// mixins
import mixinsC2CCommon from '@/mixins/c2c/common-data';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

interface IBankCardItem {
  imgUrl: any;
  name: string;
}

@Component({
  components: {
    appBar,
    iconPortrait
  }
})

export default class ModePayment extends Mixins(mixinsC2CCommon, mixinsOtcGetUserToken) {
  bankList: IAccountResponse[] = [];
  bankLoading: boolean = true;
  bankListMap: IObj<IBankCardItem> = {
    1: {
      imgUrl: require('@img/c2c/icon_bank_card.png'),
      name: '银行卡支付'
    },
    2: {
      imgUrl: require('@img/c2c/icon_wechat.png'),
      name: '微信'
    },
    3: {
      imgUrl: require('@img/c2c/icon_alipay.png'),
      name: '支付宝'
    },
    4: {
      imgUrl: require('@img/c2c/icon_bank_card.png'),
      name: 'Paypal'
    },
    5: {
      imgUrl: require('@img/c2c/icon_bank_card.png'),
      name: '西联汇款'
    },
    6: {
      imgUrl: require('@img/c2c/icon_bank_card.png'),
      name: '国际Swift转账'
    }
  };
  bankCardParams = {
    pageIndex: 1,
    typeStr: '1,2,3,4,5,6,7',
    pageSize: 50
  };

  submitButton() {
    this.$router.push({ name: 'c2c-payment-select' });
  }

  created() {
    this.getBankCardList();
  }

  jumpCard(item: IAccountResponse) {
    this.mixinsBankCard.map(cardItem => {
      if (item.type === cardItem.key) {
        return this.$router.push({ name: cardItem.value, params: { title: cardItem.urlName, idCard: item.accountId } });
      }
    });
  }

  async getBankCardList() {
    try {
      let res = await reqGetByAccount(this.bankCardParams);
      this.bankList = res.results;
      this.bankLoading = false;
    } catch (e) {
      this.$message.fail(e.resMsg.message);
      this.bankLoading = false;
    }
  }
}
</script>

<style lang='scss'>
.mode-payment-wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  .mode-payment-scroll {
    background: #f7f8fe;
  }
  .mode-payment {
    flex: 1;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--default-bg);
    .add-bank {
      position: fixed;
      right: 8px;
      bottom: 84px;
    }
    .mode-payment-no {
      padding-top: 161px;
      background: var(--default-bg);
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      p {
        width: 250px;
        padding-top: 20px;
        padding-bottom: 37px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        line-height: 20px;
        @include light {
          color: var(--new-theme-color-3);
        }
        @include dark {
          color: var(--new-theme-color-3);
        }
      }
      .jump-button {
        text-align: center;
        width: 120px;
        height: 40px;
        font-size: 17px;
        line-height: 40px;
        color: #ffffff;
        background: rgba(209, 29, 61, 1);
        border-radius: 23px;
      }
    }
    .mode-payment-content {
      flex: 1;
      border-bottom: 20px solid transparent;
      @include light {
        background-color: #f7f8fe;
      }
      @include dark {
        background-color: #1b1924;
      }
      .long-card {
        margin: 16px 15px 0 15px;
        display: flex;
        padding: 17px 21px;
        border-radius: 10px;
        background: #ffffff;
        .long-card-content {
          padding-left: 5px;
          display: flex;
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
  }
}
</style>
