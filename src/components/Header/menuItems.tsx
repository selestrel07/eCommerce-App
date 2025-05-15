import { Menu } from 'antd';
import { Link } from 'react-router-dom';

export const getMenuItems = (isSignedIn: boolean, onClick?: () => void) => {
  const items = [
    <Menu.Item key="/main" onClick={onClick}>
      <Link to="/main">Main</Link>
    </Menu.Item>,
  ];

  if (!isSignedIn) {
    items.push(
      <Menu.Item key="/signin" onClick={onClick}>
        <Link to="/signin">Sign in</Link>
      </Menu.Item>,
      <Menu.Item key="/signup" onClick={onClick}>
        <Link to="/signup">Sign up</Link>
      </Menu.Item>
    );
  }

  return items;
};
