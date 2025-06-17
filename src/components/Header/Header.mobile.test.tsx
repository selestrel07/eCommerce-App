import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AppHeader from './Header';
import { Paths } from '@enums';

const mockNavigate = vi.fn();
const mockSetApiClient = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-responsive', () => ({
  useMediaQuery: () => true,
}));

describe('AppHeader (mobile)', () => {
  it('Calls setSignedIn(false) and navigates to the Sign In page from drawer menu', async () => {
    const mockSetSignedIn = vi.fn();

    render(
      <MemoryRouter initialEntries={['/app']}>
        <AppHeader
          isSignedIn={true}
          setSignedIn={mockSetSignedIn}
          setApiClient={mockSetApiClient}
        />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);

    const logoutItem = await screen.findByText('Logout');

    fireEvent.click(logoutItem);

    await waitFor(() => {
      expect(mockSetSignedIn).toHaveBeenCalledWith(false);
      expect(mockNavigate).toHaveBeenCalledWith(Paths.SIGN_IN);
    });
  });
});
