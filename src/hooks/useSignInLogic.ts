import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginCustomer } from '../services/authService';
import { Fields } from '../interfaces/interfaces';

export default function useSignInLogic(setSignedIn: (value: boolean) => void) {
  const [fields, setFields] = useState<Fields>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void (async () => {
      try {
        await loginCustomer(fields.email, fields.password);
        setSignedIn(true);
        await navigate('/app');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    })();
  };

  return { fields, error, handleChange, handleSubmit };
}
