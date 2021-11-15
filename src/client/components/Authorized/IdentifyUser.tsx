import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import UserStore from '@store/userStore';
import { useHistory } from 'react-router-dom';
import { Spin } from 'raturbo-components';
interface IdentifyUserProps {
  userStore: UserStore;
}

const IdentifyUser: React.FC = props => {
  const history = useHistory();

  const {
    userStore: { identifyStatus }
  } = props as IdentifyUserProps;

  useEffect(() => {
    if (identifyStatus === 'identifying') {
      return;
    }
    if (identifyStatus === 'identifyPass') {
      history.push('/');
    } else if (identifyStatus === 'unauthorized') {
      history.push('/user/login');
    }
  }, [history, identifyStatus]);

  return (
    <section>
      <Spin spinning propStyle={{ background: '#fff' }} text="identifying" />
    </section>
  );
};

export default inject('userStore')(observer(IdentifyUser));
