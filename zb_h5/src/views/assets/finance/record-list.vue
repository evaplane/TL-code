<template>
  <div class="record-list-wrap assets-panel">
    <div class="record-list-header">
      <div @click="$router.back()" class="header-btn"><icon-return /></div>
      <span class="head-title">__('理财记录')</span>
    </div>
    <div class="record-list-content" v-loading="loading">
      <no-data :visible="!loading && !list.length" />
      <native-scroll
        :data="list"
        virtual-scroll
        @scroll-end="pullup"
        pulldown
        @refresh="pulldown"
        pullup
        v-if="list.length && !loading"
      >
        <template #virtual="{ data }">
          <div class="record-list-item" @click="detail(data)">
            <ul>
              <li>
                <span class="record-list-item-amount">__('借出'){{ data.amount }} {{ coin }}</span>
                <span class="record-list-item-status">{{ data.statusShow }} </span>
              </li>
              <li>
                <div>
                  <span class="gray-color">__('借出') {{ coin }}</span>
                  <span>{{ data.amount }}</span>
                </div>
                <div>
                  <span class="gray-color">__('归还') {{ coin }}</span>
                  <span>{{ data.hasRepay }}</span>
                </div>
                <div>
                  <span class="gray-color">__('利率')</span>
                  <span>{{ data.rateShow }}%</span>
                </div>
              </li>
              <li>
                <div>
                  <span class="gray-color">__('累计利息') {{ coin }}</span>
                  <span>{{ +data.arrearsLx + +data.hasLx }}</span>
                </div>
                <div>
                  <span class="gray-color">__('已还利息') {{ coin }}</span>
                  <span>{{ data.arrearsLx }}</span>
                </div>
                <div>
                  <span class="gray-color">__('是否自动续借')</span>
                  <span>{{ data.investMark ? '__("是")' : '__("否")' }}</span>
                </div>
              </li>
              <li>
                <div>
                  <span class="gray-color">__('借出时间')</span>
                  <span>{{ data.createTimeShow }}</span>
                </div>
                <div>
                  <span class="gray-color">__('还款时间')</span>
                  <span>{{ data.repayDateShow }}</span>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </native-scroll>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { loanRecordList, ILoanRecordListResList } from '@/api/lever';
import { setSession } from '@/utils/storage';
@Component
export default class RecordList extends Vue {
  pageIndex: number = 1;
  list: ILoanRecordListResList[] = [];
  loading: boolean = true;
  coin: string = '';
  pullup() {
    this.pageIndex++;
    this.loanRecordList();
  }
  pulldown() {
    this.pageIndex = 1;
    this.loanRecordList();
  }
  async loanRecordList() {
    try {
      let { recordList } = await loanRecordList({ loanId: +this.$route.query.id, pageIndex: this.pageIndex, pageSize: 4 });
      this.list = this.pageIndex === 1 ? recordList : this.list.concat(recordList);
    } catch (error) {}
    this.loading = false;
  }
  detail(obj: ILoanRecordListResList) {
    setSession('__temp-return-detail-info', obj);
    this.$router.push({ name: 'finance-record-detail', params: { id: obj.id + '' } });
  }
  async mounted() {
    this.loanRecordList();
    this.coin = this.$route.query.coin as string;
  }
}
</script>
<style lang='scss'>
.record-list-wrap {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--default-bg);
  z-index: 5;
  .record-list-header {
    padding: var(--padding-lr);
    color: var(--theme-color);
    .head-title {
      font-size: 28px;
      display: block;
      margin-top: 20px;
      font-weight: 600;
      color: #000;
      @include dark {
        color: var(--theme-color);
      }
    }
  }
  .record-list-content {
    height: calc(100% - 102px);
    .nodata-box {
      height: 80vh;
    }
    .record-list-item {
      border-bottom: 4px solid var(--border-color);
      padding: 10px 0;
      ul li {
        padding: 5px var(--padding-lr);
        display: flex;
        justify-content: space-between;
        line-height: 1.6;
        div span.gray-color {
          display: block;
          font-weight: 400;
        }
        div {
          &:nth-of-type(1) {
            width: 40%;
          }
          &:nth-of-type(2) {
            flex: 1;
          }
          &:nth-last-of-type(1) {
            text-align: right;
          }
          span {
            font-weight: 600;
          }
        }
      }
      .record-list-item-amount {
        font-size: 16px;
        font-weight: 600;
      }
      .record-list-item-status {
        font-size: 14px;
        color: var(--color);
        display: flex;
        align-items: center;
        &::after {
          content: '';
          display: block;
          margin-left: 5px;
          width: 7px; /* no */
          height: 7px; /* no */
          border-right: 1px solid; /* no */
          border-top: 1px solid; /* no */
          transform: rotate(45deg);
          border-color: var(--theme-color);
        }
      }
    }
  }
}
</style>
