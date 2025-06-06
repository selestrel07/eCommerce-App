import { Cart } from '@commercetools/platform-sdk';

export interface CartContextType {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
}
