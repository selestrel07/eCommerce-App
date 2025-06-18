import React, { useState, useMemo } from 'react';
import { CartContext } from '@contexts';
import { Cart } from '@commercetools/platform-sdk';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartTotal, setCartTotal] = useState(0);

  const contextValue = useMemo(
    () => ({ cart, setCart, cartItemsCount, setCartItemsCount, cartTotal, setCartTotal }),
    [cart, cartItemsCount, cartTotal]
  );

  return <CartContext.Provider value={contextValue}> {children} </CartContext.Provider>;
};
