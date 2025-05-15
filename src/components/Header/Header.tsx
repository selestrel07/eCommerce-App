import { Layout, Menu, Drawer, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import logo from '../../assets/logo.png';
import './Header.scss';

const menuItems = (onClick?: () => void) => (
  <>
    <Menu.Item key="/main" onClick={onClick}>
      <Link to="/main">Main</Link>
    </Menu.Item>
    <Menu.Item key="/signin" onClick={onClick}>
      <Link to="/signin">Sign in</Link>
    </Menu.Item>
    <Menu.Item key="/signup" onClick={onClick}>
      <Link to="/signup">Sign up</Link>
    </Menu.Item>
  </>
);

const AppHeader = () => {
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
              {menuItems(() => setDrawerVisible(false))}
            </Menu>
          </Drawer>
        </>
      ) : (
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          {menuItems()}
        </Menu>
      )}
    </Layout.Header>
  );
};

export default AppHeader;
