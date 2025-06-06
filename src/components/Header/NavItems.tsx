import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Paths } from '../../enums/paths/paths';

type ItemType = Required<MenuProps>['items'][number];

export const getMenuItems = (
  isSignedIn: boolean,
  onClick?: () => void,
  onLogout?: () => void
): ItemType[] => {
  const baseItems: ItemType[] = [
    {
      key: '/main',
      label: <Link to={Paths.MAIN}>Main</Link>,
      onClick,
    },
    {
      key: '/catalog',
      label: <Link to={Paths.CATALOG}>Catalog</Link>,
      onClick,
    },
  ];

  if (!isSignedIn) {
    return baseItems.concat([
      {
        key: '/signin',
        label: <Link to={Paths.SIGN_IN}>Sign in</Link>,
        onClick,
      },
      {
        key: '/signup',
        label: <Link to={Paths.SIGN_UP}>Sign up</Link>,
        onClick,
      },
    ]);
  }

  return baseItems.concat([
    {
      key: '/profile',
      label: <Link to={Paths.PROFILE}>Profile</Link>,
      onClick: () => {
        if (onClick) onClick();
      },
    },
    {
      key: 'logout',
      label: 'Logout',
      onClick: () => {
        if (onLogout) onLogout();
        if (onClick) onClick();
      },
    },
  ]);
};
