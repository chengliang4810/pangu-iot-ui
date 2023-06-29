export interface DriverAttributeValueVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 驱动属性ID
   */
  driverAttributeId: string | number;

  /**
   * 网关设备ID
   */
  gatewayDeviceId: string | number;

  /**
   * 属性类型
   */
  value: string;

}

export interface DriverAttributeValueForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 驱动属性ID
   */
  driverAttributeId?: string | number;

  /**
   * 网关设备ID
   */
  gatewayDeviceId?: string | number;

  /**
   * 属性类型
   */
  value?: string;

}

export interface DriverAttributeValueQuery extends PageQuery {
  /**
   * 驱动属性ID
   */
  driverAttributeId?: string | number;

  /**
   * 网关设备ID
   */
  gatewayDeviceId?: string | number;

  /**
   * 属性类型
   */
  value?: string;

}
