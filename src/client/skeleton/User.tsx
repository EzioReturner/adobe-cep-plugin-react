import React from 'react';
import { Layout } from 'turbo-components';

const UserLayout: React.FC = props => {
  const { children } = props;
  return (
    <Layout fixHeader hideHeader hideSider>
      {children}
    </Layout>
  );
};
export default UserLayout;
