import React, { useState, useMemo } from 'react';
import { CartContext } from '@contexts';
import { Cart } from '@commercetools/platform-sdk';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cart, setCart] = useState<Cart | null>(null);

  const contextValue = useMemo(
    () => ({ cart, setCart, cartItemsCount, setCartItemsCount }),
    [cart, cartItemsCount]
  );

  //here will be logic of add/deleted products and update counter

  return <CartContext.Provider value={contextValue}> {children} </CartContext.Provider>;
};
