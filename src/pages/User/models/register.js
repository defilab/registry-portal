import { register } from '@/services/api';
import { reloadAuthorized } from '@/utils/Authorized';
import handleError from '@/utils/handleError'
import { message } from 'antd';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      try {
        const response = yield call(register, payload);
        yield put({
          type: 'registerHandle',
          payload: response,
        });
      }
      catch (error) {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('网络错误')
        })
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
