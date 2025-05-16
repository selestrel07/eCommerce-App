import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';

type ItemType = Required<MenuProps>['items'][number];

export const getMenuItems = (isSignedIn: boolean, onClick?: () => void): ItemType[] => {
  const baseItems: ItemType[] = [
    {
      key: '/main',
      label: <Link to="/main">Main</Link>,
      onClick,
    },
  ];

  if (!isSignedIn) {
    return baseItems.concat([
      {
        key: '/signin',
        label: <Link to="/signin">Sign in</Link>,
        onClick,
      },
      {
        key: '/signup',
        label: <Link to="/signup">Sign up</Link>,
        onClick,
      },
    ]);
  }

  return baseItems.concat([
    {
      key: '/profile',
      label: <Link to="/profile">Profile</Link>,
      onClick,
    },
    {
      key: '/logout',
      label: 'Logout',
      onClick,
    },
  ]);

  return baseItems;
};
