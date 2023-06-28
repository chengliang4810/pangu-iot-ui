/**
 * 添加子设备
 */
export interface AddChildDeviceForm {
  /**
   * 设备主键
   * @description 设备主键
   * @example 1
   */
  deviceId: string | number;

  /**
   * 子设备主键数组
   * @description 子设备主键数组
   * @example [1,2,3]
   */
  childDeviceIds: Array<string | number>;
}

export interface DeviceVO {
  /**
   * 设备主键
   */
  id: string | number;

  /**
   * 设备分组ID
   */
  groupId: string | number;

  /**
   * 产品ID
   */
  productId: string | number;

  /**
   * 设备类型
   */
  deviceType?: string | number;

  /**
   * 设备编号
   */
  code: string;

  /**
   * 设备名称
   */
  name: string;

  /**
   * 设备地址
   */
  address: string;

  /**
   * 地址坐标
   */
  position: string;

  /**
   * 启用状态
   */
  status: number;

  /**
   * 描述
   */
  remark: string;

  /**
   * 子设备数量
   */
  childDeviceNumber: number;
}

export interface DeviceForm extends BaseEntity {
  /**
   * 设备主键
   */
  id?: string | number;

  /**
   * 设备分组ID
   */
  groupId?: string | number;

  /**
   * 产品ID
   */
  productId?: string | number;

  /**
   * 设备编号
   */
  code?: string;

  /**
   * 设备名称
   */
  name?: string;

  /**
   * 设备地址
   */
  address?: string;

  /**
   * 地址坐标
   */
  position?: string;

  /**
   * 启用状态
   */
  status?: number;

  /**
   * 描述
   */
  remark?: string;

  /**
   * 驱动属性配置
   */
  driverAttributeConfig?: any;
}

export interface DeviceQuery extends PageQuery {
  /**
   * 设备分组ID
   */
  groupId?: string | number;

  /**
   * 产品ID
   */
  productId?: string | number;

  /**
   * 设备类型
   */
  deviceType?: string | number;

  /**
   * 设备编号
   */
  code?: string;

  /**
   * 设备名称
   */
  name?: string;

  /**
   * 启用状态
   */
  status?: number;

  /**
   * 创建时间
   */
  createTime?: string;
}
