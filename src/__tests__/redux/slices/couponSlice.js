import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import couponReducer, {
  getInitialState,
  loadCouponData,
  searchForCouponData,
  clearCoupon,
  clearSearchResults,
} from "redux/slices/couponSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" }, { foo: "bar2" })).to.be.deep.equal({
      activeSearchKeyword: null,
      asianCouponData: { foo: "bar2" },
      asianCouponError: {},
      asianCouponFromTimestamp: {},
      asianCouponLoading: {},
      couponData: { foo: "bar" },
      couponError: {},
      couponFromTimestamp: {},
      couponLoading: {},
      searchCouponData: null,
      searchError: null,
      searchFromTimestamp: null,
      searchLoading: false,
    });
  });
  it("shouldn't update state when action type is `loadCouponData.pending` and action is empty", () => {
    expect(
      couponReducer(
        {
          activeSearchKeyword: null,
          couponData: { foo: "bar" },
          couponError: {},
          couponFromTimestamp: {},
          couponLoading: { 1: false, 2: false },
          searchCouponData: null,
          searchError: null,
          searchLoading: false,
        },
        loadCouponData.pending({}),
      ),
    ).to.be.deep.equal({
      activeSearchKeyword: null,
      couponData: { foo: "bar" },
      couponError: {},
      couponFromTimestamp: {},
      couponLoading: { 1: false, 2: false },
      searchCouponData: null,
      searchError: null,
      searchLoading: false,
    });
  });
  it("should update state when action type is `loadCouponData.pending` and action is not empty", () => {
    expect(
      couponReducer(
        {
          activeSearchKeyword: null,
          couponData: { foo: "bar" },
          couponError: { 1: "error-1", 2: "error-2" },
          couponFromTimestamp: {},
          couponLoading: { 1: true, 2: false },
          searchCouponData: null,
          searchError: null,
          searchLoading: false,
        },
        loadCouponData.pending({}, { codes: 1 }),
      ),
    ).to.be.deep.equal({
      activeSearchKeyword: null,
      couponData: { foo: "bar" },
      couponError: { 1: null, 2: "error-2" },
      couponFromTimestamp: {},
      couponLoading: { 1: true, 2: false },
      searchCouponData: null,
      searchError: null,
      searchLoading: false,
    });
  });
  it("shouldn't update state when action type is `loadCouponData.rejected` and action is empty", () => {
    expect(
      couponReducer(
        {
          activeSearchKeyword: null,
          couponData: { foo: "bar" },
          couponError: {},
          couponFromTimestamp: {},
          couponLoading: { 1: true, 2: true },
          searchCouponData: null,
          searchError: null,
          searchLoading: false,
        },
        loadCouponData.rejected({}),
      ),
    ).to.be.deep.equal({
      activeSearchKeyword: null,
      couponData: { foo: "bar" },
      couponError: {},
      couponFromTimestamp: {},
      couponLoading: { 1: true, 2: true },
      searchCouponData: null,
      searchError: null,
      searchLoading: false,
    });
  });
  it("should update state when action type is `loadCouponData.rejected` and action is not empty", () => {
    expect(
      couponReducer(
        {
          activeSearchKeyword: null,
          couponData: { foo: "bar" },
          couponError: { 1: "error-1", 2: "error-2" },
          couponFromTimestamp: {},
          couponLoading: { 1: true, 2: false },
          searchCouponData: null,
          searchError: null,
          searchLoading: false,
        },
        loadCouponData.rejected({ message: "message" }, {}, { codes: 1 }),
      ),
    ).to.be.deep.equal({
      activeSearchKeyword: null,
      couponData: { foo: "bar" },
      couponError: { 1: "message", 2: "error-2" },
      couponFromTimestamp: {},
      couponLoading: { 1: false, 2: false },
      searchCouponData: null,
      searchError: null,
      searchLoading: false,
    });
  });
  it("shouldn't update state when action type is `loadCouponData.fulfilled` and action is empty", () => {
    expect(
      couponReducer(
        {
          activeSearchKeyword: null,
          couponData: { foo: "bar" },
          couponError: {},
          couponFromTimestamp: {},
          couponLoading: { 1: true, 2: true },
          searchCouponData: null,
          searchError: null,
          searchLoading: false,
        },
        loadCouponData.fulfilled({}),
      ),
    ).to.be.deep.equal({
      activeSearchKeyword: null,
      couponData: { foo: "bar" },
      couponError: {},
      couponFromTimestamp: {},
      couponLoading: { 1: true, 2: true },
      searchCouponData: null,
      searchError: null,
      searchLoading: false,
    });
  });
  it("should update state when action type is `loadCouponData.fulfilled` and action is not empty", () => {
    expect(
      couponReducer(
        {
          activeSearchKeyword: null,
          couponData: { foo: "bar" },
          couponError: {},
          couponFromTimestamp: { 1: "couponFromTimestamp" },
          couponLoading: { 1: true, 2: false },
          searchCouponData: null,
          searchError: null,
          searchLoading: false,
        },
        loadCouponData.fulfilled(
          { couponData: "couponData-1", couponFromTimestamp: "couponFromTimestamp-1" },
          {},
          { codes: 1 },
        ),
      ),
    ).to.be.deep.equal({
      activeSearchKeyword: null,
      couponData: { 1: "couponData-1", foo: "bar" },
      couponError: {},
      couponFromTimestamp: { 1: "couponFromTimestamp-1" },
      couponLoading: { 1: false, 2: false },
      searchCouponData: null,
      searchError: null,
      searchLoading: false,
    });
  });
  it("should update state when action type is `searchForCouponData.pending`", () => {
    expect(couponReducer({}, searchForCouponData.pending())).to.be.deep.equal({
      // searchCouponData: null,
      searchError: null,
      searchLoading: true,
    });
  });
  it("should update state when action type is `searchForCouponData.rejected`", () => {
    expect(couponReducer({}, searchForCouponData.rejected({ message: "message" }))).to.be.deep.equal({
      searchError: "message",
      searchLoading: false,
    });
  });
  it("should update state when action type is `searchForCouponData.fulfilled`", () => {
    expect(
      couponReducer(
        {
          searchCouponData: [1, 2, 3],
          searchLoading: true,
        },
        searchForCouponData.fulfilled({ searchCouponData: [2, 3, 99], searchFromTimestamp: 1234567 }),
      ),
    ).to.be.deep.equal({
      searchCouponData: [2, 3, 99],
      searchFromTimestamp: 1234567,
      searchLoading: false,
    });
  });
  it("should update state when action type is `searchForCouponData.fulfilled`", () => {
    expect(
      couponReducer(
        {
          searchCouponData: [1, 2, 3],
          searchLoading: true,
        },
        searchForCouponData.fulfilled({ searchFromTimestamp: 1234567 }),
      ),
    ).to.be.deep.equal({
      searchCouponData: [1, 2, 3],
      searchFromTimestamp: 1234567,
      searchLoading: false,
    });
  });
  it("should update state when action is `clearCoupon`", () => {
    expect(
      couponReducer(
        {
          couponData: { 1: "couponData-1", foo: "bar" },
          couponError: { 1: "couponError-1" },
          couponFromTimestamp: { 1: "couponFromTimestamp-1" },
        },
        clearCoupon({ codes: 1 }),
      ),
    ).to.be.deep.equal({
      couponData: { foo: "bar" },
      couponError: {},
      couponFromTimestamp: {},
    });
    expect(
      couponReducer(
        {
          couponData: { 1: "couponData-1", foo: "bar" },
          couponError: { 1: "couponError-1" },
          couponFromTimestamp: { 1: "couponFromTimestamp-1" },
        },
        clearCoupon({}),
      ),
    ).to.be.deep.equal({
      couponData: { 1: "couponData-1", foo: "bar" },
      couponError: { 1: "couponError-1" },
      couponFromTimestamp: { 1: "couponFromTimestamp-1" },
    });
  });
  it("should clear state when action is `clearSearchResults`", () => {
    expect(
      couponReducer(
        {
          activeSearchKeyword: "abc",
          searchCouponData: { 1: "searchCouponData-1" },
        },
        clearSearchResults(),
      ),
    ).to.be.deep.equal({
      activeSearchKeyword: null,
      searchCouponData: null,
      searchFromTimestamp: null,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(couponReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
