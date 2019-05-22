import { Button, Card, Form, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { fetchUsers, updateUsers, createUsers } from '@/services/api';
import { usePromise } from '@/utils/hooks';
import handleError from '@/utils/handleError'
import router from 'umi/router';

const Create = Form.create()(({ form, mode, organization }) => {
  const { getFieldDecorator } = form;
  const userId = window.location.pathname.split('/')[4]
  const [submitting, setSubmitting] = useState(false)
  const [dataSource, loading, exec] = usePromise(fetchUsers)

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSubmitting(true)
        if (mode === 'edit') {
          updateUsers({
            username: values.name,
            password: values.password,
            userId,
          }).then(() => {
            setSubmitting(false)
            router.push(`/organization/${organization}/users`)
          }).catch((error) => {
            setSubmitting(false)
            handleError(error)
              .then((data) => message.error(data))
              .catch(() => message.error('解析错误或未知错误'))
          })
        }
        else {
          createUsers({
            username: values.name,
            password: values.password,
            namespace: organization
          }).then(() => {
            setSubmitting(false)
            router.push(`/organization/${organization}/users`)
          }).catch((error) => {
            setSubmitting(false)
            handleError(error)
              .then((data) => message.error(data))
              .catch(() => message.error('解析错误或未知错误'))
          })
        }
      }
    });
  };

  useEffect(() => {
    if (mode === 'edit') {
      exec(organization).catch((error) => {
        handleError(error)
          .then((data) => message.error(data))
          .catch(() => message.error('解析错误或未知错误'))
      });
    }
  }, []);

  useEffect(() => {
    if (mode === 'edit' && dataSource) {
      const user = dataSource.items.filter((item) => item.id === userId)[0]
      form.setFieldsValue({ name: user.username });
    }
  }, [dataSource]);

  return (
    <Card
      bordered={false}
      title={formatMessage({ id: mode === 'edit' ? 'menu.view.usersedit' : 'menu.view.userscreate' })}
      loading={loading}
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="用户名">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入用户名' }]
          })(<Input disabled={mode === 'edit'} />)}
        </Form.Item>
        <Form.Item label="密码">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }]
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