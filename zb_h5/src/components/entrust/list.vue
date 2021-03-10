<template>
  <div class="entrust-list" v-loading="loading">
    <native-scroll :enabled="enabledScroll" v-if="list.length || loading">
      <template v-if="loading == false">
        <div :class="statusClass(item)" :key="item[0]" class="entrust-item" v-for="item in list">
          <div class="item-head">
            <span :class="Number(item[5]) === 1 ? 'buy-bg' : 'sell-bg'" class="type">{{
              Number(item[5]) === 1 ? '__("买")' : '__("卖")'
            }}</span>
            <time>{{ item[6] | date('YYYY/MM/DD hh:mm:ss') }}</time>
            <span
              @click="cancelOrder(item[0])"
              class="state state-btn"
              v-if="item[7] === 3 && [9, 13].indexOf(Number(item[11])) === -1"
              >撤销</span
            >
            <span class="state" v-if="[1, 2].indexOf(Number(item[7])) > -1">{{
              Number(item[7]) === 1 ? '已取消' : '已完成'
            }}</span>
          </div>
          <div class="item-body">
            <dl>
              <dt>__('数量'){{ mixinsCShowNameUp }}</dt>
              <dd class="value">{{ item[2] }}</dd>
            </dl>
            <dl>
              <dt>__('已成交'){{ mixinsCShowNameUp }}</dt>
              <dd class="value">{{ item[3] }}</dd>
            </dl>
            <dl>
              <dt>__('委托价格/成交均价'){{ mixinsFShowNameUp }}</dt>
              <dd class="value">{{ item[1] + ' / ' + getAvgPrice(item[4], item[3]) }}</dd>
            </dl>
          </div>
          <div class="progress-bar">
            <span
              :class="Number(item[5]) === 1 ? 'buy-bg' : 'sell-bg'"
              :style="{ width: getProgressBarWidth(item[3], item[2]) + '%' }"
            />
          </div>
        </div>
      </template>
    </native-scroll>
    <no-data :visible="list.length === 0 && loading === false" />
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import noData from '@/components/common/no-data.vue';
import { send, IWebsocketObserve } from '@/utils/websocket';
import mixinsMarket from '@/mixins/market/market';
import { State, Getter } from 'vuex-class';
import { IUser } from '@/store/modules/user';
import { fixNumber } from '@/utils/math';
import mixinsSignHooks, { ISignHooks } from '@/mixins/user/sign-hooks';
import { Dialog } from 'vant';
import { doCancelEntrust } from '@/api/trade';

