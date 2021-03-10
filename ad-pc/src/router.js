import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    component: resolve => require(['@/views/Home'],resolve),
    children:[
      {
          path:'/',
          meta:{
            title:'首页'
          },
          component:resolve => require(['@/components/main/index'], resolve)
      },
      {
          path:"user",
          meta:{
            title:'个人中心'
          },
          component:resolve => require(['@/components/main/user'], resolve)
      }
    ]
  },
  {
    path: '/install',
    name: 'install',
    meta:{
      title:'账户信息'
    },
    component: resolve => require(['@/views/install.vue'], resolve)
  }
];


// 实例化路由对象
const router = new Router({
  routes
})

// 前置守卫
router.beforeEach((to, from, next) => {
  if(to.meta.title){
    document.title = to.meta.title;
  }
  if (to.matched.length == 0) {
    next('/install?name=login') 
  } else {
    next()
  }
})
export default router