import React, { PureComponent } from 'react';
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { fetchResponses } from '../../services/api';

class List extends PureComponent {
  state = {
    dataSource: [],
    loading: false,
  };

  columns = [
    {
      title: formatMessage({ id: 'spec.order-number' }),
      dataIndex: 'orderNo',
      key: 'order-no',
    },
    {
      title: formatMessage({ id: 'spec.name' }),
      dataIndex: 'dataSpec',
      key: 'data-spec',
    },
    {
      title: formatMessage({id: 'spec.data-type'}),
      dataIndex: 'dataType',
      key: 'data-type',
    },
    {
      title: formatMessage({id: 'spec.request-time'}),
      dataIndex: 'requestTime',
      key: 'request-time',
    },
    {
      title: formatMessage({id: 'spec.response-status'}),
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: formatMessage({id: 'spec.response-time'}),
      dataIndex: 'responseTime',
      key: 'response-time',
    },
    {
      title: formatMessage({id: 'spec.transaction-amount'}),
      dataIndex: 'transactionAmount',
      key: 'transaction-amount',
    },
  ];

  componentDidMount () {
    this.setState({
      loading: true,
    });

    fetchResponses().then((data) => {
      this.setState({
        dataSource: data.map((item) => ({
          key: item.offer_id,
          orderNo: item.offer_id,
          dataSpec: item.put_offer_tx.offer_body.data_spec,
          dataType: formatMessage({id: 'spec.blacklist'}),
          requestTime: new Date(item.created_at * 1000).toLocaleString(),
          state: item.responded_at ? formatMessage({id: 'spec.response-success'}) : formatMessage({id: 'spec.response-error'}),
          responseTime: item.responded_at ? new Date(item.responded_at * 1000).toLocaleString() : '-',
          transactionAmount: item.responded_at ? `${item.put_offer_tx.offer_body.price} PTS` : '-',
        })),
      });
    }).finally(() => this.setState({
      loading: false,
    }));
  }

  render () {
    const { dataSource, loading } = this.state;
    return (
      <Card title={formatMessage({id: 'menu.data-usage'})}>
        <Table columns={this.columns} dataSource={dataSource} loading={loading} />
      </Card>);
  }
}

export default List;
