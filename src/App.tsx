import './App.scss';
import AppRoutes from './routes/AppRoutes.tsx';
import { Layout } from 'antd';
import AppHeader from './components/Header/Header';
import { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import {
  deleteCustomerToken,
  loadCustomerToken,
  saveCustomerToken,
} from './services/storage/session-storage.service.ts';
import { Client } from '@commercetools/sdk-client-v2';
import { createAnonymousClient, createRefreshTokenClient } from './services/clientBuilder.ts';
import { getAnonymousId } from './services/authService.ts';
import { tokenCache } from './services/storage/storage.service.ts';
import { isTokenStore } from './types/token-store/token-store.ts';

export const App = () => {
  const token = loadCustomerToken();
  const [isSignedIn, setSignedIn] = useState<boolean>(token !== null);
  let defaultClient: Client = createAnonymousClient(getAnonymousId());
  if (token) {
    const tokenStore: unknown = JSON.parse(token);
    if (isTokenStore(tokenStore)) {
      tokenCache.set(tokenStore);
      defaultClient = createRefreshTokenClient(tokenCache);
      deleteCustomerToken();
    }
  }

  const [client, setClient] = useState<Client>(defaultClient);
  globalThis.addEventListener('beforeunload', () => {
    if (tokenCache.get().token) {
      saveCustomerToken();
    }
  });

  return (
    <Layout>
      <AppHeader isSignedIn={isSignedIn} />
      <Layout.Content>
        <AppRoutes
          isSignedIn={isSignedIn}
          setSignedIn={setSignedIn}
          apiClient={client}
          setApiClient={setClient}
        />
      </Layout.Content>
    </Layout>
  );
};
