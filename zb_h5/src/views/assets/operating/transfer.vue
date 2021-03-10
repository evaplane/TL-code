<template>
  <div class="assets-transfer">
    <div class="assets-box">
      <div class="assets-box-wrap">
        <div class="transfer-operate">
          <div class="item" @click="fromAccountSheetVisible = true">
            <p>{{ formAccountLabel }}</p>
            __('账户')
            <span></span>
          </div>
          <div class="arrow">
            <span></span>
            <span></span>
          </div>
          <div class="item" @click="toAccountSheetVisible = true">
            <p>{{ toAccountLabel }}</p>
            __('账户')
            <span></span>
          </div>
        </div>

        <div class="input-wrap" v-if="mixinsIsLever" @click="changeLeverCoin">
          <div class="input-control">
            <p class="coin-name">{{ coinName }}</p>
          </div>
          <div class="input-unit">
            <i class="change-coin"></i>
          </div>
        </div>

        <div class="input-wrap">
          <div class="input-control">
            <van-field
              :min="0"
              :max="fromAccountBalance"
              placeholder="__('请输入划转数量')"
              direction="left"
              itype="number"
              v-model="amount"
            ></van-field>
            <!-- <input placeholder="__('请输入划转数量')" type="text" v-model="amount" />
            <span class="placeholder">__('请输入划转数量')</span> -->
          </div>
          <div class="input-unit">{{ coinName }}</div>
        </div>
        <p class="amount-tips">__('最多：'){{ fromAccountBalance }} {{ coinName }}</p>
        <div class="btn-wrap">
          <a class="btn btn-red" href="javascript:;" @click="transferClickHanlde">__('划转')</a>
        </div>
      </div>
    </div>
    <div class="assets-record">
      <div class="record-title">__('划转记录')</div>
      <!-- <div class="record-list">
        <div class="record-item">
          <dl class="item-left">
            <dt class="label">基本账户 到 理财账户</dt>
            <dd class="time">2019-12-12 13:19:28</dd>
          </dl>
          <dl class="item-right">
            <dt class="price">123.12434</dt>
          </dl>
        </div>
        <div class="record-item">
          <dl class="item-left">
            <dt class="label">基本账户 到 理财账户</dt>
            <dd class="time">2019-12-12 13:19:28</dd>
          </dl>
          <dl class="item-right">
            <dt class="price">123.12434</dt>
          </dl>
        </div>
        <div class="record-item">
          <dl class="item-left">
            <dt class="label">基本账户 到 理财账户</dt>
            <dd class="time">2019-12-12 13:19:28</dd>
          </dl>
          <dl class="item-right">
            <dt class="price">123.12434</dt>
          </dl>
        </div>
      </div> -->
    </div>

    <van-action-sheet
      v-model="fromAccountSheetVisible"
      :actions="allAccountActions"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      @select="fromAccountSelectHandle"
    />
    <van-action-sheet
      v-model="toAccountSheetVisible"
      :actions="toAccountActions"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      @select="toAccountSelectHandle"
    />

    <transfer-confirm
      :visible.sync="transferConfirmVisible"
      :from="fromAccount"
      :to="toAccount"
      :amount="amount"
      :mortgage-coin="mixinsMortgageCoin"
      :activity-coin="mixinsActivityCoin"
      @done="transferDoneHandle"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import mixinsAccountCommomData, { IActions } from '@/mixins/assets/account-common-data';
import transferConfirm from '@/components/assets/transfer-comfirm.vue';
import { gt } from '@/utils/math';

@Component({
  components: {
    transferConfirm
  }
})
export default class AssetsTransfer extends Mixins(mixinsAccountCommomData) {
  fromAccountSheetVisible: boolean = false;
  toAccountSheetVisible: boolean = false;
  fromAccount: IActions | null = null;
  toAccount: IActions | null = null;

  amount: string | number = '';

  transferConfirmVisible: boolean = false;

