import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import sportReducer, { getInitialState, getSports } from "redux/slices/sportSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" })).to.be.deep.equal({
      error: null,
      loading: false,
      sports: { foo: "bar" },
    });
  });
  it("should update state when action type is `getSports.pending`", () => {
    expect(sportReducer({}, getSports.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getSports.rejected`", () => {
    expect(sportReducer({}, getSports.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getSports.fulfilled`", () => {
    expect(
      sportReducer(
        {
          error: "message",
          loading: true,
          sports: [1, 2, 3],
        },
        getSports.fulfilled({ sports: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      sports: [2, 3, 99],
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(sportReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
