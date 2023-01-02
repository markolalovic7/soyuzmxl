import { createSelector } from "@reduxjs/toolkit";

import { getAuthLoggedIn } from "./auth-selector";
import { getCmsConfigBrandDetails } from "./cms-selector";

export const getBalance = createSelector(
  getCmsConfigBrandDetails,
  getAuthLoggedIn,
  (state) => state.balance?.balance,
  (state) => state.balance?.singleWalletBalance,
  (configBrandDetails, loggedIn, p8WalletBalance, thirdPartyWalletBalance) => {
    if (!loggedIn || !configBrandDetails) {
      return undefined;
    }
    if (configBrandDetails.data?.singleWalletMode) {
      return thirdPartyWalletBalance;
    }

    return p8WalletBalance;
  },
);
