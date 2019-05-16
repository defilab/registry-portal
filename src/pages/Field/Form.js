/* eslint-disable no-underscore-dangle */
import { createField, fetchField, updateField, fetchAllFields } from '@/services/api';
import { Button, Card, Form, Icon, Input, Modal, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { parseSubFields } from '@/utils/schema';

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
                  fieldTypes
                    .filter(type => type.value !== 'object')
                    .map(type => <Option value={type.value} key={type.value}>{type.name}</Option>)
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

const SubFields = ({ fields, onFieldAdded, onFieldRemoved }) => {
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
    },
    {
      title: '',
      key: 'delete',
      render: (text, record, index) => (
        <Icon type="minus-circle" onClick={() => onFieldRemoved(index)} />
      )
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
        <Table size="small" columns={columns} dataSource={fields} rowKey="name" pagination={false} />
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

const FieldForm = Form.create()(({ form, mode, fieldId }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [subFields, setSubFields] = useState([]);
  const [references, setReferences] = useState([]);

  const { getFieldDecorator, getFieldValue } = form;

  const addSubField = (subField) => setSubFields(oldFields => [...oldFields, subField]);

  const removeSubField = (index) => setSubFields(oldFields => oldFields.slice(0, index).concat(oldFields.slice(index + 1)));

  const formatSubField = (subField) => {
    const result = {
      description: subField.description
    };
    const { user: { currentUser: { namespace } } } = window.g_app._store.getState();

    switch (subField.type) {
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
        result.$ref = `#/organizations/${namespace}/fields/${subField.reference}`;
        break;
      default:
        throw new Error(`Unknown field type ${subField.type}`)
    }

    return result;
  };

  const formatDefinition = (data) => {
    const result = {};

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
        subFields.forEach(subField => {
          result.properties[subField.name] = formatSubField(subField);
        });
        break;
      case 'reference':
        result.$ref = data.reference;
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

      setSubmitting(true);
      const data = formatData(values);
      if (mode === 'create') {
        createField(data)
          .then((result) => router.push(`/fields/${result.id}`))
          .catch(() => setSubmitting(false));
      } else if (mode === 'edit') {
        delete data.canonical_name;
        updateField(form.getFieldValue('id'), data)
          .then((result) => router.push(`/fields/${result.id}`))
          .catch(() => setSubmitting(false));
      }
    });
  };

  const populateSubFields = (properties) => {
    setSubFields(parseSubFields(properties));
  };

  useEffect(() => {
    if (mode === 'edit') {
      setLoading(true);
      fetchField(fieldId).then((field) => {
        setTimeout(() => {
          form.setFieldsValue({
            id: field.id,
            name: field.name,
            canonicalName: field.canonical_name,
            description: field.description,
            type: field.definition.type || 'reference',
            reference: field.definition.$ref
          });
        }, 0);
        if (field.definition.type === 'object') {
          populateSubFields(field.definition.properties);
        }
      }).finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    fetchAllFields().then(setReferences);
  }, []);

  return (
    <Card
      bordered={false}
      title={mode === 'edit' ? '编辑字段' : '新建字段'}
      loading={loading}
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 8 }}>
        {
          mode === 'edit' && (
            <Form.Item label="ID">
              {
                getFieldDecorator('id', {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled />)
              }
            </Form.Item>
          )
        }
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
            })(<Input disabled={mode === 'edit'} />)
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
              <Form.Item style={{ display: getFieldValue('type') === 'reference' ? 'block' : 'none' }}>
                {
                  getFieldDecorator('reference', {
                    rules: [
                      {
                        required: getFieldValue('type') === 'reference'
                      }
                    ]
                  })(
                    <Select placeholder="请选择引用类型">
                      {
                        references.filter(ref => ref.canonical_name !== getFieldValue('canonicalName')).map(ref => (
                          <Option
                            value={`#/organizations/${ref.namespace}/fields/${ref.id}`}
                            key={ref.canonical_name}
                          >
                            {ref.name}
                          </Option>
                        ))
                      }
                    </Select>
                  )
                }
              </Form.Item>
              {
                getFieldValue('type') === 'object' &&
                <SubFields fields={subFields} onFieldAdded={addSubField} onFieldRemoved={removeSubField} />
              }
            </div>
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 10, offset: 7 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            <FormattedMessage id="form.submit" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

export default FieldForm;