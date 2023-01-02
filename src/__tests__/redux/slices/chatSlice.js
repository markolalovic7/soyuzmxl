import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";
import chatReducer, {
  getInitialState,
  startChatSession,
  loadChatSession,
  assignChatSession,
  endChatSession,
  loadChatSessionMessages,
  postChatMessage,
  clearChatSession,
} from "redux/slices/chatSlice";

describe(path.relative(process.cwd(), __filename), () => {
  it("should return initial state", () => {
    expect(getInitialState("sessionId", "startTime")).to.be.deep.equal({
      customerTimeoutWarning: null,
      endReason: null,
      endTime: null,
      error: null,
      loading: false,
      messages: [],
      sessionId: "sessionId",
      startTime: "startTime",
      startingSession: false,
    });
  });
  it("should update state when action type is `startChatSession.pending`", () => {
    expect(chatReducer({}, startChatSession.pending())).to.be.deep.equal({
      error: null,
      startingSession: true,
    });
  });
  it("should update state when action type is `startChatSession.rejected`", () => {
    expect(chatReducer({}, startChatSession.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      startingSession: false,
    });
  });
  it("should update state when action type is `startChatSession.fulfilled`", () => {
    expect(
      chatReducer(
        {
          error: "message",
          sessionId: "sessionId-1",
          startTime: "startTime-1",
          startingSession: true,
        },
        startChatSession.fulfilled({ sessionId: "sessionId", startTime: "startTime" }),
      ),
    ).to.be.deep.equal({
      error: null,
      sessionId: "sessionId",
      startTime: "startTime",
      startingSession: false,
    });
  });
  it("should update state when action type is `loadChatSession.pending`", () => {
    expect(chatReducer({}, loadChatSession.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `loadChatSession.rejected`", () => {
    expect(chatReducer({}, loadChatSession.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `loadChatSession.fulfilled`", () => {
    expect(
      chatReducer(
        {
          customerTimeoutWarning: "customerTimeoutWarning-1",
          endReason: "endReason-1",
          endTime: "endTime-1",
          error: "message",
          loading: true,
          sessionId: "sessionId-1",
          startTime: "startTime-1",
          startingSession: true,
        },
        loadChatSession.fulfilled({
          customerTimeoutWarning: "customerTimeoutWarning",
          endReason: "endReason",
          endTime: "endTime",
        }),
      ),
    ).to.be.deep.equal({
      customerTimeoutWarning: "customerTimeoutWarning",
      endReason: "endReason",
      endTime: "endTime",
      error: null,
      loading: false,
      sessionId: "sessionId-1",
      startTime: "startTime-1",
      startingSession: true,
    });
  });
  it("should update state when action type is `assignChatSession.pending`", () => {
    expect(chatReducer({}, assignChatSession.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `assignChatSession.rejected`", () => {
    expect(chatReducer({}, assignChatSession.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `endChatSession.pending`", () => {
    expect(chatReducer({}, endChatSession.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `endChatSession.rejected`", () => {
    expect(chatReducer({}, endChatSession.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `endChatSession.fulfilled`", () => {
    expect(
      chatReducer(
        {
          customerTimeoutWarning: "customerTimeoutWarning-1",
          endReason: "endReason-1",
          endTime: "endTime-1",
          error: "message",
          loading: true,
          messages: [1, 3],
          sessionId: "sessionId-1",
          startTime: "startTime-1",
          startingSession: true,
        },
        endChatSession.fulfilled(),
      ),
    ).to.be.deep.equal({
      customerTimeoutWarning: null,
      endReason: null,
      endTime: null,
      error: null,
      loading: false,
      messages: [],
      sessionId: null,
      startTime: null,
      startingSession: true,
    });
  });
  it("should update state when action type is `loadChatSessionMessages.pending`", () => {
    expect(chatReducer({}, loadChatSessionMessages.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `loadChatSessionMessages.rejected`", () => {
    expect(chatReducer({}, loadChatSessionMessages.rejected({ message: "message" }))).to.be.deep.equal({
      error: "message",
      loading: false,
    });
  });
  it("should update state when action type is `loadChatSessionMessages.fulfilled`", () => {
    expect(
      chatReducer(
        {
          error: "message",
          loading: true,
          messages: [1, 3],
        },
        loadChatSessionMessages.fulfilled({ messages: [4, 3] }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      messages: [4, 3],
    });
  });
  it("should update state when action type is `postChatMessage.pending`", () => {
    expect(chatReducer({}, postChatMessage.pending())).to.be.deep.equal({
      error: null,
      loading: true,
    });
  });
  it("should update state when action type is `postChatMessage.rejected`", () => {
    expect(chatReducer({}, postChatMessage.rejected({ message: "message" }))).to.be.deep.equal({
      customerTimeoutWarning: null,
      endReason: null,
      endTime: null,
      error: "message",
      loading: false,
      messages: [],
      sessionId: null,
      startTime: null,
    });
  });
  it("should update state when action type is `postChatMessage.fulfilled`", () => {
    expect(
      chatReducer(
        {
          error: "message",
          loading: true,
          messages: [1, 3],
        },
        postChatMessage.fulfilled({ message: 440 }),
      ),
    ).to.be.deep.equal({
      error: null,
      loading: false,
      messages: [1, 3, 440],
    });
  });
  it("should clear chat when when action `clearChatSession` is dispached", () => {
    expect(
      chatReducer(
        {
          customerTimeoutWarning: "customerTimeoutWarning",
          endReason: "endReason",
          messages: "messages",
          sessionId: "sessionId",
          startTime: "startTime",
        },
        clearChatSession,
      ),
    ).to.be.deep.equal({
      customerTimeoutWarning: null,
      endReason: null,
      messages: [],
      sessionId: null,
      startTime: null,
    });
  });
  it("shouldn't update state when action type is `undefined`", () => {
    expect(chatReducer({}, { type: undefined })).to.be.deep.equal({});
  });
});
