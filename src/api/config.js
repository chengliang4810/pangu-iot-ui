import request from '@/utils/request'
/* 查询Mqtt配置信息 */
export function getMqttConfig(data) {
  return request({
    url: '/system/config/mqtt',
    method: 'get'
  })
}

