import { usePromise } from '@/utils/hooks';
import { Button, Card, Form, Input, InputNumber, Radio, Select } from 'antd';
import React, { useEffect } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import * as api from '../../services/api';
import targets from '../../targets';
import styles from '../Forms/style.less';

const { target } = targets;
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
  },
};

const Scales = (
  <Select defaultValue="1000" style={{ width: '160px' }}>
    <Option value="1000">{formatMessage({ id: 'spec.scale-1000' })}</Option>
    <Option value="1000000">{formatMessage({ id: 'spec.scale-1000000' })}</Option>
    <Option value="1000000000">{formatMessage({ id: 'spec.scale-1000000000' })}</Option>
  </Select>
);

const DataSpecForm = Form.create()(({ form }) => {
  const [platformDataSpecs, fetchingPlatformDataSpecs, fetchPlatformDataSpecs] =
    usePromise(api.fetchPlatformDataSpecs, []);
  const [, submitting, submit] = usePromise(api.createDataSpec);

  useEffect(() => {
    fetchPlatformDataSpecs();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      canonical_name: 'blacklist'
    });
  }, [platformDataSpecs]);

  const { getFieldDecorator } = form;

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        submit({
          name: values.name,
          canonical_name: values.canonical_name,
          reference: values.canonical_name,
          state: values.state,
          public: values.public,
          price: values.price,
          properties: {
            description: values.description,
            scenario: values.scenario,
            scale: values.scale,
            scaleUnit: values.scaleUnit,
            updateFrequency: values.updateFrequency,
          },
        });
      }
    });
  };

  return (
    <Card bordered={false} title={formatMessage({ id: 'spec.new' })} loading={fetchingPlatformDataSpecs}>
      <Form onSubmit={handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.name' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'required',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.canonical-name' })}>
          {getFieldDecorator('canonical_name', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select>
              {
                platformDataSpecs.map(
                  (item) => (<Option value={item.canonical_name} key={item.id}>{item.canonical_name}</Option>))
              }
            </Select>,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.price" />
            </span>
          }
        >
          {getFieldDecorator('price')(<InputNumber />)} DFT
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.description" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('description')(<TextArea
            style={{ minHeight: 32 }}
            rows={4}
            placeholder={formatMessage({ id: 'spec.description-hint' })}
          />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.scenario" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('scenario')(<TextArea
            style={{ minHeight: 32 }}
            rows={4}
            placeholder={formatMessage({ id: 'spec.scenario-hint' })}
          />)}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.region' })}>
          {getFieldDecorator('region', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select>
              {
                target.regions.map(
                  (item) => (<Option value={item.code} key={item.code}>{item.name}</Option>))
              }
            </Select>,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.scale" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('scale')(<Input addonAfter={Scales} />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              <FormattedMessage id="spec.update-frequency" />
              <em className={styles.optional}>
                <FormattedMessage id="form.optional" />
              </em>
            </span>
          }
        >
          {getFieldDecorator('updateFrequency')(<InputNumber />)} {formatMessage({ id: 'spec.every-n-days' })}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.status' })}>
          {getFieldDecorator('state', { initialValue: 'online' })
          (
            <Radio.Group>
              <Radio value="online">{formatMessage({ id: 'spec.status-online' })}</Radio>
              <Radio value="offline">{formatMessage({ id: 'spec.status-offline' })}</Radio>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.public' })}>
          {getFieldDecorator('public', { initialValue: true })
          (
            <Radio.Group>
              <Radio value>{formatMessage({ id: 'yes' })}</Radio>
              <Radio value={false}>{formatMessage({ id: 'no' })}</Radio>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            <FormattedMessage id="form.submit" />
          </Button>
        </FormItem>
      </Form>
    </Card>
  );
});

export default DataSpecForm;
