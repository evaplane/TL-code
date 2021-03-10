<template>
  <div class="ctc-order-progress-wrap">
    <div class="ctc-header-nav" id="ctc-header-nav">
      <div class="detail-collapse">
        <div class="coin-info">
          <div class="zbicon-icon-item icon-menu"></div>
          <div class="info">
            <h3
              :data-clipboard-text="$route.params.orderId"
              @click="pasteHandle"
              class="order-copy"
              data-clipboard-action="copy"
            >
              {{ `订单号:${orderId}` }}
              <i class="copy-btn zbicon-copy" />
              <!--icon_copy.png-->
            </h3>
            <p>{{ `状态:${orderStatusDesc}` }}</p>
          </div>
          <i
            :class="{ active: isCollapse }"
            @click="isCollapse = !isCollapse"
            class="zbicon-xia icon-down"
            v-hover
          />
        </div>
        <transition name="collapse">
          <ul class="collapse-content" v-if="isCollapse">
            <li class="collapse-item">
              <label>__('单价')(CNY/QC)</label>
              <span>{{ otcOrderDeatil.price }}</span>
            </li>
            <li class="collapse-item">
              <label>__('总量')(QC)</label>
              <span>{{ otcOrderDeatil.amount }}</span>
            </li>
            <li class="collapse-item">
              <label>__('总额')(CNY)</label>
              <span>{{ otcOrderDeatil.money }}</span>
            </li>
            <li class="collapse-item">
              <label>__('订单时间')</label>
              <span>{{ otcOrderDeatil.orderTime }}</span>
            </li>
            <li class="steps-items" v-if="orderProgressArr.length === 4">
              <div :class="{active : +orderProgressArr[3] >= 1}" class="step">
                <div class="step-container" />
                <div class="line"></div>
                <div class="title">{{ orderProgressArr[0] }}</div>
              </div>
              <div :class="{active : +orderProgressArr[3] >= 2}" class="step">
                <div class="step-container" />
                <div class="line"></div>
                <div class="title">{{ orderProgressArr[1] }}</div>
              </div>
              <div :class="{active : +orderProgressArr[3] >= 3}" class="step">
                <div class="step-container" />
                <div class="title">{{ orderProgressArr[2] }}</div>
              </div>
            </li>
            <li class="steps-items" v-else>
              <div :class="{active : +orderProgressArr[2] >= 1}" class="step">
                <div class="step-container" />
                <div class="line"></div>
                <div class="title">{{ orderProgressArr[0] }}</div>
              </div>
              <div :class="{active : +orderProgressArr[2] >= 2}" class="step">
                <div class="step-container" />
                <div class="line"></div>
                <div class="title">{{ orderProgressArr[1] }}</div>
              </div>
            </li>
          </ul>
        </transition>
      </div>
      <div class="line" />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
// 插件
import Clipboard from 'clipboard';

@Component({
  components: {
  }
})
export default class CtcOrderProgress extends Vue {
  @Prop({ type: String, default: '' }) orderId!: string;
  @Prop({ type: String, default: '' }) orderStatusDesc!: string;
  @Prop({ type: Object, default: () => ({}) }) otcOrderDeatil!: object;
  @Prop({ type: Array, default: () => ([]) }) orderProgressArr!: string[];

  isCollapse: boolean = false;

  pasteHandle() {
    let clipboard = new Clipboard('.order-copy');
    clipboard.on('success', () => {
      this.$message.success('__("复制成功")');
    });
    clipboard.on('error', () => {
      this.$message.fail('__("复制失败,请手动复制")');
    });
  }
}
</script>

<style lang='scss'>
.ctc-order-progress-wrap {
  color: var(--theme-color);
  font-size: 13px;
  width: 100%;
  display: flex;
  flex-direction: column;
  @include light {
    background: #f7f8fd;
  }
  @include dark {
    background: #2c2933;
  }
  .ctc-header-nav {
    width: 100%;
    /*position: fixed;*/
    /*top: 0;*/
    transition: 0.3s ease-out;
  }
  .bar-icon {
    font-size: 20px;
    padding: 3px 0 3px 20px;
  }
  .detail-collapse {
    background: var(--default-bg);
  }
  .coin-info {
    position: relative;
    display: flex;
    padding: 20px 24px 30px 24px;
    // height: 55px;
    .icon-menu {
      width: 36px;
      height: 36px;
      margin-right: 4px;
      font-size: 36px;
      color: var(--buy-color);
    }
    h3 {
      letter-spacing: 1px;
      font-size: 16px;
      line-height: 1.4em;
      font-weight: 600;
      padding-bottom: 3px;
      @include light {
        color: #455264;
      }
      @include dark {
        color: #fdfdfd;
      }
    }
    p {
      font-size: 12px;
      font-weight: 600;
      // color: #5E6C80;
      color: var(--new-theme-color-6);
    }
    .copy-btn {
      @include light {
        color: #455264;
      }
      @include dark {
        color: #fdfdfd;
      }
    }
    .icon-down {
      font-size: 14px;
      position: absolute;
      display: inline-block;
      bottom: 25px;
      right: 15px;
    }
  }
  .icon-down {
    transition: 0.3s ease-out;
    padding: 3px 14px;
    &.hover-active {
      font-size: 20px;
    }
    &.active {
      transform: rotate(180deg);
    }
  }
  .zbicon-copy {
    font-weight: 500;
    padding: 1px 4px;
  }
  .zbicon-icon-parent {
    font-size: 20px;
    color: #d1d1d1;
  }
  .collapse-content {
    overflow: hidden;
    transition: 0.3s ease-out;
    height: 168px;

    &.collapse-enter,
    &.collapse-leave-active {
      opacity: 0;
      height: 0px;
    }
    .collapse-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 15px;
    }
    label {
      @include light {
        color: rgb(179, 181, 187);
      }
      @include dark {
        color: rgb(123, 123, 136);
      }
    }
  }
  .steps-items {
    display: flex;
    justify-content: space-between;
    margin: 20px 55px;
    position: relative;
    .title {
      display: inline-block;
      margin-left: 3px;
      font-size: 12px;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
      padding-top: 20px;
    }
    .line {
      top: 0px;
      left: 0;
      width: 100%;
      height: 5px;
      position: absolute;
      background-color: #d8d8d8;
    }
    .step {
      position: relative;
      flex: 1;
      font-size: 14px;
      float: left;
      &.active {
        .step-container {
          background-color: var(--primary-color);
        }
        .line {
          background-color: var(--primary-color);
        }
      }
      &:last-child {
        position: absolute;
        top: 0;
        right: 0;
        .step-container {
          position: absolute;
          right: -11px;
          top: 2px;
          left: inherit;
        }
        .title {
          transform: none;
          transform: translateX(50%);
        }
      }
    }
    .step-container {
      position: absolute;
      top: 2px;
      left: -8px;
      z-index: 1;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #d8d8d8;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }
  .order-content {
    flex: 1;
  }
}
</style>
