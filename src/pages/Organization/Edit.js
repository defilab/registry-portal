import React from 'react';
import { message } from 'antd';
import DataSpecForm from './Form';
import { updateOrganization } from '@/services/api';
import handleError from '@/utils/handleError'

const Create = ({ history }) => (
  <DataSpecForm
    mode="edit"
    onSubmit={(data) =>
      updateOrganization(data).then(() => history.push('/organization'))
        .catch((error) => {
          handleError(error).then((data) => {
            message.error(data)
          }).catch(() => {
            message.error('解析错误或未知错误')
          })
        })
    }
  />
);

export default Create;