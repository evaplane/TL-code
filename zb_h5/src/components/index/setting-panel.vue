<template>
  <div class="setting-popup" ref="setting">
    <transition name="menu">
      <div class="setting-panel" :class="{ open: isOpen }" v-if="settingVisible">
        <div class="setting-wrap">
          <div class="setting-head">
            <h1>个人中心</h1>
            <span class="close-btn" @click="updateSettingVisible(false)"><i></i></span>
          </div>
          <div class="setting-body">
            <native-scroll>
              <div class="setting-list">
                <div class="setting-item setting-item-user" v-if="isLogin === false">
                  <div class="user-img">
                    <img src="@img/user.png" />
                  </div>
                  <div class="user-entrance">
                    <span v-login class="login-btn">登录</span>
                    <span v-register class="register-btn">注册</span>
                  </div>
                </div>
                <div class="setting-item setting-item-user" v-else @click="showUserInfo">
                  <div class="user-img">
                    <img src="@img/user.png" />
                  </div>
                  <div class="user-info">
                    <h2>{{ userInfo.userName }}</h2>
                    <p><span class="state">已实名</span></p>
                  </div>
                  <div class="right"><span class="arrow"></span></div>
                </div>
                <div class="setting-space"></div>
                <div class="setting-list-group">
                  <div class="setting-item">
                    <div class="label">夜间模式</div>
                    <div class="right">
                      <m-switch v-model="themeType" @change="changeHandle" />
                    </div>
                  </div>
                  <div class="setting-item" @click="showSafeSetting">
                    <div class="label">安全中心</div>
                    <div class="right">
                      <span class="arrow"></span>
                    </div>
                  </div>
                  <div class="setting-item">
                    <div class="label">帮助中心</div>
                    <div class="right">
                      <span class="arrow"></span>
                    </div>
                  </div>
                  <div class="setting-item">
                    <div class="label">分享赚佣金</div>
                    <div class="right">
                      <span class="arrow"></span>
                    </div>
                  </div>
                </div>
                <!-- <li class="style-item setting-language">
                <div class="label">语言切换</div>
                <div class="right">
                  <span class="icon"><img src="@img/index/en.svg"/></span>
                  <span class="text">En</span>
                  <span class="arrow"></span>
                </div>
              </li> -->
                <div class="setting-space"></div>
                <div class="setting-list-group">
                  <div class="setting-item setting-item-legal">
                    <div class="setting-title">法币</div>
                    <ul class="legal-list">
                      <li
                        class="legal-item"
                        :class="{ 'legal-item--active': currencyType === 'rmb' }"
                        @click="currencyType = 'rmb'"
                      >
                        <span class="icon">¥</span>
                        <span class="en">CNY</span>
                        <span class="cn">人民币</span>
                      </li>
                      <li
                        class="legal-item"
                        :class="{ 'legal-item--active': currencyType === 'usd' }"
                        @click="currencyType = 'usd'"
                      >
                        <span class="icon">$</span>
                        <span class="en">USD</span>
                        <span class="cn">美元</span>
                      </li>
                      <li
                        class="legal-item"
                        :class="{ 'legal-item--active': currencyType === 'euro' }"
                        @click="currencyType = 'euro'"
                      >
                        <span class="icon">€</span>
                        <span class="en">EUR</span>
                        <span class="cn">欧元</span>
                      </li>
                      <li
                        class="legal-item"
                        :class="{ 'legal-item--active': currencyType === 'yen' }"
                        @click="currencyType = 'yen'"
                      >
                        <span class="icon">円</span>
                        <span class="en">YEN</span>
                        <span class="cn">日元</span>
                      </li>
                    </ul>
                  </div>
                  <div class="setting-item">
                    <div class="label">行情价格折算成主要法币</div>
                    <div class="right"><m-switch v-model="conversionType" /></div>
                  </div>
                </div>
                <div class="setting-space"></div>
                <div class="setting-item setting-item-upsdowns">
                  <div class="setting-title">涨跌习惯</div>
                  <ul class="upsdowns-list">
                    <li
                      class="upsdowns-item"
                      :class="{ 'upsdowns-item--active': tradingColor === 'default' }"
                      @click="tradeTypeChange('default')"
                    >
                      红涨绿跌
                      <p class="trading-buy-bg">100%<img src="@img/index/up.svg" /></p>
                      <span class="radio"></span>
                    </li>
                    <li
                      class="upsdowns-item"
                      :class="{ 'upsdowns-item--active': tradingColor === 'reverse' }"
                      @click="tradeTypeChange('reverse')"
                    >
                      绿涨红跌
                      <p class="trading-sell-bg">100%<img src="@img/index/up.svg" /></p>
                      <span class="radio"></span>
                    </li>
                  </ul>
                </div>
                <div class="setting-large-space"></div>
              </div>
            </native-scroll>
          </div>
          <!-- <entrance-popup :visible.sync="entranceVisible" /> -->
        </div>
      </div>
    </transition>
    <transition name="left">
      <user-info :type.sync="formType" v-if="formType.indexOf('info') > -1" />
    </transition>
    <transition name="left">
      <safe-setting :type.sync="formType" v-if="formType.indexOf('safe') > -1" />
    </transition>
    <transition name="left">
      <set-mobile :type.sync="formType" v-if="formType.indexOf('phone') > -1" />
    </transition>
    <transition name="left">
      <set-email :type.sync="formType" v-if="formType.indexOf('email') > -1" />
    </transition>
    <transition name="left">
      <set-password :type.sync="formType" v-if="formType.indexOf('password') > -1" />
    </transition>
  </div>
