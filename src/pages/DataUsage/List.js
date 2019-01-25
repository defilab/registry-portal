import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';

class List extends PureComponent {
  columns = [
    {
      title: 'Order No.',
      key: 'order-no'
    },
    {
      title: 'Data Spec',
      key: 'data-spec'
    },
    {
      title: 'Data Type',
      key: 'data-type'
    },
    {
      title: 'Request Time',
      key: 'request-time'
    },
    {
      title: 'State',
      key: 'state'
    },
    {
      title: 'Response Time',
      key: 'response-time'
    },
    {
      title: 'Transaction Amount',
      key: 'transaction-amount'
    }
  ];

  data = [];

  render () {
    return (
      <Card title="Data Usage">
        <Table columns={this.columns} data={this.data} />
      </Card>);
  }
}

export default List;
