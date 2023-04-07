import request from '@/utils/request'

// 操作日志
export function getLogList(params) {
  return request({
    url: '/system/operlog/list',
    method: 'get',
    params
  })
}

// 登录日志
export function getLoginLogList(params) {
  return request({
    url: '/system/logininfor/list',
    method: 'get',
    params
  })
}
