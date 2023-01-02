import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import cmsReducer, { getInitialState, getCmsConfig } from "redux/slices/cmsSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" }, "originId")).to.be.deep.equal({
      config: { foo: "bar" },
      error: null,
      lineId: null,
      loading: false,
      originId: "originId",
    });
  });
  it("should update state when action type is `getCmsConfig.pending`", () => {
    expect(cmsReducer({}, getCmsConfig.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getCmsConfig.rejected`", () => {
    expect(cmsReducer({}, getCmsConfig.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getCmsConfig.fulfilled`", () => {
    expect(
      cmsReducer(
        {
          error: "message",
          lineId: "lineId",
          loading: true,
          originId: "originId",
        },
        getCmsConfig.fulfilled({ config: [2, 3, 99], lineId: "lineId-1", originId: "originId-1" }),
      ),
    ).to.be.deep.equal({
      config: [2, 3, 99],
      error: null,
      lineId: "lineId-1",
      loading: false,
      originId: "originId-1",
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(cmsReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
