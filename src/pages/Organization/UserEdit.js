import { Button, Card, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUsers } from '@/services/api';
import { usePromise } from '@/utils/hooks';
import handleError from '@/utils/handleError'

const Create = Form.create()(({ form, history }) => {

  const { getFieldDecorator } = form;
  const userId = window.location.pathname.split('/')[4]
  const [submitting, setSubmitting] = useState(false)
  const namespace = window.location.pathname.split('/')[2]

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSubmitting(true)
        updateUsers({
          name: values.name,
          password: values.password,
          userId,
        }).then(() => {
          history.push(`/organizations/${namespace}/users`)
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

  const [data, loading, exec] = usePromise(fetchUsers, []);

  useEffect(() => {
    exec(namespace).catch((error) => {
      handleError(error).then((msg) => {
        message.error(msg)
      }).catch(() => {
        message.error('解析错误或未知错误')
      })
    });

  }, []);
  let dataSource = ''
  if (data.items) {
    dataSource = data.items.filter((item) =>
      item.id === userId
    )
  }
  return (
    <Card
      bordered={false}
      title='编辑用户'
      loading={loading}
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="用户名">
          {getFieldDecorator('name', {
            initialValue: dataSource[0] ? dataSource[0].username : '',
            rules: [
              { required: true, message: '请输入用户名' }
            ]
          })(<Input disabled />)}
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
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});


export default Create;