// src/store/asyncThunks/apiThunks.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { sendRequest } from '@/contexts/socket/sendRequest';
import secureStore from '../persistConfig';
import { TError } from '@/types/authTypes';
import { useAPIContext } from '@/auth/useAPIContext';
import { ISaldos } from '@/partials/heros/types';
export interface TErrorResponse {
  error: string;
  message: string;
}
export interface TSuccessResponse {
  action: string;
  key: string;
  data?: any;
  result?: any;
}

export type requestDataType = {
  type: string;
  params: any
}

export const loadSaldosAsync = createAsyncThunk<
  ISaldos,
  any,
  { rejectValue: TError }>
  (
    'response/loadSaldosAsync',
    async (get, { rejectWithValue }) => {
      try {
        const response = await get('/profile/saldos') as any
        const saldos = response?.data as ISaldos
        if (!saldos) return rejectWithValue({
          type: 'APIERR',
          message: 'No Hay Saldos',
          title: 'Response ERR',
          code: 'APIERR'
        });
        return saldos
      } catch (error: any) {
        return rejectWithValue({
          type: 'APIERR',
          message: error?.message,
          title: 'Response ERR',
          code: 'APIERR'
        });
      }
    }
  );

export const setDataResponse = createAsyncThunk<
  TSuccessResponse,
  TSuccessResponse,
  { rejectValue: TError }>
  (
    'response/setDataResponse',
    async (response: TSuccessResponse, { rejectWithValue }) => {
      try {
        return response;
      } catch (error: any) {
        // Si ocurre un error, rechazamos con el valor personalizado.
        return rejectWithValue({
          type: 'APIERR',
          message: error?.message,
          title: 'Response ERR',
          code: 'APIERR'
        });
      }
    }
  );

export const resetDataResponse = createAsyncThunk<
  string,
  string,
  { rejectValue: TError }>
  (
    'response/resetDataResponse',
    async (key: string, { rejectWithValue }) => {
      try {
        return key;
      } catch (error: any) {
        // Si ocurre un error, rechazamos con el valor personalizado.
        return rejectWithValue({
          type: 'APIERR',
          message: error?.message,
          title: 'Response ERR',
          code: 'APIERR'
        });
      }
    }
  );

export const loadConfigs = createAsyncThunk<{
  lastUser: string | null,
  biometrics: 'yes' | 'no',
  bom: 'yes' | 'no',
}, void
>(
  'app/loadConfigs',
  async (_, { rejectWithValue }) => {
    try {
      const lastUserRaw = secureStore.getItem('lastUser');
      const biometricsRaw = secureStore.getItem('biometrics');
      const bomRaw = secureStore.getItem('bom');
      return {
        lastUser: biometricsRaw,
        biometrics: biometricsRaw === 'yes' ? 'yes' : 'no',
        bom: bomRaw === 'yes' ? 'yes' : 'no',
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);