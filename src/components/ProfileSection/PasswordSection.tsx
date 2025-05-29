import { FC, ReactElement } from 'react';
import { Button } from 'antd';
import { ProfileSectionNames } from '../../enums/profile-section-names/profile-section-names.ts';
import { Input } from '../Input/Input.tsx';
import { PasswordSectionProps } from '../../interfaces/component-props/component-props.ts';

export const PasswordSection: FC<PasswordSectionProps> = ({
  password,
}: PasswordSectionProps): ReactElement => {
  return (
    <section>
      <h2>{ProfileSectionNames.PASSWORD}</h2>
      <div className="password-info-fields">
        <Input value={password} isPassword disabled />
      </div>
      <Button type="primary">Edit</Button>
    </section>
  );
};
