import { formatDate } from '@/utils/datetime';
import handleError from '@/utils/handleError';
import { parseSchema, SchemaType } from '@/utils/schema';
import { Card, message, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import styles from './List.less';
import { fetchPlatformFields } from '@/services/api';

const List = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetchPlatformFields().then(data => {
      setFields(data.map(field => ({
        ...field,
        definition: parseSchema(field.definition)
      })))
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('网络错误')
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
      dataIndex: 'name'
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
        </>
      ),
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card title="通用字段列表">
      <div className={styles.tableList}>
        <Table columns={columns} dataSource={fields} loading={loading} rowKey="canonical_name" />
      </div>
    </Card>
  )
};

export default List
