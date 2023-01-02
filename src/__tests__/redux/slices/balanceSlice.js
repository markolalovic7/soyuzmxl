import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import balanceReducer, { getInitialState, loadBalance, loadSingleWalletBalance } from "redux/slices/balanceSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState("balance", "singleWalletBalance")).to.be.deep.equal({
      balance: "balance",
      error: null,
      loading: false,
      singleWalletBalance: "singleWalletBalance",
    });
  });
  it("should update state when action type is `loadBalance.pending`", () => {
    expect(balanceReducer({}, loadBalance.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `loadBalance.rejected`", () => {
    expect(balanceReducer({}, loadBalance.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `loadBalance.fulfilled`", () => {
    expect(
      balanceReducer(
        {
          balance: "balance",
          error: "message",
          loading: true,
        },
        loadBalance.fulfilled({ balance: "balance-1" }),
      ),
    ).to.be.deep.equal({
      balance: "balance-1",
      error: null,
      loading: false,
    });
  });
  it("should update state when action type is `loadSingleWalletBalance.pending`", () => {
    expect(balanceReducer({}, loadSingleWalletBalance.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `loadSingleWalletBalance.rejected`", () => {
    expect(balanceReducer({}, loadSingleWalletBalance.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `loadSingleWalletBalance.fulfilled`", () => {
    expect(
      balanceReducer(
        {
          balance: "balance",
          error: "message",
          loading: true,
          singleWalletBalance: "singleWalletBalance",
        },
        loadSingleWalletBalance.fulfilled({ singleWalletBalance: "singleWalletBalance-1" }),
      ),
    ).to.be.deep.equal({
      balance: "balance",
      error: null,
      loading: false,
      singleWalletBalance: "singleWalletBalance-1",
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(balanceReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
