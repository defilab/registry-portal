import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Account.less';

const { Description } = DescriptionList;

@connect(({ loading, user, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class Account extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
    dispatch({
      type: 'project/fetchNotice',
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
    const { newTags, inputVisible, inputValue } = this.state;
    const {
      currentUser,
      currentUserLoading,
      project: { notice },
      projectLoading,
    } = this.props;

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Card
            title={
              <FormattedMessage
                id="menu.account"
              />
            }
            bordered={false}
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
        </Row>
      </GridContent>
    );
  }
}

export default Account;
