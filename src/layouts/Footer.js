import React from 'react';
import { Layout } from 'antd';
import targets from '../targets';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter copyright={targets.target.copyright} />
  </Footer>
);
export default FooterView;
