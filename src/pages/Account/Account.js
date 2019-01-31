import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Col, Row, Upload, Icon, message } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Account.less';
import { getToken } from '../../utils/token';
import { fetchOrganization } from '../../services/api';

const { Description } = DescriptionList;
const { Dragger } = Upload;

const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
const draggerProps = {
  name: 'file',
  multiple: true,
  action: `${API_BASE_URL}/organizations/${namespace}/certs`,
  headers: {
    Authorization: `Bearer ${getToken()}`
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

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
                <Description term={formatMessage({ id: 'account.balance' })}>{organization.balance} PTS</Description>
                <Description term={formatMessage({ id: 'account.expense-today' })}>{organization.expense.today} PTS</Description>
                <Description term={formatMessage({ id: 'account.expense-this-month' })}>{organization.income.today} PTS</Description>
                <Description term={formatMessage({ id: 'account.expense-total' })}>{organization.expense.month} PTS</Description>
                <Description term={formatMessage({ id: 'account.income-today' })}>{organization.income.month} PTS</Description>
                <Description term={formatMessage({ id: 'account.income-this-month' })}>{organization.expense.total} PTS</Description>
                <Description term={formatMessage({ id: 'account.income-total' })}>{organization.income.total} PTS</Description>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col>
            <Card
              title={formatMessage({ id: 'account.cert' })}
              bordered={false}
              className={styles.card}
            >
              <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag cert file to upload</p>
              </Dragger>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Account;
