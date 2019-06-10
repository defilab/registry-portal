import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { changePassword, fetchOrganization } from '@/services/api';
import { Card, Col, message, Row } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import PasswordResetForm from './PasswordResetForm';
import handleError from '@/utils/handleError'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const { Description } = DescriptionList;

@connect(({ loading, user, project }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
}))
class Account extends PureComponent {
  state = {
    organization: {
      expense: {},
      income: {},
    },
    loading: false,
    isPasswordDialogVisible: false
  };

  passwordFormRef = React.createRef();

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });

    this.setState({ loading: true });
    // eslint-disable-next-line no-underscore-dangle
    const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
    fetchOrganization(namespace).then((resp) => {
      this.setState({
        organization: resp,
      });
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('网络错误')
        })
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  showChangePasswordDialog = () => {
    this.setState({
      isPasswordDialogVisible: true
    });
  }

  hidePasswordDialog = () => {
    this.setState({
      isPasswordDialogVisible: false
    });
    this.passwordFormRef.current.resetFields();
  }

  savePassword = () => {
    const form = this.passwordFormRef.current;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      changePassword(values.oldPassword, values.newPassword)
        .then(() => message.success('密码修改成功'))
        .catch((error) => {
          handleError(error).then((data) => {
            message.error(data)
          }).catch(() => {
            message.error('网络错误')
          })
        })
      this.hidePasswordDialog();
    });
  };

  render() {
    const { loading, organization, isPasswordDialogVisible } = this.state;
    // eslint-disable-next-line no-underscore-dangle
    const { user: { currentUser: { name } } } = window.g_app._store.getState();

    return (
      <PageHeaderWrapper>
        <GridContent>
          <Row gutter={24}>
            <Col>
              <Card
                title={formatMessage({ id: 'account.basic-info' })}
                bordered={false}
                loading={loading}
              >
                <DescriptionList style={{ marginBottom: 24 }} col="1">
                  <Description term="企业名称">{organization.name}</Description>
                  <Description term="企业标识">
                    {organization.namespace}
                  </Description>
                  <Description term="当前用户">
                    {name} <a onClick={this.showChangePasswordDialog} style={{ marginLeft: '10px' }}>修改密码</a>
                  </Description>
                </DescriptionList>
              </Card>
            </Col>
          </Row>
          <PasswordResetForm
            visible={isPasswordDialogVisible}
            ref={this.passwordFormRef}
            onSubmit={this.savePassword}
            onCancel={this.hidePasswordDialog}
          />
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default Account;
