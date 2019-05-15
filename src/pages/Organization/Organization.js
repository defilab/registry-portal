import React, { PureComponent, Fragment } from 'react';
import { Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import moment from 'moment';
import { fetchOrganizations } from '../../services/api';

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
      title: formatMessage({ id: 'organization.name' }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'organization.namespace' }),
      key: 'namespace',
      dataIndex: 'namespace',
    },
    {
      title: formatMessage({ id: 'organization.role' }),
      key: 'role',
      render: (_, record) => this.roleToString(record.role),
    },
    {
      title: formatMessage({ id: 'organization.creation-time' }),
      render: (_, record) => moment(record.created_at).format('YYYY-MM-DD'),
      key: 'creation-time',
      dataIndex: 'creationTime',
    },
    {
      title: formatMessage({ id: 'organization.operations' }),
      render: (text, record) => (
        <Fragment>
          <Link to={`/organization/${record.namespace}/info`}>{formatMessage({ id: 'view' })}</Link>
        </Fragment>
      ),
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
            role: item.role,
            created_at: item.created_at,
          })),
        });
      })
      .finally(() =>
        this.setState({
          loading: false,
        })
      );
  }

  roleToString = role => {
    switch (role) {
      case 'requester':
        return formatMessage({ id: 'organization.requester' });
      case 'responder':
        return formatMessage({ id: 'organization.responder' });
      case 'both':
        return formatMessage({ id: 'organization.both' });
      default:
        return '';
    }
  };

  render() {
    const { dataSource, loading } = this.state;
    return (
      <Card title={formatMessage({ id: 'menu.organization' })}>
        <Table columns={this.columns} dataSource={dataSource} loading={loading} />
      </Card>
    );
  }
}

export default List;
