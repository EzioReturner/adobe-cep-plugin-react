import React, { useCallback, useEffect, useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Button,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { AccountCircle, VpnKey, VisibilityOff, Visibility } from '@mui/icons-material';
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
    const pass = handleValidate();
    if (pass) {
      setLoading(true);

      setTimeout(() => {
        history.push('/material/upload');
      }, 2000);
    }
  };

  const handleChangeForm = (val: string, key: keyof Info) => {
    setLoginInfo({
      ...loginInfo,
      [key]: val
    });
  };

  const handleInvoke = () => {
    bridge.invokePlugin('creatNewDocument', {
      height: 100,
      width: 100,
      resolution: 75,
      docName: 'test'
    });
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
      <TextField
        className="user-input"
        error={validation.no}
        helperText={validation.no ? '请输入Employ No' : ''}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          )
        }}
        onChange={e => handleChangeForm(e.target.value, 'no')}
        value={loginInfo.no}
        size="small"
        label="Employ No."
        variant="outlined"
      />
      <TextField
        className="user-input"
        error={validation.password}
        helperText={validation.password ? '请输入密码' : ''}
        onChange={e => handleChangeForm(e.target.value, 'password')}
        value={loginInfo.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <VpnKey />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
        type={showPassword ? 'text' : 'password'}
        size="small"
        label="Password"
        variant="outlined"
      />
    </>
  );

  const Loading = (
    <Backdrop
      sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
      open={loading}
      onClick={() => setLoading(false)}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );

  return (
    <section className="user-login">
      <img className="user-avatar" src={avatar} />
      {Loading}
      {Form}
      <footer className="user-footer">
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={rememberPassword}
              onChange={e => setRememberPassword(e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          }
          label={<span style={{ fontSize: '1px' }}>记住密码</span>}
        />
        <Button
          style={{ width: '90px', borderRadius: '18px' }}
          variant="contained"
          onClick={handleLogin}
        >
          登录
        </Button>
        <Button
          style={{ width: '90px', borderRadius: '18px' }}
          variant="contained"
          onClick={handleInvoke}
        >
          invoke
        </Button>
      </footer>
    </section>
  );
};

export default Login;
