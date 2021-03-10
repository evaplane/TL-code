<template>
  <div class="lever-return-warp" v-loading="loadingAll">
    <native-scroll pullup @scroll-end="scrollEndHandle" :data="list" class="scroll-warp">
      <div class="lever-assets">
        <div class="assets-item">
          <label>待还 {{ mixinsCShowNameUp }}</label>
          <span>{{ coinBenxi + ' ' + mixinsCShowNameUp }}</span>
        </div>
        <div class="assets-item">
          <label>可用</label>
          <span>{{ coinAvailable + ' ' + mixinsCShowNameUp }}</span>
        </div>
        <div class="assets-item">
          <label>待还{{ mixinsFShowNameUp }}</label>
          <span>{{ fiatBenxi + ' ' + mixinsFShowNameUp }}</span>
        </div>
        <div class="assets-item">
          <label>可用</label>
          <span>{{ fiatAvailable + ' ' + mixinsFShowNameUp }}</span>
        </div>
      </div>
      <div class="borrowing-title">
        <h2 class="title">我的贷款</h2>
        <span @click="actionSheetVisible = true">筛选</span>
      </div>
      <div class="borrowing-list" v-loading="list.length === 0 && loading">
        <li v-for="item in list" :key="item.ids" class="borrowing-item" @click="toDetail(item)">
          <div class="item-top">
            <div class="item-title">
              <img :src="`./img/coins/${ item.coinShowName.toLowerCase() }.svg`" />
              <h2>借入 {{ item.extendAmount + ' ' + item.coinShowName }}</h2>
            </div>
            <span class="item-status " :class="{ repayment: item.status === 1 }">
              {{ item.statusShow }}<span class="u-arrow"
            /></span>
          </div>
          <div class="borrowing-row">
            <div class="bottom-col">
              <label>应还 {{ item.coinShowName }}</label>
              <p>{{ plus(item.amount, item.arrearsLx) }}</p>
            </div>
            <div class="bottom-col">
              <label>日利率</label>
              <p>{{ item.rateShow }}%</p>
            </div>
            <div class="bottom-col">
              <label>到期时间</label>
              <p>{{ item.repayDateShow | date('YYYY/MM/DD') }}</p>
            </div>
          </div>
        </li>
        <no-data :visible="list.length === 0 && loading === false" />
      </div>
    </native-scroll>
    <div class="one-key-repayment" v-if="list.length">
      <div class="key-btn" @click="selectAll">
        <span class="key-radio" :class="{ active: isAll }"></span>
        <p>全选</p>
      </div>
      <div class="repayment-info">
        <p v-for="text in coinTotalArr" :key="text">
          {{ text }}
        </p>
      </div>
      <button @click="oneKeySubmitHandle">
        一键还款
      </button>
    </div>
    <van-action-sheet
      :actions="filterList"
      :lazy-render="false"
      @select="selectHandle"
      cancel-text="__('取消')"
      class="order-book-action-sheet"
      get-container="body"
      safe-area-inset-bottom
      v-model="actionSheetVisible"
    />
  </div>
</template>

<script lang='ts' src="./return.ts"></script>

<style lang='scss'>
.lever-return-warp {
  display: flex;
  flex-direction: column;
  height: 100%;
  .scroll-warp {
    flex: 1;
  }
  .lever-assets {
    margin: 10px 0;
  }
  .assets-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: 14px;
  }
  .borrowing-title {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    border-bottom: 4px solid var(--line-color);
  }
  .assets-title {
    font-size: 16px;
  }
  .item-title {
    display: flex;
    align-items: center;
    h2 {
      font-size: 16px;
    }
    img {
      width: 24px;
      margin-right: 8px;
    }
  }
  .borrowing-list {
    min-height: 50vh;
    .borrowing-item {
      padding: 10px 15px;
      border-bottom: 1px solid var(--line-color) /* no */;
    }
  }
  .item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .item-status {
      font-size: 14px;
    }
  }
  .item-status {
    float: right;
    font-weight: 500;
    &.repayment {
      color: var(--color);
    }
    &.repaid {
      color: var(--thin-color);
    }
  }
  .borrowing-row {
    display: flex;
  }
  .bottom-col {
    padding: 10px 0;
    flex: 1;
    text-align: right;
    &:nth-child(1) {
      flex: 1.4;
      text-align: left;
    }
    label {
      color: #999999;
      font-size: 12px;
    }
    p {
      font-size: 14px;
      padding-top: 7px;
      @include dark {
        color: #ddd;
      }
      @include light {
        color: #333333;
      }
    }
  }
  .one-key-repayment {
    padding: 0 15px;
    height: 54px;
    display: flex;
    font-weight: 500;
    justify-content: space-between;
    align-items: center;
    @include dark {
      box-shadow: 1px 1px 3px #eee;
    }
    @include light {
      box-shadow: 1px 1px 3px #aaa;
    }
    button {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      width: 90px;
      height: 36px;
      border-radius: 2px;
      line-height: 36px;
      background-color: var(--color);
      border: none;
    }
  }
  .key-radio {
    display: inline-block;
    height: 24px;
    width: 24px;
    border: 2px solid #d1d1d1;
    border-radius: 50%;
    position: relative;
    &.active::after {
      background-color: var(--color);
      border-radius: 50%;
      position: absolute;
      width: 88%;
      height: 88%;
      left: 6%;
      top: 6%;
      content: '';
    }
  }
  .repayment-info {
    font-size: 12px;
    p + p {
      padding-top: 6px;
    }
  }
}
</style>
