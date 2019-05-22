import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { fetchOrganization, updateOrganization, createOrganization } from '@/services/api';
import handleError from '@/utils/handleError'
import router from 'umi/router';

const DataSpecForm = Form.create()(({ form, mode, organization }) => {
  const { getFieldDecorator } = form
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchData, setFetchData] = useState();

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setSubmitting(true)
        if (mode === 'edit') {
          updateOrganization({ name: values.name, namespace: values.namespace })
            .then(() => {
              setSubmitting(false)
              router.push('/organization')
            })
            .catch((error) => {
              setSubmitting(false)
              handleError(error)
                .then((data) => message.error(data))
                .catch(() => message.error('解析错误或未知错误'))
            })
        }
        else {
          createOrganization({ name: values.name, namespace: values.namespace })
            .then(() => {
              setSubmitting(false)
              router.push('/organization')
            })
            .catch((error) => {
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
      setFetching(true)
      fetchOrganization(organization)
        .then((data) => {
          setFetchData(data)
          setFetching(false)
        })
        .catch((error) => {
          setFetching(false)
          handleError(error)
            .then((data) => message.error(data))
            .catch(() => message.error('解析错误或未知错误'))
        })
    }
  }, []);

  useEffect(() => {
    if (mode === 'edit' && fetchData) {
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