import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';

class List extends PureComponent {
  dataSource = [
    {
      key: '1',
      orderNo: '0923984329849238',
      dataSpec: 'Loan Blacklist',
      dataType: 'Blacklist',
      requestTime: '2019-01-01 00:00',
      state: 'Success',
      responseTime: '2019-01-01 00:00',
      transactionAmount: '9 PHP'
    },
    {
      key: '2',
      orderNo: '0923984329849238',
      dataSpec: 'Loan Blacklist',
      dataType: 'Blacklist',
      requestTime: '2019-01-01 00:00',
      state: 'Success',
      responseTime: '2019-01-01 00:00',
      transactionAmount: '9 PHP'
    },
    {
      key: '3',
      orderNo: '0923984329849238',
      dataSpec: 'Loan Blacklist',
      dataType: 'Blacklist',
      requestTime: '2019-01-01 00:00',
      state: 'Success',
      responseTime: '2019-01-01 00:00',
      transactionAmount: '9 PHP'
    },
    {
      key: '4',
      orderNo: '0923984329849238',
      dataSpec: 'Loan Blacklist',
      dataType: 'Blacklist',
      requestTime: '2019-01-01 00:00',
      state: 'Success',
      responseTime: '2019-01-01 00:00',
      transactionAmount: '9 PHP'
    },
    {
      key: '5',
      orderNo: '0923984329849238',
      dataSpec: 'Loan Blacklist',
      dataType: 'Blacklist',
      requestTime: '2019-01-01 00:00',
      state: 'Success',
      responseTime: '2019-01-01 00:00',
      transactionAmount: '9 PHP'
    },
    {
      key: '6',
      orderNo: '0923984329849238',
      dataSpec: 'Loan Blacklist',
      dataType: 'Blacklist',
      requestTime: '2019-01-01 00:00',
      state: 'Success',
      responseTime: '2019-01-01 00:00',
      transactionAmount: '9 PHP'
    },
  ];

  columns = [
    {
      title: 'Order No.',
      dataIndex: 'orderNo',
      key: 'order-no'
    },
    {
      title: 'Data Spec',
      dataIndex: 'dataSpec',
      key: 'data-spec'
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      key: 'data-type'
    },
    {
      title: 'Request Time',
      dataIndex: 'requestTime',
      key: 'request-time'
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state'
    },
    {
      title: 'Response Time',
      dataIndex: 'responseTime',
      key: 'response-time'
    },
    {
      title: 'Transaction Amount',
      dataIndex: 'transactionAmount',
      key: 'transaction-amount'
    }
  ];

  render () {
    return (
      <Card title="Requests">
        <Table columns={this.columns} dataSource={this.dataSource} />
      </Card>);
  }
}

export default List;
