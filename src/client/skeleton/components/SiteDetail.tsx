import React from 'react';
import { siteName, menuLinkUrl, useSiteIcon } from '@config/setting';
import classNames from 'classnames';
import LayoutStore from '@store/layoutStore';
import { observer, inject } from 'mobx-react';

const SiteDetail: React.FC = props => {
  const {
    layoutStore: {
      layoutStatus: { darkTheme, collapsed },
      isInlineLayout,
      isHorizontalNavigator
    }
  } = props as { layoutStore: LayoutStore };
  return (
    <a
      className={classNames(
        'LK-siteDetail',
        isInlineLayout && 'LK-siteDetail-inlineLayout',
        isHorizontalNavigator && 'LK-siteDetail-horizontal',
        darkTheme && 'LK-siteDetail-darkTheme',
        collapsed && !isInlineLayout && 'LK-siteDetail-collapsed'
      )}
      href={menuLinkUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {useSiteIcon && (
        <img
          alt=""
          src={require('@assets/image/logo.png').default}
          className="LK-siteDetail-logo"
        />
      )}
      <span className="LK-siteDetail-title">{siteName}</span>
    </a>
  );
};

export default inject('layoutStore')(observer(SiteDetail));
