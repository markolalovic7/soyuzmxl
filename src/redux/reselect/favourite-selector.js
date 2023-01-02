import { createSelector } from "@reduxjs/toolkit";

export const getFavouriteData = createSelector(
  (state) => state.favourite?.favourites,
  (favourites) => favourites,
);

export const getFavouriteIsLoading = createSelector(
  (state) => state.favourite?.loading,
  (loading) => loading,
);
