import React from 'react';
import OrganizitionForm from './Form';

const Edit = ({ match }) => (
  <OrganizitionForm
    namespace={match.params.namespace}
    mode="edit"
  />
);

export default Edit;