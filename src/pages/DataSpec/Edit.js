import React from 'react';
import DataSpecForm from './Form';
import { updateDataSpec } from '../../services/api';

const Create = ({ match, history }) => (
  <DataSpecForm
    onSubmit={(data) =>
      updateDataSpec(data).then(() => history.push('/data-specs'))
    }
    mode="edit"
    spec={match.params.spec}
  />
);

export default Create;
