<template>
  <div class="record-details">
    <back class="loan-header">
      <img v-if="$route.meta.showFilter" src="@img/assets/loan/loan-filter.svg" />
    </back>
    <div class="record-box">
      <h2 v-if="loanType == 'redemptionAssets'" class="details-title">__('赎回资产')</h2>
      <h2 v-else-if="loanType == 'additionalDeposit'" class="details-title">__('添加保证金')</h2>
      <h2 v-else-if="loanType == 'mortgageRecord'" class="details-title">__('抵押记录')</h2>
      <div class="details-content">
        <div class="details-item">
          <div class="line-left">__('抵押资产')</div>
          <div class="line-right">{{ recordDetails.mortgageAmount }}</div>
        </div>
        <div class="details-item">
          <div class="line-left">__('借入资金')</div>
          <div class="line-right">{{ recordDetails.borrowAmount }}</div>
        </div>
        <div class="details-item">
          <div class="line-left">__('应还资金')</div>
          <div class="line-right">{{ shouldMoney }}</div>
        </div>
        <div class="details-item">
          <div class="line-left">__('借款利率')</div>
          <div class="line-right">{{ recordDetails.borrowRateShow }}</div>
        </div>
        <div class="details-item">
          <div class="line-left">__('借款期限')</div>
          <div class="line-right">{{ recordDetails.borrowCycleShow }}</div>
        </div>
        <div class="details-item">
          <div class="line-left">__('已产生利息')</div>
          <div class="line-right">{{ recordDetails.arrearsLx }}</div>
        </div>
        <div class="details-item" v-if="loanType != 'mortgageRecord'">
          <div class="line-left">__('风险率')</div>
          <div class="line-right">{{ recordDetails.riskShow }}</div>
        </div>
        <div class="details-item">
          <div class="line-left">__('借款时间')</div>
          <div class="line-right">{{ recordDetails.createTime | date('YYYY-MM-DD') }}</div>
        </div>
        <div class="details-item">
          <div class="line-left">__('到期时间')</div>
          <div class="line-right">{{ recordDetails.latestRedeemTime | date('YYYY-MM-DD') }}</div>
        </div>
        <div class="details-item" v-if="loanType == 'mortgageRecord'">
          <div class="line-left">__('状态')</div>
          <div class="line-right">{{ recordDetails.statusShow }}</div>
        </div>
      </div>
      <!-- 赎回资产 -->
      <div v-if="$route.query.type == 'redemptionAssets'" class="marginTitle">
        <div class="details-repay">
          <div class="repay-left">__('应还金额')</div>
          <div class="repay-right">
            <span>__('可用金额') {{ available }} {{ recordDetails.borrowCoinShow }}</span>
          </div>
        </div>
        <div class="sum">
          <div class="sum-left">{{ shouldMoney }}</div>
          <div class="sum-right">{{ recordDetails.borrowCoinShow }}</div>
        </div>
        <div class="details-btn" @click="redemption">__('立即赎回')</div>
      </div>
      <!-- 添加补仓金额 -->
      <div v-if="$route.query.type == 'additionalDeposit'" class="marginTitle">
        <div class="details-repay">
          <div class="repay-left">__('补仓金额')</div>
          <div class="repay-right">
            <span>__('可用金额') {{ available }} {{ recordDetails.borrowCoinShow }}</span>
          </div>
        </div>
        <div class="sum">
          <input type="text" class="sum-left" placeholder="请输入补仓金额" v-model="coverAmount" />
          <div class="sum-right">{{ recordDetails.borrowCoinShow }}</div>
        </div>
        <div class="details-btn" @click="increaseMargin">__('提交')</div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import back from '@/components/index/back.vue';
import { mortgageRecordDetail, IDoAddMortgageResponse, doRedemptiveCapital, doIncreaseMortgage } from '@/api/assets';
import { Component, Vue } from 'vue-property-decorator';
import { plus } from '@/utils/math';
type TLoanType = 'additionalDeposit' | 'redemptionAssets' | 'mortgageRecord';
@Component({
  components: {
    back
  }
})
export default class AssetsDetails extends Vue {
  // eslint-disable-next-line
  recordDetails = {} as IDoAddMortgageResponse;
  available: string = ''; // 可用金额
  coverAmount: string = ''; // 输入保证金

  created() {
    this.getMortgageDetails();
  }
  get loanType() {
    return this.$route.query.type as TLoanType;
  }
  get loanId() {
    return this.$route.query.id as string;
  }
  get shouldMoney(): string {
    if (this.recordDetails.borrowAmount !== undefined && this.recordDetails.arrearsLx !== undefined) {
      return plus(this.recordDetails.borrowAmount, this.recordDetails.arrearsLx);
    }
    return '';
  }
  // 获取用户抵押记录详情
  async getMortgageDetails() {
    try {
      let res = await mortgageRecordDetail(this.loanId);
      this.recordDetails = res.record;
      this.available = res.borrowCoinAvailable;
    } catch (err) { }
  }
  // 赎回资金
  async redemption() {
    try {
      let res = await doRedemptiveCapital(this.loanId, false);
      if (this.loanType === 'redemptionAssets' && res === undefined) {
        this.$message.success('__("赎回资产成功")');
        this.$router.go(-1);
      }
    } catch (err) { }
  }
  // 增加保证金
  async increaseMargin() {
    try {
      let result = await doIncreaseMortgage(this.loanId, this.coverAmount);
      if (this.loanType === 'additionalDeposit' && result === undefined) {
        this.$message.success('__("添加保证金成功")');
        this.$router.go(-1);
      }
    } catch (err) { }
  }
}
</script>

<style lang='scss'>
.record-box {
  padding: 0 20px;
}
.record-details {
  box-sizing: border-box;
  .loan-header {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
  }
  .details-title {
    height: 40px;
    font-size: 28px;
    font-weight: 600;
    line-height: 40px;
    margin-top: 8px;
    @include light {
      color: var(--new-theme-color-3);
    }
    @include dark {
      color: var(--new-theme-color-3);
    }
  }
  .details-content {
    height: 268px;
    background: rgba(242, 244, 252, 1);
    border-radius: 2px;
    margin-top: 16px;
    padding: 8px 12px;
    .details-item {
      font-size: 14px;
      font-weight: 600;
      display: flex;
      line-height: 28px;
      justify-content: space-between;
      .line-left {
        color: rgba(153, 153, 153, 1);
      }
      .line-right {
        color: rgba(51, 51, 51, 1);
      }
    }
  }
  .details-repay {
    margin-top: 12px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    .repay-left {
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
    .repay-right {
      color: rgba(153, 153, 153, 1);
    }
  }
  .sum {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc; /* no */
    .sum-left {
      font-size: 16px;
      font-weight: 600;
      border: none;
      letter-spacing: 1px; /* no */
      background-color: transparent;
      @include light {
        color: rgba(153, 153, 153, 1);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
    .sum-left::placeholder {
      @include light {
        color: rgba(204, 204, 204, 1);
      }
      @include dark {
        color: var(--new-theme-color-c);
      }
    }
    .sum-right {
      font-size: 16px;
      font-weight: 400;

      @include light {
        color: rgba(153, 153, 153, 1);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
  }
  .details-btn {
    margin-top: 40px;
    letter-spacing: 1px; /* no */
    height: 44px;
    background: var(--buy-color);
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    line-height: 44px;
    text-align: center;
    @include light {
      color: var(--new-theme-bg);
    }
    @include dark {
      color: var(--new-theme-color-3);
    }
  }
}
</style>
