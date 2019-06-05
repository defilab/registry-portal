import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FieldsTable from '@/components/Field/FieldsTable';
import { parseSchema } from '@/utils/schema';

const { Description } = DescriptionList;

@connect(({ loading }) => ({
  loading: loading.effects['dataSpec/single'],
}))
class View extends PureComponent {
  state = {
    data: {
      public: false,
      state: 'offline'
    },
    requestSchema: {},
    responseSchema: {}
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'dataSpec/single',
      payload: { spec: match.params.spec },
      callback: (data) => this.setState({
        data,
        requestSchema: data.reference || parseSchema(data.definition.qualifiers),
        responseSchema: data.reference || parseSchema(data.definition.response)
      }),
    });
  }

  render() {
    const { data, requestSchema, responseSchema } = this.state;
    const { loading } = this.props;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title="数据接口详情"
              bordered={false}
              loading={loading}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="1">
                <Description term="ID">{data.id}</Description>
                <Description term={formatMessage({ id: 'spec.name' })}>{data.name}</Description>
                <Description term={formatMessage({ id: 'spec.canonical-name' })}>{data.canonical_name}</Description>
                <Description term={formatMessage({ id: 'spec.price' })}>{data.price / 100.0} 元</Description>
                <Description term={formatMessage({ id: 'spec.description' })}>
                  {data.description}
                </Description>
                <Description term={formatMessage({ id: 'spec.status' })}>
                  {formatMessage({ id: `spec.status-${data.state}` })}
                </Description>
                <Description term="活跃">
                  {data.alive ? '是' : '否'}
                </Description>
                <Description term="引用" style={{ display: data.reference ? 'block' : 'none' }}>
                  {data.reference}
                </Description>
                <div style={{ display: data.reference ? 'none' : 'block' }}>
                  <Description term="自定义字段" style={{ display: data.reference ? 'none' : 'block' }} />
                  <div style={{ marginLeft: '18px', marginRight: '18px' }}>
                    <div style={{ fontWeight: 'bolder' }}>请求</div>
                    <FieldsTable fields={requestSchema.properties} editable={false} />
                    <div style={{ height: '18px' }} />
                    <div style={{ fontWeight: 'bolder' }}>返回结果</div>
                    <FieldsTable
                      fields={responseSchema.properties}
                      editable={false}
                    />
                  </div>
                </div>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default View;
