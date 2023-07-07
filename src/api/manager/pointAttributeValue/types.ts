export interface PointAttributeValueVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 点位属性ID
   */
  pointAttributeId: string | number;

  /**
   * 设备ID
   */
  deviceId: string | number;

  /**
   * 设备属性ID
   */
  deviceAttributeId: string | number;

  /**
   * 属性值
   */
  value: string;
}

export interface PointAttributeValueBatchForm {
  deviceId?: string | number;
  deviceAttributeId?: string | number;
  pointAttributeConfig: any[];
}

export interface PointAttributeValueForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 点位属性ID
   */
  pointAttributeId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 设备属性ID
   */
  deviceAttributeId?: string | number;

  /**
   * 属性值
   */
  value?: string;
}

export interface PointAttributeValueQuery extends PageQuery {
  /**
   * 设备ID
   */
  driverId?: string | number;
  /**
   * 点位属性ID
   */
  pointAttributeId?: string | number;

  /**
   * 设备ID
   */
  deviceId?: string | number;

  /**
   * 设备属性ID
   */
  deviceAttributeId?: string | number;

  /**
   * 属性值
   */
  value?: string;
}
