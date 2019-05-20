import React, { Component } from 'react';
import { Select } from 'antd';

// eslint-disable-next-line react/prefer-stateless-function
class ReferenceSelect extends Component {
  render() {
    const { references, ...rest } = this.props;
    return (
      <Select {...rest}>
        {
          references
            .map(reference => <Select.Option value={`#/organizations/${reference.namespace}/fields/${reference.id}`} key={reference.id}>{reference.name}</Select.Option>)
        }
      </Select>
    );
  }
}

export default ReferenceSelect;