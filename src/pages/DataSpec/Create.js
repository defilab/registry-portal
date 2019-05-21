import React from 'react';
import { message } from 'antd';
import DataSpecForm from './Form';
import { createDataSpec } from '../../services/api';
import handleError from '@/utils/handleError'

const Create = ({ history }) => (
  <DataSpecForm
    onSubmit={(data) =>
      createDataSpec(data).then(() => history.push('/data-specs'))
        .catch((error) => {
          handleError(error).then((data) => {
            message.error(data)
          }).catch(() => {
            message.error('解析错误或未知错误')
          })
        })
    }
    mode="create"
  />
);

export default Create;
