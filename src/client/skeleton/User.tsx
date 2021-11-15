import React from 'react';
import './user.less';

const UserLayout: React.FC = props => {
  const { children } = props;
  return (
    <div className="LK-UserSkeleton">
      <div>{children}</div>
    </div>
  );
};
export default UserLayout;
