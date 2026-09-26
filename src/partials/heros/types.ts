import { UserType } from '@/types';
import { ReactNode } from 'react';

export interface IUserProfileHeroInfo {
  email?: string;
  label?: string;
  icon?: string;
  phone?:string;
  CLABE?:string
}


export interface ISaldos {
  INNTEC?: {
    total: number,
    saldoDisponible: number,
  },
  CREDITOS?: {
    micredito: number,
    saldo: number,
    disponible: number,
    moneda: string,
    creditos: number,
  }
  STP?: {
    CLABE: string,
    saldo: number,
    saldoret: number,
    compend: string
  }
}

export interface IUserProfileHeroProps {
  image?: ReactNode;
  name?: string;
  info: IUserProfileHeroInfo[];
  saldos?: ISaldos,
  member?:any
}