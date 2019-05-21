import React, { useState } from 'react';
import { Button, Card, Form, Input } from 'antd';
import { FormattedMessage } from 'umi/locale';
import { createOrganization } from '../../services/api';

const Create = Form.create()(({ form, history }) => {

  const { getFieldDecorator } = form;
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSubmitting(true)
        createOrganization({ name: values.name, namespace: values.namespace })
          .then(() => {
            setSubmitting(false)
            history.push(`/organization`)
          })
      }
    });
  };

  return (
    <Card
      bordered={false}
      title='新建企业信息'
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            initialValue: '',
            rules: [
              { required: true, message: '请输入名称' }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="标识">
          {getFieldDecorator('namespace', {
            initialValue: '',
            rules: [
              { required: true, message: '请输入标记' }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item wrapperCol={{ span: 10, offset: 7 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            <FormattedMessage id="form.save" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});


export default Create;