<template>
  <div class="borrow-detail-warp" v-loading="loading">
    <lever-header @left-click="$router.back()" :title="`借${coinShowName}(${ actionType })`" />
    <ul class="lever-detail-list">
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>日利率</label>
        <p>{{ info.rateOfDayShow || '-' }}</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>借款期限</label>
        <p>{{ info.repaymentDay || '-' }}天</p>
      </li>
      <li class="lever-detail-item bottom-border" v-hover:detail-hover>
        <label>剩余可借</label>
        <p>{{ info.balance }} {{ coinShowName }}</p>
      </li>
    </ul>
    <!-- 借款操作 -->
    <div class="lever-borrow-return-form" >
      <div class="lever-form-item amount">
        <h3>借入数量</h3>
        <p>可借数量 {{ available + ' ' + coinShowName }}</p>
      </div>
      <div class="lever-form-item input">
        <m-input v-model="params.amount" direction="left" class="input-item" placeholder="请输入借款数量" itype="number" :min="0" />
        <div class="input-label">
          <span class="coin-name">{{ coinShowName }}</span>
          <span class="return-btn" @click="setAllHandle">全部借入</span>
        </div>
      </div>
      <div class="lever-form-item input" v-if="isSafePwd">
        <m-input v-model="safePwd" direction="left" class="input-item" placeholder="请输入资金密码" />
      </div>
      <div class="lever-form-item auto-borrow">
        <h3>自动借入</h3>
        <m-switch :active-value="1" :inactive-value="0" v-model="params.isLoop" />
      </div>
      <div class="lever-form-item tips">
        <p>• 借款期限到期后，系统会自动扣除本金和利息，如果还款币种不足，系统将自动平仓；</p>
        <p>• 开启自动续借后，借款期限到期后，系统将按照最优利率借入到期应付本金和利息。如果还款记录到期时风险率低于120%，将续借失效继而触发平仓还款。</p>
      </div>
      <div class="lever-form-item submit-btn">
        <button @click="submitHandle">立即借款</button>
      </div>
    </div>
  </div>
</template>

<script lang='ts' src="./borrow.ts"></script>

<style lang='scss'>
@import '@/assets/scss/lever/borrow-return-form.scss';
.borrow-detail-warp {
  color: var(--theme-color);
  background-color: #000;
}
</style>
