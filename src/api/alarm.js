import request from '@/utils/request'

// 告警记录列表
export function getAlarmByPage(data) {
  return request({
    url: '/manager/problem/list',
    method: 'get',
    params: data
  })
}

// 告警记录-解决
export function resolve(params) {
  return request({
    url: `/manager/problem/resolve/${params.eventId}`,
    method: 'put'
  })
}

// 告警记录-确认
export function acknowledgement(params) {
  return request({
    url: `/manager/problem/acknowledgement/${params.eventId}`,
    method: 'put'
  })
}
