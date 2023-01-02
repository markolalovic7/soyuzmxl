import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import languageReducer, { getInitialState, getLanguages } from "redux/slices/languageSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" })).to.be.deep.equal({
      error: null,
      languages: { foo: "bar" },
      loading: false,
    });
  });
  it("should update state when action type is `getLanguages.pending`", () => {
    expect(languageReducer({}, getLanguages.pending())).to.be.deep.equal({
      error: null,
      languages: null,
      loading: true,
    });
  });
  it("should update state when action type is `getLanguages.rejected`", () => {
    expect(languageReducer({}, getLanguages.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getLanguages.fulfilled`", () => {
    expect(
      languageReducer(
        {
          error: "message",
          languages: [1, 2, 3],
          loading: true,
        },
        getLanguages.fulfilled({ languages: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      languages: [2, 3, 99],
      loading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(languageReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
