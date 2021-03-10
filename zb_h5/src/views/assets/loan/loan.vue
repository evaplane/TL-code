<template>
  <native-scroll>
    <div v-loading="loading" class="loan-container">
      <template v-if="mortgageCoin && borrowCoin && borrowCycle">
        <div class="pledge-box">
          <div class="loan-list">
            <div class="loan-item" @click="mortgageSheetVisible = true">
              <span class="label">__('抵押币种')</span>
              <p class="value">{{ mortgageCoin.coinShowName }}</p>
            </div>
            <div class="loan-tips">__('参考价格') {{ mortgageCoin.marketPrice }} {{ moneyUnit }}</div>
            <div class="loan-item">
              <!-- ({{ mortgageCoin.coinShowName }}) -->
              <span class="label">__('抵押数量')</span>
              <div class="fill-input">
                <input type="number" v-model="mortgageAmount" placeholder="__('请输入抵押数量')" class="input" />
                <span class="placeholder">__('请输入抵押数量')</span>
              </div>
            </div>
            <div class="loan-tips">__('可用') {{ mortgageCoin.userAccount }} {{ mortgageCoin.coinShowName }}</div>
          </div>

          <!-- <div class="input-box">
            <div class="input-hint">
              <p>__('抵押数量')</p>
            </div>
            <div class="input-selector">
              <van-field
                v-model="mortgageAmount"
                :max="mortgageCoin.userAccount"
                itype="number"
                placeholder="__('请输入抵押数量')"
              />
              <p class="hint">{{ mortgageCoin.coinShowName }}</p>
            </div>
          </div> -->
        </div>
        <div class="loan-box">
          <div class="loan-list">
            <div class="loan-item" @click="borrowSheetVisible = true">
              <span class="label">__('借款币种')</span>
              <p class="value">{{ borrowCoin.coinShowName }}</p>
            </div>
            <div class="loan-tips">__('参考价格') {{ borrowCoin.marketPrice }} {{ moneyUnit }}</div>
            <div class="loan-item">
              <!-- ({{ borrowCoin.coinShowName }}) -->
              <span class="label">__('借入数量')</span>
              <div class="fill-input">
                <input type="number" v-model="borrowAmount" placeholder="__('请输入借入数量')" class="input" />
                <span class="placeholder">__('请输入借入数量')</span>
              </div>
            </div>
            <div class="loan-tips">__('可借') {{ maxBorrow }} {{ borrowCoin.coinShowName }}</div>
            <div class="loan-item" v-if="borrowCycle" @click="cycleSheetVisible = true">
              <span class="label">__('借款周期')</span>
              <p class="value">{{ borrowCycle.cycleName }}</p>
            </div>
            <div class="loan-tips" v-if="borrowCycle.type === 1">
              __('借款利率') {{ borrowCycle.interestOneDayRateShow }}(__('日利率'))
            </div>
            <div class="loan-tips" v-else>__('借款利率') {{ borrowCycle.interestRateShow }}(__('年利率'))</div>
          </div>
          <!-- <div class="input-box">
            <div class="input-hint">
              <p>__('借入数量')</p>
            </div>
            <div class="input-selector">
              <van-field v-model="borrowAmount" :max="maxBorrow" itype="number" placeholder="__('请输入借入数量')" />
              <p class="hint">{{ borrowCoin.coinShowName }}</p>
            </div>
          </div>
          <p class="hint-price">__('可借') {{ maxBorrow }} {{ borrowCoin.coinShowName }}</p> -->

          <!-- <div v-if="borrowCycle" class="input-box">
            <div class="input-hint">
              <p>__('借款周期')</p>
            </div>
            <div class="input-selector" @click="cycleSheetVisible = true">
              <p class="val">{{ borrowCycle.cycleName }}</p>
              <img src="@img/assets/icon/icon-right.svg" />
            </div>
          </div>
          <p class="hint-price" v-if="borrowCycle.type === 1">
            __('借款利率') {{ borrowCycle.interestOneDayRateShow }}(__('日利率'))
          </p>
          <p class="hint-price" v-else>__('借款利率') {{ borrowCycle.interestRateShow }}(__('年利率'))</p> -->
        </div>

        <div class="loan-btn">
          <button @click="submitClickHanle">__('提交')</button>
        </div>
        <div class="loan-tips loan-tips-other">
          <p>__('温馨提示')</p>
          <p>__('由于市场价格实时变动，实际到账的借入数量以市场实时价格为准。')</p>
        </div>
      </template>
    </div>

    <van-action-sheet
      :actions="mortgageCoinsActions"
      :lazy-render="false"
      @select="mortgageSelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="mortgageSheetVisible"
    />
    <van-action-sheet
      :actions="borrowCoinsActions"
      :lazy-render="false"
      @select="borrowSelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="borrowSheetVisible"
    />

    <van-action-sheet
      :actions="borrowCyclesActions"
      :lazy-render="false"
      @select="cycleSelectHandle"
      cancel-text="__('取消')"
      get-container="body"
      safe-area-inset-bottom
      v-model="cycleSheetVisible"
    />
  </native-scroll>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import nativeScroll from '@/components/common/native-scroll/index.vue';
