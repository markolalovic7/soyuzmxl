import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import sportsTreeReducer, { getInitialState, getSportsTree } from "redux/slices/sportsTreeSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" }, [3, 2])).to.be.deep.equal({
      error: null,
      loading: false,
      sportsTreeCache: { foo: "bar" },
      sportsTreeData: [3, 2],
    });
  });
  it("should update state when action type is `getSportsTree.pending`", () => {
    expect(sportsTreeReducer({}, getSportsTree.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getSportsTree.rejected`", () => {
    expect(sportsTreeReducer({}, getSportsTree.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getSportsTree.fulfilled` and payload has `cacheKey`", () => {
    expect(
      sportsTreeReducer(
        {
          error: "message",
          loading: true,
          sportsTreeCache: { foo: "bar" },
          sportsTreeData: [3, 2],
        },
        getSportsTree.fulfilled({ cacheKey: "cacheKey", sportsTreeData: [4, 2] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      sportsTreeCache: {
        cacheKey: [4, 2],
        foo: "bar",
      },
      sportsTreeData: [3, 2],
    });
  });
  it("should update state when action type is `getSportsTree.fulfilled` and payload has not `cacheKey`", () => {
    expect(
      sportsTreeReducer(
        {
          error: "message",
          loading: true,
          sportsTreeCache: { foo: "bar" },
          sportsTreeData: [3, 2],
        },
        getSportsTree.fulfilled({ sportsTreeData: [4, 2] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      sportsTreeCache: {
        foo: "bar",
      },
      sportsTreeData: [4, 2],
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(sportsTreeReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
