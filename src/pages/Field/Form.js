import { Button, Card, Form, Icon, Input, Modal, Select, Table } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { createField } from '@/services/api';

const { Option } = Select;

const fieldTypes = [
  {
    name: '数字',
    value: 'number'
  },
  {
    name: '字符串',
    value: 'string'
  },
  {
    name: '布尔值',
    value: 'boolean'
  },
  {
    name: '日期',
    value: 'date'
  },
  {
    name: '时间戳',
    value: 'timestamp'
  },
  {
    name: '对象',
    value: 'object'
  },
  {
    name: '引用',
    value: 'reference'
  }
]

const SubFieldForm = Form.create()(React.forwardRef(({ form, visible, onAdd, onCancel }, ref) => {
  const { getFieldDecorator } = form;
  return (
    <Modal
      visible={visible}
      title="新建子字段"
      onOk={onAdd}
      onCancel={onCancel}
    >
      <Form ref={ref}>
        <Form.Item label="名称">
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input />)
          }
        </Form.Item>
        <Form.Item label="类型">
          {
            getFieldDecorator('type', {
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select>
                {
                  fieldTypes.map(type => <Option value={type.value} key={type.value}>{type.name}</Option>)
                }
              </Select>
            )
          }
        </Form.Item>
        <Form.Item label="描述">
          {
            getFieldDecorator('description', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input.TextArea rows="4" />)
          }
        </Form.Item>
      </Form>
    </Modal>
  )
}));

const SubFields = ({ fields, onFieldAdded }) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const formRef = React.createRef();

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

  const onAdd = () => {
    const form = formRef.current;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      onFieldAdded(values)
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
        <div>
          <span style={{ fontSize: '15px', fontWeight: 'bold', marginRight: '8px' }}>子字段</span>
          <Icon type="plus" onClick={() => setDialogVisible(true)} style={{ color: 'blue' }} />
        </div>
        <Table size="middle" columns={columns} dataSource={fields} rowKey="name" pagination={false} />
      </div>
      <SubFieldForm
        ref={formRef}
        visible={isDialogVisible}
        onAdd={onAdd}
        onCancel={onCancel}
      />
    </div>
  );
};

const FieldForm = Form.create()(({ form }) => {
  const [subFields, setSubFields] = useState([]);

  const { getFieldDecorator, getFieldValue } = form;

  const addSubField = (field) => setSubFields(oldFields => [...oldFields, field]);

  const formatSubField = (field) => {
    const result = {
      description: field.description
    };
    const { user: { currentUser: { namespace } } } = window.g_app._store.getState();

    switch (field.type) {
      case 'number':
        result.type = 'number';
        break;
      case 'string':
        result.type = 'string';
        break;
      case 'boolean':
        result.type = 'boolean';
        break;
      case 'date':
        result.type = 'string';
        result.format = 'date';
        break;
      case 'timestamp':
        result.type = 'string';
        result.format = 'data-time';
        break;
      case 'reference':
        result.$ref = `#/organizations/${namespace}/fields/${field.reference}`;
        break;
      default:
        throw new Error(`Unknown field type ${field.type}`)
    }

    return result;
  };

  const formatDefinition = (data) => {
    const result = {};
    const { user: { currentUser: { namespace } } } = window.g_app._store.getState();

    switch (data.type) {
      case 'number':
        result.type = 'number';
        break;
      case 'string':
        result.type = 'string';
        break;
      case 'boolean':
        result.type = 'boolean';
        break;
      case 'date':
        result.type = 'string';
        result.format = 'date';
        break;
      case 'timestamp':
        result.type = 'string';
        result.format = 'data-time';
        break;
      case 'object':
        result.type = 'object';
        result.properties = {};
        subFields.forEach(field => {
          result.properties[field.canonicalName] = formatSubField(field);
        });
        break;
      case 'reference':
        result.$ref = `#/organizations/${namespace}/fields/${data.reference}`;
        break;
      default:
        throw new Error(`Unknown field type ${data.type}`)
    }

    return result;
  };

  const formatData = (data) => (
    {
      name: data.name,
      canonical_name: data.canonicalName,
      description: data.description,
      definition: formatDefinition(data)
    }
  );

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const data = formatData(values);
      createField(data);
    });
  };

  return (
    <Card
      bordered={false}
      title="新建字段"
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="名称">
          {
            getFieldDecorator('name', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input />)
          }
        </Form.Item>
        <Form.Item label="标识">
          {
            getFieldDecorator('canonicalName', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input />)
          }
        </Form.Item>
        <Form.Item label="描述">
          {
            getFieldDecorator('description', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input.TextArea rows="4" />)
          }
        </Form.Item>
        <Form.Item label="类型">
          <div>
            {
              getFieldDecorator('type', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select>
                  {
                    fieldTypes.map(type => <Option value={type.value} key={type.value}>{type.name}</Option>)
                  }
                </Select>
              )
            }
            <div style={{ marginTop: '16px' }}>
              {
                getFieldValue('type') === 'reference' && getFieldDecorator('reference', {
                  rules: [
                    {
                      required: getFieldValue('type') === 'reference'
                    }
                  ]
                })(
                  <Select placeholder="请选择引用类型" />
                )
              }
              {
                getFieldValue('type') === 'object' && <SubFields fields={subFields} onFieldAdded={addSubField} />
              }
            </div>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 10, offset: 7 }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="form.submit" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

export default FieldForm;