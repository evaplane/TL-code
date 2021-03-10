<template>
  <div class="setting-box">
    <back/>
    <scroll>
      <ul class="setting-box-container">
        <li @click="showPickerType('lang')">
          <span>__('语言')</span>
          <span>
            {{language}}
            <i class="zbicon-right"></i>
          </span>
        </li>
        <li @click="showPickerType('country')">
          <span>__('所在国家')</span>
          <span>
            {{country}}
            <i class="zbicon-right"></i>
          </span>
        </li>
        <li>
          <span>__('夜间模式')</span>
          <van-switch @change="themeChange" size="18px" v-model="dark"/>
        </li>
        <li class="currency-con">
          <span>__('法币')</span>
          <div class="currencys">
            <div
              :class="{'active': index === currencyActiveIndex }"
              :key="item.en"
              @click="currencyCheck(index)"
              class="item"
              v-for="(item, index) in currencyList"
            >
              <span>{{item.icon}}</span>
              <p>{{item.en}}</p>
              <p>{{item.name}}</p>
            </div>
          </div>
          <div class="currency-check">
            __('行情价格折算成法币显示')
            <van-switch size="18px" v-model="checked"/>
          </div>
        </li>
        <li class="custom">
          <span>__('涨跌习惯')</span>
          <div class="custom-con">
            <div @click="custom(1)">
              <p>
                __('红涨绿跌')
                <span :class="{'active':customType === 1}">✓</span>
              </p>
              <span>
                8.2%
                <i class="zbicon-up"></i>
              </span>
            </div>
            <div @click="custom(2)">
              <p>
                __('绿涨红跌')
                <span :class="{'active':customType === 2}">✓</span>
              </p>
              <span>
                8.2%
                <i class="zbicon-up"></i>
              </span>
            </div>
          </div>
        </li>
        <li>
          <span>__('更新频率')</span>
          <van-dropdown-menu>
            <van-dropdown-item :options="option1" v-model="value1"/>
          </van-dropdown-menu>
        </li>
        <li>
          <span>__('网络节点')</span>
          <van-dropdown-menu>
            <van-dropdown-item :options="option1" v-model="value1"/>
          </van-dropdown-menu>
        </li>
        <li>
          <span>__('清理缓存')</span>
          <span>
            3.2M
            <i class="zbicon-down"></i>
          </span>
        </li>
      </ul>
    </scroll>
    <van-popup position="bottom" v-model="showPicker">
      <van-picker
        :columns="columns"
        :default-index="pickerIndex"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        show-toolbar
      />
    </van-popup>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';
import back from '@/components/index/back.vue';
import { Action, State } from 'vuex-class';
import { getCountries, IGetCountriesItems } from '@/api/common';
import { IUser } from '@/store/modules/user.ts';
import { Picker as vanPicker } from 'vant';
interface IOptions {
  text: string;
  value: string | number;
}
interface ICurrencyList {
  name: string;
  en: string;
  icon: string;
}

