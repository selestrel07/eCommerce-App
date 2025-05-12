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

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  setSignedIn(false); //TODO: remove after the page implementation
  return (
    <>
      <Input value={email} onValidate={handleEmailChange} errorMessage={emailError ?? undefined} />
      <Input
        isPassword
        value={password}
        onValidate={handlePasswordChange}
        errorMessage={passwordError ?? undefined}
      />
    </>
  );
}
