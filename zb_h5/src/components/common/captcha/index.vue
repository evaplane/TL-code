<template>
  <div id="_umfp">
    <div :id="dynamicId" class="captcha-warp"></div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { script } from '@/utils/http';
import store from '@/store/store';
import config from '@/config/index';

export interface ICaptchaCallback {
  afsSessionId: string;
  afsSig: string;
  afsToken: string;
  afsScene: string;
  afsAppKey: string;
}
@Component
export default class Captcha extends Vue {
  appkey: string = config.captchaAppKey;
  dynamicId: string =
  'captcha-' +
    Math.random()
      .toString()
      .slice(-2);
  nc: INoCaptcha | null = null;
  @Prop({ type: String, default: '' }) scene!: string;
  @Emit()
  callback(val: ICaptchaCallback) {
    return val;
  }
  reset() {
    this.nc && this.nc.reset();
  }
  async mounted() {
    await script({ url: '//g.alicdn.com/sd/nch5/index.js?t=1497436353264' });
    let token = [this.appkey, new Date().getTime(), Math.random()].join(':'),
      scene = this.scene + '_h5';
    this.nc = window.NoCaptcha.init({
      renderTo: '#' + this.dynamicId, // 渲染到该DOM ID指定的Div位置
      appkey: this.appkey,
      scene,
      token,
      // 业务键字段，可为空。为便于线上问题的排查，建议您按照线上问题定位文档中推荐的方法配置该字段值。
      trans: {
        key1: 'code0'
      },
      // 通过Dom的ID属性自动填写trans业务键，可为空。建议您按照线上问题定位文档中推荐的方法配置该字段值。
      elementID: ['usernameID'],
      // 是否自定义配置底层采集组件。如无特殊场景，请使用默认值（0），即不自定义配置底层采集组件。
      'is_Opt': 0,
      // 语言，默认值为cn（中文）。HTML5应用类型默认支持简体中文、繁体中文、英文语言。
      language: 'cn',
      // 内部网络请求的超时时间。一般情况建议保持默认值（10000ms）。
      timeout: 10000,
      // 允许服务器超时重复次数，默认5次。
      retryTimes: 5,
      // 用于自定义滑动验证各项请求的接口地址。一般情况，请勿配置该参数。
      // 验证通过后，验证码组件是否自动隐藏，默认不隐藏（false）。
      bannerHidden: false,
      // 是否默认不渲染，默认值false。当设置为true时，不自动渲染，需要自行调用show方法进行渲染。
      initHidden: false,
      callback: (data: any) => {
        // 校验成功回调
        this.callback({
          afsSessionId: data.csessionid,
          afsSig: data.sig,
          afsToken: token,
          afsScene: scene,
          afsAppKey: this.appkey
        });
      },
      error(err: any) {
        console.log('Captcha:', err);
      },
      verifycallback(data: any) {
        console.log(data, '1');
      }
    });
    window.NoCaptcha.upLang(store.getters['lang/curLang']);
    window.NoCaptcha.setEnabled(true);
    this.nc.reset(); // 请务必确保这里调用一次reset()方法
  }
}
</script>

<style lang='scss'>
#_umfp {
  width: 100%;
}
.captcha-warp {
  ._nc .stage {
    padding: 0;
    .slider {
      left: 0;
      right: 0;
      box-shadow: none !important;
      background-color: transparent !important;
    }
  }
}
._nc .stage1 .button {
  width: 49px !important;
  height: 49px !important;
  line-height: 50px !important;
  background-color: #e91c41 !important;
  border-radius: 2px !important;
}
._nc .icon-slide-arrow {
  font-size: 20px !important;
  color: #fff !important;
}
._nc .icon-ok {
  color: #fff !important;
  font-size: 20px !important;
}
._nc .stage1 {
  height: 50px !important;
  .slider {
    height: 50px !important;
    border-radius: 4px;
  }
}
._nc .stage1 .track {
  height: 50px !important;
  border-radius: 4px !important;
}
._nc .stage1 .bg-green {
  background-color: #f0f3f9 !important;
}
._nc .stage1 .track div {
  color: #4c495b !important;
}
._nc .stage1 .track div,
._nc .stage1 .label {
  height: 49px !important;
  line-height: 49px !important;
  font-size: 14px !important;
}
._nc .stage1 .label {
  border: 1px solid rgba(0, 0, 0, 0.03); /* no */
  border-radius: 4px !important;
}
._nc .icon {
  width: auto !important;
  height: auto !important;
}
._nc .stage1 .icon {
  left: 0 !important;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
