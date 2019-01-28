import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Card, Row, Col } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Account.less';

const { Description } = DescriptionList;

@connect(({ loading, user, project }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
}))
class Account extends PureComponent {
  state = {
    newTags: [],
    inputValue: '',
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
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

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render () {
    const {
      currentUser,
      currentUserLoading,
    } = this.props;

    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title="Basic Info"
              bordered={false}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="1">
                <Description term="Company Name">Cash Lending</Description>
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
      </GridContent>
    );
  }
}

export default Account;
