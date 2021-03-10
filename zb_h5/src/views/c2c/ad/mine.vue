<template>
  <div class="ad-mine">
    <header-back>
      <p>__('我的广告')</p>
    </header-back>
    <div class="tab-status">
      <tab @change="tabChangeHandle" v-model="tabStatus">
        <tab-item :key="key" :name="item.value" v-for="(item, key) in mixinsAdTypeActions">{{ item.name }}</tab-item>
      </tab>

      <i
        :class="{ acitve: adFilterVisible }"
        @click="adFilterVisible = !adFilterVisible"
        class="tab-sort-icon zbicon-zbicon-filter"
      ></i>
      <ad-filter :visible.sync="adFilterVisible" @filterChange="filterChange" />
    </div>

    <div class="ad-list-wrap">
      <native-scroll
        pullup
        pulldown
        virtual-scroll
        :data="adList"
        @refresh="refresh"
        @scroll-end="scrollEndHandle"
        ref="nativeScroll"
      >
        <template #virtual="{ data: ad }">
          <div class="ad-list">
            <div class="ad-item">
              <div class="ad-type">
                <h4 class="type" :class="[getColorClass(ad)]">{{ getType(ad) }}{{ ad.tradeCoinName }}</h4>
                <span class="time">{{ ad.createTime }}</span>
                <div class="status" :class="{ finished: ad.status !== 1 }">{{ getStatusText(ad) }}</div>
              </div>

              <div class="ad-info">
                <div class="amount">
                  <label>{{ getType(ad) }}__('数量') ({{ ad.tradeCoinName }})</label>
                  <p>{{ ad.amount }}</p>
                </div>
                <div class="price">
                  <label>{{ getType(ad) }}__('单价') ({{ ad.basicCoinName }})</label>
                  <p>{{ ad.price }}</p>
                </div>
                <div class="deal">
                  <label>{{ ad.type === 1 ? '__("已买入")' : '__("已卖出")' }} ({{ ad.tradeCoinName }})</label>
                  <p>{{ getDealAmount(ad) }}</p>
                </div>
              </div>

              <div class="ad-id">
                <div class="id">__('广告ID：'){{ ad.adId }}</div>
                <div class="operation-btns">
                  <van-button v-if="ad.status === 1" @click="offSaleAd(ad)">__('下架')</van-button>
                  <van-button v-if="ad.status !== 2" @click="goRelease('check', ad)">__('查看')</van-button>
                  <van-button v-else class="resend-btn" @click="goRelease('republish', ad)">__('重发')</van-button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <no-data :visible="loaded && adList.length === 0" />
      </native-scroll>
    </div>

    <button class="add-btn" @click="goRelease('publish')" />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import headerBack from '@/components/c2c/header-back/index.vue';
import { tab, tabItem } from '@/components/common/tab/index';
import adFilter, { IAdFilter } from '@/components/c2c/ad-filter.vue';
import mixinsC2CCommon from '@/mixins/c2c/common-data';
import nativeScroll from '@/components/common/native-scroll/index';
import { TAdStatus, IOtcUserAdListParams, IAdListResponseResult, userAdList, offSaleAd } from '@/api/otc/ad';
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';
import { Getter } from 'vuex-class';
import { minus } from '@/utils/math';
import { Dialog } from 'vant';

const stautsMap: IObj<string> = {
  0: '__("发布失败")',
  1: '__("上架中")',
  2: '__("已下架")',
  3: '__("已完成")'
};

@Component({
  components: {
    headerBack,
    tab,
    tabItem,
    adFilter
  }
})
export default class Mine extends Mixins(mixinsC2CCommon, mixinsOtcGetUserToken) {
  tabStatus: string = '';
  loaded: boolean = false;
  adFilterVisible: boolean = false;
  adList: IAdListResponseResult[] = [];
  adListParams: IOtcUserAdListParams = {
    pageSize: 20,
    pageIndex: 1,
    userId: '',
    status: null,
    baseCoinName: null,
    type: null
  };

  '$refs': {
    nativeScroll: nativeScroll;
  };

  @Getter('otcUserId', { namespace: 'otc' }) public otcUserId!: string;

  @Watch('mixinsOtcIsLogin', { immediate: true })
  otcIsLoginWatcher(otcIsLogin: boolean) {
    if (otcIsLogin) {
      this.adListParams.userId = this.otcUserId;
      this.getUserAdList();
    }
  }

