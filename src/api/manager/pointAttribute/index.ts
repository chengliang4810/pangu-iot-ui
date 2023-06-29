import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { PointAttributeVO, PointAttributeForm, PointAttributeQuery } from '@/api/manager/pointAttribute/types';

/**
 * 查询驱动属性列表
 * @param query
 * @returns {*}
 */

export const listPointAttribute = (query?: PointAttributeQuery): AxiosPromise<PointAttributeVO[]> => {
  return request({
    url: '/manager/pointAttribute/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动属性列表
 * @param query
 * @returns {*}
 */

export const treePointAttribute = (query?: PointAttributeQuery): AxiosPromise<PointAttributeVO[]> => {
  return request({
    url: '/manager/pointAttribute/tree',
    method: 'get',
    params: query
  });
};

/**
 * 查询驱动属性详细
 * @param id
 */
export const getPointAttribute = (id: string | number): AxiosPromise<PointAttributeVO> => {
  return request({
    url: '/manager/pointAttribute/' + id,
    method: 'get'
  });
};

/**
 * 新增驱动属性
 * @param data
 */
export const addPointAttribute = (data: PointAttributeForm) => {
  return request({
    url: '/manager/pointAttribute',
    method: 'post',
    data: data
  });
};

/**
 * 修改驱动属性
 * @param data
 */
export const updatePointAttribute = (data: PointAttributeForm) => {
  return request({
    url: '/manager/pointAttribute',
    method: 'put',
    data: data
  });
};

/**
 * 删除驱动属性
 * @param id
 */
export const delPointAttribute = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/pointAttribute/' + id,
    method: 'delete'
  });
};
