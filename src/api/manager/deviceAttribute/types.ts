export interface DeviceAttributeVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 产品ID
   */
  productId: string | number;

  /**
   * 设备编号
   */
  deviceId: string | number;

  /**
   * 属性名称
   */
  attributeName: string;

  /**
   * 标识符
   */
  identifier: string | number;

  /**
   * 属性类型
   */
  attributeType: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 数据预处理代码
   */
  pretreatmentScript: string;

  /**
   * 值映射ID
   */
  valueMapId: string | number;

  /**
   * 描述
   */
  remark: string;
}

export interface DeviceAttributeForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 产品ID
   */
  productId?: string | number;

  /**
   * 设备编号
   */
  deviceId?: string | number;

  /**
   * 属性名称
   */
  attributeName?: string;

  /**
   * 标识符
   */
  identifier?: string | number;

  /**
   * 属性类型
   */
  attributeType?: string;

  /**
   * 单位
   */
  unit?: string;

  /**
   * 数据预处理代码
   */
  pretreatmentScript?: string;

  /**
   * 值映射ID
   */
  valueMapId?: string | number;

  /**
   * 描述
   */
  remark?: string;
}

export interface DeviceAttributeQuery extends PageQuery {
  /**
   * 属性名称
   */
  attributeName?: string;

  /**
   * 标识符
   */
  identifier?: string | number;

  /**
   * 设备编号
   */
  deviceId?: string | number;

  /**
   * 产品ID
   */
  productId?: string | number;
}
