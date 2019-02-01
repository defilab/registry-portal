import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

const { Description } = DescriptionList;

@connect(({ loading }) => ({
  loading: loading.effects['dataSpec/single'],
}))
class View extends PureComponent {
  state = {
    data: {
      public: false,
      properties: {
      },
      state: 'offline'
    },
  };

  componentDidMount () {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'dataSpec/single',
      payload: { spec: match.params.spec },
      callback: (data) => this.setState({
        data: {
          ...data,
          properties: data.properties ? data.properties : {}
        },
      }),
    });
  }

  render () {
    const { data } = this.state;
    const { loading } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title={formatMessage({ id: 'spec.interface' })}
              bordered={false}
              loading={loading}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="1">
                <Description term="ID">{data.id}</Description>
                <Description term={formatMessage({ id: 'spec.name' })}>{data.name}</Description>
                <Description term={formatMessage({ id: 'spec.canonical-name' })}>{data.canonical_name}</Description>
                <Description term={formatMessage({ id: 'spec.price' })}>{data.price}</Description>
                <Description term={formatMessage({ id: 'spec.description' })}>
                  {data.properties.description}
                </Description>
                <Description term={formatMessage({ id: 'spec.scenario' })}>
                  {data.properties.scenario}
                </Description>
                <Description term={formatMessage({ id: 'spec.scale' })}>
                  {data.properties.scale ? formatMessage({ id: `spec.scale-${data.properties.scale}` }) : ''}
                </Description>
                <Description term={formatMessage({ id: 'spec.update-frequency' })}>
                  {data.properties.updateFrequency}
                </Description>
                <Description term={formatMessage({ id: 'spec.public' })}>{data.public ? formatMessage({ id: 'yes' }) :
                  formatMessage({ id: 'no' })}
                </Description>
                <Description term={formatMessage({ id: 'spec.status' })}>
                  {formatMessage({ id: `spec.status-${data.state}` })}
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
