<template>
  <div class="assets-recharge">
    <div class="assets-box">
      <div class="assets-box-wrap" style="padding-left:20px;padding-right:20px;" v-if="mixinsIsLegalCurrency === false">
        <div class="tab" v-if="mixinsLinkCoins.length > 1">
          <span
            :class="{ 'tab-item--active': mixinsLinkCoinName === item.coinName }"
            :key="item.showName"
            @click="changeLinkCoinName(item.coinName)"
            class="tab-item"
            v-for="item in mixinsLinkCoins"
            >{{ item.showName }}</span
          >
        </div>
        <!-- 已创建充值地址 -->
        <template v-if="rechargeAddrInfo.key">
          <div class="qr-code" ref="code">
            <div class="qr-code-box">
              <img :src="qrCode" />
            </div>
          </div>
          <!-- 带备注特殊币种 -->
          <template v-if="rechargeAddrInfo.memo">
            <div class="address-info">
              <div class="first">
                <p class="label">账号</p>
                <p class="text">{{ rechargeAddrInfo.key }}</p>
                <a
                  :data-clipboard-text="rechargeAddrInfo.key"
                  @click="pasteHandle('.address-account')"
                  class="btn-copy address-account"
                  data-clipboard-action="copy"
                  href="javascript:;"
                  >拷贝账号</a
                >
              </div>
              <p class="label">备注(MEMO)</p>
              <p class="text">{{ rechargeAddrInfo.memo }}</p>
              <a
                :data-clipboard-text="rechargeAddrInfo.memo"
                @click="pasteHandle('.address-memo')"
                class="btn-copy address-memo"
                data-clipboard-action="copy"
                href="javascript:;"
                >拷贝备注(MEMO)</a
              >
            </div>
          </template>
          <!-- 普通币种 -->
          <div class="address-info" v-else>
            <p class="label">充值地址</p>
            <p class="text">{{ rechargeAddrInfo.key }}</p>
            <a
              :data-clipboard-text="rechargeAddrInfo.key"
              @click="pasteHandle('.address-copy')"
              class="btn-copy address-copy"
              data-clipboard-action="copy"
              href="javascript:;"
              >拷贝地址</a
            >
          </div>
        </template>
        <!-- 未创建充值地址 -->
        <div class="btn-wrap" v-else>
          <a @click="createAddress" class="btn btn-red address-copy" href="javascript:;">{{
            `获取${mixinsCoinNameUp}充值地址`
          }}</a>
        </div>
        <!-- 最低充值提示 -->
        <div class="assets-recharge-tips" v-if="Number(chargeMin) > 0">
          {{ `充值最低限额为$1 $2，低于该数量的充值无法到账。`.replace('$1', chargeMin).replace('$2', mixinsCoinNameUp) }}
        </div>
        <!-- 币种特殊提示 -->
        <div class="assets-recharge-config-tips" v-if="rechargeConfigTips.showTips">
          <pre v-html="rechargeConfigTips.tips" />
        </div>
      </div>
      <!-- 法币提示 -->
      <div class="assets-box-wrap" v-else>
        <div class="tab">
          <span
            :class="{ 'tab-item--active': legalCurrencyName === 'qc' }"
            @click="changeLegalCurrencyName('qc')"
            class="tab-item"
            >QC</span
          >
          <span
            :class="{ 'tab-item--active': legalCurrencyName === 'usdt' }"
            @click="changeLegalCurrencyName('usdt')"
            class="tab-item"
            >USDT</span
          >
        </div>
        <div class="legal-currency-tips">
          由于当地法律法规限制，中币以及全球各大主要交易平台支持使用QC、USDT等与人民币、美元大概恒定价值的数字货币作为法币用于撮合交易的法币，您的本次充值将使用场外交易系统完成。
        </div>
        <div class="btn-wrap">
          <a class="btn">自定义</a>
          <a @click="topupClickHandle" class="btn btn-red" href="javascript:;">闪电充值</a>
        </div>
      </div>
    </div>
    <div class="assets-recharge-safe-tips">
      <div class="title">安全提示</div>
      <div class="content">
        <p class="prominent" v-if="rechargeAddrInfo.memo">充值时必须填写备注</p>
        <p class="prominent">{{ `禁止充值除$1之外的其他资产，任何非$1资产充值将不可找回`.replace(/\$1/g, mixinsCoinNameUp) }}</p>
        <p>
          {{
            `1. 往该地址充值，汇款完成，等待网络自动确认（$1个确认）后系统自动到账`.replace(
              '$1',
              rechargeAddrInfo.rechargeConfirmTimes
            )
          }}
        </p>
        <p>2. 为了快速到账，充值时可以适当提高网络手续费</p>
        <p v-if="isEthChain">3. 充币仅支持以太坊的标准transfer方法，使用其他方法的充币暂时无法入账，请您谅解。</p>
      </div>
    </div>
    <payin-form :ad-obj="adObj" :visible.sync="mixinsPayinFormVisible" />
    <div class="assets-record">
      <div class="record-title">充值记录</div>
      <div class="record-list">
        <div :key="key" class="record-item" v-for="(item, key) in payinCoinRecordList">
          <dl class="item-left">
            <dt class="label">{{ item.remark ? item.remark.toLowerCase() : item.remark }}</dt>
            <dd class="info">
              <p>{{ item.coinTo }}</p>
            </dd>
            <dd class="time">{{ item.sendimeTime | date('YYYY-MM-DD hh:mm:ss') }}</dd>
          </dl>
          <dl class="item-right">
            <dt class="price">{{ item.number + ' ' + mixinsCoinNameUp }}</dt>
            <dd class="state">+{{ item.confirmTimes }}确认</dd>
          </dl>
        </div>
        <no-data :visible="payinCoinRecordList.length === 0 && loading === false" />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Mixins, Watch } from 'vue-property-decorator';
