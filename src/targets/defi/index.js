import { Icon } from 'antd';
import React, { Fragment } from 'react';

export default {
  title: 'defi',
  copyright: (
    <Fragment>
      Copyright <Icon type="copyright" /> 2019 Defi
    </Fragment>
  ),
  regions: [
    {
      name: 'Philippines',
      code: 'PH',
      currency: 'PHP'
    },
    {
      name: 'Viet Nam',
      code: 'VN',
      currency: 'VND'
    },
    {
      name: 'Indonesia',
      code: 'ID',
      currency: 'IDR'
    }
  ]
};
