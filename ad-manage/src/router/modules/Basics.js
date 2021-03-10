// 基础设施管理路由  //fa fa-tasks
export default [
    // 分发节点管理
    {        
        path: '/modules/basicConfiguration/distribute.html',        
        name: 'distribute',   
        meta: {
            title:'分发节点管理',
            parentTitle:'基础配置管理'
        },     
        component: resolve => require(['@/components/basicConfiguration/distribute/index'], resolve),
    },
    // 公告管理
    {        
        path: '/modules/basicConfiguration/notice.html',        
        name: 'notice',      
        meta: {
            title:'公告管理',
            parentTitle:'基础配置管理'
        },  
        component: resolve => require(['@/components/basicConfiguration/notice/index'], resolve),
    },
    {        
        path: '/modules/basicConfiguration/noticeAdd.html',        
        name: 'noticeAdd',
        meta: {
            title:'公告管理新增',
            parentTitle:'基础配置管理'
        },        
        component: resolve => require(['@/components/basicConfiguration/notice/add'], resolve),
    },
    {        
        path: '/modules/basicConfiguration/noticeEdit.html',        
        name: 'noticeEdit', 
        meta: {
            title:'公告管理修改',
            parentTitle:'基础配置管理'
        },       
        component: resolve => require(['@/components/basicConfiguration/notice/edit'], resolve),
    },
    // 提示语分类管理
    {        
        path: '/modules/basicConfiguration/prompt.html',        
        name: 'prompt',      
        meta: {
            title:'提示语分类管理',
            parentTitle:'基础配置管理'
        },  
        component: resolve => require(['@/components/basicConfiguration/prompt/index'], resolve),
    },
    // 提示语配置
    {        
        path: '/modules/basicConfiguration/hint.html',        
        name: 'hint',    
        meta: {
            title:'提示语配置',
            parentTitle:'基础配置管理'
        },   
        component: resolve => require(['@/components/basicConfiguration/hint/index'], resolve),
    },
    // 前端基础配置
    {        
        path: '/modules/basicConfiguration/frontend.html',        
        name: 'frontend',     
        meta: {
            title:'前端基础配置',
            parentTitle:'基础配置管理'
        },   
        component: resolve => require(['@/components/basicConfiguration/frontend/index'], resolve),
    },
    {        
        path: '/modules/basicConfiguration/frontendEdit.html',        
        name: 'frontendEdit', 
        meta: {
            title:'前端基础配置修改',
            parentTitle:'基础配置管理'
        },       
        component: resolve => require(['@/components/basicConfiguration/frontend/edit'], resolve),
    },
    // 非法关键字管理
    {        
        path: '/modules/basicConfiguration/Keyword.html',        
        name: 'Keyword',    
        meta: {
            title:'非法关键字管理',
            parentTitle:'基础配置管理'
        },    
        component: resolve => require(['@/components/basicConfiguration/Keyword/index'], resolve),
    },
    // APP版本升级管理
    {        
        path: '/modules/basicConfiguration/app.html',
        name: 'app',   
        meta: {
            title:'APP版本升级管理',
            parentTitle:'基础配置管理'
        },     
        component: resolve => require(['@/components/basicConfiguration/app/index'], resolve),
    },
]