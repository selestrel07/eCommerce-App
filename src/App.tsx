import './App.scss';
import AppRoutes from './routes/AppRoutes.tsx';
import { Layout, notification } from 'antd';
import AppHeader from './components/Header/Header';
import { useState } from 'react';
import '@ant-design/v5-patch-for-react-19';
import { deleteCustomerToken, loadCustomerToken, saveCustomerToken } from '@services';
import { Client } from '@commercetools/sdk-client-v2';
import {
  createAnonymousClient,
  createRefreshTokenClient,
  getAnonymousId,
  tokenCache,
} from '@services';
import { isTokenStore } from '@types';
import { Context } from 'react-responsive';
import { CartProvider } from './contexts/cart-context/CartContexts.tsx';

export const App = () => {
  const token = loadCustomerToken();
  const [isSignedIn, setSignedIn] = useState<boolean>(token !== null);
  let defaultClient: Client = createAnonymousClient(getAnonymousId());
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (message: string, description: string) => {
    api.info({
      message,
      description: <Context.Consumer>{() => description}</Context.Consumer>,
      placement: 'bottomRight',
      showProgress: true,
      duration: 2,
    });
  };
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
    <CartProvider>
      <Layout>
        <AppHeader isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
        {contextHolder}
        <Layout.Content>
          <AppRoutes
            isSignedIn={isSignedIn}
            setSignedIn={setSignedIn}
            apiClient={client}
            setApiClient={setClient}
            openNotification={openNotification}
          />
        </Layout.Content>
      </Layout>
    </CartProvider>
  );
};
