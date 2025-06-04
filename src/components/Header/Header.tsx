import { Layout, Menu, Drawer, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { AppHeaderProps } from '../../interfaces/interfaces';
import logo from '../../assets/logo.png';
import './Header.scss';
import { Paths } from '../../enums/paths/paths';
import { useNavigate } from 'react-router-dom';
import { emptyTokenStore, tokenCache } from '../../services/storage/storage.service.ts';
import { revokeToken } from '../../services/authService.ts';
import { getMenuItems } from './NavItems.tsx';
import { useCart } from '../../contexts/cart-context/UseCart.ts';
import { TiShoppingCart } from 'react-icons/ti';

const AppHeader = ({ isSignedIn, setSignedIn }: AppHeaderProps) => {
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { cartItemsCount } = useCart();

  const navigate = useNavigate();
  const handleLogout = () => {
    setSignedIn(false);
    void navigate(Paths.SIGN_IN);
    void revokeToken(tokenCache.get().token);
    tokenCache.set(emptyTokenStore);
  };
  return (
    <Layout.Header className="header">
      <div className="header-content">
        <Link to={Paths.MAIN} className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
          <span className="logo-text">eCommerce-App</span>
        </Link>

        {isMobile ? (
          <>
            <Button
              icon={<MenuOutlined />}
              className="menu-button"
              onClick={() => setDrawerVisible(true)}
            />
            {isMobile && (
              <Drawer open={drawerVisible} onClose={() => setDrawerVisible(false)} title="Menu">
                <Menu
                  className="menu"
                  mode="vertical"
                  selectedKeys={[location.pathname]}
                  items={getMenuItems(
                    isSignedIn,
                    // cartItemsCount,
                    () => setDrawerVisible(false),
                    handleLogout
                  )}
                />
              </Drawer>
            )}
          </>
        ) : (
          <>
            <Menu
              className="menu"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={getMenuItems(isSignedIn, undefined, handleLogout)}
            />
          </>
        )}
      </div>
      <Link to={Paths.CART} className="cart-link">
        <div className="cart-icon-wrapper">
          <TiShoppingCart className="cart-icon" />
          {cartItemsCount >= 0 && <span className="cart-badge">{cartItemsCount}</span>}
        </div>
      </Link>
    </Layout.Header>
  );
};

export default AppHeader;
