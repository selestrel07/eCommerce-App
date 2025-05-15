import { ReactElement, useState } from 'react';
import { Input } from '../../components/Input/Input';
import {
  validatePassword,
  validateEmail,
  validateFields,
  composeFieldValidationObject,
} from '../../utils/validation';
import { Button } from 'antd';
import { loginCustomer } from '../../services/authService.ts';
import Alert from 'antd/es/alert/Alert';
import './SignIn.scss';
import { composeFieldHandler } from '../../utils/handlers.ts';

const handleSubmit = (
  errors: string[],
  email: string,
  password: string,
  signInCallback: (value: boolean) => void,
  errorSetter: (value: string) => void
) => {
  return (e: React.FormEvent) => {
    e.preventDefault();

    if (errors.length === 0) {
      loginCustomer(email, password)
        .then(() => {
          signInCallback(true);
        })
        .catch((error: Error) => {
          errorSetter(error.message);
        });
    }
  };
};

export default function SignIn({
  setSignedIn,
}: {
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [responseError, setResponseError] = useState<string | null>(null);

  const handlePasswordChange = composeFieldHandler(setPassword, [
    setPasswordError,
    setResponseError,
  ]);

  const handleEmailChange = composeFieldHandler(setEmail, [setEmailError, setResponseError]);

  const getErrors = () =>
    validateFields([
      composeFieldValidationObject(email, validateEmail, setEmailError),
      composeFieldValidationObject(password, validatePassword, setPasswordError),
    ]);

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit(getErrors(), email, password, setSignedIn, setResponseError)}
    >
      <Input
        fieldName="Email:"
        value={email}
        onChange={handleEmailChange}
        errorMessage={emailError ?? undefined}
      />
      <Input
        fieldName="Password:"
        isPassword
        value={password}
        onChange={handlePasswordChange}
        errorMessage={passwordError ?? undefined}
      />
      <div className="login-form-controls">
        {responseError ? <Alert type="error" message={responseError} /> : undefined}
        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </div>
    </form>
  );
}
