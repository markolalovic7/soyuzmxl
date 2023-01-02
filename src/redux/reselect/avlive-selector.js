import { createSelector } from "@reduxjs/toolkit";

export const getEventAVLive = createSelector(
  (state) => state.avlive.streamHash,
  (_, eventId) => eventId,
  (streamHash, eventId) => streamHash[eventId],
);
