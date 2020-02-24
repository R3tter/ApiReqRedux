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
    additionalHeaders.forEach(([name, value]) => {
      newHeaders.set(name, value);
    });
  }
  return newHeaders;
};

export const getPayload = (input, bodyParser) => {
  if (!input) return null;
  return bodyParser ? bodyParser(input) : JSON.stringify(input);
};
