export default [
    // 用户
    {
        path:"/modules/user/user.html",
        name:"user",
        meta: {
            title:'用户列表',
            parentTitle:'用户管理'
        },
        component: resolve => require(['@/components/user/user/index'], resolve),
    },
    // 昵称
    {
        path:"/modules/user/nickname.html",
        name:"userNickname",
        meta: {
            title:'昵称管理',
            parentTitle:'用户管理'
        },
        component: resolve => require(['@/components/user/nickname/index'], resolve),
    },
    // 客服
    {
        path:"/modules/user/service.html",
        name:"userService",
        meta: {
            title:'客服中心',
            parentTitle:'用户管理'
        },
        component: resolve => require(['@/components/user/service/index'], resolve),
    },
]