import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { DriverAttributeValueVO, DriverAttributeValueForm, DriverAttributeValueQuery } from '@/api/manager/driverAttributeValue/types';

/**
 * 查询驱动属性值列表
 * @param query
 * @returns {*}
 */

export const listDriverAttributeValue = (query?: DriverAttributeValueQuery): AxiosPromise<DriverAttributeValueVO[]> => {
  return request({
    url: '/manager/driverAttributeValue/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动属性值列表
 * @param query
 * @returns {*}
 */

export const treeDriverAttributeValue = (query?: DriverAttributeValueQuery): AxiosPromise<DriverAttributeValueVO[]> => {
  return request({
    url: '/manager/driverAttributeValue/tree',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动属性值详细
 * @param id
 */
export const getDriverAttributeValue = (id: string | number): AxiosPromise<DriverAttributeValueVO> => {
  return request({
    url: '/manager/driverAttributeValue/' + id,
    method: 'get'
  });
};

/**
 * 新增驱动属性值
 * @param data
 */
export const addDriverAttributeValue = (data: DriverAttributeValueForm) => {
  return request({
    url: '/manager/driverAttributeValue',
    method: 'post',
    data: data
  });
};

/**
 * 修改驱动属性值
 * @param data
 */
export const updateDriverAttributeValue = (data: DriverAttributeValueForm) => {
  return request({
    url: '/manager/driverAttributeValue',
    method: 'put',
    data: data
  });
};

/**
 * 删除驱动属性值
 * @param id
 */
export const delDriverAttributeValue = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/driverAttributeValue/' + id,
    method: 'delete'
  });
};
