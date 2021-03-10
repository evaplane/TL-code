<template>
  <div class="c2c-management-box">
    <div class="management-head">
      <tab class="tabs-dark" @change="tabChangeHandle" border v-model="tabType">
        <tab-item :name="0">__('我参与的')</tab-item>
        <tab-item :name="1">__('我发布的')</tab-item>
      </tab>
      <div class="coin-type" @click="orderFilterVisible = !orderFilterVisible">
        {{ coinType }}
        <icon-arrow />
      </div>
      <order-filter :visible.sync="orderFilterVisible" @filterChange="filterChangeHandle" />
    </div>
    <div class="management-filter" v-show="list.length">
      <sort @sort-change="sortChangeHandle" class="order-sort-component">
        <sort-option name="amountSort">__('数量')</sort-option>
        <sort-option name="priceSort">__('单价')</sort-option>
        <sort-option name="totalMoneySort">__('总金额')</sort-option>
        <!-- <sort-option name="status">__('完成状态')</sort-option> -->
      </sort>
    </div>

    <native-scroll
      ref="nativeScroll"
      flex-layout
      :size="15"
      :pullup="mixinsOtcIsLogin"
      :pulldown="mixinsOtcIsLogin"
      :data="list"
      class="management-order-box"
      @scroll-end="scrollEndHandle"
      @refresh="refresh"
      virtual-scroll
    >
      <template #virtual="{ data: order }">
        <div v-hover:hover-active-list>
          <div v-if="order.adTradeType === 1" class="item" @click="toDetail(order)">
            <!-- OTC -->
            <div class="avatar" :class="[getOrderType(order.adType) === 'buy' ? 'buy-bg' : 'sell-bg']">
              <h3>{{ getOrderType(order.adType) === 'buy' ? "__('买')" : "__('卖')" }}</h3>
              <p>{{ order.emoneyUnit }}</p>
            </div>
            <div class="col col-1">
              <div class="info">
                <span class="user-name">{{ order.merchantNickName }}</span>
                <span class="rank">
                  <img src="@img/c2c/zbicon-attestation.svg" />
                  <!-- <i class="up">2</i> -->
                </span>
              </div>
              <div class="label">__('数量')({{ order.emoneyUnit }})</div>
              <div class="value">{{ order.amount }}</div>
            </div>
            <div class="col col-2">
              <div class="info">
                <i :class="getPaywayClasses(order)" />
              </div>
              <div class="label">__('单价')(¥)</div>
              <div class="value">{{ order.price }}</div>
            </div>
            <div class="col col-3">
              <div class="info">
                <div :class="{ done: order.status !== 3 }" class="status-btn">{{ getStatusText(order) }}</div>
              </div>
              <div class="label">__('总金额')({{ order.emoneyUnit }})</div>
              <div class="value">{{ order.money }}</div>
            </div>
          </div>

          <div v-else class="item" @click="toDetail(order)">
            <!-- C2C -->
            <div class="avatar">
              <img :src="'./img/coins/etc.svg'" />
            </div>
            <div class="col col-1">
              <div class="value">
                <span class="order-type buy-color">{{ getOrderType(order.adType) === 'buy' ? "__('买')" : "__('卖')" }}</span>
                <span class="order-amount">{{ order.amount }}</span>
                <span class="order-coin">{{ order.emoneyUnit }}</span>
              </div>
              <div class="label">
                <time>{{ order.orderTime }}</time>
              </div>
            </div>
            <div class="col col-2">
              <div class="value">{{ order.price }}</div>
              <div class="label">__('单价')(¥)</div>
            </div>
            <div class="col col-3">
              <div class="value">
                {{ order.money }}
                <i class="c2c-more zbicon-more" />
              </div>
              <div class="label">__('总金额')({{ order.emoneyUnit }})</div>
            </div>
          </div>
        </div>
      </template>

      <no-data :visible="!mixinsOtcIsLogin || (loaded && list.length <= 0)" />
    </native-scroll>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import sort, { ISortOptions } from '@/components/common/sort/sort.vue';
import sortOption from '@/components/common/sort/sort-option.vue';
import { tab, tabItem } from '@/components/common/tab/index';
import { TOrderSort, IOtcOrderResponse, IOtcOrderListParams, getOrderList } from '@/api/otc/order';
import nativeScroll from '@/components/common/native-scroll/index';
import orderFilter, { IOrderFilter } from '@/components/c2c/order-filter.vue';
import noData from '@/components/common/no-data.vue';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
import { TAdType } from '@/api/otc/ad';
import { EOtcOrderStatus as OrderStatus } from '@/config/enums';

