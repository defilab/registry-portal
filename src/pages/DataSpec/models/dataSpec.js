import { message } from 'antd';
import { fetchDataSpec, fetchDataSpecs, createDataSpec, updateDataSpec } from '@/services/api';
import handleError from '@/utils/handleError'

export default {
  namespace: 'dataSpec',

  state: {
    dataSpecs: [],
  },

  effects: {
    * single({ payload, callback }, { call }) {
      try {
        const data = yield call(fetchDataSpec, payload.spec);
        callback(data);
      }
      catch (error) {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('未知错误')
        })
      }
    },
    * list(_, { call, put }) {
      try {
        const data = yield call(fetchDataSpecs);
        yield put({
          type: 'updateDataSpecs',
          payload: data,
        });
      }
      catch (error) {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('未知错误')
        })
      }
    },
    * create({ payload, callback }, { call }) {
      try {
        yield call(createDataSpec, {
          ...payload,
          reference: payload.canonical_name,
        });
        callback();
        message.success('Success');
      } catch (error) {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('未知错误')
        })
      }
    },
    * update({ payload, callback }, { call }) {
      try {
        yield call(updateDataSpec, {
          ...payload,
          reference: payload.canonical_name,
        });
        callback();
        message.success('Success');
      } catch (error) {
        handleError(error).then((data) => {
          message.error(data)
        }).catch(() => {
          message.error('未知错误')
        })
      }
    },
  },

  reducers: {
    updateDataSpecs(_, action) {
      return {
        dataSpecs: action.payload,
      };
    },
  },
};
