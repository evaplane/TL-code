import '@/js/vant-ui-lang-helper';
import '@/utils/flexble';
import Vue, { VNode } from 'vue';
import router from './router/index';
import store from './store/store';
import '@/components/vant-ui-install';
import '@css/icon.css';
import '@css/reset.css';
import '@css/roboto-font-install.css';
import '@/assets/scss/common.scss';
import '@/assets/scss/icon.scss';
import '@/vue-init/index';
import { isIOS, isPwaMode } from '@/utils/is';
import { disableDblclickEnlarge } from '@/utils/event';

import { getLocal } from '@/utils/storage';
import app from '@/views/app.vue';
import '@/components/popup/index';
import '@/components/common/icons/icon-install';
import '@/utils/service-worker';
import { env } from '@/config/index';

if (isIOS === true) {
  document.body.classList.add('ios');
} else {
  document.body.classList.add('android');
}
if (isPwaMode() === true) {
  document.body.classList.add('pwa-mode');
}
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue({
  el: '#app',
  router,
  store,
  render: (h): VNode => h(app)
});
// 用户数据获取
store.dispatch('user/getUserInfo');
// 交易涨跌幅颜色获取
store.dispatch('theme/checkTradingColor');
if (env === 'development') {
  // let isDark = true;
  // store.dispatch('theme/updateTheme', isDark ? 'dark' : 'light');
  // window.setInterval((): void => {
  //   store.dispatch('theme/updateTheme', isDark ? 'dark' : 'light');
  //   isDark = !isDark;
  // }, 5000000);
  store.dispatch('theme/updateTheme', getLocal('__theme_v1') || 'dark');
} else {
  store.dispatch('theme/updateTheme', getLocal('__theme_v1') || 'dark');
  Vue.config.performance = true;
}
// 禁止双击页面放大
disableDblclickEnlarge();
