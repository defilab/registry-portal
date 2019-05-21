import React, { useEffect } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { fetchOrganization } from '@/services/api';
import { usePromise } from '@/utils/hooks';
import handleError from '@/utils/handleError'

const DataSpecForm = Form.create()(({ form, mode, onSubmit }) => {
  const { getFieldDecorator } = form
  const [fetchData, fetching, execFetch] = usePromise(fetchOrganization);
  const [, submitting, submit] = usePromise(onSubmit, undefined);
  const namespace = window.location.pathname.split('/')[2]

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        submit({ name: values.name, namespace: values.namespace })
      }
    });
  };

  useEffect(() => {
    if (mode === 'edit') {
      execFetch(namespace).catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('解析错误或未知错误')
        })
      });
    }
  }, []);

  useEffect(() => {
    if (fetchData) {
      form.setFieldsValue({
        name: fetchData.name,
        namespace: fetchData.namespace,
      });
    }
  }, [fetchData]);

  return (
    <Card
      bordered={false}
      title={formatMessage({ id: mode === 'edit' ? 'organization.edit' : 'organization.new' })}
      loading={fetching}
    >
      <Form onSubmit={handleSubmit} labelCol={{ span: 7 }} wrapperCol={{ span: 12 }}>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '请输入名称' }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="标识">
          {getFieldDecorator('namespace', {
            rules: [
              { required: true, message: '请输入标记' }
            ]
          })(<Input disabled={mode === 'edit'} />)}
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

export default DataSpecForm;