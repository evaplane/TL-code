export default [
    // 管理员
    {
        path:"/modules/sys/user.html",
        name:"sysUser",
        meta: {
            title:'操作员管理',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/administrator/index'], resolve),
    },
    {
        path:"/modules/sys/userAdd.html",
        name:"sysUserAdd",
        meta: {
            title:'操作员管理新增',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/administrator/add'], resolve),
    },
    {
        path:"/modules/sys/userEdit.html",
        name:"sysUserEdit",
        meta: {
            title:'操作员管理修改',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/administrator/edit'], resolve),
    },
    // 菜单
    {
        path:"/modules/sys/menus.html",
        name:"sysMenu",
        meta: {
            title:'菜单管理',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/menus/index'], resolve),
    },
    {
        path:"/modules/sys/menuEdit.html",
        name:"sysMenuEdit",
        meta: {
            title:'菜单管理修改',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/menus/edit'], resolve),
    },
    {
        path:"/modules/sys/menuAdd.html",
        name:"sysMenuAdd",
        meta: {
            title:'菜单管理新增',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/menus/add'], resolve),
    },
    // 角色
    {
        path:"/modules/sys/role.html",
        name:"sysRole",
        meta: {
            title:'角色管理',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/role/index'], resolve),
    },
    {
        path:"/modules/sys/roleAdd.html",
        name:"sysRoleAdd",
        meta: {
            title:'角色管理新增',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/role/add'], resolve),
    },
    {
        path:"/modules/sys/roleEdit.html",
        name:"sysRoleEdit",
        meta: {
            title:'角色管理修改',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/role/edit'], resolve),
    },
    // 部门
    {
        path:"/modules/sys/dept.html",
        name:"sysDept",
        meta: {
            title:'部门管理',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/department/index'], resolve),
    },
    {
        path:"/modules/sys/deptAdd.html",
        name:"sysDeptAdd",
        meta: {
            title:'部门管理新增',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/department/add'], resolve),
    },
    {
        path:"/modules/sys/deptEdit.html",
        name:"sysDeptEdit",
        meta: {
            title:'部门管理修改',
            parentTitle:'系统管理'
        },
        component: resolve => require(['@/components/rights/department/edit'], resolve),
    },
    
]