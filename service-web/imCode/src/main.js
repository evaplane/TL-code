// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue"
import App from "./App"
import router from "./router"
import { imServerStore } from "./store/imServerStore.js"
import "../src/common/iconfont/iconfont.css"
import utilHtml from "../src/common/proto/util.js"
import Params from "./common/params.js" // 可视化参数
// import filters from './filters/index.js'
import * as filters from "./common/filters" // 全局过滤器
import server from "@/common/server.js"
// ak
import ak from "@/common/ak.js"
// element-ui
import ElementUI from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
// font-awesome
import "font-awesome/css/font-awesome.min.css"
import axios from "@/common/axios"
import message from "@/common/message"

const API_CONFIG = require("./common/client")
// if(process.env.NODE_ENV === 'production')
// Vue.prototype.$domain = window.location.hostname || document.location.hostname
Vue.prototype.$API_CONFIG = API_CONFIG

Vue.prototype.$utilHtml = utilHtml
Vue.prototype.$Params = Params

// axios
// import http from '@/common/http.js';
// Vue.prototype.$http = http;

//
Vue.prototype.$httpServer = server
Vue.prototype.$ak = ak
Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.prototype.$message1 = message

// 移动端图片预览
import vuePicturePreview from 'vue-picture-preview'
Vue.use(vuePicturePreview)




Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

// config
Vue.config.productionTip = false

Vue.prototype.Permission = function(permis) {
	return imServerStore.state.permissions.indexOf(permis) !== -1
}
// .then(res => {
/* eslint-disable no-new */
window.polkVue = new Vue({
	el: "#app",
	router,
	components: { App },
	store: {
		imServerStore: imServerStore
	},
	template: "<App/>"
})
// })
// window.polkVue = async function() {
//     let hash = window.location.hash
//     if(hash.indexOf('login') === -1 && hash.indexOf('imClient') === -1) {
//         await imServerStore.dispatch('getUserInfo')
//         await imServerStore.dispatch('getUserMenu')
//     }
//     return new Vue({
//     el: '#app',
//     router,
//     components: { App },
//     store: {
//         imServerStore: imServerStore,
//     },
//     template: '<App/>'
// })}()
