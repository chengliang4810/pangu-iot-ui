export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  name?: string;
  token?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
  permissions: string[];
  roles: string[];
  sysUser: object;
}

export interface CaptchaData {
  uuid?:string
  captchaOnOff?:boolean
  img?:string
}
