<template>
  <div class="assets-panel" style="z-index:4">
    <back class="loan-header">
      <img v-if="$route.meta.showFilter" @click="$router.replace({ query:{ according: 'true' } })" src="@img/assets/loan/loan-filter.svg" />
    </back>
    <ul class="loan-tabs">
      <li
        :class="{ active: $route.name === item.routerName }"
        v-for="(item, index) in routers"
        :key="index"
        class="loan-tab-item"
        @click="$router.replace({ name: item.routerName, query:{ according: 'false' }})"
      >
        {{ item.label }}
      </li>
    </ul>
    <router-view/>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import {
  Popup
} from 'vant';
interface IRouters {
  routerName: string; // 路由名称
  label: string; // 显示名称
}
@Component({
  components: {
    back,
    Popup
  }
})
export default class Loan extends Vue {
  isShow: boolean = false;
  routers: IRouters[] = [{
    routerName: 'loan-money',
    label: '__("我要借款")'
  },
  {
    routerName: 'loan-coin',
    label: '__("我要借币")'
  },
  {
    routerName: 'loan-mortgage',
    label: '__("质押记录")'
  }
  ];
}
</script>

<style lang="scss">
.loan-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
}
.loan-tabs {
  display: flex;
  height: 46px;
  padding: 0 15px;
  align-items: center;
  .loan-tab-item {
    margin-right: 16px;
    color: var(--new-theme-color);
    font-size: 18px;
    @include bold;
    white-space: nowrap;
    transition: all 0.3s;
    &.active {
      font-size: 28px;
      color: var(--new-theme-color-3);
    }
    .loan-tab-item {
      flex: none;
      padding: 12px 0;
      margin: 0 20px;
      font-size: 16px;
      @include bold;
      white-space: nowrap;
      border-bottom: 2px solid transparent; /* no */
      transition: all 0.3s;
      &.active {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
    }
  }
  .loan-view {
    flex: 1;
    overflow: hidden;
  }
}
</style>
