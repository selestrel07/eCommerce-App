import { Link } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Paths } from '../../enums/paths/paths';
import { TiShoppingCart } from 'react-icons/ti';

type ItemType = Required<MenuProps>['items'][number];

export const getMenuItems = (
  isSignedIn: boolean,
  cartItemsCount: number,
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
      {
        key: '/cart',
        label: (
          <Link to={Paths.CART} className="cart-link">
            <div className="cart-icon-wrapper">
              <TiShoppingCart className="cart-icon" />
              {cartItemsCount >= 0 && <span className="cart-badge">{cartItemsCount}</span>}
            </div>
          </Link>
        ),
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
