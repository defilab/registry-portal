import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const OrganizationLayout = ({ location, children }) => {
  const [activeTabKey, setActiveTabKey] = useState();

  const pathSegments = location.pathname.split('/');

  useEffect(() => {
    setActiveTabKey(location.pathname.includes('users') ? 'users' : 'info');
  }, [location]);

  const handleTabChange = key => {
    setActiveTabKey(key);
    switch (key) {
      case 'info':
        router.push(`/organizations/${pathSegments[2]}`);
        break;
      case 'users':
        router.push(`/organizations/${pathSegments[2]}/users`);
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

  const genBreadcrumbList = () => {
    const result = [];
    const pathList = location.pathname.split('/');

    result.push({
      title: '首页',
      href: '/'
    });

    result.push({
      title: '企业',
      href: '/organizations'
    });

    if (pathList[3] === 'edit') {
      result.push({
        title: '编辑'
      }); 
      return result;
    }

    if (pathList[2]) {
      let title = pathList[2];
      if (title === 'create') {
        title = '新建'
      }
      result.push({
        title,
        href: pathList.slice(0, 3).join('/')
      });
    }

    if (pathList[3]) {
      result.push({
        title: '用户',
        href: pathList.slice(0, 4).join('/')
      });
    }

    delete result[result.length - 1].href;
    return result;
  }

  return (
    <PageHeaderWrapper
      tabList={pathSegments.length > 2 && pathSegments[2] !== 'create' && pathSegments[3] !== 'edit' ? tabList : null}
      tabActiveKey={activeTabKey}
      onTabChange={handleTabChange}
      breadcrumbList={genBreadcrumbList()}
    >
      {children}
    </PageHeaderWrapper>
  )
};

export default OrganizationLayout;

