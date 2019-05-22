import React from 'react';
import OrganizitionForm from './Form';

const Create = ({ match }) => (
  <OrganizitionForm
    namespace={match.params.namespace}
    mode="new"
  />
);

export default Create;
