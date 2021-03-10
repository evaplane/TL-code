import Vue from 'vue'
import App from './App.vue'
// require('es6-promise').polyfill();
// require('es6-promise/auto');
import ElementUI from'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/base.css'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(ElementUI)

// 该组件为elementUI中的el-date-picker组件，进行了修改
import elePicker from './components/common/elePicker/index'
Vue.use(elePicker)
import uploader from 'vue-simple-uploader'
Vue.use(uploader)
//引入基本模板
let echarts = require('echarts/lib/echarts')
 
// 引入折线图等组件
require('echarts/lib/chart/line')

// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/legendScroll')//图例翻译滚动

Vue.prototype.$echarts = echarts


import {emoji} from './js/emoji-lib/emoji.js'
Vue.prototype.$emoji = emoji


import {get,post} from './lib/http'
Vue.prototype.$post=post; 
Vue.prototype.$get=get;
import router from './router/router'
import store from './store/store'
import './assets/iconfont/iconfont.css'
Vue.config.productionTip = false
import {sendSock,initWebSocket} from './js/socket'
Vue.prototype.sendSock = sendSock
Vue.prototype.initWebSocket = initWebSocket
import Params from './js/params'
Vue.prototype.$params = Params;
new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')


