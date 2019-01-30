import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Col, Row } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Account.less';
import { fetchOrganization } from '../../services/api';

const { Description } = DescriptionList;

@connect(({ loading, user, project }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
}))
class Account extends PureComponent {
  state = {
    organization: {},
    loading: false,
  };

  componentDidMount () {
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

  render () {
    const { loading, organization } = this.state;
    return <GridContent>
      <Row gutter={24}>
        <Col>
          <Card
            title="Basic Info"
            bordered={false}
            loading={loading}
          >
            <DescriptionList style={{ marginBottom: 24 }} col="1">
              <Description term="Company Name">{organization.name}</Description>
              <Description term="Company Email">tech@cashlending.ph</Description>
            </DescriptionList>
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col>
          <Card
            title="Finance"
            bordered={false}
            className={styles.card}
          >
            <DescriptionList style={{ marginBottom: 24 }} col="2">
              <Description term="Balance">6000 PHP</Description>
              <Description term="Total Deposit">67890 PHP</Description>
              <Description term="Daily Expense">7000 PHP</Description>
              <Description term="Daily Revenue">0 PHP</Description>
              <Description term="Monthly Expense">7890 PHP</Description>
              <Description term="Monthly Revenue">0 PHP</Description>
              <Description term="Total Expense">7890 PHP</Description>
              <Description term="Total Revenue">0 PHP</Description>
            </DescriptionList>
          </Card>
        </Col>
      </Row>
    </GridContent>;
  }
}

export default Account;
