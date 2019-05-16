import React from 'react';
import { Form, Modal, Input } from 'antd';

const PasswordResetForm = Form.create()(React.forwardRef(({ form, visible, onSubmit, onCancel }, ref) => {
  const { getFieldDecorator } = form;

  return (
    <Modal
      visible={visible}
      title="密码修改"
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Form ref={ref}>
        <Form.Item label="旧密码">
          {
            getFieldDecorator('oldPassword', {
              rules: [
                {
                  required: true,
                  message: '旧密码不能为空'
                }
              ]
            })(<Input.Password />)
          }
        </Form.Item>
        <Form.Item label="新密码">
          {
            getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  message: '新密码不能为空'
                }
              ]
            })(<Input.Password />)
          }
        </Form.Item>
      </Form>
    </Modal>
  )
}));

export default PasswordResetForm;