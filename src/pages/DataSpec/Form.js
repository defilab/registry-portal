import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Input,
  Button,
  Card,
  Radio,
} from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class DataSpecForm extends PureComponent {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render () {
    const { submitting } = this.props;

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
      <Card bordered={false} title="New Data Spec">
        <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="Name">
            <Input value="Philippines Blacklist" />
          </FormItem>
          <FormItem {...formItemLayout} label="Spec">
            <Input value="PH-Blacklist" disabled />
          </FormItem>
          <FormItem {...formItemLayout} label="Data Type">
            <Input value="Blacklist" disabled />
          </FormItem>
          <FormItem {...formItemLayout} label="Description">
            <TextArea
              style={{ minHeight: 32 }}
              placeholder={formatMessage({ id: 'form.goal.placeholder' })}
              rows={4}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="Application">
            <Input />
          </FormItem>
          <FormItem {...formItemLayout} label="Scale">
            <Input addonAfter="K" />
          </FormItem>
          <FormItem {...formItemLayout} label="Refresh Frequency">
            <Input addonAfter="Per Day" />
          </FormItem>
          <FormItem {...formItemLayout} label="State">
            <Radio.Group value="inactive" disabled>
              <Radio value="active">Active</Radio>
              <Radio value="inactive">Inactive</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem {...formItemLayout} label="Public">
            <Radio.Group value="yes">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage id="form.submit" />
            </Button>
            <Button style={{ marginLeft: 8 }} htmlType="button">
              <FormattedMessage id="form.save" />
            </Button>
          </FormItem>
        </Form>
      </Card>
    );
  }
}

export default DataSpecForm;