</template>

<script lang='ts' src="./setting-panel.ts" />

<style lang='scss'>
.menu-enter,
.menu-leave-active {
  transform: translateY(-30px);
  opacity: 0;
}
.left-enter,
.left-leave-active {
  transform: translateX(100%);
}
.entrance-extend-popup {
  background: transparent;
}
.setting-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 200;
  transition: all 0.3s;
  .setting-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    color: var(--default-color);
    font-size: 12px;
    background-color: #f3f4f9;
    @include dark {
      background-color: #000;
    }
  }
  .close-btn {
    margin-left: auto;
    i {
      display: block;
      width: 19px; /* no */
      height: 19px; /* no */
      margin: -1px -1px 0 0;
      transform: rotate(45deg);
      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        height: 1px; /* no */
        background-color: #8e96a7;
      }
      &:after {
        transform: rotate(90deg);
      }
    }
  }
  .setting-head {
    flex: none;
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: 60px;
    background-color: #000;
    .head-return {
      display: inline-block;
      vertical-align: middle;
      width: 12px;
      height: 12px;
      border-left: 2px solid #dad9e2; /* no */
      border-bottom: 2px solid #dad9e2; /* no */
      transform: rotate(45deg);
      margin-left: 3px;
    }
    h1 {
      font-size: 22px;
      @include bold;
      color: #dad9e2;
    }
    .head-title {
      font-size: 18px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .setting-body {
    flex: 1;
    overflow: hidden;
  }
  .setting-large-space {
    height: 30px;
  }
  .setting-space {
    height: 6px;
  }
  .setting-title {
    padding-top: 15px;
    margin-bottom: -5px;
    font-size: 12px;
  }
  .setting-list {
    .setting-item {
      position: relative;
      min-height: 54px;
      padding: 0 20px;
      display: flex;
      font-size: 16px;
      background-color: var(--default-bg);
      .label {
        color: var(--heavy-color);
        display: flex;
        align-items: center;
      }
      .right {
        margin-left: auto;
        display: flex;
        align-items: center;
        font-size: 14px;
      }
      .arrow {
        width: 8px; /* no */
        height: 8px; /* no */
        border-top: 1px solid var(--thin-color); /* no */
        border-right: 1px solid var(--thin-color); /* no */
        transform: rotate(45deg);
        margin: 0 2px 0 5px;
      }
      .avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2); /* no */
        @include dark {
          border-color: rgba(255, 255, 255, 0.1);
        }
        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
    }
    .setting-list-group {
      .setting-item {
        border: none;
        &:not(:first-of-type)::after {
          content: '';
          position: absolute;
          left: 20px;
          right: 0;
          top: 0;
          height: 1px; /* no */
          background-color: #000;
          opacity: 0.04;
          @include dark {
            background-color: #fff;
          }
        }
      }
    }
    .setting-item-user {
      height: 76px;
      align-items: center;
      .user-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.2); /* no */
        @include dark {
          border-color: rgba(255, 255, 255, 0.1);
        }
        img {
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
      .user-info {
        margin-left: 10px;
        h2 {
          font-size: 18px;
          @include bold;
          color: var(--heavy-color);
        }
        p {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          .state {
            display: inline-block;
            font-size: 12px;
            background-color: var(--primary-color);
            color: #fff;
            padding: 3px 5px;
            border-radius: 2px; /* no */
          }
        }
      }
      .user-entrance {
        display: flex;
        span {
          font-size: 18px;
          padding: 15px;
          @include bold;
          color: var(--heavy-color);
          &.register-btn {
            color: var(--primary-color);
            position: relative;
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 15px;
              bottom: 15px;
              width: 1px;
              background-color: rgba(0, 0, 0, 0.1);
              @include dark {
                background-color: rgba(255, 255, 255, 0.1);
              }
            }
          }
        }
      }
    }
    .setting-item-legal {
      display: block;
      .legal-list {
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
      }
      .legal-item {
        flex: none;
        width: calc((100% - 60px) / 4);
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 2px; /* no */
        padding: 15px 0;
        border: 1px solid #eeeff5; /* no */
        @include dark {
          border-color: rgba(255, 255, 255, 0.08);
        }
        .icon {
          width: 26px; /* no */
          height: 26px; /* no */
          line-height: 26px; /* no */
          border-radius: 50%;
          font-size: 14px;
          color: #e91c41;
          text-align: center;
          border: 1px solid #e5e6ec; /* no */
          @include dark {
            border-color: rgba(255, 255, 255, 0.08);
          }
        }
        .en {
          margin: 8px 0 3px 0;
        }
        .cn {
          font-size: 10px;
        }
        &.legal-item--active {
          color: var(--heavy-color);
          border-color: var(--primary-color);
          .icon {
            background-color: var(--primary-color);
            color: #fff;
            border-color: var(--primary-color);
          }
        }
      }
    }
    .setting-item-upsdowns {
      display: block;
      .upsdowns-list {
        display: flex;
        justify-content: space-between;
        padding: 20px 0;
      }
      .upsdowns-item {
        flex: none;
        width: calc((100% - 20px) / 2);
        padding: 15px;
        border-radius: 2px; /* no */
        font-size: 14px;
        border: 1px solid #eeeff5; /* no */
        @include dark {
          border-color: rgba(255, 255, 255, 0.08);
        }
        position: relative;
        p {
          color: #fff;
          border-radius: 2px; /* no */
          margin-top: 15px;
          font-size: 12px;
          padding: 5px 0;
          text-align: center;
        }
        .radio {
          position: absolute;
          right: 15px;
          top: 12px;
          width: 20px; /* no */
          height: 20px; /* no */
          border: 1px solid #e5e6ec; /* no */
          @include dark {
            border-color: rgba(255, 255, 255, 0.08);
          }
          border-radius: 50%;
        }
        &.upsdowns-item--active {
          color: var(--heavy-color);
          border-color: var(--primary-color);
          .radio {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            &::after {
              content: '';
              position: absolute;
              left: 7px; /* no */
              top: 2px; /* no */
              width: 5px; /* no */
              height: 10px; /* no */
              border-right: 1px solid #fff; /* no */
              border-bottom: 1px solid #fff; /* no */
              transform: rotate(45deg);
            }
          }
        }
      }
      .trading-sell-bg {
        background-color: #40d090;
      }
      .trading-buy-bg {
        background-color: #e91c41;
      }
    }
  }
  .setting-edit {
    min-height: 100%;
    padding: 20px;
    background-color: #f3f4f9;
    @include dark {
      background-color: #100f17;
    }
    .current-info {
      margin-bottom: 20px;
      text-align: center;
      h3 {
        font-size: 14px;
        font-weight: normal;
      }
      p {
        font-size: 22px;
        font-weight: 500;
        margin-top: 8px;
      }
    }
    .edit-title {
      font-size: 14px;
      padding: 10px 0;
    }
    .edit-item {
      height: 50px;
      background-color: #fff;
      @include dark {
        background-color: #1f1f2b;
      }
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .credentials-wrap {
      .credentials-img {
        padding: 15px;
        background-color: var(--default-bg);
        @include dark {
          background-color: #25232d;
        }
        border-radius: 4px;
        img {
          width: 100%;
          vertical-align: middle;
        }
      }
      .credentials-tips {
        margin-top: 15px;
        font-size: 13px;
        line-height: 1.5;
        .tips-label {
          display: flex;
          align-items: center;
          font-size: 14px;
          line-height: 14px;
          font-weight: normal;
          .icon-tips {
            width: 18px; /* no */
            height: 18px; /* no */
            background-color: var(--primary-color);
            border-radius: 50%;
            margin-right: 5px;
            position: relative;
            &::before,
            &::after {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              margin: 0 auto;
              width: 2px; /* no */
              background-color: #fff;
              border-radius: 10px;
            }
            &::before {
              height: 8px; /* no */
              top: 3px; /* no */
            }
            &::after {
              height: 2px; /* no */
              bottom: 3px; /* no */
            }
          }
        }
        p {
          margin-top: 8px;
          color: var(--thin-color);
        }
      }
    }
    .edit-button {
      margin-top: 30px;
      button {
        width: 100%;
        height: 46px; /* no */
        font-size: 16px; /* no */
        color: #fff;
        background-color: var(--primary-color);
        border-radius: 2px;
        font-weight: 500;
        border: none;
        outline: none;
      }
    }
  }
}
</style>
