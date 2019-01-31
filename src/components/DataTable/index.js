import React from 'react';
import { Table } from 'antd';

export default function dataTable (props) {
  return (
    <div>
      <Table {...props} />
      <div style={{float: 'right'}}>wtf</div>
    </div>
  );
}
