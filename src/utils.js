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

export const getHeaders = additionalHeaders => {
  const headers = new Headers([
    ['Content-Type', 'application/json'],
    ['x-language', store.getState().Cached.language],
    ['session', store.getState().Cached.authToken]
  ]);
  if (additionalHeaders) {
    additionalHeaders.forEach(addHeader => {
      headers.set(addHeader.name, addHeader.value);
    });
  }

  return headers;
};
