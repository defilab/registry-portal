import React from 'react';
import { message } from 'antd';
import DataSpecForm from './Form';
import { createOrganization } from '@/services/api';
import handleError from '@/utils/handleError'

const Create = ({ history }) => (
  <DataSpecForm
    mode="new"
    onSubmit={(data) =>
      createOrganization(data).then(org => history.push(`/organizations/${org.namespace}`))
        .catch((error) => {
          handleError(error).then((msg) => {
            message.error(msg)
          }).catch(() => {
            message.error('网络错误')
          })
        })
    }
  />
);

export default Create;
