export interface DriverVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 协议唯一性标识
   */
  code: string;

  /**
   * 显示名称
   */
  displayName: string;

  /**
   * 启用|禁用
   */
  enable: number;

  /**
   * 在线服务数量
   */
  serverNumber: number;

  /**
   * 描述
   */
  remark: string;

}

export interface DriverForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 协议唯一性标识
   */
  code?: string;

  /**
   * 显示名称
   */
  displayName?: string;

  /**
   * 启用|禁用
   */
  enable?: number;

  /**
   * 描述
   */
  remark?: string;

}

export interface DriverQuery extends PageQuery {
  /**
   * 协议唯一性标识
   */
  code?: string;

  /**
   * 显示名称
   */
  displayName?: string;

  /**
   * 启用|禁用
   */
  enable?: number;

}
