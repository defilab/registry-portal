import { fetchFields, deleteField } from '@/services/api';
import { formatDate } from '@/utils/datetime';
import handleError from '@/utils/handleError';
import { parseSchema, SchemaType } from '@/utils/schema';
import { Button, Card, Divider, message, Modal, Table, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import styles from './List.less';

const List = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const showNewFiledForm = () => router.push('/data/fields/create');

  // eslint-disable-next-line no-underscore-dangle
  const { user: { currentUser } } = window.g_app._store.getState();

  const loadData = () => {
    setLoading(true);
    fetchFields().then(data => {
      setFields(data.map(field => ({
        ...field,
        definition: parseSchema(field.definition)
      })))
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('数据加载失败')
        })
      })
      .finally(() => setLoading(false));
  }

  const columns = [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>
          {text}
          {
            record.namespace !== currentUser.namespace && <span style={{ color: 'rgba(0,0,0,.25)' }}> (通用字段)</span>
          }
        </span>
      )
    },
    {
      title: '标识',
      key: 'canonicalName',
      dataIndex: 'canonical_name'
    },
    {
      title: '类型',
      key: 'type',
      render: (text, record) => (
        <SchemaType schema={record.definition} />
      )
    },
    {
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'created_at',
      render: (text) => formatDate(text)
    },
    {
      title: formatMessage({ id: 'spec.operations' }),
      render: (text, record) => (
        <>
          <Link to={`/data/fields/${record.id}`}>
            {formatMessage({ id: 'view' })}
          </Link>
          {
            record.namespace === currentUser.namespace &&
            <>
              <Divider type="vertical" />
              <Link to={`/data/fields/${record.id}/edit`}>
                {formatMessage({ id: 'edit' })}
              </Link>
              <Divider type="vertical" />
              <a
                onClick={() =>
                  Modal.confirm({
                    title: '删除字段',
                    content: '确定删除该字段吗？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => deleteField(record.id)
                      .then(() => {
                        message.success('删除成功');
                      })
                      .then(loadData)
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
          }
        </>
      ),
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card title="字段列表">
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Row type="flex" justify="middle">
            <div style={{ flexGrow: 1 }}>
              <Button icon="plus" type="primary" onClick={showNewFiledForm}>
                {formatMessage({ id: 'new' })}
              </Button>
            </div>
            <Link to="/data/fields/platform">通用字段</Link>
          </Row>
        </div>
        <Table columns={columns} dataSource={fields} loading={loading} rowKey="canonical_name" />
      </div>
    </Card>
  )
};

export default List
