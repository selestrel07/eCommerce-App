import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp/SignUp.tsx';
import SignIn from '../pages/SignIn/SignIn.tsx';
import Home from '../pages/Home/Home.tsx';
import NotFound from '../pages/NotFound/NotFound.tsx';
import { ReactElement } from 'react';
import { Paths } from '../enums/paths/paths.ts';
import { Client } from '@commercetools/sdk-client-v2';

export default function AppRoutes({
  isSignedIn,
  setSignedIn,
  apiClient,
  setApiClient,
}: {
  isSignedIn: boolean;
  setSignedIn: (value: boolean) => void;
  apiClient: Client;
  setApiClient: (client: Client) => void;
}): ReactElement {
  return (
    <Routes>
      <Route path={Paths.EMPTY} element={<Navigate to={Paths.MAIN} replace />} />
      <Route
        path={Paths.SIGN_UP}
        element={
          isSignedIn ? (
            <Navigate to={Paths.MAIN} replace />
          ) : (
            <SignUp setSignedIn={setSignedIn} apiClient={apiClient} setApiClient={setApiClient} />
          )
        }
      />
      <Route
        path={Paths.SIGN_IN}
        element={
          isSignedIn ? (
            <Navigate to={Paths.MAIN} replace />
          ) : (
            <SignIn setSignedIn={setSignedIn} apiClient={apiClient} setApiClient={setApiClient} />
          )
        }
      />
      <Route path={Paths.MAIN} element={<Home />} />
      <Route path={Paths.ANY} element={<NotFound />} />
    </Routes>
  );
}
