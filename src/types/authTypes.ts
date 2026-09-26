import { TDataPerfil } from "@rute/types";

export interface DataLogonType {
  username: string;
  password: string;
}

export interface UserType extends TDataPerfil {}

export interface succesLoginType {
  user: UserType;
}

export interface TError {
  type: string,
  message: string,
  title: string,
  code: string,
  errors?: any[]
}

export interface errorLoginType {
  message: string,
  title: string,
  code: string
}
