import { describe, expect, it } from 'vitest';
import AppRoutes from './AppRoutes.tsx';
import { render } from '@testing-library/react';
import { Paths } from '../enums/paths/paths.ts';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const fakeSetSignedInFunction = (value: boolean) => console.log(value);

describe('App Routes Tests', () => {
  it('Should redirect authorized user from the Sign in page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_IN);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes isSignedIn={true} setSignedIn={fakeSetSignedInFunction} />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.MAIN);
  });

  it('Should redirect authorized user from the Sign up page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_UP);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes isSignedIn={true} setSignedIn={fakeSetSignedInFunction} />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.MAIN);
  });

  it('Should not redirect non-authorized user the Sign in page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_IN);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes isSignedIn={false} setSignedIn={fakeSetSignedInFunction} />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.SIGN_IN);
  });

  it('Should not redirect non-authorized user the Sign up page to the Main page', () => {
    const history = createMemoryHistory();
    history.push(Paths.SIGN_UP);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes isSignedIn={false} setSignedIn={fakeSetSignedInFunction} />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.SIGN_UP);
  });

  it('Should redirect user to the main page if no pathname is provided', () => {
    const history = createMemoryHistory();
    history.push(Paths.EMPTY);
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes isSignedIn={false} setSignedIn={fakeSetSignedInFunction} />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.MAIN);
  });

  it('Should redirect user to the error page if unknown pathname was provided', () => {
    const history = createMemoryHistory();
    history.push('/some-unknow-pathname');
    render(
      <Router location={history.location} navigator={history}>
        <AppRoutes isSignedIn={false} setSignedIn={fakeSetSignedInFunction} />
      </Router>
    );

    expect(history.location.pathname).toBe(Paths.NOT_FOUND);
  });
});
