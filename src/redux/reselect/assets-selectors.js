import { createSelector } from "@reduxjs/toolkit";

export const getCachedAssets = createSelector(
  (state) => state.asset?.cachedAssets,
  (cachedAssets) => cachedAssets || {},
);
