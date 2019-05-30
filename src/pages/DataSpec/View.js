import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Col, Row } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import FieldsTable from '@/components/Field/FieldsTable';
import { parseSchema, SchemaType } from '@/utils/schema';

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

  responseTableFields() {
    const { responseSchema } = this.state;
    if (responseSchema.type === 'object') {
      return responseSchema.properties;
    }
    if (responseSchema.type === 'array' && responseSchema.items.type === 'object') {
      return responseSchema.items.properties;
    }

    return [];
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
                    <div style={{fontWeight: 'bolder'}}>请求</div>
                    <FieldsTable fields={requestSchema.properties} editable={false} />
                    <div style={{ height: '18px' }} />
                    <div style={{fontWeight: 'bolder'}}>返回结果</div>
                    <div style={{fontSize: '13px', marginTop: '10px'}}>描述：{responseSchema.description}</div>
                    <div style={{fontSize: '13px', marginTop: '10px'}}>类型：<span style={{ fontWeight: 'normal' }}><SchemaType schema={responseSchema} /></span></div>
                    {
                      (responseSchema.type === 'object' || (responseSchema.type === 'array') && responseSchema.items.type === 'object') && <FieldsTable
                        fields={this.responseTableFields()}
                        editable={false}
                        style={{ display: responseSchema.type === 'object' || (responseSchema.type === 'array' && responseSchema.items.type === 'object') }}
                      />
                    }
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
