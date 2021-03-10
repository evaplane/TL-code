<template>
  <div class="select-bank-wrap column">
    <div class="app-bar-wrap">
      <div class="app-bar">
        <div @click="delComponent" class="tab-left">
          <i class="zbicon-icon-parent" />
        </div>
        <div class="tab-center">选择银行卡</div>
      </div>
      <div class="blank-line"></div>
    </div>
    <div class="select-coin-list">
      <ul class="ul-wrap">
        <li :key="index" v-for="(item, index) in newBankCard">
          <div @click="selectBank(item.bankName, index)" class="content-wrap">
            <div>
              <span>{{ item.bankName }}</span>
            </div>
            <icon-portrait :img-url="require('@img/c2c/select-bank-icon.png')" size="22" v-show="selectIndex === index" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import iconPortrait from '@/components/c2c/icon-portrait.vue';
import appBar from '@/components/c2c/app-bar.vue';
import { reqGetAllBank, IBankListResponse } from '@/api/otc/bank';

@Component({
  components: {
    appBar,
    iconPortrait
  }
})
export default class SelectBank extends Vue {
  selectBankTitle: string = '';
  newBankCard: IBankListResponse[] = [];
  selectIndex: number = -1;

  @Emit('select-bank')
  delComponent() {
    return this.selectBankTitle;
  }

  async mounted() {
    this.newBankCard = await reqGetAllBank();
  }

  selectBank(title: string, index: number) {
    this.selectIndex = index;
    this.selectBankTitle = title;
  }
}
</script>

<style lang="scss">
.select-bank-wrap {
  width: 100%;
  background-color: var(--new-theme-bg);
  .select-coin-list {
    width: 100%;
    flex: 1;
  }

  .ul-wrap {
    @include light {
      background: var(--default-bg);
    }
    @include dark {
      background: var(--default-bg);
    }
    li {
      padding: 0 30px;
      font-size: 15px;
      font-weight: 400;
      @include light {
        color: var(--new-theme-color-3);
      }
      @include dark {
        color: var(--new-theme-color-3);
      }
    }
    .content-wrap {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  .app-bar-wrap {
    width: 100%;
    height: 63px;
    position: relative;
    .blank-line {
      height: 63px;
      width: 100%;
    }
    .app-bar {
      width: 100%;
      position: fixed;
      left: 0;
      top: 0;
      height: 63px;
      display: flex;
      padding-left: 18px;
      background: #ffffff;
      align-items: center;
      @include light {
        background: var(--default-bg);
      }
      @include dark {
        background: var(--default-bg);
      }
    }
    .tab-center {
      font-size: 24px;
      color: #4f5f8e;
      font-weight: 600;
    }
    .zbicon-icon-parent {
      margin-right: 30px;
      font-size: 20px;
      width: 25px;
      height: 20px;
      color: #d1d1d1;
    }
  }
}
</style>
