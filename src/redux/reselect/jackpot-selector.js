import { createSelector } from "@reduxjs/toolkit";

export const getJackpotData = createSelector(
  (state) => state.jackpot?.jackpots,
  (jackpots) => jackpots || [],
);

export const getJackpotIsLoading = createSelector(
  (state) => state.jackpot?.loading,
  (loading) => loading,
);

export const getJackpotByJackpotId = createSelector(
  getJackpotData,
  (_, jackpotId) => jackpotId,
  (jackpots, jackpotId) => jackpots.find((jackpot) => jackpot.id === Number(jackpotId)),
);
