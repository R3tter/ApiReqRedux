import { refreshToken, reset, setCachedData } from 'App/actions';
import { parseJSON, getHeaders } from './utils';
import { addNotification } from 'Notification/actions';
import store from 'store';

const defaultErrorCodes = [400, 403, 404, 405, 408, 500, 501, 502, 503, 504];

const defaultHeaders = [[['Content-Type', 'application/json']]];

const defaultRefreshExceptions = ['logout', 'auth'];

export const apiRequestRedux = config => {
  let refresh = null;
  const {
    store,
    refreshFnc,
    refreshExceptions = defaultRefreshExceptions,
    headers = defaultHeaders,
    errorCodes = defaultErrorCodes,
    onErrorFnc
  } = config;

  return async requestConfig => {
    const {
      url,
      method = 'GET',
      body,
      additionalHeaders,
      onStart,
      onError,
      onSuccess,
      selector
    } = requestConfig;
    const { getState, dispatch } = store;
    const isGet = method === 'GET';
    try {
      onStart && (await dispatch(onStart()));

      const payload = !isGet
        ? JSON.stringify(body || (selector && selector(getState())) || {})
        : null;

      const result = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: getHeaders(headers, additionalHeaders),
        body: payload
      });

      if (!result.ok) {
        throw result;
      }

      const data = await parseJSON(result);

      onSuccess && (await dispatch(onSuccess(data)));
    } catch (err) {
      const { url, status } = err;

      if (
        status === 401 &&
        !refreshExceptions.some(item => url.includes(item)) &&
        refreshFnc
      ) {
        if (refresh === null) {
          try {
            refresh = refreshFnc(getState());
            await refresh;
            refresh = null;
            await apiRequest(requestConfig);
          } catch (e) {
            refresh = null;
          }
          return;
        }

        await refresh;
        await apiRequest(requestConfig);
        return;
      }
      errorCodes.includes(status) && onErrorFnc(store);

      onError && (await dispatch(onError(err)));
    }
  };
};
