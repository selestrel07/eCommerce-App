import React, { createContext } from 'react';
import { CartContextProps } from '@interfaces';

export const CartContext = createContext<CartContextProps>({
  cartItemsCount: 0,
  setCartItemsCount: (() => null) as unknown as React.Dispatch<React.SetStateAction<number>>,
});
