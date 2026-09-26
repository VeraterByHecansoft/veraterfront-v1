import {
  createContext,
  ReactNode,
  useContext,
} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setSessionTimeOut } from '../store/slicers/authSlice';
import {
  DataLogonType,
  TError,
  UserType
} from '@/types/authTypes';

import { useAPIContext } from '@/auth/useAPIContext';
import { deleteSuccessLogin, saveSuccessLogin } from '../store/asyncThunks/authThunks';

type AuthContextType = {
  user: UserType | undefined;
  login: (userData: DataLogonType) => Promise<any>;
  logout: () => Promise<any>;
  verify: () => Promise<any>;
  requestPasswordResetLink: (email: string) => Promise<any>;
  changePassword: (email: string, token: string, newPassword: string, confirmPassword: string) => Promise<any>;
  validateEmail: (email: string, token: string,) => Promise<any>;
  loading: boolean;
  loggedIn: boolean;
  isOnline: boolean;
  error: TError | undefined;
};

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  login: async () => { },
  logout: async () => { },
  verify: async () => { },
  requestPasswordResetLink: async (email: string) => { },
  changePassword: async (email: string, token: string, newPassword: string, confirmPassword: string) => { },
  validateEmail: async (email: string, token: string,) => { },
  loading: true,
  loggedIn: false,
  isOnline: false,
  error: undefined,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { post, get } = useAPIContext()
  const {
    user,
    authLoading,
    loggedIn,
    isOnline,
    error } = useSelector((state: RootState) => state.auth);

  // Funciones del contexto
  const login = async (userData: DataLogonType): Promise<any> => {
    post('/auth/login', userData).then((data: any) => {
      if (data.user) {
        dispatch(saveSuccessLogin(data));
        dispatch(setSessionTimeOut(0))
        return ('success')
      } else {
        throw Error('Autenticación fallida')
      }
    }).catch(err => {
      alert(err.message)
      throw Error(err.message)
    })
  };

  const logout = async (): Promise<any> => {
    get('/auth/logout').then((data) => {
      dispatch(deleteSuccessLogin());
      dispatch(setSessionTimeOut(0))
    }).catch(err => {
      dispatch(deleteSuccessLogin())
      dispatch(setSessionTimeOut(0))
    })
  };

  const requestPasswordResetLink = async (email: string): Promise<any> => {
    await post('/auth/reset-password', { email }).then((response:any) => {
        return response.data
    }).catch(err => {
      throw {...err}
    })
  }

  const changePassword = async (email: string, token: string, newPassword: string, confirmPassword: string): Promise<any> => {
    await post('/auth/validate-change', { email, token, newPassword, confirmPassword }).then((response:any) => {
       return response.data
    }).catch(err => {
      throw Error(err)
    })
  }
  
  const validateEmail = async (email: string, token: string): Promise<any> => {
    console.log('Verificando...')
    await post('/auth/validate-email', { email, token }).then((response:any) => {
      return response.data
    }).catch(err => {
      throw Error(err)
    })
  }

  const verify = async (): Promise<any> => {
    await get('/auth/session').then((data) => {
    }).catch(err => {
      throw Error(err.message)
    })
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        isOnline,
        loading: authLoading,
        error,
        login,
        logout,
        verify,
        requestPasswordResetLink,
        changePassword,
        validateEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};