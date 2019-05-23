import React, { PureComponent, Fragment } from 'react';
import { Card, Table, Button, Divider, message } from 'antd';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import { fetchOrganizations } from '@/services/api';
import styles from './TableList.less';
import handleError from '@/utils/handleError'

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
      title: '名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '标识',
      key: 'namespace',
      dataIndex: 'namespace'
    },
    {
      title: formatMessage({ id: 'organization.creation-time' }),
      render: (_, record) => moment(record.created_at).format('YYYY-MM-DD'),
      key: 'creation-time',
      dataIndex: 'creationTime',
    },
    {
      title: formatMessage({ id: 'organization.operations' }),
      render: (record) => (
        <Fragment>
          <Link to={`/organizations/${record.namespace}`}>{formatMessage({ id: 'view' })}</Link>
          <Divider type="vertical" />
          <Link to={`/organizations/${record.namespace}/edit`}>{formatMessage({ id: 'edit' })}</Link>
        </Fragment>
      )
    },
  ];

  componentDidMount() {
    this.setState({
      loading: true,
    });
    fetchOrganizations()
      .then(data => {
        this.setState({
          dataSource: data.map((item, index) => ({
            key: index,
            id: item.id,
            name: item.name,
            namespace: item.namespace,
            role: item.roles,
            created_at: item.created_at,
          })),
        });
      })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('解析错误或未知错误')
        })
      })
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    const { dataSource, loading } = this.state;
    const showNewSpecForm = () => router.push('/organizations/create');
    return (
      <Card title="企业列表">
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={showNewSpecForm}>
              {formatMessage({ id: 'new' })}
            </Button>
          </div>
          <Table columns={this.columns} dataSource={dataSource} loading={loading} />
        </div>
      </Card>
    );
  }
}

export default List;