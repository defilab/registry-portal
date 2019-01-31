import { message } from 'antd';
import { fetchDataSpec, fetchDataSpecs, createDataSpec, updateDataSpec } from '@/services/api';

export default {
  namespace: 'dataSpec',

  state: {
    dataSpecs: [],
  },

  effects: {
    * single ({ payload, callback }, { call }) {
      const data = yield call(fetchDataSpec, payload.spec);
      callback(data);
    },
    * list (_, { call, put }) {
      const data = yield call(fetchDataSpecs);
      yield put({
        type: 'updateDataSpecs',
        payload: data,
      });
    },
    * create ({ payload, callback }, { call }) {
      yield call(createDataSpec, {
        ...payload,
        reference: payload.canonical_name,
      });
      callback();
      message.success('Success');
    },
    * update ({ payload, callback }, { call }) {
      yield call(updateDataSpec, {
        ...payload,
        reference: payload.canonical_name,
      });
      callback();
      message.success('Success');
    },
  },

  reducers: {
    updateDataSpecs (_, action) {
      return {
        dataSpecs: action.payload,
      };
    },
  },
};
