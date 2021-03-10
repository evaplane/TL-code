<template>
  <transition name="search">
    <div class="coin-search-box" v-show="visible">
      <div class="search-input">
        <icon-search />
        <input placeholder="搜索币种" type="text" v-model="model" />
        <span class="placeholder">搜索币种</span>
      </div>
      <div @click="clickHandle" class="search-close">取消</div>
    </div>
  </transition>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
@Component
export default class Search extends Vue {
  @Prop({ type: Boolean, default: false }) visible!: boolean;
  @Prop({ default: '' }) value!: any;
  get model() {
    return this.value;
  }
  set model(val: any) {
    this.input(val);
  }
  @Emit()
  input(val: any) {
    return val;
  }
  @Emit()
  close() {}
  @Emit('update:visible')
  clickHandle() {
    this.close();
    return false;
  }
}
</script>

<style lang='scss'>
.coin-search-box {
  height: 60px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding-left: 15px;
  background-color: #000;
  transition: all 0.4s;
  .search-input {
    position: relative;
    flex: 1;
    border-radius: 2px; /* no */
    background-color: #24232f;
    .icon-search {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: #6e6d7d;
      width: 20px;
      pointer-events: none;
    }
    .placeholder {
      font-size: 14px;
      color: #6e6d7d;
      position: absolute;
      left: 34px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
    input {
      display: block;
      width: 100%;
      height: 40px;
      border-radius: 0;
      border: 0;
      background-color: transparent;
      color: #dad9e2;
      font-size: 14px;
      padding-left: 34px;
      font-weight: 500;
      -webkit-appearance: none;

      &:placeholder-shown::placeholder {
        color: transparent;
      }

      &:not(:placeholder-shown) ~ .placeholder {
        display: none;
      }
    }
  }

  .search-close {
    flex: none;
    display: flex;
    align-items: center;
    padding: 0 15px;
    color: #798090;
    font-size: 14px;
  }
}
.search-enter,
.search-leave-active {
  transform: translate3d(0, -100%, 0);
  -webkit-transform: translate3d(0, -100%, 0);
}
</style>
