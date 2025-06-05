import { Context, FC, ReactElement, use, useState } from 'react';
import { Input } from '../Input/Input.tsx';
import { Button } from 'antd';
import { ProfileSectionNames, EditAction } from '@enums';
import { DatePickerInput } from '../DatePickerInput/DatePickerInput.tsx';
import { emptyPersonalInfoErrors } from '@data';
import { validateDate, validateEmail, validateStringField, composeAction } from '@utils';
import { updateCustomer } from '@services';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import Alert from 'antd/es/alert/Alert';
import { PersonalInfoFields } from '@types';
import { ProfileContextData, ProfileContextEditMode } from '@contexts';
import { ProfileContextDataType, ProfileContextEditModeType } from '@interfaces';

const composeActions = (
  initialValues: PersonalInfoFields,
  currentValues: PersonalInfoFields
): MyCustomerUpdateAction[] => {
  const actions: (MyCustomerUpdateAction | undefined)[] = [];
  actions.push(
    composeAction(
      EditAction.SET_FIRST_NAME,
      initialValues.firstName !== currentValues.firstName ? currentValues.firstName : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.SET_LAST_NAME,
      initialValues.lastName !== currentValues.lastName ? currentValues.lastName : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.CHANGE_EMAIL,
      initialValues.email !== currentValues.email ? currentValues.email : undefined
    )
  );
  actions.push(
    composeAction(
      EditAction.SET_DATE_OF_BIRTH,
      initialValues.dateOfBirth !== currentValues.dateOfBirth
        ? currentValues.dateOfBirth
        : undefined
    )
  );
  return actions.filter((action) => action !== undefined);
};

export const PersonalInfoSection: FC = (): ReactElement => {
  const { profileEditMode, setProfileEditMode, editComponent, setEditComponent } = use(
    ProfileContextEditMode as Context<ProfileContextEditModeType>
  );
  const { client, customerData, showNotification, setReload } = use(
    ProfileContextData as Context<ProfileContextDataType>
  );
  const initialPersonalInfo = {
    firstName: customerData?.firstName ?? '',
    lastName: customerData?.lastName ?? '',
    email: customerData?.email ?? '',
    dateOfBirth: customerData?.dateOfBirth ?? '',
  };
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFields>(initialPersonalInfo);
  const [errorMessages, setErrorMessages] =
    useState<{ [key in keyof typeof emptyPersonalInfoErrors]: string | null }>(
      emptyPersonalInfoErrors
    );
  const [responseError, setResponseError] = useState<string | null>(null);

  const handleChange = <K extends keyof PersonalInfoFields>(
    field: K,
    value: string | undefined
  ) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    setErrorMessages((prev) => ({ ...prev, [field]: null }));
    setResponseError(null);
  };

  const handleSubmit = () => {
    const validationErrorMessages = {
      firstName: validateStringField(personalInfo.firstName, 'first name'),
      lastName: validateStringField(personalInfo.lastName, 'last name'),
      email: validateEmail(personalInfo.email),
      dateOfBirth: validateDate(personalInfo.dateOfBirth),
    };

    setErrorMessages(validationErrorMessages);

    const actions: MyCustomerUpdateAction[] = composeActions(initialPersonalInfo, personalInfo);

    if (Object.values(validationErrorMessages).every((error) => error === null)) {
      if (actions.length > 0) {
        updateCustomer(client, customerData?.version ?? 0, actions)
          .then((): void => {
            setProfileEditMode(false);
            setEditComponent('');
            setReload(true);
            showNotification();
          })
          .catch((error: Error): void => {
            setResponseError(error.message);
          });
      } else {
        setResponseError('There is no changes');
      }
    }
  };

  return (
    <section className="personal-info-section">
      <h2>{ProfileSectionNames.PERSONAL_INFORMATION}</h2>
      <div className="personal-info-fields">
        <Input
          fieldName="First Name: "
          value={personalInfo.firstName}
          errorMessage={errorMessages.firstName ?? undefined}
          onChange={(e) => handleChange('firstName', e.target.value)}
          disabled={
            !profileEditMode ||
            editComponent !== ProfileSectionNames.PERSONAL_INFORMATION.toString()
          }
        />
        <Input
          fieldName="Last Name: "
          value={personalInfo.lastName}
          errorMessage={errorMessages.lastName ?? undefined}
          onChange={(e) => handleChange('lastName', e.target.value)}
          disabled={
            !profileEditMode ||
            editComponent !== ProfileSectionNames.PERSONAL_INFORMATION.toString()
          }
        />
        <Input
          fieldName="Email: "
          value={personalInfo.email}
          errorMessage={errorMessages.email ?? undefined}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={
            !profileEditMode ||
            editComponent !== ProfileSectionNames.PERSONAL_INFORMATION.toString()
          }
        />
        <DatePickerInput
          fieldName="Date of Birth: "
          value={personalInfo.dateOfBirth}
          errorMessage={errorMessages.dateOfBirth ?? undefined}
          onChange={(selectedDate: string | undefined) => handleChange('dateOfBirth', selectedDate)}
          disabled={
            !profileEditMode ||
            editComponent !== ProfileSectionNames.PERSONAL_INFORMATION.toString()
          }
        />
      </div>
      {responseError ? <Alert type="error" message={responseError} /> : undefined}
      {profileEditMode && editComponent === ProfileSectionNames.PERSONAL_INFORMATION.toString() ? (
        <div className="profile-buttons">
          <Button type="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setProfileEditMode(false);
              setEditComponent('');
              setPersonalInfo(initialPersonalInfo);
              setErrorMessages(emptyPersonalInfoErrors);
              setResponseError(null);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          type="primary"
          onClick={() => {
            setProfileEditMode(true);
            setEditComponent(ProfileSectionNames.PERSONAL_INFORMATION);
          }}
          disabled={
            profileEditMode && editComponent !== ProfileSectionNames.PERSONAL_INFORMATION.toString()
          }
        >
          Edit
        </Button>
      )}
    </section>
  );
};
