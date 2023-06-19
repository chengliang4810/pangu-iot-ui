import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DriverApplicationVO, DriverApplicationForm, DriverApplicationQuery } from '@/api/manager/driverApplication/types';

/**
 * 查询驱动应用列表
 * @param query
 * @returns {*}
 */

export const listDriverApplication = (query?: DriverApplicationQuery): AxiosPromise<DriverApplicationVO[]> => {
  return request({
    url: '/manager/driverApplication/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动应用详细
 * @param id
 */
export const getDriverApplication = (id: string | number): AxiosPromise<DriverApplicationVO> => {
  return request({
    url: '/manager/driverApplication/' + id,
    method: 'get'
  });
};

/**
 * 新增驱动应用
 * @param data
 */
export const addDriverApplication = (data: DriverApplicationForm) => {
  return request({
    url: '/manager/driverApplication',
    method: 'post',
    data: data
  });
};

/**
 * 修改驱动应用
 * @param data
 */
export const updateDriverApplication = (data: DriverApplicationForm) => {
  return request({
    url: '/manager/driverApplication',
    method: 'put',
    data: data
  });
};

/**
 * 删除驱动应用
 * @param id
 */
export const delDriverApplication = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/driverApplication/' + id,
    method: 'delete'
  });
};
