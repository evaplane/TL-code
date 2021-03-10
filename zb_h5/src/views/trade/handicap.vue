<template>
  <div
    :class="[type === 'buy' ? 'buy' : 'sell', { 'input-change-animation': isInputChangeAnimation }]"
    @click="isSubmitBefore = false"
    class="handicap-box"
  >
    <native-scroll>
      <div class="handicap-top">
        <div class="lever-info" v-if="mixinsIsLever">
          <div class="lever-info-left">
            <p v-if="isLeverEnable === true">账户暂无资金，请转入资金开启杠杆</p>
            <template v-else>
              <p @click="leverShowTips">
                风险率<icon-help />
                <span :class="leverCoinInfo.status === 1 ? 'lever-status-safe' : ''">{{ leverRepayShow + leverStatusText }}</span>
              </p>
              <p>爆仓价 {{ leverUnwindPrice }}</p>
            </template>
          </div>
          <div class="lever-info-right">
            <a href="javascript:;" @click="borrowClickHandle">
              {{ isLeverEnable ? '转入资金' : '借币/还币' }}
            </a>
            <!-- 自动借币 <a href="javascript:;" v-else>
              <p>自动借币</p>
              <p>0.05%/日</p>
            </a> -->
            <span class="u-arrow" />
          </div>
        </div>
        <div class="handicap-info">
          <div class="handicap-form">
            <div class="form-tab">
              <span :class="{ active: type === 'buy' }" @click="tabChangeHandle('buy')" class="buy-btn">__('买入')</span>
              <span :class="{ active: type === 'sell' }" @click="tabChangeHandle('sell')" class="sell-btn">__('卖出')</span>
            </div>
            <div class="inp-group">
              <virtual-inp
                :border="false"
                :decimal="mixinsMoneyDecimal"
                :min="0"
                :placeholder="`${labelArr[0]}__('价格')`"
                @blur="keyboardVisible = false"
                @focus="showBoard('price')"
                @input="priceInputHandle"
                itype="number"
                v-keyboard
                v-model="params.price"
              >
                <span slot="right-icon">{{ mixinsFShowNameUp }}</span>
              </virtual-inp>
              <p class="tips">≈{{ priceConvert }}cny</p>
            </div>
            <div class="inp-group">
              <virtual-inp
                :border="false"
                :decimal="mixinsCoinDecimal"
                :max="maxAvailable"
                :min="0"
                :placeholder="canBuyCoin"
                @blur="keyboardVisible = false"
                @focus="showBoard('amount')"
                itype="number"
                v-keyboard
                v-model="params.number"
              >
                <span slot="right-icon">{{ mixinsCShowNameUp }}</span>
              </virtual-inp>
            </div>
            <div class="inp-group slider-wrap">
              <slider :marks="[0, 20, 40, 60, 80, 100]" @change="sliderDragEndHandle" v-model="sliderValue"></slider>
            </div>
            <!-- <p class="volume-tips">__('自动借入')≈{{ total + '' + mixinsFShowNameUp }}</p> -->
            <p class="volume-tips">__('交易额')≈{{ total + '' + mixinsFShowNameUp }}</p>
            <div class="inp-group">
              <!-- <van-button
              :class="{ 'submit-before': isSubmitBefore }"
              :loading="submitLoading"
              @click.stop="submit"
              class="submit-btn"
              ref="submitBtn"
              type="default"
            >{{ isSubmitBefore ? '再次确认' : '' }}{{ labelArr[0] + mixinsCShowNameUp }}</van-button>-->
              <van-button
                :class="{ 'submit-before': isSubmitBefore }"
                :loading="submitLoading"
                @click.stop="submit"
                class="submit-btn"
                ref="submitBtn"
                type="default"
                >{{ isSubmitBefore ? '再次确认' : labelArr[0] + mixinsCShowNameUp }}</van-button
              >
            </div>
            <div class="open-lever">
              开启杠杆
              <m-switch @change="openLeverChangeHandle" @click="openLeverClickHandle" v-model="isOpenLever" />
            </div>
            <div class="statistics">
              <table>
                <tr>
                  <td>可用{{ mixinsFShowNameUp }}:</td>
                  <td>{{ moneyInfo.available || '-' }}</td>
                </tr>
                <tr>
                  <td>可卖{{ mixinsCShowNameUp }}:</td>
                  <td>{{ coinInfo.available || '-' }}</td>
                </tr>
                <tr>
                  <td>可用{{ mixinsCShowNameUp }}:</td>
                  <td>{{ coinInfo.available || '-' }}</td>
                </tr>
                <tr>
                  <td>冻结{{ mixinsCShowNameUp }}:</td>
                  <td>{{ coinInfo.freez || '-' }}</td>
                </tr>
                <template v-if="mixinsIsLever">
                <tr>
                  <td>已借{{ mixinsCShowNameUp }}:</td>
                  <td>{{ leverCoinInfo.cLoanIn || '-' }}</td>
                </tr>
                <tr>
                  <td>已借{{ mixinsFShowNameUp }}:</td>
                  <td>{{ leverCoinInfo.fLoanIn || '-' }}</td>
                </tr>
                </template>
              </table>
            </div>
          </div>
          <order-book class="handicap-order" />
        </div>
      </div>
    </native-scroll>
    <transition name="keyboard">
      <div @click.stop="noop" class="keyboard-content" v-if="keyboardVisible">
        <keyboard :label="keyboardLabel" @hide="keyboardVisible = false" />
      </div>
    </transition>
    <help-dialog
      :visible.sync="leverTipsVisible"
      confirm-button-text="__('确认')"
      :message="leverForceRepayRate"
    />
  </div>
