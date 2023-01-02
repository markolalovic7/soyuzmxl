import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import resultReducer, {
  getInitialState,
  getStandardResultSlice,
  getMainBook,
  getMainBookDetailedEvent,
} from "redux/slices/resultSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" }, "mainBookResults", "detailedEvent")).to.be.deep.equal({
      detailedEvent: "detailedEvent",
      error: null,
      isDetailedLoading: false,
      loading: false,
      mainBookResults: "mainBookResults",
      standardResults: { foo: "bar" },
    });
  });
  it("should update state when action type is `getStandardResultSlice.pending`", () => {
    expect(resultReducer({}, getStandardResultSlice.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `getStandardResultSlice.rejected`", () => {
    expect(resultReducer({}, getStandardResultSlice.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getStandardResultSlice.fulfilled`", () => {
    expect(
      resultReducer(
        {
          error: "message",
          loading: true,
          standardResults: [1, 2, 3],
        },
        getStandardResultSlice.fulfilled({ standardResults: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      standardResults: [2, 3, 99],
    });
  });
  it("should update state when action type is `getMainBook.pending`", () => {
    expect(resultReducer({}, getMainBook.pending())).to.be.deep.equal({
      error: null,
      loading: true,
      mainBookResults: null,
    });
  });
  it("should update state when action type is `getMainBook.rejected`", () => {
    expect(resultReducer({}, getMainBook.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getMainBook.fulfilled`", () => {
    expect(
      resultReducer(
        {
          error: "message",
          loading: true,
          mainBookResults: [1, 2, 3],
        },
        getMainBook.fulfilled({ mainBookResults: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      mainBookResults: [2, 3, 99],
    });
  });
  it("should update state when action type is `getMainBookDetailedEvent.pending`", () => {
    expect(resultReducer({}, getMainBookDetailedEvent.pending())).to.be.deep.equal({
      detailedEvent: null,
      error: null,
      isDetailedLoading: true,
    });
  });
  it("should update state when action type is `getMainBookDetailedEvent.rejected`", () => {
    expect(resultReducer({}, getMainBookDetailedEvent.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      isDetailedLoading: false,
    });
  });
  it("should update state when action type is `getMainBookDetailedEvent.fulfilled`", () => {
    expect(
      resultReducer(
        {
          detailedEvent: [1, 2, 3],
          error: "message",
          isDetailedLoading: true,
        },
        getMainBookDetailedEvent.fulfilled({ detailedEvent: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      detailedEvent: [2, 3, 99],
      error: null,
      isDetailedLoading: false,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(resultReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
