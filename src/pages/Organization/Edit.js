import React from 'react';
import { message } from 'antd';
import DataSpecForm from './Form';
import { updateOrganization } from '@/services/api';
import handleError from '@/utils/handleError'

const Create = ({ history }) => (
  <DataSpecForm
    mode="edit"
    onSubmit={(data) =>
      updateOrganization(data).then((org) => history.push(`/organizations/${org.namespace}`))
        .catch((error) => {
          handleError(error).then((msg) => {
            message.error(msg)
          }).catch(() => {
            message.error('未知错误')
          })
        })
    }
  />
);

export default Create;