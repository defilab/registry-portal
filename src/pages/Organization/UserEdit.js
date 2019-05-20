import { Button, Card, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { fetchUsers, updateUsers } from '../../services/api';
import { usePromise } from '@/utils/hooks';

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
          setSubmitting(false)
          history.push(`/organization/${namespace}/users`)
        })
      }
    });
  };

  const [data, loading, exec] = usePromise(fetchUsers, []);

  useEffect(() => {
    exec(namespace);

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
          })(<Input disabled={true} />)}
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