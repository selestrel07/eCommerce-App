import { Layout, Menu, Drawer, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { getMenuItems } from './menuItems';
import { AppHeaderProps } from '../../interfaces/interfaces';
import logo from '../../assets/logo.png';
import './Header.scss';
import { Paths } from '../../enums/paths/paths';
import { useNavigate } from 'react-router-dom';
import { emptyTokenStore, tokenCache } from '../../services/storage/storage.service.ts';
import { revokeToken } from '../../services/authService.ts';

const AppHeader = ({ isSignedIn, setSignedIn }: AppHeaderProps) => {
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [drawerVisible, setDrawerVisible] = useState(false);

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
                  items={getMenuItems(isSignedIn, () => setDrawerVisible(false), handleLogout)}
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
    </Layout.Header>
  );
};

export default AppHeader;
