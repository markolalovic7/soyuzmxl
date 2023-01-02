import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import countryReducer, { getInitialState, getCountries } from "redux/slices/countrySlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" })).to.be.deep.equal({
      countries: { foo: "bar" },
      error: null,
      loading: false,
    });
  });
  it("should update state when action type is `getCountries.pending`", () => {
    expect(countryReducer({}, getCountries.pending())).to.be.deep.equal({
      countries: null,
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getCountries.rejected`", () => {
    expect(countryReducer({}, getCountries.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getCountries.fulfilled`", () => {
    expect(
      countryReducer(
        {
          countries: [1, 2, 3],
          error: "message",
          loading: true,
        },
        getCountries.fulfilled({ countries: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      countries: [2, 3, 99],
      error: null,
      loading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(countryReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
