import React, { PureComponent } from 'react';
import { Card, Col, Row, Button, Upload, message, Divider } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { downloadFile, fetchActiveCert } from '@/services/api';
import styles from './style.less';
import { getToken } from '../../utils/token';
import handleError from '@/utils/handleError'

// eslint-disable-next-line no-underscore-dangle
const { user: { currentUser: { namespace } } } = window.g_app._store.getState();
const certFileUrl = `/organizations/${namespace}/certs/download`;
const certFileUploadUrl = `/organizations/${namespace}/certs/download`;
const ledgerFilesUrl = `/organizations/${namespace}/ledger/files/download`;

class Account extends PureComponent {
  state = {
    downloadingCertFile: false,
    downloadingLedgerFiles: false,
    certUploaded: undefined,
    uploadingCertFile: false,
  };

  componentDidMount() {
    fetchActiveCert().then((certs) => this.setState({
      certUploaded: certs.length > 0,
    })).catch((error) => {
      handleError(error).then((data) => {
        message.error(data)
      }).catch(() => {
        message.error('解析错误或未知错误')
      })
    });
  }

  uploadProps = (url) => ({
    name: 'file',
    // eslint-disable-next-line no-undef
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

  triggerBlobDownload = (blob, fileName) => {
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(blob, fileName);
      return;
    }

    const blobURL = window.URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.style.display = 'none';
    tempLink.href = blobURL;
    tempLink.setAttribute('download', fileName);
    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank');
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(blobURL);
    }, 100);
  };

  downloadCertFile = () => {
    this.setState({
      downloadingCertFile: true,
    });
    downloadFile(certFileUrl).then((blob) => {
      this.triggerBlobDownload(blob, 'cert.pem');
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('解析错误或未知错误')
        })
      })
      .finally(() => this.setState({
        downloadingCertFile: false,
      }));
  };

  downloadLedgerFiles = () => {
    this.setState({
      downloadingLedgerFiles: true,
    });
    downloadFile(ledgerFilesUrl).then((blob) => {
      this.triggerBlobDownload(blob, 'ledger_files.zip');
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('解析错误或未知错误')
        })
      })
      .finally(() => this.setState({
        downloadingLedgerFiles: false,
      }));
  };

  render() {
    const { certUploaded, downloadingCertFile, downloadingLedgerFiles, uploadingCertFile } = this.state;
    return (
      <GridContent>
        <Row gutter={24}>
          <Col>
            <Card
              title={formatMessage({ id: 'menu.downloads' })}
              bordered={false}
            >
              <div className={styles.title}>{formatMessage({ id: 'account.cert' })}</div>
              <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                {certUploaded ?
                  <Button
                    size="small"
                    style={{ marginRight: '8px' }}
                    onClick={() => this.downloadCertFile()}
                    loading={downloadingCertFile}
                  >
                    {formatMessage({ id: 'download' })}
                  </Button> : ''}
                {!certUploaded && certUploaded !== undefined ?
                  <Upload {...this.uploadProps(certFileUploadUrl)}>
                    <Button size="small" loading={uploadingCertFile}>
                      {formatMessage({ id: 'upload' })}
                    </Button>
                  </Upload> : ''}
              </div>
              <div className={styles.description}>
                请先在本地生成csr文件，再由此处下载对应的pem文件，配置流程详见SDK开发文档。
                <div>
                  <div>csr文件生成步骤：</div>
                  <div style={{ fontFamily: 'monospace', backgroundColor: 'rgba(51, 73, 110, 0.2)', padding: '10px', margin: '8px 0' }}>
                    openssl genrsa -out private.key 2048 <br />
                    openssl req -subj &quot;/C=CN/ST=ZYB/L=ZYB/O=ZYB/OU=Tech Department/CN=&#123;namespace&#125;&quot; -new -key private.key -out cert.csr <br />
                    openssl pkcs8 -topk8 -inform PEM -outform PEM -in private.key -nocrypt &gt; key.pem
                  </div>
                  <div>
                    注：namespace请替换为您所在企业的标识。
                  </div>
                </div>
              </div>
              <Divider />
              <div className={styles.title}>{formatMessage({ id: 'account.ledger-files' })}</div>
              <div>
                <Button
                  size="small"
                  onClick={() => this.downloadLedgerFiles()}
                  loading={downloadingLedgerFiles}
                  style={{ marginTop: '8px', marginBottom: '8px' }}
                >
                  {formatMessage({ id: 'download' })}
                </Button>
                <div className={styles.description}>配置流程详见SDK开发文档。</div>
              </div>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Account;
