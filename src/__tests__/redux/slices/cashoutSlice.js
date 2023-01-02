import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import cashoutReducer, {
  getActiveBetCount,
  getActiveBetDetail,
  getFreshQuotation,
  getInitialState,
  cashout,
} from "redux/slices/cashoutSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState(4, 2, [1, 2])).to.be.deep.equal({
      activeBetCount: 4,
      activeBets: [1, 2],
      cashableBetCount: 2,
      cashoutConfirmed: false,
      cashoutFailed: false,
      cashoutProcessing: false,
      error: null,
      loading: false,
      loadingCount: false,
    });
  });
  it("should update state when action type is `getActiveBetCount.pending`", () => {
    expect(cashoutReducer({}, getActiveBetCount.pending())).to.be.deep.equal({
      error: null,
      loadingCount: true,
    });
  });
  it("should update state when action type is `getActiveBetCount.rejected`", () => {
    expect(cashoutReducer({}, getActiveBetCount.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loadingCount: false,
    });
  });
  it("should update state when action type is `getActiveBetCount.fulfilled`", () => {
    expect(
      cashoutReducer(
        {
          activeBetCount: 44,
          cashableBetCount: 5,
          error: "message",
          loading: false,
          loadingCount: true,
        },
        getActiveBetCount.fulfilled({ activeBetCount: 42, cashableBetCount: 2 }),
      ),
    ).to.be.deep.equal({
      activeBetCount: 42,
      cashableBetCount: 2,
      error: null,
      loading: false,
      loadingCount: false,
    });
  });
  it("should update state when action type is `getActiveBetDetail.pending`", () => {
    expect(cashoutReducer({}, getActiveBetDetail.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getActiveBetDetail.rejected`", () => {
    expect(cashoutReducer({}, getActiveBetDetail.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getActiveBetDetail.fulfilled`", () => {
    expect(
      cashoutReducer(
        {
          activeBets: [1, 3],
          error: "message",
          loading: true,
          loadingCount: false,
        },
        getActiveBetDetail.fulfilled({ activeBets: [4, 2] }),
      ),
    ).to.be.deep.equal({
      activeBets: [4, 2],
      error: null,
      loading: false,
      loadingCount: false,
    });
  });
  it("should update state when action type is `getFreshQuotation.pending`", () => {
    expect(cashoutReducer({}, getFreshQuotation.pending())).to.be.deep.equal({
      error: null,
    });
  });
  it("should update state when action type is `getFreshQuotation.rejected`", () => {
    expect(cashoutReducer({}, getFreshQuotation.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
    });
  });
  it("shouldn't update state when action type is `getFreshQuotation.fulfilled` and `activeBet` from payload is `undefined`", () => {
    expect(
      cashoutReducer(
        {
          activeBets: [1, 3],
          error: "message",
        },
        getFreshQuotation.fulfilled({ activeBet: undefined }),
      ),
    ).to.be.deep.equal({
      activeBets: [1, 3],
      error: null,
    });
  });
  it("shouldn't update state when action type is `getFreshQuotation.fulfilled` and `activeBet` is missing in store", () => {
    expect(
      cashoutReducer(
        {
          activeBets: [
            {
              betBucketId: 1,
            },
          ],
          error: "message",
        },
        getFreshQuotation.fulfilled({ activeBet: { betBucketId: 2 } }),
      ),
    ).to.be.deep.equal({
      activeBets: [
        {
          betBucketId: 1,
        },
      ],
      error: null,
    });
  });
  it("should update state when action type is `getFreshQuotation.fulfilled` and `activeBet` is in store", () => {
    expect(
      cashoutReducer(
        {
          activeBets: [
            {
              betBucketId: 1,
            },
          ],
          error: "message",
        },
        getFreshQuotation.fulfilled({ activeBet: { betBucketId: 1, foo: "bar" } }),
      ),
    ).to.be.deep.equal({
      activeBets: [
        {
          betBucketId: 1,
          foo: "bar",
        },
      ],
      error: null,
    });
  });
  it("should update state when action type is `cashout.pending`", () => {
    expect(
      cashoutReducer(
        {
          activeBetCount: 1,
          activeBets: [4, 2],
          cashoutConfirmed: false,
          cashoutFailed: false,
          cashoutProcessing: false,
          error: null,
          loading: false,
          loadingCount: false,
        },
        cashout.pending(),
      ),
    ).to.be.deep.equal({
      activeBetCount: 1,
      activeBets: [4, 2],
      cashoutConfirmed: false,
      cashoutFailed: false,
      cashoutProcessing: true,
      error: null,
      loading: false,
      loadingCount: false,
    });
  });
  it("should update state when action type is `getActiveBetDetail.rejected`", () => {
    expect(
      cashoutReducer(
        {
          activeBetCount: 1,
          activeBets: [4, 2],
          cashoutConfirmed: false,
          cashoutFailed: false,
          cashoutProcessing: true,
          error: null,
          loading: false,
          loadingCount: false,
        },
        cashout.rejected({ message: "message" }),
      ),
    ).to.be.deep.equal({
      activeBetCount: 1,
      activeBets: [4, 2],
      cashoutConfirmed: false,
      cashoutFailed: true,
      cashoutProcessing: false,
      error: "message",
      loading: false,
      loadingCount: false,
    });
  });
  it("should update state when action type is `cashout.fulfilled`", () => {
    expect(
      cashoutReducer(
        {
          activeBetCount: 1,
          activeBets: [4, 2],
          cashoutConfirmed: false,
          cashoutFailed: true,
          cashoutProcessing: true,
          error: "message",
          loading: false,
          loadingCount: false,
        },
        cashout.fulfilled(),
      ),
    ).to.be.deep.equal({
      activeBetCount: 1,
      activeBets: [4, 2],
      cashoutConfirmed: true,
      cashoutFailed: true,
      cashoutProcessing: false,
      error: null,
      loading: false,
      loadingCount: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(cashoutReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
