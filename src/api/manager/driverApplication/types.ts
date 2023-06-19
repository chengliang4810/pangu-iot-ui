export interface DriverApplicationVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 驱动ID
   */
  driverId: string | number;

  /**
   * 应用名称
   */
  applicationName: string;

  /**
   * 显示名称
   */
  host: string;

  /**
   * 端口号
   */
  port: number;

}

export interface DriverApplicationForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 应用名称
   */
  applicationName?: string;

  /**
   * 显示名称
   */
  host?: string;

  /**
   * 端口号
   */
  port?: number;

}

export interface DriverApplicationQuery extends PageQuery {
  /**
   * 驱动ID
   */
  driverId?: string | number;

  /**
   * 应用名称
   */
  applicationName?: string;

  /**
   * 显示名称
   */
  host?: string;

  /**
   * 端口号
   */
  port?: number;

}
