/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-07 16:32:51
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-25 11:02:33
 */
// const serverHttp = "http://172.18.61.254:8088" ; //测试服务地址
// const serverImHttp = "172.18.61.254:2048" ; //测试聊天服务地址
// const serverHttp = "http://192.168.1.111:8088" ; //开发服务地址
// const serverImHttp = "192.168.1.111:2048" ; //开发聊天服务地址
// const serverHttp = "http://10.8.0.186:9999" ; //开发服务地址
const serverHttp = "" ; //开发服务地址
const serverImHttp = "" ; //开发聊天服务地址
const serverHttpCodeAndUpl = "https://dev-kefu.tlkj.com"; //code and upl
// admin/dept


var serverUrl = {

  serverImHttp: serverImHttp, // 聊天服务地址
  getIdentifyingCode: serverHttpCodeAndUpl + '/code', // 登录验证码
  login: serverHttp + '/auth/oauth/token', // 登录
  logout: serverHttp + '/auth/token/logout', // 退出
  logoutDelToken: serverHttp + '/auth/token/logoutDelToken', // 下线
  updateServiceStatus: serverHttp + '/admin/user/updateServiceStatus', // 切换用户状态
  im_fdfsupload : serverHttpCodeAndUpl+'/im/file/upload', //文件上传 图片、文件
   // 聊天接口
  getImClientBindInfo : serverHttp+'/im/imbindinfo/getImClientBindInfo', //访客与坐席绑定
  getImClientBindPage : serverHttp+'/imbindinfo/page', //坐席获取访客列表
  getBindInfoByClientId : serverHttp + '/im/imbindinfo/getBindInfoByClientId',// 根据访客id获取访客与坐席绑定
  // loadedHistory :serverHttp + '/im/immessage/page', //记载会话历史记录
  loadedHistory :serverHttp + '/im/immessage/getImMessagePageByTrackId',
  save: serverHttp +'/im/imEvaluate/save', //提交评价
  seatsCloseDialogue: serverHttp + '/im/imbindinfo/seatsCloseDialogue', //关闭当前对话
  turnToBlacklist: serverHttp +'/im/imbindinfo/turnToBlacklist', //坐席加入访客至黑名单
  getLabele: serverHttp + '/set/customerLabelConfig/getLabel', // 查询全部顾客标签
  getTab: serverHttp + '/set/dialogueLabelConfig/page', //查询所有对话标签
  saveDialogueTag: serverHttp + '/im/imbindinfo/saveDialogueTag',//更新对话标签
  getImClientInfo: serverHttp + '/im/imclientInfo/getImClientInfo' ,//根据访客ID查询访客信息
  getOnlineSeatsListByGroupId: serverHttp + '/im/imseatsinfo/getOnlineSeatsListByGroupId',//获取所有坐席
  transfer: serverHttp + '/im/imbindinfo/transfer',//会话转接
  getVisitorLatestTicket: serverHttp + '/ticket/ticketOrder/getVisitorLatestTicket',//获取最新工单
  lineUpTurnDialogue: serverHttp + '/im/imbindinfo/lineUpTurnDialogue', //排队转对话
  fastReplyType: serverHttp +'/set/fastReplyConfig/list', //聊天引用快捷回复
  checkBlackList: serverHttp +'/set/visitorBlackListConfig/checkBlackList', //检验是否已加入黑名单
  saveOrDeleteBlackVisitor: serverHttp +'/set/visitorBlackListConfig/saveOrDeleteBlackVisitor', //新增黑名单
  updateVisitor:serverHttp +'/set/visitorBlackListConfig/updateVisitorName', //修改访客黑名单
  updateLabelNum: serverHttp +'/set/customerLabelConfig/updateLabel', //顾客标签计数
  updateDialogNum: serverHttp +'/set/dialogueLabelConfig/updateLabel', //对话标签计数
  getTabContents: serverHttp +'/im/accessChatLink/getTabContents ' , //接入聊天链接-获取请求页签内容
  // 工单接口
  getAllSubCatList : serverHttp+'/ticket/ticketOrder/getAllSubCatList', //查询工单类别包含所有子集
  // /ticketOrderClassConfig/getSubCats
  getSubCats : serverHttp+'/set/ticketOrderClassConfig/getSubCats', //查询工单类别包含所有子集(剔除空文件夹)
  autoRule:serverHttp+'/ticket/ticketOrder/autoRule',//返回工单自动规则 {类别ID}
  getTicketList : serverHttp +'/ticket/ticketOrder/getTicketList',//根据工单类型查询工单列表{type}
  // /ticketOrder/getTicketList/{trackType}/{sortType}
  getTicketsNum: serverHttp+'/ticket/ticketOrder/getTicketsNum', //获取未解决工单统计数
  addTicketOrder: serverHttp+'/ticket/ticketOrder',//创建工单信息
  ticketOrder: serverHttp+'/ticket/ticketOrder', //通过id查询工单信息{id}
  sendTicketTimeLine: serverHttp + '/ticket/ticketTimeLine',//工单信息回复
  getTicketTimeList: serverHttp + '/ticket/ticketTimeLine',//根据工单ID查询工单操作时间轴
  updateTicketOrder: serverHttp + '/ticket/ticketOrder',//修改工单信息{assigneeGroupId,assigneeId,cc,classId,id,status} id必传
  ticketSearch: serverHttp + '/ticket/ticketOrder/ticketSearch',//工单查询接口


  // 自动规则

  saveRule:serverHttp + '/set/ticketOrderAutoRuleConfig/saveRule', //新建自动规则
  getAutoRule:serverHttp +'/set/ticketOrderAutoRuleConfig/getAutoRule', //查询工单自动规则配置表
  delRuleById:serverHttp + '/set/ticketOrderAutoRuleConfig',//通过id删除工单自动规则配置表
  updateRule:serverHttp + '/set/ticketOrderAutoRuleConfig/updateRule',//修改工单自动规则配置表

  // 分类
  // getAllSubCatList:serverHttp+'//ticketOrderClassConfig/getAllSubCatList'
  saveClassConfig:serverHttp +'/set/ticketOrderClassConfig', //新增工单分类
  updateClassConfig:serverHttp +'/set/ticketOrderClassConfig', //修改工单分类
  delClassConfig:serverHttp +'/set/ticketOrderClassConfig', //通过{id}删除工单分类

  // 查询工单类别包含所有子集



  // listDeptTreeUsers: serverHttp + '/ticket/ticketOrder/listDeptTreeUsers', //获取当前登录用户可见的部门数与部门下面的用户信息
  listDeptTreeUsers: serverHttp + '/admin/dept', //获取当前登录用户可见的部门数与部门下面的用户信息
  listDeptByDataScope: serverHttp + '/admin/dept/listDeptByDataScope', //获取当前登录用户可见的部门数与部门下面的用户信息
  getDept: serverHttp + '/admin/dept', // 获取团队/获取团队信息/更新团队信息
  getDeptContact: serverHttp+ '/admin/dept/contact', // 获取团队联系人信息
  updateDeptContact: serverHttp + '/admin/dept/updateContact', // 编辑团队联系人信息
  getUser: serverHttp + '/admin/user/page', // 获取用户（支持按群组搜索）
  addUser: serverHttp + '/admin/user',
  getLabele: serverHttp + '/set/customerLabelConfig/getLabel', // 查询全部顾客标签
  getTab: serverHttp + '/set/dialogueLabelConfig/page', //查询所有对话标签
  getImClientInfo: serverHttp + '/im/imclientInfo/getImClientInfo' ,//根据访客ID查询访客信息
  saveOrUpdateClientInfo: serverHttp + '/im/imclientInfo/saveOrUpdateClientInfo', //根据ID修改访客信息

  // 历史API
  getDialogueHistoryInfo :serverHttp + '/im/dialogueHistory/getDialogueHistoryInfo', //历史模块根据坐席ID查询对话历史
  //访客管理
  getOnlineClientInfo :serverHttp + '/im/imbindinfo/getOnlineClientInfo', //访客管理
  getOnlineClientInfoList :serverHttp + '/im/imclientInfo/page', //查询所有访客列表
  //首页
  getIndexQueryInfoBySeatsId :serverHttp + '/im/imIndex/getIndexQueryInfoBySeatsId', //首页
  modifyOnlineOrInvisible :serverHttp + '/im/imIndex/modifyOnlineOrInvisible', // 首页修改用户状态
  
  addSaveLabel: serverHttp +'/set/customerLabelConfig/saveLabel', //新增顾客标签

  updateLabel: serverHttp + '/set/customerLabelConfig/updateLabel', //修改顾客标签
  delLabel: serverHttp + '/set/customerLabelConfig', //删除顾客标签
  getTab: serverHttp + '/set/dialogueLabelConfig/page', //查询所有对话标签
  getTabById: serverHttp + '/set/dialogueLabelConfig', // 根据ID 查询数据
  saveTab: serverHttp + '/set/dialogueLabelConfig/saveLabel', //新增对话标签
  updateTab: serverHttp + '/set/dialogueLabelConfig/updateLabel', //编辑对话标签
  deleteTab: serverHttp + '/set//dialogueLabelConfig/deleteLabel', //删除对话标签
  getCustomerTab: serverHttp + '/set/customerInfoConfig/tab',  // 顾客信息页签
  getCustomerTabField: serverHttp + '/set/customerInfoConfig/tabField',  // 查询顾客信息页签字段

  conversationExport :serverHttp + '/report/reportExport/conversationExport', //创建下载历史聊天记录
  getConversationPage :serverHttp + '/report/reportExport/page' , //分页查询对话历史导出记录
}

export default serverUrl;
