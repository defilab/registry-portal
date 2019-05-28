import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, message } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './View.less';
import { fetchOrganization } from '@/services/api';
import handleError from '@/utils/handleError'

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
  };

  componentDidMount() {
    this.setState({ loading: true });
    const { match: { params: { namespace } } } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });

    fetchOrganization(namespace).then((resp) => {
      this.setState({
        organization: resp,
      });
    }).catch((error) => {
      handleError(error).then((data) => {
        message.error(data)
      }).catch(() => {
        message.error('未知错误')
      })
    })
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    const { loading, organization } = this.state;
    const { match: { params: { namespace } } } = this.props;

    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              bordered={false}
              loading={loading}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="1">
                <Description term="名称">{organization.name}</Description>
                <Description term="标识">{organization.namespace}</Description>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
        {
          namespace !== 'platform' &&
          <Row gutter={24}>
            <Col>
              <Card
                title={formatMessage({ id: 'account.financial-info' })}
                bordered={false}
                className={styles.card}
                loading={loading}
              >
                <DescriptionList style={{ marginBottom: 24 }} col="2">
                  <Description term={formatMessage({ id: 'account.balance' })}>{organization.balance} 元</Description>
                </DescriptionList>
                <DescriptionList style={{ marginBottom: 24 }} col="2">
                  <Description term={formatMessage({ id: 'account.income-today' })}>
                    {organization.income.today} 元
                  </Description>
                  <Description term={formatMessage({ id: 'account.expense-today' })}>
                    {organization.expense.today} 元
                  </Description>
                  <Description term={formatMessage({ id: 'account.income-this-month' })}>
                    {organization.income.month} 元
                  </Description>
                  <Description term={formatMessage({ id: 'account.expense-this-month' })}>
                    {organization.expense.month} 元
                  </Description>
                  <Description term={formatMessage({ id: 'account.income-total' })}>
                    {organization.income.total} 元
                  </Description>
                  <Description term={formatMessage({ id: 'account.expense-total' })}>
                    {organization.expense.total} 元
                  </Description>
                </DescriptionList>
              </Card>
            </Col>
          </Row>
        }
      </GridContent>
    );
  }
}

export default Account;