import {
  getPayinCoinRecord,
  IPayinCoinRecordItem,
  getRechargeAddr,
  IRechargeAddrResponse,
  createAddress,
  getRechargeConfig,
  IRechargeConfig
} from '@/api/assets';
import Clipboard from 'clipboard';
import QRCode from 'qrcode';
import mixinsCurrencyConfig from '@/mixins/assets/currency-config';
import payinForm from '@/components/c2c/payin/form.vue';
import { ctcList, IAdC2cResponse, IAdC2cParams } from '@/api/otc/ad';
import mixinsGetC2cMarket from '@/mixins/assets/get-c2c-market';
import { Getter, State } from 'vuex-class';
import store from '@/store/store';

interface IRechargeConfigTips {
  showTips: boolean;
  tips: string;
}
@Component({
  components: {
    payinForm
  }
})
export default class AssetsPayin extends Mixins(mixinsCurrencyConfig, mixinsGetC2cMarket) {
  legalCurrencyName: string = '';
  loading: boolean = false;
  pageIndex: number = 1;
  qrCode: any = '';
  payinCoinRecordList: IPayinCoinRecordItem[] = [];
  rechargeAddrInfo: IRechargeAddrResponse = {
    chargeMin: '--',
    key: '',
    memo: '',
    isEth: false,
    rechargeConfirmTimes: 0
  };
  // eslint-disable-next-line
  rechargeConfig = {} as IRechargeConfig;
  // eslint-disable-next-line
  rechargeConfigTips = {} as IRechargeConfigTips;
  codeSize: number = 0;

  adObj: IAdC2cResponse | null = null;

  coinMarketMap: IObj<string> = {
    rmb: 'cny'
  };
  get isEthChain() {
    if (this.rechargeAddrInfo) {
      return this.rechargeAddrInfo.isEth;
    }
    return false;
  }
  get chargeMin(): string {
    return this.rechargeConfig.chargeMin || '0';
  }
  get curMarket() {
    if (this.mixinsCoins.length) {
      let [coin] = this.mixinsCoins.filter(coin => coin.tradeCoinName.toLowerCase() === this.legalCurrencyName);
      const moneyUnit = this.coinMarketMap[this.mixinsCoinName] || this.mixinsCoinName;
      let [market] = coin.markets.filter(market => market.basicCoinName.toLowerCase() === moneyUnit);
      return market;
    }
    return null;
  }

  '$refs': {
    code: HTMLDivElement;
  };

  @Getter('otcIsLogin', { namespace: 'otc' }) public mixinsOtcIsLogin!: boolean;
  @Getter('isLogin', { namespace: 'user' }) public mixinsZbIsLogin!: boolean;
  @State('lang', { namespace: 'lang' }) public lang!: string;

  @Watch('mixinsZbIsLogin', { immediate: true })
  private isLoginWatch(isLogin: boolean): void {
    if (isLogin && !this.mixinsOtcIsLogin && this.mixinsIsLegalCurrency) {
      store.dispatch('otc/getOtcUserToken');
    }
  }

  @Watch('mixinsCoinName', { immediate: true })
  _() {
    // 法币转换
    let coinName = this.mixinsCoinName;
    if (['rmb', 'hkd'].indexOf(this.mixinsCoinName) > -1) {
      coinName = 'qc';
    }
    this.legalCurrencyName = coinName;
    if (this.mixinsIsLegalCurrency === false) {
      this.getRechargeAddr(coinName);
    } else {
      this.getOtcMarket();
    }
    this.getPayinCoinRecord(coinName);
    this.getRechargeConfig(coinName);
  }

