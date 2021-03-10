<template>
  <div class="account-lever">
    <div class="lever-list">
      <div :key="item.key" class="lever-item" v-for="item in levers" @click="itemClickHandle(item)" v-hover>
        <div class="head">
          <img :src="`./img/coins/${item.cShowName.toLowerCase()}.svg`" class="icon-coins" />
          <h2>
            {{ item.cShowName }}
            <em></em>
            {{ item.fShowName }}
          </h2>
        </div>
        <div v-if="showBody" class="body">
          <dl>
            <dt>类型</dt>
            <dd>可用</dd>
            <dd>冻结</dd>
            <dd>已借</dd>
          </dl>
          <dl>
            <dt>{{ item.cShowName }}</dt>
            <dd>{{ item.cAvailable }}</dd>
            <dd>{{ item.cFreeze }}</dd>
            <dd>{{ item.cLoanOut }}</dd>
          </dl>
          <dl>
            <dt>{{ item.fShowName }}</dt>
            <dd>{{ item.fAvailable }}</dd>
            <dd>{{ item.fFreeze }}</dd>
            <dd>{{ item.fLoanOut }}</dd>
          </dl>
        </div>
      </div>
      <no-data :visible="levers.length === 0 && loading === false" />
    </div>
  </div>
</template>

<script lang='ts'>
import mCheckbox from '@/components/common/checkbox/index.vue';
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import { ILeverTypes, ILeverDataTypes } from '@/api/lever';
import { isNotEmpty } from '@/utils/is';
import { Location } from 'vue-router';
@Component({
  components: {
    mCheckbox
  }
})
export default class AccountLever extends Vue {
  @Prop({ type: String, default: '' }) searchCoinName!: string;
  @Prop({ type: Boolean, default: false }) searchMode!: boolean;
  @Prop({ type: Boolean, default: true }) showBody!: boolean;
  @Prop({ type: Function, default: null }) itemClickFun!: Function | null;

  @Action('getLeverAssets', { namespace: 'assets' }) getLeverAssets!: Function;
  @Action('updateLeverList', { namespace: 'assets' }) updateLeverList!: Function;
  @State('leverAssets', { namespace: 'assets' }) leverAssets!: ILeverTypes;
  loading: boolean = true;
  get levers() {
    if (isNotEmpty(this.leverAssets) === true) {
      return this.leverAssets.levers.filter(item => item.cShowName.toLowerCase().indexOf(this.searchCoinName.toLowerCase()) > -1);
    }
    return [];
  }

  @Watch('levers', { deep: true })
  leversWatcher(levers: ILeverDataTypes[]) {
    this.updateLeverList(levers);
  }

  @Emit()
  itemClick(item: ILeverDataTypes) {
    return item;
  }

  itemClickHandle (item: ILeverDataTypes) {
    if (this.itemClickFun) {
      this.itemClickFun(item);
    } else {
      const params = Object.assign({}, this.$route.params);
      const routerParams: Location = {
        name: 'assets-operating-transfer',
        params,
        query: {
          market: item.showName.toLowerCase().replace('/', '_'),
          coin: item.cShowName
        }
      };
      this.searchMode ? this.$router.replace(routerParams) : this.$router.push(routerParams);
    }
    this.itemClick(item);
  }
  async mounted() {
    this.loading = true;
    await this.getLeverAssets();
    this.loading = false;
  }
}
</script>

<style lang='scss'>
.account-lever {
  color: var(--heavy-color);
  .nodata-box {
    height: 100%;
  }
  .lever-head {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    height: 46px;
    border-bottom: 1px solid var(--line-color); /* no */
    @include dark {
      border-color: #24222d;
    }
  }
  .lever-item {
    padding: 15px;
    position: relative;
    &:not(:last-of-type)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 15px;
      right: 15px;
      height: 1px; /* no */
      background-color: var(--line-color);
      @include dark {
        background-color: #24222d;
      }
    }
    .head {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .icon-coins {
        width: 22px;
      }
      h2 {
        margin-left: 5px;
        font-size: 18px;
        display: flex;
        align-items: center;
      }
      em {
        width: 2px; /* no */
        height: 14px; /* no */
        background-color: currentColor;
        margin: 0 5px;
        transform: rotate(20deg);
      }
    }
    .body {
      display: flex;
      dl {
        flex: none;
        width: 35%;
        dt {
          font-size: 11px;
          color: var(--thin-color);
        }
        dd {
          margin-top: 10px;
          font-weight: 500;
        }
        &:nth-child(1) {
          width: 30%;
          dd {
            color: var(--default-color);
            font-weight: normal;
          }
        }
        &:nth-child(3) {
          text-align: right;
        }
      }
    }
  }
}
.account-panel {
  .account-lever {
    background-color: var(--default-bg);
    position: relative;
    z-index: 2;
    margin-top: 178px;
  }
}
</style>
