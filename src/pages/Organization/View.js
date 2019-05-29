import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const OrganizationLayout = ({ match, location, children }) => {
  const [activeTabKey, setActiveTabKey] = useState();

  useEffect(() => {
    setActiveTabKey(location.pathname.includes('users') ? 'users' : 'info');
  }, [location]);

  const handleTabChange = key => {
    setActiveTabKey(key);
    switch (key) {
      case 'info':
        router.push(`${match.url}`);
        break;
      case 'users':
        router.push(`${match.url}/users`);
        break;
      default:
        break;
    }
  };

  const tabList = [
    {
      key: 'info',
      tab: '企业信息',
    },
    {
      key: 'users',
      tab: '用户管理',
    },
  ];

  return (
    <PageHeaderWrapper
      tabList={tabList}
      tabActiveKey={activeTabKey}
      onTabChange={handleTabChange}
      hiddenBreadcrumb
    >
      {children}
    </PageHeaderWrapper>
  )
};

export default OrganizationLayout;

