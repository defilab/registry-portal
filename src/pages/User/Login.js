import React, { useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Checkbox, Alert, message } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import { login } from '../../services/api';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { setToken } from '@/utils/token';

const loginPage = function loginPage(props) {
  const { UserName, Password, Submit } = Login;
  let { form } = props;

  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('account');
  const [autoLogin, setAutoLogin] = useState(true);

  const onTabChange = type => {
    setType({ type });
  };

  const handleSubmit = (err, values) => {
    if (!err) {
      setLoading(true);
      login({ type, ...values })
        .then(data => {
          setLoading(false);
          if (data) {
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
            props.history.push('/');
          }
        })
        .catch(error => {
          setLoading(false);
          message.error('wrong number or password');
        });
    }
  };
  const changeAutoLogin = e => {
    setAutoLogin({
      autoLogin: e.target.checked,
    });
  };

  const renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );
  return (
    <div className={styles.main}>
      <Login
        defaultActiveKey={type}
        onTabChange={onTabChange}
        onSubmit={handleSubmit}
        ref={form => {
          form = form;
        }}
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
            onPressEnter={() => form.validateFields(handleSubmit)}
          />
        </div>
        {/* <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
        {login.status === 'error' &&
          login.type === 'mobile' &&
          !submitting &&
          this.renderMessage(
            formatMessage({ id: 'app.login.message-invalid-verification-code' })
          )}
        <Mobile
          name="mobile"
          placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'validation.phone-number.required' }),
            },
            {
              pattern: /^1\d{10}$/,
              message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
            },
          ]}
        />
        <Captcha
          name="captcha"
          placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
          countDown={120}
          onGetCaptcha={this.onGetCaptcha}
          getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
          getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'validation.verification-code.required' }),
            },
          ]}
        />
      </Tab> */}
        <div>
          <Checkbox checked={autoLogin} onChange={changeAutoLogin}>
            <FormattedMessage id="app.login.remember-me" />
          </Checkbox>
          {/* <a style={{ float: 'right' }} href="">
          <FormattedMessage id="app.login.forgot-password" />
        </a> */}
        </div>
        <Submit loading={loading} style={{ backgroundColor: '#4A70B7' }}>
          <FormattedMessage id="app.login.login" />
        </Submit>
        {/* <div className={styles.other}>
        <FormattedMessage id="app.login.sign-in-with" />
        <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
        <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
        <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
        <Link className={styles.register} to="/user/register">
          <FormattedMessage id="app.login.signup" />
        </Link>
      </div> */}
      </Login>
    </div>
  );
};

export default loginPage;
