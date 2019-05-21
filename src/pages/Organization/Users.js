import React, { PureComponent, Fragment } from 'react';
import { Card, Table, Button, Divider, Menu, Modal } from 'antd';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import router from 'umi/router';
import { fetchUsers, deleteUsers } from '../../services/api';
import styles from './TableList.less';

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
      render: (record) => {
        return (
          <Fragment>
            <Link to={`/organization/${record.namespace}/users/${record.key}/edit`}>{formatMessage({ id: 'edit' })}</Link>
            <Divider type="vertical" />
            <a
              onClick={() => {
                Modal.confirm({
                  title: '删除任务',
                  content: '确定删除该任务吗？',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => deleteUsers(record.id).then(() => {
                    const namespace = window.location.pathname.split('/')[2]
                    window.history.push(`/organization/${namespace}/users`)
                  }),
                });
              }}
            >
              删除
            </a>
          </Fragment>
        )
      }
    }
  ];

  componentDidMount() {
    this.setState({
      loading: true,
    });
    const namespace = window.location.pathname.split('/')[2]
    fetchUsers(namespace).then(data => {
      this.setState({
        loading: false,
      })
      this.setState({
        dataSource: data.items.map((item) => ({
          name: item.username,
          key: item.id,
          id: item.id,
          namespace: item.namespace

        }))
      })
    })
  }

  render() {
    const { dataSource, loading } = this.state;
    const showNewSpecForm = () => router.push(`users/create`);
    return (
      <Card title={formatMessage({ id: 'menu.view.users' })}>
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