import { apiRequestRedux } from "../src";

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

describe("apiRequestRedux", () => {
  it("test", () => {
    jest.spyOn(global, "fetch").mockImplementation(() => console.log("inner"));
    fetch("someUrl");
  });
});
