/* eslint-disable max-lines-per-function */
import { ReactElement, useState } from 'react';
import { Input } from '../../components/Input/Input';
import {
  validatePassword,
  validateEmail,
  validateRepeatPassword,
  validateName,
  validateDate,
} from '../../utils/validation';
import { DatePickerInput } from '../../components/DatePickerInput/DatePickerInput';

type FormField = 'email' | 'firstName' | 'lastName' | 'password' | 'repeatPassword' | 'date';

export default function SignUp({
  setSignedIn,
}: {
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    repeatPassword: '',
    date: null as string | null,
  });

  const [errors, setErrors] = useState<Record<FormField, string | null>>({
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    repeatPassword: null,
    date: null,
  });

  const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleFirstNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    handleChange('firstName', e.target.value);

  const handleLastNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    handleChange('lastName', e.target.value);

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    handleChange('email', e.target.value);

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    handleChange('password', e.target.value);

  const handleRepeatPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    handleChange('repeatPassword', e.target.value);

  const handleDateChange = (selectedDate: string | null) => {
    handleChange('date', selectedDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      repeatPassword: validateRepeatPassword(form.repeatPassword, form.password),
      firstName: validateName(form.firstName, 'first name'),
      lastName: validateName(form.lastName, 'last name'),
      date: validateDate(form.date),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === null)) {
      setSignedIn(true);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="row-name">
        <Input
          value={form.firstName}
          onChange={handleFirstNameChange}
          errorMessage={errors.firstName ?? undefined}
          placeholder="First Name"
        />
        <Input
          value={form.lastName}
          onChange={handleLastNameChange}
          errorMessage={errors.lastName ?? undefined}
          placeholder="Last Name"
        />
      </div>
      <div className="row-info">
        <DatePickerInput
          value={form.date}
          onChange={handleDateChange}
          errorMessage={errors.date ?? undefined}
          placeholder="Select your birth date"
        />
        <Input
          value={form.email}
          onChange={handleEmailChange}
          errorMessage={errors.email ?? undefined}
          placeholder="Email"
        />
      </div>

      <Input
        isPassword
        value={form.password}
        onChange={handlePasswordChange}
        errorMessage={errors.password ?? undefined}
        placeholder="Password"
      />
      <Input
        isPassword
        value={form.repeatPassword}
        onChange={handleRepeatPasswordChange}
        errorMessage={errors.repeatPassword ?? undefined}
        placeholder="Repeat Password"
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
