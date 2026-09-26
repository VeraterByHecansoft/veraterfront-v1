// src/store/authSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadConfigs, loadSaldosAsync, resetDataResponse, setDataResponse, TSuccessResponse } from '../asyncThunks/apiThunks';
import { TError } from '@/types/authTypes';
import { ISaldos } from '@/partials/heros/types';
import { TBanco } from '@rute/types';

interface TDataResponse {
  [key: string]: unknown; // permite cualquier otra propiedad de cualquier tipo
}
export interface AppState {
  loading: boolean;
  error: TError | undefined;
  message: string | undefined;
  status: 'idle' | 'succeeded' | 'loading' | 'failed';
  dataResponse: TDataResponse,
  biometrics: 'no' | 'yes',
  bom: 'no' | 'yes',
  saldos?: ISaldos,
  bancos?: TBanco[]
}

const initialState: AppState = {
  loading: false,
  error: undefined,
  message: undefined,
  status: 'idle',
  dataResponse: {},
  biometrics: 'no',
  bom: 'no',
  saldos: undefined,
  bancos: undefined
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setGobalMessage: (state, action) => {
      state.message = (action.payload); // Añadir el mensaje recibido al estado
    },
    setGblobalError: (state, action: PayloadAction<TError | undefined>) => {
      state.error = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setOpcsBancos: (state, action) => {
      state.bancos = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSaldosAsync.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadSaldosAsync.fulfilled, (state, action: PayloadAction<ISaldos>) => {
        const saldos = action.payload;
        state.saldos = saldos
        state.loading = false;
        state.error = undefined;
      })
      .addCase(loadSaldosAsync.rejected, (state, action: PayloadAction<TError | undefined>) => {
        state.loading = false;
        state.error = action.payload
      })

      .addCase(setDataResponse.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(setDataResponse.fulfilled, (state, action: PayloadAction<TSuccessResponse>) => {
        const data = action.payload;
        state.dataResponse = { ...state.dataResponse, [data.key]: data.data };
        state.loading = false;
        state.error = undefined;
      })
      .addCase(setDataResponse.rejected, (state, action: PayloadAction<TError | undefined>) => {
        state.loading = false;
        state.error = action.payload
      })

      .addCase(resetDataResponse.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(resetDataResponse.fulfilled, (state, action: PayloadAction<string>) => {
        const key = action.payload;
        if (state.dataResponse && key in state.dataResponse) {
          delete state.dataResponse[key];
        }
        state.loading = false;
        state.error = undefined;
      })
      .addCase(resetDataResponse.rejected, (state, action: PayloadAction<TError | undefined>) => {
        state.loading = false;
        state.error = action.payload
      })


      .addCase(loadConfigs.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadConfigs.fulfilled, (state, action) => {
        state.biometrics = action.payload.biometrics;
        state.bom = action.payload.bom;
        state.loading = false;
        state.error = undefined;
      })
      .addCase(loadConfigs.rejected, (state) => {
        state.loading = false;
        state.biometrics = 'no';
        state.error = {
          type: 'BIOM',
          message: 'fail BIO',
          title: 'fail BIO',
          code: '501'
        }
      })
  },
});
export const { setGobalMessage, setGblobalError, setLoading,setOpcsBancos } = appSlice.actions;
export default appSlice.reducer;