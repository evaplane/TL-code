<template>
  <div class="lever-transfer-warp">
    <div class="lever-transfer-header">
      <icon-return @click="backClickHandle" />
      <icon-menu v-if="$route.name === 'lever-return'"/>
    </div>
    <tab @change="tabChangeHandle" border v-model="tabType">
      <tab-item :name="key" v-for="(text, key) in tabList" :key="key">{{ text }}</tab-item>
    </tab>
    <router-view class="lever-transfer-view" />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins } from 'vue-property-decorator';
import mixinsMarket from '@/mixins/market/market';
import { tab, tabItem } from '@/components/common/tab/index';
type TLeverType = 'lever-borrow-coin' | 'lever-borrow-money' | 'lever-return' | 'lever-transfer';
@Component({
  components: {
    tab,
    tabItem
  }
})
export default class LeverTransfer extends Mixins(mixinsMarket) {
  tabType: TLeverType = 'lever-borrow-coin';
  get tabList() {
    const list: IObj<string> = {
      'lever-borrow-coin': '借' + this.mixinsCShowNameUp,
      'lever-borrow-money': '借' + this.mixinsFShowNameUp,
      'lever-return': '还币',
      'lever-transfer': '划转'
    };
    return list;
  }
  backClickHandle() {
    this.$router.back();
  }
  created() {
    this.tabType = this.$route.name as TLeverType || 'lever-borrow-coin';
  }
  tabChangeHandle(name: TLeverType) {
    this.$router.replace({ name }).catch(() => {});
  }
}
</script>

<style lang='scss'>
.lever-transfer-warp {
  color: var(--theme-color);
  height: 100%;
  display: flex;
  flex-direction: column;
  .lever-transfer-header {
    display: flex;
    height: 48px;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .lever-transfer-view {
    flex: 1;
    overflow: hidden;
  }
}
</style>
