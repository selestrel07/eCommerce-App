import { createContext, SetStateAction, Dispatch } from 'react';
import { CartContextType } from '@interfaces';

export const CartContext = createContext<CartContextType>({
  cart: null,
  setCart: () => null,
  cartItemsCount: 0,
  setCartItemsCount: (() => null) as unknown as Dispatch<SetStateAction<number>>,
});
