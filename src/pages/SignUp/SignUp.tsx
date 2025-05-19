/* eslint-disable max-lines-per-function */
import React, { ChangeEvent, ReactElement, useState } from 'react';
import { Input } from '../../components/Input/Input';
import {
  validateDate,
  validateEmail,
  validatePassword,
  validatePostalCode,
  validateRepeatPassword,
  validateStringField,
} from '../../utils/validation';
import { DatePickerInput } from '../../components/DatePickerInput/DatePickerInput';
import { Button, Typography } from 'antd';
import { Address } from '../../components/Address/Address.tsx';
import { AddressErrorData } from '../../types/address/address-types.ts';
import { CountriesData } from '../../data/countries/countries.ts';
import { AddressFields } from '../../enums/address-fields/address-fields.ts';
import { AddressData } from '../../interfaces/address/address.ts';
import Alert from 'antd/es/alert/Alert';
import { loginCustomer, signUpCustomer } from '../../services/authService.ts';
import { Customer } from '../../interfaces/customer/customer.ts';
import './SignUp.scss';
import { Client } from '@commercetools/sdk-client-v2';
import { createCustomerClient } from '../../services/clientBuilder.ts';
import { setAnonymousClient } from '../../services/storage/storage.service.ts';

const { Text } = Typography;

type FormField = 'email' | 'firstName' | 'lastName' | 'password' | 'repeatPassword' | 'dateOfBirth';

export default function SignUp({
  setSignedIn,
  apiClient,
  setApiClient,
}: {
  setSignedIn: (value: boolean) => void;
  apiClient: Client;
  setApiClient: (client: Client) => void;
}): ReactElement {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    repeatPassword: '',
    dateOfBirth: undefined as string | undefined,
  });

  const [errors, setErrors] = useState<Record<FormField, string | null>>({
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    repeatPassword: null,
    dateOfBirth: null,
  });

  const [address, setAddress] = useState<AddressData>({
    country: Object.keys(CountriesData)[0],
    city: '',
    streetName: '',
    postalCode: '',
  });
  const [addressErrors, setAddressErrors] = useState<AddressErrorData>({
    country: null,
    city: null,
    streetName: null,
    postalCode: null,
  });
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleAddressChange = <K extends keyof AddressData>(field: K) => {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setAddress({ ...address, [field]: event.target.value });
      setAddressErrors({ ...addressErrors, [field]: null });
    };
  };

  const handleCountrySelect = (value: string) => {
    const field = AddressFields.COUNTRY;
    setAddress({ ...address, [field]: value });
    setAddressErrors({ ...addressErrors, [field]: null });
  };

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

  const handleDateChange = (selectedDate: string | undefined) => {
    handleChange('dateOfBirth', selectedDate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      repeatPassword: validateRepeatPassword(form.repeatPassword, form.password),
      firstName: validateStringField(form.firstName, 'first name'),
      lastName: validateStringField(form.lastName, 'last name'),
      dateOfBirth: validateDate(form.dateOfBirth),
    };

    const newAddressErrors = {
      country: addressErrors.country,
      city: validateStringField(address.city, 'city'),
      streetName: validateStringField(address.streetName, 'street'),
      postalCode: validatePostalCode(address.postalCode, address.country),
    };

    setErrors(newErrors);
    setAddressErrors(newAddressErrors);

    if (Object.values({ ...newErrors, ...newAddressErrors }).every((error) => error === null)) {
      const customerData: Customer = {
        ...form,
        addresses: [address],
      };
      signUpCustomer(customerData, apiClient)
        .then(async () => {
          const newApiClient = createCustomerClient(form.email, form.password);
          await loginCustomer(form.email, form.password, newApiClient);
          setAnonymousClient(apiClient);
          setApiClient(newApiClient);
        })
        .then(() => setSignedIn(true))
        .catch((error: Error) => {
          setResponseError(error.message);
        });
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
          value={form.dateOfBirth}
          onChange={handleDateChange}
          errorMessage={errors.dateOfBirth ?? undefined}
          placeholder="Select your birth date"
        />
        <Input
          value={form.email}
          onChange={handleEmailChange}
          errorMessage={errors.email ?? undefined}
          placeholder="Email"
        />
      </div>

      <div className="row-info">
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
      </div>

      <Text>Address:</Text>
      <Address
        addressErrors={addressErrors}
        onChange={handleAddressChange}
        onCountryChange={handleCountrySelect}
      />
      <div className="form-controls">
        {responseError ? <Alert type="error" message={responseError} /> : undefined}
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
