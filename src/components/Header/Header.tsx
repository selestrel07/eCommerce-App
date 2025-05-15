import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Header.scss';

const AppHeader = () => {
  const location = useLocation();
  return (
    <Layout.Header className="header">
      <Link to="/" className="logoLink">
        <img src={logo} alt="Logo" className="logoImage" />
        <span className="logoText">eCommerce-App</span>
      </Link>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{ flex: 1, justifyContent: 'flex-end' }}
      >
        <Menu.Item key="/main">
          <Link to="/main">Main</Link>
        </Menu.Item>
        <Menu.Item key="/signin">
          <Link to="/signin">Sign in</Link>
        </Menu.Item>
        <Menu.Item key="/signup">
          <Link to="/signup">Sign up</Link>
        </Menu.Item>
      </Menu>
    </Layout.Header>
  );
};

export default AppHeader;
