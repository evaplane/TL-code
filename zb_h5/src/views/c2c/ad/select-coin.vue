<template>
  <div class="ad-select-coin">
    <header-back>
      <p>__('选择交易币')</p>
    </header-back>
    <div class="line"></div>

    <div class="ad-coin-container">
      <native-scroll>
        <van-cell-group>
          <van-cell
            v-hover:hover-active-list
            v-for="coin in otcMarkets"
            :key="coin.tradeCoin"
            @click="back(coin)">
            <template slot="title">
              <!-- <i class="icon"></i> -->
              <p class="coin-name">{{ coin.tradeCoinName }}</p>
            </template>
          </van-cell>
        </van-cell-group>
      </native-scroll>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import headerBack from '@/components/c2c/header-back/index.vue';
import nativeScroll from '@/components/common/native-scroll/index.vue';
import { IOtcMarketResponse } from '@/api/otc/market';
import { Getter } from 'vuex-class';
import store from '@/store/store';

@Component({
  components: {
    headerBack,
    nativeScroll
  }
})
export default class SelectCoin extends Vue {
  @Getter('otcMarkets', { namespace: 'otc' }) otcMarkets!: IOtcMarketResponse[];

  @Watch('otcMarkets', { immediate: true })
  marketsWatcher(otcMarkets: IOtcMarketResponse[]) {
    if (!otcMarkets || otcMarkets.length === 0) {
      store.dispatch('otc/getOtcMarkets');
    }
  }
  back(coin: IOtcMarketResponse) {
    store.commit('otc/updateReleaseAdMarket', coin);
    this.$router.back();
  }
}
</script>

<style lang="scss">
.ad-select-coin{
  display: flex;
  flex-direction: column;
  height: 100%;
  .ad-coin-container{
    flex: 1;
    overflow: hidden;
  }

  .van-cell__title{
    display: flex;
    align-items: center;
  }
  .icon{
    display: block;
    width: 32px;
    height: 32px;
    margin-right: 15px;
    background-color: #f4f4f4;
  }
  .coin-name{
    padding: 4px 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--new-theme-color-3);
  }
}
</style>
