// import { ReactElement } from 'react';

// export default function SignIn({
//   setSignedIn,
// }: {
//   setSignedIn: (value: boolean) => void;
// }): ReactElement {
//   setSignedIn(false); //TODO: remove after the page implementation
//   return <></>;
// }

import { useState, FormEvent } from 'react';
import { loginCustomer } from '../../services/authService';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const result = await loginCustomer(email, password);
      console.log('Logged in:', result);
      setError(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    }
  }

  return (
    <form onSubmit={(e) => void handleLogin(e)}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      <button type="submit">Sign in</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
