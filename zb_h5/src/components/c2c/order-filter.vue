<template>
  <transition name="filter-fade">
    <div class="ad-filter-box" @click="closeHandle" v-if="visible">
      <scroll>
        <div class="sort-content" @click.stop="noop">
          <div class="panel-item">
            <div class="panel-label">
              <label>__('订单类型')</label>
            </div>
            <div class="panel-content">
              <m-select class="select" v-model="type">
                <m-option label="__('全部')" value="" />
                <m-option label="__('买入')" value="1" />
                <m-option label="__('卖出')" value="2" />
              </m-select>
            </div>
          </div>
          <div class="panel-item">
            <div class="panel-label">
              <label>__('订单状态')</label>
            </div>
            <div class="panel-content">
              <m-select class="select" v-model="orderStatus">
                <m-option label="__('全部')" value="" />
                <m-option label="__('等待接单')" value="0" />
                <m-option label="__('待付款')" value="3" />
                <m-option label="__('已付款')" value="4" />
                <m-option label="__('已取消')" value="7" />
                <m-option label="__('已完成')" value="6" />
                <m-option label="__('接单超时')" value="1" />
                <m-option label="__('拒绝接单')" value="2" />
                <m-option label="__('申诉中')" value="5" />
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
import { TOrderType, TOrderStatus } from '@/api/otc/order';

export interface IOrderFilter {
  orderType?: TOrderType;
  orderStatus?: TOrderStatus;
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
  orderStatus: string = '';
  noop() {}
  @Emit('update:visible')
  closeHandle() {
    return false;
  }

  @Emit('filterChange')
  resetClickHanlde(): IOrderFilter {
    this.closeHandle();
    return {};
  }
  @Emit('filterChange')
  filterClickHandle(): IOrderFilter {
    this.closeHandle();
    let filter: IOrderFilter = {
      orderType: this.type === '' ? null : (+this.type as TOrderType)
    };
    if (this.orderStatus !== '') {
      filter.orderStatus = +this.orderStatus as TOrderStatus;
    }
    return filter;
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
    background-color: rgb(216, 218, 226);
    @include dark {
      background-color: #32353a;
    }
  }
  .confirm-btn {
    margin-left: 7px;
    background: var(--primary-color);
    color: #fff;
  }
}
</style>
