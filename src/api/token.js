import request from '@/utils/request'
/**
 * 获取Token分页列表
 */
export function getTokenPageList(params) {
  return request({
    url: '/system/token/list',
    method: 'get',
    params
  })
}

/** 创建Token */
export function createToken(data) {
  return request({
    url: '/system/token',
    method: 'post',
    data
  })
}

/** 更新Token */
export function updateToken(data) {
  return request({
    url: '/system/token',
    method: 'put',
    data
  })
}

/** 重置Token */
export function resetToken(id) {
  return request({
    url: '/system/token/reset/' + id,
    method: 'put'
  })
}

/** 删除Token */
export function deleteToken(tokenIds) {
  return request({
    url: '/system/token/' + tokenIds,
    method: 'delete'
  })
}
