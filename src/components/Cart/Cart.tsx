import { Paths } from '@enums';
import { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';

export const Cart: FC = (): ReactElement => {
  return (
    <>
      <h2>
        There are no items in your cart. Please proceed with <Link to={Paths.CATALOG}>Catalog</Link>{' '}
        to add items.
      </h2>
    </>
  );
};
