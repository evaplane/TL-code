<template>
  <div class="entrust-box">
    <template v-if="isLogin">
      <div class="entrust-type">
        <div class="type-tab">
          <span @click="changeHandle(0)" :class="{ active: entrustType === 0 }">__('当前')</span>
          <span @click="changeHandle(1)" :class="{ active: entrustType === 1 }">__('历史委托')</span>
        </div>
      </div>
      <entrust-list :data-type="dataType" />
    </template>
    <div class="nologin" v-else>
      <div>
        <div class="nodata">
          <icon-nodata />
        </div>
        <div class="entrance">
          <span class="log" v-login>登录</span>
          <span class="reg" v-register>注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import entrustList from '@/components/entrust/list.vue';
import { Getter } from 'vuex-class';
import mSwitch from '@/components/common/switch/index.vue';
import { getLocal, setLocal } from '@/utils/storage';
@Component({
  components: {
    entrustList,
    mSwitch
  }
})
export default class Entrust extends Vue {
  entrustType = getLocal('__entrust_type') || 0;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  get dataType() {
    return this.entrustType === 0 ? 'current' : 'history';
  }
  changeHandle(val: number) {
    this.entrustType = val;
    setLocal('__entrust_type', val);
  }
  mounted() {
    let pointList = document.querySelectorAll('.red-point');
    if (pointList) {
      Array.from(pointList).map(item => {
        let parent = item.parentNode as HTMLDivElement;
        parent.removeChild(item);
      });
    }
  }
}
</script>

<style lang='scss'>
.entrust-box {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: var(--default-color);
  .entrust-type {
    flex: none;
    padding: 10px 15px;
    border-bottom: 1px solid var(--line-color); /* no */
    .type-tab {
      background-color: #f0f0f5;
      @include dark {
        background-color: rgba(255, 255, 255, 0.08);
      }
      border-radius: 4px;
      display: flex;
      padding: 3px;
      span {
        flex: 1;
        padding: 6px 0;
        border-radius: 4px;
        text-align: center;
        @include bold;
        &.active {
          color: var(--heavy-color);
          background-color: #fff;
          @include dark {
            background-color: rgba(255, 255, 255, 0.08);
          }
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  .nologin {
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
      span {
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
}
</style>
