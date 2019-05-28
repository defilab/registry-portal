import React from 'react';
import { message } from 'antd';
import DataSpecForm from './Form';
import { createDataSpec } from '../../services/api';
import handleError from '@/utils/handleError'

const Create = ({ history }) => (
  <DataSpecForm
    onSubmit={(data) =>
      createDataSpec(data).then(() => history.push('/data/specs'))
        .catch((error) => {
          handleError(error).then((msg) => {
            message.error(msg)
          }).catch(() => {
            message.error('未知错误')
          })
        })
    }
    mode="create"
  />
);

export default Create;
