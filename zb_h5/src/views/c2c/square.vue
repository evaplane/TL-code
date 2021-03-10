<template>
  <div class="c2c-square-box" :class="{ fixed: isFixed }">
    <div class="tab-coin" ref="tabCoin">
      <tab @change="tabChangeHandle" v-model="tabType" dark border>
        <tab-item :key="key" :name="item.value" v-for="(item, key) in coinsList">{{ item.name }}</tab-item>
      </tab>
      <i
        :class="{ acitve: listFilterVisible }"
        @click="listFilterVisible = !listFilterVisible"
        class="tab-sort-icon zbicon-zbicon-filter"
      ></i>
      <list-filter
        :visible.sync="listFilterVisible"
        :pay-ways="payWays"
        :amount="amount"
        :money-actions="moneyActions"
        :market-id="marketId"
        @filter="filterHandle"
      />
    </div>
    <native-scroll
      :size="15"
      :data="otcAdList"
      pullup
      pulldown
      flex-layout
      @scroll-end="scrollEndHandle"
      @refresh="refresh"
      @scroll="scrollHandle"
      ref="nativeScroll"
      class="square-scroll"
    >
      <template #before>
        <div class="trade-info" ref="tradeInfo">
          <div class="info-item">
            <label>{{ labelArr[0] }}{{ checked ? "__('数量')" : "__('金额')" }}：</label>
            <virtual-input
              class="info-input"
              v-model="amount"
              :placeholder="placeholder"
              @blur="blurHandle"
              @focus="focusHandle"
              v-keyboard
            >
              <div @click.stop="noop" class="info-itme-right" slot="right-icon">
                <m-switch v-model="checked" class="c2c-switch" />
                <span v-if="checked" @click="coinSheetVisible = true">
                  <span class="coin">{{ curCoin && curCoin.tradeCoinName }}</span>
                  <icon-arrow />
                </span>
                <span v-else @click="moneySheetVisible = true">
                  <span class="money">{{ moneyUnit }}</span>
                  <icon-arrow />
                </span>
              </div>
            </virtual-input>
          </div>
          <div class="info-item">
            <label>__('付款方式')：</label>
            <div class="info-direction">
              <m-select class="select" @click="payWayChangeHandle" :value="payWays">
                <m-option v-for="payway in normalPayways" :key="payway.value" :label="payway.name" :value="payway.value" />
                <m-option
                  v-for="payway in curPayways"
                  :key="payway.value"
                  :label="payway.name"
                  :value="payway.value"
                  @click.native="paySheetVisible = true"
                >
                  <icon-arrow />
                </m-option>
                <div v-if="curPayways.length === 0" @click="paySheetVisible = true" class="m-option">
                  __('更多')
                  <icon-arrow />
                </div>
              </m-select>
              <!-- <div @click="paySheetVisible = true" class="direction-more">
                <icon-arrow/>
              </div> -->
            </div>
          </div>
        </div>
        <div v-if="c2cData" ref="c2cInfo">
          <div class="line" />
          <div class="onekey">
            <div class="order-item">
              <div class="item-left">
                <div class="user-info">
                  <div class="user-info-img"></div>
                  <div class="detail">
                    <span class="user-c2c">C2C</span>
                    <!-- <span class="user-name">{{ c2cMarketInfo.c2cMarket.numberBi }}</span> -->
                    <span class="user-name">{{ c2cData.nickName }}</span>
                    <span class="user-rank" v-if="c2cData.businessType === 1">
                      <img src="@img/c2c/zbicon-attestation.svg" />
                    </span>
                    <div class="user-direction">
                      <i v-for="(paywayClass, index) in getPaywayClasses(c2cData)" :key="index" :class="paywayClass" />
                    </div>
                  </div>
                </div>
                <!-- <div class="limit">__('限额')({{ moneyUnit }}) {{ c2cData.dealMinMoney }}-{{ c2cData.dealMaxMoney }}</div> -->
                <div v-if="checked" class="limit">
                  __('限量')({{ curCoin && curCoin.tradeCoinName }})
                  {{ fixNumber(divide(c2cData.dealMinMoney, c2cData.price), c2cData.tradeCoinPrecision) }} -
                  {{
                    fixNumber(min(divide(c2cData.dealMaxMoney, c2cData.price), c2cData.remainAmount), c2cData.tradeCoinPrecision)
                  }}
                </div>
                <div v-if="!checked" class="limit">
                  __('限额')({{ moneyUnit }}) {{ fixNumber(c2cData.dealMinMoney, c2cData.basicCoinPrecision) }} -
                  {{
                    fixNumber(min(c2cData.dealMaxMoney, multiply(c2cData.remainAmount, c2cData.price)), c2cData.basicCoinPrecision)
                  }}
                </div>
              </div>
              <div class="item-right">
                <div @click="helpClickHandle" class="order-btn">
                  <i class="zbicon-icon-help" />
                </div>
                <div class="order-money-type">__('单价')({{ moneyUnit }})</div>
                <div class="order-price">{{ c2cData.price }}</div>
              </div>
            </div>
            <div class="one-key-warp">
              <button :class="typeBackground" class="one-key-btn" @click="c2cOneKeyClickHandle">
                <i class="zbicon-zbicon-lightning" />
                __('一键'){{ labelArr[0] }}
              </button>
            </div>
          </div>
        </div>
        <div class="line" ref="line"/>
        <div
          ref="orderBar"
          v-show="otcAdList.length"
          class="order-bar"
          :style="{ top: isFixed ? `${parseInt(headerOffsetHeight + tabCoinOffsetHeight + '')}px` : 0 }">
          <div class="order-bar-inner">
            <span class="bar-type">OTC</span>
            <sort @sort-change="sortChangeHandle" ref="sortComp" class="order-sort-component">
              <sort-option name="serviceSort">__('服务速度')</sort-option>
              <sort-option name="creditSort">__('信用')</sort-option>
              <sort-option name="kycSort">__('KYC要求')</sort-option>
              <sort-option name="priceSort">__('单价')</sort-option>
            </sort>
          </div>
        </div>
      </template>
      <!-- <template #virtual="{ data: item }"> -->
      <div class="order-list" :class="{ 'has-data': hasOtcAdData, empty: loaded && otcAdList.length === 0 }" :style="{ marginTop: isFixed ? `${orderBarOffsetHeight}px` : 0 }">
        <div v-for="item in otcAdList" :key="item.adId"  class="order-item" v-hover:hover-active-list>
          <div class="item-left">
            <div class="user-info">
              <div
                class="user-info-img"
                @click="
                  $router.push({
                    name: 'business-advertising',
                    params: { userId: item.userId + '', marketId: item.marketId + '' }
                  })
                "
              >
                <img src="@img/user/default-avatar.png" />
              </div>
              <div class="detail">
                <span class="user-name">{{ item.nickName }}</span>
                <span class="user-rank" v-show="item.businessType === 1">
                  <img src="@img/c2c/zbicon-attestation.svg" />
                </span>
                <div class="user-direction">
                  <i v-for="(paywayClass, index) in getPaywayClasses(item)" :key="index" :class="paywayClass" />
                </div>
              </div>
            </div>
            <div v-if="checked" class="limit">
              __('限量')({{ curCoin && curCoin.tradeCoinName }})
              {{ fixNumber(divide(item.dealMinMoney, item.price), item.tradeCoinPrecision) }} -
              {{ fixNumber(min(divide(item.dealMaxMoney, item.price), item.remainAmount), item.tradeCoinPrecision) }}
            </div>
            <div v-if="!checked" class="limit">
              __('限额')({{ moneyUnit }}) {{ fixNumber(item.dealMinMoney, item.basicCoinPrecision) }} -
              {{ fixNumber(min(item.dealMaxMoney, item.remainMoney), item.basicCoinPrecision) }}
            </div>
          </div>
          <div class="item-right">
            <div class="order-btn">
              <button @click="goConfirm('otc', item)" :class="typeBackground">{{ labelArr[0] }}</button>
            </div>
            <div class="order-money-type">__('单价')({{ moneyUnit }})</div>
            <div class="order-price">{{ item.price }}</div>
          </div>
        </div>
        <no-data :visible="showNodata" />
      </div>
      <!-- </template> -->
    </native-scroll>

    <transition name="keyboard">
      <div @click.stop="noop" class="keyboard-content" v-if="keyboardVisible">
        <keyboard @hide="keyboardVisible = false"></keyboard>
      </div>
    </transition>

    <van-action-sheet
      :actions="moneyActions"
      :lazy-render="false"
      @select="moneySelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="moneySheetVisible"
    />
    <van-action-sheet
      :actions="payActions"
      :lazy-render="false"
      @select="paySelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="paySheetVisible"
    />
    <van-action-sheet
      :actions="coinActions"
      :lazy-render="false"
      @select="tabSelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="coinSheetVisible"
    />

    <help-dialog
      confirm-button-text="__('视频演示')"
      message="__('闪电交易是原C2C业务，是通过精选OTC的供应商，通过自动化API程序实现的高效买卖方式，基本无需沟通，到账速度快，但有一定的手续费要求。')"
      :visible.sync="c2cHelpVisible"
    />

    <payin-form
      :visible.sync="payinFromVisible"
      :ad-obj="adObj"
      :amount="amount"
      :payway="payWays"
      :deal-type="checked ? 'amount' : 'money'"
      @done="resetList"
    >
      <template slot="title">
        __('一键'){{ labelArr[0] }}
      </template>
    </payin-form>
  </div>
