import { Cart } from '@commercetools/platform-sdk';
import { SetStateAction, Dispatch } from 'react';

export interface CartContextType {
  cart: Cart | null;
  setCart: Dispatch<SetStateAction<Cart | null>>;
  cartItemsCount: number;
  setCartItemsCount: Dispatch<SetStateAction<number>>;
  cartTotal: number;
  setCartTotal: Dispatch<SetStateAction<number>>;
}
