import { createSelector } from "@reduxjs/toolkit";

export const getReferralReferrals = createSelector(
  (state) => state.referral?.referrals,
  (referrals) =>
    referrals
      ? referrals.map(
          (referral) => ({
            key: String(referral.id),
            label: referral.description,
            value: String(referral.id),
          }),
          [],
        )
      : [],
);
