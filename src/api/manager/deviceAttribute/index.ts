import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeviceAttributeVO, DeviceAttributeForm, DeviceAttributeQuery } from '@/api/manager/deviceAttribute/types';

/**
 * 查询设备属性列表
 * @param query
 * @returns {*}
 */

export const listDeviceAttributeByDeviceId = (deviceId: string | number, realTime: boolean): AxiosPromise<DeviceAttributeVO[]> => {
  return request({
    url: `/manager/deviceAttribute/device/${deviceId}?realTime=${realTime}`,
    method: 'get'
  });
};

/**
 * 查询设备属性列表
 * @param query
 * @returns {*}
 */

export const listDeviceAttribute = (query?: DeviceAttributeQuery): AxiosPromise<DeviceAttributeVO[]> => {
  return request({
    url: '/manager/deviceAttribute/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备属性详细
 * @param id
 */
export const getDeviceAttribute = (id: string | number): AxiosPromise<DeviceAttributeVO> => {
  return request({
    url: '/manager/deviceAttribute/' + id,
    method: 'get'
  });
};

/**
 * 新增设备属性
 * @param data
 */
export const addDeviceAttribute = (data: DeviceAttributeForm) => {
  return request({
    url: '/manager/deviceAttribute',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备属性
 * @param data
 */
export const updateDeviceAttribute = (data: DeviceAttributeForm) => {
  // 删除对象中productId与deviceId
  delete data.productId;
  delete data.deviceId;
  return request({
    url: '/manager/deviceAttribute',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备属性
 * @param id
 */
export const delDeviceAttribute = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/deviceAttribute/' + id,
    method: 'delete'
  });
};
