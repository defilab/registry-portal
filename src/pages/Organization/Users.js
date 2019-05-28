import React, { PureComponent } from 'react';
import { Card, Table, Button, Divider, Modal, message } from 'antd';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { fetchUsers, deleteUsers } from '@/services/api';
import styles from './TableList.less';
import handleError from '@/utils/handleError'

class List extends PureComponent {
  state = {
    dataSource: [],
    loading: false,
  };

  columns = [
    {
      title: 'name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'organization.operations' }),
      render: (record) => (
        <>
          <Link to={`/organizations/${record.namespace}/users/${record.key}/edit`}>{formatMessage({ id: 'edit' })}</Link>
          <Divider type="vertical" />
          <a
            onClick={() => {
              Modal.confirm({
                title: '删除用户',
                content: '确定删除该用户吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => deleteUsers(record.id).then(() => {
                  const namespace = window.location.pathname.split('/')[2]
                  window.history.push(`/organizations/${namespace}/users`)
                }).catch((error) => {
                  handleError(error).then((data) => {
                    message.error(data)
                  }).catch(() => {
                    message.error('未知错误')
                  })
                })
              });
            }}
          >
            删除
          </a>
        </>
      )
    }
  ];

  componentDidMount() {
    this.setState({
      loading: true,
    });
    const namespace = window.location.pathname.split('/')[2]
    fetchUsers(namespace).then(data => {
      this.setState({
        dataSource: data.items.map((item) => ({
          name: item.username,
          key: item.id,
          id: item.id,
          namespace: item.namespace

        }))
      })
    }).catch((error) => {
      handleError(error).then((data) => {
        message.error(data)
      }).catch(() => {
        message.error('未知错误')
      })
    })
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    const { dataSource, loading } = this.state;
    const showNewSpecForm = () => router.push(`users/create`);
    return (
      <Card title="用户列表">
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