import { Layout, Menu, Drawer, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { getMenuItems } from './menuItems';
import { AppHeaderProps } from '../../interfaces/interfaces';
import logo from '../../assets/logo.png';
import './Header.scss';

const AppHeader = ({ isSignedIn }: AppHeaderProps) => {
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <Layout.Header className="header">
      <Link to="/" className="logoLink">
        <img src={logo} alt="Logo" className="logoImage" />
        <span className="logoText">eCommerce-App</span>
      </Link>

      {isMobile ? (
        <>
          <Button
            icon={<MenuOutlined />}
            className="menuButton"
            onClick={() => setDrawerVisible(true)}
          />
          <Drawer open={drawerVisible} onClose={() => setDrawerVisible(false)} title="Menu">
            <Menu mode="vertical" selectedKeys={[location.pathname]}>
              {getMenuItems(isSignedIn, () => setDrawerVisible(false))}
            </Menu>
          </Drawer>
        </>
      ) : (
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          {getMenuItems(isSignedIn)}
        </Menu>
      )}
    </Layout.Header>
  );
};

export default AppHeader;
