import React from 'react';
import UserForm from './UserForm';

const UserCreate = ({ match }) => (
  <UserForm
    namespace={match.params.namespace}
    mode="new"
  />
);

export default UserCreate;