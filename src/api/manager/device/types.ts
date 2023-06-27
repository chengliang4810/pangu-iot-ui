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
