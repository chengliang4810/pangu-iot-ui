import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DriverAttributeVO, DriverAttributeForm, DriverAttributeQuery, DriverAttributeValueForm } from '@/api/manager/driverAttribute/types';

/**
 * 查询驱动属性列表
 * @param query
 * @returns {*}
 */

export const listDriverAttribute = (query?: DriverAttributeQuery): AxiosPromise<DriverAttributeVO[]> => {
  return request({
    url: '/manager/driverAttribute/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动属性列表
 * @param query
 * @returns {*}
 */

export const treeDriverAttribute = (query?: DriverAttributeQuery): AxiosPromise<DriverAttributeVO[]> => {
  return request({
    url: '/manager/driverAttribute/tree',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动属性详细
 * @param id
 */
export const getDriverAttribute = (id: string | number): AxiosPromise<DriverAttributeVO> => {
  return request({
    url: '/manager/driverAttribute/' + id,
    method: 'get'
  });
};

/**
 * 新增驱动属性
 * @param data
 */
export const addDriverAttribute = (data: DriverAttributeForm) => {
  return request({
    url: '/manager/driverAttribute',
    method: 'post',
    data: data
  });
};

/**
 * 批量新增/修改驱动属性值
 * 通过判断是否存在id来判断是新增还是修改
 * @param data
 */
export const batchAddDriverAttributeValue = (data: Array<DriverAttributeValueForm>) => {
  return request({
    url: '/manager/driverAttributeValue/batch',
    method: 'post',
    data: data
  });
};

/**
 * 修改驱动属性
 * @param data
 */
export const updateDriverAttribute = (data: DriverAttributeForm) => {
  return request({
    url: '/manager/driverAttribute',
    method: 'put',
    data: data
  });
};

/**
 * 删除驱动属性
 * @param id
 */
export const delDriverAttribute = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/driverAttribute/' + id,
    method: 'delete'
  });
};
