import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // ✅ para web (localStorage)

import * as createEncryptor from 'redux-persist-transform-encrypt';

const encryptor = createEncryptor.encryptTransform({
  secretKey: import.meta.env.VITE_SECRET_KEY || 'claveFallbackInsegura',
  onError: function (error) {
    console.error('Encriptación falló:', error);
  },
});

import appReducer from './slicers/appSlice';
import authReducer from './slicers/authSlice';

const version = 1; // incremento si cambias la clave

const appPersistConfig = {
  key: `app_v${version}`,
  storage,
  whitelist: [
    'dataResponse',
  ],
  transforms: [encryptor],
};

const authPersistConfig = {
  key: `auth_v${version}`,
  storage,
  whitelist: [
    'sessionId',
    'user',
    'loggedIn',
    'ladUserName',
    'deviceId',
    'u',
  ],
  transforms: [encryptor],
};

const store = configureStore({
  reducer: {
  auth: persistReducer(authPersistConfig, authReducer),
  app: persistReducer(appPersistConfig, appReducer),
    // Añade otros reducers aquí si los tienes
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export const getStateFomOutside = () => {
  const state = store.getState();
  return state
};

// Tipado para usar en hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;





