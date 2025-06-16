import { describe, it, expect } from 'vitest';
import { screen, render } from '@testing-library/react';
import { CartProvider } from '@contexts';
import { Cart } from '@components';
import { BrowserRouter, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Paths } from '@enums';

describe('Cart component tests', () => {
  it('Should contain message if cart is empty', async () => {
    render(
      <BrowserRouter>
        <CartProvider>
          <Cart />
        </CartProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText('Catalog')).toBeInTheDocument();
  });

  it('Should redirect to the Catalog page after the Catalog link click', async () => {
    const history = createMemoryHistory();
    history.push(Paths.CART);
    render(
      <Router location={history.location} navigator={history}>
        <CartProvider>
          <Cart />
        </CartProvider>
      </Router>
    );

    const catalogLink = await screen.findByText('Catalog');
    catalogLink.click();

    expect(history.location.pathname).toBe(Paths.CATALOG);
  });
});
