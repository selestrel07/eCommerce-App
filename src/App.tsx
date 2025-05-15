import './App.scss';
import AppRoutes from './routes/AppRoutes.tsx';
import { useState } from 'react';
import { Layout } from 'antd';
import AppHeader from './components/Header/Header';

export const App = () => {
  const [isSignedIn, setSignedIn] = useState<boolean>(false);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Layout.Content style={{ marginTop: 64, padding: '24px' }}>
        <AppRoutes isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
      </Layout.Content>
    </Layout>
  );
};
