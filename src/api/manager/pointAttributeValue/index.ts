import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PointAttributeValueVO, PointAttributeValueForm, PointAttributeValueQuery } from '@/api/manager/pointAttributeValue/types';

/**
 * 查询驱动属性值列表
 * @param query
 * @returns {*}
 */

export const listPointAttributeValue = (query?: PointAttributeValueQuery): AxiosPromise<PointAttributeValueVO[]> => {
  return request({
    url: '/manager/pointAttributeValue/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动属性值详细
 * @param id
 */
export const getPointAttributeValue = (id: string | number): AxiosPromise<PointAttributeValueVO> => {
  return request({
    url: '/manager/pointAttributeValue/' + id,
    method: 'get'
  });
};

/**
 * 新增驱动属性值
 * @param data
 */
export const addPointAttributeValue = (data: PointAttributeValueForm) => {
  return request({
    url: '/manager/pointAttributeValue',
    method: 'post',
    data: data
  });
};

/**
 * 修改驱动属性值
 * @param data
 */
export const updatePointAttributeValue = (data: PointAttributeValueForm) => {
  return request({
    url: '/manager/pointAttributeValue',
    method: 'put',
    data: data
  });
};

/**
 * 删除驱动属性值
 * @param id
 */
export const delPointAttributeValue = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/pointAttributeValue/' + id,
    method: 'delete'
  });
};