@Component({
  components: {
    back,
    vanPicker
  }
})
export default class Setting extends Vue {
  @Action('updateLang', { namespace: 'lang' }) updateLang!: Function
  @Action('updateTheme', { namespace: 'theme' }) updateTheme!: Function
  @State('lang', { namespace: 'lang' }) lang!: string
  @State('userInfo', { namespace: 'user' }) userInfo!: IUser
  @State('theme', { namespace: 'theme' }) theme!: string
  @Watch('theme')
  themeChanged(value: string) {
    this.dark = value === 'dark';
  }
  value1: number = 0
  customType: number = 1
  option1: IOptions[] = [
    { text: '全部商品', value: 0 },
    { text: '新款商品', value: 1 },
    { text: '活动商品', value: 2 }
  ]
  countrys: IOptions[] = []
  pickerType: string = ''
  languages: IOptions[] = [
    { text: '简体中文', value: 'cn' },
    { text: 'English', value: 'en' }
  ]
  pickerIndex: number = 0
  checked: boolean = false
  dark: boolean = false
  currencyActiveIndex: number = 0
  showPicker: boolean = false
  columns: IOptions[] = []
  currencyList: ICurrencyList[] = [
    {
      name: '__("人民币")',
      en: 'CNY',
      icon: '¥'
    },
    {
      name: '__("美元")',
      en: 'USD',
      icon: '$'
    },
    {
      name: '__("欧元")',
      en: 'EUR',
      icon: '€'
    },
    {
      name: '__("日元")',
      en: 'YEN',
      icon: '円'
    }
  ]
  async mounted() {
    await this.getCountries();
  }
  get language(): string {
    let obj = this.languages.find(item => item.value === this.lang);
    return obj ? obj.text : '';
  }
  get country(): string {
    let obj = this.countrys.find(item => item.value === this.userInfo.countryCode);
    return obj ? obj.text : '';
  }
  currencyCheck(index: number) {
    this.currencyActiveIndex = index;
  }
  custom(type: number) {
    this.customType = type;
  }
  changeLang(lang: string) {
    let oldLang = this.lang;
    this.updateLang(lang);
    let newUrl = window.location.href.replace(oldLang, lang);
    window.location.href = newUrl;
  }
  countriesFormat(arr: IGetCountriesItems[]) {
    return arr.map(item => {
      return { 'text': this.lang === 'cn' ? item.name : item.englishName, 'value': item.code };
    });
  }
  async getCountries() {
    let { country } = await getCountries();
    this.countrys = this.countriesFormat(country);
  }
  themeChange(dark: boolean) {
    this.updateTheme(dark ? 'dark' : 'light');
  }
  onConfirm(obj: any) {
    switch (this.pickerType) {
      case 'country':
        break;
      case 'lang':
        this.changeLang(obj.value);
        break;
    }
    this.showPicker = false;
  }
  showPickerType(type: string) {
    this.showPicker = true;
    this.pickerType = type;
    switch (type) {
      case 'country':
        this.columns = this.countrys;
        this.pickerIndex = this.countrys.findIndex(item => item.value === this.userInfo.countryCode);
        break;
      case 'lang':
        this.columns = this.languages;
        this.pickerIndex = this.languages.findIndex(item => item.value === this.lang);
        break;
    }
  }
}
</script>
<style lang='scss'>
.setting-box {
  position: fixed;
  z-index: 3000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--default-bg);
  color: var(--theme-color);
  .van-popup {
    z-index: 3002 !important;
  }
  .van-overlay {
    z-index: 3001 !important;
  }
  %color {
    background: var(--default-bg);
    color: var(--theme-color);
  }
  .setting-box-container {
    > li {
      display: flex;
      justify-content: space-between;
      padding: var(--padding-lr);
      margin: 0 10px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      > span {
        line-height: 30px;
      }
      .van-dropdown-menu {
        height: 30px;
        margin-right: var(--padding-lr);
        .van-icon-success {
          color: var(--primary-color) !important;
        }
      }
      > i:last-child {
        margin-top: 6px;
      }
      .van-cell {
        @extend %color;
      }
      .van-cell:not(:last-child)::after {
        border-color: var(--border-color);
      }
      border-bottom: 1px solid var(--border-color);
      [class*='van-hairline']::after {
        border-color: var(--border-color);
      }
      .van-cell__title[style*='color'] {
        color: var(--primary-color) !important;
      }
      .van-dropdown-menu__title--down {
        color: var(--primary-color) !important;
      }
      .van-dropdown-menu__title {
        font-size: 14px;
      }
    }
    .currency-con {
      display: block;
      .currencys {
        display: flex;
        margin: 10px 0;
        justify-content: space-between;
        .item {
          border: 1px solid var(--border-color); /* no */
          padding: 10px 0;
          box-shadow: 1px 1px 3px #f3efef;
          line-height: 20px;
          text-align: center;
          border-radius: 4px;
          width: 22%;
          transition: all 0.5s;
          span {
            font-size: 20px;
            color: var(--primary-color);
            display: inline-block;
            width: 30px;
            height: 30px;
            line-height: 30px;
          }
          p {
            font-size: 12px;
          }
          &.active {
            background: var(--primary-color);
            color: #fff;
            span {
              display: inline-block;
              color: var(--primary-color);
              background: #fff;
              border-radius: 40px;
            }
          }
        }
      }
      .currency-check {
        display: flex;
        align-items: center;
        transition: all 0.5s;
        .van-switch {
          margin-left: 4px;
        }
      }
      @include dark {
        .item {
          background: #343537;
          box-shadow: none !important;
        }
      }
    }
    .custom {
      display: block;
      .custom-con {
        display: flex;
        justify-content: space-between;
        > div {
          border: 1px solid var(--border-color); /* no */
          padding: 10px 30px;
          border-radius: 3px;
          line-height: 30px;
          box-shadow: 1px 1px 3px #f3efef;
          text-align: center;
          @include dark {
            background: #343537;
            box-shadow: none !important;
          }
          > p {
            display: flex;
            width: 100px;
            justify-content: space-between;
            span.active {
              color: #4994ea;
              visibility: visible;
            }
            span {
              visibility: hidden;
            }
          }
          > span {
            display: inline-block;
            width: 100%;
            color: #fff;
            background: var(--sell-color);
            border-radius: 2px;
            line-height: 24px;
            margin-top: 10px;
          }
        }
        > div:first-child {
          > span {
            background: var(--buy-color);
          }
        }
      }
    }
  }
}
</style>
