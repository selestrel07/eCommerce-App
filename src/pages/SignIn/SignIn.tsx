import { ReactElement } from 'react';
import useSignInLogic from '../../hooks/useSignInLogic';
import { SignInProps } from '../../interfaces/interfaces';

export default function SignIn({ setSignedIn }: SignInProps): ReactElement {
  const { fields, error, handleChange, handleSubmit } = useSignInLogic(setSignedIn);
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={fields.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        value={fields.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
