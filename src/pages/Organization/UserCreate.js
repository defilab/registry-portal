import { Button, Card, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { createUsers } from '@/services/api';
import handleError from '@/utils/handleError'

const Create = Form.create()(({ form, history }) => {

  const { getFieldDecorator } = form;
  const [submitting, setSubmitting] = useState(false)
  const namespace = window.location.pathname.split('/')[2]

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSubmitting(true)
        createUsers({
          username: values.name,
          password: values.password,
          namespace
        }).then(() => {
          history.push(`/organization/${namespace}/users`)
        }).catch((error) => {
          handleError(error).then((data) => {
            message.error(data)
          }).catch(() => {
            message.error('解析错误或未知错误')
          })
        })
          .finally(() => setSubmitting(false))
      }
    });
  };

  return (
    <Card
      bordered={false}
      title='新建用户'
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="用户名">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入用户名' }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('password', {
            initialValue: '',
            rules: [
              { required: true, message: '请输入密码' }
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