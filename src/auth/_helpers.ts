import { User as Auth0UserModel } from '@auth0/auth0-spa-js';

import { getData, setData } from '@/utils';
import { CvsModel, ModuleAuthItems, type AuthModel } from './_models';
import { AxiosError } from 'axios';

const AUTH_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION
}`;
const DVIS_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-auth-v${
  import.meta.env.VITE_APP_VERSION
}`;
const MODULES_LOCAL_STORAGE_KEY = `${import.meta.env.VITE_APP_NAME}-mod-v${
  import.meta.env.VITE_APP_VERSION
}`;

const getAuth = (): AuthModel | undefined => {
  try {
    const auth = getData(AUTH_LOCAL_STORAGE_KEY) as AuthModel | undefined;

    if (auth) {
      return auth;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const getdevice = (): CvsModel | undefined => {
  try {
    const div = getData(DVIS_LOCAL_STORAGE_KEY) as CvsModel | undefined;

    if (div) {
      return div;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('DVIS LOCAL STORAGE PARSE ERROR', error);
  }
};

const setAuth = (auth: AuthModel | Auth0UserModel|undefined) => {
  setData(AUTH_LOCAL_STORAGE_KEY, auth);
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('AUTH LOCAL STORAGE REMOVE ERROR', error);
  }
};

const setModules = (modules: ModuleAuthItems | undefined )=> {
  try {
    if (modules) {
      setData(MODULES_LOCAL_STORAGE_KEY, modules);
      return modules;
    } else {
      setData(MODULES_LOCAL_STORAGE_KEY, undefined);
      return undefined;
    }
  } catch (error) {
    console.error('MODULES LOCAL STORAGE PARSE ERROR', error);
  }
};

const getModules = (): ModuleAuthItems | undefined => {
  try {
    const modules = getData(MODULES_LOCAL_STORAGE_KEY) as ModuleAuthItems | undefined;

    if (modules) {
      return modules;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('AUTH LOCAL STORAGE PARSE ERROR', error);
  }
};

const removeModules = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(MODULES_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error('MODULES LOCAL STORAGE REMOVE ERROR', error);
  }
};

export function isAxiosError(error: any): error is AxiosError {
  return error?.isAxiosError === true;
}


export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json';
  axios.interceptors.request.use(
    (config: { headers: { Authorization: string } }) => {
      const auth = getAuth();

      if (auth?.access_token) {
        config.headers.Authorization = `Bearer ${auth.access_token}`;
      }

      return config;
    },
    async (err: any) => await Promise.reject(err)
  );


    // Interceptar las respuestas para manejar errores 401
    axios.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;
        if (status === 401 && code === 'ERR_SESSION_ENDED') {
          setAuth(undefined);
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );

}


export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth,setModules,getModules,removeModules , getdevice};
