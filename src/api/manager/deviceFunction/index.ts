import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeviceFunctionVO, DeviceFunctionForm, DeviceFunctionQuery } from '@/api/manager/deviceFunction/types';

/**
 * 查询设备功能列表
 * @param query
 * @returns {*}
 */

export const listDeviceFunction = (query?: DeviceFunctionQuery): AxiosPromise<DeviceFunctionVO[]> => {
  return request({
    url: '/manager/thing/function/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备功能详细
 * @param id
 */
export const getDeviceFunction = (id: string | number): AxiosPromise<DeviceFunctionVO> => {
  return request({
    url: '/manager/thing/function/' + id,
    method: 'get'
  });
};

/**
 * 新增设备功能
 * @param data
 */
export const addDeviceFunction = (data: DeviceFunctionForm) => {
  return request({
    url: '/manager/thing/function',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备功能
 * @param data
 */
export const updateDeviceFunction = (data: DeviceFunctionForm) => {
  return request({
    url: '/manager/thing/function',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备功能
 * @param id
 */
export const delDeviceFunction = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/thing/function/' + id,
    method: 'delete'
  });
};
