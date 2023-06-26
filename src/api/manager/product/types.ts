export interface ProductVO {
  /**
   * 产品主键
   */
  id: string | number;

  /**
   * 产品分组ID
   */
  groupId: string | number;

  /**
   * 驱动ID
   */
  driverId: string | number;

  /**
   * 产品名称
   */
  name: string;

  /**
   * 产品类型
   */
  type: number;

  /**
   * 图标
   */
  icon: string;

  /**
   * 厂家
   */
  manufacturer: string;

  /**
   * 型号
   */
  model: string;

  /**
   * 描述
   */
  remark: string;

}

export interface ProductForm extends BaseEntity {
  /**
   * 产品主键
   */
  id?: string | number;

  /**
   * 产品分组ID
   */
  groupId?: string | number;

  /**
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 产品名称
   */
  name?: string;

  /**
   * 产品类型
   */
  type?: number;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 厂家
   */
  manufacturer?: string;

  /**
   * 型号
   */
  model?: string;

  /**
   * 描述
   */
  remark?: string;

}

export interface ProductQuery extends PageQuery {
  /**
   * 产品分组ID
   */
  groupId?: string | number;

  /**
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 产品名称
   */
  name?: string;

  /**
   * 产品类型
   */
  type?: number;

  /**
   * 图标
   */
  icon?: string;

  /**
   * 厂家
   */
  manufacturer?: string;

  /**
   * 型号
   */
  model?: string;

}
