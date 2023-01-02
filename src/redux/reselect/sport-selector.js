import { createSelector } from "@reduxjs/toolkit";

export const getSportsSelector = createSelector(
  (state) => state.sport?.sports,
  (sports) => sports || [],
);
