import React from 'react';
import DataSpecForm from './Form';
import { createDataSpec } from '../../services/api';

const Create = ({ history }) => (
  <DataSpecForm
    onSubmit={(data) =>
      createDataSpec(data).then(() => history.push('/data-specs'))
    }
    mode="create"
  />
);

export default Create;
