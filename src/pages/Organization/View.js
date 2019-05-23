import React, { Component } from 'react';
import router from 'umi/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class SearchList extends Component {
  state = {
    activeTabKey: undefined
  }

  componentDidMount() {
    const { location } = this.props; 
    this.setState({
      activeTabKey: location.pathname.endsWith('users') ? 'users' : 'info'
    });
  }

  handleTabChange = key => {
    this.setState({
      activeTabKey: key
    })
    const { match } = this.props;
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

  render() {
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

    const { children } = this.props;
    const { activeTabKey } = this.state;

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={activeTabKey}
        onTabChange={this.handleTabChange}
        hiddenBreadcrumb
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default SearchList;

