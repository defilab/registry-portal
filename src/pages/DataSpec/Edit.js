import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
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

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ loading }) => ({
  submitting: loading.effects['dataSpec/update'],
}))
@Form.create()
class DataSpecForm extends PureComponent {
  state = {
    platformDataSpecs: [],
  };

  componentDidMount () {
    const { form, dispatch, match } = this.props;
    dispatch({
      type: 'dataSpec/single',
      payload: {
        spec: match.params.spec,
      },
      callback: (data) => {form.setFieldsValue({
        name: data.name,
        canonical_name: data.canonical_name,
        description: data.properties ? data.properties.description : '',
        scenario: data.properties ? data.properties.scenario : '',
        scale: data.properties ? data.properties.scale: '',
        updateFrequency: data.properties ? data.properties.updateFrequency: '',
        state: data.state,
        public: data.public,
      })},
    });

    fetchPlatformDataSpecs().then((data) => {
      this.setState({
        platformDataSpecs: data,
      });
    });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dataSpec/update',
          payload: {
            name: values.name,
            public: values.public,
            state: values.state,
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
    const { platformDataSpecs } = this.state;

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
      <Card bordered={false} title={formatMessage({id: 'spec.edit'})}>
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
                <FormattedMessage id={formatMessage({id: 'spec.description'})} />
                <em className={styles.optional}>
                  <FormattedMessage id="form.optional" />
                </em>
              </span>
            }
          >
            {getFieldDecorator('description')(<TextArea
              style={{ minHeight: 32 }}
              rows={4}
            />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                <FormattedMessage id={formatMessage({id: 'spec.scenario'})} />
                <em className={styles.optional}>
                  <FormattedMessage id="form.optional" />
                </em>
              </span>
            }
          >
            {getFieldDecorator('scenario')(<Input />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                <FormattedMessage id={formatMessage({id: 'spec.scale'})} />
                <em className={styles.optional}>
                  <FormattedMessage id="form.optional" />
                </em>
              </span>
            }
          >
            {getFieldDecorator('scale')(
              <Select>
                <Option value="1000">1,000</Option>
                <Option value="10000">10,000</Option>
                <Option value="100000">100,000</Option>
                <Option value="1000000">1,000,000</Option>
                <Option value="10000000">10,000,000</Option>
                <Option value="100000000">100,000,000</Option>
                <Option value="1000000000">1,000,000,000</Option>
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={
              <span>
                <FormattedMessage id={formatMessage({id: 'spec.update-frequency'})} />
                <em className={styles.optional}>
                  <FormattedMessage id="form.optional" />
                </em>
              </span>
            }
          >
            {getFieldDecorator('updateFrequency')(<InputNumber />)} {formatMessage({id: 'spec.every-n-days'})}
          </FormItem>
          <FormItem {...formItemLayout} label="State">
            {getFieldDecorator('state')
            (
              <Radio.Group>
                <Radio value="online">Online</Radio>
                <Radio value="offline">Offline</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={formatMessage({id: 'spec.public'})}>
            {getFieldDecorator('public')
            (
              <Radio.Group>
                <Radio value>{formatMessage({id: 'yes'})}</Radio>
                <Radio value={false}>{formatMessage({id: 'no'})}</Radio>
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
  }
}

export default DataSpecForm;