  @Watch('curMarket', { immediate: true, deep: true })
  curMarketWatcher() {
    if (this.curMarket) {
      this.getCtcList();
    }
  }

  changeLegalCurrencyName(name: string) {
    this.legalCurrencyName = name;
    this.getPayinCoinRecord(name);
  }
  async getRechargeConfig(coinName: string) {
    try {
      let res = await getRechargeConfig(coinName);
      this.rechargeConfig = res || {};
      const { config } = this.rechargeConfig;
      if (config) {
        this.rechargeConfigTips = {
          showTips: false,
          tips: ''
        };
        if (config.showTips === true) {
          this.rechargeConfigTips = {
            tips: this.lang === 'cn' ? config.tips : config.tipsEn,
            showTips: config.showTips
          };
        }
        if (config.popup === true) {
          this.$message.warn(this.lang === 'cn' ? config.popupContent : config.popupContentEn);
        }
      }
    } catch (err) {
      this.$message.fail(err.message);
    }
  }
  pasteHandle(className: string) {
    let clipboard = new Clipboard(className);
    clipboard.on('success', () => {
      this.$message.success('__("复制成功")');
    });
    clipboard.on('error', () => {
      this.$message.warn('__("复制失败,请手动复制")');
    });
  }
  changeLinkCoinName(coinName: string) {
    this.mixinsLinkCoinName = coinName;
    this.qrCode = '';
    this.getRechargeAddr(this.mixinsLinkCoinName);
    this.pageIndex = 1;
    this.getPayinCoinRecord(this.mixinsLinkCoinName);
  }

  /** 闪电充值 */
  topupClickHandle() {
    if (this.adObj) {
      this.mixinsPayinFormVisible = true;
    } else {
      this.$message.fail('__("暂无广告")');
    }
  }
  async createAddress() {
    try {
      let res = await createAddress(this.mixinsCoinName, this.mixinsLinkCoinName || '');
      if (res.resMsg.code === 1000) {
        this.$message.success(res.resMsg.message);
        this.getRechargeAddr(this.mixinsCoinName);
        return;
      }
      this.$message.fail(res.resMsg.message);
    } catch (_) {}
  }
  /** 获取 c2c 广告列表 */
  async getCtcList() {
    if (this.curMarket === null) {
      return;
    }
    try {
      const params: IAdC2cParams = {
        marketId: this.curMarket.marketId + '',
        tradeType: 1
      };
      this.adObj = await ctcList(params);
    } catch (err) {
      if (err.resMsg) {
        this.$message.fail(err.resMsg.message);
      }
    }
  }
  async getPayinCoinRecord(coinName: string) {
    try {
      if (!coinName) {
        return;
      }
      this.loading = true;
      let res = await getPayinCoinRecord({
        coinName: coinName,
        pageNo: this.pageIndex
      });
      this.payinCoinRecordList = res.list;
    } catch (_) {
      this.payinCoinRecordList = [];
    }
    this.loading = false;
  }
  async getQrCode(str: string) {
    this.codeSize = this.$refs.code && this.$refs.code.offsetHeight;
    this.qrCode = await QRCode.toDataURL(str, {
      width: this.codeSize,
      margin: 0
    });
  }
  async getRechargeAddr(coinName: string) {
    try {
      if (!coinName) {
        return;
      }
      this.rechargeAddrInfo = await getRechargeAddr(coinName);
      if (this.rechargeAddrInfo.key) {
        this.getQrCode(this.rechargeAddrInfo.key || '');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style lang="scss">
.assets-recharge-tips {
  padding: 10px;
  background-color: #f9ece7;
  color: var(--primary-color);
  text-align: left;
  line-height: 1.5;
  border-radius: 4px; /* no */
  margin-top: 20px;
}
.assets-recharge-config-tips {
  padding: 10px;
  color: #e91c41;
  background-color: #fff7ef;
  text-align: left;
  line-height: 1.5;
  border-radius: 4px; /* no */
  margin: 30px 0 -20px 0;
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: left;
    font-family: 'PingFang SC', miui, system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, sans-serif;
  }
}
.assets-recharge-safe-tips {
  padding: 25px 0;
  margin: 0 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  .title {
    font-size: 16px;
    @include bold;
    color: var(--primary-color);
    margin-bottom: 10px;
  }
  p {
    line-height: 1.5;
    margin-top: 8px;
    color: #88878e;
  }
  .prominent {
    color: #c2c0cc;
  }
}
</style>
