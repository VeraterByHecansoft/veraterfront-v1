import { type TLanguageCode } from '@/i18n';

export interface AuthModel {
  access_token: string;
  refreshToken?: string;
  expiresIn?: string;
  token_type: string;
}

export interface CvsModel {
  id: string;
}

export interface RoleModel {
  name: string;
}
export interface MetaDataModel {
  Age?:string,
  City?:string,
  State?:string,
  Country?:string,
  Postcode?:string,
  Phone?:string,
  Email?:string,
  BirthDate?:number
}

export interface UserModel {
  id: string;
  username: string;
  password: string | undefined;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  occupation?: string;
  company_name?: string;
  avatar?: string;
  role?: string | undefined;
  language?: TLanguageCode;
  two_steps_auth?:boolean;
  last_login: Date;
  email_verified_at: Date;
  deleted_at: Date;
  status: string;
  auth?: AuthModel;
  metadata?:MetaDataModel
}

export interface ModuleAuthItem {
  name: string;
  title?: string;
  tooltip?:string;
  description: string;
  path: string;
  icon: string;
  color?:string;
  type: string;
  active: boolean;
  children?:Array<ModuleAuthItem>;
}
export interface ModuleAuthItems extends Array<ModuleAuthItem> {}