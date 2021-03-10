<template>
  <div class="order-header-wrap">
    <div class="order-header-app-bar-wrap">
      <div @click="$router.back()" class="tab-left">
        <img alt src="@/assets/img/c2c/order-header-back.svg" />
      </div>
      <div class="tab-center">{{ `${judgeTradeType === 1 ? '购买' : '卖出'}${otcOrderDeatil.emoneyUnit}` }}</div>
    </div>
    <div class="order-header-middle">
      <div class="count-down-wrap">
        <div>{{ mixinsCountDown }}</div>
        <div>等待付款，剩时：</div>
      </div>
      <div class="safe">
        <img src="@img/c2c/zbicon-shield.svg" />
        <div class="safe-span">
          <p>担保交易</p>
          <p>安心付款</p>
        </div>
      </div>
    </div>
    <div class="order-header-bottom">
      <span>{{ `状态：${orderStatusDesc}` }}</span>
      <div @click="showDetail" class="detail">详细</div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

@Component({
  components: {
  }
})

export default class OrderHeader extends Vue {
  @Prop({ type: Object, default: () => ({}) }) otcOrderDeatil!: object;
  @Prop({ type: String, default: '00:00 00' }) mixinsCountDown!: string;
  @Prop({ type: String, default: '' }) orderStatusDesc!: string;
  @Prop({ type: Number, default: 1 }) judgeTradeType!: number;

  @Emit('show-order')
  showDetail() { }
}
</script>

<style lang='scss'>
.order-header-wrap {
  width: 100%;
  position: relative;
  height: 214px;
  background-image: url('~@/assets/img/c2c/order-header-bg.png');
  background-size: 100%;
  display: flex;
  flex-direction: column;
  .order-header-app-bar-wrap {
    padding-right: 25px;
    padding-left: 25px;
    width: 100%;
    height: 63px;
    display: flex;
    background: #ffffff;
    align-items: center;
    background: transparent;
  }
  .tab-left {
    margin-right: 19px;
  }
  .tab-center {
    font-size: 26px;
    color: white;
    font-weight: 600;
  }
  .order-header-middle {
    padding-right: 34px;
    padding-left: 34px;
    padding-top: 29px;
    display: flex;
    justify-content: space-between;
    .count-down-wrap {
      div:first-child {
        color: white;
        font-size: 26px;
        padding-bottom: 2px;
        font-weight: bolder;
      }
      div:last-child {
        color: #7d7d7d;
        font-size: 14px;
      }
    }
    .safe {
      width: 107px;
      height: 42px;
      padding: 4px 14px;
      background: #e91c41;
      border-radius: 21px;
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 22px;
        margin-right: 5px;
      }
      p {
        color: white;
        font-size: 12px;
        line-height: 116%;
      }
    }
  }
  .order-header-bottom {
    padding-right: 34px;
    padding-left: 34px;
    padding-top: 26px;
    span {
      font-size: 14px;
      color: #b0b0b0;
    }
    .detail {
      display: inline-block;
      width: 47px;
      height: 23px;
      background: #e91c41;
      color: white;
      border-radius: 2px;
      line-height: 23px;
      text-align: center;
      font-size: 12px;
      margin-left: 7px;
    }
  }
}
</style>
