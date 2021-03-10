<template>
  <div v-loading="loading" class="lever-transfer-wrap">

    <assets-header
      v-show="false"
      ref="header"
      :item-click-fun="itemClickHandle"
      :propAccountType="curAccountType"
      :show-body="false"
    >
    </assets-header>

    <div class="account-selector-wrap">
      <div class="account-selector" @click="changeAccountClickHandle(fromAccount)">
        <span>{{ accountList[fromAccount] }}</span>
        <icon-arrow v-if="fromAccount !== 'present'"/>
      </div>

      <i class="swap-btn" @click="swapClickHandle"></i>

      <div class="account-selector" @click="changeAccountClickHandle(toAccount)">
        <span>{{ accountList[toAccount] }}</span>
        <icon-arrow v-if="toAccount !== 'present'"/>
      </div>
    </div>

    <div class="label-wrap" v-if="isLever">
      <span class="label">__('杠杆账户')</span>
    </div>

    <div class="input-wrap" @click="changeCoin" v-if="isLever">
      <span>{{ leverObj && leverObj.showName }}</span>
      <i class="arrow"></i>
    </div>

    <div class="label-wrap">
      <span class="label">__('币种')</span>
    </div>

    <div class="input-wrap" v-if="isLever" @click="changeLeverCoinClickHandle">
      <span>{{ leverCoinName }}</span>
      <i class="change-coin"></i>
    </div>

    <div class="input-wrap" @click="changeCoin" v-else>
      <span>{{ coinName }}</span>
      <i class="arrow"></i>
    </div>

    <div class="label-wrap">
      <span class="label">__('金额')</span>
      <span class="tip">__('可用') {{ balance }} {{ coinName }} </span>
    </div>

    <div class="input-wrap">
      <div class="field-wrap">
        <van-field
          :decimal="coinDecimal"
          :max="balance"
          :min="0"
          v-model="amount"
          itype="number"
          direction="left"
          placeholder="__('请输入划转金额')"
        ></van-field>
      </div>
      <div>
        <span class="coin-name">{{ coinName }}</span>
        <button @click="amount = balance">__('全部')</button>
      </div>
    </div>

    <div class="btn-box">
      <button @click="submitClickHandle">__('确定')</button>
    </div>

    <van-action-sheet
      :actions="accountActions"
      :lazy-render="false"
      @select="accountSelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="accountSheetVisible"
    />

  </div>
</template>

<script lang="ts" src="./transfer.ts"></script>

<style lang="scss">
.lever-transfer-wrap{
  padding: 0 15px;

  input, button{
    background: transparent;
    border: none;
    outline: none;
  }

  .account-selector-wrap{
    display: flex;
    margin: 20px 0;
    justify-content: space-between;
    align-items: center;
  }
  .account-selector{
    position: relative;
    flex: 1;
    padding: 11px 12px;
    font-size: 16px;
    border-radius: 2px;
    color: var(--new-theme-color-3);
    background-color: var(--new-theme-spacer);
    @include bold;

    .icon-arrow{
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translate(0, -50%);
    }
  }
  .swap-btn{
    display: block;
    width: 32px;
    height: 32px;
    margin: 0  16px;
    background: url('~@img/icons/zbicon-leverTransfer.svg') center no-repeat;
  }

  .label-wrap{
    display: flex;
    height: 32px;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    .label{
      color: var(--new-theme-color-3);
    }
    .tip{
      color: var(--new-theme-color);
    }
  }

  .input-wrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    border-bottom: 1px solid var(--new-theme-input); /* no */
    color: var(--new-theme-color-3);
    font-size: 16px;
    @include bold;
    .field-wrap{
      flex: 1;
    }
    .form-control{
      padding: 0;
    }
    .input-field .form-placeholder{
      left: 0;
    }

    button, .coin-name{
      padding: 0 12px;
      font-size: 16px;
      font-weight: 400;
      color: var(--new-theme-color);
    }

    button{
      border-left: 1px solid var(--new-theme-spacer); /* no */
      color: var(--primary-color);
    }
  }

  .arrow{
    &::after {
      display: inline-block;
      content: '';
      width: 8px; /* no */
      height: 8px; /* no */
      border-right: 2px solid var(--thin-color); /* no */
      border-top: 2px solid var(--thin-color); /* no */
      transform: rotate(45deg);
    }
  }
  .change-coin{
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url('~@img/icons/zbicon-changeCoin.svg') center no-repeat;
  }

  .btn-box{
    padding-top: 30px;
    button{
      width: 100%;
      height: 44px;
      border-radius: 4px;
      font-size: 16px;
      color: #FFF;
      background-color: var(--primary-color);
      @include bold;
    }
  }
}
</style>
