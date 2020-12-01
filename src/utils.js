export const checkJSON = (data) => {
  try {
    JSON.parse(data);
  } catch {
    return false;
  }

  return true;
};

export const parseJSON = (response) => {
  try {
    return response
      .text()
      .then((text) => (checkJSON(text) ? JSON.parse(text) : text ? text : {}));
  } catch {
    return response;
  }
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

export const createObserver = () => {
  const observers = new Map();

  const subscribe = (key, callback) => {
    const prev = observers.get(key);
    observers.set(key, prev?.length ? [...prev, callback] : [callback]);
  };

  const unSubscribe = (key) => {
    observers.set(
      key,
      observers.get(key)?.filter((item, i) => i !== 0)
    );
  };

  const dispatch = (key, index) =>
    observers
      .get(key)
      ?.map((func, i) => (index ? index === i && func() : func()));

  return {
    subscribe,
    dispatch,
    unSubscribe,
  };
};
