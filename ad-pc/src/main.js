import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import store from './store/store'
import {JSEncrypt} from 'jsencrypt'
Vue.prototype.$jSEncrypt=JSEncrypt

Vue.config.productionTip = false

import {get,post} from './lib/http'
Vue.prototype.$post=post; 
Vue.prototype.$get=get;

import {uuid,handleDate,numberFormatter,formatterDateTime} from './lib/util'
Vue.prototype.$handleDate=handleDate
Vue.prototype.$numberFormatter=numberFormatter
Vue.prototype.$formatterDateTime=formatterDateTime

import {emoji} from './lib/emoji-lib/emoji.js'
Vue.prototype.$emoji = emoji

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: "https://demo.chevereto.com/images/2018/11/23/Map.md.png",
  error: require('./assets/map.png'),
  
  loading: require('./assets/loading.gif'),
  attempt: 2
})

if(localStorage.getItem("sing12")){
  Vue.prototype.$uuid=localStorage.getItem("sing12");
}else{
  let makeUuid = 'pc'+uuid(8,64); 
  Vue.prototype.$uuid=makeUuid
  localStorage.setItem("sing12",makeUuid);
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