</template>

<script lang='ts' src="./handicap.ts">
</script>

<style lang='scss'>
.red-point {
  position: absolute;
  z-index: 99;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: red;
  animation: red-point 0.6s ease-out;
}
@keyframes red-point {
  0% {
    width: 16px;
    height: 16px;
  }
  100% {
    width: 6px;
    height: 6px;
  }
}
.handicap-box {
  flex: 1;
  overflow: hidden;
  &.buy {
    .submit-btn {
      background: var(--buy-color);
      &.submit-before {
        background: transparent;
        border-color: var(--buy-color); /* no */
      }
    }
    .virtual-input .input.focus {
      border-color: var(--buy-color);
    }
    &.input-change-animation {
      @include dark {
        .virtual-input .input {
          animation: buy-flicker-dark 0.5s linear 0.2s infinite;
        }
      }
      @include light {
        .virtual-input .input {
          animation: buy-flicker-light 0.5s linear 0.2s infinite;
        }
      }
    }
  }
  &.sell {
    .submit-btn {
      background: var(--sell-color);
      &.submit-before {
        background: transparent;
        border-color: var(--sell-color); /* no */
      }
    }
    .virtual-input .input.focus {
      border-color: var(--sell-color);
    }
    &.input-change-animation {
      @include dark {
        .virtual-input .input {
          animation: sell-flicker-dark 0.5s linear 0.2s infinite;
        }
      }
      @include light {
        .virtual-input .input {
          animation: sell-flicker-light 0.5s linear 0.2s infinite;
        }
      }
    }
  }
  @keyframes buy-flicker-light {
    0% {
      border: 1px solid var(--buy-color); /* no */
    }
    100% {
      border: 1px solid #e4e8ec; /* no */
    }
  }
  @keyframes buy-flicker-dark {
    0% {
      border: 1px solid var(--buy-color); /* no */
    }
    100% {
      border: 1px solid #393939; /* no */
    }
  }
  @keyframes sell-flicker-light {
    0% {
      border: 1px solid var(--sell-color); /* no */
    }
    100% {
      border: 1px solid #e4e8ec; /* no */
    }
  }
  @keyframes sell-flicker-dark {
    0% {
      border: 1px solid var(--sell-color); /* no */
    }
    100% {
      border: 1px solid #393939; /* no */
    }
  }
  .handicap-top {
    display: flex;
    flex-direction: column;
    padding-bottom: 15px;
    color: var(--default-color);
  }
  .handicap-info {
    display: flex;
    justify-content: space-between;
    flex: 1;
    padding-left: 15px;
    padding-top: 15px;
  }
  .submit-btn {
    width: 100%;
    color: #fff;
    @include bold;
    border: 1px solid transparent; /* no */
    transition: all 0.3s;
    &.submit-before {
      @include light {
        color: var(--theme-color);
      }
    }
  }
  .handicap-form {
    flex: none;
    width: calc(50% - 5px);
  }
  .handicap-order {
    flex: none;
    width: calc(50% - 5px);
  }
  .form-tab {
    display: flex;
    justify-content: space-between;
    .buy-btn,
    .sell-btn {
      flex: none;
      width: calc((100% - 6px) / 2);
      height: 34px;
      line-height: 34px;
      text-align: center;
      position: relative;
      transition: all 0.3s;
      font-size: 16px;
      z-index: 1;
      @include bold;
      &::before,
      &::after {
        transition: all 0.3s;
        content: '';
        position: absolute;
        height: 34px;
        top: 0;
        z-index: -1;
      }
      &::before {
        background-color: #f3f4f9;
      }
      &::after {
        width: 34px;
        background-color: #f3f4f9;
      }
      @include dark {
        &::before,
        &::after {
          background-color: #272534;
        }
      }
    }
    .buy-btn {
      &.active {
        color: #fff;
        &::before,
        &::after {
          background: var(--buy-color);
        }
      }
      &::before {
        left: 0;
        right: 20px;
        border-radius: 2px 0 0 2px; /* no */
      }
      &::after {
        right: 0;
        transform: skewX(-15deg);
        border-radius: 0 2px 2px 0; /* no */
      }
    }
    .sell-btn {
      &.active {
        color: #fff;
        &::before,
        &::after {
          background: var(--sell-color);
        }
      }
      &::before {
        right: 0;
        left: 20px;
        border-radius: 0 2px 2px 0; /* no */
      }
      &::after {
        left: 0;
        transform: skewX(-15deg);
        border-radius: 2px 0 0 2px; /* no */
      }
    }
  }
  .lever-info {
    display: flex;
    height: 40px;
    align-items: center;
    padding: 0 15px;
    border-bottom: 1px solid var(--line-color); /* no */
    .lever-status-safe {
      color: #40d090;
    }
    .lever-info-left {
      font-size: 12px;
      display: flex;
      flex: 1;
      .icon-help {
        vertical-align: 0px;
        width: 15px;
        height: 15px;
        margin: 0 5px;
      }
      p {
        min-width: 50%;
        line-height: 1.3;
      }
      p + p {
        text-align: center;
      }
    }
    .lever-info-right {
      width: 25.33%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      a {
        color: var(--primary-color);
        @include bold;
        font-size: 14px;
      }
      p:first-child {
        padding-bottom: 5px;
      }
    }
  }
  .inp-group {
    padding-top: 15px;
  }
  .tips {
    margin-top: 6px;
    font-size: 14px;
  }
  .volume-tips {
    margin-top: 15px;
    font-size: 14px;
  }

  .slider-wrap {
    padding-left: 6px;
    padding-right: 6px;
  }

  .keyboard-popup {
    transition: all 0.23s ease-out;
    transition-delay: 0.15s;
    background: rgba(0, 0, 0, 0);
    @include light {
      box-shadow: 0 0 10px rgba(124, 135, 146, 0.3);
    }
  }
  .keyboard-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 1;
    .slider-box {
      padding: 15px 17px 0 17px;
    }
  }
  .virtual-input .input {
    @include dark {
      .value {
        color: #fff;
      }
      border: 1px solid rgba(255,255,255,.1); /* no */
      background-color: rgba(0,0,0,.5);
    }
  }
  .extend-title {
    color: var(--theme-color);
    font-weight: 500;
    font-size: 13px;
    &.active {
      .icon {
        transform: rotate(180deg);
      }
    }
    .icon {
      font-size: 12px;
      vertical-align: middle;
      transition: all 0.3s;
      display: inline-block;
    }
  }
  .open-lever {
    font-size: 14px;
    margin: 20px 0 8px 0;
    color: #313038;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @include dark {
      color: #8d9ba8;
    }
  }
  .statistics {
    table {
      border-collapse:collapse;
      border-spacing:0;
    }
    td {
      padding: 6px 0;
      vertical-align: middle;
    }
    td:first-of-type {
      padding-right: 5px;
    }
    td:last-of-type {
      font-size: 14px;
      color: var(--title-color);
    }
  }
  .van-button {
    height: 46px;
    line-height: 46px;
  }

  .handicap-bottom {
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid var(--border-color); /* no */
      h3 {
        font-size: 16px;
        color: #333;
        @include dark {
          color: #d7dce2;
        }
      }
      .all-btn {
        border-radius: 20px;
        font-size: 12px;
        padding: 5px 10px;
        background: #e9e9ee;
        color: var(--theme-color);
        @include dark {
          background: #272533;
          color: var(--theme-color);
        }
      }
    }
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
