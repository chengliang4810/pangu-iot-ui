import request from '@/utils/request'

// 查询点位属性配置信息列表
export function listDriverPointInfo(query) {
  return request({
    url: '/manager/driver/point/info/list',
    method: 'get',
    params: query
  })
}

// 查询点位属性配置信息详细
export function getDriverPointInfo(id) {
  return request({
    url: '/manager/driver/point/info/' + id,
    method: 'get'
  })
}

// 新增点位属性配置信息
export function addDriverPointInfo(data) {
  return request({
    url: '/manager/driver/point/info',
    method: 'post',
    data: data
  })
}

// 修改点位属性配置信息
export function updateDriverPointInfo(data) {
  return request({
    url: '/manager/driver/point/info',
    method: 'put',
    data: data
  })
}

// 删除点位属性配置信息
export function delDriverPointInfo(id) {
  return request({
    url: '/manager/driver/point/info/' + id,
    method: 'delete'
  })
}
