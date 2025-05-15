import './App.scss';
import AppRoutes from './routes/AppRoutes.tsx';
import { useEffect, useState } from 'react';
import { testAnonymousSession } from './utils/testAnonym.ts';

export const App = () => {
  const [isSignedIn, setSignedIn] = useState<boolean>(false);

  useEffect(() => {
    void testAnonymousSession(); // TODO: remove it later
  }, []);

  return (
    <>
      <AppRoutes isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
    </>
  );
};
