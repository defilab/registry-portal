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
      case 'management':
        router.push(`${match.url}/management`);
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
        key: 'management',
        tab: '用户管理',
      },

    ];

    const { match, children, location } = this.props;

    return (
      <PageHeaderWrapper

        tabList={tabList}
        tabActiveKey={location.pathname.replace(`${match.url}/`, '')}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default SearchList;

