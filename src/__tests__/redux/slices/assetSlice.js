import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import assetReducer, { getInitialState, loadAsset } from "redux/slices/assetSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" })).to.be.deep.equal({
      cachedAssets: { foo: "bar" },
      error: null,
      loading: false,
    });
  });
  it("should update state when action type is `loadAsset.pending`", () => {
    expect(assetReducer({}, loadAsset.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `loadAsset.rejected`", () => {
    expect(assetReducer({}, loadAsset.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `loadAsset.fulfilled` and cachedAssets is empty", () => {
    expect(
      assetReducer(
        {
          cachedAssets: {},
          error: "message",
          loading: true,
        },
        loadAsset.fulfilled({ asset: { foo: "bar" }, assetId: "assetId" }),
      ),
    ).to.be.deep.equal({
      cachedAssets: {
        assetId: { foo: "bar" },
      },
      error: null,
      loading: false,
    });
  });
  it("should update state when action type is `loadAsset.fulfilled`", () => {
    expect(
      assetReducer(
        {
          cachedAssets: {
            assetId: { baz: "bar" },
          },
          error: "message",
          loading: true,
        },
        loadAsset.fulfilled({ asset: { foo: "bar" }, assetId: "assetId" }),
      ),
    ).to.be.deep.equal({
      cachedAssets: {
        assetId: { foo: "bar" },
      },
      error: null,
      loading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(assetReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
