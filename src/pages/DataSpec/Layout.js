import React from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const Layout = ({ children }) => (
  <PageHeaderWrapper>
    {children}
  </PageHeaderWrapper>
);

export default Layout;