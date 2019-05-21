import { fetchAllFields } from '@/services/api';
import { Button, Card, Divider, Table, message } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import styles from './List.less';
import { formatDatetime } from '@/utils/datatime';
import { parseSchema, SchemaType } from '@/utils/schema';
import handleError from '@/utils/handleError'

const List = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const showNewFiledForm = () => router.push('/fields/create');

  // eslint-disable-next-line no-underscore-dangle
  const { user: { currentUser } } = window.g_app._store.getState();

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
            record.namespace !== currentUser.namespace && <span style={{ color: 'rgba(0,0,0,.25)' }}> (平台字段)</span>
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
      render: (text) => formatDatetime(text)
    },
    {
      title: formatMessage({ id: 'spec.operations' }),
      render: (text, record) => (
        <>
          <Link to={`/fields/${record.id}`}>
            {formatMessage({ id: 'view' })}
          </Link>
          {
            record.namespace === currentUser.namespace &&
            <>
              <Divider type="vertical" />
              <Link to={`/fields/${record.id}/edit`}>
                {formatMessage({ id: 'edit' })}
              </Link>
            </>
          }
        </>
      ),
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetchAllFields().then(data => {
      setFields(data.map(field => ({
        ...field,
        definition: parseSchema(field.definition)
      })))
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('解析错误或未知错误')
        })
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card title="字段列表">
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary" onClick={showNewFiledForm}>
            {formatMessage({ id: 'new' })}
          </Button>
        </div>
        <Table columns={columns} dataSource={fields} loading={loading} rowKey="canonical_name" />
      </div>
    </Card>
  )
};

export default List
