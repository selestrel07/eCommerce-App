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
import { Client } from '@commercetools/sdk-client-v2';
import { createCustomerClient } from '../../services/clientBuilder.ts';
import { setAnonymousClient } from '../../services/storage/storage.service.ts';

export default function SignIn({
  setSignedIn,
  apiClient,
  setApiClient,
}: {
  setSignedIn: (value: boolean) => void;
  apiClient: Client;
  setApiClient: (client: Client) => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = getErrors();

    if (errors.length === 0) {
      const newApiClient = createCustomerClient(email, password);
      loginCustomer(email, password, newApiClient)
        .then(() => {
          setAnonymousClient(apiClient);
          setApiClient(newApiClient);
          setSignedIn(true);
        })
        .catch((error: Error) => {
          setResponseError(error.message);
        });
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
      <div className="form-controls">
        {responseError ? <Alert type="error" message={responseError} /> : undefined}
        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </div>
    </form>
  );
}
