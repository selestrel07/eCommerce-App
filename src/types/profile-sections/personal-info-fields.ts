import { PersonalInfoSectionProps } from '@interfaces';

export type PersonalInfoFields = Omit<
  PersonalInfoSectionProps,
  'client' | 'version' | 'onUpdate' | 'openNotification'
>;
