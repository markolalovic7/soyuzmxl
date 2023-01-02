import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import currencyReducer, { getInitialState, getCurrencies } from "redux/slices/currencySlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" })).to.be.deep.equal({
      currencies: { foo: "bar" },
      error: null,
      loading: false,
    });
  });
  it("should update state when action type is `getCurrencies.pending`", () => {
    expect(currencyReducer({}, getCurrencies.pending())).to.be.deep.equal({
      currencies: null,
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getCurrencies.rejected`", () => {
    expect(currencyReducer({}, getCurrencies.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getCurrencies.fulfilled`", () => {
    expect(
      currencyReducer(
        {
          currencies: [1, 2, 3],
          error: "message",
          loading: true,
        },
        getCurrencies.fulfilled({ currencies: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      currencies: [2, 3, 99],
      error: null,
      loading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(currencyReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
