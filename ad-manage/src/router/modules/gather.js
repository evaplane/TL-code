export default [
    // 采集用户
    {
        path:"/modules/gather/user.html",
        name: 'gatherUser', 
        meta: {
            title:'采集用户设置',
            parentTitle:'采集管理'
        },
        component: resolve => require(['@/components/gather/gatherUser/index'], resolve),
    },
    {
        path:"/modules/gather/userDetail.html",
        name: 'gatherUserDetail', 
        meta: {
            title:'采集用户设置详情',
            parentTitle:'采集管理'
        },
        component: resolve => require(['@/components/gather/gatherUser/detail'], resolve),
    },
    // 采集代理池
    {
        path:"/modules/gather/agency.html",
        name: 'gatherAgency', 
        meta: {
            title:'采集代理池设置',
            parentTitle:'采集管理'
        },
        component: resolve => require(['@/components/gather/gatherAgency/index'], resolve),
    },
    // 采集内容
    {
        path:"/modules/gather/content.html",
        name: 'gatherContent', 
        meta: {
            title:'采集内容列表',
            parentTitle:'采集管理'
        },
        component: resolve => require(['@/components/gather/gatherContent/index'], resolve),
    },
    // 采集内容设置
    {
        path:"/modules/gather/contentList.html",
        name: 'gatherContentList', 
        meta: {
            title:'采集内容设置',
            parentTitle:'采集管理'
        },
        component: resolve => require(['@/components/gather/gatherContentList/index'], resolve),
    },
]