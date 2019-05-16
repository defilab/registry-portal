import { fetchAllFields } from '@/services/api';
import { Button, Card, Divider, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import styles from './List.less';

const List = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const showNewFiledForm = () => router.push('/fields/create');

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
      title: '创建时间',
      key: 'createdAt',
      dataIndex: 'created_at'
    },
    {
      title: formatMessage({ id: 'spec.operations' }),
      render: (text, record) => (
        <>
          <Link to={`/fields/${record.id}`}>
            {formatMessage({ id: 'view' })}
          </Link>
          <Divider type="vertical" />
          <Link to={`/fields/${record.id}/edit`}>
            {formatMessage({ id: 'edit' })}
          </Link>
        </>
      ),
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetchAllFields().then(setFields).finally(() => setLoading(false));
  }, []);

  return (
    <Card title={formatMessage({ id: 'menu.data-specs' })}>
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
