import DescriptionList from '@/components/DescriptionList';
import { fetchField } from '@/services/api';
import { Card, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi/locale';
import NavLink from 'umi/navlink';
import { parseSubFields } from '@/utils/schema';

const { Description } = DescriptionList;

const SubFields = ({ fields }) => {
  const columns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type'
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description'
    }
  ];

  return (
    <Table size="small" columns={columns} dataSource={fields} rowKey="name" pagination={false} style={{ width: '600px', marginTop: '16px' }} />
  );
};

const View = ({ match }) => {
  const [field, setField] = useState({ definition: {} });
  const [subFields, setSubFields] = useState([]);
  const [loading, setLoading] = useState(false);


  const populateSubFields = (properties) => {
    setSubFields(parseSubFields(properties));
  };

  useEffect(() => {
    const { id } = match.params;
    setLoading(true);
    fetchField(id).then((result) => {
      setField(result);
      if (result.definition.type === 'object') {
        populateSubFields(result.definition.properties);
      }
    }).finally(() => setLoading(false));
  }, [match]);

  const parseCanonicalName = ref =>
    ref && ref.substr(ref.lastIndexOf('/') + 1);

  return (
    <Card
      title="字段详情"
      bordered={false}
      loading={loading}
    >
      <DescriptionList col="1">
        <Description term="id">{field.id}</Description>
        <Description term="名称">{field.name}</Description>
        <Description term="标识">{field.canonical_name}</Description>
        <Description term="描述">{field.description}</Description>
        <Description term="创建时间">{field.created_at}</Description>
        <Description term="类型">
          {field.definition.type ? formatMessage({ id: `spec.field.type.${field.definition.type}` }) : (
            <NavLink to={`/fields/${parseCanonicalName(field.definition.$ref)}`}>
              引用
            </NavLink>
          )}
        </Description>
      </DescriptionList>
      {
        field.definition.type === 'object' && (
          <SubFields fields={subFields} />
        )
      }
    </Card>
  );
};

export default View;