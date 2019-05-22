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
    const namespace = window.location.pathname.split('/')[2]
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    this.setState({ loading: true });
    fetchOrganization(namespace).then((resp) => {
      this.setState({ loading: false })
      this.setState({ organization: resp });
    })
      .catch((error) => {
        this.setState({ loading: false })
        handleError(error)
          .then((data) => message.error(data))
          .catch(() => message.error('解析错误或未知错误'))
      })
  }

  render() {
    const { loading, organization } = this.state;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title={formatMessage({ id: 'account.basic-info' })}
              bordered={false}
              loading={loading}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="1">
                <Description term={formatMessage({ id: 'account.organization' })}>{organization.name}</Description>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            <Card
              title={formatMessage({ id: 'account.financial-info' })}
              bordered={false}
              className={styles.card}
              loading={loading}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="2">
                <Description term={formatMessage({ id: 'account.balance' })}>{organization.balance} DFT</Description>
                <Description term={formatMessage({ id: 'account.expense-today' })}>
                  {organization.expense.today} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.expense-this-month' })}>
                  {organization.expense.month} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.expense-total' })}>
                  {organization.expense.total} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.income-today' })}>
                  {organization.income.today} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.income-this-month' })}>
                  {organization.income.month} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.income-total' })}>
                  {organization.income.total} DFT
                </Description>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Account;

