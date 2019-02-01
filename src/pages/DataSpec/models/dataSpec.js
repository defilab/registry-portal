import { message } from 'antd';
import { formatMessage } from 'umi/locale';
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
      try {
        yield call(createDataSpec, {
          ...payload,
          reference: payload.canonical_name,
        });
        callback();
        message.success('Success');
      } catch (error) {
        message.error('Sorry, this spec type can only be created once');
      }
    },
    * update ({ payload, callback }, { call }) {
      try {
        yield call(updateDataSpec, {
          ...payload,
          reference: payload.canonical_name,
        });
        callback();
        message.success('Success');
      } catch (error) {
        message.error(formatMessage({id : 'spec.edit-error'}));
      }
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
