/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-09-04 22:06:00
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-10 21:45:22
 */
import Vue from 'vue'
import Router from 'vue-router'
import { imServerStore } from '../store/imServerStore.js';
Vue.use(Router)

import routes from './routes.js'
import { nextTick } from 'q';

const router = new Router({
    // mode: 'history',
    routes
})

// 白名单——不需要验证是否登录，不需要请求userInfo和菜单权限
const whiteList = ['/login', '/imClient', '/test'];

/**
 * 路由守卫验证token
 * 客户端 imClient 不拦截
 */
router.beforeEach(async (to, from, next) => {
    // 判断to.path是否在白名单里
    if (to.meta.title) {
        let subTitle = ''
        if(to.meta.back) {
            let back = to.meta.back
            switch(back) {
                case '/config':
                    subTitle = '设置'
                break;
            }
        }
        document.title = `客服云-${subTitle}-${to.meta.title}`
    }
    if(!whiteList.includes(to.path)) {
        let token = sessionStorage.getItem("token")
        if(token) {
            if(from.path === '/imClient') {
                next('/login')
            } else {
                let userInfo = Object.keys(imServerStore.state.userInfo)
                let {permissions, userMenus} = imServerStore.state
                if(!userInfo.length || !permissions.length || !userMenus.length) {
                    await imServerStore.dispatch('getUserInfo')
                    await imServerStore.dispatch('getUserMenu')
                }
                next()
            }
            next()
        } else {
            next('/login')
        }
        next()
    } else {
        next()
    }
})
export default router

