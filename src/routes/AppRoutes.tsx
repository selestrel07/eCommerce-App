/* eslint-disable max-lines-per-function */
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp/SignUp.tsx';
import SignIn from '../pages/SignIn/SignIn.tsx';
import Home from '../pages/Home/Home.tsx';
import NotFound from '../pages/NotFound/NotFound.tsx';
import { ReactElement, useEffect } from 'react';
import { Paths } from '@enums';
import { Client } from '@commercetools/sdk-client-v2';
import ProductDetails from '../pages/ProductDetails/ProductDetails.tsx';
import Profile from '../pages/Profile/Profile.tsx';
import Catalog from '../pages/Catalog/Catalog.tsx';
import About from '../pages/About/About.tsx';
import CartPage from '../pages/CartPage/CartPage.tsx';
import { useCart } from '@contexts';
import { loadCart } from '@services';

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
  openNotification: (message: string, description: string) => void;
}): ReactElement {
  const { cart, setCart, setCartItemsCount } = useCart();

  useEffect(() => {
    loadCart(apiClient)
      .then((response) => {
        setCart(response);
      })
      .catch((error) => {
        console.error('Failed to load cart on app start', error);
      });
  }, [apiClient]);

  useEffect(() => {
    if (!cart) {
      setCartItemsCount(0);
      return;
    }

    const totalQuantity = cart.lineItems.reduce((acc, lineItem) => acc + lineItem.quantity, 0);

    setCartItemsCount(totalQuantity);
  }, [cart]);

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
      <Route path={Paths.PRODUCT_DETAILS} element={<ProductDetails apiClient={apiClient} />} />
      <Route path={Paths.CATALOG} element={<Catalog apiClient={apiClient} />} />
      <Route path={Paths.ABOUT_US} element={<About />} />
      <Route
        path={Paths.PROFILE}
        element={
          isSignedIn ? (
            <Profile
              client={apiClient}
              setApiClient={setApiClient}
              openNotification={openNotification}
            />
          ) : (
            <Navigate to={Paths.SIGN_IN} replace />
          )
        }
      />
      <Route path={Paths.CART} element={<CartPage client={apiClient} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
