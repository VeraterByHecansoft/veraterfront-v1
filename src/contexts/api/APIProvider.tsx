/* eslint-disable no-unused-vars */
import axios, { AxiosError, AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState
} from 'react';
import { isAxiosError, type DataResponse } from '@/auth';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { deleteSuccessLogin } from '../store/asyncThunks/authThunks';
import { setLastEventOk } from '../store/slicers/authSlice';
const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials =  true
export interface IError {
  errors: Array<IError>,
}

export interface ValidationFieldError {
  name: string;
  message: string;
  path: string;
}

export interface ValidationFieldErrorProps {
  [key: string]: ValidationFieldError;
};

export interface DatabaseValidationError {
  message: string;
  name: string | null;
  errors: {
    [key: string]: ValidationFieldError;
  };
}

export interface InputProcessResponse {
  response: AxiosResponse<any, any> | AxiosError<any, any>;
  setError?: (error: any) => void;
  setMessage?: (message: any) => void;
  setData?: (data: any) => void;
  timeOut?: number; // <-- ahora es opcional
}

export function idDatabaseValidationError(error: any): error is DatabaseValidationError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof error.errors === 'object' &&
    typeof error.message === 'string' &&
    typeof error.name === 'string'
  );
}

interface APIContextProps {
  get: (endpoint: string, params?: any) => Promise<AxiosResponse<any>> | Promise<AxiosError<any>>;
  post: (endpoint: string, data: any) => Promise<AxiosResponse<any>> | Promise<AxiosError<any>>;
  put: (endpoint: string, data: any) => Promise<AxiosResponse<any>> | Promise<AxiosError<any>>;
  putMultipart: (endpoint: string, formData: FormData) => Promise<AxiosResponse<any>> | Promise<AxiosError<any>>;
  postMultipart: (endpoint: string, formData: FormData) => Promise<AxiosResponse<any>> | Promise<AxiosError<any>>;
  processResponse: ({ response, setError, setMessage, setData, timeOut }: InputProcessResponse) => Promise<any>;
  processResponseDirect: ({ response, timeOut }: InputProcessResponse) => Promise<any>;
}

const apiClient = axios.create({
  baseURL: `${API_URL}`, // ← Tu backend
  withCredentials: true, // ✅ Esto permite enviar cookies en peticiones
});

const APIContext = createContext<APIContextProps | null>(null);

const APIProvider = ({ children }: PropsWithChildren) => {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const pendingRequests = new Set<string>();

  const makeKey = (endpoint: string, data?: any): string => {
    // Ordenar los parámetros para evitar diferencias por orden
    const sorted = typeof data === 'object' ? JSON.stringify(sortObject(data)) : '';
    return `${endpoint}|${sorted}`;
  };

  function sortObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(sortObject);
    return Object.keys(obj).sort().reduce((acc, key) => {
      acc[key] = sortObject(obj[key]);
      return acc;
    }, {} as any);
  }

  function filterRequest(endpoint: string, params: any) {
    const key = makeKey(endpoint, params);
    if (pendingRequests.has(key)) {
      console.warn(`Petición bloqueada: ya está en curso [${key}]`);
      return false
    }
    pendingRequests.add(key);
    return key
  }

  const logout = () => {
    dispatch(deleteSuccessLogin());
  }

  const processResponse = async (response: any) => {
    if (isAxiosError(response)) {
      const rs = response as AxiosError<any>;
      const data = rs.response?.data;
      const error = data?.err;
      if ( error?.message  == 'string' ) {
        toast(error.code || 'Error', {
          description: error.message,
          action: {
            label: 'Ok',
            onClick: () => {
              if (error.code === "ERREOF") logout()
            }
          },
          onAutoClose(toast) {
            if (error.code === "ERREOF") logout()
          },
          duration: 5000
        });
      }
      throw data?.err || data
    } else {
      const rs = response as AxiosResponse<any>;
      return rs?.data?.data ? rs?.data?.data : rs?.data.success ? { success: true } : {};
    }
  };

  const processResponseDirect = async ({ response, timeOut = 500 }: InputProcessResponse) => {
    if (isAxiosError(response)) {
      const rs = response as AxiosError<any>;
      const error = rs.response?.data?.error
      if (idDatabaseValidationError(error)) {
        throw  {
          error: error,
          message: `${error.message}`,
        }
      } else {
        throw  {
          error: error,
          message: `${error.message}`,
        }
      }
    } else {
      const rs = response as AxiosResponse<any>;
      const data = rs?.data?.data ? rs?.data?.data : rs?.data.success ? { success: true } : {};
      return {
        ...data
      }
    }
  };

  const handleErrors = async (res: any): Promise<any> => {
    return await processResponse(res);
  }

  const get = async (endpoint: string, params?: any) => {
    const key = filterRequest(endpoint, params);
    if (!key) return false;
    let _params = (params) ? '?' + new URLSearchParams(params).toString() : "";
    const response = await apiClient.get<DataResponse>(`${endpoint}${_params}`).catch(async function (error) {
      return await handleErrors(error)
    }).finally(() => {
      pendingRequests.delete(key);
    });
    dispatch(setLastEventOk(Date.now()));
    return response?.data;
  };

  const post = async (endpoint: string, data: any) => {
    const key = filterRequest(endpoint, data);
    if (!key) return false
    const response = await apiClient.post<DataResponse>(`${endpoint}`, data).catch(async function (error) {
      return await handleErrors(error)
    }).finally(() => {
      pendingRequests.delete(key);
    });
    dispatch(setLastEventOk(Date.now()));
    return response?.data;
  };

  const put = async (endpoint: string, data: any) => {
    const key = filterRequest(endpoint, data);
    if (!key) return false;
    const response = await apiClient.put<DataResponse>(`${endpoint}`, data).catch(async function (error) {
      return await handleErrors(error)
    }).finally(() => {
      pendingRequests.delete(key);
    });
    dispatch(setLastEventOk(Date.now()));
    return response?.data;
  };

  const putMultipart = async (endpoint: string, formData: FormData) => {
    const key = filterRequest(endpoint, formData);
    if (!key) return false;
    const response = await apiClient.put<DataResponse>(`${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(async function (error) {
      return await handleErrors(error)
    }).finally(() => {
      pendingRequests.delete(key);
    });
    dispatch(setLastEventOk(Date.now()));
    return response?.data;
  };
  
  const postMultipart = async (endpoint: string, formData: FormData) => {
    const key = filterRequest(endpoint, formData);
    if (!key) return false;
    const response = await apiClient.post<DataResponse>(`${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).catch(async function (error) {
      return await handleErrors(error);
    }).finally(() => {
      pendingRequests.delete(key);
    });
    dispatch(setLastEventOk(Date.now()));
    return response?.data;
  };

  return (
    <APIContext.Provider
      value={{
        get,
        post,
        put,
        putMultipart,
        postMultipart,
        processResponse,
        processResponseDirect
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export { APIContext, APIProvider };
