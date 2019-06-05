import React, { PureComponent } from 'react';
import { Card, Col, Row, Button, Upload, message, Divider } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { downloadFile, fetchActiveCert, search, deleteCertFile } from '@/services/api';
import styles from './style.less';
import { getToken } from '../../utils/token';
import handleError from '@/utils/handleError'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

class Account extends PureComponent {
  state = {
    downloadingCertFile: false,
    downloadingLedgerFiles: false,
    deletingCertFile: false,
    cert: {},
    certUploaded: undefined,
    uploadingCertFile: false,
  };

  // eslint-disable-next-line no-underscore-dangle
  namespace = window.g_app._store.getState().user.currentUser.namespace;

  certFileUrl = `/organizations/${this.namespace}/certs/download`;

  certFileUploadUrl = `/organizations/${this.namespace}/certs`;

  ledgerFilesUrl = `/organizations/${this.namespace}/ledger/files/download`;

  componentDidMount() {
    fetchActiveCert().then((certs) => this.setState({
      cert: certs[0],
      certUploaded: certs.length > 0
    })).catch((error) => {
      handleError(error).then((data) => {
        message.error(data)
      }).catch(() => {
        message.error('网络错误')
      })
    });
    search();
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
          cert: info.file.response,
          certUploaded: true,
          uploadingCertFile: false,
        });
        message.success(`上传成功`);
      } else if (status === 'error') {
        this.setState({
          uploadingCertFile: false,
        });
        message.error(`上传失败`);
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
    downloadFile(this.certFileUrl).then((blob) => {
      this.triggerBlobDownload(blob, 'cert.pem');
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('网络错误')
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
    downloadFile(this.ledgerFilesUrl).then((blob) => {
      this.triggerBlobDownload(blob, 'ledger_files.zip');
    })
      .catch((error) => {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('网络错误')
        })
      })
      .finally(() => this.setState({
        downloadingLedgerFiles: false,
      }));
  };

  deleteCertFile = () => {
    const { cert } = this.state;
    this.setState({
      deletingCertFile: true,
    }); 
    deleteCertFile(cert.fingerprint).then(() => {
      this.setState({
        deletingCertFile: false,
        certUploaded: false
      });
    }).finally(() => this.setState({
      deletingCertFile: false
    }));
  }

  render() {
    const { certUploaded, downloadingCertFile, downloadingLedgerFiles, uploadingCertFile, deletingCertFile } = this.state;
    return (
      <PageHeaderWrapper>
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
                    <span>
                      <Button
                        size="small"
                        style={{ marginRight: '8px' }}
                        onClick={() => this.downloadCertFile()}
                        loading={downloadingCertFile}
                      >
                        下载pem文件
                      </Button>
                      <Button
                        size="small"
                        style={{ marginRight: '8px' }}
                        onClick={() => this.deleteCertFile()}
                        loading={deletingCertFile}
                      >
                        删除
                      </Button>
                    </span> : ''
                  }
                  {
                    !certUploaded && certUploaded !== undefined ?
                      <Upload {...this.uploadProps(this.certFileUploadUrl)}>
                        <Button size="small" loading={uploadingCertFile}>
                          上传csr文件
                        </Button>
                      </Upload> : ''
                  }
                </div>
                <div className={styles.description}>
                  请先在本地生成csr文件，上传后再由此处下载对应的pem文件，配置流程详见SDK开发文档。
                  <div>
                    <div>csr文件生成步骤：</div>
                    <div style={{ fontFamily: 'monospace', backgroundColor: 'rgba(51, 73, 110, 0.2)', padding: '10px', margin: '8px 0' }}>
                      openssl genrsa -out private.key 2048 <br />
                      openssl req -subj &quot;/C=CN/ST=ZYB/L=ZYB/O=ZYB/OU=Tech Department/CN={this.namespace}&quot; -new -key private.key -out cert.csr <br />
                      openssl pkcs8 -topk8 -inform PEM -outform PEM -in private.key -nocrypt &gt; key.pem
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
      </PageHeaderWrapper>
    );
  }
}

export default Account;
