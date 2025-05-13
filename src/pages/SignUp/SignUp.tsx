import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpCustomer } from '../../services/authService';
import type { ReactElement } from 'react';
import { SignUpProps } from '../../interfaces/interfaces';

// TODO: remove this content later

interface FormFields {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const initialFields: FormFields = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
};

const fieldConfigs = [
  { name: 'email', type: 'email', placeholder: 'Email', required: true },
  { name: 'firstName', type: 'text', placeholder: 'First Name', required: true },
  { name: 'lastName', type: 'text', placeholder: 'Last Name', required: true },
  { name: 'password', type: 'password', placeholder: 'Password', required: true },
];

export default function SignUp({ setSignedIn }: SignUpProps): ReactElement {
  const [fields, setFields] = useState<FormFields>(initialFields);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    void (async () => {
      try {
        await signUpCustomer(fields);
        setError(null);
        setSignedIn(true);
        await navigate('/app');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error during registration');
      }
    })();
  };

  return (
    <form onSubmit={handleSignUp}>
      {fieldConfigs.map(({ name, type, placeholder, required }) => (
        <input
          key={name}
          name={name}
          type={type}
          value={fields[name as keyof FormFields]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      ))}
      <button type="submit">Sign Up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
