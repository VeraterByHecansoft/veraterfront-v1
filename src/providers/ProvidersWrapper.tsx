import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { APIProvider } from '@/contexts/api/APIProvider';
import { SocketProvider } from '@/contexts/socket/SocketProvider';
import {
  LayoutProvider,
  LoadersProvider,
  MenusProvider,
  SettingsProvider,
  TranslationProvider
} from '@/providers';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store, { persistor } from '@/contexts/store';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
const queryClient = new QueryClient();

const ProvidersWrapper = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <APIProvider>
            
              <AuthProvider>
                <SettingsProvider>
                  <TranslationProvider>
                    <HelmetProvider>
                      <LayoutProvider>
                        <LoadersProvider>
                          <MenusProvider>{children}</MenusProvider>
                        </LoadersProvider>
                      </LayoutProvider>
                    </HelmetProvider>
                  </TranslationProvider>
                </SettingsProvider>
              </AuthProvider>
          </APIProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider >
  );
};

export { ProvidersWrapper };
