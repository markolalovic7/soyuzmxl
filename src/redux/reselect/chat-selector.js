import { createSelector } from "@reduxjs/toolkit";

export const getChatSessionId = createSelector(
  (state) => state.chat?.sessionId,
  (sessionId) => sessionId,
);
