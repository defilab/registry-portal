import React, { PureComponent } from 'react';
import { Card, Col, Row } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { formatMessage } from 'umi/locale';
import styles from './View.less';
import { fetchOrganization } from '../../../services/api';

const { Description } = DescriptionList;

class View extends PureComponent {
  state = {
    organization: [],
    loading: false,
  };

  componentDidMount() {
    const { match } = this.props;
    this.setState({
      loading: true,
    });

    fetchOrganization(match.params.namespace)
      .then(data => {
        this.setState({
          organization: data,
        });
      })
      .finally(() =>
        this.setState({
          loading: false,
        })
      );
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
                <Description term={formatMessage({ id: 'account.organization' })}>
                  {organization.name}
                </Description>
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
                <Description term={formatMessage({ id: 'account.balance' })}>
                  {organization.balance} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.expense-today' })}>
                  {organization.expense ? organization.expense.today : 0} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.expense-this-month' })}>
                  {organization.expense ? organization.expense.month : 0} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.expense-total' })}>
                  {organization.expense ? organization.expense.total : 0} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.income-today' })}>
                  {organization.income ? organization.income.today : 0} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.income-this-month' })}>
                  {organization.income ? organization.income.month : 0} DFT
                </Description>
                <Description term={formatMessage({ id: 'account.income-total' })}>
                  {organization.income ? organization.income.total : 0} DFT
                </Description>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default View;
