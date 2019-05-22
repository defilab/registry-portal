import React, { Component } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage } from 'umi/locale';

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
    const { children, location, match } = this.props;
    const tabList = [
      {
        key: 'info',
        tab: formatMessage({ id: 'menu.view.info' }),
      },
      {
        key: 'users',
        tab: formatMessage({ id: 'menu.view.users' }),
      },
    ];

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

