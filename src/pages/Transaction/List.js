import React, { PureComponent } from 'react';
import { Card, Table, Tabs, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { fetchTransactions } from '../../services/api';
import handleError from '@/utils/handleError'

class List extends PureComponent {
  state = {
    dataSource: [],
    loading: false
  };

  columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: formatMessage({ id: 'spec.transaction-name' }),
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: formatMessage({ id: 'spec.transaction-amount' }),
      key: 'amount',
      dataIndex: 'amount'
    },
    {
      title: formatMessage({ id: 'spec.transaction-status' }),
      key: 'state',
      dataIndex: 'state'
    },
    {
      title: formatMessage({ id: 'spec.transaction-time' }),
      key: 'time',
      dataIndex: 'time'
    }
  ];

  componentDidMount() {
    this.setState({
      loading: true
    });

    fetchTransactions().then((data) => this.setState({
      dataSource: data.map((item) => ({
        key: item.transaction_id,
        id: item.transaction_id,
        name: formatMessage({ id: `spec.transaction-${item.action}` }),
        amount: `${item.balance_after - item.balance_before} DFT`,
        time: new Date(item.timestamp * 1000).toLocaleString(),
        state: formatMessage({ id: 'spec.transaction-success' })
      }))
    }))
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('未知错误')
        })
      })
      .finally(() => this.setState({
        loading: false
      }));
  }

  render() {
    const { dataSource, loading } = this.state;
    return (
      <Card title={formatMessage({ id: 'menu.transactions' })}>
        <Tabs defaultActiveKey="currency">
          <Tabs.TabPane tab="Currency" key="currency">
            <Table columns={this.columns} dataSource={dataSource} loading={loading} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Token" key="token">
            <Table columns={this.columns} dataSource={dataSource} loading={loading} />
          </Tabs.TabPane>
        </Tabs>
      </Card>);
  }
}

export default List;
