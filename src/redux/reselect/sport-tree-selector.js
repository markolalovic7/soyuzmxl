import { createSelector } from "@reduxjs/toolkit";

export const getSportsTreeSelector = createSelector(
  (state) => state.sportsTree?.sportsTreeData,
  (sportsTreeData) => sportsTreeData?.ept || [],
);
