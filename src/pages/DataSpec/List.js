import React, { PureComponent } from 'react';
import { Button, Card, Divider, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './TableList.less';
import { formatDatetime } from '@/utils/datatime';

@connect(({ dataSpec, loading }) => ({
  dataSpec,
  loading: loading.effects['dataSpec/list'],
}))
class List extends PureComponent {
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
        <>
          <Link to={`/data-specs/${record.id}`}>{formatMessage({ id: 'view' })}</Link>
          <Divider type="vertical" />
          <Link to={`/data-specs/${record.id}/edit`}>{formatMessage(
            { id: 'edit' })}
          </Link>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSpec/list',
    });
  }

  render() {
    const showNewSpecForm = () => router.push('/data-specs/create');
    const { dataSpec, loading } = this.props;
    const dataSource = dataSpec.dataSpecs.map((item) => ({
      key: item.id,
      id: item.id,
      spec: 'blacklist',
      name: item.name,
      state: formatMessage({ id: `spec.status-${item.state}` }),
      createdAt: formatDatetime(item.created_at),
      canonicalName: item.canonical_name
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
