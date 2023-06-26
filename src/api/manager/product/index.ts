import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ProductVO, ProductForm, ProductQuery } from '@/api/manager/product/types';

/**
 * 查询产品列表
 * @param query
 * @returns {*}
 */

export const listProduct = (query?: ProductQuery): AxiosPromise<ProductVO[]> => {
  return request({
    url: '/manager/product/list',
    method: 'get',
    params: query
  });
};

export const treeProduct = (query?: ProductQuery): AxiosPromise<ProductVO[]> => {
  return request({
    url: '/manager/product/tree',
    method: 'get',
    params: query
  });
};

/**
 * 查询产品详细
 * @param id
 */
export const getProduct = (id: string | number): AxiosPromise<ProductVO> => {
  return request({
    url: '/manager/product/' + id,
    method: 'get'
  });
};

/**
 * 新增产品
 * @param data
 */
export const addProduct = (data: ProductForm) => {
  return request({
    url: '/manager/product',
    method: 'post',
    data: data
  });
};

/**
 * 修改产品
 * @param data
 */
export const updateProduct = (data: ProductForm) => {
  return request({
    url: '/manager/product',
    method: 'put',
    data: data
  });
};

/**
 * 删除产品
 * @param id
 */
export const delProduct = (id: string | number | Array<string | number>) => {
  return request({
    url: '/manager/product/' + id,
    method: 'delete'
  });
};
