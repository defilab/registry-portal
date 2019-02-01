import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Button,
  Card,
  Radio, InputNumber,
  Select,
} from 'antd';
import styles from '../Forms/style.less';
import { fetchPlatformDataSpecs } from '../../services/api';
import router from 'umi/router';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading }) => ({
  submitting: loading.effects['dataSpec/create'],
}))
@Form.create()
class DataSpecForm extends PureComponent {
  state = {
    platformDataSpecs: [],
    state: 'online'
  };

  componentDidMount () {
    const { form } = this.props;
    form.setFieldsValue({
      state: 'online',
      public: true,
    });

    fetchPlatformDataSpecs().then((data) => {
      this.setState({
        platformDataSpecs: data,
      });
      form.setFieldsValue({
        canonical_name: 'blacklist',
      });
    });
  }

  handleSubmit = e => {
    const { platformDataSpecs: { price } } = this.state;
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dataSpec/create',
          payload: {
            name: values.name,
            canonical_name: values.canonical_name,
            reference: values.canonical_name,
            state: values.state,
            public: values.public,
            price,
            properties: {
              description: values.description,
              scenario: values.scenario,
              scale: values.scale,
              updateFrequency: values.updateFrequency
            }
          },
          callback: () => router.goBack()
        });
      }
    });
  };

  render () {
    const { submitting } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { platformDataSpecs, state } = this.state;

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

    return (
      <Card bordered={false} title={formatMessage({id: 'spec.new'})}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={formatMessage({id: 'spec.name'})}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: 'required',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'spec.canonical-name'})}>
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
              placeholder={formatMessage({id: 'spec.description-hint'})}
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
              placeholder={formatMessage({id: 'spec.scenario-hint'})}
            />)}
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
              <Select>
                <Option value="1000">{formatMessage({id: 'spec.scale-1000'})}</Option>
                <Option value="10000">{formatMessage({id: 'spec.scale-10000'})}</Option>
                <Option value="100000">{formatMessage({id: 'spec.scale-100000'})}</Option>
                <Option value="1000000">{formatMessage({id: 'spec.scale-1000000'})}</Option>
                <Option value="10000000">{formatMessage({id: 'spec.scale-10000000'})}</Option>
                <Option value="100000000">{formatMessage({id: 'spec.scale-100000000'})}</Option>
                <Option value="1000000000">{formatMessage({id: 'spec.scale-1000000000'})}</Option>
              </Select>
            )}
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
            {getFieldDecorator('updateFrequency')(<InputNumber />)} {formatMessage({id: 'spec.every-n-days'})}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'spec.status'})}>
            {getFieldDecorator('state')
            (
              <Radio.Group onChange={(e) => this.setState({ state: e.target.value })}>
                <Radio value="online">{formatMessage({id: 'spec.status-online'})}</Radio>
                <Radio value="offline">{formatMessage({id: 'spec.status-offline'})}</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'spec.public'})}>
            {getFieldDecorator('public')
            (
              <Radio.Group disabled={state === 'offline'}>
                <Radio value>{formatMessage({id: 'yes'})}</Radio>
                <Radio value={false}>{formatMessage({id: 'no'})}</Radio>
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
  }
}

export default DataSpecForm;