import { send, IWebsocketObserve } from '@/utils/websocket';
import {
  getToLoanFund,
  ILoanFundMortgageCoin,
  ILoanFundBorrowRate,
  getMaxBorrow,
  TMortgageBorrowType,
  doMortgageBorrow
} from '@/api/mortgage';
import { Catch } from '@/utils/decorators';
import { debounce } from '@/utils/date';

interface ITradeRecordItem {
  amount: string;
  date: number;
  price: string;
  tid: number;
  trade_type: string;
  type: string;
}
interface ITradeRecordData {
  data: ITradeRecordItem[];
  rate: string;
  no: number;
}

@Component({
  components: {
    nativeScroll
  }
})
export default class LoanContainer extends Vue {
  websocketInstance!: IWebsocketObserve | null;

  mortgageCoinList: ILoanFundMortgageCoin[] = []; // 抵押借款币种列表
  borrowCycles: ILoanFundBorrowRate[] = []; // 借款周期

  mortgageCoin: ILoanFundMortgageCoin | null = null; // 选择的抵押币种
  mortgageAmount: string = ''; // 抵押数量
  borrowCoin: ILoanFundMortgageCoin | null = null; // 选择的借入币种
  borrowAmount: string = ''; // 借入数量
  borrowCycle: ILoanFundBorrowRate | null = null; // 选择的借款周期

  mortgageSheetVisible: boolean = false; // 抵押币种选择
  borrowSheetVisible: boolean = false; // 借入币种选择
  cycleSheetVisible: boolean = false; // 借款周期选择

  maxBorrow: string = '0'; // 最大借入量

  moneyUnit: string = 'CNY';

  getMaxBorrowDebounce: Function | null = null;

  loading: boolean = false;

  /** 是否为借款 */
  get isLoanMoney() {
    return this.$route.name === 'loan-money';
  }

  // 类型 1-借币， 2-借钱
  get type(): TMortgageBorrowType {
    return this.isLoanMoney ? 2 : 1;
  }

  /** 数字货币 */
  get digitalCoins() {
    return this.mortgageCoinList.filter(item => {
      if (this.isLoanMoney) {
        // 借款 数字货币作为抵押币种，不能与借入币种相同
        return (item.digtalCoin || item.isGeneral === 1) && item.fundsType !== (this.borrowCoin && this.borrowCoin.fundsType);
      } else {
        // 借币 数字货币作为借入币种，不能与抵押币种相同
        return (item.digtalCoin || item.isGeneral === 1) && item.fundsType !== (this.mortgageCoin && this.mortgageCoin.fundsType);
      }
    });
  }

  /** 法币 */
  get legalCoins() {
    return this.mortgageCoinList.filter(item => {
      if (this.isLoanMoney) {
        // 借款 法币作为借入币种，不能与抵押币种相同
        return !item.digtalCoin && item.fundsType !== (this.mortgageCoin && this.mortgageCoin.fundsType);
      } else {
        // 借币 法币作为抵押币种，不能与借入币种相同
        return !item.digtalCoin && item.fundsType !== (this.borrowCoin && this.borrowCoin.fundsType);
      }
    });
  }

  /**
   * 抵押币种
   * 借款时为 数字货币
   * 借币时为 法币
   */
  get mortgageCoins() {
    return this.isLoanMoney ? this.digitalCoins : this.legalCoins;
  }

  /**
   * 借入币种
   * 借款时为 法币
   * 借币时为 数字货币
   */
  get borrowCoins() {
    return this.isLoanMoney ? this.legalCoins : this.digitalCoins;
  }

