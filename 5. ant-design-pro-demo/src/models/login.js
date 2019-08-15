import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getFakeCaptcha } from '@/services/api';
import { login, logout } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      console.log(response);
      if (response && response.code === 0) {
        const { result } = response;
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: result.role,
            status: true,
            type: 'admin'
          },
        });
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect && (redirect.indexOf('user/login') >= 0 || redirect.indexOf('user/logout') >= 0)) {
          redirect = null;
        }
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: 'guest',
            status: false,
            type: 'admin'
          },
        });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({ callback, payload }, { call, put }) {
      const response = yield call(logout);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
