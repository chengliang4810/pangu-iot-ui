export interface DriverAttributeVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 驱动ID
   */
  driverId: string | number;

  /**
   * 属性名称
   */
  attributeName: string;

  /**
   * 属性类型
   */
  attributeType: string;

  /**
   * 显示名称
   */
  displayName: string;

  /**
   * 默认值
   */
  defaultValue: string;

  /**
   * 必填
   */
  required: number;

  /**
   * 描述
   */
  remark: string;

}

export interface DriverAttributeForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 属性名称
   */
  attributeName?: string;

  /**
   * 属性类型
   */
  attributeType?: string;

  /**
   * 显示名称
   */
  displayName?: string;

  /**
   * 默认值
   */
  defaultValue?: string;

  /**
   * 必填
   */
  required?: number;

  /**
   * 描述
   */
  remark?: string;

}

export interface DriverAttributeQuery extends PageQuery {
  /**
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 属性名称
   */
  attributeName?: string;

  /**
   * 属性类型
   */
  attributeType?: string;

  /**
   * 显示名称
   */
  displayName?: string;

  /**
   * 默认值
   */
  defaultValue?: string;

  /**
   * 必填
   */
  required?: number;

}