interface ISocketRes {
  // [委托ID,委托单价,委托数量,成交数量,成交总金额,委托买卖类型,委托时间,委托成交状态]
  hrecord: string[];
  // [委托ID,委托单价,委托数量,成交数量,成交总金额,委托买卖类型,委托时间,委托成交状态]
  record: string[];
}
type DataTypes = 'current' | 'history';
@Component({
  components: {
    noData
  }
})
export default class EntrustList extends Mixins(mixinsMarket, mixinsSignHooks) implements ISignHooks {
  @Prop({ type: String, validator: v => ['current', 'history'].indexOf(v) > -1, default: 'current' }) dataType!: DataTypes;
  @Prop({ type: Number, default: 0 }) length!: number;
  loading: boolean = false;
  websocketObserve: IWebsocketObserve | null = null;
  entrustInfo: ISocketRes = {
    hrecord: [],
    record: []
  };
  get enabledScroll() {
    return this.$route.name !== 'trade-handicap';
  }
  get list() {
    let list: string[] = [];
    if (this.dataType === 'current') {
      let { record } = this.entrustInfo;
      if (record && record.length > 0) {
        if (this.length > 0) {
          list = record.slice(0, this.length);
        } else {
          list = record;
        }
      }
    } else if (this.dataType === 'history') {
      let { hrecord } = this.entrustInfo;
      if (hrecord && hrecord.length > 0) {
        list = hrecord;
      }
    }
    return list;
  }
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser;
  @Getter('isLogin', { namespace: 'user' }) isLogin!: boolean;
  @Watch('mixinsTradeStr')
  _() {
    this.refreshEntrustList();
  }
  getProgressBarWidth(current: number, amount: number) {
    return (Number(current) / Number(amount)) * 100 || 0;
  }
  statusClass(item: string[]) {
    if (Number(item[7]) === 3) {
      return '';
    }
    return Number(item[7]) === 1 ? 'entrust--cancel' : 'entrust--done';
  }
  getAvgPrice(total: string, number: string) {
    if (Number(total)) {
      return fixNumber(Number(total) / Number(number), this.mixinsMoneyDecimal);
    }
    return '--';
  }
  cancelOrder(entrustId: string) {
    Dialog.confirm({
      message: '是否取消该委托'
    })
      .then(async () => {
        try {
          let res = await doCancelEntrust({
            market: this.mixinsTradeStr,
            entrustId,
            planType: false
          });
          if (res.resMsg.code === 1000) {
            this.$message.success(res.resMsg.message);
          } else {
            this.$message.fail(res.resMsg.message);
          }
        } catch (err) {
          this.$message.fail('取消订单失败');
        }
      })
      .catch(() => {});
  }
  async getData() {
    this.websocketObserve && this.websocketObserve.unsubscribe(true);
    this.websocketObserve = await send(
      {
        binary: true,
        channel: 'push_user_record',
        event: 'addChannel',
        isZip: true,
        market: `${this.mixinsCShowName}${this.mixinsFShowName}default`,
        userId: this.userInfo.userId ? this.userInfo.userId : ''
      },
      websocketInstance => {
        websocketInstance
          .subscribe((list: ISocketRes[]) => {
            if (list && list.length > 0) {
              this.entrustInfo = list[0];
            }
            window.setTimeout(() => {
              this.loading = false;
            }, 200);
          })
          .catch(() => {
            // eslint-disable-next-line
            this.entrustInfo = {} as ISocketRes;
            this.loading = false;
          });
      }
    );
  }
  refreshEntrustList() {
    if (this.isLogin === true) {
      this.signIn();
    } else {
      this.signOut();
    }
  }
  signIn() {
    this.loading = true;
    this.getData();
  }
  signOut() {
    this.entrustInfo.hrecord = [];
    this.entrustInfo.record = [];
  }
  beforeDestroy() {
    this.websocketObserve && this.websocketObserve.unsubscribe(true);
  }
}
</script>

<style lang='scss'>
.entrust-list {
  flex: 1;
  overflow: hidden;
  font-size: 12px;
  .nodata-box {
    height: 100%;
  }
  .entrust-item {
    padding: 15px;
    position: relative;
  }
  .item-head {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .type {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 5px;
      @include bold;
      color: #fff;
    }
    .state {
      margin-left: auto;
      @include bold;
    }
    .state-btn {
      color: var(--primary-color);
    }
  }
  .item-body {
    display: flex;
    justify-content: space-between;
    dl:last-of-type {
      text-align: right;
    }
    dt {
      font-size: 10px;
      color: var(--thin-color);
    }
    dd {
      color: var(--heavy-color);
      margin-top: 6px;
      font-size: 14px;
      font-weight: 500;
    }
  }
  .progress-bar {
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 0;
    height: 2px; /* no */
    background-color: var(--line-color);
    border-radius: 10px;
    overflow: hidden;
    span {
      position: absolute;
      left: 0;
      height: 2px; /* no */
      width: 0%;
      border-radius: 10px;
      overflow: hidden;
      transition: width 0.25s;
    }
  }
  .entrust--done .progress-bar {
    height: 1px; /* no */
    span {
      height: 1px; /* no */
      opacity: 0;
    }
  }
}
</style>
