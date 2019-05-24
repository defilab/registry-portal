import { deleteDataSpec } from '@/services/api';
import { formatDatetime } from '@/utils/datatime';
import handleError from '@/utils/handleError';
import { Button, Card, Divider, message, Modal, Table } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import styles from './TableList.less';

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
        <>
          <Link to={`/data/specs/${record.id}`}>{formatMessage({ id: 'view' })}</Link>
          <Divider type="vertical" />
          <Link to={`/data/specs/${record.id}/edit`}>{formatMessage(
            { id: 'edit' })}
          </Link>
          <Divider type="vertical" />
          <a
            onClick={() =>
              Modal.confirm({
                title: '删除数据接口',
                content: '确定删除该数据接口吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => deleteDataSpec(record.id)
                  .then(() => {
                    message.success('删除成功');
                  })
                  .then(this.loadData.bind(this))
                  .catch((error) => {
                    handleError(error).then((msg) => {
                      message.error(msg);
                    }).catch(() => {
                      message.error('删除失败');
                    })
                  })
              })
            }
          >
            删除
          </a>
        </>
      ),
    },
  ];

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSpec/list',
    });
  }

  render() {
    const showNewSpecForm = () => router.push('/data/specs/create');
    const { dataSpec, loading } = this.props;
    const dataSource = dataSpec.dataSpecs.map((item) => ({
      key: item.id,
      id: item.id,
      spec: 'blacklist',
      name: item.name,
      state: formatMessage({ id: `spec.status-${item.state}` }),
      createdAt: formatDatetime(item.created_at),
      canonicalName: item.canonical_name,
      alive: item.alive
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