  get formAccountLabel() {
    return this.fromAccount && this.mixinsAccountLabelMap[this.fromAccount.value];
  }

  get toAccountLabel() {
    return this.toAccount && this.mixinsAccountLabelMap[this.toAccount.value];
  }

  /** 所有账户，用于左侧账户选择 */
  get allAccountActions() {
    return this.mixinsBasicAccountActions.concat(this.mixinsSupportTransferAccountActions);
  }

  /** 右侧可选择的账户 */
  get toAccountActions() {
    if (!this.fromAccount || this.fromAccount.value === 'basic') {
      // 左侧未选择时，显示其他账户
      return this.mixinsSupportTransferAccountActions;
    } else {
      /** 选择基本账户之后，右侧可以选择其他账户；选择其他账户之后，右侧只能选择基本账户 */
      return this.mixinsBasicAccountActions;
    }
  }

  /** 当前币种的名称 */
  get coinName() {
    const coinName = this.$route.query.coin + '' || '';
    return coinName.toUpperCase();
  }

  /** 左侧账户余额 */
  get fromAccountBalance() {
    if (!this.fromAccount) {
      return '0';
    } else if (this.fromAccount.value === 'basic' && this.mixinsSpotCoin) {
      // 现货账户余额
      return this.mixinsSpotCoin.available;
    } else if (this.fromAccount.value === 'mortgage' && this.mixinsMortgageCoin) {
      // 理财账户余额
      return this.mixinsMortgageCoin.available;
    } else if (this.fromAccount.value === 'activity' && this.mixinsActivityCoin) {
      // 活动账户余额
      return this.mixinsActivityCoin.available;
    } else if (this.fromAccount.value === 'lever' && this.mixinsLeverCoin) {
      // 杠杆账户余额
      return this.coinName === this.mixinsLeverCoin.cShowName ? this.mixinsLeverCoin.cAvailable : this.mixinsLeverCoin.fAvailable;
    }
    return '--';
  }

  @Watch('toAccountActions', { immediate: true, deep: true })
  toAccountActionsWatcher(toAccountActions: IActions[]) {
    if (toAccountActions.length) {
      this.setToAccount();
    }
  }

  /** 切换杠杆币种 */
  changeLeverCoin() {
    if (!this.mixinsLeverCoin) {
      return null;
    }
    const params = Object.assign({}, this.$route.params);
    const query = Object.assign({}, this.$route.query);
    const coin = query.coin || '';
    query.coin = coin === this.mixinsLeverCoin.cShowName ? this.mixinsLeverCoin.fShowName : this.mixinsLeverCoin.cShowName;
    this.$router.replace({
      name: this.$route.name,
      params,
      query
    });
  }

  /** 点击划转按钮 */
  transferClickHanlde() {
    if (!this.amount) {
      return this.$message.warn('__("请输入划转数量")');
    } else if (gt(this.amount, this.fromAccountBalance)) {
      return this.$message.fail('__("划转数量超过最大值")');
    }
    this.transferConfirmVisible = true;
  }

  /** 左侧账户切换 */
  fromAccountSelectHandle(acconut: IActions) {
    this.fromAccount = acconut;
    this.fromAccountSheetVisible = false;
  }
  /** 右侧账户切换 */
  toAccountSelectHandle(acconut: IActions) {
    this.toAccount = acconut;
    this.toAccountSheetVisible = false;
  }

  /** 根据路由设置右侧账户 */
  setToAccount() {
    const type = this.$route.params && this.$route.params.type;
    this.toAccount = this.toAccountActions.find((account): boolean => account.value === type) || this.toAccountActions[0];
  }

  /** 划转成功 */
  transferDoneHandle() {
    this.amount = '';
    // 转账成功之后重新获取账户余额
    this.mixinsRefreshAssets();
  }

  mounted() {
    this.mixinsInitAssets();
    // 左侧默认为基本账户
    this.fromAccount = this.allAccountActions[0];
  }
}
</script>
