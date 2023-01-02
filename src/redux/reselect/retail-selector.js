import { createSelector } from "@reduxjs/toolkit";

export const getRetailSelectedPlayerAccountId = createSelector(
  (state) => state.retailAccount?.selectedPlayerAccountId,
  (selectedPlayerAccountId) => selectedPlayerAccountId,
);

export const getRetailSelectedPlayerAccountData = createSelector(
  (state) => state.retailAccount?.selectedPlayerAccountData,
  (selectedPlayerAccountData) => selectedPlayerAccountData,
);

export const getRetailTillDetails = createSelector(
  (state) => state.retailTill?.tillDetails,
  (tillDetails) => tillDetails,
);

export const getRetailPlayerAccountBalance = createSelector(
  (state) => state.retailAccount?.playerAccountBalance,
  (playerAccountBalance) => playerAccountBalance,
);
