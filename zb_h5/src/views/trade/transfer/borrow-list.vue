<template>
  <div class="lever-borrow-warp" v-loading="list.length === 0 && loading === true">
    <native-scroll :size="15" pullup @scroll-end="scrollEndHandle" pulldown @refresh="refresh" :data="list" virtual-scroll>
      <template #virtual="{ data }">
        <ul @click="toDetail(data)" class="borrow-list" v-hover:hover-active-list>
          <li class="borrow-item">
            <h3 class="">日利率</h3>
            <p class="rate">{{ data.rateOfDayShow }}</p>
          </li>
          <li class="borrow-item">
            <h3 class="">期限</h3>
            <p>{{ data.repaymentDay }}天</p>
          </li>
          <li class="borrow-item">
            <h3 class="">剩余可借</h3>
            <p>{{ data.balance + ' ' + data.coinName }}</p>
            <span class="u-arrow" />
          </li>
        </ul>
      </template>
    </native-scroll>
    <no-data :visible="list.length === 0 && loading === false" />
  </div>
</template>

<script lang='ts' src='./borrow-list.ts'>
</script>

<style lang='scss'>
.lever-borrow-warp {
  .borrow-list {
    display: flex;
    padding: 15px;
  }
  .borrow-item {
    flex: 1;
    &:nth-child(3) {
      flex: 1.8;
      text-align: right;
      padding-right: 20px;
      position: relative;
    }
    .u-arrow {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    p {
      font-size: 14px;
      @include dark {
        color: #ddd;
      }
      @include light {
        color: #333333;
      }
      &.rate {
        color: var(--color);
      }
    }
    h3 {
      padding-bottom: 10px;
      font-size: 12px;
      color: #999999;
    }
  }
}
</style>
