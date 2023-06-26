import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DeviceVO, DeviceForm, DeviceQuery } from '@/api/manager/device/types';

/**
 * 查询设备列表
 * @param query
 * @returns {*}
 */

export const listDevice = (query?: DeviceQuery): AxiosPromise<DeviceVO[]> => {
  return request({
    url: '/manager/device/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询设备详细
 * @param id
 */
export const getDevice = (id: string | number): AxiosPromise<DeviceVO> => {
  return request({
    url: '/manager/device/' + id,
    method: 'get'
  });
};

/**
 * 新增设备
 * @param data
 */
export const addDevice = (data: DeviceForm) => {
  return request({
    url: '/manager/device',
    method: 'post',
    data: data
  });
};

/**
 * 修改设备
 * @param data
 */
export const updateDevice = (data: DeviceForm) => {
  return request({
    url: '/manager/device',
    method: 'put',
    data: data
  });
};

/**
 * 删除设备
 * @param id
 */
export const delDevice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/device/' + id,
    method: 'delete'
  });
};
