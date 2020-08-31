import { parseJSON, getHeaders, getPayload } from "./utils";

const defaultErrorCodes = [400, 403, 404, 405, 408, 500, 501, 502, 503, 504];

const defaultHeaders = () => [["Content-Type", "application/json"]];

export const apiRequestRedux = (config) => {
  let refresh = null;
  const {
    store,
    baseUrl = "",
    refreshConfig,
    headers = defaultHeaders,
    errorCodes = defaultErrorCodes,
    defaultCredentials = "same-origin",
    onErrorFnc = () => null,
    reset,
  } = config;

  const apiRequest = async (requestConfig) => {
    const {
      url,
      method = "GET",
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
      isRefresh = true
    } = requestConfig;
    const { getState, dispatch } = store();
    try {
      onStart && (await onStart(dispatch));

      const payload = getPayload(body || selector(getState()), bodyParser);
      const finalHeaders = getHeaders(
        headers(getState()),
        additionalHeaders(getState())
      );
      removeHeaders &&
        removeHeaders.forEach((item) => finalHeaders.delete(item));

      const result = await fetch(baseUrl + url, {
        method,
        credentials,
        headers: finalHeaders,
        body: payload,
      });

      if (!result.ok) {
        throw result;
      }

      const data = await parseJSON(result);

      onSuccess && (await onSuccess(data, dispatch));
      return Promise.resolve(data);
    } catch (err) {
      const { status } = err;
      if (
        status === 401 && isRefresh && refreshConfig
      ) {
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
      errorCodes.includes(status) &&
        useDefaultErrorHandler &&
        onErrorFnc(store(), err);
      onError && (await onError(await parseJSON(err), dispatch));
      Promise.reject(err);
    }
  };
  return apiRequest;
};
