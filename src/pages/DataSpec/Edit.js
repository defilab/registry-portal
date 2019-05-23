import React from 'react';
import { message } from 'antd';
import DataSpecForm from './Form';
import { updateDataSpec } from '../../services/api';
import handleError from '@/utils/handleError'

const Create = ({ match, history }) => (
  <DataSpecForm
    onSubmit={(data) => {
      const { id } = data;
      return updateDataSpec(id, {
        ...data,
        id: undefined,
        canonical_name: undefined,
        reference: undefined
      })
        .then(() => history.push('/data/specs'))
        .catch((error) => {
          handleError(error).then((msg) => {
            message.error(msg)
          }).catch(() => {
            message.error('接口编辑失败')
          })
        });
    }}
    mode="edit"
    spec={match.params.spec}
  />
);

export default Create;
