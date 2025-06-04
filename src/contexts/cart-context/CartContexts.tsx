import React, { useState, useMemo } from 'react';
import { CartContext } from './CartContext';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const contextValue = useMemo(() => ({ cartItemsCount, setCartItemsCount }), [cartItemsCount]);

  //here will be logic of add/deleted products and update counter

  return <CartContext.Provider value={contextValue}> {children} </CartContext.Provider>;
};
