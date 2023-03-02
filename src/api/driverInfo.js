import request from '@/utils/request'

/**
 * 批量新增&更新驱动属性配置信息
 * @param {
 *  deviceId: 设备ID
 *  attributeValue: {
 *  [attributeId]: value
 *  }
 * } data 参数
 */
export function updateDriverInfoBatch(data) {
  return request({
    url: '/manager/driver/info/batch',
    method: 'post',
    data: data
  })
}

// 查询驱动属性配置信息列表
export function listDriverInfo(query) {
  return request({
    url: '/manager/driver/info/list',
    method: 'get',
    params: query
  })
}

// 查询驱动属性配置信息详细
export function getDriverInfo(id) {
  return request({
    url: '/manager/driver/info/' + id,
    method: 'get'
  })
}

// 新增驱动属性配置信息
export function addDriverInfo(data) {
  return request({
    url: '/manager/driver/info',
    method: 'post',
    data: data
  })
}

// 修改驱动属性配置信息
export function updateDriverInfo(data) {
  return request({
    url: '/manager/driver/info',
    method: 'put',
    data: data
  })
}

// 删除驱动属性配置信息
export function delDriverInfo(id) {
  return request({
    url: '/manager/driver/info/' + id,
    method: 'delete'
  })
}
