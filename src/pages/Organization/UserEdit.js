import React from 'react';
import DataSpecForm from './UserForm';

const Create = ({ match }) => (
  <DataSpecForm
    organization={match.params.organization}
    mode="edit"
  />
);

export default Create;