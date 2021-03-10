<template>
  <div class="safe-setting-warp setting-panel" style="z-index:201;">
    <div class="setting-wrap setting-safe">
      <div class="setting-head">
        <span class="head-return" @click="updateType([])"></span>
        <h1 class="head-title">安全设置</h1>
      </div>
      <div class="setting-body">
        <native-scroll>
          <div class="setting-list">
            <div class="setting-list-group">
              <div class="setting-item" @click="updateType(['safe', 'password'])">
                <div class="label">登录密码</div>
                <div class="right"><span class="arrow"></span></div>
              </div>
              <div class="setting-item">
                <div class="label">资金密码</div>
                <div class="right"><span class="arrow"></span></div>
              </div>
              <div class="setting-item">
                <div class="label">Google认证</div>
                <div class="right"><span class="arrow"></span></div>
              </div>
            </div>
            <div class="setting-space"></div>
            <div class="setting-list-group">
              <div class="setting-item">
                <div class="label">交易验证</div>
                <div class="right"><span class="arrow"></span></div>
              </div>
              <div class="setting-item">
                <div class="label">支付验证</div>
                <div class="right"><span class="arrow"></span></div>
              </div>
            </div>
          </div>
        </native-scroll>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./safe-setting.ts" />

<style lang='scss'>
.safe-setting-warp {
}
</style>
