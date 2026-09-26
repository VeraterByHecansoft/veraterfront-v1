// store/asyncThunks/authThunks.ts

import { errorLoginType, succesLoginType, TError } from '@/types/authTypes';
import { createAsyncThunk } from '@reduxjs/toolkit';
import secureStore from '../persistConfig';


/**
 * Al optener un response exitoso de logion.
 */
export const saveSuccessLogin = createAsyncThunk(
  'auth/saveSuccessLogin',
  async (session: succesLoginType) => {
    try {
      if (session) return session;
      const fail: errorLoginType = {
        message: 'Ha ocurrido un error al iniciar sesión',
        title: 'Error al iniciar sesión',
        code: '401',
      }
      return fail
    } catch (error: any) {
      const fail: errorLoginType = {
        message: error?.message || 'Ha ocurrido un error al iniciar sesión',
        title: 'Error al iniciar sesión',
        code: '501',
      }
      return fail
    }
  }
);

/**
 * Al optener un response exitoso de logion.
 */
export const setAuthError = createAsyncThunk(
  'auth/hasError',
  async (error: TError | undefined) => {
    try {
      return error
    } catch (error: any) {
      const fail: TError = {
        type: 'KNOWN',
        message: error.message,
        title: 'KNOWN ERROR',
        code: '501'
      }
      return fail
    }
  }
);


/**
 * Al optener un response exitoso del logout.
 */
export const deleteSuccessLogin = createAsyncThunk(
  'auth/deleteSuccessLogin',
  async () =>  true  
);

export const registerDevice = createAsyncThunk<
  string | undefined,
  string
>(
  'auth/registerDevice',
  async (uuid, { rejectWithValue }) => {
    try {
      const UUID = (uuid && uuid !== 'fail') ? uuid : 'failed'
      return UUID
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);

export const saveIsBiometrics = createAsyncThunk<
  'yes' | 'no',
  boolean
>(
  'auth/saveIsBiometrics',
  async (biometrics, { rejectWithValue }) => {
    try {
      const val = biometrics ? 'yes' : 'no'
      await secureStore.setItem('biometrics', val);
      return val
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);



export const refreshTSTonken = createAsyncThunk<boolean, void>(
  'auth/refreshTSTonken',
  async (_, { rejectWithValue }) => {
    try {
      return true
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error desconocido');
    }
  }
);

