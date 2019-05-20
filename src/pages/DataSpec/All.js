import React, { PureComponent } from 'react';
import { Button, Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Link from 'umi/link';
import styles from './TableList.less';
import { formatDatetime } from '@/utils/datatime';
import { fetchAllDataSpecs } from '@/services/api';

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
      title: 'NS',
      key: 'namespace',
      dataIndex: 'namespace'
    },
    {
      title: formatMessage({ id: 'spec.status' }),
      key: 'state',
      dataIndex: 'state',
    },
    {
      title: formatMessage({ id: 'spec.creation-time' }),
      key: 'createdAt',
      dataIndex: 'createdAt',
    },
    {
      title: formatMessage({ id: 'spec.operations' }),
      render: (text, record) => (
        <Link to={`/data-specs/${record.id}`}>{formatMessage({ id: 'view' })}</Link>
      ),
    },
  ];

  componentDidMount() {
    this.setState({
      loading: true
    });

    fetchAllDataSpecs().then(data => this.setState({
      dataSpecs: data
    })).finally(() => this.setState({
      loading: false
    }));
  }

  render() {
    const showNewSpecForm = () => router.push('/data-specs/create');
    const { dataSpecs, loading } = this.state;
    const dataSource = dataSpecs.map((item) => ({
      key: item.id,
      id: item.id,
      spec: item.canonical_name,
      name: item.name,
      state: formatMessage({ id: `spec.status-${item.state}` }),
      createdAt: formatDatetime(item.created_at),
      canonicalName: item.canonical_name,
      namespace: item.namespace
    }));
    return (
      <Card title="数据接口列表">
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={showNewSpecForm}>
              {formatMessage({ id: 'new' })}
            </Button>
          </div>
          <Table columns={this.columns} dataSource={dataSource} loading={loading} />
        </div>
      </Card>);
  }
}

export default List;
