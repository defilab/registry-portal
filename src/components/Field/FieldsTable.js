import { Icon, Table } from 'antd';
import React, { useState } from 'react';
import FieldForm from './FieldForm';
import { SchemaType } from '@/utils/schema';

const FieldsTable = ({ title, fields, references, editable, onFieldAdded, onFieldRemoved }) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const formRef = React.createRef();

  const columns = [
    {
      title: '名称',
      key: 'name',
      width: '150px',
      dataIndex: 'name'
    },
    {
      title: '类型',
      key: 'type',
      width: '150px',
      render: (text, record) => (
        <SchemaType schema={record} />
      )
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description'
    }
  ];

  if (editable) {
    columns.push({
      title: '操作',
      key: 'delete',
      render: (text, record, index) => (
        <Icon type="minus-circle" onClick={() => onFieldRemoved(index)} />
      )
    });
  }

  const formValuesToSchemaData = formValues => {
    const result = {
      name: formValues.name,
      type: formValues.type
    };

    switch (formValues.type) {
      case 'array':
        result.items = { type: formValues.arrayItemType }
        switch (formValues.arrayItemType) {
          case 'reference':
            result.items.reference = formValues.arrayItemReference
            break;
          default:
        }
        break;
      case 'reference':
        result.reference = formValues.reference
        break;
      default:
    }

    return result;
  };

  const onAdd = () => {
    const form = formRef.current;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }


      onFieldAdded(formValuesToSchemaData(values));
      form.resetFields();
      setDialogVisible(false);
    });

  };

  const onCancel = () => {
    formRef.current.resetFields();
    setDialogVisible(false);
  }

  return (
    <div>
      <div>
        <div style={{ marginBottom: '4px' }}>
          {
            title && <span style={{ fontSize: '15px', fontWeight: 'bold', marginRight: '8px' }}>{title}</span>
          }
          {
          editable && <Icon type="plus" onClick={() => setDialogVisible(true)} style={{ color: 'blue' }} />
          }
        </div>
        <Table size="small" columns={columns} dataSource={fields} rowKey="name" pagination={false} />
      </div>
      <FieldForm
        ref={formRef}
        visible={isDialogVisible}
        title="新建字段"
        references={references}
        onAdd={onAdd}
        onCancel={onCancel}
      />
    </div>
  );
};

export default FieldsTable;