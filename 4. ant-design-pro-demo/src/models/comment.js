import commentService from '@/services/comment';

const { queryItems, saveItem, deleteItem, getItemDetail } = commentService;

export default {
  namespace: 'comment',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    }
  },

  effects: {
    *fetchComments({ callback, payload }, { call, put }) {
      if (!payload) payload = {};
      if (!payload.pageSize) payload.pageSize = 4;
      const response = yield call(queryItems, payload);
      if (response && response.code === 0) {
        const { result } = response;
        if (result.pagination.pageNum === 1) {
          yield put({
            type: 'save',
            payload: {
              data: {
                list: result.list,
                pagination: result.pagination
              }
            }
          });
        } else {
          yield put({
            type: 'appendComments',
            payload: {
              list: result.list,
              pagination: result.pagination
            }
          });
        }
        if (callback) callback(response);
      }
    },
    *saveComment({ callback, payload }, { call, put }) {
      const response = yield call(saveItem, payload);
      if (callback) callback(response);
    },
    *getCommentDetail({ callback, payload }, { call, put }) {
      const response = yield call(getItemDetail, payload);
      if (callback) callback(response);
    },
    *deleteComment({ callback, payload }, { call, put }) {
      const response = yield call(deleteItem, payload);
      if (callback) callback(response);
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    appendComments(state, { payload }) {
      return {
        data: {
          list: [...state.data.list, ...payload.list],
          pagination: payload.pagination
        }
      }
    }
  },
};
