import { usePromise } from '@/utils/hooks';
import { Button, Card, Form, Input, InputNumber, Radio, Select, notification } from 'antd';
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
    sm: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 }
  }
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 }
  }
};

const DataSpecForm = Form.create()(({ form, onSubmit, spec }) => {
  const [platformDataSpecs, fetchingPlatformDataSpecs, fetchPlatformDataSpecs] =
    usePromise(api.fetchPlatformDataSpecs, []);
  const [dataSpec, fetchingDataSpec, fetchDataSpec] = usePromise(() => api.fetchDataSpec(spec));
  const [, submitting, submit] = usePromise(onSubmit, undefined, (error) => {
    notification.error({
      message: error.message
    });
  });

  useEffect(() => {
    fetchPlatformDataSpecs();
    if (spec) {
      fetchDataSpec();
    }
  }, []);

  useEffect(() => {
    if (spec && dataSpec) {
      const { properties } = dataSpec;
      form.setFieldsValue({
        name: dataSpec.name,
        canonical_name: dataSpec.canonical_name,
        price: dataSpec.price,
        description: properties && properties.description,
        scenario: properties && properties.scenario,
        scale: properties && properties.scale,
        scaleUnit: properties && properties.scaleUnit,
        updateFrequency: properties && properties.updateFrequency,
        state: dataSpec.state,
        public: dataSpec.public
      });
    }
  }, [dataSpec]);

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
          region: values.region,
          properties: {
            description: values.description,
            scenario: values.scenario,
            scale: values.scale,
            scaleUnit: values.scaleUnit,
            updateFrequency: values.updateFrequency
          }
        });
      }
    });
  };

  return (
    <Card
      bordered={false}
      title={formatMessage({ id: 'spec.new' })}
      loading={fetchingPlatformDataSpecs || fetchingDataSpec}
    >
      <Form onSubmit={handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.name' })}>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'required'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.canonical-name' })}>
          {getFieldDecorator('canonical_name', {
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select>
              {
                platformDataSpecs.map(
                  (item) => (<Option value={item.canonical_name} key={item.id}>{item.canonical_name}</Option>))
              }
            </Select>
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
            initialValue: 'PH',
            rules: [
              {
                required: true
              }
            ]
          })(
            <Select>
              {
                target.regions.map(
                  (item) => (<Option value={item.code} key={item.code}>{item.name}</Option>))
              }
            </Select>
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
          {getFieldDecorator('scale')(
            <Input
              addonAfter={
                getFieldDecorator('scaleUnit', { initialValue: '1000' })(
                  <Select style={{ width: '160px' }}>
                    <Option value="1000">{formatMessage({ id: 'spec.scale-1000' })}</Option>
                    <Option value="1000000">{formatMessage({ id: 'spec.scale-1000000' })}</Option>
                    <Option value="1000000000">{formatMessage({ id: 'spec.scale-1000000000' })}</Option>
                  </Select>
                )
              }
            />)}
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
            </Radio.Group>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={formatMessage({ id: 'spec.public' })}>
          {getFieldDecorator('public', { initialValue: true })
          (
            <Radio.Group>
              <Radio value>{formatMessage({ id: 'yes' })}</Radio>
              <Radio value={false}>{formatMessage({ id: 'no' })}</Radio>
            </Radio.Group>
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
