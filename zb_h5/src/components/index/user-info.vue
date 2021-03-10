<template>
  <div class="user-info-warp setting-panel" style="z-index:201;">
    <div class="setting-wrap setting-user">
      <div class="setting-head">
        <span class="head-return" @click="updateType([])"></span>
        <h1 class="head-title">账户信息</h1>
      </div>
      <div class="setting-body">
        <native-scroll>
          <div class="setting-list">
            <div class="setting-list-group">
              <div class="setting-item">
                <div class="label">头像</div>
                <div class="right">
                  <div class="avatar">
                    <img v-img="{ src: userInfo.headUrl, err: errorImg}" />
                  </div>
                </div>
              </div>
              <div class="setting-item">
                <div class="label">昵称</div>
                <div class="right">{{ userInfo.nickName || '-' }}</div>
              </div>
              <div class="setting-item">
                <div class="label">账号</div>
                <div class="right">{{ userInfo.userName }}</div>
              </div>
              <div class="setting-item" @click="updateType(['info', 'phone'])">
                <div class="label">手机号码</div>
                <div class="right">{{ userInfo.mobile || '请设置手机号' }}<span class="arrow" /></div>
              </div>
              <div class="setting-item" @click="userInfo.emailAuth === 0 && updateType(['info', 'email'])">
                <div class="label">安全邮箱</div>
                <div class="right">{{ userInfo.email }}<span v-if="userInfo.emailAuth === 0" class="arrow" /></div>
              </div>
              <div class="setting-item" @click="updateType(['info', 'auth'])">
                <div class="label">实名认证</div>
                <div class="right">{{ authStatusText }} <span class="arrow"></span></div>
              </div>
            </div>
            <div class="setting-space"></div>
            <div class="setting-item">
              <div class="label">VIP会员</div>
              <div class="right">{{ vipLevel }}<span class="arrow"></span></div>
            </div>
            <div class="setting-space"></div>
            <div class="setting-item setting-item-signout" @click="signOutHandle">退出登录</div>
            <div class="style-large-space"></div>
          </div>
        </native-scroll>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./user-info.ts" />

<style lang='scss'>
.user-info-warp {
  .setting-item-signout {
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
  }
}
</style>
