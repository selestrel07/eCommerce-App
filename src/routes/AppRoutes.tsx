/* eslint-disable max-lines-per-function */
import { Navigate, Route, Routes } from 'react-router-dom';
import SignUp from '../pages/SignUp/SignUp.tsx';
import SignIn from '../pages/SignIn/SignIn.tsx';
import Home from '../pages/Home/Home.tsx';
import NotFound from '../pages/NotFound/NotFound.tsx';
import { ReactElement, useEffect, use } from 'react';
import { Paths } from '@enums';
import { Client } from '@commercetools/sdk-client-v2';
import ProductDetails from '../pages/ProductDetails/ProductDetails.tsx';
import Profile from '../pages/Profile/Profile.tsx';
import Catalog from '../pages/Catalog/Catalog.tsx';
import About from '../pages/About/About.tsx';
import CartPage from '../pages/CartPage/CartPage.tsx';
import { loadCart } from '@services';
import { CartContext } from '@contexts';

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
  const { cart, setCart, setCartItemsCount, setCartTotal } = use(CartContext);

  useEffect(() => {
    loadCart(apiClient)
      .then((fetchedCart) => {
        setCart(fetchedCart);
      })
      .catch((err) => {
        console.error('Failed to load cart:', err);
      });
  }, [apiClient, setCart]);

  useEffect(() => {
    if (!cart) {
      setCartItemsCount(0);
      setCartTotal(0);
      return;
    }

    const count = cart?.lineItems.reduce((sum, li) => sum + li.quantity, 0);
    setCartItemsCount(count);

    const total =
      cart?.totalPrice?.centAmount ??
      cart?.lineItems.reduce((acc, li) => {
        const lineTotal = li.totalPrice?.centAmount ?? li.price.value.centAmount * li.quantity;
        return acc + lineTotal;
      }, 0);
    setCartTotal(total);
  }, [cart, setCartItemsCount, setCartTotal]);

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
      <Route path={Paths.ABOUT_US} element={<About />} />
      <Route path={Paths.ANY} element={<NotFound />} />
      <Route path={Paths.CART} element={<CartPage client={apiClient} />} />
    </Routes>
  );
}
