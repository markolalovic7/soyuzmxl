import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import securityQuestionReducer, { getInitialState, getSecurityQuestion } from "redux/slices/securityQuestionSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState({ foo: "bar" })).to.be.deep.equal({
      error: null,
      loading: false,
      questions: { foo: "bar" },
    });
  });
  it("should update state when action type is `getSecurityQuestion.pending`", () => {
    expect(securityQuestionReducer({}, getSecurityQuestion.pending())).to.be.deep.equal({
      error: null,
      loading: true,
      questions: null,
    });
  });
  it("should update state when action type is `getSecurityQuestion.rejected`", () => {
    expect(securityQuestionReducer({}, getSecurityQuestion.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `getSecurityQuestion.fulfilled`", () => {
    expect(
      securityQuestionReducer(
        {
          error: "message",
          loading: true,
          questions: [1, 2, 3],
        },
        getSecurityQuestion.fulfilled({ questions: [2, 3, 99] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      questions: [2, 3, 99],
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(securityQuestionReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
