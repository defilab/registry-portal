import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';

class List extends PureComponent {
  columns = [
    {
      title: 'Time',
      key: 'time'
    },
    {
      title: 'Name',
      key: 'name'
    },
    {
      title: 'Type',
      key: 'type'
    },
    {
      title: 'Amount',
      key: 'amount'
    },
    {
      title: 'State',
      key: 'state'
    },
    {
      title: 'Category',
      key: 'category'
    }
  ];

  data = [];

  render () {
    return (
      <Card title="Transactions">
        <Table columns={this.columns} data={this.data} />
      </Card>);
  }
}

export default List;