interface ISort {
  amountSort: TOrderSort;
  priceSort: TOrderSort;
  totalMoneySort: TOrderSort;
}

@Component({
  components: {
    sort,
    sortOption,
    tab,
    tabItem,
    noData,
    orderFilter
  }
})
export default class C2CManagement extends Mixins(mixinsOtcGetUserToken) {
  tabType: number = 0;
  coinType: string = '__("全部")';
  orderFilterVisible: boolean = false;
  sort: ISort = {
    amountSort: null,
    priceSort: null,
    totalMoneySort: null
  };
  orderFilter: IOrderFilter = {};
  loaded: boolean = false;
  finished: boolean = false;
  list: IOtcOrderResponse[] = [];
  listParams: IOtcOrderListParams = {
    pageIndex: 1,
    pageSize: 20,
    type: 2
  };

  '$refs': {
    nativeScroll: nativeScroll;
  };

  @Watch('mixinsOtcIsLogin', { immediate: true })
  otcIsLoginWatcher() {
    this.resetList();
  }

  toDetail(order: IOtcOrderResponse) {
    let routerName = 'c2c-await-order';
    const buyerStatus: number[] = [OrderStatus.WaitPayMoney];
    const sellerStatus: number[] = [OrderStatus.WaitPayCoin, OrderStatus.Appealing, OrderStatus.Complete];

    if (buyerStatus.indexOf(order.status) > -1) {
      routerName = 'c2c-order-buyer';
    } else if (sellerStatus.indexOf(order.status) > -1) {
      routerName = 'c2c-order-seller';
    }

    this.$router.push({
      name: routerName,
      params: {
        orderId: order.id
      }
    });
  }

  getStatusText(order: IOtcOrderResponse) {
    const statusMap: IObj<string> = {
      0: '__("等待接单")',
      1: '__("接单超时")',
      2: '__("拒绝接单")',
      3: '__("待付款")',
      4: '__("已付款")',
      5: '__("申诉中")',
      6: '__("已完成")',
      7: '__("已取消")',
      8: '__("处理失败")'
    };
    return statusMap[order.status];
  }

  getPaywayClasses(order: IOtcOrderResponse) {
    const paywayClassMap: IObj<string> = {
      1: 'zbicon-icon-creditcard',
      2: 'zbicon-icon-wechat',
      3: 'zbicon-icon-alipay',
      4: 'bg-icon zbicon-icon-paypal',
      5: 'bg-icon zbicon-icon-western-union',
      6: 'bg-icon zbicon-icon-swift'
    };
    return paywayClassMap[order.payInfo.type];
  }

  resetList(resetScroll: boolean = true) {
    this.loaded = false;
    this.finished = false;
    this.listParams.pageIndex = 1;
    resetScroll && this.$refs.nativeScroll && this.$refs.nativeScroll.reset();
    if (this.mixinsOtcIsLogin) {
      this.getOrderList(true);
    }
  }
  refresh() {
    this.resetList(false);
  }

  getOrderType(adType: TAdType) {
    if (this.tabType === 0) {
      // 我参与的 adType 1-我卖出的 2-我买入的
      return adType === 2 ? 'buy' : 'sell';
    } else {
      // 我发布的 adType 1-我发布的买单 2-我发布的卖单
      return adType === 1 ? 'buy' : 'sell';
    }
  }

  scrollEndHandle() {
    this.getOrderList();
  }

