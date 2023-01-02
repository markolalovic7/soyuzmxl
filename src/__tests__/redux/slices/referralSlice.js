import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import referralReducer, { getInitialState, getReferrals } from "redux/slices/referralSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" })).to.be.deep.equal({
      error: null,
      loading: false,
      referrals: { foo: "bar" },
    });
  });
  it("should update state when action type is `getReferrals.pending`", () => {
    expect(referralReducer({}, getReferrals.pending())).to.be.deep.equal({
      error: null,
      loading: true,
      referrals: null,
    });
  });
  it("should update state when action type is `getReferrals.rejected`", () => {
    expect(referralReducer({}, getReferrals.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getReferrals.fulfilled`", () => {
    expect(
      referralReducer(
        {
          error: "message",
          loading: true,
          referrals: [1, 2, 3],
        },
        getReferrals.fulfilled({ referrals: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      referrals: [2, 3, 99],
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(referralReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
