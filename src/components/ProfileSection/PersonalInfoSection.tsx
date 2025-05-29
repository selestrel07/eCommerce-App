import { FC, ReactElement, useState } from 'react';
import { Input } from '../Input/Input.tsx';
import { Button } from 'antd';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import { DatePickerInput } from '../DatePickerInput/DatePickerInput.tsx';
import { PersonalInfoSectionProps } from '../../interfaces/component-props/component-props.ts';
import { emptyPersonalInfoErrors } from '../../data/component-states/personal-info-states.ts';
import { validateDate, validateEmail, validateStringField } from '../../utils/validation.ts';
import { EditAction } from '../../enums/edit-actions/edit-actions.ts';
import { updateCustomer } from '../../services/api.service.ts';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import Alert from 'antd/es/alert/Alert';
import { PersonalInfoFields } from '../../types/profile-sections/personal-info-fields.ts';
import { composeAction } from '../../utils/edit-action.utils.ts';

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

export const PersonalInfoSection: FC<PersonalInfoSectionProps> = ({
  client,
  version,
  firstName,
  lastName,
  email,
  dateOfBirth,
  onUpdate,
  openNotification,
}: PersonalInfoSectionProps): ReactElement => {
  const initialPersonalInfo = {
    firstName,
    lastName,
    email,
    dateOfBirth,
  };
  const [editMode, setEditMode] = useState(false);
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
        updateCustomer(client, version, actions)
          .then((): void => {
            setEditMode(false);
            onUpdate(true);
            openNotification();
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
          disabled={!editMode}
        />
        <Input
          fieldName="Last Name: "
          value={personalInfo.lastName}
          errorMessage={errorMessages.lastName ?? undefined}
          onChange={(e) => handleChange('lastName', e.target.value)}
          disabled={!editMode}
        />
        <Input
          fieldName="Email: "
          value={personalInfo.email}
          errorMessage={errorMessages.email ?? undefined}
          onChange={(e) => handleChange('email', e.target.value)}
          disabled={!editMode}
        />
        <DatePickerInput
          fieldName="Date of Birth: "
          value={personalInfo.dateOfBirth}
          errorMessage={errorMessages.dateOfBirth ?? undefined}
          onChange={(selectedDate: string | undefined) => handleChange('dateOfBirth', selectedDate)}
          disabled={!editMode}
        />
      </div>
      {responseError ? <Alert type="error" message={responseError} /> : undefined}
      {editMode ? (
        <div className="profile-buttons">
          <Button type="primary" onClick={handleSubmit}>
            Save
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setEditMode(false);
              setPersonalInfo(initialPersonalInfo);
              setErrorMessages(emptyPersonalInfoErrors);
              setResponseError(null);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="primary" onClick={() => setEditMode(true)}>
          Edit
        </Button>
      )}
    </section>
  );
};
