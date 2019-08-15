import { newsService, newsCategoryService } from '@/services/news';

const { queryItems: queryNews, saveItem: saveNews, deleteItem: deleteNews, getItemDetail: getNewsDetail, getPreviewDetail } = newsService;
const { queryItems: queryCategories, saveItem: saveCategory, deleteItem: deleteCategory, getItemDetail: getCategoryDetail, getLevelOne } = newsCategoryService;

export default {
  namespace: 'news',

  state: {
    news: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    },
    category: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 100, // 一级分类最多100个
        total: 0
      }
    }
  },

  effects: {
    // news
    *fetchNews({ callback, payload }, { call, put }) {
      if (!payload) payload = {};
      if (!payload.pageSize) payload.pageSize = 20;
      const response = yield call(queryNews, payload);
      if (response && response.code === 0) {
        const { result } = response;
        yield put({
          type: 'save',
          payload: {
            news: {
              list: result.list,
              pagination: result.pagination
            }
          }
        });
        if (callback) callback(response);
      }
    },
    *saveNews({ callback, payload }, { call, put }) {
      const response = yield call(saveNews, payload);
      if (callback) callback(response);
    },
    *getNewsDetail({ callback, payload }, { call, put }) {
      const response = yield call(getNewsDetail, payload);
      if (callback) callback(response);
    },
    *getPreviewDetail({ callback, payload }, { call, put }) {
      const response = yield call(getPreviewDetail, payload);
      if (callback) callback(response);
    },
    *deleteNews({ callback, payload }, { call, put }) {
      const response = yield call(deleteNews, payload);
      if (callback) callback(response);
    },

    // category

    /**
     * 获取所有一级分类
     */
    *fetchLevelOneCategories({ callback, payload }, { call, put }) {
      if (!payload) payload = {};
      if (!payload.pageSize) payload.pageSize = 100;
      const response = yield call(getLevelOne, payload);
      if (response && response.code === 0) {
        const { result } = response;
        yield put({
          type: 'save',
          payload: {
            category: {
              list: result.list.map(item => ({ ...item })),
              pagination: result.pagination
            }
          }
        });
        if (callback) callback(response);
      }
    },
    /**
     * 搜素一级分类
     */
    *searchLevelOneCategories({ callback, payload }, { call, put }) {
      if (!payload) payload = {};
      if (!payload.pageSize) payload.pageSize = 100;
      const response = yield call(getLevelOne, payload);
      if (response && response.code === 0) {
        if (callback) callback(response);
      }
    },
    *queryLevelTwoCategories({ callback, payload }, { call, put, select }) {
      if (!payload || !payload.parentId) return;
      if (!payload.pageSize) payload.pageSize = 100;
      const response = yield call(queryCategories, payload);
      if (response.code === 0) {
        yield put({
          type: 'updateLevelTwo',
          payload: {
            levelOneId: payload.parentId,
            levelTwoCates: response.result.list
          }
        });
      }
      if (callback) callback(response);
    },
    *saveCategory({ callback, payload }, { call, put }) {
      const response = yield call(saveCategory, payload);
      if (callback) callback(response);
    },
    *getCategoryDetail({ callback, payload }, { call, put }) {
      const response = yield call(getCategoryDetail, payload);
      if (callback) callback(response);
    },
    *deleteCategory({ callback, payload }, { call, put }) {
      const response = yield call(deleteCategory, payload);
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
    updateLevelTwo(state, { payload }) {
      const { levelOneId, levelTwoCates } = payload;
      const levelOneIndex = state.category.list.findIndex(c => c._id === levelOneId);
      if (levelOneIndex >= 0) {
        const levelOne = state.category.list[levelOneIndex];
        const listCopy = [...state.category.list];
        listCopy.splice(levelOneIndex, 1, {
          ...levelOne,
          children: levelTwoCates.map(item => ({
            ...item,
            value: item._id,
            label: item.title,
            isLeaf: true
          }))
        });
        const updatedCategory = {
          ...state.category,
          list: listCopy
        }
        return {
          ...state,
          category: updatedCategory
        }
      } else {
        return state;
      }
    }
  },
};