  get borrowCyclesActions() {
    return this.borrowCycles.map(item => ({
      ...item,
      name: item.cycleName,
      className: (this.borrowCycle && this.borrowCycle.id) === item.id ? 'van-action-sheet__item--active' : ''
    }));
  }

  get mortgageCoinsActions() {
    return this.mortgageCoins.map(item => ({
      ...item,
      name: item.coinShowName,
      className: (this.mortgageCoin && this.mortgageCoin.id) === item.id ? 'van-action-sheet__item--active' : ''
    }));
  }

  get borrowCoinsActions() {
    return this.borrowCoins.map(item => ({
      ...item,
      name: item.coinShowName,
      className: (this.borrowCoin && this.borrowCoin.id) === item.id ? 'van-action-sheet__item--active' : ''
    }));
  }

  @Watch('isLoanMoney', { immediate: true })
  isLoanMoneyWatcher() {
    this.mortgageCoin = null;
    this.borrowCoin = null;
  }

  @Watch('mortgageCoins', { deep: true, immediate: true })
  mortgageCoinsWatcher(mortgageCoins: ILoanFundMortgageCoin[]) {
    if (this.mortgageCoin === null) {
      this.mortgageCoin = mortgageCoins[0] || null;
      this.getMaxBorrow();
    }
  }

  @Watch('borrowCoins', { deep: true, immediate: true })
  borrowCoinsWatcher(borrowCoins: ILoanFundMortgageCoin[]) {
    if (this.borrowCoin === null) {
      this.borrowCoin = borrowCoins[0] || null;
      this.getMaxBorrow();
    }
  }

  @Watch('mortgageCoin', { deep: true, immediate: true })
  mortgageCoinWatcher(mortgageCoin: ILoanFundMortgageCoin | null, oldMortgageCoin: ILoanFundMortgageCoin | null) {
    if (mortgageCoin && mortgageCoin.fundsType !== (oldMortgageCoin && oldMortgageCoin.fundsType)) {
      this.getMarketPrice(mortgageCoin);
    }
  }
  @Watch('borrowCoin', { deep: true, immediate: true })
  borrowCoinWatcher(borrowCoin: ILoanFundMortgageCoin | null, oldBorrowCoin: ILoanFundMortgageCoin | null) {
    if (borrowCoin && borrowCoin.fundsType !== (oldBorrowCoin && oldBorrowCoin.fundsType)) {
      this.getMarketPrice(borrowCoin);
    }
  }

  @Watch('mortgageAmount')
  mortgageAmountWatcher() {
    this.getMaxBorrowDebounce && this.getMaxBorrowDebounce();
  }

  async getMarketPrice(coin: ILoanFundMortgageCoin) {
    const coinMap: IObj<string> = {
      CNY: 'qc',
      USD: 'usdt'
    };
    const coinSymbol = coin.coinName.toLowerCase();
    const moneySymbol = coinMap[this.moneyUnit];

    if (coinSymbol === moneySymbol) {
      this.$set(coin, 'marketPrice', 1);
      return;
    }

    this.websocketInstance && this.websocketInstance.unsubscribe(true);
    const channel = `${coinSymbol}${moneySymbol}_lasttrades`;
    this.websocketInstance = await send(
      {
        isZip: true,
        binary: true,
        channel,
        event: 'addChannel'
      },
      instance => {
        instance
          .subscribe((res: ITradeRecordData): void => {
            let list = res.data;
            let price = list[0].price;
            this.$set(coin, 'marketPrice', price);
          })
          .catch(() => {
            this.$set(coin, 'marketPrice', '--');
          });
      }
    );
  }

