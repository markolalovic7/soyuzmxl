import { createSelector } from "@reduxjs/toolkit";

export const getMatchRecommendations = createSelector(
  (state) => state.recommender,
  (recommender) => recommender?.matchRecommendations,
);

export const getLeagueRecommendations = createSelector(
  (state) => state.recommender,
  (recommender) => recommender?.leagueRecommendations,
);
