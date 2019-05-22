import React from 'react';
import UserForm from './UserForm';

const UserEdit = ({ match }) => (
  <UserForm
    namespace={match.params.namespace}
    userId={match.params.userId}
    mode="edit"
  />
);

export default UserEdit;