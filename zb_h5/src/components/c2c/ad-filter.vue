<template>
  <transition name="filter-fade">
    <div class="ad-filter-box" @click="closeHandle" v-if="visible">
      <scroll>
        <div class="sort-content" @click.stop="noop">
          <div class="panel-item">
            <div class="panel-label">
              <label>__('广告类型')</label>
            </div>
            <div class="panel-content">
              <m-select class="select" v-model="type">
                <m-option label="__('全部')" value="" />
                <m-option label="__('买入')" value="2" />
                <m-option label="__('卖出')" value="1" />
              </m-select>
            </div>
          </div>
          <div class="panel-item">
            <div class="panel-label">
              <label>__('法币交易')</label>
            </div>
            <div class="panel-content">
              <m-select class="select" v-model="baseCoinName">
                <m-option label="__('全部')" value="" />
                <m-option label="__('人民币')(CNY)" value="CNY" />
                <m-option label="__('美元')(USD)" value="USD" />
                <m-option label="__('港元')(HKD)" value="HKD" />
              </m-select>
            </div>
          </div>
          <div class="btns">
            <van-button class="sort-btn reset-btn" @click="resetClickHanlde">__('重置')</van-button>
            <van-button class="sort-btn confirm-btn" @click="filterClickHandle">__('筛选')</van-button>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { mSelect, mOption } from '@/components/common/select/index';
import { TAdType } from '@/api/otc/ad';

export interface IAdFilter {
  type: TAdType | null;
  baseCoinName: string | null;
}

@Component({
  components: {
    mSelect,
    mOption
  }
})
export default class ListFilter extends Vue {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  type: string = '';
  baseCoinName: string = '';
  noop() {}
  @Emit('update:visible')
  closeHandle() {
    return false;
  }

  @Emit('filterChange')
  resetClickHanlde(): IAdFilter {
    this.closeHandle();
    return {
      type: null,
      baseCoinName: null
    };
  }
  @Emit('filterChange')
  filterClickHandle(): IAdFilter {
    this.closeHandle();
    return {
      type: this.type === '' ? null : (+this.type as TAdType),
      baseCoinName: this.baseCoinName === '' ? null : this.baseCoinName
    };
  }
}
</script>

<style lang='scss'>
.filter-fade-enter,
.filter-fade-leave-active {
  opacity: 0.2;
}
.filter-fade-leave-active {
  opacity: 0;
}
.ad-filter-box {
  transition: all 0.3s;
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 10;
  height: calc(100vh - 78px);
  color: var(--theme-color);
  background: rgba(1, 7, 26, 0.56);
  .sort-content {
    line-height: 1.3;
    background: var(--default-bg);
    padding-bottom: 30px;
  }
  .panel-item {
    padding: 0 15px;
    label {
      font-size: 16px;
      font-weight: 500;
    }
  }
  .panel-label {
    padding: 12px 0 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .icon {
      vertical-align: middle;
      font-size: 14px;
    }
  }
  .virtual-input {
    padding: 5px 0;
    border-radius: 4px;
  }
  .van-field {
    padding: 0;
    input {
      padding: 5px;
      border-radius: 4px;
      border: 1px solid #e5e5e8; /* no */
      height: 46px;
      color: #5e6c80;
      font-size: 16px;
    }

    @include dark {
      input {
        border-color: #4d4b58;
        .value {
          color: #b2b8c1;
        }
        &.focus::after {
          background-color: #b2b8c1;
        }
      }
    }
  }
  .m-option {
    width: 30%;
    margin-bottom: 8px;
    font-size: 13px;
  }
  .btns {
    display: flex;
    padding: 20px 15px 0;
  }
  .sort-btn {
    flex: 1;
    color: var(--theme-color);
    border: none;
  }
  .reset-btn {
    background: rgb(216, 218, 226);
    @include dark {
      background: #32353a;
    }
  }
  .confirm-btn {
    margin-left: 7px;
    background: var(--primary-color);
    color: #fff;
  }
}
</style>
