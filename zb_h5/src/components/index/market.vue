<template>
  <div class="market-body">
    <div class="market-list" v-if="list.length">
      <div :key="item.showName" @click="clickHandle(item)" class="market-item" v-for="item in list">
        <div class="column column--left">
          <img :alt="item.showName.substr(0, 1)" v-icon="`./img/coins/${item.showName.toLowerCase()}.svg`" />
          <dl>
            <dt>{{ item.showName }}</dt>
            <!-- <dd>{{ item.extendCoinAlias + ' ' + item.extendCoinVolStr }}</dd> -->
            <dd>{{ '24H量' + ' ' + item.extendCoinVolStr }}</dd>
          </dl>
        </div>
        <div class="column column--centre">
          <dl>
            <dt>
              <span :class="setColorClass(item)">{{ item.lastPrice }}</span>
            </dt>
            <dd>{{ item.extendCoinVolStr === '-' ? '-' : '￥' + item.lastPriceConvert }}</dd>
          </dl>
        </div>
        <div :class="setBgClass(item)" class="column column--right">
          {{ Number(item.riseRate) > 0 ? '+' : '' }}{{ item.extendCoinVolStr === '-' ? '-' : item.riseRate + '%' }}
        </div>
      </div>
    </div>
    <empty-data :visible="!list.length && mixinsMarketLoading === false" />
  </div>
</template>
<script lang='ts'>
export { default } from './market';
</script>
<style lang='scss'>
@import '@scss/market-list/list.scss';
</style>
