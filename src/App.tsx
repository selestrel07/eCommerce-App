import './App.scss';
import AppRoutes from './routes/AppRoutes.tsx';
import { useState } from 'react';

export const App = () => {
  const [isSignedIn, setSignedIn] = useState<boolean>(false);
  return (
    <>
      <AppRoutes isSignedIn={isSignedIn} setSignedIn={setSignedIn} />
    </>
  );
};
