import FieldsTable from '@/components/Field/FieldsTable';
import * as api from '@/services/api';
import { usePromise } from '@/utils/hooks';
import { Button, Card, Form, Input, InputNumber, notification, Radio, Select, Row, Col, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { formatSchema, parseSchema } from '@/utils/schema';
import ReferenceSelect from '@/components/ReferenceSelect';
import handleError from '@/utils/handleError'

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 }
  }
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 }
  }
};

const responseTypes = [
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
  },
  {
    name: '数组',
    value: 'array'
  }
]

const DataSpecForm = Form.create()(({ form, onSubmit, mode, spec: canonicalName }) => {
  const [platformDataSpecs, fetchingPlatformDataSpecs, fetchPlatformDataSpecs] =
    usePromise(api.fetchPlatformDataSpecs, []);
  const [dataSpec, fetchingDataSpec, fetchDataSpec] = usePromise(() => api.fetchDataSpec(canonicalName));
  const [, submitting, submit] = usePromise(onSubmit, undefined, (error) => {
    notification.error({
      message: error.message
    });
  });
  const [references, fetchingReferences, fetchReferences] = usePromise(api.fetchAllFields, []);
  const [requestFields, setRequestFields] = useState([]);
  const [responseFields, setResponseFields] = useState([]);
  const [responseArrayFields, setResponseArrayFields] = useState([]);

  useEffect(() => {
    fetchPlatformDataSpecs().catch((error) => {
      handleError(error).then((data) => {
        message.error(data)
      }).catch(() => {
        message.error('数据加载失败')
      })
    });
    if (mode === 'edit') {
      fetchDataSpec().catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('数据加载失败')
        })
      });
    }
  }, []);

  useEffect(() => {
    fetchReferences().catch((error) => {
      handleError(error).then((data) => {
        message.error(data)
      }).catch(() => {
        message.error('数据加载失败')
      })
    });
  }, []);

  useEffect(() => {
    if (mode === 'edit' && dataSpec) {
      let requestSchema = {
        type: 'object',
        properties: []
      };
      let responseSchema = {};
      if (!dataSpec.reference) {
        requestSchema = parseSchema(dataSpec.definition.qualifiers);
        setRequestFields(requestSchema.properties);
        responseSchema = parseSchema(dataSpec.definition.response);
        if (responseSchema.type === 'object') {
          setResponseFields(responseSchema.properties);
        }
        if (responseSchema.type === 'array' && responseSchema.items.type === 'object') {
          setResponseArrayFields(responseSchema.items.properties);
        }
      }
      form.setFieldsValue({
        id: dataSpec.id,
        name: dataSpec.name,
        canonicalName: dataSpec.canonical_name,
        price: dataSpec.price / 100.0,
        description: dataSpec.description,
        state: dataSpec.state,
        specReference: dataSpec.reference,
        useCustomFields: !dataSpec.reference,
        responseReference: responseSchema.type === 'reference' ? responseSchema.reference : undefined,
        responseType: responseSchema.type,
        responseArrayItemType: responseSchema.type === 'array' ? responseSchema.items.type : undefined,
        responseArrayItemReference: responseSchema.type === 'array' && responseSchema.items.type === 'reference' ? responseSchema.items.reference : undefined
      });
    }
  }, [dataSpec]);

  const { getFieldDecorator, getFieldValue } = form;

  const formValuesToSchemaData = formValues => {
    const result = {
      type: formValues.responseType
    };

    switch (formValues.responseType) {
      case 'object':
        result.properties = responseFields
        break;
      case 'array':
        result.items = { type: formValues.responseArrayItemType }
        switch (formValues.responseArrayItemType) {
          case 'object':
            result.items.properties = responseArrayFields
            break;
          case 'reference':
            result.items.reference = formValues.responseArrayItemReference
            break;
          default:
        }
        break;
      case 'reference':
        result.reference = formValues.responseReference
        break;
      default:
    }

    return result;
  };

  const formatDefinition = formValues =>
    (
      {
        qualifiers: formatSchema({
          type: 'object',
          properties: requestFields
        }),
        response: formatSchema(formValuesToSchemaData(formValues))
      }
    );

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!values.useCustomFields) {
          const data = {
            id: values.id,
            name: values.name,
            state: values.state,
            price: values.price * 100,
            description: values.description,
            reference: values.specReference
          }
          submit(data);
        } else {
          const data = {
            id: values.id,
            name: values.name,
            state: values.state,
            price: values.price * 100,
            description: values.description,
            canonical_name: values.canonicalName,
            definition: formatDefinition(values)
          }
          submit(data);
        }
      }
    });
  };

  const onUseCustomFieldsChange = () => {
    form.setFieldsValue({
      canonicalName: undefined
    });
  };

  const onRequestFieldAdded = (field) => setRequestFields(oldFields => [...oldFields, field]);
  const onRequestFieldRemoved = (index) => setRequestFields(oldFields => oldFields.slice(0, index).concat(oldFields.slice(index + 1)));
  const onResponseFieldAdded = (field) => setResponseFields(oldFields => [...oldFields, field]);
  const onResponseFieldRemoved = (index) => setResponseFields(oldFields => oldFields.slice(0, index).concat(oldFields.slice(index + 1)));
  const onResponseArrayFieldAdded = (field) => setResponseArrayFields(oldFields => [...oldFields, field]);
  const onResponseArrayFieldRemoved = (index) => setResponseArrayFields(oldFields => oldFields.slice(0, index).concat(oldFields.slice(index + 1)));

  return (
    <Card
      bordered={false}
      title={formatMessage({ id: mode === 'create' ? 'spec.new' : 'spec.edit' })}
      loading={fetchingPlatformDataSpecs || fetchingDataSpec || fetchingReferences}
    >
      <Form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label="ID" style={{ display: mode === 'edit' ? 'block' : 'none' }}>
          {getFieldDecorator('id')(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '名称不能为空'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="自定义">
          {getFieldDecorator('useCustomFields', {
            initialValue: false, rules: [
              {
                required: true,
                message: '该选项不能为空'
              }
            ]
          })
            (
              <Radio.Group onChange={onUseCustomFieldsChange}>
                <Radio value>{formatMessage({ id: 'yes' })}</Radio>
                <Radio value={false}>{formatMessage({ id: 'no' })}</Radio>
              </Radio.Group>
            )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="标识" style={{ display: getFieldValue('useCustomFields') ? 'block' : 'none' }}>
          {getFieldDecorator('canonicalName', {
            rules: [
              {
                required: getFieldValue('useCustomFields'),
                message: '标识不能为空'
              }
            ]
          })(
            <Input disabled={mode === 'edit'} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="引用接口" style={{ display: getFieldValue('useCustomFields') ? 'none' : 'block' }}>
          {getFieldDecorator('specReference', {
            rules: [
              {
                required: !getFieldValue('useCustomFields'),
                message: '引用接口不能为空'
              }
            ]
          })(
            <Select disabled={mode === 'edit'}>
              {
                platformDataSpecs.map(
                  (item) => (<Option value={`${item.namespace}.${item.canonical_name}`} key={item.id}>{item.name}</Option>))
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.price" />
            </span>
          }
        >
          {getFieldDecorator('price', {
            rules: [
              {
                required: true,
                message: '价格不能为空'
              }
            ]
          })(<InputNumber />)} 元
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={formatMessage({ id: 'spec.description' })}
        >
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: '描述不能为空'
              }
            ]
          })(
            <TextArea
              style={{ minHeight: 32 }}
              rows={4}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.status' })}>
          {getFieldDecorator('state', {
            initialValue: 'online', rules: [
              {
                required: true,
                message: '姿态不能为空'
              }
            ]
          })
            (
              <Radio.Group>
                <Radio value="online">{formatMessage({ id: 'spec.status-online' })}</Radio>
                <Radio value="offline">{formatMessage({ id: 'spec.status-offline' })}</Radio>
              </Radio.Group>
            )}
        </FormItem>
        <FormItem {...formItemLayout} label="自定义字段" style={{ display: getFieldValue('useCustomFields') ? 'block' : 'none' }}>
          <div>
            <div style={{ fontWeight: 'bold' }}>请求</div>
            <FieldsTable
              title="字段"
              fields={requestFields}
              references={references}
              editable
              onFieldAdded={onRequestFieldAdded}
              onFieldRemoved={onRequestFieldRemoved}
            />
            <div style={{ fontWeight: 'bold', marginTop: '32px' }}>返回结果</div>
            <Row type="flex" gutter={10}>
              <Col span={8}>
                <Form.Item>
                  {
                    getFieldDecorator('responseType', {
                      rules: [
                        {
                          required: getFieldValue('useCustomFields')
                        }
                      ]
                    })(
                      <Select placeholder="返回类型">
                        {
                          responseTypes.map(type => <Option value={type.value} key={type.value}>{type.name}</Option>)
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: getFieldValue('responseType') === 'array' ? 'block' : 'none' }}>
                <Form.Item>
                  {
                    getFieldDecorator('responseArrayItemType', {
                      rules: [
                        {
                          required: getFieldValue('useCustomFields') && getFieldValue('responseType') === 'array'
                        }
                      ]
                    })(
                      <Select placeholder="元素类型">
                        {
                          responseTypes.filter(type => type.value !== 'array').map(type => <Option value={type.value} key={type.value}>{type.name}</Option>)
                        }
                      </Select>
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: getFieldValue('responseType') === 'reference' ? 'block' : 'none' }}>
                <Form.Item>
                  {
                    getFieldDecorator('responseReference', {
                      rules: [
                        {
                          required: getFieldValue('useCustomFields') && getFieldValue('responseType') === 'reference'
                        }
                      ]
                    })(<ReferenceSelect references={references} placeholder="引用类型" />)
                  }
                </Form.Item>
              </Col>
              <Col span={8} style={{ display: getFieldValue('responseType') === 'array' && getFieldValue('responseArrayItemType') === 'reference' ? 'block' : 'none' }}>
                <Form.Item>
                  {
                    getFieldDecorator('responseArrayItemReference', {
                      rules: [
                        {
                          required: getFieldValue('useCustomFields') && getFieldValue('responseType') === 'array' && getFieldValue('arrayElementType')
                        }
                      ]
                    })(<ReferenceSelect references={references} placeholder="引用类型" />)
                  }
                </Form.Item>
              </Col>
            </Row>
            {
              getFieldValue('responseType') === 'object' && (
                <FieldsTable
                  title="字段"
                  fields={responseFields}
                  references={references}
                  editable
                  onFieldAdded={onResponseFieldAdded}
                  onFieldRemoved={onResponseFieldRemoved}
                />
              )
            }
            {
              (getFieldValue('responseType') === 'array' && getFieldValue('responseArrayItemType') === 'object') && (
                <FieldsTable
                  title="字段"
                  fields={responseArrayFields}
                  references={references}
                  editable
                  onFieldAdded={onResponseArrayFieldAdded}
                  onFieldRemoved={onResponseArrayFieldRemoved}
                />
              )
            }
          </div>
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            <FormattedMessage id="form.submit" />
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
});

export default DataSpecForm;
