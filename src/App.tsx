import './App.scss';
import AppRoutes from './routes/AppRoutes.tsx';
import { Layout } from 'antd';
import AppHeader from './components/Header/Header';
import { useEffect, useState } from 'react';
import { testAnonymousSession } from './utils/testAnonym.ts';
import '@ant-design/v5-patch-for-react-19';

export const App = () => {
  const [isSignedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    void testAnonymousSession(); // TODO: remove it later
  }, []);

  return (
    <Layout>
      <AppHeader isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
      <Layout.Content>
        <AppRoutes isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
      </Layout.Content>
    </Layout>
  );
};
