import React, { PureComponent } from 'react';
import { Card, Col, Row, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import DescriptionList from '@/components/DescriptionList';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { downloadFile } from '@/services/api';

const { Description } = DescriptionList;
const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
const ledgerFilesAddress = `/organizations/${namespace}/ledger_files`;

class Account extends PureComponent {
  state = {
    loading: false,
  };

  componentDidMount () {

  }

  downloadFile = url => {
    this.setState({
      loading: true,
    });
    downloadFile(url).then((blobUrl) => {
      window.location = blobUrl;
    }).finally(() => this.setState({
      loading: false,
    }));
  };

  render () {
    const { loading } = this.state;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title={formatMessage({ id: 'menu.downloads' })}
              bordered={false}
            >
              <DescriptionList style={{ marginBottom: 24 }} col="1">
                <Description term={formatMessage({ id: 'account.ledger-files' })}>
                  <Button onClick={() => this.downloadFile(ledgerFilesAddress)} loading={loading}>
                    {formatMessage({ id: 'download' })}
                  </Button>
                </Description>
              </DescriptionList>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Account;
