/* eslint-disable no-unused-expressions */
import path from "path";

import { expect } from "chai";
import { describe, it } from "mocha";

import { getJackpotData, getJackpotIsLoading } from "../../../redux/reselect/jackpot-selector";

describe(path.relative(process.cwd(), __filename), () => {
  describe("getJackpotData", () => {
    it("should return `jackpots` from store", () => {
      expect(
        getJackpotData({
          jackpot: {
            jackpots: [
              {
                id: 1,
              },
            ],
          },
        }),
      ).is.deep.equal([{ id: 1 }]);
    });
    it("should return `empty array` when `jackpot` is empty", () => {
      expect(getJackpotData({})).is.deep.equal([]);
      expect(getJackpotData({ jackpot: {} })).is.deep.equal([]);
    });
  });
  describe("getJackpotIsLoading", () => {
    it("should return `loading` from store", () => {
      expect(
        getJackpotIsLoading({
          jackpot: {
            jackpots: [
              {
                id: 1,
              },
            ],
            loading: true,
          },
        }),
      ).is.true;
    });
    it("should return `undefined` when `jackpot` is empty", () => {
      expect(getJackpotIsLoading({})).is.undefined;
      expect(getJackpotIsLoading({ jackpot: {} })).is.undefined;
    });
  });
});
