<template>
  <div class="login-wrap">
    <div>
      <div class="nodata">
        <icon-nodata />
      </div>
      <div class="entrance">
        <a class="log" href="javascript:;" v-login>__('登录')</a>
        <a class="reg" href="#" v-register>__('注册')</a>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class Login extends Vue {}
</script>
<style lang='scss'>
.login-wrap {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #8d9ba8;
  .nodata {
    text-align: center;
    transform: translateY(-100%);
    svg {
      width: 100px;
      height: 100px;
    }
  }
  .entrance {
    display: flex;
    a {
      padding: 0 24px;
      height: 36px;
      line-height: 36px;
      border-radius: 2px; /* no */
      font-size: 16px;
      color: #fff;
      border: 1px solid #5c5a69; /* no */
      @include light {
        color: #5e6c80;
        border-color: #d9dce0;
      }
      &:nth-child(1) {
        background-color: var(--primary-color);
        color: #fff;
        margin-right: 15px;
        border-color: var(--primary-color);
      }
    }
  }
}
</style>
