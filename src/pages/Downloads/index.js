import React, { PureComponent } from 'react';
import { Card, Col, Row, Button, Upload, message, Divider } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { downloadFile, fetchActiveCert } from '@/services/api';
import styles from './style.less';
import { getToken } from '../../utils/token';

const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
const certFileUrl = `/organizations/${namespace}/certs/active`;
const certFileUploadUrl = `/organizations/${namespace}/certs`;
const ledgerFilesUrl = `/organizations/${namespace}/ledger_files`;

class Account extends PureComponent {
  state = {
    downloadingCertFile: false,
    downloadingLedgerFiles: false,
    certUploaded: undefined,
    uploadingCertFile: false,
  };

  componentDidMount () {
    fetchActiveCert().then((certs) => this.setState({
      certUploaded: certs.length > 0,
    }));
  }

  uploadProps = (url) => ({
    name: 'file',
    action: `${API_BASE_URL}${url}`,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    showUploadList: false,
    beforeUpload: () => {
      this.setState({
        uploadingCertFile: true,
      });
      return true;
    },
    onChange: (info) => {
      const { status } = info.file;
      if (status === 'done') {
        this.setState({
          certUploaded: true,
          uploadingCertFile: false,
        });
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        this.setState({
          uploadingCertFile: false,
        });
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  });

  downloadCertFile = () => {
    this.setState({
      downloadingCertFile: true,
    });
    downloadFile(certFileUrl).then((blobUrl) => {
      window.location = blobUrl;
    }).finally(() => this.setState({
      downloadingCertFile: false,
    }));
  };

  downloadLedgerFiles = () => {
    this.setState({
      downloadingLedgerFiles: true,
    });
    downloadFile(ledgerFilesUrl).then((blobUrl) => {
      window.location = blobUrl;
    }).finally(() => this.setState({
      downloadingLedgerFiles: false,
    }));
  };

  render () {
    const { certUploaded, downloadingCertFile, downloadingLedgerFiles, uploadingCertFile } = this.state;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title={formatMessage({ id: 'menu.downloads' })}
              bordered={false}
            >
              <div className={styles.title}>{formatMessage({ id: 'account.cert' })}:</div>
              <div>
                {certUploaded ?
                  <Button size="small" style={{ marginRight: '8px' }} onClick={() => this.downloadCertFile()}
                          loading={downloadingCertFile}>
                    {formatMessage({ id: 'download' })}
                  </Button> : ''}
                {!certUploaded && certUploaded !== undefined ?
                  <Upload {...this.uploadProps(certFileUploadUrl)}>
                    <Button size="small" loading={uploadingCertFile}>
                      {formatMessage({ id: 'upload' })}
                    </Button>
                  </Upload> : ''}
                <div className={styles.description}> {formatMessage({ id: 'refer-doc' })}</div>
              </div>
              <Divider />
              <div className={styles.title}>{formatMessage({ id: 'account.ledger-files' })}:</div>
              <div>
                <Button size="small" onClick={() => this.downloadLedgerFiles()} loading={downloadingLedgerFiles}>
                  {formatMessage({ id: 'download' })}
                </Button>
                <div className={styles.description}> {formatMessage({ id: 'account.ledger-files-description' })}</div>
              </div>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Account;
