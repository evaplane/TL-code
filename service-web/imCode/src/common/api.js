/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2019-08-22 09:16:37
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-10-30 04:02:40
 */
import axios from 'axios'
/**
 * 查看会话历史纪录
 */
export function getLoadhis(type) {
    return axios.get(`/im/immessage/getImMessagePageByTrackId?trackId=${type.trackId}&size=5&current=${type.currentSize}&filterDialogFlag=${type.filterDialogFlag}`)
}
/**
 * 获取人员全部信息
 */
export function getUserInfo() {
    return axios.get('/admin/user/info')
}
/**
 * 获取所有团队、获取团队信息、更新团队信息的url
 */
const dept = "/admin/dept"
/**
 * 根据团队ID获取/删除团队信息
 * @param {Number} deptId 团队ID
 * @param {String} method 请求方式 get:获取，delete:删除
 */
export function getDeptInfo(method, deptId) {
    return axios({
        method,
        url: `${dept}/${deptId || ''}`
    })
}
/**
 * 增删改团队接口
 * @param {String} method post:添加团队 put:编辑团队 delete:修改团队信息
 * @param {Object} data 数据对象
 */
export function handleDeptInfo(method, data) {
    return axios({
        url: dept,
        method,
        data
    })
}
/**
 * 根据团队ID获取团队联系人信息
 * @param {Number} deptId 团队ID
 */
export function getDeptContactById(deptId) {
    return axios.get(
        `/admin/dept/contact/${deptId}`
    )
};
/**
 * 修改团队联系人信息
 */
export function updateDeptContactInfo(method, data) {
    return axios({
        url: '/admin/dept/updateContact',
        method,
        data
    })
}
/**
 * 获取人员数据
 */
export function getUser(params) {
    return axios
        .get('/admin/user/page', {
            params
        })
}/**
 *
 * @param {*} id userId
 * 根据userId获取人员信息
 */
export function getUserById(id) {
    return axios.get(`/admin/user/${id}`)
}
/**
 *
 * @param {object} data 修改人员信息
 */
export function updateUser(data) {
    return axios.put('/admin/user', data)
}
/**
 *
 * @param {object} data 创建人员
 */
export function createUser(data) {
    return axios.post('/admin/user', data)
}
export function delUser(id) {
    return axios.delete(`/admin/user/${id}`)
}
/**
 *
 * @param {Sgring} method 方法:get:查询,delte:删除
 * @param {Number} id 角色id
 */
export function handleRole(method, id) {
    return axios({
        method,
        url: `/admin/role/1/${id}`
    })
}
/**
 *
 * @param {String} method 方法
 * @param {Number} deptId 部门ID
 * @param {Number} roleIds 角色id
 */
export function roleSet(method, params) {
    return axios({
        method, url: '/admin/role/addDeptPermissions',
        params
    })
}
/**
 *
 * @param {obejct} data
 * 编辑人员信息
 */
export function eidtUserInfo(data) {
    return axios.put('/admin/user/edit', data)
}
/**
 *
 * @param {Number} type 1——公司回复；2——个人回复
 */
export function getFastReplyList(type) {
    return axios.get(`/set/fastReplyConfig/list?fastReplyType=${type}`)
}
/**
 *
 * @param {object} data 编辑快捷回复规则
 */
export function updateReplyRule(data) {
    return axios.put('/set/fastReplyRefRuleConfig/updateReplyRule', data)
}
/**
 *
 * @param {object} data
 * 保存快捷回复分组
 */
export function saveFastReplyGroup(data) {
    return axios.post('/set/fastReplyGroupConfig/saveFastReply', data)
}
/**
 *
 * @param {*} data
 * 更新快捷回复分组
 */
export function updateReplyGroupById(data) {
    return axios.put('/set/fastReplyGroupConfig/updateReplyGroup', data)
}
/**
 *
 * @param {*} id
 * 根据id修改快捷回复分组
 */
export function editReplyGroupById(id,data) {
    return axios.put(`/set/fastReplyGroupConfig/${id}`, data)
}
/**
 *
 * @param {*} id
 * 根据id删除快捷回复分组
 */
export function deleteReplyGroupById(id) {
    return axios.delete(`/set/fastReplyGroupConfig/${id}`)
}
/**
 *
 * @param {*} data
 * 修改快捷回复排序
 */
export function editReply(id,data) {
    return axios.put(`/set/fastReplyConfig/${id}`, data)
}
/**
 *
 * @param {*} data
 * 保存快捷回复
 */
export function saveReply(data) {
    return axios.post('/set/fastReplyConfig/save', data)
}
/**
 *
 * @param {*} data
 * 修改快捷回复
 */
export function updateReply(data) {
    return axios.put('/set/fastReplyConfig/updateFastReply', data)
}
/**
 *
 * @param {*} id
 * 根据id删除快捷回复
 */
