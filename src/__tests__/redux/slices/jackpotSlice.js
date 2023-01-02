import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import jackpotSlice, { getInitialState, getJackpots } from "redux/slices/jackpotSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState([1, 2, 3])).to.be.deep.equal({
      error: null,
      jackpots: [1, 2, 3],
      loading: false,
    });
  });
  it("should update state when action type is `getJackpots.pending`", () => {
    expect(jackpotSlice({}, getJackpots.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getJackpots.rejected`", () => {
    expect(jackpotSlice({}, getJackpots.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getJackpots.fulfilled`", () => {
    expect(
      jackpotSlice(
        {
          error: "message",
          jackpots: [1, 2, 3],
          loading: true,
        },
        getJackpots.fulfilled({ jackpots: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      jackpots: [2, 3, 99],
      loading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(jackpotSlice({}, { type: undefined })).to.be.deep.equal({});
  });
});
