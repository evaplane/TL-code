<template>
  <div class="mortgage" v-loading="loading">
    <native-scroll @scroll-end="pullup" pullup @refresh="refresh" pulldown :data="mortgageDetails">
      <div :key="item.id" class="mortgage-box" v-for="item in mortgageDetails" @click="toRedemption(item.status, item.id)">
        <div class="heda-left">
          <img :src="`./img/coins/${item.borrowCoinShow.toLowerCase()}.svg`" />
          <span>__('借入'){{ item.borrowAmount }} {{ item.borrowCoinShow }}</span>
        </div>
        <div class="heda-right">
          <span :class="item.status == 1 ? 'move ' : ''">{{ item.statusShow }}</span>
          <img src="@/assets/img/assets/loan/listArrow01.png" />
        </div>
        <div class="mortgage-information">
          <div class="information-item">
            <div>__('抵押资产')</div>
            <div>{{ item.mortgageCoinShow }}</div>
          </div>
          <div class="information-item">
            <div>__('年利率')</div>
            <div>{{ item.borrowRateShow }}</div>
          </div>
          <div class="information-item">
            <div>__('到期时间')</div>
            <div>{{ item.latestRedeemTime | date('YYYY-MM-DD') }}</div>
          </div>
        </div>
        <div class="mortgage-money" v-if="item.status == 1">
          <div class="money-left">__('风险率') &nbsp;&gt;{{ item.riskShow }}</div>
          <div class="money-right">
            <div
              class="margin-btn"
              @click.stop="$router.push({ name: 'loan-cashDeposit', query: { id: item.id, type: 'additionalDeposit' } })"
            >
              __('增加保证金')
            </div>
            <div
              class="redemption-btn"
              @click.stop="$router.push({ name: 'loan-redemption', query: { id: item.id, type: 'redemptionAssets' } })"
            >
              __('赎回')
            </div>
          </div>
        </div>
      </div>
      <no-data :visible="!mortgageDetails.length && !loading" />
    </native-scroll>
    <div>
      <van-popup :value="myIshow" position="top" :style="{ height: '296px' }" get-container="body" @click-overlay="toSWitch">
        <div class="loan-header ">
          <div @click="toSWitch"><icon-return /></div>
          <img v-if="$route.meta.showFilter" src="@img/assets/loan/loan-filter.svg" @click="toSWitch" />
        </div>
        <div class="screening-box">
          <div class="all-types">
            <h2 class="alltype-title">__('所有类型')</h2>
            <div class="alltype-black">
              <div v-for="(item, i) in typeList" :key="i" @click="isActive = i" class="item" :class="{ active: isActive == i }">
                {{ item }}
              </div>
            </div>
            <div class="alltype-btn">
              <div class="reset" @click.stop="queryType()">__('筛选')</div>
              <div class="screening" @click="toSWitch">__('重置')</div>
            </div>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getMortgageRecordList, IDoAddMortgageResponse } from '@/api/assets';
