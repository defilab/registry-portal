import { getAuthority } from '@/utils/authority';
import router from 'umi/router';
import React, { Component } from 'react';

class Root extends Component {
  componentDidMount() {
    const authority = getAuthority();
    if (authority.includes('admin')) {
      router.replace('/organizations');
    } else {
      router.replace('/account');
    }
  }

  render() {
    return (<></>);
  }
}

export default Root;