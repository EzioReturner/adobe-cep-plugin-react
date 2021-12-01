import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, Button, Spin, Input } from 'antd';
import { LoadingOutlined, UserOutlined, LockOutlined, ReloadOutlined } from '@ant-design/icons';
import avatar from '@assets/login/avatar.png';
import { useHistory } from 'react-router-dom';
import bridge from '@/bridge/controller';
import './index.less';

interface Info<T = string> {
  no: T;
  password: T;
}

const Login: React.FC = () => {
  const history = useHistory();

  const [showPassword, setShowPassword] = useState(false);

  const [rememberPassword, setRememberPassword] = useState(false);

  const [loginInfo, setLoginInfo] = useState<Info>({
    no: '',
    password: ''
  });

  const [validation, setValidation] = useState<Info<boolean>>({
    no: false,
    password: false
  });

  const [loading, setLoading] = useState(false);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleValidate = useCallback(() => {
    let pass = true;

    const validateInfo = Object.keys(validation).reduce(
      (result: Info<boolean>, key) => {
        let _key = key as keyof Info;

        if (!loginInfo[_key]) {
          result[_key] = true;
          pass = false;
        }
        return result;
      },
      { no: false, password: false }
    );

    setValidation(validateInfo);

    return pass;
  }, [loginInfo, validation]);

  const handleLogin = () => {
    // const pass = handleValidate();
    // if (pass) {
    //   setLoading(true);
    //   setTimeout(() => {
    //     history.push('/material/upload');
    //   }, 2000);
    // }
    // bridge.invokePlugin('dispatchCreatNewDocument', {
    //   height: 100,
    //   width: 100,
    //   resolution: 75,
    //   docName: 'test'
    // });
  };

  const handleChangeForm = (val: string, key: keyof Info) => {
    setLoginInfo({
      ...loginInfo,
      [key]: val
    });
  };

  const handleInvoke = () => {
    // bridge.invokePlugin('dispatchCreatNewDocument', {
    //   height: 100,
    //   width: 100,
    //   resolution: 75,
    //   docName: 'test'
    // });
    // bridge.invokePlugin('getDocuments', {});
  };

  useEffect(() => {
    for (const key in loginInfo) {
      let _key = key as keyof Info;
      if (loginInfo[_key] && validation[_key]) {
        handleValidate();
      }
    }
  }, [loginInfo, validation, handleValidate]);

  const Form = (
    <>
      <Input
        className="user-input"
        size="large"
        placeholder="请输入Employ No"
        value={loginInfo.no}
        onChange={e => handleChangeForm(e.target.value, 'no')}
        prefix={<UserOutlined />}
      />
      <Input.Password
        className="user-input"
        size="large"
        placeholder="请输入密码"
        value={loginInfo.password}
        onChange={e => handleChangeForm(e.target.value, 'password')}
        prefix={<LockOutlined />}
      />
    </>
  );

  const Loading = (
    <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  );

  return (
    <section className="user-login">
      <img className="user-avatar" src={avatar} />
      {Loading}
      {Form}
      <footer className="user-footer">
        <Checkbox checked={rememberPassword} onChange={e => setRememberPassword(e.target.checked)}>
          <span>记住密码</span>
        </Checkbox>
        <Button
          type="primary"
          style={{ width: '90px', borderRadius: '18px' }}
          onClick={handleLogin}
        >
          登录
        </Button>
        <Button
          type="primary"
          style={{ width: '90px', borderRadius: '18px' }}
          onClick={handleInvoke}
        >
          invoke
        </Button>
      </footer>
    </section>
  );
};

export default Login;
