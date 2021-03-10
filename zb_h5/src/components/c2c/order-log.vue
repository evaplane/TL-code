<template>
  <div class="order-log-box">
    <div class="order-log-title">
      <span
        :class="{ active: orderLogVisible }"
        @click="changeLogVisibleHandle"
        class="order-hide-btn"
      >
        订单日志
        <img src="@img/c2c/order-spread.svg" alt="" class="order-spread icon">
      </span>
    </div>
    <transition name="order-list">
      <ul class="order-log-content" v-if="orderLogVisible">
        <li v-for="(item,index) in orderLog" :key="index">
          <img src="@img/c2c/zbicon-customer-color.svg" />
          <div class="content">
            <div class="content-left">
              <h3>{{ item.title }}</h3>
              <time>{{ item.operationTime }}</time>
            </div>
            <span class="status">{{ item.status === 1 ? '已完成' : '-' }}</span>
          </div>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';

interface IOrderList {
  operationTime: string;
  status: number;
  title: string;
  type: number;
}

@Component
export default class OrderLog extends Vue {
  @Prop({ type: Array, default: () => [] }) orderLog!: IOrderList[];
  orderLogVisible: boolean = false;
  changeLogVisibleHandle() {
    this.orderLogVisible = !this.orderLogVisible;
    this.refresh();
  }
  @Emit()
  refresh() {}
}
</script>

<style lang='scss'>
.order-log-box {
  padding: 10px 25px 20px 25px;
  .order-log-title {
    text-align: right;
    span {
      padding: 5px;
      color: #000;
    }
    .active .icon {
      transform: rotate(180deg);
    }
    .icon {
      transition: 0.3s ease-out;
      vertical-align: middle;
      display: inline-block;
    }
  }
  .order-log-content {
    transition: 0.3s ease-out;
    background: #f7f8fe;
    color: var(--theme-color);
    border-radius: 5px;
    padding: 15px;
    margin-top: 20px;
    font-size: 13px;
    li {
      display: flex;
      align-items: center;
      padding-bottom: 12px;
    }
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .content {
      flex: 1;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #7d7e801f; /* no */
      padding-bottom: 10px;
    }
    .content-left {
      flex: 1;
    }
    h3 {
      padding-bottom: 5px;
      font-size: 14px;
      font-weight: 500;
    }
    .status {
      color: #4f5f8e;
    }
  }
  .order-list-enter,
  .order-list-leave-active {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
