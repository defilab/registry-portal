import React from 'react';
import DataSpecForm from './Form';

const Create = ({ match }) => (
  <DataSpecForm
    organization={match.params.organization}
    mode="new"
  />
);

export default Create;
