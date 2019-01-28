import React, { PureComponent } from 'react';
import { Button, Card, Table } from 'antd';
import router from 'umi/router';
import styles from './TableList.less';

class List extends PureComponent {
  columns = [
    {
      title: 'Spec Name',
      key: 'spec-name',
    },
    {
      title: 'Field Count',
      key: 'field-count',
    },
    {
      title: 'Data Type',
      key: 'data-type',
    },
    {
      title: 'Creation Time',
      key: 'creation-time',
    },
    {
      title: 'Response State',
      key: 'response-state',
    },
    {
      title: 'Response Time',
      key: 'response-time',
    },
    {
      title: 'Response Count',
      key: 'response-count',
    },
    {
      title: 'Requester Count',
      key: 'requester-count',
    },
    {
      title: 'Sales Amount',
      key: 'sales-amount',
    },
    {
      title: 'State',
      key: 'state'
    },
    {
      title: 'Review submission time',
      key: 'review-submission-time',
    },
    {
      title: 'Review Status',
      key: 'review-status',
    },
    {
      title: 'Operations',
      key: 'operations',
    },
  ];

  data = [];

  render () {
    const showNewSpecForm = () => router.push('/data-specs/new');
    return (
      <Card title="Data Usage">
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={showNewSpecForm}>
              New
            </Button>
          </div>
          <Table columns={this.columns} data={this.data} />
        </div>
      </Card>);
  }
}

export default List;
