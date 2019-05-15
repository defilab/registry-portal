import Login from '@/components/Login';
import { Alert, Form, message } from 'antd';
import React, { useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import styles from './Login.less';
import { login } from '../../services/api'
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setToken } from '@/utils/token';

const { UserName, Password, Submit } = Login;

const LoginPage = Form.create()((props) => {
  const [submitting, setSubmitting] = useState(false)
  let { form: loginForm } = props.form

  const handleSubmit = (err, values) => {
    if (!err) {
      setSubmitting(true)
      login({ ...values, type: 'account' }).then((data) => {
        setSubmitting(false)
        if (data.status === 'ok') {
          setToken(data.token);
          reloadAuthorized();
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          props.history.push(redirect || "/")
        }
      })
        .catch(() => {
          setSubmitting(false)
          message.error('用户名或密码错误');
        })
    }
  };

  const renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  return (
    <div className={styles.main}>
      <Login
        onSubmit={handleSubmit}
        ref={form => { loginForm = form }}
      >
        <div className={styles.form}>
          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <UserName
            name="userName"
            placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.userName.required' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage({ id: 'app.login.password' })}`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.password.required' }),
              },
            ]}
            onPressEnter={() => loginForm.validateFields(handleSubmit)}
          />
        </div>
        <Submit loading={submitting} style={{ backgroundColor: '#4A70B7' }}>
          <FormattedMessage id="app.login.login" />
        </Submit>
      </Login>
    </div>
  );
})


export default LoginPage;
