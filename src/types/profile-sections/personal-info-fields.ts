import { PersonalInfoSectionProps } from '../../interfaces/component-props/component-props.ts';

export type PersonalInfoFields = Omit<
  PersonalInfoSectionProps,
  'client' | 'version' | 'onUpdate' | 'openNotification'
>;
