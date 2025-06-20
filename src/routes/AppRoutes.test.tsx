import { describe, expect, it, vi } from 'vitest';
import AppRoutes from './AppRoutes.tsx';
import { render } from '@testing-library/react';
import { Paths } from '@enums';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createAnonymousClient, getAnonymousId } from '@services';

const mockSetSignedIn = vi.fn();
const mockSetClient = vi.fn();
const mockOpenNotification = vi.fn();
const client = createAnonymousClient(getAnonymousId());

describe('App Routes Tests authorized user', () => {
  it('Should redirect authorized user from the Sign in page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_IN);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes
          isSignedIn={true}
          setSignedIn={mockSetSignedIn}
          apiClient={client}
          setApiClient={mockSetClient}
          openNotification={mockOpenNotification}
        />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.MAIN);
  });

  it('Should redirect authorized user from the Sign up page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_UP);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes
          isSignedIn={true}
          setSignedIn={mockSetSignedIn}
          apiClient={client}
          setApiClient={mockSetClient}
          openNotification={mockOpenNotification}
        />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.MAIN);
  });
});

describe('App Routes Tests non-authorized user', () => {
  it('Should not redirect non-authorized user the Sign in page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_IN);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes
          isSignedIn={false}
          setSignedIn={mockSetSignedIn}
          apiClient={client}
          setApiClient={mockSetClient}
          openNotification={mockOpenNotification}
        />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.SIGN_IN);
  });

  it('Should not redirect non-authorized user the Sign up page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_UP);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes
          isSignedIn={false}
          setSignedIn={mockSetSignedIn}
          apiClient={client}
          setApiClient={mockSetClient}
          openNotification={mockOpenNotification}
        />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.SIGN_UP);
  });
});

describe('App Routes Tests empty or unknown pathname', () => {
  it('Should redirect user to the main page if no pathname is provided', () => {
    const history = createMemoryHistory();
    history.push(Paths.EMPTY);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes
          isSignedIn={false}
          setSignedIn={mockSetSignedIn}
          apiClient={client}
          setApiClient={mockSetClient}
          openNotification={mockOpenNotification}
        />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.MAIN);
  });
});
