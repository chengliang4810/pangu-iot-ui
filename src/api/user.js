import request from '@/utils/request'

export function code() {
  return request({
    url: '/code',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: '/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return { 'success': true, 'code': '200', 'message': '请求成功', 'data': { 'menu': [{ 'id': '105', 'pid': '0', 'name': '系统管理', 'url': '/system', 'icon': null, 'menu_flag': 'Y' }, { 'id': '106', 'pid': '0', 'name': '用户管理', 'url': '/userMgr', 'icon': null, 'menu_flag': 'Y' }, { 'id': '114', 'pid': '105', 'name': '角色管理', 'url': '/system/role', 'icon': null, 'menu_flag': 'Y' }, { 'id': '128', 'pid': '184', 'name': '业务日志', 'url': '/log/businessLog', 'icon': null, 'menu_flag': 'Y' }, { 'id': '132', 'pid': '105', 'name': '系统字典', 'url': '/system/dictType', 'icon': null, 'menu_flag': 'Y' }, { 'id': '133', 'pid': '184', 'name': '登录日志', 'url': '/log/loginLog', 'icon': null, 'menu_flag': 'Y' }, { 'id': '168', 'pid': '106', 'name': '用户组管理', 'url': '/userMgr/userGroup', 'icon': null, 'menu_flag': 'Y' }, { 'id': '169', 'pid': '0', 'name': '统计分析', 'url': '/analyse', 'icon': null, 'menu_flag': 'Y' }, { 'id': '170', 'pid': '0', 'name': '设备管理', 'url': '/deviceMgr', 'icon': null, 'menu_flag': 'Y' }, { 'id': '171', 'pid': '0', 'name': '产品管理', 'url': '/productMgr', 'icon': null, 'menu_flag': 'Y' }, { 'id': '174', 'pid': '105', 'name': '平台授权', 'url': '/system/auth', 'icon': null, 'menu_flag': 'Y' }, { 'id': '177', 'pid': '170', 'name': '设备', 'url': '/deviceMgr/device', 'icon': null, 'menu_flag': 'Y' }, { 'id': '178', 'pid': '170', 'name': '设备组', 'url': '/deviceMgr/deviceGroup', 'icon': null, 'menu_flag': 'Y' }, { 'id': '179', 'pid': '192', 'name': '告警记录', 'url': '/alarm/alarmList', 'icon': null, 'menu_flag': 'Y' }, { 'id': '180', 'pid': '171', 'name': '产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '181', 'pid': '171', 'name': '产品分类', 'url': '/productMgr/productType', 'icon': null, 'menu_flag': 'Y' }, { 'id': '184', 'pid': '0', 'name': '系统日志', 'url': '/log', 'icon': null, 'menu_flag': 'Y' }, { 'id': '186', 'pid': '105', 'name': '系统参数', 'url': '/system/sysParam', 'icon': null, 'menu_flag': 'Y' }, { 'id': '187', 'pid': '105', 'name': '通知配置', 'url': '/system/media', 'icon': null, 'menu_flag': 'Y' }, { 'id': '189', 'pid': '169', 'name': '全局概览', 'url': '/analyse/home', 'icon': null, 'menu_flag': 'Y' }, { 'id': '192', 'pid': '0', 'name': '告警管理', 'url': '/alarm', 'icon': null, 'menu_flag': 'Y' }, { 'id': '193', 'pid': '194', 'name': '场景联动', 'url': '/rule/scene', 'icon': null, 'menu_flag': 'Y' }, { 'id': '194', 'pid': '0', 'name': '规则引擎', 'url': '/rule', 'icon': null, 'menu_flag': 'Y' }, { 'id': '196', 'pid': '170', 'name': '设备调试', 'url': '/deviceMgr/debug', 'icon': null, 'menu_flag': 'Y' }, { 'id': '198', 'pid': '0', 'name': '平台监控', 'url': '/realTime', 'icon': null, 'menu_flag': 'Y' }, { 'id': '199', 'pid': '105', 'name': '代理配置', 'url': '/system/proxyInfo', 'icon': null, 'menu_flag': 'Y' }, { 'id': '200', 'pid': '198', 'name': '代理监控', 'url': '/realTime/proxy', 'icon': null, 'menu_flag': 'Y' }, { 'id': '202', 'pid': '177', 'name': '增加设备', 'url': '/deviceMgr/device/add', 'icon': null, 'menu_flag': 'Y' }, { 'id': '203', 'pid': '177', 'name': '修改设备', 'url': '/deviceMgr/device/update', 'icon': null, 'menu_flag': 'Y' }, { 'id': '204', 'pid': '177', 'name': '删除设备', 'url': '/deviceMgr/device/delete', 'icon': null, 'menu_flag': 'Y' }, { 'id': '205', 'pid': '177', 'name': '设备列表', 'url': '/deviceMgr/device/list', 'icon': null, 'menu_flag': 'Y' }, { 'id': '206', 'pid': '177', 'name': '设备详情', 'url': '/deviceMgr/device/detail', 'icon': null, 'menu_flag': 'Y' }, { 'id': '207', 'pid': '180', 'name': '增加产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '208', 'pid': '180', 'name': '修改产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '209', 'pid': '180', 'name': '删除产品', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '210', 'pid': '180', 'name': '产品列表', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '211', 'pid': '180', 'name': '产品详情', 'url': '/productMgr/product', 'icon': null, 'menu_flag': 'Y' }, { 'id': '212', 'pid': '105', 'name': '租户管理', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '213', 'pid': '212', 'name': '租户增加', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '214', 'pid': '212', 'name': '租户修改', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '215', 'pid': '212', 'name': '租户列表', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '216', 'pid': '212', 'name': '租户删除', 'url': '/system/tenant', 'icon': null, 'menu_flag': 'Y' }, { 'id': '217', 'pid': '106', 'name': '用户', 'url': '/userMgr/user', 'icon': null, 'menu_flag': 'Y' }, { 'id': '218', 'pid': '198', 'name': '主服务监控', 'url': '/realTime/platform', 'icon': null, 'menu_flag': 'Y' }, { 'id': '220', 'pid': '0', 'name': '平台日志', 'url': '/platformLog', 'icon': null, 'menu_flag': 'Y' }, { 'id': '221', 'pid': '220', 'name': '事件日志', 'url': '/platformLog/event', 'icon': null, 'menu_flag': 'Y' }, { 'id': '222', 'pid': '220', 'name': '服务日志', 'url': '/platformLog/service', 'icon': null, 'menu_flag': 'Y' }, { 'id': '224', 'pid': '220', 'name': '联动日志', 'url': '/platformLog/linkage', 'icon': null, 'menu_flag': 'Y' }, { 'id': '225', 'pid': '0', 'name': '可视化', 'url': '/visualization', 'icon': null, 'menu_flag': 'Y' }, { 'id': '226', 'pid': '225', 'name': '设备分布', 'url': '/visualization/distributed', 'icon': null, 'menu_flag': 'Y' }, { 'id': '227', 'pid': '225', 'name': 'Grafana', 'url': '/visualization/grafana', 'icon': null, 'menu_flag': 'Y' }, { 'id': '228', 'pid': '225', 'name': '楼宇场景', 'url': '/visualization/building', 'icon': null, 'menu_flag': 'Y' }, { 'id': '229', 'pid': '0', 'name': '协议管理', 'url': '/agreement', 'icon': null, 'menu_flag': 'Y' }, { 'id': '230', 'pid': '229', 'name': '协议组件', 'url': '/agreement/module', 'icon': null, 'menu_flag': 'Y' }, { 'id': '231', 'pid': '229', 'name': '通信服务', 'url': '/agreement/communication', 'icon': null, 'menu_flag': 'Y' }, { 'id': '232', 'pid': '229', 'name': '协议网关', 'url': '/agreement/gateway', 'icon': null, 'menu_flag': 'Y' }], 'button': ['/mgr/add', '/mgr/edit', '/mgr/delete', '/mgr/reset', '/mgr/setRole', '/role/add', '/role/edit', '/role/remove', '/role/setAuthority', '/dictType/addItem', '/dictType/editItem', '/dictType/delete', '/dict/list', '/role/list', '/mgr/list'] }}
  // return request({
  //   url: '/sys/menu/list',
  //   method: 'get'
  // })
}

export function getUserInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
// 修改密码
export function changePwd(data) {
  return request({
    url: '/sys/user/changePwd',
    method: 'post',
    data
  })
}
