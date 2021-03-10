// 内容管理路由  
export default [    
    // 标签分类路由
    {        
        path: '/modules/contents/labclass.html',        
        name: 'labclass', 
        meta: {
            title:'标签分类管理',
            parentTitle:'内容管理'
        },       
        component: resolve => require(['@/components/contents/labclass/index'], resolve),
    },
    // 标签管理
    {        
        path: '/modules/contents/label.html',        
        name: 'label',    
        meta: {
            title:'标签管理',
            parentTitle:'内容管理'
        },    
        component: resolve => require(['@/components/contents/label/index'], resolve),
    },
    // 审核不通过列表
    {        
        path: '/modules/contents/audit.html',        
        name: 'audit',        
        meta: {
            title:'审核不通过列表',
            parentTitle:'内容管理'
        },
        component: resolve => require(['@/components/contents/audit/index'], resolve),
    },
    // 人工审核
    {        
        path: '/modules/contents/manual.html',        
        name: 'manual',
        meta: {
            title:'内容审核',
            parentTitle:'内容管理'
        },     
        component: resolve => require(['@/components/contents/manual/index'], resolve),
    },
    {        
        path: '/modules/contents/manualSub.html',        
        name: 'manualSub',
        meta: {
            title:'内容审核',
            parentTitle:'内容管理'
        },        
        component: resolve => require(['@/components/contents/manual/sub'], resolve),
    },
    {        
        path: '/modules/contents/manualview.html',        
        name: 'manualview',
        meta: {
            title:'内容审核详情',
            parentTitle:'内容管理'
        },        
        component: resolve => require(['@/components/contents/manual/view'], resolve),
    },
    // 自动审核白名单
    {        
        path: '/modules/contents/whitelist.html',        
        name: 'whitelist', 
        meta: {
            title:'自动审核白名单',
            parentTitle:'内容管理'
        },       
        component: resolve => require(['@/components/contents/whiteList/index'], resolve),
    },
    // 内容列表
    {        
        path: '/modules/contents/contentList.html',        
        name: 'contentList',   
        meta: {
            title:'内容列表',
            parentTitle:'内容管理'
        },     
        component: resolve => require(['@/components/contents/contentList/index'], resolve),
    },
    // 内容列表
    {        
        path: '/modules/contents/contentList/checkComment.html',        
        name: 'checkComment',   
        meta: {
            title:'查看评论',
            parentTitle:'内容管理'
        },     
        component: resolve => require(['@/components/contents/contentList/checkComment'], resolve),
    },
    {        
        path: '/modules/contents/contentListView.html',        
        name: 'contentListView',
        meta: {
            title:'内容详情',
            parentTitle:'内容管理'
        },        
        component: resolve => require(['@/components/contents/contentList/view'], resolve),
    },
    // 举报内容列表
    {        
        path: '/modules/contents/reportContentList.html',        
        name: 'reportContent', 
        meta: {
            title:'举报内容列表',
            parentTitle:'内容管理'
        },       
        component: resolve => require(['@/components/contents/reportContentList/index'], resolve),
    },
    // 举报内容列表详情
    {        
        path: '/modules/contents/reportContentList/contentComment.html',        
        name: 'contentComment', 
        meta: {
            title:'查看评论',
            parentTitle:'内容管理'
        },       
        component: resolve => require(['@/components/contents/reportContentList/checkComment'], resolve),
    },
    // 视频导入
    {        
        path: '/modules/contents/videoimport/index.html',        
        name: 'videoimport', 
        meta: {
            title:'视频导入',
            parentTitle:'内容管理'
        },       
        component: resolve => require(['@/components/contents/videoimport/index'], resolve),
    },
    
]