</template>

<script lang='ts' src="./square.ts"></script>

<style lang='scss'>
.c2c-square-box.fixed{
  .order-bar{
    position: fixed;
    left: 0;
    width: 100%;
    z-index: 5;
  }
}
.c2c-square-box {
  background: var(--default-bg);
  display: flex;
  flex-direction: column;
  color: var(--theme-color);
  .m-scroll-refresh-line {
    top: 40px;
  }
  .c2c-switch {
    display: inline-flex;
    vertical-align: middle;
  }

  .order-bar-inner {
    display: flex;
    padding: 10px 15px;
    align-items: center;
    z-index: 1;
    background-color: var(--default-bg);
  }
  .sort-box {
    justify-content: space-between;
  }
  .bar-type {
    color: #fff;
    background: var(--primary-color);
    padding: 0 2px;
    height: 22px;
    border-radius: 2px;
    font-size: 16px;
    line-height: 22px;
    margin-right: 8px;
  }
  .order-sort-component {
    flex: 1;
    padding: 0;
    .sort-item{
      flex:1;
      justify-content: center;
      width: 100%;
      padding: 0;
      &:first-of-type{
        justify-content: flex-start;
      }
      &:last-of-type{
        justify-content: flex-end;
      }
    }
  }
  .tab-coin {
    flex: none;
    display: flex;
    position: relative;
    z-index: 5;
  }
  .header-tabs {
    flex: 1;
  }
  .line {
    flex: none;
  }
  .tab-sort-icon {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px 14px;
    color: #7c8792;
    &.acitve {
      color: var(--primary-color);
    }
  }
  .info-direction {
    padding-top: 10px;
    display: flex;
    .m-select-box {
      flex: 1;
    }
    .m-option {
      padding: 8px 18px;
      margin-bottom: 10px;
    }
    .direction-more {
      display: flex;
      padding: 0 10px;
      align-items: center;
    }
  }
  .trade-info {
    padding: 15px 15px 0;
    label {
      font-size: 13px;
      color: #8d959f;
    }
    .info-item {
      padding-bottom: 15px;
    }
    .info-input {
      border: 0;
      border-bottom: 1px solid var(--line-color); /* no */
      background: transparent;
      padding: 5px 0;
      font-size: 30px;
      font-weight: 600;
      .input {
        border: none;
        padding: 0;
      }
      .value {
        font-size: 30px;
        @include bold;
      }
      .placeholder {
        left: 0px;
      }
    }
    .info-switch,
    .coin,
    .money,
    .icon-down {
      vertical-align: middle;
    }
    .icon-down {
      font-size: 12px;
    }
    .coin,
    .money {
      display: inline-block;
      width: 60px;
      padding: 0 5px 0 9px;
      text-align: right;
      font-size: 18px;
      font-weight: 400;
      @include light {
        color: #2b303c;
      }
      @include dark {
        color: #7a858f;
      }
    }
  }
  .order-item {
    display: flex;
    justify-content: space-between;
    padding: 15px;
    font-size: 13px;
  }
  .user-info {
    display: flex;
    align-items: center;
    padding-top: 5px;
    .user-rank {
      position: relative;
      img {
        width: 18px;
        vertical-align: -3px;
      }
    }
    .user-name {
      padding-right: 6px;
      font-size: 16px;
      @include bold;
      @include light {
        color: #2b303c;
      }
      @include dark {
        color: #bec2cb;
      }
    }
    .user-direction {
      margin-top: 4px;
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
    .user-c2c {
      color: #fff;
      background: var(--primary-color);
      height: 22px;
      padding: 0 2px;
      border-radius: 2px; /* no */
      font-size: 16px;
      line-height: 22px;
      margin-right: 5px;
    }
  }
  .limit {
    margin-top: 10px;
    font-size: 12px;
    white-space: nowrap;
    @include light {
      color: #4b5e6d;
    }
    @include dark {
      color: #afb7c2;
    }
  }
  .user-info-img img {
    width: 42px;
    margin-right: 10px;
  }
  .item-right {
    text-align: right;
    .order-btn {
      margin-bottom: 12px;
      i {
        font-size: 24px;
        @include light {
          color: #bec8d2;
        }
        @include dark {
          color: #3c4351;
        }
      }
    }
    .order-money-type {
      margin-bottom: 8px;
      font-size: 10px;
      // color: #94A0AA;
    }
    .order-price {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.4em;
      @include light {
        color: #2b303c;
      }
      @include dark {
        color: #f4f1f1;
      }
    }
    .order-btn button {
      border: none;
      width: 68px;
      height: 22px;
      line-height: 22px;
      color: #fff;
      border-radius: 12px;
      font-size: 12px;
    }
  }
  .onekey {
    .order-item {
      .user-info {
        padding-top: 0;
      }
      .user-direction {
        margin-top: 8px;
      }
      // .limit,
      // .order-money-type{
      //   @include light{
      //     color: rgba(141, 149, 159, .43);
      //   }
      // }
      .order-money-type {
        @include dark {
          color: #8d959f;
        }
      }
    }
  }
  .one-key-warp {
    text-align: center;
    padding: 0 15px 15px;
  }
  .one-key-btn {
    position: relative;
    width: 100%;
    border: none;
    height: 42px;
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px; /* no */
    @include bold;
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      background-color: #000;
      border: inherit;
      border-color: #000;
      border-radius: inherit;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      opacity: 0;
    }
    &:active::before {
      opacity: 0.1;
    }
  }
  .order-list {
    &.empty {
      flex: 1;
      .nodata-box {
        height: 100%;
      }
    }
    &.has-data {
      background: #f7f8fe;
      @include dark {
        background: #0f0d14;
      }
    }
    .order-item {
      border-top: 4px solid var(--line-color); /* no */
      background: var(--default-bg);
      &:first-of-type {
        border-top-width: 1px;
      }
    }
  }
  .keyboard-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 10;
  }
  .keyboard-popup {
    box-shadow: 0px 1px 5px rgb(175, 174, 174);
  }
  .keyboard-box {
    padding-bottom: 10px;
  }

  .keyboard-enter-active,
  .keyboard-leave-active {
    transition: transform 0.3s;
  }
  .keyboard-enter,
  .keyboard-leave-to {
    transform: translate3d(0, 100%, 0);
  }
}
</style>
