import './App.scss';
import AppRoutes from './routes/AppRoutes.tsx';
import { Layout } from 'antd';
import AppHeader from './components/Header/Header';
import { useEffect, useState } from 'react';
import { testAnonymousSession } from './utils/testAnonym.ts';

export const App = () => {
  const [isSignedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    void testAnonymousSession(); // TODO: remove it later
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader isSignedIn={isSignedIn} />
      <Layout.Content style={{ marginTop: 64, padding: '24px' }}>
        <AppRoutes isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
      </Layout.Content>
    </Layout>
  );
};
