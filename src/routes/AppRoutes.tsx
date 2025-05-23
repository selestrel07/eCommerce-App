import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp/SignUp.tsx';
import SignIn from '../pages/SignIn/SignIn.tsx';
import Home from '../pages/Home/Home.tsx';
import NotFound from '../pages/NotFound/NotFound.tsx';
import { ReactElement } from 'react';
import { Paths } from '../enums/paths/paths.ts';
import { Client } from '@commercetools/sdk-client-v2';
import Profile from '../pages/Profile/Profile.tsx';

export default function AppRoutes({
  isSignedIn,
  setSignedIn,
  apiClient,
  setApiClient,
  openNotification,
}: {
  isSignedIn: boolean;
  setSignedIn: (value: boolean) => void;
  apiClient: Client;
  setApiClient: (client: Client) => void;
  openNotification: () => void;
}): ReactElement {
  return (
    <Routes>
      <Route path={Paths.EMPTY} element={<Navigate to={Paths.MAIN} replace />} />
      <Route path={Paths.ANY} element={<Navigate to={Paths.CATALOG} replace />} />
      <Route
        path={Paths.SIGN_UP}
        element={
          isSignedIn ? (
            <Navigate to={Paths.MAIN} replace />
          ) : (
            <SignUp
              setSignedIn={setSignedIn}
              apiClient={apiClient}
              setApiClient={setApiClient}
              openNotification={openNotification}
            />
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
      <Route path={Paths.MAIN} element={<Home apiClient={apiClient} />} />
      <Route
        path={Paths.PROFILE}
        element={isSignedIn ? <Profile /> : <Navigate to={Paths.SIGN_IN} replace />}
      />
      <Route path={Paths.ANY} element={<NotFound />} />
    </Routes>
  );
}
