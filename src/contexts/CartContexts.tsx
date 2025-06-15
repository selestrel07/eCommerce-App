import { createContext } from 'react';
import { CartContextType } from '@interfaces';

export const CartContext = createContext<CartContextType | null>(null);
