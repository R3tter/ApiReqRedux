import { apiRequestRedux } from "../src";
require("jest-fetch-mock").enableMocks();

const store = () => ({
  getState: () => ({ key: "value" }),
});

beforeEach(() => {
  fetchMock.enableMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe("apiRequestRedux", () => {
  const reset = jest.fn();
  const onErrorFnc = jest.fn();
  const apiRequest = apiRequestRedux({
    store,
    baseUrl: "/api",
    onErrorFnc,
    reset,
  });

  it("url contains base url", async () => {
    await fetchMock.mockResponseOnce((req) => {
      expect(req.url).toBe("/api/someUrl");
      return Promise.resolve().then((res) => ({ body: "ok" }));
    });
    await apiRequest({ url: "/someUrl" });
  });
  it("onStart function works", async () => {
    await fetchMock.mockResponseOnce("");
    const onStart = jest.fn();
    await apiRequest({ url: "someUrl", onStart });
    expect(onStart).toBeCalledTimes(1);
    await apiRequest({ url: "someUrl", onStart });
    expect(onStart).toBeCalledTimes(2);
  });

  it("onSuccess function works as expected", async () => {
    const response = "response";
    await fetchMock.mockResponseOnce(JSON.stringify(response));
    await apiRequest({
      url: "someUrl",
      onSuccess: (data) => expect(data).toBe(response),
    });
  });

  it("apiRequest can handle fetch error", async () => {
    const error = "some err 1";
    fetchMock.mockRejectOnce(error);
    const onError = jest.fn((err) => expect(err).toBe(error));
    await apiRequest({ url: "someUrl", onError });
  });

  it("global onErrorFnc should be called", async () => {
    const error = "some err 2";
    fetchMock.mockResponseOnce(JSON.stringify(error), { status: 500 });
    const onStart = jest.fn();
    await apiRequest({ url: "someUrl", onStart });
    expect(onErrorFnc).toBeCalledTimes(1);
  });

  it("apiRequest can handle error statuses", async () => {
    const error = "some err 3";
    fetchMock.mockResponseOnce(JSON.stringify(error), { status: 500 });
    const onError = jest.fn((err) => expect(err).toBe(error));
    const onSuccess = jest.fn();
    await apiRequest({ url: "someUrl", onError, onSuccess });
    expect(onSuccess).toBeCalledTimes(0);
    expect(onError).toBeCalledTimes(1);
  });
});
