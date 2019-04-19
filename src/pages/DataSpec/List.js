import React, { Fragment, PureComponent } from 'react';
import { Button, Card, Divider, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import Link from 'umi/link';
import { connect } from 'dva';
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
      title: formatMessage({ id: 'spec.public' }),
      key: 'public',
      dataIndex: 'public',
    },
    {
      title: formatMessage({ id: 'spec.creation-time' }),
      key: 'creation-time',
      dataIndex: 'creationTime',
    },
    {
      title: formatMessage({ id: 'spec.review-status' }),
      key: 'review-state',
      render: (text, record) => formatMessage({ id: `spec.review-${record.reviewState}` }),
    },
    {
      title: formatMessage({ id: 'spec.operations' }),
      render: (text, record) => (
        <Fragment>
          {
            record.reviewState === 'accepted' ?
              <Fragment>
                <Link to={`/data-specs/${record.spec}`}>{formatMessage({ id: 'view' })}</Link>
                <Divider type="vertical" />
                <Link to={`/data-specs/${record.spec}/edit`}>{formatMessage(
                  { id: 'edit' })}
                </Link>
              </Fragment> :
              ''
          }
        </Fragment>
      ),
    },
  ];

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataSpec/list',
    });
  }

  render () {
    const showNewSpecForm = () => router.push('/data-specs/create');
    const { dataSpec, loading } = this.props;
    const dataSource = dataSpec.dataSpecs.map((item) => ({
      key: item.id,
      id: item.id,
      spec: 'blacklist',
      name: item.name,
      state: formatMessage({ id: `spec.status-${item.state}` }),
      public: item.public ? formatMessage({ id: `yes` }) : formatMessage({ id: `no` }),
      creationTime: new Date(item.created_at).toLocaleString(),
      canonicalName: item.canonical_name,
      reviewState: item.reviewState,
    }));
    return (
      <Card title={formatMessage({ id: 'menu.data-specs' })}>
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
