import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AppHeader from './Header';
import { Paths } from '@enums';

// change useNavigate a fake function
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();
const mockSetApiClient = vi.fn();

describe('AppHeader', () => {
  it('cCalls setSignedIn(false) and navigates to the Sign In page (desktop)', () => {
    const mockSetSignedIn = vi.fn();

    vi.mock('react-responsive', () => ({
      useMediaQuery: () => false,
    }));

    render(
      <MemoryRouter initialEntries={['/app']}>
        <AppHeader
          isSignedIn={true}
          setSignedIn={mockSetSignedIn}
          setApiClient={mockSetApiClient}
        />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);

    expect(mockSetSignedIn).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith(Paths.SIGN_IN);
  });
});
