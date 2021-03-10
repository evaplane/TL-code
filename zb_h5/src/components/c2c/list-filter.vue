<template>
  <transition name="filter-fade">
    <div class="list-filter-box" @click="closeHandle" v-if="visible">
      <scroll>
        <div class="sort-content" @click.stop="noop">
          <div class="panel-item">
            <div class="panel-label">
              <label>__('金额')</label>
            </div>
            <div class="panel-content">
              <virtual-input
                @blur="blurHandle"
                @focus="focusHandle"
                v-keyboard
                v-model="filterAmount"
                placeholder="筛选包含该价格的服务商"
              ></virtual-input>
            </div>
          </div>
          <div class="panel-item">
            <div class="panel-label">
              <label>__('付款方式')</label>
            </div>
            <div class="panel-content">
              <m-select class="select" on-to-off v-model="filterPayWays">
                <m-option v-for="item in mixinsPayActions" :key="item.value" :label="item.name" :value="item.value" />
              </m-select>
            </div>
          </div>
          <div class="panel-item">
            <div class="panel-label">
              <label>__('法币')</label>
              <!-- <span>
                __('更多')
                <i class="icon zbicon-down" />
              </span> -->
            </div>
            <div class="panel-content">
              <m-select class="select" v-model="filterMarketId">
                <m-option v-for="item in moneyActions" :key="item.value" :label="item.name" :value="item.value" />
              </m-select>
            </div>
          </div>
          <!-- <div class="panel-item">
            <div class="panel-label">
              <label>__('国家和地区')</label>
              <span>
                __('更多')
                <i class="icon zbicon-down" />
              </span>
            </div>
            <div class="panel-content">
              <m-select class="select" v-model="payDirection">
                <m-option label="__('全部')" value="1" />
                <m-option label="__('中国')" value="2" />
                <m-option label="__('新加坡')" value="3" />
              </m-select>
            </div>
          </div> -->
          <div class="btns">
            <van-button class="sort-btn reset-btn" @click="reset">__('重置')</van-button>
            <van-button class="sort-btn confirm-btn" @click="filter">__('筛选')</van-button>
          </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script lang='ts'>
export { default } from './list-filter';
</script>

<style lang='scss'>
.filter-fade-enter,
.filter-fade-leave-active {
  opacity: 0.2;
}
.filter-fade-leave-active {
  opacity: 0;
}
.list-filter-box {
  transition: 0.3s ease-out;
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
