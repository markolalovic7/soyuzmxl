import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import loadLiveCalendarReducer, { getInitialState, loadLiveCalendarData } from "redux/slices/liveCalendarSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState([4, 2])).to.be.deep.equal({
      error: null,
      liveCalendarData: [4, 2],
      loading: false,
    });
  });
  it("should update state when action type is `loadLiveCalendarData.pending`", () => {
    expect(loadLiveCalendarReducer({}, loadLiveCalendarData.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `loadLiveCalendarData.rejected`", () => {
    expect(loadLiveCalendarReducer({}, loadLiveCalendarData.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `loadLiveCalendarData.fulfilled`", () => {
    expect(
      loadLiveCalendarReducer(
        {
          error: "message",
          liveCalendarData: [1, 2, 3],
          loading: true,
        },
        loadLiveCalendarData.fulfilled({ liveCalendarData: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      liveCalendarData: [2, 3, 99],
      loading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(loadLiveCalendarReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
