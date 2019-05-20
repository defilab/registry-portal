import { fieldTypes } from '@/utils/schema';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import React from 'react';
import ReferenceSelect from '../ReferenceSelect';

const { Option } = Select;

const FieldForm = Form.create()(React.forwardRef(({ form, visible, title, references, onAdd, onCancel }, ref) => {
  const { getFieldDecorator, getFieldValue } = form;
  return (
    <Modal
      visible={visible}
      title={title}
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
          <Row type="flex" gutter={10}>
            <Col span={8}>
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
            </Col>
            <Col span={8} style={{ display: getFieldValue('type') === 'reference' ? 'block' : 'none' }}>
              <Form.Item>
                {
                  getFieldDecorator('reference', {
                    rules: [
                      {
                        required: getFieldValue('type') === 'reference'
                      }
                    ]
                  })(<ReferenceSelect references={references} placeholder="引用类型" />)
                }
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: getFieldValue('type') === 'array' ? 'block' : 'none' }}>
              <Form.Item>
                {
                  getFieldDecorator('arrayItemType', {
                    rules: [
                      {
                        required: getFieldValue('type') === 'array'
                      }
                    ]
                  })(
                    <Select placeholder="元素类型">
                      {
                        fieldTypes
                          .filter(type => type.value !== 'object' && type.value !== 'array')
                          .map(type => <Option value={type.value} key={type.value}>{type.name}</Option>)
                      }
                    </Select>
                  )
                }
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: getFieldValue('type') === 'array' && getFieldValue('arrayItemType') === 'reference' ? 'block' : 'none' }}>
              <Form.Item>
                {
                  getFieldDecorator('arrayItemReference', {
                    rules: [
                      {
                        required: getFieldValue('type') === 'array' && getFieldValue('arrayItemType') === 'reference'
                      }
                    ]
                  })(<ReferenceSelect references={references} placeholder="引用类型" />)
                }
              </Form.Item>
            </Col>
          </Row>
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

export default FieldForm;