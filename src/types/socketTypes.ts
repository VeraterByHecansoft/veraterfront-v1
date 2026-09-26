import { DataCoordsType } from "@/hooks";
import { UserType } from "./authTypes";

export interface TSocketResponseError {
  trace:Array<any>;
  code:string;
  title:string;
  message:string;
}

export interface TSocketRequest {
  t:string;
  t2?:string;
  apiv:string;
  apv:string;
  uid?:string|null;
  h?:string|null;
  subApp?:string|null;
  tk?:string|null;
  coords?:DataCoordsType|string|null;
  d:any;
  u?:string
}

export interface TResp {
  error:string|null;
  message:string;
  sid?:string|null;
  PERFIL?: UserType|undefined
  expiresAt?:number|undefined
  [key: string]: unknown;
}

export interface TSocketResponse {
    t:string; //Tipo evento o petición
    err:TSocketResponseError|string|null; //error
    resp:TResp; // resultados de la petición
    r?:string;
    u?:string; //Usuario
    user?:string; //Usuario
}
