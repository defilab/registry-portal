import React from 'react';
import FieldForm from './Form';

const Edit = ({ match }) => (
  <FieldForm mode="edit" fieldId={match.params.id} />
);

export default Edit;