import DescriptionList from '@/components/DescriptionList';
import { fetchField } from '@/services/api';
import { Card, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatMessage } from 'umi/locale';
import NavLink from 'umi/navlink';
import { parseObjectProperties } from '@/utils/schema';
import FieldsTable from '@/components/Field/FieldsTable';
import { formatDate } from '@/utils/datetime';
import handleError from '@/utils/handleError'

const { Description } = DescriptionList;
// eslint-disable-next-line no-underscore-dangle
const { user: { currentUser } } = window.g_app._store.getState();

const View = ({ match }) => {
  const [field, setField] = useState({ definition: {} });
  const [subFields, setSubFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const populateSubFields = (properties) => {
    setSubFields(parseObjectProperties(properties));
  };

  useEffect(() => {
    const { id } = match.params;
    setLoading(true);
    fetchField(id).then((result) => {
      setField(result);
      if (result.definition.type === 'object') {
        populateSubFields(result.definition.properties);
      }
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('未知错误')
        })
      })
      .finally(() => setLoading(false));
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
        <Description term="ID">{field.id}</Description>
        <Description term="名称">{field.name}</Description>
        <Description term="标识">{field.canonical_name}</Description>
        <Description term="描述">{field.description}</Description>
        <Description term="创建时间">{formatDate(field.created_at)}</Description>
        {
          currentUser.namespace !== 'platform' && <Description term="平台字段">{field.namespace === 'platform' ? '是' : '否'}</Description>
        }
        <Description term="类型">
          {field.definition.type ? formatMessage({ id: `spec.field.type.${field.definition.type}` }) : (
            <NavLink to={`/data/fields/${parseCanonicalName(field.definition.$ref)}`}>
              引用
            </NavLink>
          )}
        </Description>
      </DescriptionList>
      {
        field.definition.type === 'object' && (
          <FieldsTable editable={false} fields={subFields} />
        )
      }
    </Card>
  );
};

export default View;