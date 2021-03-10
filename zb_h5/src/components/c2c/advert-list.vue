<template>
  <div class="advert-list-wrap">
    <div class="advert-list">
      <div class="advert-list-top">
        <div
          class="ad-head-img"
        >{{ advertList.nickName ? advertList.nickName.substring(0,1) : advertList.type === '1' ? '买' : '卖'}}</div>
        <div class="advert-list-top-middle">
          <div class="advert-name">
            <span>{{ advertList.nickName }}</span>
          </div>
          <div>
            <i
              class="pay zbicon-icon-creditcard creditcard"
              v-show="advertList.payWay ? advertList.payWay.indexOf('1') > -1 : false"
            />
            <i
              class="pay zbicon-icon-alipay alipay"
              v-show="advertList.payWay ?advertList.payWay.indexOf('3') > -1 : false"
            />
            <i
              class="pay zbicon-icon-wechat wechat"
              v-show="advertList.payWay ?advertList.payWay.indexOf('2') > -1 : false"
            />
          </div>
        </div>
        <div class="advert-list-top-right">
          <div
            :class="advertList.type === 1 ? 'red-bg-color' : 'green-bg-color'"
            class="deal-btn"
          >{{advertList.type === 1 ? '买入' : '卖出' }}</div>
          <span>{{ `单价(${marketNameDeal(advertList.marketName)})` }}</span>
        </div>
      </div>
      <div class="advert-list-bottom">
        <span>{{`限额(${marketNameDeal(advertList.marketName)}) ${advertList.dealMinMoney} - ${advertList.dealMaxMoney}`}}</span>
        <span>{{ advertList.price }}</span>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import { IAdListResponseResult } from '@/api/otc/ad';

@Component({
  components: {
    iconPortrait
  }
})

export default class AdvertList extends Vue {
  @Prop({ type: Object, default: () => ({}) }) advertList!: IAdListResponseResult;

  /// 获取法币符号
  marketNameDeal(value: string) {
    if (!value) return;
    switch (value.split('/')[1]) {
      case 'CNY':
        return '¥';
      case 'HKD':
        return 'HK\$';
      case 'USD':
        return '\$';
      default:
        return '';
    }
  }
}
</script>

<style lang='scss'>
.advert-list-wrap {
  background: var(--default-bg);
  .pay {
    font-size: 24px;
    &.creditcard {
      color: #e4be81;
    }
    &.alipay {
      color: #b0bbdd;
    }
    &.wechat {
      color: #40ba49;
    }
  }
  .ad-head-img {
    width: 42px;
    height: 42px;
    background: rgba(109, 134, 193, 1);
    border-radius: 50%;
    line-height: 42px;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }
  .advert-list {
    padding: 20px 0 20px 0;
    margin: 0 15px 0 15px;
    border-bottom: 1px solid var(--border-color);
  }
  .advert-list-top {
    display: flex;
  }
  .advert-list-top-middle {
    flex: 1;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .advert-name {
    span {
      font-size: 15px;
      font-weight: 400;
      @include light{
        color: #2B303C;
      }
      @include dark{
        color: #BEC2CB;
      }
    }
  }
  .advert-list-top-right {
    .deal-btn {
      width: 68px;
      height: 22px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 13px;
    }
    span {
      display: block;
      text-align: right;
      font-size: 10px;
      font-weight: 400;
      color: #94a0aa;
    }
  }
  .advert-list-bottom {
    padding-top: 11px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include light{
      color: #4B5E6D;
    }
    @include dark{
      color: #AFB7C2;
    }
    span:first-child {
      font-size: 12px;
      font-weight: 400;
    }
    span:last-child {
      font-size: 20px;
      font-weight: 600;
    }
  }
  .red-bg-color {
    background: #e91c41;
  }
  .green-bg-color {
    background: #59cc6c;
  }
}
</style>