  tabChangeHandle(data: string) {
    this.adListParams.status = data === '' ? null : (parseInt(data) as TAdStatus);
    this.$refs.nativeScroll && this.$refs.nativeScroll.reset();
    this.resetList();
  }

  scrollEndHandle() {
    this.getUserAdList();
  }

  goRelease(action: string, ad?: IAdListResponseResult) {
    this.$router.push({
      name: 'c2c-ad-release',
      query: {
        action,
        id: ad ? ad.adId : ''
      }
    });
  }

  filterChange(filter: IAdFilter) {
    console.log(filter);
    this.adListParams = Object.assign(this.adListParams, filter);
    this.resetList();
  }

  resetList() {
    this.loaded = false;
    this.adListParams.pageIndex = 1;
    this.getUserAdList(true);
  }
  refresh() {
    this.resetList();
  }

  getType(ad: IAdListResponseResult) {
    return ad.type === 1 ? '__("买入")' : '__("卖出")';
  }
  getColorClass(ad: IAdListResponseResult) {
    return ad.type === 1 ? 'buy-color' : 'sell-color';
  }
  getStatusText(ad: IAdListResponseResult) {
    return (stautsMap as any)[ad.status];
  }
  getDealAmount(ad: IAdListResponseResult) {
    return minus(ad.amount, ad.remainAmount);
  }

  async getUserAdList(isRefresh?: boolean) {
    try {
      const res = await userAdList(this.adListParams);
      isRefresh && (this.adList = []);
      this.adList = this.adList.concat(res.results);
      this.adListParams.pageIndex += 1;
    } catch (err) {
      console.log(err);
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loaded = true;
  }

  offSaleAd(ad: IAdListResponseResult) {
    Dialog.confirm({
      title: '__("提示")',
      message: '__("确定下架该广告?")'
    })
      .then(() => {
        return offSaleAd(ad.adId);
      })
      .then(() => {
        this.$message.success('__("下架成功")');
        this.resetList();
      })
      .catch(err => {
        if (err.resMsg) {
          this.$message.fail(err.resMsg.message);
        }
      });
  }
}
</script>

<style lang="scss">
.ad-mine {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 12px;
  color: var(--theme-color);
  .tab-status {
    display: flex;
    position: relative;
  }
  .tab-sort-icon {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    padding: 10px 14px;
    color: var(--theme-color);
    &.acitve {
      color: var(--primary-color);
    }
  }

  .add-btn {
    position: fixed;
    right: 7px;
    bottom: 58px;
    width: 66px;
    height: 66px;
    border: none;
    color: #fff;
    background: url('~@img/c2c/ad/zbicon-add.svg') no-repeat top;
    &::before {
      background-color: transparent;
    }
  }

  .ad-list-wrap {
    flex: 1;
    overflow: hidden;
  }

  .ad-list {
    padding: 0 var(--padding-lr);
  }

  .ad-item {
    padding: 15px 0;
    border-bottom: 1px solid var(--border-color); /* no */
    .ad-type,
    .ad-info,
    .ad-id {
      display: flex;
      align-items: baseline;
    }
    .ad-info,
    .ad-id {
      justify-content: space-between;
    }
  }
  .ad-type {
    margin-bottom: 14px;
    .type {
      margin-right: 8px;
      font-size: 20px;
    }
    .time {
      font-size: 10px;
    }
    .status {
      margin-left: auto;
      padding: 4px 16px;
      border-radius: 11px;
      color: #fff;
      background-color: var(--primary-color);

      &.finished {
        background-color: #707070;
      }
    }
  }

  .ad-info {
    margin-bottom: 16px;
    .price {
      text-align: center;
    }
    .deal {
      text-align: right;
    }
    label {
      display: block;
      margin-bottom: 6px;
    }
    p {
      font-size: 14px;
      font-weight: 600;
      color: var(--new-theme-color-6);
    }
  }

  .operation-btns {
    .van-button {
      width: 68px;
      height: 26px;
      line-height: 1;
      font-size: 14px;
      font-weight: 500;
      border-radius: 13px;
      color: var(--theme-color-6);
      border-color: var(--theme-color-6);
      background-color: transparent;
      & + .van-button {
        margin-left: 10px;
      }
    }
    .resend-btn {
      color: var(--primary-color);
      border-color: var(--primary-color);
    }
  }

  .sell-color {
    color: var(--sell-color);
  }
  .buy-color {
    color: var(--buy-color);
  }

  .nodata-box {
    height: 100%;
  }
}
</style>
