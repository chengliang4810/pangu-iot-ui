export interface DeviceFunctionVO {
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
   * 驱动ID
   */
  driverId: string | number;

  /**
   * 设备属性
   */
  functionStatusAttribute: number;

  /**
   * 功能名称
   */
  functionName: string;

  /**
   * 标识符
   */
  identifier: string | number;

  /**
   * 数据类型
   */
  dataType: string;

  /**
   * 数据类型对象参数
   */
  specs: string;

  /**
   * 执行方式
   */
  async: number;

  /**
   * 描述
   */
  remark: string;

}

export interface DeviceFunctionForm extends BaseEntity {
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
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 设备属性
   */
  functionStatusAttribute?: number;

  /**
   * 功能名称
   */
  functionName?: string;

  /**
   * 标识符
   */
  identifier?: string | number;

  /**
   * 数据类型
   */
  dataType?: string;

  /**
   * 数据类型对象参数
   */
  specs?: string;

  /**
   * 执行方式
   */
  async?: number;

  /**
   * 描述
   */
  remark?: string;

}

export interface DeviceFunctionQuery extends PageQuery {
  /**
   * 产品ID
   */
  productId?: string | number;

  /**
   * 设备编号
   */
  deviceId?: string | number;

  /**
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 设备属性
   */
  functionStatusAttribute?: number;

  /**
   * 功能名称
   */
  functionName?: string;

  /**
   * 标识符
   */
  identifier?: string | number;

  /**
   * 数据类型
   */
  dataType?: string;

  /**
   * 执行方式
   */
  async?: number;

}
