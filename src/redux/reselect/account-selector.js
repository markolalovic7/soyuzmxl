import { createSelector } from "@reduxjs/toolkit";

export const getAccountSelector = createSelector(
  (state) => state.account,
  (account) => account || {},
);

export const getAccountDataSelector = createSelector(getAccountSelector, (account) => account.accountData || {});
