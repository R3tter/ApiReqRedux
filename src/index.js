import { parseJSON, getHeaders, getPayload, createObserver } from './utils';

const defaultErrorCodes = [400, 403, 404, 405, 408, 500, 501, 502, 503, 504];

const defaultHeaders = () => [['Content-Type', 'application/json']];

const { subscribe, dispatch, unSubscribe } = createObserver();

export const apiRequestRedux = config => {
  let refresh = null;
  const {
    store,
    baseUrl = '',
    refreshConfig,
    headers = defaultHeaders,
    errorCodes = defaultErrorCodes,
    defaultCredentials = 'same-origin',
    onErrorFnc = () => null,
    reset
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
      selector = () => null,
      credentials = defaultCredentials,
      useDefaultErrorHandler = true,
      removeHeaders,
      bodyParser,
      abortName,
      withoutBaseUrl = false,
      isRefresh = true
    } = requestConfig;
    const { getState, dispatch } = store ? store() : { getState: () => null, dispatch: () => null };
    const controller = new AbortController();
    abortName &&
      subscribe(abortName, () => {
        controller.abort();
        unSubscribe(abortName);
      });
    try {
      onStart && (await onStart(dispatch));

      const payload = getPayload(body || selector(getState()), bodyParser);
      const finalHeaders = getHeaders(headers(getState()), additionalHeaders(getState()));
      removeHeaders && removeHeaders.forEach(item => finalHeaders.delete(item));

      const result = await fetch(`${!withoutBaseUrl ? baseUrl : ''}${url}`, {
        method,
        credentials,
        headers: finalHeaders,
        body: payload,
        signal: controller.signal
      });

      if (!result.ok) {
        throw result;
      }

      const data = await parseJSON(result);

      onSuccess && (await onSuccess(data, dispatch));
      return Promise.resolve(data);
    } catch (err) {
      const { status, name } = err;
      if (name !== 'AbortError') {
        if (status === 401 && isRefresh && refreshConfig) {
          if (refresh === null) {
            try {
              refresh = apiRequest(refreshConfig);
              await refresh;
              refresh = null;
              await apiRequest(requestConfig);
            } catch (e) {
              refresh = null;
              reset();
            }
            return;
          }

          await refresh;
          await apiRequest(requestConfig);
          return;
        }
        const errorParsed = await parseJSON(err);
        errorCodes.includes(status) && useDefaultErrorHandler && (await onErrorFnc(errorParsed, dispatch));
        onError && (await onError(errorParsed, dispatch));
      }
      return Promise.reject(err);
    }
  };
  return apiRequest;
};

export const abortRequest = dispatch;
