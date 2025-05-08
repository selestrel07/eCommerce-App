import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp/SignUp.tsx';
import SignIn from '../pages/SignIn/SignIn.tsx';
import Home from '../pages/Home/Home.tsx';
import NotFound from '../pages/NotFound/NotFound.tsx';
import { ReactElement } from 'react';
import { Paths } from '../enums/paths/paths.ts';

export default function AppRoutes({
  isSignedIn,
  setSignedIn,
}: {
  isSignedIn: boolean;
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  return (
    <Routes>
      <Route path={Paths.EMPTY} element={<Navigate to={Paths.MAIN} replace />} />
      <Route
        path={Paths.SIGN_UP}
        element={
          isSignedIn ? <Navigate to={Paths.MAIN} replace /> : <SignUp setSignedIn={setSignedIn} />
        }
      />
      <Route
        path={Paths.SIGN_IN}
        element={
          isSignedIn ? <Navigate to={Paths.MAIN} replace /> : <SignIn setSignedIn={setSignedIn} />
        }
      />
      <Route path={Paths.MAIN} element={<Home />} />
      <Route path={Paths.NOT_FOUND} element={<NotFound />} />
      <Route path={Paths.ANY} element={<Navigate to={Paths.NOT_FOUND} replace />} />
    </Routes>
  );
}
