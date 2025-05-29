import { FC, ReactElement } from 'react';
import { Input } from '../Input/Input.tsx';
import { Button } from 'antd';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import { DatePickerInput } from '../DatePickerInput/DatePickerInput.tsx';
import { PersonalInfoSectionProps } from '../../interfaces/component-props/component-props.ts';

export const PersonalInfoSection: FC<PersonalInfoSectionProps> = ({
  firstName,
  lastName,
  email,
  dateOfBirth,
}: PersonalInfoSectionProps): ReactElement => {
  return (
    <section className="personal-info-section">
      <h2>{ProfileSectionNames.PERSONAL_INFORMATION}</h2>
      <div className="personal-info-fields">
        <Input fieldName="First Name: " value={firstName} disabled />
        <Input fieldName="Last Name: " value={lastName} disabled />
        <Input fieldName="Email: " value={email} disabled />
        <DatePickerInput fieldName="Date of Birth: " value={dateOfBirth} disabled />
      </div>
      <Button type="primary">Edit</Button>
    </section>
  );
};
