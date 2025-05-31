import React, { ReactElement, useState, useEffect } from 'react';
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
import { AddressData } from '../../interfaces/address/address.ts';
import Alert from 'antd/es/alert/Alert';
import { loginCustomer, signUpCustomer } from '../../services/authService.ts';
import './SignUp.scss';
import { Client } from '@commercetools/sdk-client-v2';
import { createCustomerClient } from '../../services/clientBuilder.ts';
import { setAnonymousClient } from '../../services/storage/storage.service.ts';
import SwitchAddress from '../../components/SwitchAdress/switchAddress.tsx';
import { Switch } from 'antd';
import { AppCustomerDraft } from '../../interfaces/customer/customer.ts';

const { Text } = Typography;

type FormField = 'email' | 'firstName' | 'lastName' | 'password' | 'repeatPassword' | 'dateOfBirth';

export default function SignUp({
  setSignedIn,
  apiClient,
  setApiClient,
  openNotification,
}: {
  setSignedIn: (value: boolean) => void;
  apiClient: Client;
  setApiClient: (client: Client) => void;
  openNotification: () => void;
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

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    country: Object.keys(CountriesData)[0],
    city: '',
    streetName: '',
    postalCode: '',
  });

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    country: Object.keys(CountriesData)[0],
    city: '',
    streetName: '',
    postalCode: '',
  });

  const [sameAddress, setSameAddress] = useState(false);

  // Copy from shipping to billing addresses
  useEffect(() => {
    if (sameAddress) {
      setBillingAddress(shippingAddress);
      setBillingErrors({
        country: null,
        city: null,
        streetName: null,
        postalCode: null,
      });
    }
  }, [sameAddress, shippingAddress]);

  const [shippingErrors, setShippingErrors] = useState<AddressErrorData>({
    country: null,
    city: null,
    streetName: null,
    postalCode: null,
  });
  const [billingErrors, setBillingErrors] = useState<AddressErrorData>({
    country: null,
    city: null,
    streetName: null,
    postalCode: null,
  });

  const [responseError, setResponseError] = useState<string | null>(null);

  const [defaultAddressFlags, setDefaultAddressFlags] = useState({
    defaultShipping: false,
    defaultBilling: false,
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

    setErrors(newErrors);

    const validateCountry = (value: string): string | null => {
      return value.trim() ? null : 'Please select a country';
    };

    const shippingErrorsValidated = {
      country: validateCountry(shippingAddress.country),
      city: validateStringField(shippingAddress.city, 'city'),
      streetName: validateStringField(shippingAddress.streetName, 'street'),
      postalCode: validatePostalCode(shippingAddress.postalCode, shippingAddress.country),
    };
    const billingErrorsValidated = {
      country: validateCountry(billingAddress.country),
      city: validateStringField(billingAddress.city, 'city'),
      streetName: validateStringField(billingAddress.streetName, 'street'),
      postalCode: validatePostalCode(billingAddress.postalCode, billingAddress.country),
    };

    setShippingErrors(shippingErrorsValidated);
    setBillingErrors(billingErrorsValidated);

    const formHasErrors = [
      ...Object.values(newErrors),
      ...Object.values(shippingErrorsValidated),
      ...Object.values(billingErrorsValidated),
    ].some((e) => e !== null);

    if (!formHasErrors) {
      const addresses = sameAddress ? [shippingAddress] : [shippingAddress, billingAddress];
      const customerData: AppCustomerDraft = {
        ...form,
        addresses,
        shippingAddresses: [0],
        billingAddresses: sameAddress ? [0] : [1],
        defaultShippingAddress: defaultAddressFlags.defaultShipping ? 0 : undefined,
        defaultBillingAddress: defaultAddressFlags.defaultBilling
          ? sameAddress
            ? 0
            : 1
          : undefined,
      };

      signUpCustomer(customerData, apiClient)
        .then(async () => {
          openNotification();
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

  const sameLabel = 'Same address for billing';
  const differentLabel = 'Different billing address';

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

      <div className="address-container">
        <div className="adress-component">
          <Text>Shipping address:</Text>
          <Address
            value={shippingAddress}
            addressErrors={shippingErrors}
            onChange={(field) => (e) => {
              setShippingAddress({ ...shippingAddress, [field]: e.target.value });
              setShippingErrors({ ...shippingErrors, [field]: null });
            }}
            onCountryChange={(value) => {
              setShippingAddress({ ...shippingAddress, country: value });
              setShippingErrors({ ...shippingErrors, country: null });
            }}
          />
        </div>

        <div className="adress-component">
          <Text>Billing address:</Text>
          <Address
            value={billingAddress}
            disabled={sameAddress}
            addressErrors={billingErrors}
            onChange={(field) => (e) => {
              setBillingAddress({ ...billingAddress, [field]: e.target.value });
              setBillingErrors({ ...billingErrors, [field]: null });
            }}
            onCountryChange={(value) => {
              setBillingAddress({ ...billingAddress, country: value });
              setBillingErrors({ ...billingErrors, country: null });
            }}
          />
        </div>

        <SwitchAddress onChange={setDefaultAddressFlags} />

        <div className="switch-container">
          <span>{sameAddress ? sameLabel : differentLabel}</span>
          <Switch checked={sameAddress} onChange={setSameAddress} />
        </div>
      </div>

      <div className="form-controls">
        {responseError ? <Alert type="error" message={responseError} /> : undefined}
        <Button type="primary" htmlType="submit">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
