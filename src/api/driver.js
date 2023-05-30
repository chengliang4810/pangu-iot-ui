import request from '@/utils/request'
// 根据产品ID查询驱动配置信息
export function driverConfigByDeviceId(deviceId) {
  return request({
    url: `/manager/driver/attribute/device/${deviceId}`,
    method: 'get'
  })
}

// 查询协议驱动列表
export function updateDriverConfigById(id) {
  return request({
    url: `/manager/driver/metadata/update/${id}`,
    method: 'get'
  })
}

// 查询协议驱动列表
export function listDriver(query) {
  return request({
    url: '/manager/driver/list',
    method: 'get',
    params: query
  })
}

// 查询协议驱动列表
export function treeDriver(query) {
  return request({
    url: '/manager/driver/tree',
    method: 'get',
    params: query
  })
}

// 查询协议驱动详细
export function getDriver(id) {
  return request({
    url: '/manager/driver/' + id,
    method: 'get'
  })
}

// 新增协议驱动
export function addDriver(data) {
  return request({
    url: '/manager/driver',
    method: 'post',
    data: data
  })
}

// 修改协议驱动
export function updateDriver(data) {
  return request({
    url: '/manager/driver',
    method: 'put',
    data: data
  })
}

// 删除协议驱动
export function delDriver(id) {
  return request({
    url: '/manager/driver/' + id,
    method: 'delete'
  })
}
