import { FC } from 'react';
import { Card } from 'antd';
import { DiscountCode } from '@commercetools/platform-sdk';

export const DiscountCodeCard: FC<{ code: DiscountCode }> = ({ code }) => {
  return <Card title={code.code}>{code.description ? code.description['en-US'] : ''}</Card>;
};
