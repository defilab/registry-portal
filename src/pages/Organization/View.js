import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

@connect()
class SearchList extends Component {
  handleTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'info':
        router.push(`${match.url}/info`);
        break;
      case 'users':
        router.push(`${match.url}/users`);
        break;
      default:
        break;
    }
  };

  render() {
    const tabList = [
      {
        key: 'info',
        tab: '基本信息',
      },
      {
        key: 'users',
        tab: '用户管理',
      },
    ];

    const { children, location } = this.props;

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={location.pathname.split('/')[3]}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default SearchList;

