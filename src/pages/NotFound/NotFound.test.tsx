import { describe, expect, it } from 'vitest';
import { createMemoryHistory } from 'history';
import { render, fireEvent, screen } from '@testing-library/react';
import { Router } from 'react-router-dom';
import NotFound from './NotFound.tsx';
import { Paths } from '../../enums/paths/paths.ts';

describe('Tests for the 404 (not found) page', () => {
  it('Should open the Main page after the button click', () => {
    const history = createMemoryHistory();
    history.push(Paths.NOT_FOUND);
    render(
      <Router location={history.location} navigator={history}>
        <NotFound />
      </Router>
    );

    fireEvent.click(screen.getByText(/go to the main page/i));

    expect(history.location.pathname).toBe(Paths.MAIN);
  });
});
