import { ReactElement, useState } from 'react';
import { Input } from '../../components/Input/Input';
import { validatePassword, validateEmail } from '../../utils/validation';

export default function SignIn({
  setSignedIn,
}: {
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);

    setPasswordError(passwordValidationError);
    setEmailError(emailValidationError);

    if (!emailValidationError && !passwordValidationError) {
      setSignedIn(true);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <Input value={email} onChange={handleEmailChange} errorMessage={emailError ?? undefined} />
      <Input
        isPassword
        value={password}
        onChange={handlePasswordChange}
        errorMessage={passwordError ?? undefined}
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
