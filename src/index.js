import { refreshToken, reset, setCachedData } from 'App/actions';
import { errorCodes } from './constants';
import { parseJSON, getHeaders } from './helpers';
import { addNotification } from 'Notification/actions';
import store from 'store';

let refresh = null;

export const apiRequest = async config => {
  const {
    url,
    method = 'GET',
    body,
    additionalHeaders,
    onStart,
    onError,
    onSuccess,
    redux,
    selector
  } = config;
  const { getState, dispatch } = store;
  const { Cached } = getState();
  const isGet = method === 'GET';
  try {
    if (onStart) {
      redux ? await dispatch(onStart()) : onStart();
    }

    const payload = !isGet
      ? JSON.stringify(body || selector(getState()) || {})
      : null;

    const result = await fetch(url, {
      method,
      credentials: 'same-origin',
      headers: getHeaders(additionalHeaders),
      body: payload
    });

    if (!result.ok) {
      throw result;
    }

    const data = await parseJSON(result);

    if (onSuccess) {
      redux ? await dispatch(onSuccess(data)) : onSuccess(data);
    }
  } catch (err) {
    const { url, status } = err;

    if (err.status === 401 && Cached.refreshToken && !url.includes('/logout')) {
      if (refresh === null) {
        try {
          refresh = refreshToken(Cached.refreshToken);
          await refresh;
          refresh = null;
          return apiRequest(config);
        } catch (e) {
          refresh = null;
          await dispatch(reset());
        }
      }

      await refresh;
      return apiRequest(config);
    }
    errorCodes.includes(status) &&
      (await dispatch(addNotification({ type: 'error', code: status })));
    if (onError) {
      redux ? await dispatch(onError(err)) : onError(err);
    }
  }
};
