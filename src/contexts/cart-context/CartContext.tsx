import React, { createContext } from 'react';
import { CartContextProps } from '../../interfaces/cart/cart';

export const CartContext = createContext<CartContextProps>({
  cartItemsCount: 0,
  setCartItemsCount: (() => null) as unknown as React.Dispatch<React.SetStateAction<number>>,
});
