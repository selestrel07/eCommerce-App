import React, { createContext } from 'react';
import { CartContextType } from '@interfaces';

export const CartContext = createContext<CartContextType>({
  cart: null,
  setCart: () => null,
  cartItemsCount: 0,
  setCartItemsCount: (() => null) as unknown as React.Dispatch<React.SetStateAction<number>>,
  cartTotal: 0,
  setCartTotal: (() => null) as unknown as React.Dispatch<React.SetStateAction<number>>,
});
