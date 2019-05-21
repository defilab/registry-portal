import { Button, Card, Form, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi/locale';
import { fetchOrganization, updateOrganization } from '../../services/api';
import { usePromise } from '@/utils/hooks';


const Create = Form.create()(({ form, history }) => {

  const { getFieldDecorator } = form;
  const [data, loading, exec] = usePromise(fetchOrganization, []);
  const namespace = window.location.pathname.split('/')[2]
  const [submitting, setSubmitting] = useState(false)


  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSubmitting(true)
        updateOrganization({ name: values.name, namespace: values.namespace })
          .then(() => {
            setSubmitting(false)
            history.push(`/organization`)
          })
      }
    });
  };

  useEffect(() => {
    exec(namespace);
  }, []);

  return (
    <Card
      bordered={false}
      title='编辑企业信息'
      loading={loading}
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            initialValue: data.name,
            rules: [
              { required: true, message: '请输入名称' }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="标识">
          {getFieldDecorator('namespace', {
            initialValue: data.namespace,
            rules: [
              { required: true, message: '请输入标记' }
            ]
          })(<Input disabled={true} />)}
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