@Component
export default class Mortgage extends Vue {
  pageIndex: number = 1;
  pageSize: number = 8;
  isActive: number = 0;
  status: number = 0; // 为了不使选中的时候就筛选
  typeList: string[] = ['全部', '计息中', '已赎回', '平仓中', '已平仓'];
  mortgageDetails: IDoAddMortgageResponse[] = [];
  show: boolean = false;
  loading: boolean = true;
  get myIshow() {
    return this.$route.query.according === 'true';
  }
  created() {
    this.getPledgeList();
  }
  async getPledgeList() {
    try {
      let res = await getMortgageRecordList(this.pageIndex, this.pageSize, this.status);
      this.mortgageDetails = this.mortgageDetails.concat(res.records);
    } catch (error) {
    }
    this.loading = false;
  }
  toRedemption(status: number, id: number) {
    let detailsId = String(id);
    if (status === 1) {
      this.$router.push({ name: 'loan-redemption', query: { id: detailsId, type: 'redemptionAssets' } });
    }
    if (status === 2 || status === 3) {
      this.$router.push({ name: 'loan-money-details', query: { id: detailsId, type: 'mortgageRecord' } });
    }
  }
  // 筛选
  queryType() {
    this.status = this.isActive;
    this.mortgageDetails = [];
    this.pageIndex = 1;
    this.toSWitch();
    this.getPledgeList();
  }
  pullup() {
    this.pageIndex++;
    this.getPledgeList();
  }
  async refresh() {
    this.loading = true;
    this.mortgageDetails = [];
    this.pageIndex = 1;
    await this.getPledgeList();
  }
  toSWitch() {
    this.$router.replace({ query: { according: 'false' } });
  }
}
</script>
<style lang="scss">
.loan-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  color: #999999ff;
}
.mortgage {
  height: 100%;
  display: flex;
  flex-direction: column;
  .heda-left {
    font-size: 16px;
    @include dark {
      color: var(--heavy-color);
    }
    @include light {
      color: var(--new-theme-color-6);
    }
    line-height: 22px;
    display: flex;
    align-content: center;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  .heda-right {
    display: flex;
    align-content: center;
    align-items: center;
    span {
      font-size: 14px;
      color: rgba(153, 153, 153, 1);
      cursor: pointer;
      margin-right: 5px;
    }
    .move {
      color: var(--buy-color);
    }
  }
  .mortgage-information {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    width: 100%;
    .information-item:nth-child(3) {
      text-align: right;
    }
  }
  .information-item {
    position: relative;
    line-height: 23px;
    div:nth-child(1) {
      font-size: 12px;
      @include light {
        color: rgba(153, 153, 153, 1);
      }
      @include dark {
        color: var(--new-theme-color);
      }
    }
    div:nth-child(2) {
      font-size: 14px;
      @include light {
        color: #3c4351;
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
      margin-bottom: 5px;
    }
  }

  .money-right {
    width: 178px;
    display: flex;
    justify-content: space-between;
    height: 28px;
    line-height: 28px;
    font-weight: 600;
    text-align: center;
    font-size: 14px;
    .margin-btn {
      width: 90px;
      border-radius: 3px;
      color: var(--buy-color);
      border: 1px solid var(--buy-color); /* no */
    }
    .redemption-btn {
      width: 80px;
      background: var(--buy-color);
      border-radius: 3px;
      color: var(--new-theme-bg);
      background-color: var(--buy-color);
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
  }
  .mortgage-money {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-bottom: 12px;
    width: 100%;
    .money-left {
      font-size: 14px;
      line-height: 28px;
      color: var(--buy-color);
    }
  }
}
.mortgage-box {
  padding: 12px 15px 0px 15px;
  display: flex;
  justify-content: space-between;
  @include dark {
    border-bottom: 1px solid var(--new-theme-bg); /* no */
  }
  @include light {
    border-bottom: 1px solid #f2f4fc; /* no */
  }
  flex-wrap: wrap;
  flex: 1;
}
.screening-box {
  top: 0px;
  width: 100%;
  height: 296px;
  background-color: var(--theme-bg);
  .all-types {
    padding: 0 20px;
  }
  .alltype-title {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background: var(--theme-bg);
    font-size: 16px;
    font-weight: 600;
    @include dark {
      color: var(--new-theme-color-3);
    }
    @include light {
      color: rgba(51, 51, 51, 1);
    }
  }
  .alltype-btn {
    margin-top: 40px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 16px;
    text-align: center;
    .reset {
      width: 159px;
      border-radius: 4px;
      border: 1px solid var(--buy-color); /* no */
      color: var(--buy-color);
    }
    .screening {
      width: 161px;
      background: var(--buy-color);
      border-radius: 4px;
      @include light {
        color: var(--new-theme-bg);
      }
      @include dark {
        color: var(--new-theme-bg);
      }
    }
  }
  .alltype-black {
    overflow: hidden;
    .item {
      width: 100px;
      height: 30px;
      background: rgba(242, 244, 252, 1);
      border-radius: 2px;
      font-size: 13px;
      color: rgba(153, 153, 153, 1);
      line-height: 30px;
      margin-top: 10px;
      text-align: center;
      float: left;
      margin-right: 11px;
    }
    .active {
      border: 1px solid var(--buy-color); /* no */
      color: var(--buy-color);
    }
  }
}

.nodata-box {
  height: 100%;
}
.loading-box {
  height: 300px;
}
</style>
