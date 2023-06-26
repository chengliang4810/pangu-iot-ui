import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DriverVO, DriverForm, DriverQuery } from '@/api/manager/driver/types';

/**
 * 查询驱动列表
 * @param query
 * @returns {*}
 */

export const listDriver = (query?: DriverQuery): AxiosPromise<DriverVO[]> => {
  return request({
    url: '/manager/driver/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动列表
 * @param query
 * @returns {*}
 */
export const treeDriver = (query?: DriverQuery): AxiosPromise<DriverVO[]> => {
  return request({
    url: '/manager/driver/tree',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动详细
 * @param id
 */
export const getDriver = (id: string | number): AxiosPromise<DriverVO> => {
  return request({
    url: '/manager/driver/' + id,
    method: 'get'
  });
};

/**
 * 新增驱动
 * @param data
 */
export const addDriver = (data: DriverForm) => {
  return request({
    url: '/manager/driver',
    method: 'post',
    data: data
  });
};

/**
 * 修改驱动
 * @param data
 */
export const updateDriver = (data: DriverForm) => {
  return request({
    url: '/manager/driver',
    method: 'put',
    data: data
  });
};

/**
 * 删除驱动
 * @param id
 */
export const delDriver = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/driver/' + id,
    method: 'delete'
  });
};
