import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 登录
const login = () => import('../components/login/login.vue')
// 首页
const index = () => import('../components/index/index.vue')
// 错误页面
const error = () => import('../components/error/index.vue')
// 推荐管理
const heatValue = () => import('../components/recommend/heatValue/index.vue')
// 视频截图测试
const video = () => import('../components/video/index.vue')

// 首页
const homePage = () => import('../components/homePage/index.vue')
// 统计 内容、用户、广告 
const contentlist = () => import('../components/homePage/contentlist.vue')
const userlist = () => import('../components/homePage/userlist.vue')
const advlist = () => import('../components/homePage/advlist.vue') 

import Contents from './modules/Contents' //内容管理路由集合
import Basics from './modules/Basics' //基础设施路由集合
import rights from './modules/rights' // 权限路由集合
import advert from './modules/advert' // 广告路由集合
import gather from './modules/gather' // 采集路由集合
import user from './modules/user' // 用户路由集合
const routes = [
    {
        path:"/login",
        component:login
    },
    {
        path:"/",
        component:index,
        children:[
            {
                path:'',
                redirect: '/modules/pageHome.html'
            },
            {
                path:"/error.html",
                name:'error',
                meta: {
                    title:'错误页面',
                    parentTitle:'错误页面'
                },
                component:error
            },
            // 推荐管理
            {
                path:"/modules/recommend/hotheat.html",
                name:'hotheat',
                meta: {
                    title:'初始热度值配置',
                    parentTitle:'推荐管理'
                },
                component:heatValue
            },
            // 首页
            {
                path:"/modules/pageHome.html",
                name:'pageHome',
                meta: {
                    title:'首页',
                    parentTitle:'首页'
                },
                component:homePage
            },
            {
                path:"/modules/userlist.html",
                name:'userlist',
                meta: {
                    title:'用户统计',
                    parentTitle:'首页'
                },
                component:userlist
            },
            {
                path:"/modules/contentlist.html",
                name:'contentlist',
                meta: {
                    title:'内容统计',
                    parentTitle:'首页'
                },
                component:contentlist
            },
            {
                path:"/modules/advlist.html",
                name:'advlist',
                meta: {
                    title:'广告统计',
                    parentTitle:'首页'
                },
                component:advlist
            },
            {
                path:"/modules/video.html",
                name:'video',
                meta: {
                    title:'视频',
                    parentTitle:'视频截图'
                },
                component:video
            },
            ...Contents,
            ...Basics,
            ...rights,
            ...advert,
            ...gather,
            ...user
        ]
    }
]

// 实例化路由对象
const router = new VueRouter({
    // mode: 'history',
    routes
})

// 前置守卫
router.beforeEach((to, from, next) => {
    if (to.matched.length == 0) {
      next('/error.html') 
    } else {
      next()
    };
  })
export default router