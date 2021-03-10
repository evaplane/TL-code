/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-12 09:53:03
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-15 14:38:47
 */
/**
 * 投票模块的router列表
 */
const login = () => import('@/components/login/login') // 登陆
const imServer = () => import('@/components/imServer/imServer') // 服务端
const imClient = () => import('@/components/imClient/imClient') // 服务端
const main = () => import('@/components/main/main') // 主页面
const homePage = () => import('@/components/homePage/homePage') // 首页
const tickets = () => import('@/components/tickets/tickets') // 工单

const report = () => import('@/components/report/report') //报表
const reportMenu = () => import('@/components/report/reportMenu') //报表菜单
const dialogStatistics = () => import('@/components/report/dialogStatistics/index') //报表菜单-对话页统计
const customerLabel = () => import('@/components/report/customerLabel/customerLabel') //报表菜单-顾客标签
const agentStatus = () => import('@/components/report/agentStatus/agentStatus') //报表菜单-客服状态
const detailStatus = () => import('@/components/report/agentStatus/detail/detailStatus') //报表菜单-客服状态详情
const visitConversation = () => import('@/components/report/visitConversation/visitConversation') //报表菜单-访问量和对话量
const volume = () => import('@/components/report/volume/volume') //报表菜单-服务量
const evaluation = () => import('@/components/report/evaluation/evaluation') //报表菜单-客服评价

const config = () => import('@/components/config/config') //设置入口
const configMenu = () => import('@/components/config/configMenu') //设置模块菜单
const teamInfo = () => import('@/components/config/teamInfo/teamInfo') //团队信息模块
const nameCard = () => import('@/components/config/nameCard/nameCard') //团队信息下——团队名片模块
const serviceGrouping = () => import('@/components/config/serviceGrouping/serviceGrouping') // 客服与分组模块
const roleSet = () => import('@/components/config/roleSet/roleSet')
const createAgent = () => import('@/components/config/createAgent/createAgent')
const network = () => import('@/components/network/network')
const visitorList = () => import('@/components/visitorInformation/visitorList') //访客信息
const engage = () => import('@/components/engage/index') //顾客管理
const personalSet = () => import('@/components/config/personalSet/personalSet')
const fastReply = () => import('@/components/config/fastReply/fastReply')
const history = () => import('@/components/history/history') //历史
const exportTasList = () => import('@/components/history/exportTasList') //历史-查看导出任务
const shortcutKey = () => import('@/components/config/shortcutKey/shortcutKey')
const blacklist = () => import('@/components/config/blacklist/blacklist') //黑名单
const label = () => import('@/components/config/customerLabel/label') //顾客标签
const tab = () => import('@/components/config/conversationsTab/tab') //对话标签
const lineUp = () => import('@/components/config/lineUp/lineUp')
const autoMessage = () => import('@/components/config/autoMessage/autoMessage')
const robot = () => import('@/components/config/robot/index') //机器人设置
const repository = () => import('@/components/config/repository/index') //知识库
const chatLinks = () => import('@/components/config/chatLinks/chatLinks') //聊天链接
const customerInfo = () => import('@/components/config/customerInfo/index') // 客户信息管理
const autoRules = () => import('@/components/config/autoRules/autoRules') //自动规则
const ticketsCate = () => import('@/components/config/ticketsCate/ticketsCate') //工单分类

