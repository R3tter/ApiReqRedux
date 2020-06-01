import { checkJSON, getPayload, getHeaders } from "../src/utils";

const obj = { s: "someValue" };
const json = JSON.stringify(obj);
const bodyParser = jest.fn((input) => ({ parsed: input.s }));
const headers = jest.fn((data) => [["key", data]]);
const additionalHeaders = jest.fn((data) => [["key2", data]]);

describe("utils works correctly", () => {
  it("checkJSON works as expected", () => {
    expect(checkJSON(json)).toBe(true);
    expect(checkJSON(obj)).toBe(false);
    expect(checkJSON("{'a': () => null}")).toBe(false);
  });

  it("getPayload works as expected", () => {
    expect(getPayload(null)).toBe(null);
    expect(getPayload(obj)).toEqual(json);
    expect(getPayload(obj, bodyParser)).toEqual({ parsed: obj.s });
    expect(bodyParser).toBeCalledTimes(1);
  });

  it("getHeaders works as expected", () => {
    expect(getHeaders(headers("data")).get("key")).toBe("data");
    const multipleHeaders = getHeaders(
      headers("data1"),
      additionalHeaders("data2")
    );
    expect(multipleHeaders.get("key")).toBe("data1");
    expect(multipleHeaders.get("key2")).toBe("data2");
  });
});
