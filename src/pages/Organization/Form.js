import { Button, Card, Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'umi/locale';
import { createField } from '@/services/api';
import { fetchOrganization } from '../../services/api';
import { usePromise } from '@/utils/hooks';

const { Option } = Select;

const fieldTypes = {
  requester: '请求方',
  provider: '发送方',
  admin: '系统管理员',
}

const FieldForm = Form.create()(({ form, mode }) => {

  const { getFieldDecorator } = form;

  const formatData = (data) => (
    {
      name: data.name,
      canonical_name: data.canonicalName,
      description: data.description,
    }
  );

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const data = formatData(values);
      createField(data);
    });
  };

  const [data, loading, exec] = usePromise(fetchOrganization, []);

  useEffect(() => {
    if (mode === 'edit') {
      exec();
    }
  }, []);

  return (
    <Card
      bordered={false}
      title={mode === 'create' ? '新建企业信息' : '编辑企业信息'}
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
          })(<Input />)}
        </Form.Item>
        <Form.Item label="角色">
          <div>
            {getFieldDecorator('role', {
              initialValue: fieldTypes[data.roles ? data.roles[0] : ''],
              rules: [{ required: true }],
            })(
              <Select>
                {
                  Object.keys(fieldTypes)
                    .map(type => <Option value={fieldTypes[type]} key={type}>{fieldTypes[type]}</Option>
                    )
                }
              </Select>
            )}
          </div>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 10, offset: 7 }}>
          <Button type="primary" htmlType="submit">
            <FormattedMessage id="form.save" />
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
});

export default FieldForm;