export default [{
    path: '/',
    redirect: 'homePage',
    meta: {
        title: '首页'
    }
},
{
    path: '/login',
    name: 'login',
    component: login,
    meta: {
        title: '登录'
    }
},
{
    path: '/main',
    name: 'main',
    component: main,
    children: [{
        path: '/imServer',
        name: 'imServer',
        component: imServer,
        meta: {
            title: '对话'
        }
    },
    {
        path: '/homePage',
        name: 'homePage',
        component: homePage,
        meta: {
            title: '首页'
        }
    },
    {
        path: '/visitorList',
        name: 'visitorList',
        component: visitorList,
        meta: {
            title: '在线访客'
        }
    },
    {
        path: '/engage',
        name: 'engage',
        component: engage,
        meta: {
            title: '顾客'
        }
    },
    {
        path: '/tickets/:type',
        name: 'tickets',
        component: tickets,
        meta: {
            title: '工单'
        }
    },
    {
        path: '/history/index',
        name: 'history/index',
        component: history,
        meta: {
            title: '历史'
        }
    },
    {
        path: '/history/exportTasList',
        name: 'history/exportTasList',
        component: exportTasList,
        meta: {
            title: '导出任务列表',
            back: '/history/index'
        },
    },
    {
        path: '/config',
        name: 'config',
        component: config,
        meta: {
            title: '设置'
        },
        children: [{
            path: '/config',
            name: 'configMenu',
            component: configMenu,
            meta: {
                title: '设置'
            }
        },
        {
            path: '/config/personalSet',
            name: 'personalSet',
            component: personalSet,
            meta: {
                title: '个人信息设置',
                back: '/config'
            }
        },
        {
            path: '/config/teaminfo',
            name: 'teamInfo',
            component: teamInfo,
            meta: {
                title: '团队信息',
                back: '/config'
            }
        },
        {
            path: '/config/namecard',
            name: 'namecard',
            component: nameCard,
            meta: {
                title: '客服团队名单',
                back: '/config/teaminfo'
            }
        },
        {
            path: '/config/servicegrouping',
            name: 'serviceGrouping',
            component: serviceGrouping,
            meta: {
                title: '客服与分组',
                back: '/config'
            }
        },
        {
            path: '/config/roleset',
            name: 'roleSet',
            component: roleSet,
            meta: {
                title: '角色设置',
                back: '/config/servicegrouping'
            }
        },
        {
            path: '/config/createagent',
            name: 'createAgent',
            component: createAgent,
            props: true,
            meta: {
                title: '新建客服账号',
                back: '/config/servicegrouping'
            }
        },
        {
            path: '/config/roleseting',
            name: 'roleSeting',
            component: roleSet,
            meta: {
                title: '角色设置',
                back: '/config'
            }
        },
        {
            path: '/config/fasterply',
            name: 'fastReply',
            component: fastReply,
            meta: {
                title: '快捷回复设置',
                back: '/config'
            }
        },
        {
            path: '/config/shortcutkey',
            name: 'shortcutKey',
            component: shortcutKey,
            meta: {
                title: '快捷键',
                back: '/config'
            }
        }, {
            path: '/config/blacklist',
            name: 'blacklist',
            component: blacklist,
            meta: {
                title: '黑名单',
                back: '/config'
            }
        }, {
            path: '/config/label',
            name: 'label',
            component: label,
            meta: {
                title: '顾客标签',
                back: '/config'
            }
        }, {
            path: '/config/tab',
            name: 'tab',
            component: tab,
            meta: {
                title: '对话标签',
                back: '/config'
            }
        }, {
            path: '/config/lineup',
            name: 'lineup',
            component: lineUp,
            meta: {
                title: '排队',
                back: '/config'
            }
        }, {
            path: '/config/automessage',
            name: 'automessage',
            component: autoMessage,
            meta: {
                title: '自动消息',
                back: '/config'
            }
        },{
            path: '/config/robot',
            name: 'robot',
            component: robot,
            meta: {
                title: '机器人设置',
                back: '/config'
            }
        },{
            path: '/config/repository',
            name: 'repository',
            component: repository,
            meta: {
                title: '知识库',
                back: '/config'
            },
        },{
            path: '/config/chatLinks',
            name: 'chatLinks',
            component: chatLinks,
            meta: {
                title: '聊天链接',
                back: '/config'
            }
        },
        {
            path: '/config/customerInfo',
            name: 'customerInfo',
            component: customerInfo,
            meta: {
                title: '顾客信息',
                back: '/config'
            }
        },
        {
            path: '/config/autoRules',
            name: 'autoRules',
            component: autoRules,
            meta: {
                title: '自动规则',
                back: '/config'
            }
        },{
            path: '/config/ticketsCate',
            name: 'ticketsCate',
            component: ticketsCate,
            meta: {
                title: '工单分类',
                back: '/config'
            }
        },{
            path: '/config/editagent',
            name: 'editAgent',
            component: createAgent,
            meta: {
                title: '编辑客服帐号',
                back: '/config/servicegrouping'
            }
        }
        ]
    },
    {
        path: '/report',
        name: 'report',
        component: report,
        children: [{
            path: '/report',
            name: 'reportMenu',
            component: reportMenu,
            meta: {
                title: '报表',
                back: '/report'
            },
        },{
            path: '/report/dialogStatistics',
            name: 'dialogStatistics',
            component: dialogStatistics,
            meta: {
                title: '对话页统计',
                back: '/report'
            },
        },{
            path: '/report/customerLabel',
            name: 'customerLabel',
            component: customerLabel,
            meta: {
                title: '顾客标签',
                back: '/report'
            },
        },{
            path: '/report/volume',
            name: 'volume',
            component: volume,
            meta: {
                title: '服务量',
                back: '/report'
            },
        },{
            path: '/report/agentStatus',
            name: 'agentStatus',
            component: agentStatus,
            meta: {
                title: '客服状态',
                back: '/report'
            },
        },
        {
            path: '/report/detailStatus',
            name: 'detailStatus',
            component: detailStatus,
            meta: {
                title: '客服状态详情',
                back: '/report'
            }
        },
        {
            path: '/report/visitConversation',
            name: 'visitConversation',
            component: visitConversation,
            meta: {
                title: '对话量和访问量',
                back: '/report'
            }
        },{
            path: '/report/evaluation',
            name: 'evaluation',
            component: evaluation,
            meta: {
                title: '客服评价',
                back: '/report'
            }
        }]
    }
    ]
},
{
    path: '/imClient',
    name: 'imClient',
    component: imClient
},
{
    path: '/network',
    name: 'network',
    component: network,
    meta: {
        title: '网络'
    }
}
// ,
// {
//     path: '/test',
//     name: 'test',
//     component: () => import('@/components/imChat/imClient')
// }
    // { path: '*', redirect: '/login'}
]
