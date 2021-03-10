export default [
    // 广告分类
    {
        path:"/modules/advert/category.html",
        name:"advertCategory",
        meta: {
            title:'广告分类管理',
            parentTitle:'广告管理'
        },
        component: resolve => require(['@/components/advert/category/index'], resolve),
    },
    // 广告类别
    {
        path:"/modules/advert/sort.html",
        name:'advertSort',
        meta: {
            title:'广告类别管理',
            parentTitle:'广告管理'
        },
        component: resolve => require(['@/components/advert/sort/index'], resolve),
    },
    // 广告列表
    {
        path:"/modules/advert/list.html",
        name:'advertList',
        meta: {
            title:'广告列表',
            parentTitle:'广告管理'
        },
        component: resolve => require(['@/components/advert/list/index'], resolve),
    },
    {
        path:"/modules/advert/listAdd.html",
        name:'advertListAdd',
        meta: {
            title:'广告列表新增',
            parentTitle:'广告管理'
        },
        component: resolve => require(['@/components/advert/list/add'], resolve),
    },
    {
        path:"/modules/advert/listEdit.html",
        name:'advertListEdit',
        meta: {
            title:'广告列表修改',
            parentTitle:'广告管理'
        },
        component: resolve => require(['@/components/advert/list/edit'], resolve),
    },
    {
        path:"/modules/advert/listview.html",
        name:'advertListview',
        meta: {
            title:'广告详情',
            parentTitle:'广告管理'
        },
        component: resolve => require(['@/components/advert/list/view'], resolve),
    }
]