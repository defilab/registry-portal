import React from 'react';
import { message } from 'antd';
import DataSpecForm from './Form';
import { updateDataSpec } from '../../services/api';
import handleError from '@/utils/handleError'

const Create = ({ match, history }) => (
  <DataSpecForm
    onSubmit={(data) =>
      updateDataSpec(data).then(() => history.push('/data-specs'))
        .catch((error) => {
          handleError(error).then((data) => {
            message.error(data)
          }).catch(() => {
            message.error('解析错误或未知错误')
          })
        })
    }
    mode="edit"
    spec={match.params.spec}
  />
);

export default Create;
