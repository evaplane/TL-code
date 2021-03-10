<template>
  <native-scroll class="business-advertising-bottom">
    <div class="list-wrap">
      <p class="bottom-content-title">{{`向${nickName}购买`}}</p>
      <advert-List
        v-for='(item,index) in buyList'
        :key="index"
        :advert-list="item"
      />
    </div>
    <div class="list-wrap">
      <p class="bottom-content-title">{{`出售给${nickName}`}}</p>
      <advert-List
        v-for='(item,index) in sellList'
        :key="index"
        :advert-list="item"
      />
    </div>
  </native-scroll>
</template>

<script lang='ts'>
import { Component, Mixins, Prop } from 'vue-property-decorator';
// component
import appBar from '@/components/c2c/app-bar.vue';
import advertList from '@/components/c2c/advert-list.vue';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import nativeScroll from '@/components/common/native-scroll/index.vue';
// api
import { list, IAdListResponseResult } from '@/api/otc/ad';
// mixins
import mixinsOtcGetUserToken from '@/mixins/otc/get-user-token';

@Component({
  components: {
    iconPortrait,
    nativeScroll,
    advertList,
    appBar
  }
})
export default class BusinessAdvertising extends Mixins(mixinsOtcGetUserToken) {
  @Prop({ type: String, default: '商家' }) nickName!: string;

  buyList: IAdListResponseResult[] = [];
  sellList: IAdListResponseResult[] = [];

  async mounted() {
    let params = {
      userId: this.$route.params.userId,
      marketId: this.$route.params.marketId,
      pageIndex: 1,
      pageSize: 50
    };
    let resBuy = await list(Object.assign(params, { tradeType: 1 }));
    this.buyList = resBuy.results;
    let resSell = await list(Object.assign(params, { tradeType: 2 }));
    this.sellList = resSell.results;
  }
}
</script>

<style lang='scss'>
.business-advertising-bottom {
  padding-bottom: 10px;
  height: 100%;
  .list-wrap {
    border-top: 6px solid var(--border-color);
  }
  .bottom-content-title {
    padding: 14px 15px 12px 15px;
    font-size: 18px;
    font-weight: 500;
    border-bottom: 1px solid var(--border-color);
    @include light{
      color: #4B5E6D;
    }
    @include dark{
      color: #AFB7C2;
    }
  }
}
</style>
