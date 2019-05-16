import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { Card, Col, Row } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import router from 'umi/router';
import { fetchOrganization } from '../../services/api';
import styles from './Account.less';

const { Description } = DescriptionList;
// eslint-disable-next-line no-underscore-dangle
const { user: { currentUser: { namespace } } } = window.g_app._store.getState();

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
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });

    this.setState({ loading: true });
    fetchOrganization().then((resp) => {
      this.setState({
        organization: resp,
      });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'articles':
        router.push(`${match.url}/articles`);
        break;
      case 'applications':
        router.push(`${match.url}/applications`);
        break;
      case 'projects':
        router.push(`${match.url}/projects`);
        break;
      default:
        break;
    }
  };

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
                  <Description term={formatMessage({ id: 'account.balance' })}>
                    {organization.balance} DFT
                  </Description>
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
        }
      </GridContent>
    );
  }
}

export default Account;
