import React from 'react';
import { Menu, Dropdown, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import UserStore from '@store/userStore';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

interface InjectedProps {
  userStore: UserStore;
}

const confirm = Modal.confirm;

const UserInfo: React.FC = props => {
  const history = useHistory();

  const {
    userStore: { userInfo, userLogout }
  } = props as InjectedProps;

  const handleLogout = () => {
    confirm({
      maskClosable: true,
      title: 'confirm to logout',
      content: 'user info will reset, system cannot auto-login',
      onOk: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            userLogout();
            history.push('/user/login');
            resolve(1);
          }, 800);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {}
    });
  };

  const handleTriggerError = () => {
    history.push('/exception/home');
  };

  const getMenu = () => (
    <Menu>
      <Menu.Item>
        <UserOutlined />
        <span className="LK-userInfo-menuItem">user info</span>
      </Menu.Item>
      <Menu.Item onClick={handleTriggerError}>
        <SettingOutlined />
        <span className="LK-userInfo-menuItem">trigger error</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={handleLogout}>
        <LogoutOutlined />
        <span className="LK-userInfo-menuItem">logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="LK-userInfo">
      <Dropdown overlay={getMenu()} className="LK-userInfo" placement="bottomRight">
        <div className="LK-userInfo-dropdown">
          <UserOutlined className="LK-userInfo-icon" />
          <span className="LK-userInfo-userName">{userInfo.name}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default inject('userStore')(observer(UserInfo));