  async getOrderList(isRefresh?: boolean) {
    try {
      // tabType 0-我参与的 1-我发布的
      // 订单归属类型(1-本人发布，2-本人下单)
      this.listParams.type = this.tabType === 0 ? 2 : 1;
      let res = await getOrderList(Object.assign(this.listParams, this.sort, this.orderFilter));
      this.finished = this.listParams.pageIndex >= res.totalPage;
      isRefresh && (this.list = []);
      this.list = this.list.concat(res.results);
      this.listParams.pageIndex += 1;
    } catch (err) {
      this.finished = true;
      console.log(err);
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loaded = true;
  }

  tabChangeHandle(index: number) {
    this.tabType = index;
    this.resetList();
  }
  sortChangeHandle(info: ISortOptions) {
    let sort: ISort = {
      amountSort: null,
      priceSort: null,
      totalMoneySort: null
    };

    if (info.type === 'asc') {
      (sort as any)[info.name] = 1;
    }

    if (info.type === 'desc') {
      (sort as any)[info.name] = 2;
    }
    this.sort = Object.assign(sort);
    this.resetList();
  }
  filterChangeHandle(data: IOrderFilter) {
    let orderType = data.orderType;

    if (this.tabType === 1) {
      // 我发布的，order type 相反
      orderType = orderType === 1 ? 2 : 1;
    }
    this.orderFilter = {
      orderType: orderType,
      orderStatus: data.orderStatus
    };
    this.resetList();
  }
}
</script>

<style lang='scss'>
.c2c-management-box {
  background: var(--default-bg);
  color: var(--theme-color);
  display: flex;
  flex-direction: column;
  .m-scroll-refresh-line{
    top: 80px;
  }
  .management-head {
    display: flex;
    align-items: center;
    position: relative;
  }
  .coin-type {
    position: absolute;
    right: 0;
    top: 0;
    width: 130px;
    height: 100%;
    padding-left: 20px;
    padding-right: 15px;
    padding-top: 12px;
    text-align: right;
    font-size: 14px;
    color: var(--new-theme-color);
    i {
      vertical-align: middle;
    }
  }
  .management-filter {
    border-bottom: 1px solid var(--border-color); /* no */
  }
  .order-sort-component {
    padding: 10px 15px;
    justify-content: space-between;
  }
  .management-content {
    flex: 1;
  }

  .management-order-box {
    .nodata-box {
      height: 100%;
    }
    .van-skeleton__avatar {
      margin-top: 10px;
    }
    .item {
      display: flex;
      padding: 15px;
      line-height: 16px;
      font-size: 13px;
      border-bottom: 3px solid var(--border-color);
      .col {
        flex: 1;
      }
      .avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        text-align: center;
        margin-right: 10px;
        color: #fff;
        h3 {
          padding-top: 5px;
          font-size: 10px;
          font-weight: 500;
        }
        p {
          font-size: 14px;
          line-height: 1em;
        }
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
      .info {
        height: 22px;
        white-space: nowrap;
        img {
          width: 17px;
          vertical-align: -3px;
        }
        .rank {
          position: relative;
        }
        .up {
          font-size: 10px;
          position: absolute;
          right: -8px;
          top: -3px;
          font-style: normal;
          color: rgb(218, 145, 37);
        }

        i {
          font-size: 24px;
          &.zbicon-icon-creditcard {
            color: #e4be81;
          }
          &.zbicon-icon-alipay {
            color: #b0bbdd;
          }
          &.zbicon-icon-wechat {
            color: #40ba49;
          }
          &.bg-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin: 0 4px;
          }
          &.zbicon-icon-paypal {
            background: url('~@img/c2c/paypal.png') center no-repeat / contain;
          }
          &.zbicon-icon-western-union {
            background: url('~@img/c2c/western-union.png') center no-repeat / contain;
          }
          &.zbicon-icon-swift {
            background: url('~@img/c2c/swift.png') center no-repeat / contain;
          }
        }
      }
      .label {
        padding: 8px 0;
        font-size: 10px;
        color: #94a0aa;
      }
      .status-btn {
        min-width: 68px;
        height: 22px;
        padding: 0 12px;
        text-align: center;
        line-height: 22px;
        background: var(--primary-color);
        color: #fff;
        border-radius: 12px;
        font-size: 12px;
        display: inline-block;
        &.done {
          background: #707070;
        }
      }
      .c2c-more {
        display: inline-block;
        @include light {
          color: #d8d8d8;
        }
      }
      .value {
        font-size: 16px;
        font-weight: 600;
        @include light {
          color: #2b303c;
        }
        @include dark {
          color: #f4f1f1;
        }
      }
      .user-name {
        padding-right: 5px;
        font-size: 16px;
        @include light {
          color: #2b303c;
        }
        @include dark {
          color: #f4f1f1;
        }
      }
      .col-3 {
        text-align: right;
      }
      .col-2 {
        text-align: center;
      }
      .order-type {
        font-size: 16px;
        font-weight: 600;
      }
      .order-amount {
        font-size: 16px;
        padding: 0px 3px;
        font-weight: 400;
      }
      .order-coin {
        font-size: 12px;
        font-weight: 400;
        color: var(--new-theme-color-6);
      }
      time {
        font-size: 10px;
      }
    }

    .loading-wrap {
      margin-top: 30px;
    }
  }
}
</style>