  @Catch()
  async getToLoanFund() {
    this.loading = true;
    let res = await getToLoanFund();
    // eslint-disable-next-line
    // let res = {"mortgageCoinList":[{"borrowRatio":"0.90","coinName":"qc","coinShowName":"QC","delete":false,"digtalCoin":false,"explosionRatio":"1.01","ftype":{"btc":false,"canRecharge":true,"canRechargeFiat":false,"canWithdraw":true,"cnname":"QC","coin":true,"coinArea":0,"coinAreaName":"主流币种","coinParam":"coint","currencyUser":true,"dao":false,"databaseKey":"qc","databasesName":"zb_qc","digtalCoin":true,"enname":"QC","etc":false,"eth":false,"fatherFundsType":11,"feeZero":false,"fundsType":15,"iCO":false,"innerTransfer":true,"isICO":false,"isToken":false,"lastCoin":false,"linkCoins":"[{\"fatherFundsType\":5,\"useFatherUrl\":true,\"coinName\":\"eqc\"}]","ltc":false,"main":true,"minFee":"0.10","minWithdrawAmount":"0.10","name":"qc","newDigtalCoin":true,"outDatabaseName":"","propCnName":"QC","propEnName":"QC","propTag":"QC","selectTag":false,"show":true,"showName":"QC","showNameLower":"qc","stag":"qc","tag":"QC","token":false,"tokenChain":"","txUrl":"https://explorer.qtum.org/tx/","unitDecimal":8,"unitTag":"QC","upTag":"Qc","useMemo":false,"utag":"QC","web":"https://explorer.qtum.org/address/","withdrawCoins":"[{\"fatherFundsType\":11,\"isDefault\":true,\"showName\":\"QTUM链\",\"isOpen\":true,\"name\":\"qc\"},{\"fatherFundsType\":5,\"isDefault\":false,\"showName\":\"ETH链\",\"isOpen\":true,\"name\":\"eqc\"}]","withdrawScale":8},"fundsType":15,"id":1,"isGeneral":0,"noticeRatio":"1.03","open":true,"penaltyRatio":"0.01","userAccount":"0.00"},{"borrowRatio":"0.90","coinName":"usdt","coinShowName":"USDT","delete":false,"digtalCoin":false,"explosionRatio":"1.01","ftype":{"btc":false,"canRecharge":true,"canRechargeFiat":false,"canWithdraw":true,"cnname":"USDT","coin":true,"coinArea":0,"coinAreaName":"主流币种","coinParam":"coint","currencyUser":false,"dao":false,"databaseKey":"usdt","databasesName":"zb_usdt","digtalCoin":true,"enname":"USDT","etc":false,"eth":false,"fatherFundsType":2,"feeZero":false,"fundsType":13,"iCO":false,"innerTransfer":true,"isICO":false,"isToken":false,"lastCoin":false,"linkCoins":"[{\"fatherFundsType\":5,\"useFatherUrl\":true,\"coinName\":\"eusdt\"}]","ltc":false,"main":true,"minFee":"5.00","minWithdrawAmount":"0.01","name":"usdt","newDigtalCoin":true,"outDatabaseName":"","propCnName":"USDT","propEnName":"USDT","propTag":"USDT","selectTag":false,"show":true,"showName":"USDT","showNameLower":"usdt","stag":"usdt","tag":"USDT","token":false,"tokenChain":"","txUrl":"https://omniexplorer.info/tx/","unitDecimal":8,"unitTag":"$","upTag":"Usdt","useMemo":false,"utag":"$","web":"https://omniexplorer.info/address/","withdrawCoins":"[{\"fatherFundsType\":2,\"isDefault\":true,\"showName\":\"BTC链\",\"isOpen\":true,\"name\":\"usdt\"},{\"fatherFundsType\":5,\"isDefault\":false,\"showName\":\"ETH链\",\"isOpen\":true,\"name\":\"eusdt\"}]","withdrawScale":8},"fundsType":13,"id":2,"isGeneral":1,"maxBorrowAmount":"4000000.00","noticeRatio":"1.03","open":true,"penaltyRatio":"0.01","userAccount":"0.00"},{"borrowRatio":"0.50","coinName":"btc","coinShowName":"BTC","delete":false,"digtalCoin":true,"explosionRatio":"1.10","ftype":{"btc":true,"canRecharge":true,"canRechargeFiat":false,"canWithdraw":true,"cnname":"BTC","coin":true,"coinArea":0,"coinAreaName":"主流币种","coinParam":"coint","currencyUser":false,"dao":false,"databaseKey":"btc","databasesName":"zb","digtalCoin":true,"enname":"BTC","etc":false,"eth":false,"fatherFundsType":0,"feeZero":false,"fundsType":2,"iCO":false,"innerTransfer":true,"isICO":false,"isToken":false,"lastCoin":false,"ltc":false,"main":true,"minFee":"0.0006","minWithdrawAmount":"0.0001","name":"btc","newDigtalCoin":false,"outDatabaseName":"","propCnName":"BTC","propEnName":"BTC","propTag":"BTC","selectTag":false,"show":true,"showName":"BTC","showNameLower":"btc","stag":"btc","tag":"BTC","token":false,"tokenChain":"","txUrl":"https://block.bitbank.com/tx/btc/","unitDecimal":8,"unitTag":"฿","upTag":"Btc","useMemo":false,"utag":"฿","web":"https://block.bitbank.com/address/btc/","withdrawScale":8},"fundsType":2,"id":3,"isGeneral":0,"noticeRatio":"1.20","open":true,"penaltyRatio":"0.01","userAccount":"0.00"},{"borrowRatio":"0.35","coinName":"ltc","coinShowName":"LTC","delete":false,"digtalCoin":true,"explosionRatio":"1.10","ftype":{"btc":true,"canRecharge":true,"canRechargeFiat":false,"canWithdraw":true,"cnname":"LTC","coin":true,"coinArea":0,"coinAreaName":"主流币种","coinParam":"coint","currencyUser":false,"dao":false,"databaseKey":"ltc","databasesName":"zb","digtalCoin":true,"enname":"LTC","etc":false,"eth":false,"fatherFundsType":0,"feeZero":false,"fundsType":3,"iCO":false,"innerTransfer":false,"isICO":false,"isToken":false,"lastCoin":false,"ltc":false,"main":true,"minFee":"0.005","minWithdrawAmount":"0.001","name":"ltc","newDigtalCoin":false,"outDatabaseName":"","propCnName":"LTC","propEnName":"LTC","propTag":"LTC","selectTag":false,"show":true,"showName":"LTC","showNameLower":"ltc","stag":"ltc","tag":"LTC","token":false,"tokenChain":"","txUrl":"https://block.bitbank.com/tx/ltc/","unitDecimal":8,"unitTag":"Ł","upTag":"Ltc","useMemo":false,"utag":"Ł","web":"https://block.bitbank.com/address/ltc/","withdrawScale":8},"fundsType":3,"id":7,"isGeneral":0,"noticeRatio":"1.20","open":true,"penaltyRatio":"0.01","userAccount":"0.00"},{"borrowRatio":"0.35","coinName":"eos","coinShowName":"EOS","delete":false,"digtalCoin":true,"explosionRatio":"1.10","ftype":{"btc":true,"canRecharge":true,"canRechargeFiat":false,"canWithdraw":true,"cnname":"EOS","coin":true,"coinArea":2,"coinAreaName":"Token币种","coinParam":"coint","currencyUser":true,"dao":false,"databaseKey":"eos","databasesName":"zb","digtalCoin":true,"enname":"EOS","etc":false,"eth":false,"fatherFundsType":0,"feeZero":false,"fundsType":9,"iCO":false,"innerTransfer":false,"isICO":false,"isToken":false,"lastCoin":false,"ltc":false,"main":true,"minFee":"1.00","minWithdrawAmount":"0.10","name":"eos","newDigtalCoin":false,"outDatabaseName":"","propCnName":"EOS","propEnName":"EOS","propTag":"EOS","selectTag":false,"show":true,"showName":"EOS","showNameLower":"eos","stag":"eos","tag":"EOS","token":false,"tokenChain":"","txUrl":"https://eospark.com/MainNet/tx/","unitDecimal":8,"unitTag":"EOS","upTag":"Eos","useMemo":true,"utag":"EOS","web":"https://eospark.com/MainNet/account/","withdrawCoinName":"zeos","withdrawScale":8},"fundsType":9,"id":9,"isGeneral":0,"noticeRatio":"1.20","open":true,"penaltyRatio":"0.01","userAccount":"0.00"}],"borrowRateList":[{"cycleId":1,"cycleName":"30天","id":2,"interestOneDayRateShow":"0.041095%","interestRate":"0.15","interestRateShow":"15%","type":2},{"cycleId":3,"cycleName":"90天","id":4,"interestOneDayRateShow":"0.041095%","interestRate":"0.15","interestRateShow":"15%","type":2},{"cycleId":4,"cycleName":"180天","id":5,"interestOneDayRateShow":"0.041095%","interestRate":"0.15","interestRateShow":"15%","type":2},{"cycleId":5,"cycleName":"按天结算（最长180天）","id":1,"interestOneDayRateShow":"0.05%","interestRate":"0.1825","interestRateShow":"18.25%","type":1}]}
    this.mortgageCoinList = res.mortgageCoinList;
    this.borrowCycles = res.borrowRateList;
    this.borrowCycle = this.borrowCycles[0];
    this.loading = false;
  }

