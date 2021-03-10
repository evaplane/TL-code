<template>
  <div class="menu-header">
    <a class="logo" href="#">
      <img class="index-logo" src="@img/index/logo.svg" />
      <span>ZB</span>
      <icon-arrow />
    </a>
    <div class="header-right">
      <div @click="searchVisible" class="header-btn search-btn">
        <icon-search />
      </div>
      <div class="header-btn menu-btn" v-setting>
        <icon-menu />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Emit } from 'vue-property-decorator';
@Component
export default class Menu extends Vue {
  @Emit()
  searchVisible() { }
}
</script>

<style lang='scss'>
.menu-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding-left: 15px;
  display: flex;
  height: 55px;
  .logo {
    display: flex;
    align-items: center;
    img {
      width: 28px;
      height: 28px;
    }
    span {
      font-size: 20px;
      font-family: 'Helvetica Neue', Helvetica;
      color: #fff;
      opacity: 0.9;
      margin-left: 5px;
    }
  }
}
</style>
