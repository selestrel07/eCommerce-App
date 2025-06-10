import { Cart } from '@commercetools/platform-sdk';
import { Dispatch, SetStateAction } from 'react';

export interface CartContextType {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  cartItemsCount: number;
  setCartItemsCount: Dispatch<SetStateAction<number>>;
}
