import { query as queryUsers } from '@/services/user';
import { getToken } from '@/utils/token';
import jwtDecode from 'jwt-decode';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { put }) {
      const tokenObj = jwtDecode(getToken());
      yield put({
        type: 'saveCurrentUser',
        payload: {
          name: tokenObj.username,
          avatar: 'https://png.pngtree.com/svg/20160506/anonymous_avatar_182327.png',
          namespace: tokenObj.namespace
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
