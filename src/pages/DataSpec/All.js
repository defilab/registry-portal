import React, { PureComponent } from 'react';
import { Card, Table, message } from 'antd';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import styles from './TableList.less';
import { formatDate } from '@/utils/datetime';
import { fetchAllDataSpecs } from '@/services/api';
import handleError from '@/utils/handleError'

class List extends PureComponent {
  state = {
    dataSpecs: [],
    loading: false
  };

  columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: formatMessage({ id: 'spec.name' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'spec.canonical-name' }),
      key: 'spec',
      dataIndex: 'canonicalName',
    },
    {
      title: '企业',
      key: 'namespace',
      dataIndex: 'namespace'
    },
    {
      title: formatMessage({ id: 'spec.status' }),
      key: 'state',
      dataIndex: 'state',
    },
    {
      title: '活跃',
      key: 'alive',
      dataIndex: 'alive',
      render: (text, record) => record.alive ? '是' : '否'
    },
    {
      title: formatMessage({ id: 'spec.creation-time' }),
      key: 'createdAt',
      dataIndex: 'createdAt',
    },
    {
      title: formatMessage({ id: 'spec.operations' }),
      render: (text, record) => (
        <Link to={`/data/all-specs/${record.id}`}>{formatMessage({ id: 'view' })}</Link>
      ),
    },
  ];

  componentDidMount() {
    this.setState({
      loading: true
    });

    fetchAllDataSpecs().then(data => this.setState({
      dataSpecs: data
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
    const { dataSpecs, loading } = this.state;
    const dataSource = dataSpecs.map((item) => ({
      key: item.id,
      id: item.id,
      spec: item.canonical_name,
      name: item.name,
      state: formatMessage({ id: `spec.status-${item.state}` }),
      createdAt: formatDate(item.created_at),
      canonicalName: item.canonical_name,
      namespace: item.namespace,
      alive: item.alive
    }));
    return (
      <Card title="数据接口查询">
        <div className={styles.tableList}>
          <Table columns={this.columns} dataSource={dataSource} loading={loading} />
        </div>
      </Card>);
  }
}

export default List;
