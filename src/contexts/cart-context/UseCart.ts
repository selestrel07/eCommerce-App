import { use } from 'react';
import { CartContext } from './CartContext';

export const useCart = () => use(CartContext);