  // 获取最大可借入量
  @Catch()
  async getMaxBorrow() {
    if (!this.mortgageCoin || !this.borrowCoin) return;
    const params = {
      type: this.type,
      mortgageCoin: this.mortgageCoin.fundsType,
      mortgageAmount: this.mortgageAmount,
      borrowCoin: this.borrowCoin.fundsType
    };
    let res = await getMaxBorrow(params);
    this.maxBorrow = res.maxBorrow;
  }

  /** 选择借款周期 */
  cycleSelectHandle(data: ILoanFundBorrowRate) {
    this.borrowCycle = data;
    this.cycleSheetVisible = false;
  }

  /** 选择抵押币种 */
  mortgageSelectHandle(data: ILoanFundMortgageCoin) {
    this.mortgageCoin = data;
    this.getMaxBorrow();

    this.mortgageSheetVisible = false;
  }
  /** 选择借入币种 */
  borrowSelectHandle(data: ILoanFundMortgageCoin) {
    this.borrowCoin = data;
    this.getMaxBorrow();

    this.borrowSheetVisible = false;
  }

  async submitClickHanle() {
    if (this.loading) return;

    if (!this.mortgageCoin) return this.$message.warn('__("请选择抵押币种")');
    if (this.mortgageAmount === '') return this.$message.warn('__("请输入抵押数量")');
    if (Number(this.mortgageAmount) === 0) return this.$message.warn('__("抵押数量不能为0")');

    if (!this.borrowCoin) return this.$message.warn('__("请选择借入币种")');
    if (this.borrowAmount === '') return this.$message.warn('__("请输入借入数量")');
    if (Number(this.borrowAmount) === 0) return this.$message.warn('__("借入数量不能为0")');

    if (!this.borrowCycle) return this.$message.warn('__("请选择借款周期")');

    this.loading = true;
    try {
      await doMortgageBorrow({
        type: this.type,
        borrowCycleId: this.borrowCycle.cycleId,
        borrowRateId: this.borrowCycle.id,
        mortgageCoin: this.mortgageCoin.fundsType,
        mortgageAmount: this.mortgageAmount,
        borrowCoin: this.borrowCoin.fundsType,
        borrowAmount: this.borrowAmount
      });
      this.$message.success('__("提交成功")');
      this.$router.replace({
        name: 'loan-mortgage'
      });
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
    this.loading = false;
  }

  mounted() {
    this.getToLoanFund();
    this.getMaxBorrowDebounce = debounce(this.getMaxBorrow, 60);
  }

  beforeDestroy() {
    this.websocketInstance && this.websocketInstance.unsubscribe(true);
  }
}
</script>

<style lang="scss">
.loan-container {
  height: 100%;
  padding: 20px 15px;
  .loan-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 50px;
    background-color: var(--default-bg);
    @include dark {
      background-color: #25232d;
    }
    font-size: 14px;
    border-radius: 4px;
    margin-bottom: 20px;
    .label {
      color: var(--heavy-color);
      padding-left: 15px;
    }
    .value {
      display: flex;
      align-items: center;
      padding-right: 15px;
      color: var(--heavy-color);
      &::after {
        content: '';
        width: 8px; /* no */
        height: 8px; /* no */
        border-right: 2px solid var(--thin-color); /* no */
        border-top: 2px solid var(--thin-color); /* no */
        transform: rotate(45deg);
        margin-left: 5px;
      }
    }
    .unit {
      padding-right: 15px;
      margin-left: -7px;
      color: var(--heavy-color);
    }
    .fill-input {
      flex: 1;
      height: 100%;
      position: relative;
      input {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        background-color: transparent;
        color: var(--heavy-color);
        font-size: 14px;
        text-align: right;
        padding: 0 15px;
        -webkit-appearance: none;
      }
      .placeholder {
        color: var(--thin-color);
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
      }
      input:placeholder-shown::placeholder {
        color: transparent;
      }
      input:not(:placeholder-shown) + .placeholder {
        display: none;
      }
    }
  }
  .loan-tips {
    margin-top: -10px;
    padding: 0 15px 20px 15px;
    color: var(--thin-color);
    &.loan-tips-other {
      padding-left: 0;
      padding-right: 0;
    }
    p {
      line-height: 1.5;
      margin-top: 5px;
    }
  }
  .loan-btn {
    padding: 20px 0;
    button {
      width: 100%;
      height: 44px;
      font-size: 16px;
      color: #fff;
      background-color: var(--primary-color);
      border-radius: 2px; /* no */
      @include bold;
      border: none;
      outline: none;
    }
  }
}
</style>
