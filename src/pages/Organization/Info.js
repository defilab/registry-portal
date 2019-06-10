import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
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
        message.error('网络错误')
      })
    })
      .finally(() => this.setState({ loading: false }))
  }

  render() {
    const { loading, organization } = this.state;

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
      </GridContent>
    );
  }
}

export default Account;