export function deleteReplyById(id) {
    return axios.delete(`/set/fastReplyConfig/${id}`)
}
/**
 *
 * @param {*} type 快捷回复类型 1——组内回复；0——个人回复
 * 清空快捷回复所有数据
 */
export function emptyData(type) {
    return axios.get(`/set/fastReplyGroupConfig/deleteAll?fastReplyType=${type}`)
}
/**
 *
 * @param {*} params
 * 获取黑名单
 */
export function getBlacklist(params) {
    return axios.get('/set/visitorBlackListConfig/page', { params })
}
/**
 *
 * @param {object} data
 * 编辑黑名单
 */
export function updateBlacklist(data) {
    return axios.post('/set/visitorBlackListConfig/updateBlackList', data)
}
/**
 *
 * @param {*} ids
 * 删除黑名单
 */
export function shield(ids) {
    return axios.delete(`/set/visitorBlackListConfig/deleteAll?ids=${ids}`)
}
/**
 * 获取排队设置
 */
export function getQueueRule(dept_id) {
    return axios.get('/set/customerQueueConfig/getCustomerQueue/'+dept_id)
}
/**
 *
 * @param {*} data
 * 修改排队设置
 */
export function updateQueueRule(data) {
    return axios.put('/set/customerQueueConfig/updateQueue', data)
}
/**
 * 获取自动消息
 */
export function getAutoMessage() {
    return axios.get('/set/autoMessageConfig/getAutoMessage')
}
/**
 *
 * @param {*} type
 * 导出快捷回复
 */
export function exportFastReply(type) {
    return axios({
        url: `/set/fastReplyConfig/exportFastReplyExcel?fastReplyType=${type}`,
        method: 'get',
        responseType: 'arraybuffer'
    })
}
/**
 *
 * @param {*} id
 * 导出人员名单
 */
export function exportUserList(id) {
    return axios({
        url: `/admin/dept/exportCustomerService`,
        method: 'post',
        responseType: 'arraybuffer',
        params: {
            deptId: id
        }
    })
}
/**
 *
 * @param {*} data
 * 设置自动消息
 */
export function setAutoMessage(data) {
    return axios.post('/set/autoMessageConfig/updateOrSaveMessage', data)
}
/**
 *
 * @param {*} params
 * 获取角色列表
 */
export function getRoleList(params) {
    return axios.get('/admin/role/page', {params})
}
/**
 *
 * @param {*} params
 * 获取角色权限
 */
export function getRolePermission(params) {
    return axios.get('/admin/menu', {params})
}
/**
 * 获取当前登录人名下的可分配的角色和部门
 */
export function getRoleDept() {
    return axios.get('/admin/dept/getDeptAndRoles')
}
/**
 *
 * @param {*} id
 * 获取当前所有菜单及权限
 */
export function getMenuTree(id) {
    let url
    if(id) {
        url = `/admin/menu/tree/${id}`
    } else {
        url = '/admin/menu/tree'
    }
    return axios.get(url)
}
/**
 *
 * @param {*} params
 * 保存角色设置
 */
export function saveRolePermission(params) {
    return axios({
        method: 'put',
        url: '/admin/role/menu',
        params
    })
}
/**
 *
 * @param {*} params
 * 获取登录人可以看见的菜单
 */
export function getUserMenu(params) {
    return axios.get('/admin/menu', {params})
}
/**
 * 获取当前登录人瞎的部门（一级菜单）
 */
export function getChildrenDeptInfo(params) {
    return axios.get('/admin/dept/getChildrenDeptInfo', {params})
}

// 获取知识库所有分类
export function getClassify(params) {
    return axios.get('/set/questionCategoryConfig/list', { params })
}
// 获取知识库所有问题
export function getQuestion(params){
    return axios.get('/set/questionConfig/page', { params })
}
export function getTotal() {
    return axios.get('/admin/user/getTotal')
}
export function logout() {
    return axios.delete('/auth/token/logout')
}
// 获取ip地址
export function getIp() {
    return axios.get('/set/visitorBlackListConfig/getIpDescr')
}

// 获取推广消息
export function getMsg(){
	return axios.get('/set/autoMessageConfig/promotionMessage')
}

// 新增推广消息
export function addMsg(data){
	return axios.post('/set/autoMessageConfig/promotionMessage',data)
}

// 新增推广消息
export function editMsg(data){
	return axios.put('/set/autoMessageConfig/promotionMessage',data)
}

// 新增推广消息
export function delMsg(id){
	return axios.delete(`/set/autoMessageConfig/promotionMessage/${id}`)
}

/**
 *
 * @param {*} data
 * 修改顾客标签排序
 */
export function changeCustomerLabel(id,data) {
    return axios.put(`/set/customerLabelConfig/${id}`, data)
}
