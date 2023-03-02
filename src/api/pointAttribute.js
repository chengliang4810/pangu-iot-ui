import request from '@/utils/request'

// 查询点位属性列表
export function getDriverPointConfigByDeviceId(data) {
  const { deviceId, attributeId } = data
  return request({
    url: `/manager/driver/point/attribute/device/${deviceId}/device_attribute/${attributeId}`,
    method: 'get'
  })
}
// 查询点位属性列表
export function listDriverPointAttribute(query) {
  return request({
    url: '/manager/driver/point/attribute/list',
    method: 'get',
    params: query
  })
}

// 查询点位属性详细
export function getDriverPointAttribute(id) {
  return request({
    url: '/manager/driver/point/attribute/' + id,
    method: 'get'
  })
}

// 新增点位属性
export function addDriverPointAttribute(data) {
  return request({
    url: '/manager/driver/point/attribute',
    method: 'post',
    data: data
  })
}

// 修改点位属性
export function updateDriverPointAttribute(data) {
  return request({
    url: '/manager/driver/point/attribute',
    method: 'put',
    data: data
  })
}

// 删除点位属性
export function delDriverPointAttribute(id) {
  return request({
    url: '/manager/driver/point/attribute/' + id,
    method: 'delete'
  })
}
