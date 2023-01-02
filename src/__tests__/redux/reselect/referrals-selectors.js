/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getReferralReferrals } from "../../../redux/reselect/referrals-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getReferralReferrals", () => {
    it("should return `referrals` from store", () => {
      expect(
        getReferralReferrals({
          referral: {
            referrals: [
              {
                description: "description",
                id: 1,
              },
            ],
          },
        }),
      ).is.deep.equal([
        {
          key: "1",
          label: "description",
          value: "1",
        },
      ]);
    });
    it("should return `empty array` when `referral` is empty", () => {
      expect(getReferralReferrals({})).is.deep.equal([]);
      expect(getReferralReferrals({ referral: {} })).is.deep.equal([]);
    });
  });
});
