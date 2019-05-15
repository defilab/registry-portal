import React, { useState, useEffect } from 'react';
import { Button, Card, Table } from 'antd';
import { formatMessage } from 'umi/locale';
import { fetchFields } from '@/services/api';
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
    }
  ];

  useEffect(() => {
    setLoading(true);
    fetchFields().then(setFields).finally(() => setLoading(false));
  }, []);

  return (
    <Card title={formatMessage({ id: 'menu.data-specs' })}>
      <div className={styles.tableList}>
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary" onClick={showNewFiledForm}>
            {formatMessage({ id: 'new' })}
          </Button>
        </div>
        <Table columns={columns} dataSource={fields} loading={loading} />
      </div>
    </Card>
  )
};

export default List
