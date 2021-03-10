<template>
  <native-scroll class="return-detail-warp">
    <lever-header @left-click="backClickHandle" :title="coinShowName + '还币'"/>
    <ul class="lever-detail-list">
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>借入总额</label>
        <p>{{ amount }} {{ coinShowName }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>应还总额</label>
        <p>{{ arrearsAmount }} {{ coinShowName }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>借款利率</label>
        <p>{{ rate }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>未还本金</label>
        <p>{{ info.amount }} {{ coinShowName }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>未还利息</label>
        <p>{{ info.arrearsLx }} {{ coinShowName }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>借款时间</label>
        <p>{{ info.createTimeShow }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>应还时间</label>
        <p>{{ info.repayDateShow }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>是否自动续借</label>
        <p>{{ info.investMark ? '是' : '否' }}</p>
      </li>
    </ul>
    <!-- 还款操作 -->
    <div class="lever-borrow-return-form" v-if="returnEnable">
      <div class="lever-form-item amount">
        <h3>还款金额</h3>
        <p>可用金额 {{ available + ' ' + coinShowName }}</p>
      </div>
      <div class="lever-form-item input">
        <m-input v-model="repayAmount" direction="left" class="input-item" placeholder="请输入还款金额" itype="number" :min="0" />
        <div class="input-label">
          <span class="coin-name">BTC</span>
          <span class="return-btn" @click="setAllHandle">全部还款</span>
        </div>
      </div>
      <p class="lever-form-item tips">
        • 还款金额为本金，系统将同时扣除截至目前的总利息，未还本金可继续使用并计息。
      </p>
      <div class="lever-form-item submit-btn">
        <button @click="repayClickHandle">立即还款</button>
      </div>
    </div>
    <h2 class="record-title">还款记录</h2>
    <div class="record-list" v-loading="list.length === 0 && loading === true">
      <ul v-for="item in list" :key="item.id" class="bottom-border" v-hover:detail-hover>
        <li>
          <label>已还</label>
          <p>{{ item.benJin }} {{ coinShowName }}</p>
        </li>
        <li>
          <label>利息</label>
          <p>{{ item.liXi }} {{ coinShowName }}</p>
        </li>
        <li>
          <label>时间</label>
          <p>{{ item.actureDate | date('YYYY/MM/DD hh:mm:ss') }}</p>
        </li>
      </ul>
      <no-data :visible="list.length === 0 && loading === false" />
    </div>
  </native-scroll>
</template>

<script lang='ts' src="./return-detail.ts">
</script>

<style lang='scss'>
@import '@/assets/scss/lever/borrow-return-form.scss';
.return-detail-warp {
  background-color: #f3f4f9;
  color: var(--theme-color);
  @include dark {
    background-color: #000;
  }
  .record-list {
    background-color: var(--default-bg);
    ul {
      padding: 15px;
      display: flex;
      justify-content: space-between;
    }
    li {
      &:nth-child(2) {
        text-align: center;
      }
      &:last-child {
        text-align: right;
      }
    }
    label {
      font-size: 12px;
      color: var(--default-color);
    }
    p {
      font-size: 14px;
      padding-top: 10px;
      color: var(--heavy-color);
    }
  }
  .record-title {
    font-size: 16px;
    font-weight: 600;
    padding: 15px 0;
    margin: 0 15px;
    border-bottom: 1px solid var(--line-color); /* no */
  }
}
</style>
