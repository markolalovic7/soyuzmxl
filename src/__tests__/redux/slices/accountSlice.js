import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import accountReducer, {
  createAccount,
  getInitialState,
  loadAccountData,
  updateAccount,
} from "redux/slices/accountSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState("accountData")).to.be.deep.equal({
      accountData: "accountData",
      accountFieldErrors: null,
      error: null,
      loading: false,
      tokenValidationError: null,
      validToken: false,
      validatingToken: false,
    });
  });
  it("should update state when action type is `loadAccountData.pending`", () => {
    expect(accountReducer({}, loadAccountData.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `loadAccountData.rejected`", () => {
    expect(accountReducer({}, loadAccountData.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `loadAccountData.fulfilled`", () => {
    expect(
      accountReducer(
        {
          error: "message",
          loading: true,
        },
        loadAccountData.fulfilled({ accountData: "accountData" }),
      ),
    ).to.be.deep.equal({
      accountData: "accountData",
      error: null,
      loading: false,
    });
  });
  it("should update state when action type is `createAccount.pending`", () => {
    expect(accountReducer({}, createAccount.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `createAccount.rejected`", () => {
    expect(
      accountReducer(
        {
          accountFieldErrors: undefined,
          error: undefined,
          loading: true,
        },
        createAccount.rejected({
          message: "message",
        }),
      ),
    ).to.be.deep.equal({
      accountFieldErrors: undefined,
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `createAccount.fulfilled`", () => {
    expect(
      accountReducer(
        {
          error: "message",
          loading: true,
        },
        createAccount.fulfilled({ accountData: { id: "accountData", priceFormat: "priceFormat" } }),
      ),
    ).to.be.deep.equal({
      accountData: { id: "accountData", priceFormat: "priceFormat" },
      accountFieldErrors: null,
      error: null,
      loading: false,
    });
  });
  it("should update state when action type is `updateAccount.pending`", () => {
    expect(accountReducer({}, updateAccount.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `updateAccount.rejected`", () => {
    expect(
      accountReducer(
        {
          accountFieldErrors: undefined,
          error: undefined,
          loading: true,
        },
        updateAccount.rejected({
          message: "message",
        }),
      ),
    ).to.be.deep.equal({
      accountFieldErrors: undefined,
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `updateAccount.fulfilled`", () => {
    expect(
      accountReducer(
        {
          accountData: {
            firstName: "firstName",
            priceFormat: "EURO",
          },
          accountFieldErrors: undefined,
          error: "message",
          loading: true,
        },
        updateAccount.fulfilled({ accountData: { id: "accountData", priceFormat: "priceFormat" } }),
      ),
    ).to.be.deep.equal({
      accountData: { id: "accountData", priceFormat: "priceFormat" },
      accountFieldErrors: undefined,
      error: null,
      loading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(accountReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
