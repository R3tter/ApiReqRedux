import { parseJSON, getHeaders } from './utils';

const defaultErrorCodes = [400, 403, 404, 405, 408, 500, 501, 502, 503, 504];

const defaultHeaders = () => [['Content-Type', 'application/json']];

const defaultRefreshExceptions = ['logout', 'auth'];

export const apiRequestRedux = config => {
  let refresh = null;
  const {
    store,
    refreshFnc,
    refreshExceptions = defaultRefreshExceptions,
    headers = defaultHeaders,
    errorCodes = defaultErrorCodes,
    defaultCredentials = 'same-origin',
    onErrorFnc
  } = config;

  const apiRequest = async requestConfig => {
    const {
      url,
      method = 'GET',
      body,
      additionalHeaders = () => null,
      onStart,
      onError,
      onSuccess,
      selector,
      credentials = defaultCredentials,
      useDefaultErrorHandler = true,
    } = requestConfig;
    const { getState, dispatch } = store();;
    try {
      onStart && (await dispatch(onStart()));

      const payload = body || selector
        ? JSON.stringify(body || (selector && selector(getState())) || {})
        : null;

      const result = await fetch(url, {
        method,
        credentials,
        headers: getHeaders(headers(getState()), additionalHeaders(getState())),
        body: payload
      });

      if (!result.ok) {
        throw result;
      }

      const data = await parseJSON(result);

      onSuccess && (await dispatch(onSuccess(data)));
      return Promise.resolve(data);
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
      errorCodes.includes(status) && useDefaultErrorHandler && onErrorFnc(store());

      onError && (await dispatch(onError(err)));
      Promise.reject(err);
    }
  };
  return apiRequest;
};
