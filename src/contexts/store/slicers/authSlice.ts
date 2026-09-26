// src/store/authSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { errorLoginType, succesLoginType, TError, UserType } from '@/types/authTypes';
import { deleteSuccessLogin, refreshTSTonken, registerDevice, saveSuccessLogin, setAuthError } from '../asyncThunks/authThunks';
import { DataCoordsType } from '@/hooks';
export interface AuthState {
  tokenValid: boolean;
  expiresAt?: number;
  user: UserType | undefined,
  deviceId: string | undefined,
  coords: DataCoordsType | undefined,
  u?: string | undefined;
  isOnline: boolean,
  loading: boolean;
  error: TError | undefined;
  message: string | undefined;
  status: 'idle' | 'succeeded' | 'loading' | 'failed';
  sessionTimeOut: number,
  isbloked: boolean,
  lastEventOk: number | undefined,
  wssEventMessage?: any | undefined;
}

const initialState: AuthState = {
  tokenValid: true,
  expiresAt: undefined,
  user: undefined,
  deviceId: undefined,
  coords: undefined,
  u: undefined,
  isOnline: false,
  loading: false,
  error: undefined,
  message: undefined,
  status: 'idle',
  sessionTimeOut: 0,
  isbloked: false,
  lastEventOk: undefined,
  wssEventMessage: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCoords: (state, action) => {
      state.coords = (action.payload); // Añadir el mensaje recibido al estado
    },
    setMessage: (state, action) => {
      state.message = (action.payload); // Añadir el mensaje recibido al estado
    },
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    setSessionTimeOut: (state, action) => {
      state.sessionTimeOut = action.payload
    },
    setBloked: (state, action) => {
      state.sessionTimeOut = action.payload
    },
    setLastEventOk: (state, action) => {
      state.lastEventOk = action.payload
    },
    setWssEventMessage: (state, action) => {
      state.wssEventMessage = action.payload
    },
    setUseridt: (state, action) => {
      const idt = action.payload as string
      if (state.user) {
        const user = { ...state.user, idt: `${idt}` };
        state.user = user
      }
    },
    updateUserData: (state, action) => {
      const data = action.payload
      if (state.user) {
        const user = { ...state.user, ...data };
        state.user = user
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerDevice.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerDevice.fulfilled, (state, action) => {
        state.deviceId = action.payload;
        state.loading = false;
        state.error = undefined;
      })
      .addCase(registerDevice.rejected, (state) => {
        state.loading = false;
        state.error = undefined;
        state.error = {
          type: 'RDID',
          message: 'fail BIO',
          title: 'fail BIO',
          code: '501'
        }
      })

      .addCase(refreshTSTonken.fulfilled, (state) => {
        state.tokenValid = false;
        state.expiresAt = undefined
        state.loading = false;
        state.error = undefined;
      })
      .addCase(saveSuccessLogin.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(saveSuccessLogin.fulfilled,
        (state, action: PayloadAction<succesLoginType | errorLoginType>) => {
          const payload = action.payload;
          state.loading = false;
          state.error = undefined;
          if ('user' in payload) {
            state.user = payload.user;
            state.tokenValid = true;
            state.loading = false;
            state.error = undefined;
          } else {
            state.tokenValid = false;
            state.expiresAt = undefined
            state.loading = false;
            state.error = undefined;
            state.error = {
              type: 'LOGIN',
              message: 'message' in payload ? payload?.message : "Known Error",
              title: 'fail login',
              code: '501'
            }
          }
        }
      )
      .addCase(saveSuccessLogin.rejected, (state, action) => {
        state.tokenValid = false;
        state.expiresAt = undefined
        state.loading = false;
        state.error = undefined;
        state.error = {
          type: 'LOGIN',
          message: 'fail login',
          title: 'fail login',
          code: '501'
        }
      })

      .addCase(deleteSuccessLogin.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(deleteSuccessLogin.fulfilled,
        (state) => {
          state.tokenValid = false;
          state.expiresAt = undefined
          state.user = undefined
          state.loading = false;
          state.error = undefined;
        }
      )
      .addCase(deleteSuccessLogin.rejected, (state, action) => {
        state.tokenValid = false;
        state.expiresAt = undefined
        state.user = undefined
        state.loading = false;
        state.error = undefined;
        state.error = {
          type: 'LOGOUT',
          message: 'fail logout',
          title: 'fail logout',
          code: '501'
        }
      })

      .addCase(setAuthError.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(setAuthError.fulfilled,
        (state, action: PayloadAction<TError | undefined>) => {
          const payload = action.payload;
          state.loading = false;
          state.error = payload;
        }
      )
      .addCase(setAuthError.rejected, (state, action) => {
        state.loading = false;
        state.user = undefined
        state.error = {
          type: 'KNOWN_ERR',
          message: 'KNOWN_ERR',
          title: 'KNOWN_ERR',
          code: '501'
        }
      })
  },
});
export const { setCoords, setMessage, setOnlineStatus, setLoading, setSessionTimeOut, setBloked, setLastEventOk, setWssEventMessage, setUseridt, updateUserData } = authSlice.actions;
export default authSlice.reducer;