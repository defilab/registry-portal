import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { fetchTransactions } from '../../services/api';

class List extends PureComponent {
  state = {
    dataSource: [],
    loading: false,
  };

  columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: formatMessage ({ id: 'spec.transaction-name' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: formatMessage ({ id: 'spec.transaction-amount' }),
      key: 'amount',
      dataIndex: 'amount',
    },
    {
      title: formatMessage ({ id: 'spec.transaction-status' }),
      key: 'state',
      dataIndex: 'state',
    },
  ];

  componentDidMount () {
    this.setState({
      loading: true,
    });

    fetchTransactions().then((data) => this.setState({
      dataSource: data.map((item) => ({
        key: item.transaction_id,
        id: item.transaction_id,
        name: formatMessage ({ id: `spec.transaction-${item.action}` }),
        amount: `${item.balance_after - item.balance_before} PTS`,
        state: formatMessage ({ id: 'spec.transaction-success' }),
      })),
    })).finally(() => this.setState({
      loading: false,
    }));
  }

  render () {
    const { dataSource, loading } = this.state;
    return (
      <Card title={formatMessage({ id: 'menu.transactions' })}>
        <Table columns={this.columns} dataSource={dataSource} loading={loading} />
      </Card>);
  }
}

export default List;
