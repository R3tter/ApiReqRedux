export const checkJSON = data => {
  try {
    JSON.parse(data);
  } catch {
    return false;
  }

  return true;
};

export const parseJSON = response => {
  return response
    .text()
    .then(text => (checkJSON(text) ? JSON.parse(text) : text ? text : {}));
};

export const getHeaders = (headers, additionalHeaders) => {
  const newHeaders = new Headers(headers);
  if (additionalHeaders) {
    additionalHeaders.forEach(addHeader => {
      newHeaders.set(addHeader.name, addHeader.value);
    });
  }
  return newHeaders;
};



//////////////////////////
// refreshToken example
/*

import { createAction } from 'redux-actions';
import { apiRequest } from 'core/apiRequest';

export const reset = createAction('RESET', state => state);
export const setCachedData = createAction('SET_CACHED_DATA', state => state);

export const refreshToken = refreshToken =>
    new Promise(resolve =>
        apiRequest({
          url: '/api/refresh',
          method: 'POST',
          body: {
            refreshToken
          },
          redux: true,
          onSuccess: ({ authToken }) => {
            resolve();
            return setCachedData({ authToken });
          }
        })
    );

 */
