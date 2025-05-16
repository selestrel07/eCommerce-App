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

export default function SignUp({
  setSignedIn,
}: {
  setSignedIn: (value: boolean) => void;
}): ReactElement {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
    setPasswordError(null);
  };

  const handleFirstNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFirstName(e.target.value);
    setFirstNameError(null);
  };

  const handleLastNameChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setLastName(e.target.value);
    setLastNameError(null);
  };

  const handleRepeatPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRepeatPassword(e.target.value);
    setRepeatPasswordError(null);
  };

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
    setEmailError(null);
  };

  const handleDateChange = (selectedDate: string | null) => {
    setDate(selectedDate);
    setDateError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    const repeatPasswordValidationError = validateRepeatPassword(repeatPassword, password);
    const firstNameValidationError = validateName(firstName, 'first name');
    const lastNameValidationError = validateName(lastName, 'last name');
    const dateValidationError = validateDate(date);

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setRepeatPasswordError(repeatPasswordValidationError);
    setFirstNameError(firstNameValidationError);
    setLastNameError(lastNameValidationError);
    setDateError(dateValidationError);

    if (
      !emailValidationError &&
      !passwordValidationError &&
      !repeatPasswordValidationError &&
      !firstNameValidationError &&
      !lastNameValidationError &&
      !dateValidationError
    ) {
      setSignedIn(true);
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <div className="row-name">
        <Input
          value={firstName}
          onChange={handleFirstNameChange}
          errorMessage={firstNameError ?? undefined}
          placeholder="First Name"
        />
        <Input
          value={lastName}
          onChange={handleLastNameChange}
          errorMessage={lastNameError ?? undefined}
          placeholder="Last Name"
        />
      </div>
      <div className="row-info">
        <DatePickerInput
          value={date}
          onChange={handleDateChange}
          errorMessage={dateError ?? undefined}
          placeholder="Select your birth date"
        />
        <Input
          value={email}
          onChange={handleEmailChange}
          errorMessage={emailError ?? undefined}
          placeholder="Email"
        />
      </div>

      <Input
        isPassword
        value={password}
        onChange={handlePasswordChange}
        errorMessage={passwordError ?? undefined}
        placeholder="Password"
      />
      <Input
        isPassword
        value={repeatPassword}
        onChange={handleRepeatPasswordChange}
        errorMessage={repeatPasswordError ?? undefined}
        placeholder="Repeat Password"
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
