import { FC, ReactElement, useState } from 'react';
import { Button } from 'antd';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import { Input } from '../Input/Input.tsx';
import { PasswordSectionProps } from '../../interfaces/component-props/component-props.ts';
import {
  emptyPasswordErrorMessages,
  emptyPasswords,
} from '../../data/component-states/password-states.ts';
import { validatePassword, validateRepeatPassword } from '../../utils/validation.ts';
import { changePassword } from '../../services/api.service.ts';
import Alert from 'antd/es/alert/Alert';
import { loginCustomer } from '../../services/authService.ts';
import { emptyTokenStore, tokenCache } from '../../services/storage/storage.service.ts';
import { createCustomerClient } from '../../services/clientBuilder.ts';

export const PasswordSection: FC<PasswordSectionProps> = ({
  client,
  version,
  password,
  email,
  onUpdate,
  openNotification,
  setApiClient,
}: PasswordSectionProps): ReactElement => {
  const [editMode, setEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState(emptyPasswords);
  const [errorMessages, setErrorMessages] = useState<{
    [K in keyof typeof emptyPasswordErrorMessages]: string | null;
  }>(emptyPasswordErrorMessages);
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleChange = <K extends keyof typeof emptyPasswords>(
    field: K,
    value: string | undefined
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setErrorMessages((prev) => ({ ...prev, [field]: null }));
    setResponseError(null);
  };

  const handleSubmit = () => {
    const validationErrors = {
      currentPassword: validatePassword(passwordData.currentPassword),
      newPassword: validatePassword(passwordData.newPassword),
      confirmPassword: validateRepeatPassword(
        passwordData.confirmPassword,
        passwordData.newPassword
      ),
    };

    setErrorMessages(validationErrors);

    if (Object.values(validationErrors).every((errorMessage) => errorMessage === null)) {
      if (passwordData.newPassword === passwordData.currentPassword) {
        setResponseError('Current and new passwords are the same');
      } else {
        changePassword(client, version, passwordData.currentPassword, passwordData.newPassword)
          .then(async () => {
            tokenCache.set(emptyTokenStore);
            const newApiClient = createCustomerClient(email, passwordData.newPassword);
            await loginCustomer(email, passwordData.newPassword, newApiClient).then(() =>
              setApiClient(newApiClient)
            );
          })
          .then(() => {
            onUpdate(true);
            openNotification();
          })
          .catch((error: Error): void => {
            setResponseError(error.message);
          });
      }
    }
  };

  return (
    <section>
      <h2>{ProfileSectionNames.PASSWORD}</h2>
      <div className="password-info-fields">
        {editMode ? (
          <>
            <Input
              fieldName="Current Password:"
              errorMessage={errorMessages.currentPassword ?? undefined}
              onChange={(e): void => handleChange('currentPassword', e.target.value)}
              isPassword
            />
            <Input
              fieldName="New Password:"
              errorMessage={errorMessages.newPassword ?? undefined}
              onChange={(e): void => handleChange('newPassword', e.target.value)}
              isPassword
            />
            <Input
              fieldName="Confirm Password:"
              errorMessage={errorMessages.confirmPassword ?? undefined}
              onChange={(e): void => handleChange('confirmPassword', e.target.value)}
              isPassword
            />
          </>
        ) : (
          <Input fieldName="Current Password:" value={password} isPassword disabled />
        )}
      </div>
      {responseError ? <Alert type="error" message={responseError} /> : undefined}
      <div className="profile-buttons">
        {editMode ? (
          <>
            <Button type="primary" onClick={() => handleSubmit()}>
              Update Password
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditMode(false);
                setPasswordData(emptyPasswords);
                setErrorMessages(emptyPasswordErrorMessages);
                setResponseError(null);
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        )}
      </div>
    </section>
  );
};
